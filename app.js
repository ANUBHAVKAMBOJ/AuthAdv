const express = require("express");
const mongoose = require("mongoose");
const { mongoURI } = require("./config/config");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const healthRoutes = require("./routes/health");
const errorHandler = require("./middlewares/errorHandler");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs")
const YAML = require('yaml')
const file  = fs.readFileSync('./openapi.yaml', 'utf8')
const swaggerDocument = YAML.parse(file)

const app = express();

app.use(express.json());
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/ping", healthRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(errorHandler);

mongoose
  .connect(mongoURI)
  .then(() =>
    app.listen(8080, () => console.log("Server running on port 8080")),
  )
  .catch((err) => console.error(err));
