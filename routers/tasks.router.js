const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const dbHelper = require('../controllers/dbHelper.controller')
router.use(express.json());

router.get('/', authMiddleware, async (req, res) => {    
    const user = req.decodedUser;
    //console.log(user);
    try {
        await dbHelper.connect();
        let  _user = await dbHelper.findUser(user.email);
        res.send(_user.tasks);
    } catch (error) {
        res.send('error');
        console.log(error);
    }
});

router.post('/', authMiddleware, async (req, res) => {
    const task = req.body;
    //validate task..
    try {
        await dbHelper.connect();
    } catch (error) {
        console.log(error);
        return;
    }
    let _user = await dbHelper.findUser(req.decodedUser.email);
    console.log(_user);

    _user.tasks.push(task);
    try {
        const saved_u = await _user.save();
        res.send(saved_u);
    } catch (error) {
        res.send('err')
        console.log(error);
    }
});

router.patch('/', async (req, res) => {
    res.send('add tasks');
});

router.delete('/', async (req, res) => {
    res.send('add tasks');
});

module.exports = router;