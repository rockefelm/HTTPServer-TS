import { describe, it, expect, beforeAll } from "vitest";
import { makeJWT, validateJWT } from "./auth.js";

describe("JWT validation checks", () => {
    const correctSecret = "good-secret";
    const incorrectSecret = "bad-secret";
    const userId1 = "number1";
    const expiresIn1 = 3600;
    const expiresIn2 = -1;
    let token1: string;
    let expiredToken: string;

    beforeAll( () => {
        token1 = makeJWT(userId1, expiresIn1, correctSecret);
        expiredToken = makeJWT(userId1, expiresIn2, correctSecret);
    });

    it("should return true for valid JWT", () => {
        const result = validateJWT(token1, correctSecret);
        expect(result).toBe(userId1);
    });
    it("should throw an error for being expired", () => {
        expect(() => validateJWT(expiredToken, correctSecret)).toThrow("Invalid or expired token");
    })
    it("should throw an error for using the wrong secret", () => {
        expect(() => validateJWT(token1, incorrectSecret)).toThrow("Invalid or expired token");
    });
});