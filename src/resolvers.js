import {
  getAllTransactions,
  getTransactionByID,
  addNewTransaction,
  updateTransaction,
  deleteTransaction,
  sumOfTransactions,
} from "./services.js";

const resolvers = {
  DateTime: {
    __serialize(value) {
      // Convert the date and time to a format suitable for transport (e.g., ISO string)
      return value.toISOString();
    },
    __parseValue(value) {
      console.log("yes1")
      // Parse the value received from the client (if needed)
      return new Date(value);
    },
    __parseLiteral(ast) {
      // Parse the literal value received in the query (if needed)
      return new Date(ast.value);
    },
  },
  Query: {
    transactions: async (root, args, context, info) =>
      await getAllTransactions(args.utilities),
    transactionByID: async (root, args, context, info) =>
      await getTransactionByID(args.id),
    sumOfTransactions: async () =>
      await sumOfTransactions(),
  },
  Mutation: {
    addNewTransaction: async (root, args, context, info) =>
      await addNewTransaction(
        args.title,
        args.description,
        args.amount,
        args.format
      ),
    updateTransaction: async (root, args, context, info) =>
      await updateTransaction(
        args.id,
        args.title,
        args.description,
        args.amount
      ),
    deleteTransaction: async (root, args, context, info) =>
      await deleteTransaction(args.id),
  },
};

export default resolvers;
