import { z } from "zod";

export const sellerBuyerBudgetOptions = ["ALL", "COMPATIBLE", "INCOMPATIBLE"] as const;

export type SellerBuyerBudgetFilter = (typeof sellerBuyerBudgetOptions)[number];

export type SellerBuyerSearch = Readonly<{
  budget: SellerBuyerBudgetFilter;
  industry?: string;
  location?: string;
  query?: string;
}>;

type SearchParameterValue = string | readonly string[] | undefined;

export type SellerBuyerSearchParameters = Readonly<Record<string, SearchParameterValue>>;

const textParameterSchema = z.string().trim().max(80);
const budgetParameterSchema = z.enum(sellerBuyerBudgetOptions);

function firstParameterValue(value: SearchParameterValue): string | undefined {
  return typeof value === "string" ? value : value?.[0];
}

function readTextParameter(value: SearchParameterValue): string | undefined {
  const parsed = textParameterSchema.safeParse(firstParameterValue(value));
  return parsed.success && parsed.data.length > 0 ? parsed.data : undefined;
}

function readBudgetParameter(value: SearchParameterValue): SellerBuyerBudgetFilter {
  const parsed = budgetParameterSchema.safeParse(firstParameterValue(value));
  return parsed.success ? parsed.data : "ALL";
}

export function parseSellerBuyerSearchParameters(parameters: SellerBuyerSearchParameters): SellerBuyerSearch {
  const budget = readBudgetParameter(parameters["budget"]);
  const industry = readTextParameter(parameters["industry"]);
  const location = readTextParameter(parameters["location"]);
  const query = readTextParameter(parameters["query"]);

  return {
    budget,
    ...(industry === undefined ? {} : { industry }),
    ...(location === undefined ? {} : { location }),
    ...(query === undefined ? {} : { query }),
  };
}
