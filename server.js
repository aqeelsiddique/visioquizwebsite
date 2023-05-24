var morgan = require('morgan');
var bodyParser = require('body-parser');
let methodoverwride = require('method-override');
const hbs = require('handlebars');
const cors = require('cors');

const fs = require('fs');
const dotenv = require('dotenv');
const connectDatabase = require('./config/database');
// mongoose.connect('mongodb://localhost/local');
var mongoose = require('mongoose');
var express = require('express');
dotenv.config({ path: './config.env' });
var app = express();
app.use(methodoverwride('_method'));
const path = require('path');
app.use(bodyParser.urlencoded({ extended: true }));
///////////////Template engine
var exphbs = require('express-handlebars');
app.engine(
  '.hbs',
  exphbs.engine({
    extname: '.hbs',
    defaultLayout: 'main',
    partialsDir: __dirname + '/views/partials/',
    helpers: {
      isScheduled: (a) => {
        if (a === 'Scheduled') {
          return true;
        }
      },
      isStarted: (m) => {
        if (m === 'Started') {
          return true;
        }
      },
      isSelected: (firstId, secondId) => {
        if (firstId.toString() == secondId) {
          return ' selected';
        } else {
          return '';
        }
      },
    },
    runtimeOptions: {
      allowProtoMethodsByDefault: true,
      allowProtoPropertiesByDefault: true,
    },
  })
);

// const partialsPath  = path.join(__dirname, "../views/partials")

app.set('view engine', '.hbs');
app.use(express.static(path.join(__dirname, './public')));
hbs.registerPartial(
  'header',
  fs.readFileSync('./views/partials/navbar.hbs', 'utf8')
);
hbs.registerPartial(
  'event_headlists',
  fs.readFileSync('./views/partials/event_headlists.hbs', 'utf8')
);

////database connection////
const db =
  process.env.MONGODB_URI ||
  'mongodb+srv://Aqeel:aqeel12345@cluster0.uhg7y9z.mongodb.net/visiosparkwebsite?retryWrites=true&w=majority';

// Connect to MongoDB instance
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected successfully.'))
  .catch((err) => console.log('MongoDB connection error: ' + err));
// app.use(express.static(__dirname+'/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//static files
app.use(express.static(path.join(__dirname, "./frontend/build")));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/frontend/index.html"));
});


//Endpoints
const port = process.env.PORT || 4001;
app.listen(port, () => console.log(`Server started on port: ${port}`));
require('./route/route')(app);
