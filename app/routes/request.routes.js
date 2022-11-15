module.exports = app => {
  const requests = require("../controllers/request.controller.js");

  var router = require("express").Router();

  // Create a new Request
  router.post("/", requests.create);

  router.post("/:schoolID/request", requests.create);

  // Retrieve all Requests
  router.get("/", requests.findAll);

  // Retrieve a single Request with id
  router.get("/:id", requests.findOne);

  // Update a Request with id
  router.put("/:id", requests.update);

  // Delete a Request with id
  router.delete("/:id", requests.delete);

  // Delete a all requests
  router.delete("/", requests.deleteAll);

  app.use("/api/requests", router);
};
