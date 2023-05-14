const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
    {
        user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true}
       ,movie_id:{type: mongoose.Schema.Types.ObjectId, ref: 'movies', required: true}
       ,content: {type: String, required: true}
       ,rating:  {type: Number, required: true}
   },
   {
    timestamps: true //habilita no modelo os campos createdAt e updateAt
   }
);

module.exports = mongoose.model('comments', CommentSchema);