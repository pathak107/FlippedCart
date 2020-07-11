require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session')

const bcrypt= require('bcrypt');
const saltRounds=10;

var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database('./Database.db',(err)=>{
   if(err) console.log(err);
   console.log("Connected to Database");
})

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));


//initializing sessions
app.use(session({
   secret: "extremesecret",
   resave: true,
   saveUninitialized: true,
   cookie: { secure: false , sameSite : true }
}))


//Home Route
app.get('/', (req, res) => {
   db.all('SELECT * from Products', function (error, results) {
      if (error) console.log(error);
      res.render('index.ejs', { products: results });
   });
});


//Register Route
app.route('/Register')
    .get((req, res) => {
        res.render('register.ejs');
    })
    .post((req, res) => {
        bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
            // Store hash in your password DB.
            if (err) throw err;
            var query1 = 'insert into Customer (UserName,Password) values (?,?);';
            db.run(query1, [req.body.userName, hash], (error) => {
                if (error) throw error;
                console.log('Value inserted successfuly');
            });
            db.get('SELECT count(*) as custID from Customer', function (error, result) {
                if (error) throw error;
                req.session.cust_id = result.custID;
                console.log("Customer id is " + req.session.cust_id);
                res.redirect('/');
            });
        });
    });

//Login Route
app.route('/Login')
    .get((req, res) => {
        res.render('login.ejs', { loginStatus: "Enter to Authenticate" });
    })
    .post((req, res) => {


        var query1 = 'select cust_id,Password from Customer where UserName =?;';
        db.get(query1, [req.body.userName], (error, row) => {
            if (row == undefined)
                res.render('login.ejs', { loginStatus: "Wrong Email or Password. Try Again! " });

            else if(error) throw error;

            else {
                bcrypt.compare(req.body.password, row.Password, function (err, result) {
                    // result == true
                    if (result == true) {
                        console.log('Authenticated successfully');
                        console.log(row.cust_id);
                        req.session.cust_id = row.cust_id;
                        res.redirect('/');
                    }
                    else {
                        res.render('login.ejs', { loginStatus: "Wrong Email or Password. Try Again! " });
                    }
                });
            }



        });
});


//Cart route
app.get('/cart', (req, res) => {
   if(req.session.cust_id==undefined)
   {
      return res.redirect('/Login');
   }
   var query="select p_id,name,cost,image from Products natural join Cart where cust_id= ? and Products.p_id = Cart.p_id;"
   db.serialize(()=>{
      var item;
      db.all(query,[req.session.cust_id],(err,rows)=>{
         if(err) console.log(err);
         item=rows;
      });
      db.get('select sum(cost) as total from Products natural join Cart where cust_id= ? and Products.p_id = Cart.p_id;',[req.session.cust_id],(err,row)=>{
         res.render('cart.ejs',{item:item,allItems:row});
      })

   })
   
});
app.post('/cart',(req,res)=>{
   if(req.session.cust_id==undefined)
   {
      res.json({message:"unauthorized"});
   }
   else{
      db.run("insert into Cart(cust_id,p_id) values (?,?)",[req.session.cust_id,req.body.p_id],(err)=>{
         if(err) console.log(err);
         console.log("Item inserted in Cart");
         res.sendStatus(200);
      })
   }
   
});
app.delete('/cart/:p_id',(req,res)=>{
   if(req.session.cust_id==undefined)
   {
      res.json({message:"unauthorized"});
   }
   else{
      var p_id=req.params.p_id;
      db.run("Delete from Cart where cust_id=? AND p_id=?",[req.session.cust_id,p_id],(err)=>{
         if(err) console.log(err);
         console.log("Item deletd from Cart");
         res.sendStatus(200);
      })
   }
})



