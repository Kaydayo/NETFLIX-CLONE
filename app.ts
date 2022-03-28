import createError, {HttpError} from 'http-errors';
import express, {Request, Response, NextFunction}from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './src/db/connect';

import indexRouter from './src/routes/index';
import usersRouter from './src/routes/users';
import authRouter from './src/routes/auth';
import movieRouter from './src/routes/movies'

dotenv.config()

const app = express();

app.use(cors())
// view engine setup
app.set('views', path.join(__dirname, '../../views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


connectDB();


// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/movies', movieRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err: HttpError, req:Request, res:Response, _next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({error:err});
});

export default app;
