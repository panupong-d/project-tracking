require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const basicAuth = require('express-basic-auth');
const helmet = require('helmet')
const cors = require('cors');


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
// const blogsRouter = require('./routes/blogs');
const uploadRouter = require('./routes/upload');

const rolesRouter = require('./routes/roles');
const uploadRoutes = require('./routes/upload');


// middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(helmet());
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', indexRouter);

app.use('/api/users',
    // basicAuth({
    //     users: { 'dmt': 'projecttracking' }
    // }),
    usersRouter
);

// app.use('/api/blogs',
//     basicAuth({
//         users: { 'admin': '1234' }
//     })
//     , blogsRouter);

// app.use('/api/upload', uploadRoutes);

app.use(errorHandler);

module.exports = app;
