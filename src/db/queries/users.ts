import { db } from "../index.js";
import { NewUser, users, SecureUser } from "../schema.js";
import { eq } from "drizzle-orm";
import { UserNotAuthenticatedError, NotFoundError } from "../../api/errors.js";
import { getRefreshToken } from "./tokens.js";

export async function createUser(user: NewUser) {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function updateUser(updates: { email: string, hashedPwd: string }, userId: string) {
  await db
    .update(users)
    .set(updates)
    .where(eq(users.id, userId))
  return await getUserById(userId);
}

export async function getUserById(id: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1)
  if (!user) {
    throw new NotFoundError("User not Found");
  }
  return user;
}

export async function resetUsers() {
 await db.delete(users);
 console.log("users table deleted"); 
}

export async function getUserByEmail(email: string) {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (!user[0]) {
    throw new UserNotAuthenticatedError(`User with email: ${email} not Found`);
  }
  return user[0];
}

export async function getUserFromRefreshToken(token: string) {
  const refreshToken = await getRefreshToken(token);
  const userId = refreshToken.userId;
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  return user;
}

export async function updateUserToRed(userId: string) {
  const [updatedUser] = await db
    .update(users)
    .set({ isChirpyRed: true })
    .where(eq(users.id, userId))
    .returning();
  if (updatedUser.isChirpyRed !== true) {
    throw new Error("Unable to Upgrade for unkown reason.");
  }
  return updatedUser;
}