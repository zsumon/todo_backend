const express = require('express');
const router = express.Router();
const authMiddleWare = require('../middlewares/auth.middleware');

router.use(express.json());

router.post('/', authMiddleWare, async (req, res) => {

    res.send(req.decodedUser);
});

module.exports = router;