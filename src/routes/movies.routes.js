const { Router } = require("express");

const moviesController = require("../controllers/movies.controller");

const { verifyAuthenticate } = require("../middlewares/verifyAuthentication");
const {verifyAdmin} = require('../middlewares/verifyAdmin');

const routes = Router();

routes.get("/movies",verifyAuthenticate, moviesController.list);
routes.get("/movies/:id",verifyAuthenticate, moviesController.getById);
routes.get("/genres", moviesController.getByGenre);

routes.post("/movies", verifyAuthenticate, verifyAdmin, moviesController.create);

routes.put("/movies/:id", moviesController.update);

routes.delete("/movies/:id", moviesController.remove);

module.exports = routes;
