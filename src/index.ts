import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses, middlewareMetricsInc } from "./api/middleware.js";
import { handlerServerHits, handlerServerHitsReset } from "./api/serverhits.js";
import { handlerValidateChirp } from "./api/validatechirp.js";

const app = express();
const PORT = 8080;

app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static('./src/app'));
app.use(express.json());
app.get("/admin/metrics", handlerServerHits);
app.post("/admin/reset", handlerServerHitsReset);
app.post("/api/validate_chirp", handlerValidateChirp);
app.get("/api/healthz", handlerReadiness);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});