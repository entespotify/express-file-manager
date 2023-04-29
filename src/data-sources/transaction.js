import { knex } from "knex";

// class TransactionAPI {
//     constructor() {
//         // async getAllTransactions() {
//         //     const response = await this.get('launches');
//         //     return Array.isArray(response)
//         //       ? response.map(launch => this.launchReducer(launch))
//         //       : [];
//         //   }
//     }
//   }

export async function getAllTransactions() {
    const result = await knex.select().from('transactions');
    return result;
}
  
// module.exports = getAllTransactions;