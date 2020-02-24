 const express = require('express');
 const app = express();
 app.set('view engine', 'ejs');
 app.use(express.static('public'));

 app.get('/', (req, res) => {
    res.render('index.ejs');
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