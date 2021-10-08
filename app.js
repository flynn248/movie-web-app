const express = require('express');
const info = require('./info.json');
const app = express();

const PORT = process.env.PORT || 9090

// Go to localhost:9090 in your browser while the program is running
app.get('/', (req, res) => {
    res.redirect(info.partOne + info.partTwo);
});

// Starts an http server on the $PORT environment variable
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});