const db = require("../models");
const Request = db.requests;

// Create and Save a new Request
exports.create = (req, res) => {
  // Validate request
  if (!req.body.description) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Request
  /*
  description: String,
        date: String,
        time: String,
        studentLevel: String,
        numberOfStudents: Number,
        status: String,*/
    db.schools.findById(req.body.schoolID, function(err, school) {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Request.",
            });
        }
        else {
            const request = new Request({
                description: req.body.description,
                date: req.body.date,
                time: req.body.time,
                studentLevel: req.body.studentLevel,
                numberOfStudents: req.body.numberOfStudents,
                status: req.body.status,
                school: school._id
            });
            // Save Request in the database
            request
            .save(request)
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.status(500).send({
                message: err.message || "Some error occurred while creating the Request.",
                });
            });

            school.requests.push(request);
            school.save();
        }
    });
};

// Retrieve all Requests from the database.
exports.findAll = (req, res) => {
    const description = req.query.description;
    var condition = description
        ? { description: { $regex: new RegExp(description), $options: "i" } }
        : {};
    
    Request.find(condition)
        .then((data) => {
        res.send(data);
        })
        .catch((err) => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving requests.",
        });
        });
    }

// Find a single Request with an id
exports.findOne = (req, res) => {
    const id = req.body.requestID;

    Request.findById(id)
        .then((data) => {
        if (!data)
            res.status(404).send({ message: "Not found Request with id " + id });
        else res.send(data);
        }
        )
        .catch((err) => {
        res
            .status(500)
            .send({ message: "Error retrieving Request with id=" + id });
        }
        );
};

// Update a Request by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
        message: "Data to update can not be empty!",
        });
    }

    const id = req.params.id;

    Request.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then((data) => {
        if (!data) {
            res.status(404).send({
            message: `Cannot update Request with id=${id}. Maybe Request was not found!`,
            });
        } else res.send({ message: "Request was updated successfully." });
        }
        )
        .catch((err) => {
        res.status(500).send({
            message: "Error updating Request with id=" + id,
        });
        }
        );
}

// Delete a Request with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Request.findByIdAndRemove(id)
        .then((data) => {
        if (!data) {
            res.status(404).send({
            message: `Cannot delete Request with id=${id}. Maybe Request was not found!`,
            });
        } else {
            res.send({
            message: "Request was deleted successfully!",
            });
        }
        }
        )
        .catch((err) => {
        res.status(500).send({
            message: "Could not delete Request with id=" + id,
        });
        }
        );
}

// add offer object to request array of offers
exports.addOffer = (req, res) => {
    const requestID = req.body.requestID;
    const offer = req.body.offer;

    Request.findByIdAndUpdate(requestID, {$push: {offers: offer}}, { useFindAndModify: false })
        .then((data) => {
        if (!data) {
            res.status(404).send({
            message: `Cannot update Request with id=${requestID}. Maybe Request was not found!`,
            });
        } else res.send({ message: "Request was updated successfully." });
        }
        )
        .catch((err) => {
        res.status(500).send({
            message: "Error updating Request with id=" + requestID,
        });
        }
        );
}

// Delete all Requests from the database.
exports.deleteAll = (req, res) => {
    Request.deleteMany({})
        .then((data) => {
        res.send({
            message: `${data.deletedCount} Requests were deleted successfully!`,
        });
        })
        .catch((err) => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while removing all requests.",
        });
        });
}
