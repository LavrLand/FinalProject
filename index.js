var express = require("express");
var app = express();
 
app.use(express.static('public'))
app.set("views", "./views");

app.listen(3000);
app.get('/',function(req,res) {
    res.sendFile('index.html');
  });
