import { UserRole, UserStatus } from "@/generated/prisma/client";
import { describe, expect, it } from "vitest";

import { RoleAccessDeniedError, SuspendedUserError, requireActiveRole } from "@/features/auth/authorization";

describe("requireActiveRole", () => {
  it("denies non-admin actors from admin routes", () => {
    expect(() => requireActiveRole(
      { role: UserRole.BUYER, status: UserStatus.ACTIVE },
      UserRole.ADMIN,
    )).toThrow(RoleAccessDeniedError);
  });

  it("allows an active admin actor", () => {
    expect(() => requireActiveRole(
      { role: UserRole.ADMIN, status: UserStatus.ACTIVE },
      UserRole.ADMIN,
    )).not.toThrow();
  });

  it("denies suspended users from protected actions", () => {
    expect(() => requireActiveRole(
      { role: UserRole.SELLER, status: UserStatus.SUSPENDED },
      UserRole.SELLER,
    )).toThrow(SuspendedUserError);
  });
});
