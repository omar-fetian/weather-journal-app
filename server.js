// Setup empty JS object to act as endpoint for all routes
let projectData = {};

// Require Express to run server and routes
const express = require("express");
// Start up an instance of app
const app = express();

/*Start of Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require("cors");
app.use(cors());
/*End Middleware*/

// Initialize the main project folder
app.use(express.static('website'));


// Spin up the server
const port = 3000;
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));


// Post Route
app.post('/add', (req, res) => {
  projectData = req.body;
  console.log(projectData);
});


// Callback function to complete GET '/all'
app.get('/all', (req, res) => {
  res.send(projectData);
});