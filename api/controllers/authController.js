const Users = require('../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { asyncMiddleware } = require('../../middleware');

const authController = {
    register: asyncMiddleware(async (req, res, next) => {

        const { name, email, password } = req.body;

        if (!name || !email || !password) return next({
            status: 403,
            message: `Please fill in the required information.`
        });

        if (!isNaN(name))
            return next({
                status: 403,
                message: "Name should only contain letters."
            });

        if (!(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/.test(email)))
            return next({
                status: 403,
                message: "invalid email format."
            });

        const foundUser = await Users.findOne({ email });
        if (foundUser) return next({
            status: 401,
            message: `This email (${email}) already exists`
        });

        if (password.length < 6)
            return next({
                status: 400,
                message: "Password too short. Minimum 6 characters."
            });

        // Password Encryption
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = new Users({
            name, email, password: passwordHash
        });

        // Save mongodb
        const newUser = await user.save();

        // Then create jsonwebtoken to authentication
        const accesstoken = createAccessToken({ id: newUser._id });
        const refreshtoken = createRefreshToken({ id: newUser._id });

        res.cookie('refreshtoken', refreshtoken, {
            httpOnly: true,
            path: '/user/refresh_token',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
        });

        res.json({
            success: true,
            token: accesstoken
        });

    }),
    login: asyncMiddleware(async (req, res, next) => {
        const { email, password } = req.body;

        const user = await Users.findOne({ email });
        if (!user) return next({
            status: 401,
            messagge: "Invalid Credentials."
        });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return next({ status: 401, message: "Invalid Credentials." });

        // If login success , create access token and refresh token
        const accesstoken = createAccessToken({ id: user._id });
        const refreshtoken = createRefreshToken({ id: user._id });

        res.cookie('refreshtoken', refreshtoken, {
            httpOnly: true,
            path: '/user/refresh_token',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
        });

        res.json({
            success: true,
            token: accesstoken
        });
    }),
    logout: asyncMiddleware(async (req, res) => {

        res.clearCookie('refreshtoken', { path: '/user/refresh_token' });
        return res.json({
            success: true,
            message: "Logged out."
        });

    }),
    refreshToken: asyncMiddleware((req, res, next) => {
        const rf_token = req.cookies.refreshtoken;
        if (!rf_token) return next({
            status: 401,
            message: "Please, log in or create an account first."
        });

        jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return next({
                status: 401,
                message: "Please, log in or create an account first."
            });

            const accesstoken = createAccessToken({ id: user.id });

            res.json({
                success: true,
                token: accesstoken
            });
        });
    }),
    getUser: asyncMiddleware(async (req, res, next) => {
        const user = await Users.findById(req.user.id).select('-password');
        if (!user) return next({
            status: 401,
            message: "This user does not exist."
        });

        res.json({
            success: true,
            user
        });
    })
};

const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });
};
const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

module.exports = authController;