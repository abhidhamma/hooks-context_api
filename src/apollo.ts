import ApolloClient, { Operation } from 'apollo-boost';

const client = new ApolloClient({
  clientState: {
    defaults: {
      auth: {
        __typename: 'Auth',
        isLoggedIn: Boolean(localStorage.getItem('jwt')),
      },
    },
    resolvers: {
      Mutation: {
        logUserIn: (_, { token }, { cache }) => {
          localStorage.setItem('jwt', token);
          cache.writeDate({
            data: {
              auth: {
                __typename: 'Auth',
                isLoggedIn: true,
              },
            },
          });
          return null;
        },
        logUserOut: (_, __, { cache }) => {
          localStorage.removeItem('jwt');
          cache.writeDate({
            __typename: 'Auth',
            isLoggedIn: false,
          });
          return null;
        },
      },
    },
  },
  request: async (operation: Operation) => {
    await operation.setContext({
      headers: {
        'X-JWT': localStorage.getItem('jwt') || '',
      },
    });
  },
  uri: 'http://localhost:4000/graphql',
});

export default client;
