import { describe, expect, it } from "vitest";

import {
  createMarketplaceHref,
  parseAssetSearchParameters,
} from "@/features/assets/asset-search";

describe("parseAssetSearchParameters", () => {
  it("keeps valid filters and pagination", () => {
    const search = parseAssetSearchParameters({
      industry: "Software",
      location: "London, United Kingdom",
      page: "2",
      query: "workflow",
    });

    expect(search).toEqual({
      industry: "Software",
      location: "London, United Kingdom",
      page: 2,
      query: "workflow",
    });
  });

  it("drops malformed filters and defaults the page", () => {
    const search = parseAssetSearchParameters({
      industry: ["Software", "Consumer"],
      page: "not-a-number",
      query: " ",
    });

    expect(search).toEqual({ industry: "Software", page: 1 });
  });
});

describe("createMarketplaceHref", () => {
  it("keeps active filters when moving to another page", () => {
    const href = createMarketplaceHref(
      {
        industry: "Software",
        page: 1,
        query: "workflow",
      },
      2,
    );

    expect(href).toBe("/marketplace?query=workflow&industry=Software&page=2");
  });
});
