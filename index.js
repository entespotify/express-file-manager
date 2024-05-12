import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import resolvers from "./src/resolvers.js";
import typeDefs from "./src/schema.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  // dataSources: () => ({
  //   TransactionAPI: new TransactionAPI(),
  // }),
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);

