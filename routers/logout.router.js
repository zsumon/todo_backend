const express = require('express');
const router = express.Router();
const dbHelper = require('../controllers/dbHelper.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(express.json());

router.post('/', authMiddleware, async (req, res) => {
    const user = req.decodedUser;
    // res.send('logout.router:: post() -> ' + user.email);
    try {
        //await dbHelper.disconnect(); //fixed..
        await dbHelper.connect();
        let _u = await dbHelper.findUser(user.email);
        let bak = [];

        for (__tok of _u.tokens) {
            if (String(__tok) !== user.token) {
                bak.push(String(__tok));
            }
        }
        // console.log(bak);
        delete _u.tokens;
        _u.tokens = bak;
        try {
            req.headers = [];
            const _mod_u = await _u.save();
            req.headers.authorization = null;
            res.send(_mod_u);
        } catch (error) {
            console.log('logout.router::catch():1 -> ', error);
        }
    } catch (err) {
        res.send(err.toString());
        console.log('logout.router::catch() -> ', err);
    }

});


async function logOutMiddleware(req, res, next) {
    //console.log('only for logouts');



    next();
}

//reset header
module.exports = router;