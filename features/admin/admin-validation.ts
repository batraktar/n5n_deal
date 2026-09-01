import { z } from "zod";

export const adminRoleFilterOptions = ["ALL", "BUYER", "SELLER", "ADMIN"] as const;
export const adminUserStatusOptions = ["ACTIVE", "SUSPENDED"] as const;
export const adminAssetStatusOptions = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;

const requiredId = z.string().trim().min(1, "A record identifier is required.").max(64);

const adminUserStatusFormSchema = z.object({
  status: z.enum(adminUserStatusOptions),
  userId: requiredId,
});

const adminAssetStatusFormSchema = z.object({
  assetId: requiredId,
  status: z.enum(adminAssetStatusOptions),
});

const adminUserSearchSchema = z.object({
  query: z.string().trim().max(100).optional(),
  role: z.enum(adminRoleFilterOptions).default("ALL"),
  status: z.enum(["ALL", ...adminUserStatusOptions]).default("ALL"),
});

const adminAssetSearchSchema = z.object({
  query: z.string().trim().max(100).optional(),
  status: z.enum(["ALL", ...adminAssetStatusOptions]).default("ALL"),
});

export type AdminUserSearch = z.infer<typeof adminUserSearchSchema>;
export type AdminAssetSearch = z.infer<typeof adminAssetSearchSchema>;

export type AdminActionState = Readonly<{
  kind: "idle" | "validation_error" | "error" | "success";
  message: string | null;
}>;

export const initialAdminActionState: AdminActionState = { kind: "idle", message: null };

function readFormField(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  return typeof value === "string" ? value : undefined;
}

function readSearchField(
  searchParams: Readonly<Record<string, string | readonly string[] | undefined>>,
  key: string,
): string | undefined {
  const value = searchParams[key];
  return typeof value === "string" ? value : undefined;
}

export function parseAdminUserStatusFormData(formData: FormData) {
  return adminUserStatusFormSchema.safeParse({
    status: readFormField(formData, "status"),
    userId: readFormField(formData, "userId"),
  });
}

export function parseAdminAssetStatusFormData(formData: FormData) {
  return adminAssetStatusFormSchema.safeParse({
    assetId: readFormField(formData, "assetId"),
    status: readFormField(formData, "status"),
  });
}

export function parseAdminUserSearch(
  searchParams: Readonly<Record<string, string | readonly string[] | undefined>>,
): AdminUserSearch {
  const result = adminUserSearchSchema.safeParse({
    query: readSearchField(searchParams, "query"),
    role: readSearchField(searchParams, "role"),
    status: readSearchField(searchParams, "status"),
  });

  return result.success ? result.data : { role: "ALL", status: "ALL" };
}

export function parseAdminAssetSearch(
  searchParams: Readonly<Record<string, string | readonly string[] | undefined>>,
): AdminAssetSearch {
  const result = adminAssetSearchSchema.safeParse({
    query: readSearchField(searchParams, "query"),
    status: readSearchField(searchParams, "status"),
  });

  return result.success ? result.data : { status: "ALL" };
}
