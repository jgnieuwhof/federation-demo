const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  extend type Query {
    me: User
  }

  interface Node {
    id: ID!
    createdAt: String!
  }

  type User implements Node @key(fields: "id") {
    id: ID!
    createdAt: String!
    name: String
    username: String
  }
`;

const resolvers = {
  Query: {
    me() {
      return users[0];
    },
  },
  User: {
    __resolveReference(object) {
      return users.find((user) => user.id === object.id);
    },
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers,
    },
  ]),
});

server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

const users = [
  {
    id: "1",
    createdAt: "2001-01-01",
    name: "Ada Lovelace",
    username: "@ada",
  },
  {
    id: "2",
    createdAt: "2002-02-02",
    name: "Alan Turing",
    username: "@complete",
  },
];
