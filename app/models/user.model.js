module.exports = mongoose => {
    var user = mongoose.Schema(
      {
        id: String,
        username: String,
        password: String,
        fullname: String,
        email: String,
        phone: String,
        occupation: String,
        dateOfBirth: String,
        role: String,
        school: String,
        offers: [{type: mongoose.Schema.Types.ObjectId, ref: 'offers'}],
        position: String,
        token: String
      },
      { timestamps: true }
    );
  
    user.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const User = mongoose.model("users", user);
    return User;
  };
  