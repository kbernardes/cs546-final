const userRoutes = require("./users");
const postRoutes = require("./posts");

const constructorMethod = app => {
  app.use("/users", userRoutes);
  app.use("/posts", postRoutes);

  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;