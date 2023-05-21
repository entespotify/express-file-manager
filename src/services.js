import { format } from "date-fns";
import { v4 as uuid } from "uuid";

import { MatchOperatorMapping } from "./types.js";
import { dateFormat } from "./constants.js";

import mysql from "./connection.js";

export async function getAllTransactions(args) {
  let result;
  if (args) {
    const { filter, sort, search } = args;
    let query = mysql("transactions");
    if (search) {
      query = query.orWhereILike("title", `%${search.searchTerm}%`);
      query = query.orWhereILike("description", `%${search.searchTerm}%`);
    }
    if (filter) {
      query = query.where(
        "amount",
        MatchOperatorMapping.get(filter.filterBy),
        filter.amount
      );
    }
    if (sort) {
      query = query.orderBy("amount", sort.order);
    }
    result = await query.select("*");
  } else {
    result = await mysql("transactions").select("*");
  }
  return result;
}

export async function getTransactionByID(id) {
  const result = await mysql("transactions").select("*").where("id", id);
  return result;
}

export async function addNewTransaction(title, description, amount) {
  const formattedDateTime = format(new Date(), dateFormat);
  const id=uuid();
  await mysql("transactions").insert({
    title: title,
    id,
    description: description,
    amount: amount,
    created_at: formattedDateTime,
  });
  const result = getTransactionByID(id);
  return result;
}

export async function updateTransaction(id, title, description, amount) {
  await mysql("transactions")
    .where("id", id)
    .update({ title: title, id: id, description: description, amount: amount });
  const result = getTransactionByID(id);
  return result;
}

export async function deleteTransaction(id) {
  const result = getTransactionByID(id);
  await mysql("transactions").where("id", id).del();
  return result;
}

export async function filterTransactionByAmount(amount, filterBy) {
  const result = await mysql("transactions")
    .select("*")
    .where("amount", MatchOperatorMapping.get(filterBy), amount);
  return result;
}

export async function sortTransactionByAmount(order) {
  const result = await mysql("transactions")
    .select("*")
    .orderBy("amount", order);
  return result;
}

export async function sumOfTransactions() {
  const result = await mysql("transactions").sum("amount");
  return result[0]["sum(`amount`)"];
}
