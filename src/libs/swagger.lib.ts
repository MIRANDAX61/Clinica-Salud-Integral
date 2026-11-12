import swaggerAutogen from "swagger-autogen";
import { fileURLToPath } from "node:url";

const doc = {
  info: {
    title: "API de Clínica Salud Integral",
    description: "Documentación automática generada para la clínica",
    version: "1.0.0"
  },
  servers: [
    { url: "http://localhost:3000" }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  }
};

const outputFile = fileURLToPath(
  new URL("../../swagger-output.json", import.meta.url)
);

const endpointsFiles = [
  fileURLToPath(
    new URL("../../dist/src/index.js", import.meta.url)
  ).replace(/\\/g, "/")
];

const result = await swaggerAutogen({
  openapi: "3.0.0",
  autoHeaders: false
})(
  outputFile,
  endpointsFiles,
  doc
);

if (!result || !result.success) {
  throw new Error("No se pudo generar la documentación");
}

console.log("Documentación generada correctamente");