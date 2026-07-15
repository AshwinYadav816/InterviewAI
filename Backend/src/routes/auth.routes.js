const {Router} = require('express');
const router = Router();
const authController = require('../controller/auth.controller');
const { authenticateToken } = require('../middlewares/middlewares');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', authController.registerUserController);

/**
 * @route   POST /api/auth/login
 * @desc    Login a user with email and password
 * @access  Public
 */
router.post('/login', authController.loginUserController);

/**
 * @route   GET /api/auth/logout
 * @desc    Logout a user by clearing the token cookie
 * @access  Public
 */
router.get('/logout', authController.logoutUserController);

/**
 * @route   GET /api/auth/get-me    
 * @desc    Get the currently logged-in user's information
 * @access  Private
 */
router.get('/get-me', authenticateToken, authController.getMeController);

module.exports = router;