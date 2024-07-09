const express = require('express');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const router = express.Router();

router.get('/store', 
    requireSignin,
    isAuth,
    isAdmin,
    getAllStores
);

module.exports = router;