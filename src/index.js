const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session'); 
const helpers = require('./helpers/handlebars');


// Initiliazations
const app = express();
require('./database');

// Setting
app.set('port', process.env.PORT || 8000);
app.set('views', path.join(__dirname, 'views'));
app.set('layouts', path.join(app.get('views'), 'layouts'));
app.set('partials', path.join(app.get('layouts'), 'partials'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: app.set('layouts'),
    partialsDir: app.get('partials'),
    extname: '.hbs',
    helpers: require('./helpers/handlebars')
}));
app.set('view engine', 'hbs');


// Minddlewares
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Global Var

// Routes
app.use(require('./routes/index'));
// User Routes
app.use(require('./routes/user/users'));
// Admin Routes
app.use(require('./routes/admin/admin'));
app.use(require('./routes/admin/all_requests'));


// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Server is listening
app.listen(app.get('port'), () => {
    console.log('Server on port ', app.get('port'));
});