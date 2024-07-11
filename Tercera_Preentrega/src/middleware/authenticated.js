const express = require("express");
const router = express.Router();

const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/login');
    }
};

const isNotAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        return next();
    } else {
        res.redirect('/profile');
    }
};

module.exports = {
    isAuthenticated,
    isNotAuthenticated,
    router
};
