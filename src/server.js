const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const mtover = require('method-override');

//inicializaciones
const app = express();

//configuraciones
app.set('port', process.env.PORT || 4000);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs',exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));


//middlewares
app.use(express.urlencoded({extended: false}));
app.use(mtover('_method'));

//Rutas
// -> Ruta Inicial
app.use(require('./routes/index.routes')); 
// -> Ruta para el crud de los libros 
app.use(require('./routes/libros.routes'));  
//variables Globales

//archivos estaticos
app.use(express.static(path.join(__dirname,'public')));

module.exports = app;