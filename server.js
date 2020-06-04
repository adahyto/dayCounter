//Install express server
const express = require('express');
const path = require('path');

const app = express();

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/licznik'));

app.get("/service-worker.js", (req, res) => {
  res.sendFile(path.resolve(__dirname + '/dist/licznik/ngsw-worker.js'));
});

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname + '/dist/licznik/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
