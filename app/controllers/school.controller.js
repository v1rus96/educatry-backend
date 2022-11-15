const db = require("../models");
const School = db.schools;

// Create and Save a new School
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  //check if school with same name and city already exists
    School.findOne
    (
        {
            name: req.body.name,
            city: req.body.city
        }, function(err, school) {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the School.",
            });
        }
        else if (school) {
            res.status(400).send({
                message: "School already exists.",
            });
        }
        else {


  var count = 0;
  School.find().count().then((data) => {
    count = data;
    });

  // Create a School
    const school = new School({
    schoolID: "S" + (count + 1),
    name: req.body.name,
    address: req.body.address,
    city: req.body.city
    });

    // Save School in the database
    school
    .save(school)
    .then((data) => {
        res.send(data);
    }
    )
    .catch((err) => {
        res.status(500).send({
        message: err.message || "Some error occurred while creating the School.",
        });
    }
    );

        }
    }
    );
};

// Retrieve all Schools from the database.
exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name
        ? { name: { $regex: new RegExp(name), $options: "i" } }
        : {};
    
    School.find(condition).populate('requests').populate('admins')
        .then((data) => {
        res.send(data);
        })
        .catch((err) => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving schools.",
        });
        });
    }

//add admin to school
exports.addAdmin = (req, res) => {
    db.users.create(req).then((user) => {
        db.schools.findById(req.params.id).then((school) => {
            user.school = school._id;
            user.position = req.body.position;
            school.admins.push(user._id);
            school.save();
            res.send(user);
        });
    }
    ).catch((err) => {
        res.status(500).send({
            message: err.message || "Some error occurred while adding admin to school.",
        });
    });
};

// Find a single School with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    
    School.findById(id).populate('admins').populate({path: 'requests', populate: {path: 'offers', populate: {path: 'volunteer'}}})
        .then((data) => {
        if (!data)
            res.status(404).send({ message: "Not found School with id " + id });
        else res.send(data);
        }
        )
        .catch((err) => {
        res
            .status(500)
            .send({ message: "Error retrieving School with id=" + id });
        }
        );
};

// Update a School by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
        message: "Data to update can not be empty!",
        });
    }
    
    const id = req.params.id;
    
    School.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then((data) => {
        if (!data) {
            res.status(404).send({
            message: `Cannot update School with id=${id}. Maybe School was not found!`,
            });
        } else res.send({ message: "School was updated successfully." });
        }
        )
        .catch((err) => {
        res.status(500).send({
            message: "Error updating School with id=" + id,
        });
        }
        );
}

// Delete a School with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    
    School.findByIdAndRemove(id)
        .then((data) => {
        if (!data) {
            res.status(404).send({
            message: `Cannot delete School with id=${id}. Maybe School was not found!`,
            });
        } else {
            res.send({
            message: "School was deleted successfully!",
            });
        }
        }
        )
        .catch((err) => {
        res.status(500).send({
            message: "Could not delete School with id=" + id,
        });
        }
        );
}

// Delete all Schools from the database.
exports.deleteAll = (req, res) => {
    School.deleteMany({})
        .then((data) => {
        res.send({
            message: `${data.deletedCount} Schools were deleted successfully!`,
        });
        })
        .catch((err) => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while removing all schools.",
        });
        }
        );
}



