const mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'dafu*k123',
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