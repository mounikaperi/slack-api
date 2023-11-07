const express = require('express');
const userRouter = require('./src/routes/userRouter');
const workspaceRouter = require('./src/routes/workspaceRouter');
const loginRouter = require('./src/routes/loginRouter');
const AppError = require('./src/utils/AppError');

const app = express();

app.use(express.json({ limit: '10kb' }));

// Test Middleware
app.use((req, res, next) => {
  console.log('Hello from middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(`The request was hit at ${req.requestTime}`);
  next();
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/workspaces', workspaceRouter);
app.use('/api/v1/signIn', loginRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

module.exports = app;