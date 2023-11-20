const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const mongoose = require("mongoose");

/**
 * import routes
 */
const usersRouter = require("./routes/user");

/**
 * initialise app
 */
const app = express();

/**
 * middlewares
 */
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

/**
 * routes
 */
app.use(`${process.env.API}/user`, usersRouter);

/**
 * connecting to the database
 */
mongoose
  .connect(process.env.DB)
  .then((res) => console.log("DB connected successfully"))
  .catch((err) => {
    console.error("could not connect to database");
  });

app.listen(process.env.PORT, (res) => {
  console.log(
    `Server running on http://localhost:${process.env.PORT}${process.env.API}`
  );
});
