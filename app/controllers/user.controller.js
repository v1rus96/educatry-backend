const db = require("../models");
const User = db.users;

// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  if (!req.body.email) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  var count = 0;
  User.find().count().then((data) => {
    count = data;
    });

  //check if user exists
    User.findOne
    ({email
        : req.body.email
    }, function(err, user) {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the User.",
            });
        }
        else if (user) {
            res.status(400).send({
                message: "User already exists.",
            });
        }
        else {

            

  // Create a User
  if(req.body.role == "Volunteer") {
    const user = new User({
        volunteerID: "V" + (count+1),
        username: req.body.username,
        password: req.body.password,
        fullname: req.body.fullname,
        email: req.body.email,
        phone: req.body.phone,
        role: req.body.role,
        // token: req.body.token,
        occupation: req.body.occupation,
        dateOfBirth: req.body.dateOfBirth,
      });
      user
      .save(user)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Some error occurred while creating the User.",
        });
      });
  } else {
    db.schools.findById(req.params.schoolID) 
        .then((data) => {
            const user = new User({
                adminID: "A" + (count+1),
                username: req.body.username,
                password: req.body.password,
                fullname: req.body.fullname,
                email: req.body.email,
                phone: req.body.phone,
                role: req.body.role,
                // token: req.body.token,
                school: data._id,
                position: req.body.position,
                staffID: req.body.staffID,
              });
              user
              .save(user)
              .then((data) => {
                res.send(data);
              })
              .catch((err) => {
                res.status(500).send({
                  message: err.message || "Some error occurred while creating the User.",
                });
              });
            data.admins.push(user._id);
            data.save();
        }
        ).catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the User.",
            });
        }
        );
    }

        }
    });
};

//authenticate
exports.authenticate = (req, res) => {
    User.findOne
    ({email
        : req.body.email
    }, function(err, user) {
        if (err) throw err;
        if (!user) {
            res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
            // check if password matches
            if(user.password === req.body.password) {
              
                    // if user is found and password is right create a token
                    var token = user.token;
                    res.setHeader('Authorization', 'Bearer ' + token);
                    
                    //return user without password
                    user.password = undefined;
                    res.json(user);
                    

                } else {
                    res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
                }
        }
    });
};

//get current user
exports.getCurrentUser = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    console.log(token);
    if (token) {
        User.findById("6373738136d3037d345f7fff").then((user) => {
            res.json({success: true, msg: 'Welcome in the member area ' + user.username + '!'});
             }).catch((err) => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving users.",
                });
            });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
};

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
    const email = req.query.email;
    var condition = email
        ? { email: { $regex: new RegExp(email), $options: "i" } }
        : {};
    
    User.find(condition)
        .then((data) => {
        res.send(data);
        })
        .catch((err) => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving users.",
        });
        });
    };

// Find a single User with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    
    User.findById(id)
        .then((data) => {
        if (!data)
            res.status(404).send({ message: "Not found User with id " + id });
        else res.send(data);
        }
        )
        .catch((err) => {
        res
            .status(500)
            .send({ message: "Error retrieving User with id=" + id });
        }
        );
    };

// Update a User by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
        message: "Data to update can not be empty!",
        });
    }
    
    const id = req.params.id;
    
    User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then((data) => {
        if (!data) {
            res.status(404).send({
            message: `Cannot update User with id=${id}. Maybe User was not found!`,
            });
        } else res.send({ message: "User was updated successfully." });
        })
        .catch((err) => {
        res.status(500).send({
            message: "Error updating User with id=" + id,
        });
        });
    }

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    
    User.findByIdAndRemove(id)
        .then((data) => {
        if (!data) {
            res.status(404).send({
            message: `Cannot delete User with id=${id}. Maybe User was not found!`,
            });
        } else {
            res.send({
            message: "User was deleted successfully!",
            });
        }
        })
        .catch((err) => {
        res.status(500).send({
            message: "Could not delete User with id=" + id,
        });
        });
    }

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
    User.deleteMany({})
        .then((data) => {
        res.send({
            message: `${data.deletedCount} Users were deleted successfully!`,
        });
        })
        .catch((err) => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while removing all users.",
        });
        });
    }



