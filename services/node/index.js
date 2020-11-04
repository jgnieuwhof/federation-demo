const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  interface Node {
    id: ID!
    createdAt: String! @external
  }

  interface CoreUser {
    name: String
    username: String
  }

  extend type User implements Node & CoreUser {
    id: ID! @external
    createdAt: String! @external
    name: String @external
    username: String @external
  }

  extend type Review implements Node {
    id: ID! @external
    createdAt: String! @external
  }

  type Query {
    node(id: ID!): Node
  }
`;

const resolvers = {
  Node: {
    __resolveType(obj) {
      return obj.__typename;
    }
  },
  Query: {
    node(_, input) {
      const [__typename, id] = input.id.split(":");
      return { __typename, id };
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ])
});

server.listen({ port: 4005 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
