const models = require('../db')
const jwt = require('jsonwebtoken');
const ejwt = require('express-jwt');

function makeid(length) {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() *
            charactersLength)));
    }
    return result.join('');
}

const SECRET =  'HELLOFROMVIETNAM'//makeid(10);

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
                    reject(new Error(`Невірно вказані електронна пошта або пароль`));
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
                    reject(new Error('Невірно вказані електронна пошта або пароль'))
                }

            })
            .catch(err => {
                reject(err)
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

const getTokenFromCookie = (req, res, next) => {
    if (req.cookies) {
        console.log(req.cookies['jwt']);
        return req.cookies['jwt'];
    }
}

module.exports = {
    signUp: signUp,
    login: login,
    isAuth: ejwt(
        {
            secret: SECRET, // Тут должно быть то же самое, что использовалось при подписывании JWT

            userProperty: 'token', // Здесь следующее промежуточное ПО сможет найти то, что было закодировано в services/auth:generateToken -> 'req.token'

            getToken: getTokenFromCookie, // Функция для получения токена аутентификации из запроса

            algorithms: ['HS256']
        }
    ),
    attachCurrentUser: (req, res, next) => {
        const decodedTokenData = req.token;
        console.log('Decoded token data');
        console.log(decodedTokenData);
        if (!decodedTokenData) {
            return next();
            throw new Error('decodedTokenData is undefined')
        }
        models.user.findOne({ _id: decodedTokenData.data._id })
            .then((userRecord) => {
                req.currentUser = userRecord
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