const MovieModel = require("../model/movie.model");

const {validationResult} = require('express-validator');

const list = async (request, response) => {
  try {
        
    const errors = validationResult(request);
    if(!errors.isEmpty()){
      return response.status(422).json({errors: errors.array()});
    }

    const page = parseInt(request.query.page) || 1;

    const limit = 10;

    const queryTitle = request.query.title ? {title: {$regex: request.query.title, $options: 'i'}} : {};

    const queryGenres = request.query.genres ? {genres: {$in:request.query.genres.split(',')}} : {};

    const query = {
      ...queryTitle,
      ...queryGenres
    }

    const movies = await MovieModel.paginate(query,{page,limit});

    return response.json(movies);

  } catch (err) {
    return response.status(400).json({
      error: "@movies/list",
      message: err.message || "Failed to list movies",
    });
  }
};

const getById = async (request, response) => {
  const { id } = request.params;

  try {
    const movie = await MovieModel.findById(id);

    if (!movie) {
      throw new Error();
    }

    //verificando se o usuario esta autenticado
    if(request.isAuthenticated){

      return response.json(movie);

    } else {      

      const {video, ...movieWithoutVideo} = movie.toObject();

      return response.json(movieWithoutVideo);

    }
    
  } catch (err) {
    return response.status(400).json({
      error: "@movies/getById",
      message: err.message || `Movie not found ${id}`,
    });
  }
};

const getByGenre = async(request, response) => {
  try{
      const genres = await MovieModel.distinct('genres');

      genres.sort();

      return response.json(genres);

  }catch(err){
      response.status(500).json({
          error:'@genres/getByGenres',
          message: err.message || 'Failed to retrieve genres of movies'
      })
  }
}


const create = async (request, response) => {
  const { title, description, year, genres, image, video } = request.body;

  try {
    const movie = await MovieModel.create({
      title,
      description,
      year,
      genres,
      image,
      video,
    });

    return response.status(201).json(movie);
  } catch (err) {
    return response.status(400).json({
      error: "@movies/create",
      message: err.message || "Failed to create a movie",
    });
  }
};

const update = async (request, response) => {
  const { id } = request.params;
  const { title, description, year, genres, image, video } = request.body;

  try {
    const movieUpdated = await MovieModel.findByIdAndUpdate(
      id,
      {
        title,
        description,
        year,
        genres,
        image,
        video,
      },
      {
        new: true,
      }
    );

    return response.json(movieUpdated);
  } catch (error) {
    return response.status(400).json({
      error: "@movies/update",
      message: `Movie not found ${id}`,
    });
  }
};

const remove = async (request, response) => {
  const { id } = request.params;

  try {
    const movieRemoved = await MovieModel.findByIdAndDelete(id);

    if (!movieRemoved) {
      throw new Error();
    }

    return response.status(204).send();
  } catch (err) {
    return response.status(400).json({
      error: "@movies/remove",
      message: err.message || `Movie not found ${id}`,
    });
  }
};

module.exports = {
  list,
  getById,
  getByGenre,
  create,
  update,
  remove,
};
