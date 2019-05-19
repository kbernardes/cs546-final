const userRoutes = require("./users");
const forumRoutes = require("./forums");

const constructorMethod = app => {
  app.use("/users", userRoutes);
  app.use("/forums", forumRoutes);

  app.use("*", (req, res) => {
    res.render("/forums");
  });
};

module.exports = constructorMethod;