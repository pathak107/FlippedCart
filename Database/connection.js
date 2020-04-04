const mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  database : 'flipcart'
});

connection.connect(function(err) {
    if (err) {
      console.error(err);
      return;
    }
  
    console.log('Connected succesfully');
  });

module.exports = connection;