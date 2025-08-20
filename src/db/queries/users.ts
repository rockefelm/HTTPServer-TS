import { db } from "../index.js";
import { NewUser, users } from "../schema.js";
import { eq } from "drizzle-orm";
import { UserNotAuthenticatedError } from "../../api/errors.js";

export async function createUser(user: NewUser) {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  return result;
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