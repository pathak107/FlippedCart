 const express = require('express');
 const app = express();
 const bodyParser = require('body-parser');
 const connection = require('./Database/connection.js');
 const session = require('express-session')
 
 
 app.set('view engine', 'ejs');
 app.use(express.static('public'));
 app.use(bodyParser.urlencoded({ extended: true }));

// app.get('/a', (req, res) => {
//    res.json({
//       userID: 15,
//       name : "Bhadwa"

//    });
// });

 app.get('/', (req, res) => {
   connection.query('SELECT * from products', function (error, results, fields) {
      if (error) console.log( error);
      res.render('index.ejs',{products: results});
      console.log(results.length);
   
    });
    
 });


 app.get('/cart', (req, res) => {
    res.render('cart.ejs');
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
 app.listen(port,function(req,res){
     console.log("Server started at port 3000");
 });