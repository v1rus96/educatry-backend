module.exports = app => {
  const schools = require("../controllers/school.controller.js");

  var router = require("express").Router();

  // Create a new School
  router.post("/", schools.create);

  // Retrieve all Schools
  router.get("/", schools.findAll);

  // Retrieve a single School with id
  router.get("/:id", schools.findOne);

  // Update a School with id
  router.put("/:id", schools.update);

  // Delete a School with id
  router.delete("/:id", schools.delete);

  // Delete a all schools
  router.delete("/", schools.deleteAll);

  app.use("/api/schools", router);
};
