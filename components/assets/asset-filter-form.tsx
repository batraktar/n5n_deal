import type { AssetFilterOptions } from "@/features/assets/asset-types";
import type { AssetSearch } from "@/features/assets/asset-search";

type AssetFilterFormProps = Readonly<{
  filters: AssetFilterOptions;
  search: AssetSearch;
}>;

export async function AssetFilterForm({ filters, search }: AssetFilterFormProps) {
  const t = await getTranslations("filters");

  return (
    <form action="/marketplace" className="asset-filters">
      <label>
        <span>{t("search")}</span>
        <input defaultValue={search.query} name="query" placeholder={t("companyPlaceholder")} type="search" />
      </label>
      <label>
        <span>{t("industry")}</span>
        <select defaultValue={search.industry} name="industry">
          <option value="">{t("allIndustries")}</option>
          {filters.industries.map((industry) => (
            <option key={industry} value={industry}>
              {industry}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>{t("location")}</span>
        <select defaultValue={search.location} name="location">
          <option value="">{t("allLocations")}</option>
          {filters.locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </label>
      <button type="submit">{t("apply")}</button>
    </form>
  );
}
import { getTranslations } from "next-intl/server";
