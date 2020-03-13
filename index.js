const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./Database/connection.js');
const session = require('express-session')


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));


//initializing sessions
app.use(session({
   secret: 'keyboard cat',
   resave: true,
   saveUninitialized: true,
   cookie: { secure: false , sameSite : true }
}))


//Home Route
app.get('/', (req, res) => {
   connection.query('SELECT * from products', function (error, results, fields) {
      if (error) console.log(error);
      res.render('index.ejs', { products: results });
      // console.log(results.length);

   });

});


//Register Route
app.route('/Register')
   .get(function (req, res) {
      res.render('LoginRegister.ejs');
   })
   .post(function (req, res) {
      var query1 = 'INSERT INTO customer (userName,pass) VALUES (?,?)';
      connection.query(query1, [req.body.userName, req.body.userPassword], function (error, results, fields) {
         if (error) console.log(error);
         console.log("Inserted into Database");
      });

      var query2 = 'select count(custID) as userID from customer';
      connection.query(query2, function (error, results, fields) {
         if (error) console.log(error);
         req.session.userID = results[0].userID;
         req.session.save();
         // console.log(req.session.userID);
      });

   });

//Login Route
app.route('/Login')
   .get(function (req, res) {
      res.render('LoginRegister.ejs');
   })
   .post(function (req, res) {
      var query1 = 'SELECT custID from customer where userName=? AND pass=?';
      connection.query(query1, [req.body.userName, req.body.userPassword], function (error, results, fields) {
         if (error) console.log(error);
         else if (results[0]==null) res.render('LoginRegister.ejs');
         else 
         { req.session.userID = results[0].custID;
            req.session.save();
            console.log(req.session.userID);
         }
      });

   });


app.get('/cart', (req, res) => {
   res.render('cart.ejs');
   console.log(req.session.userID);
});
app.get('/category', (req, res) => {
   res.render('category.ejs');
});
app.get('/checkout', (req, res) => {
   res.render('checkout.ejs');
});
app.get('/product', (req, res) => {
   res.render('product.ejs');
});
app.get('/contact', (req, res) => {
   res.render('contact.ejs');
});




var port = process.env.PORT || 3000
app.listen(port, function (req, res) {
   console.log("Server started at port 3000");
});