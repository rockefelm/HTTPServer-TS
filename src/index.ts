import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses, middlewareMetricsInc, errorMiddleWare } from "./api/middleware.js";
import { handlerServerHits } from "./api/serverhits.js";
import { handlerServerReset } from "./api/reset.js";
import { handlerChirp, handlerDeleteChirp, handlerGetAllChirps, handlerGetChirp } from "./api/chirp.js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { config } from "./config.js";
import { handlerCreateUser } from "./api/createuser.js";
import { loginHandler } from "./api/login.js"
import { handlerRefreshToken } from "./api/refresh.js";
import { handlerRevokeToken } from "./api/revoke.js";
import { handlerUpdateUser } from "./api/updateuser.js";

const app = express();
const PORT = 8080;
const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

app.use(middlewareLogResponses);
app.use(express.json());
app.use("/app", middlewareMetricsInc, express.static('./src/app'));

app.get("/api/healthz", (req, res, next) => {
  Promise.resolve(handlerReadiness(req, res)).catch(next);
});
app.get("/admin/metrics", (req, res, next) => {
  Promise.resolve(handlerServerHits(req, res)).catch(next);
});
app.post("/admin/reset", (req, res, next) => {
  Promise.resolve(handlerServerReset(req, res)).catch(next);
});
app.post("/api/users", (req, res, next) => {
  Promise.resolve(handlerCreateUser(req, res)).catch(next);
});
app.put("/api/users", (req, res, next) => {
  Promise.resolve(handlerUpdateUser(req, res)).catch(next);
});
app.get("/api/chirps/:chirpId", (req, res, next) => {
  Promise.resolve(handlerGetChirp(req, res)).catch(next);
});
app.delete("/api/chirps/:chirpId", (req, res, next) => {
  Promise.resolve(handlerDeleteChirp(req, res)).catch(next);
});
app.get("/api/chirps", (req, res, next) => {
  Promise.resolve(handlerGetAllChirps(req, res)).catch(next);
});
app.post("/api/chirps", (req, res, next) => {
  Promise.resolve(handlerChirp(req, res)).catch(next);
});
app.post("/api/login", (req, res, next) => {
  Promise.resolve(loginHandler(req, res)).catch(next);
});
app.post("/api/refresh", (req, res, next) => {
  Promise.resolve(handlerRefreshToken(req, res)).catch(next);
});
app.post("/api/revoke", (req, res, next) => {
  Promise.resolve(handlerRevokeToken(req, res)).catch(next)
});

app.use(errorMiddleWare);


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});