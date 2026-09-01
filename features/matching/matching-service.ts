export type MatchBuyerProfile = Readonly<{
  budgetMax: number | null;
  budgetMin: number | null;
  currency: string;
  industries: readonly string[];
  interests: string;
  preferredLocations: readonly string[];
}>;

export type MatchAsset = Readonly<{
  currency: string;
  description: string;
  industry: string;
  location: string;
  title: string;
  valuation: number;
}>;

export type AssetMatch = Readonly<{
  reasons: readonly string[];
  score: number;
}>;

const matchWeights = {
  budget: 25,
  industry: 35,
  interests: 20,
  location: 20,
} as const;

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase();
}

function includesPreference(preferences: readonly string[], value: string): boolean {
  const normalizedValue = normalize(value);
  return preferences.some((preference) => normalize(preference) === normalizedValue);
}

function includesLocationPreference(preferences: readonly string[], location: string): boolean {
  const normalizedLocation = normalize(location);
  return preferences.some((preference) => {
    const normalizedPreference = normalize(preference);
    return normalizedLocation === normalizedPreference
      || normalizedLocation.includes(normalizedPreference)
      || normalizedPreference.includes(normalizedLocation);
  });
}

function hasCompatibleBudget(profile: MatchBuyerProfile, asset: MatchAsset): boolean {
  if (normalize(profile.currency) !== normalize(asset.currency)) {
    return false;
  }

  if (profile.budgetMin !== null && asset.valuation < profile.budgetMin) {
    return false;
  }

  if (profile.budgetMax !== null && asset.valuation > profile.budgetMax) {
    return false;
  }

  return profile.budgetMin !== null || profile.budgetMax !== null;
}

function hasInterestMatch(interests: string, asset: MatchAsset): boolean {
  const searchableContent = normalize(`${asset.title} ${asset.description}`);
  const keywords = normalize(interests)
    .split(/[^\p{L}\p{N}]+/u)
    .filter((keyword) => keyword.length >= 4);

  return keywords.some((keyword) => searchableContent.includes(keyword));
}

export function calculateAssetMatch(profile: MatchBuyerProfile, asset: MatchAsset): AssetMatch {
  const reasons: string[] = [];
  let score = 0;

  if (includesPreference(profile.industries, asset.industry)) {
    score += matchWeights.industry;
    reasons.push("Same industry");
  }

  if (hasCompatibleBudget(profile, asset)) {
    score += matchWeights.budget;
    reasons.push("Budget compatible");
  }

  if (includesLocationPreference(profile.preferredLocations, asset.location)) {
    score += matchWeights.location;
    reasons.push("Preferred location");
  }

  if (hasInterestMatch(profile.interests, asset)) {
    score += matchWeights.interests;
    reasons.push("Matches acquisition interests");
  }

  return { reasons, score };
}
