type ValidationTranslator = (key: string) => string;

export function translateValidationMessage(
  translate: ValidationTranslator,
  message: string | undefined,
): string | undefined {
  if (message === undefined) {
    return undefined;
  }

  const knownKeys = new Set([
    "assetTitleMin",
    "assetTitleMax",
    "descriptionMin",
    "descriptionMax",
    "industryRequired",
    "industryMax",
    "valuationPositive",
    "currencyCode",
    "locationRequired",
    "locationMax",
    "revenuePositive",
    "budgetPositive",
    "interestsMin",
    "interestsMax",
    "industryList",
    "locationList",
    "budgetOrder",
    "messageMin",
    "messageMax",
    "buyerRequired",
    "recordRequired",
  ]);

  return knownKeys.has(message) ? translate(message) : message;
}
