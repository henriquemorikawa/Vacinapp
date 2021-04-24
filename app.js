require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

const homeRoutes = require('./routes/home.routes');
const authRoutes = require('./routes/auth.routes')
const vaccinesRoutes = require('./routes/vaccine.routes');

const sessionConfig = require('./config/session.config');

const app = express();

sessionConfig(app);

require('./config/mongodb.config');

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
hbs.registerPartials(__dirname + '/views/partials');

app.use('/', homeRoutes);
app.use('/', authRoutes);


app.use((req, res, next) => {
  if (req.session.currentUser) {
    return next();
  }

  res.redirect('/login');
});

app.use('/vaccines', vaccinesRoutes);

app.listen(process.env.PORT);
