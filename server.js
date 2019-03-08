let express = require("express");
let logger = require("morgan");
let mongoose = require("mongoose");
mongoose.Promise=global.Promise;
mongoose.set('debug',true);
// const CONNECTION_URI = process.env.MONGODB_URI || "mongodb+srv://user123:Garagec250@cluster0-o5kvx.mongodb.net/test?retryWrites=true";

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
let axios = require("axios");
let cheerio = require("cheerio");

// Require all models
let db = require("./models");

let PORT = 3000;

// Initialize Express
let app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
// this connect method works locally but When i push it to Heroku I have to use Mlab as an interface with mongodb.
// mongoose.connect("mongodb://localhost/IRS", { useNewUrlParser: true });
mongoose.connect("mongodb://heroku_xcqzpk2r:9ij1kroubjbcj4155el7v087do@ds125255.mlab.com:25255/heroku_xcqzpk2r", { useNewUrlParser: true });
// mongoose.connect(CONNECTION_URI, {
//   useNewUrlParser: true
// })
// .then(() => {
//   console.log('connected to mongo db');
// })
// .catch(err => console.log(err));
// Routes

// A GET route for scraping the echoJS website
app.get("/scrape", function (req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://blog.newrelic.com/engineering/best-javascript-libraries-frameworks/").then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("article h3").each(function (i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function (dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function (err) {
          // If an error occurred, log it
          console.log(err);
        });
    });

    // Send a message to the client
    res.send("dbArticle");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
  // TODO: Finish the route so it grabs all of the articles
  db.Article.find({})
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
  // TODO
  // ====
  // Finish the route so it finds one article using the req.params.id,
  // and run the populate method with "note",
  // then responds with the article with the note included
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});
// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
  // save the new note that gets posted to the Notes collection
  // then find an article from the req.params.id
  // and update it's "note" property with the _id of the new note
  db.Note.create(req.body)
    .then(function (dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    })
});
// delete functionality
app.delete("/articles/:id", function (req, res) {
  // save the new note that gets posted to the Notes collection
  // then find an article from the req.params.id
  // and update it's "note" property with the _id of the new note
  db.Note.deleteOne(req.body)
    .then(function (dbNote) {
      return db.Note.deleteOne({ note: dbNote._id }, { new: true });
    })
    .catch(function (err) {
      res.json(err);
    });
   console.log("deleted")
    })



// Start the server
app.listen(process.env.PORT || 5000, function () {
  console.log("App running on port " + PORT + "!");
});