//Category Routes
app.get('/category', (req, res) => {
   var products;
   var category;
   db.serialize(()=>{  
      db.all('SELECT * from Products', function (error, results) {
         if (error) console.log(error);
         products=results;
      });
      db.all('SELECT * from Category', function (error, results) {
         if (error) console.log(error);
         category=results;   
         res.render('category.ejs', { category:category,products:products });
      });
      
   })
});
app.use('/category/:cat_id',express.static('public'));
app.get('/category/:cat_id',(req,res)=>{
   var products;
   var category;
   db.serialize(()=>{  
      db.all("SELECT * from Products where cat_id=?",[req.params.cat_id] , (error, results)=> {
         if (error) console.log(error);
         products=results;
      });
      db.all('SELECT * from Category', function (error, results) {
         if (error) console.log(error);
         category=results;   
         res.render('category.ejs', { category:category,products:products });
      });
      
   })
});


//Checkout Route
app.get('/checkout', (req, res) => {
   if(req.session.cust_id==undefined)
   {
      return res.redirect('/Login');
   }
   res.render('checkout.ejs');
});
app.post('/checkout',(req,res)=>{
   if(req.session.cust_id==undefined)
   {
      return res.redirect('/Login');
   }
   console.log(req.session.cust_id);
   db.serialize(()=>{
      var query1="UPDATE Customer SET Address=?,contact=?,accountNumber=? WHERE cust_id=?;"
      db.run(query1,[req.body.address,req.body.contact,req.body.accountNumber,req.session.cust_id],(err)=>{
         if(err) console.log(err);
         console.log("Updated Customer");
      });

      var query2="INSERT INTO  orders(cust_id, p_id) SELECT cust_id,p_id FROM Cart WHERE cust_id=?;";
      db.run(query2,[req.session.cust_id],(err)=>{
         if(err) console.log(err);
         console.log("Ordered Successfully");
      });
      db.run('delete from Cart where cust_id=?',[req.session.cust_id],(err)=>{
         if(err) console.log(err);
         console.log("Cleared Cart");
         res.redirect('/orders');
      });
      
      
   });
});



//Products route
app.use('/product/:p_id',express.static('public'));
app.get('/product/:p_id',(req,res)=>{
   db.get('select * from Products where p_id=?',[req.params.p_id],(err,row)=>{
      if(err)console.log(err);
      res.render('product.ejs',{product:row});
   });
});



app.get('/contact', (req, res) => {
   res.render('contact.ejs');
});



//Orders  Route
app.get('/orders',(req,res)=>{
   if(req.session.cust_id==undefined)
   {
      return res.redirect('/Login');
   }
   var query="select name,cost,image,Address,orderDate,orderStatus from Products natural join orders natural join Customer where Orders.cust_id=? and Customer.cust_id=? and Products.p_id = orders.p_id order by orderDate DESC;;"
   db.serialize(()=>{
      db.all(query,[req.session.cust_id,req.session.cust_id],(err,rows)=>{
         if(err) console.log(err);
         res.render('orders.ejs',{item:rows});
      });
   })
})



//Admin route
app.get('/admin',(req,res)=>{
   res.render('adminLogin',{authStatus:"Authenticate"});
})
app.post('/admin',(req,res)=>{
   if(req.body.userName==="shubham" && req.body.pass==="qwerty"){
      req.session.adminLoggedIn=true;
      res.redirect("/admin/allorders")
   }
   else{
      res.render('adminLogin',{authStatus:"User name or password incorrect!"});
   }
})

app.use('/admin/',express.static('public'));
app.get('/admin/allorders',(req,res)=>{
   if(req.session.adminLoggedIn==undefined)
   {
      return res.redirect('/admin');
   }
   var query="select o_id,cust_id,UserName,contact,name,cost,image,Address,orderDate,orderStatus from Products natural join orders natural join Customer order by cust_id DESC;";
   db.all(query,[],(err,rows)=>{
      if(err) console.log(err);
      res.render('allorders.ejs',{item:rows});
   });
})

app.post('/admin/changeStatus/:o_id',(req,res)=>{
   if(req.session.adminLoggedIn==undefined)
   {
      return res.redirect('/admin');
   }
   console.log(req.body.status);
   var query="UPDATE orders set orderStatus=? where o_id=?"
   db.run(query,[req.body.status,req.params.o_id],(err)=>{
      if(err) console.log(err);
      console.log("Updated Order");
   });
   res.redirect('/admin/allorders')
})

var port = process.env.PORT || 3000
app.listen(port, function (req, res) {
   console.log("Server started at port 3000");
});