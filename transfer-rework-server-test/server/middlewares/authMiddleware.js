const jwt = require('jsonwebtoken');
const ApiError = require('../exceptions/api-error');

module.exports = function (req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw ApiError.UnauthorizedError();
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            throw ApiError.UnauthorizedError();
        }

        const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = userData;
        next();
    } catch (e) {
        return next(ApiError.UnauthorizedError());
    }
};
