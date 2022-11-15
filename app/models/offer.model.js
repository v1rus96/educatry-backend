module.exports = mongoose => {
    var offer = mongoose.Schema(
      {
        offerID: String,
        offerStatus: String,
        remarks: String,
        offerDate: String,
        volunteer: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
        request: {type: mongoose.Schema.Types.ObjectId, ref: 'requests'}
      },
      { timestamps: true }
    );
  
    offer.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Offer = mongoose.model("offers", offer);
    return Offer;
  };
  