const express = require('express');
const app = express();
const PORT = process.env.PORT || 80;
const loginRouter = require('./routers/login.router');
const logoutRouter = require('./routers/logout.router');
const registerRouter = require('./routers/register.router');
const tasksRouter = require('./routers/tasks.router');

app.use(express.json());
app.use('/api/login', loginRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/register', registerRouter);
app.use('/api/tasks', tasksRouter);

app.get('/api', (req, res) => {
    res.send('success');
});


app.listen(PORT, () => {
    console.log("listening at: " + PORT);
})