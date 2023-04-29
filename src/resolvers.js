import { randomUUID } from "crypto";
import { getAllTransactions } from "./data-sources/transaction";

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

export const transactionResolvers = {
    Query: {
      transactions: async() => await getAllTransactions(),
    },
  };

module.exports = transactionResolvers;
