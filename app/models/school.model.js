module.exports = mongoose => {
    var school = mongoose.Schema(
      {
        schoolID: String,
        name: String,
        address: String,
        city: String,
        admins: [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
        requests: [{type: mongoose.Schema.Types.ObjectId, ref: 'requests'}]
      },
      { timestamps: true }
    );
  
    school.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const School = mongoose.model("schools", school);
    return School;
  };
  