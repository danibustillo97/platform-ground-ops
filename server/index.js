const express = require("express");
const next = require("next");
const { PORT } = require("./config/config");
const errorHandler = require("./middlewares/errorHandler");
const logger = require("./middlewares/logger");

function appServer() {
  const dev = process.env.NODE_ENV !== "production";
  const nextApp = next({ dev });
  const handle = nextApp.getRequestHandler();

  nextApp.prepare().then(() => {
    const appServer = express();

    // Middleware
    appServer.use(express.json());
    appServer.use(express.urlencoded({ extended: true }));
    appServer.use(logger);

    // Rutas de Next.js
    appServer.all("*", (req, res) => handle(req, res));
    appServer.get("res/maintance", (req, res) => handle(req, res));

    // Manejo de errores
    appServer.use(errorHandler);

    // Iniciar servidor
    appServer
      .listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      })
      .on("error", (err) => {
        console.error("Error starting server:", err);
      });
  });
}

module.exports = appServer; // Exporta la función appServer
