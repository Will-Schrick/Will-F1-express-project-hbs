const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const flash = require('connect-flash');
const { create } = require('express-handlebars');
const session = require('express-session');
const methodOverride = require('method-override')
const passport = require('passport');
const pgSession = require('connect-pg-simple')(session);
const { Pool } = require('pg');

const swaggerDocs = require('./config/swagger').swaggerDocs;
const swaggerUi = require('./config/swagger').swaggerUi;

const hbs = create({
  extname: 'hbs',
  defaultLayout: 'main',
  partialsDir: 'views/partials',      //added
  helpers: require('./utils/helpers')  //existed
});

require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

//my routes go here 
const indexRouter = require('./routes/index');  //existed
//added below to // below maybe
const authRouter = require('./routes/auth')  //added
const editUserRouter = require('./routes/editUser');
//const profileRouter = require('./routes/index'); //added
//const loginRouter = require('.routes/login'); //added

//

const app = express();
app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use(
  session({
    store: new pgSession({
      pool: pool,
      tableName: 'Session',
    }),
    secret: process.env.SESSION_SECRET || 'SECRET',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
  })
);

app.use(flash());
// i added to get flash to work
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

// view engine setup
app.engine('hbs', hbs.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));   //this was false by default
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(flash());  commented out becuase I added higher up
app.use(methodOverride('_method'));
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport');   //existed
require('./config/cloudinary');  //existed

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));  //existed- for swagger routes up above

app.use('/', indexRouter);  // main but redirect to 3000/auth/login-page
//i added more below
app.use('/auth', authRouter);
app.use('/edit-user', editUserRouter);
//app.use('/profile', profileRouter);
//app.use('/login', loginRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const PORT = process.env.PORT || 3000;


module.exports = app;
