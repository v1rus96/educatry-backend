module.exports = app => {
  const offers = require("../controllers/offer.controller.js");

  var router = require("express").Router();

  // Create a new Offer
  router.post("/", offers.create);

  router.post("/:id/offer", offers.create);

  // Retrieve all Offers
  router.get("/", offers.findAll);

  // Retrieve a single Offer with id
  router.get("/:id", offers.findOne);

  // Update a Offer with id
  router.put("/:id", offers.update);

  // Delete a Offer with id
  router.delete("/:id", offers.delete);

  // Delete a all offers
  router.delete("/", offers.deleteAll);
 
  app.use("/api/offers", router);
};
