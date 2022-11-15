const db = require("../models");
const shortid = require("shortid");
const Offer = db.offers;

// Create and Save a new Offer
exports.create = (req, res) => {
  // Validate request
  if (!req.body.remarks) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  //check if user already made an offer for this request
  Offer.findOne(
    {
      request: req.params.id,
      volunteer: req.body.volunteer,
    },
    function (err, offer) {
      if (err) {
        res.status(500).send({
          message: err.message || "Some error occurred while creating the Offer.",
        });
      } else if (offer) {
        res.status(400).send({
          message: "You already made an offer for this request!",
        });
      } else {

      

  var count = 0;
  Offer.find().count().then((data) => {
    count = data;
    });

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = mm + "/" + dd + "/" + yyyy;

  //find request by id and push offer to request array called offers
  db.requests
    .findById(req.params.id)
    .then((data) => {
      if (!data)
        res
          .status(404)
          .send({ message: "Not found Request with id " + req.params.id });
      else {
        const offer = new Offer({
          offerID: "O" + (count + 1),
          offerStatus: "PENDING",
          remarks: req.body.remarks,
          offerDate: today,
          request: data.id,
          volunteer: req.body.volunteer,
        });

        // Save Offer in the database
        offer
          .save(offer)
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while creating the Offer.",
            });
          });
        data.offers.push(offer);
        data.save();
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Offer.",
      });
    });

      }
    }
  );
};

// Retrieve all Offers from the database.
exports.findAll = (req, res) => {
  const offerID = req.query.offerID;
  var condition = offerID
    ? { offerID: { $regex: new RegExp(offerID), $options: "i" } }
    : {};

  Offer.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving offers.",
      });
    });
};

// Find a single Offer with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Offer.findById(id).populate("request")
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Offer with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: "Error retrieving Offer with id=" + id });
    });
};

// Update a Offer by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  Offer.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Offer with id=${id}. Maybe Offer was not found!`,
        });
      } else res.send({ message: "Offer was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Offer with id=" + id,
      });
    });
};

// Delete a Offer with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Offer.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Offer with id=${id}. Maybe Offer was not found!`,
        });
      } else {
        res.send({
          message: "Offer was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Offer with id=" + id,
      });
    });
};

// Delete all Offers from the database.
exports.deleteAll = (req, res) => {
  Offer.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Offers were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all offers.",
      });
    });
};
