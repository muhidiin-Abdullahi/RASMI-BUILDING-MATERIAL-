import bcrypt from "bcrypt";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import type { AuthConfig } from "../auth-config";
import {
  AdminUserModel,
  normalizeAdminEmail,
  type AdminRole,
} from "../models/AdminUser";
import { AdminSessionModel } from "../models/AdminSession";

const BCRYPT_ROUNDS = 12;
/** Precomputed hash used for timing-safe failed login when email is unknown. */
const DUMMY_PASSWORD_HASH =
  "$2b$12$F59kHXTOwCXHjaL1Y3sQieuYDumN47/9zGExc1olPCdmKu/Qf9LYu";

export type AccessTokenPayload = {
  sub: string;
  role: AdminRole;
  type: "access";
};

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function signAccessToken(
  config: AuthConfig,
  userId: string,
  role: AdminRole,
): string {
  const payload: AccessTokenPayload = { sub: userId, role, type: "access" };
  return jwt.sign(payload, config.accessSecret, {
    expiresIn: config.accessTtlSeconds,
  });
}

export function verifyAccessToken(
  config: AuthConfig,
  token: string,
): AccessTokenPayload | null {
  try {
    const decoded = jwt.verify(token, config.accessSecret) as AccessTokenPayload;
    if (decoded.type !== "access" || !decoded.sub || !decoded.role) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

export function generateRefreshToken(): string {
  return crypto.randomBytes(48).toString("base64url");
}

export function hashRefreshToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function createSession(
  userId: string,
  refreshToken: string,
  config: AuthConfig,
  meta?: { userAgent?: string; ipAddress?: string },
) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + config.refreshTtlDays);

  await AdminSessionModel.create({
    user: userId,
    refreshTokenHash: hashRefreshToken(refreshToken),
    expiresAt,
    userAgent: meta?.userAgent,
    ipAddress: meta?.ipAddress,
  });
}

export async function rotateRefreshSession(
  refreshToken: string,
  config: AuthConfig,
  meta?: { userAgent?: string; ipAddress?: string },
): Promise<{ userId: string; role: AdminRole; newRefreshToken: string } | null> {
  const hash = hashRefreshToken(refreshToken);
  const session = await AdminSessionModel.findOne({ refreshTokenHash: hash }).exec();
  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await AdminSessionModel.deleteOne({ _id: session._id }).exec();
    }
    return null;
  }

  const user = await AdminUserModel.findById(session.user).exec();
  if (!user || !user.active) {
    await AdminSessionModel.deleteOne({ _id: session._id }).exec();
    return null;
  }

  const newRefreshToken = generateRefreshToken();
  session.refreshTokenHash = hashRefreshToken(newRefreshToken);
  session.expiresAt = new Date(Date.now() + config.refreshTtlDays * 86400000);
  if (meta?.userAgent) session.userAgent = meta.userAgent;
  if (meta?.ipAddress) session.ipAddress = meta.ipAddress;
  await session.save();

  return { userId: user._id.toString(), role: user.role, newRefreshToken };
}

export async function revokeRefreshToken(refreshToken: string) {
  const hash = hashRefreshToken(refreshToken);
  await AdminSessionModel.deleteOne({ refreshTokenHash: hash }).exec();
}

export async function revokeAllSessionsForUser(userId: string) {
  await AdminSessionModel.deleteMany({ user: userId }).exec();
}

export async function authenticateAdminCredentials(
  email: string,
  password: string,
): Promise<{ id: string; role: AdminRole; name: string; email: string } | null> {
  const normalized = normalizeAdminEmail(email);
  const user = await AdminUserModel.findOne({ email: normalized })
    .select("+passwordHash")
    .exec();

  if (!user || !user.active) {
    await verifyPassword(password, user?.passwordHash ?? DUMMY_PASSWORD_HASH);
    return null;
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return null;
  }

  user.lastLoginAt = new Date();
  await user.save();

  return {
    id: user._id.toString(),
    role: user.role,
    name: user.name,
    email: user.email,
  };
}

export function toPublicAdminUser(user: {
  _id: { toString(): string };
  name: string;
  email: string;
  role: AdminRole;
  active: boolean;
  lastLoginAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    active: user.active,
    lastLoginAt: user.lastLoginAt ?? null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
