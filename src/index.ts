import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses, middlewareMetricsInc } from "./api/middleware.js";
import { handlerServerHits, handlerServerHitsReset } from "./api/serverhits.js";

const app = express();
const PORT = 8080;

app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static('./src/app'));
app.use("/api/metrics", handlerServerHits);
app.use("/api/reset", handlerServerHitsReset);
app.get("/api/healthz", handlerReadiness);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});