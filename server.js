const express = require('express');
const app = express();
const path = require('path');

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/eps'));

app.get('/*', function(req,res) {
res.sendFile(path.join(__dirname+'/dist/eps/index.html'));
});

const port = process.env.PORT || 8000; //change it to 5000
app.listen(port);

console.log('Server running at http://localhost:' + port+'/');

exports.app = app
