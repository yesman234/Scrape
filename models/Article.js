let mongoose = require("mongoose");
// Save a reference to the Schema constructor
let Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
let ArticleSchema = new Schema({
  // `title` is required and of type String
  title: {
    type: String,
    required: false
  },
 note: {
    type:Schema.Types.ObjectId,
    type: String,
    ref: "Note"
  }
});

// This creates our model from the above schema, using mongoose's model method
let Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
