import { loadEnvFile } from 'node:process';
import type { MigrationConfig } from "drizzle-orm/migrator";
loadEnvFile();

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

type Config = {
    api: {
        fileServerHits: number };
    db: {
        url: string;
        migrationConfig: MigrationConfig;
    };
};

export const config: Config = {
    api: {
        fileServerHits: 0,
    },
    db: {
        url: envOrThrow("DB_URL"),
        migrationConfig
    }
}

function envOrThrow(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is required`);
  }
  return value;
}
