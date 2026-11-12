import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const router : Router = Router();

const swaggerDocument = JSON.parse(
  readFileSync(resolve("swagger-output.json"), "utf8")
);

router.use(
  "/",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

export default router;