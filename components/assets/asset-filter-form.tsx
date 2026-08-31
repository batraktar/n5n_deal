import type { AssetFilterOptions } from "@/features/assets/asset-types";
import type { AssetSearch } from "@/features/assets/asset-search";

type AssetFilterFormProps = Readonly<{
  filters: AssetFilterOptions;
  search: AssetSearch;
}>;

export function AssetFilterForm({ filters, search }: AssetFilterFormProps) {
  return (
    <form action="/marketplace" className="asset-filters">
      <label>
        <span>Search</span>
        <input defaultValue={search.query} name="query" placeholder="Company, industry, or keyword" type="search" />
      </label>
      <label>
        <span>Industry</span>
        <select defaultValue={search.industry} name="industry">
          <option value="">All industries</option>
          {filters.industries.map((industry) => (
            <option key={industry} value={industry}>
              {industry}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>Location</span>
        <select defaultValue={search.location} name="location">
          <option value="">All locations</option>
          {filters.locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </label>
      <button type="submit">Apply filters</button>
    </form>
  );
}
