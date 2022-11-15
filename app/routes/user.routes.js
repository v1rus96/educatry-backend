module.exports = app => {
  const users = require("../controllers/user.controller.js");

  var router = require("express").Router();

  // Create a new User
  router.post("/", users.create);

  router.post("/:schoolID/admin", users.create);

  // Retrieve all Users
  router.get("/", users.findAll);

  // Retrieve a single User with id
  router.get("/:id", users.findOne);

  // Update a User with id
  router.put("/:id", users.update);

  // Delete a User with id
  router.delete("/:id", users.delete);

  // Delete a all users
  router.delete("/", users.deleteAll);

  //authentification
  router.post("/login", users.authenticate);

  //get current user
  router.get("/current", users.getCurrentUser);

  app.use("/api/users", router);
};
