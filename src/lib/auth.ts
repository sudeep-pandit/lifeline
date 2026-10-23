import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "lifeline_session";
const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET is not configured.");
  }

  return new TextEncoder().encode(secret);
}

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role:
    | "SUPER_ADMIN"
    | "ADMIN"
    | "EDITOR"
    | "ACCOUNTANT"
    | "STAFF";
  isActive: boolean;
  customPermissions: unknown;
};

export async function createSession(user: AuthUser) {
  const token = await new SignJWT({
    userId: user.id,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(getAuthSecret());

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();

  // Expire the same cookie used by createSession().
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
}

export async function getSessionUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;

    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(token, getAuthSecret());

    if (
      !payload.userId ||
      typeof payload.userId !== "string"
    ) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        customPermissions: true,
      },
    });

    if (!user || !user.isActive) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

export async function requireAuth() {
  const user = await getSessionUser();

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  return user;
}

export async function requireRole(
  allowedRoles: AuthUser["role"][],
) {
  const user = await requireAuth();

  if (!allowedRoles.includes(user.role)) {
    throw new Error("FORBIDDEN");
  }

  return user;
}
