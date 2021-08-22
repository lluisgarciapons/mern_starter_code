const authRouter = require('express').Router();
const { checkToken } = require('../../middleware');
const authController = require('../controllers/authController');

authRouter.post('/register', authController.register);

authRouter.post('/login', authController.login);

authRouter.get('/logout', authController.logout);

authRouter.get('/refresh_token', authController.refreshToken);

authRouter.get('/myUser', checkToken, authController.getUser);


module.exports = authRouter;