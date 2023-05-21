import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { randomUUID } from "crypto";
const typeDefs = `
  type Transaction {
    id: ID
    title: String
    description: String
    amount: Int
  }

  type Query {
    transactions: [Transaction]
  }
`;
// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const transactions = [
    {
        id: randomUUID(),
        title: "The Awakening",
        description: "Kate Chopin",
        amount: 2500,
    },
    {
        id: randomUUID(),
        title: "The Awakening",
        description: "Kate Chopin",
        amount: 2500,
    },
];
const resolvers = {
    Query: {
        transactions: () => transactions,
    },
};
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});
console.log(`🚀  Server ready at: ${url}`);
