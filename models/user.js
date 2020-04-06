const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  saved: [
    {
      _id: false,

      title: {
        type: String
      },
      year: {
        type: String
      },
      released: {
        type: String
      },
      genre: {
        type: String
      },
      runtime: {
        type: String
      },
      director: {
        type: String
      },
      writer: {
        type: String
      },
      actors: {
        type: String
      },
      plot: {
        type: String
      },
      language: {
        type: String
      },
      country: {
        type: String
      },
      awards: {
        type: String
      },
      posterUrl: {
        type: String
      },
      rating: {
        type: String
      },
      vites: {
        type: String
      },
      imdbID: {
        type: String
      },
      type: {
        type: String
      },
      seasons: {
        type: String
      }
    }
  ]
});

module.exports = mongoose.model('User', userSchema);
