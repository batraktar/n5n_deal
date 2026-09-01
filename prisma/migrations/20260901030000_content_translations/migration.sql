CREATE TABLE "BuyerProfileTranslation" (
    "id" TEXT NOT NULL,
    "buyerProfileId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "interests" TEXT NOT NULL,
    "industries" TEXT[],
    "preferredLocations" TEXT[],

    CONSTRAINT "BuyerProfileTranslation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AssetTranslation" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "location" TEXT NOT NULL,

    CONSTRAINT "AssetTranslation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "BuyerProfileTranslation_buyerProfileId_locale_key"
ON "BuyerProfileTranslation"("buyerProfileId", "locale");

CREATE INDEX "BuyerProfileTranslation_locale_idx"
ON "BuyerProfileTranslation"("locale");

CREATE UNIQUE INDEX "AssetTranslation_assetId_locale_key"
ON "AssetTranslation"("assetId", "locale");

CREATE INDEX "AssetTranslation_locale_idx"
ON "AssetTranslation"("locale");

ALTER TABLE "BuyerProfileTranslation"
ADD CONSTRAINT "BuyerProfileTranslation_buyerProfileId_fkey"
FOREIGN KEY ("buyerProfileId") REFERENCES "BuyerProfile"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AssetTranslation"
ADD CONSTRAINT "AssetTranslation_assetId_fkey"
FOREIGN KEY ("assetId") REFERENCES "Asset"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
