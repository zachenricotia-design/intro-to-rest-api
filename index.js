//include module headers
const express = require('express');
const pool = require('./database');
const cors = require('cors');

//initialize port number your server wants to listen to
const PORT = 8000;

//Create an express app. This is where operations in the 
//backend are used.
const app = express();

//Declare middleware.
//Allow the server to load resources from other origins
app.use(cors());
//Parse JSON data in requests
app.use(express.json());

//routing methods go here.

//Listen for connections. This creates the localhost server.
app.listen(PORT, () =>{
    console.log(`Server running at http://localhost:${PORT}`)
});