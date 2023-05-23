const {Router} = require('express');

const commentsController = require('../controllers/comments.controller');

const {verifyAuthenticate} = require('../middlewares/verifyAuthentication');

const routes = Router();

routes.get('/comments', commentsController.list);
routes.get('/comments/:id', commentsController.getById);
routes.get('/comments/movies/:movieId', commentsController.getByMovieId);
routes.post('/comments', verifyAuthenticate, commentsController.create);

routes.put('/comments/:id', verifyAuthenticate, commentsController.update);
routes.delete('/comments/:id', verifyAuthenticate, commentsController.remove)


module.exports = routes;