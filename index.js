
const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const session = require("express-session");
const app = express();
const myFunction = require('./waiters')
const pgp = require("pg-promise")();
let shortCode = require('short-unique-id')


let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
  useSSL = true;
}
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:pg1999@localhost:5432/waiter";

const config = {
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
};

const db = pgp(config);
const waitersFunction = myFunction(db);
module.exports = db


const myDays = require('./routes/routes')
const thedays = myDays(db, waitersFunction)

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.use(
    session({
      secret: "string for session in http",
      resave: false,
      saveUninitialized: true,
    })
  );
  app.use(flash());
  app.set("view engine", "handlebars");
  app.use(express.static("public"));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

app.get('/', thedays.home);

app.post('/register', thedays.postRegisterCode)

app.get('/index', thedays.login)

app.post('/waiter', thedays.waiterRoute);

app.get('/waiters/:username', thedays.dynamicGet);

app.post('/waiters/:username', thedays.dynamicPost);

app.get('/days', thedays.dayGet);

app.post('/days', thedays.dayPost);

app.post('/admin_update', thedays.updateAdmin);


let PORT = process.env.PORT || 3012;

app.listen(PORT, function(){
  console.log('App starting on port', PORT);
});

