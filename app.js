const express = require("express");
const mongoose = require("mongoose");
const { mongoURI } = require("./config/config");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middlewares/errorHandler");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(errorHandler);

mongoose
  .connect(mongoURI)
  .then(() =>
    app.listen(8080, () => console.log("Server running on port 8080")),
  )
  .catch((err) => console.error(err));
