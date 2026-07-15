const User = require('../models/user.model');
const BlacklistToken = require('../models/blacklist.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

// Cross-site cookies (frontend and backend on different domains in production)
// require sameSite:"none" + secure:true. On localhost (http) we keep it plain.
const isProd = process.env.NODE_ENV === 'production';
const cookieOptions = {
    httpOnly: true,
    sameSite: isProd ? 'none' : 'lax',
    secure: isProd,
};

/**
 * @name   registerUserController
 * @desc    Register a new user, expects username, email, and password in the request body
 * @access  Public
 */

async function registerUserController(req, res) { 
    const { username, email, password } = req.body;

    if(!username || !email || !password) {
        return res.status(400).json({ message: 'Please provide username, email, and password' });
    }

    const isUserExists = await User.findOne({ 
        $or: [{ email }, { username }]
    });
    if(isUserExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.cookie("token", token, cookieOptions);
    res.status(201).json({ message: 'User registered successfully', user: { id: user._id, username: user.username, email: user.email }, token });
} 

/**
 * @name   loginUserController
 * @desc    Login a user, expects email and password in the request body
 * @access  Public
 */

async function loginUserController(req, res) {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if(!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    res.cookie("token", token, cookieOptions);
    res.status(200).json({ message: 'User logged in successfully', user: { id: user._id, username: user.username, email: user.email } });
}
/**
 * 
 * @name   logoutUserController
 * @desc    Logout a user by clearing the token cookie and blacklisting the token
 * @access  Public
 */

async function logoutUserController(req, res) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(400).json({ message: 'No token found' });
    }
    await BlacklistToken.create({ token });
    res.clearCookie("token", cookieOptions);
    res.status(200).json({ message: 'User logged out successfully' });
    
}
/**
 * 
 * @name   getMeController
 * @desc    Get the currently logged-in user's information
 * @access  Private
 */

async function getMeController(req, res) {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }   
    res.status(200).json({ user });
}
module.exports = { registerUserController, loginUserController, logoutUserController, getMeController };