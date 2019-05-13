const express = require('express');
const router = express.Router();
const dbHelper = require('../controllers/dbHelper.controller');

router.use(express.json());

router.post('/', async (req, res) => {
    await dbHelper.connect();

    const user = req.body;
    if (!isValidUser(user)) return res.send('Incomplete registration data');
    const _u = await dbHelper.findUser(user.email);
    if (_u) return res.send('Already exists!');
    let ret;
    try {
        const newToken = dbHelper.genWebToken(user.name, user.email);
        const playload = {
            name: user.name,
            email: user.email,
            token: newToken
        }
        ret = await dbHelper.insertUser(user.name, user.email, user.password, newToken);
        res.send(playload);
        //console.log(ret);
    } catch (error) {
        console.log(error);
    }
});

function isValidUser(user) {
    return user && user.name && user.email && user.password;
}

module.exports = router;