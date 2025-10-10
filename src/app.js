const  express = require('express');
const path=require('path');
const app=express();
const indexRouter = require ('./routes/index.Routes');
const methodOverride =  require('method-override');


const puerto = 3000;
app.listen(puerto, () => {
    console.log(`Levantando un servidor con Express en el puerto ${puerto}`);
  });

app.use(express.static('public'));

app.use(express.urlencoded({ extended: false }));
//methodOverride: Permite usar los métodos PUT y DELETE en formularios HTML.
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use('/', indexRouter);
