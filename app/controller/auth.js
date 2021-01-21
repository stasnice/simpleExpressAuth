const mongoose = require('mongoose');
const bCrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authHelper = require('../helpers/authHelper');
const { secret } = require('../../config/app').jwt;

const User = mongoose.model('User');
const Token = mongoose.model('Token');

const updateTokens = async (userId) => {
    const accessToken = await authHelper.generateAccessToken(userId);
    const refreshToken = await authHelper.generateRefreshToken();

    return authHelper.replaceDbRefreshToken(refreshToken.id, userId).then(() => ({
            accessToken,
            refreshToken: refreshToken.token,
        }));
};

const signIn = (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email })
        .exec()
        .then((user) => {
            if (!user){
                res.status(401).json({ message: 'User does not exist!' })
            }

            const isValid = bCrypt.compareSync(password, user.password)
            if (isValid) {
                updateTokens(user._id).then(tokens => res.json(tokens));
            } else {
                res.status(401).json({ message: 'Invalid credentials!' })
            }
        })
        .catch(err => res.status(500).json({ message: err.message }))
};

const refreshTokens = (req, res) => {

    const { refreshToken } = req.body;
    let payload;
    console.log('refresh token from body', refreshToken);
    try{
        payload = jwt.verify(refreshToken, secret);
        if (payload.type !== 'refresh') {
            res.status(400).json({ message1: 'invalid token!1' });
        }
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            res.status(400).json({ message2: 'Token expired!2' });
            return;
        } else if (err instanceof jwt.JsonWebTokenError) {
            res.status(500).json({ message3: err.message });
            return;
        }
    }

    Token.findOne({ tokenId: payload.id })
        .exec()
        .then((token) => {
            if (token === null) {
                throw new Error('Invalid token!4');
            }

            return updateTokens(token.userId);
        })
        .then(tokens => res.json(tokens))
        .catch(err => res.status(400).json({ message: err.message }));
}

const signUp = (req, res) => {
    const { email, password } = req.body
    const passwordHash = bCrypt.hashSync(password, 10)
    User.create({ email, password: passwordHash })
        .then( (user) => {
            res.json({ success: true })
        })
        .catch(err => res.status(500).json( { message: 'some error is here while creating user!' }))
}

module.exports = {
    signIn,
    signUp,
    refreshTokens,
}

