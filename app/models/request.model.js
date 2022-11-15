module.exports = mongoose => {
    var request = mongoose.Schema(
      {
        requestID: String,
        description: String,
        date: String,
        time: String,
        studentLevel: String,
        numberOfStudents: Number,
        status: String,
        resourceType: String,
        resourceQuantity: Number,
        offers: [{type: mongoose.Schema.Types.ObjectId, ref: 'offers'}]
      },
      { timestamps: true }
    );
  
    request.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Request = mongoose.model("requests", request);
    return Request;
  };
  