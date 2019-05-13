const dbHelper = require('../controllers/dbHelper.controller')
const jsonwebtoken = require('jsonwebtoken');

async function auth(req, res, next) {

    try {
        await dbHelper.connect();
    } catch (err) {
        throw err;
    }
    // first we'll check for tokens.. else credentials..
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (token && token.startsWith('Bearer')) {
        token = token.slice(7, token.length).trim();
    }
    if (token) {
        //console.log("auth.middleware:: token -> ",token);
        const vf = dbHelper.verifyWebToken(token);
        //console.log("auth.middleware:: token -> ",vf);
        if (!vf) {
            return res.send('Invalid Auth. token');
        } else {

            let decodedUser = jsonwebtoken.decode(token);
            decodedUser.token = token;
            //console.log("auth.middleware:: tokenlogin -> ", decodedUser); //iat: .. 

            const __u = await dbHelper.findUser(decodedUser.email);
            let f = 1;

            //console.log(__u.tokens);
            if (!__u) {
                res.send('No such user');
                return;
            }
            if (!__u.tokens) {
                res.send('Invalid Authorization token');
                return;
            }
            for (_tok of __u.tokens) {
                if (String(_tok) === String(token)) {
                    f = 1;
                }
            }

            if (!f || !__u.tokens.length) {
                res.send('Invalid Authorization token');
                return;
            }
            req.decodedUser = {
                name: decodedUser.name,
                email: decodedUser.email,
                token: decodedUser.token
            }
            //req.decodedUser = decodedUser;
            next();
        }
    } else {
        //pass
        const _cu = await dbHelper.findUser(req.body.email);
        if (!_cu) {
            return res.send('No such User');
        }
        try {
            let _userLogged = await dbHelper.login(req.body.email, req.body.password);
            if (_userLogged) {
                const newTok = dbHelper.genWebToken(_userLogged.name, _userLogged.email)
                _userLogged.tokens.push(newTok);
                const _s = await _userLogged.save();

                let decodedUser = {
                    name: _userLogged.name,
                    email: req.body.email,
                    password: _userLogged.password,
                    token: newTok
                }
                //console.log("auth.middleware:: loginWithPass->", decodedUser);
                req.decodedUser = decodedUser;
                req.headers.authorization = newTok;
                next();
            } else {
                res.send('Invalid Login');
                return;
            }
        } catch (err) {
            res.send(err + '');
        }
    }
}


module.exports = auth;