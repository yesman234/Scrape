let mongoose = require("mongoose");
// Save a reference to the Schema constructor
let Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object
// This is similar to a Sequelize model
let NoteSchema = new Schema({
  // `title` is of type String
  title: String,
  // `body` is of type String
  body: String,
  created_at: {
    type: Date,
    default: Date.now()
}
});

// This creates our model from the above schema, using mongoose's model method
let Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Note;
