import { db } from "../index.js";
import { NewChirp, chirps } from "../schema.js";
import { eq, sql, asc, desc } from "drizzle-orm";

export async function createChirp(chirp: NewChirp) {
    const [result] = await db
        .insert(chirps)
        .values(chirp)
        .onConflictDoNothing()
        .returning();
    return result;
}

export async function getAllChirps(orderedBy: string) {
    const result = await db
        .select()
        .from(chirps)
        .orderBy(orderedBy === "DESC" ? desc(chirps.createdAt) : asc(chirps.createdAt));
    return result;

}

export async function getChirp(chirpId: string) {
    const [result] = await db
        .select()
        .from(chirps)
        .where(eq(chirps.id, chirpId));
    return result;
}

export async function deleteChirp(chirpId: string) {
    const [result] = await db
        .delete(chirps)
        .where(eq(chirps.id, chirpId))
        .returning()
    return result;
}

export async function getChirpByUserId(userId: string, orderedBy: string) {
    const result = await db
        .select()
        .from(chirps)
        .where(eq(chirps.userId, userId))
        .orderBy(orderedBy === "DESC" ? desc(chirps.createdAt) : asc(chirps.createdAt));
    return result;
}