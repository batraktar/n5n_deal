import { z } from "zod";

export type AssetSearch = Readonly<{
  industry?: string;
  location?: string;
  page: number;
  query?: string;
}>;

type SearchParameterValue = string | readonly string[] | undefined;

export type AssetSearchParameters = Readonly<Record<string, SearchParameterValue>>;

const textParameterSchema = z.string().trim().max(80);
const pageParameterSchema = z.coerce.number().int().positive().max(1000);

function firstParameterValue(value: SearchParameterValue): string | undefined {
  return typeof value === "string" ? value : value?.[0];
}

function readTextParameter(value: SearchParameterValue): string | undefined {
  const parsed = textParameterSchema.safeParse(firstParameterValue(value));

  return parsed.success && parsed.data.length > 0 ? parsed.data : undefined;
}

function readPageParameter(value: SearchParameterValue): number {
  const parsed = pageParameterSchema.safeParse(firstParameterValue(value));

  return parsed.success ? parsed.data : 1;
}

export function parseAssetSearchParameters(parameters: AssetSearchParameters): AssetSearch {
  const industry = readTextParameter(parameters["industry"]);
  const location = readTextParameter(parameters["location"]);
  const query = readTextParameter(parameters["query"]);

  return {
    page: readPageParameter(parameters["page"]),
    ...(industry === undefined ? {} : { industry }),
    ...(location === undefined ? {} : { location }),
    ...(query === undefined ? {} : { query }),
  };
}

export function createMarketplaceHref(search: AssetSearch, page: number): string {
  const parameters = new URLSearchParams();

  if (search.query !== undefined) {
    parameters.set("query", search.query);
  }

  if (search.industry !== undefined) {
    parameters.set("industry", search.industry);
  }

  if (search.location !== undefined) {
    parameters.set("location", search.location);
  }

  if (page > 1) {
    parameters.set("page", String(page));
  }

  const serialized = parameters.toString();

  return serialized.length > 0 ? `/marketplace?${serialized}` : "/marketplace";
}
