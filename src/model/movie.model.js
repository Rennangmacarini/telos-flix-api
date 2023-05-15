const mongoose = require("mongoose");

const mongoosePaginate = require('mongoose-paginate-v2')

const MovieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    genres: {
      type: Array,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    video: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

MovieSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("movies", MovieSchema);
