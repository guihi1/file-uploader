import Express from 'express';
import userRouter from './routes/userRouter.js';
import indexRouter from './routes/indexRouter.js';
import folderRouter from './routes/folderRouter.js';
import fileRouter from './routes/fileRouter.js';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import passport from 'passport';
import configurePassport from './passportConfig.js';
import { PrismaClient } from '@prisma/client';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';

const app = Express();
const port = 3000;

// view engine setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(
  session({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
    secret: 'a santa at nasa',
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  }),
);

app.use(Express.urlencoded({ extended: true })); // For parsing form data
app.use(Express.json()); // For parsing JSON bodies
app.use(passport.initialize());
app.use(passport.session());

configurePassport(passport);

app.use('/', userRouter);
app.use('/', indexRouter);
app.use('/', folderRouter);
app.use('/', fileRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
