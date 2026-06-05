import { prisma } from "./index";

export interface CreateOrganizationForUserParams {
  userId: string;
  userName?: string | null;
  userEmail: string;
}
export interface GetAdminUserParams {
  userId: string;
  role: string;
}
/**
 * Creates a personal organization for a new user and assigns them as owner
 */
export async function createOrganizationForUser({
  userId,
  userName,
  userEmail,
}: CreateOrganizationForUserParams) {
  const orgName = `${userName || userEmail}'s Organization`;

  return prisma.$transaction(async (tx) => {
    // Create the organization
    const organization = await tx.organization.create({
      data: {
        name: orgName,
        userId,
      },
    });

    // Link user to organization
    await tx.user.update({
      where: { id: userId },
      data: { organizationId: organization.id },
    });

    // Create owner membership
    await tx.membership.create({
      data: {
        userId,
        organizationId: organization.id,
        role: "OWNER",
      },
    });

    return organization;
  });
}

/**
 * Get organization by ID
 */
export async function getOrganizationById(id: string) {
  return prisma.organization.findUnique({
    where: { id },
    include: { memberships: true },
  });
}

/**
 * Get organizations for a user
 */
export async function getOrganizationsForUser(userId: string) {
  return prisma.organization.findMany({
    where: {
      memberships: {
        some: { userId },
      },
    },
  });
}

/**
 * Get all users with their roles
 */
export async function getAllUsers() {
  return prisma.user.findMany({
    include: {
      memberships: {
        include: {
          organization: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Check if user is admin
 */
export async function getUserWithRole(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      memberships: true,
    },
  });
}
