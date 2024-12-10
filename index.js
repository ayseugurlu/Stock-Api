"use strict";
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const express = require("express");
const app = express();

/* ------------------------------------------------------- */
// Required Modules:

// envVariables to process.env:
require("dotenv").config();
const HOST = process.env?.HOST || "127.0.0.1";
const PORT = process.env?.PORT || 8000;

// asyncErrors to errorHandler:
require("express-async-errors");

/* ------------------------------------------------------- */
// Configrations:

// Connect to DB:
const { dbConnection } = require("./src/configs/dbConnection");
dbConnection();

// CORS:
// const cors = require("cors");
// app.use(cors({ origin: "http://localhost:5173" }));

/* ------------------------------------------------------- */
// Middlewares:

// Accept JSON:
app.use(express.json());

// Call static uploadFile:
app.use("/upload", express.static("./upload"));

// Check Authentication:
app.use(require("./src/middlewares/authentication"));

// Run Logger:
// app.use(require("./src/middlewares/logger"));

// res.getModelList():
app.use(require("./src/middlewares/queryHandler"));

/* ------------------------------------------------------- */
// Routes:

// HomePath:
app.all("/", (req, res) => {
  res.send({
    error: false,
    message: "Welcome to Stock Management API",
    documents: {
      swagger: "/documents/swagger",
      redoc: "/documents/redoc",
      json: "/documents/json",
    },
    user: req.user,
  });
});

// Routes:
app.use(require("./src/routes"));

// Not Found
app.use("*", (req, res) => {
  res.status(404).json({
    error: true,
    message: "404 Not Found",
  });
});

/* ------------------------------------------------------- */

// errorHandler:
app.use(require("./src/middlewares/errorHandler"));

// RUN SERVER:
app.listen(PORT, () => console.log(`http://${HOST}:${PORT}`));

/* ------------------------------------------------------- */
// Syncronization (must be in commentLine):
// require('./src/helpers/sync')() // !!! It clear database.
