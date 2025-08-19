import { loadEnvFile } from 'node:process';
loadEnvFile();

type APIConfig = {
    fileServerHits: number;
    dbURL: string;
};

export const config: APIConfig = {
    fileServerHits: 0,
    dbURL: envOrThrow("DB_URL")
}

function envOrThrow(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is required`);
  }
  return value;
}