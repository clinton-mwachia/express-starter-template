const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const mongoose = require("mongoose");

/**
 * import routes
 */
const usersRouter = require("./routes/user");
const todosRouter = require("./routes/todo");

/**
 * custom middlewares
 */
const NotFound = require("./helpers/notFound");
const auth = require("./helpers/auth");
const errorHandler = require("./helpers/error-handler");

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
app.use(auth());
app.use(errorHandler);

/**
 * routes
 */
app.use(`${process.env.API}/user`, usersRouter);
app.use(`${process.env.API}/todo`, todosRouter);

/**
 * connecting to the database
 */
mongoose
  .connect(process.env.DB)
  .then((res) => console.log("DB connected successfully"))
  .catch((err) => {
    console.error("could not connect to database");
  });

app.use(NotFound);

app.listen(process.env.PORT, (res) => {
  console.log(
    `Server running on http://localhost:${process.env.PORT}${process.env.API}`
  );
});
