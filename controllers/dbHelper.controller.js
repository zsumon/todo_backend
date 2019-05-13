const DB_NAME = 'task_manager';
// const CONN_URL = "mongodb://localhost:27017/" + DB_NAME;
const CONN_URL = 'mongodb+srv://u2019:2zozo9sH5V9HUfl7@cluster0-hm136.mongodb.net/' + DB_NAME;
const SECRATE_KEY = 'someGoodKeys';
const mongoose = require('mongoose');
const jsonwebtoken = require('jsonwebtoken');

const Schema = {
    name: String,
    email: { type: String, unique: true },
    password: String,
    tasks: [{
        id: String,
        title: String,
        description: String,
        isDone: Boolean
    }],
    tokens: [String]
};

const User = mongoose.model('User', Schema);

async function connect() {
    try {
        await mongoose.connect(CONN_URL, { useNewUrlParser: true, useCreateIndex: true });
    } catch (error) {
        throw error;
    }
}
async function disconnect() {
    try {
        await mongoose.disconnect();
    } catch (error) {
        throw error;
    }
}

async function insertUser(name, email, password, token) {
    const user = new User({ name, email, password, tokens: token });
    try {
        const ret = await user.save();
        return ret;
    } catch (err) {
        throw err;
    }
}

async function findUser(email) {
    try {
        const u = await User.findOne({ email });
        return u;
    } catch (error) {
        console.log("dbHelper::findUser() -> ", error);

    }
}

function genWebToken(name, email) {
    let obj = {
        name: name,
        email: email,
    }
    const _signed = jsonwebtoken.sign(obj, SECRATE_KEY, { expiresIn: '24h' });
    // console.log("dbHelper::genWebToken() ->",_signed);
    return _signed;
}

function verifyWebToken(token) {
    return jsonwebtoken.verify(token, SECRATE_KEY);
}

async function login(email, pass) {
    try {
        const _u = await User.findOne({ email });
        if (!_u) {
            //throw new Error('No such User found!');
            return null;
        }
        if (_u.password == pass) {
            console.log("dbHelper::login() ", _u);
            return _u;
        }
    } catch (error) {
        throw error;
    }
}

module.exports = { connect, disconnect, findUser, insertUser, genWebToken, verifyWebToken, login };
