import { UserStatus } from "@/generated/prisma/client";

import type { UserRole } from "@/generated/prisma/client";

type ProtectedActor = Readonly<{
  role: UserRole;
  status: UserStatus;
}>;

export class RoleAccessDeniedError extends Error {
  override readonly name = "RoleAccessDeniedError";

  constructor(requiredRole: UserRole) {
    super(`This action requires the ${requiredRole} role.`);
  }
}

export class SuspendedUserError extends Error {
  override readonly name = "SuspendedUserError";

  constructor() {
    super("Suspended users cannot perform protected actions.");
  }
}

export function requireActiveRole(actor: ProtectedActor, requiredRole: UserRole): void {
  if (actor.status === UserStatus.SUSPENDED) {
    throw new SuspendedUserError();
  }

  if (actor.role !== requiredRole) {
    throw new RoleAccessDeniedError(requiredRole);
  }
}
