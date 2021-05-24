const models = require('../db')
const jwt = require('jsonwebtoken');
const SECRET = "ADJFHNSKJVNS";
function signUp(userData) {
    return new Promise((resolve, reject) => {
        models.user.create(userData)
            .then(newUser => {
                resolve({
                    email: newUser.email,
                    name: newUser.name,
                    _id: newUser._id
                })
            })
            .catch(error => {
                reject(error)
            })
    })
}

function login(loginData) {
    return new Promise((resolve, reject) => {
        models.user.findOne({ email: loginData.email })
            .then(doc => {
                if (!doc) {
                    reject(new Error(`User not found or password is wrong1`));
                } else if (doc.password === loginData.password) {
                    resolve({
                        user: {
                            _id: doc._id,
                            name: doc.name,
                            email: doc.email,
                        },
                        token: generateJWT(doc)
                    });
                } else {
                    reject(new Error('User not found or password is wrong'))
                }

            })
    })
}

function generateJWT(user) {
    const data = {
        _id: user._id,
        name: user.name,
        email: user.email
    };
    const signature = SECRET;
    const expiration = '6h';

    return jwt.sign({ data, }, signature, { expiresIn: expiration });
}

const getTokenFromHeader = (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];

    }
}

module.exports = {
    signUp: signUp,
    login: login,
    isAuth: a => { },
    attachCurrentUser: (req, res, next) => {
        const decodedTokenData = req.tokenData;
        models.user.findOne({ _id: decodedTokenData._id })
            .then((userRecord) => {
                req.currentUser = {
                    _id: userRecord._id
                };
                if (!userRecord) {
                    return res.status(401).end('User not found')
                } else {
                    return next();
                }
            })


    },
    roleRequired: (requiredRole) => {
        return (req, res, next) => {
            if (req.currentUser.role === requiredRole) {
                return next();
            } else {
                return res.status(401).send('Action not allowed');
            }
        }
    }
}