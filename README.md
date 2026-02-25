# A Beginner's Guide to Building a REST API with Express.js, PostgreSQL, and Postman

Co-authored by: [Rhea Grace Catacutan](https://dev.to/catacutan_rhea)

### Ever wonder how websites 'talk'?

We know that databases store the information, but a REST API is the bridge that lets you actually move it. Here is how to build a simple API that creates, retrieves, and manages your data using Express, PostgreSQL, and Postman.

## Workshop Proper

### Prerequisites
To follow this guide, you will need the following tools:
* **Node**: A runtime environment to run JavaScript and server files.
* **PostgreSQL**: A database server to store the information used in your API.
* **VSCode**: A code editor for writing your backend logic.
* **Postman**: A tool used to test and debug HTTP requests.

If you do not have any of the following software for this workshop, go to the following links for installation:
* Node - https://nodejs.org/en/download
* PostgreSQL - https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
* VSCode - https://code.visualstudio.com/download
* Postman - https://www.postman.com/downloads/

---

## Getting Started

### 1. Initialize Node Project
We would create a new folder and open terminal to initialize the project with default configurations:
```bash
npm init -y
```
When executed, the console must output something like this:
```
Wrote to C:\Users\<path_of_working_directory>\package.json
```
_Note: package.json stores all the configurations of the node project_
### 2. Install Required Dependencies
We would be using the express (node.js web application framework), cors, pg (PostgreSQL), dotenv (environment variables) modules. 
```bash
# We can install the modules individually:
npm install <module_name>

# Or install all the required modules in one line
npm install express cors pg dotenv
```
When installing modules, the console must return something like this:
```
added 82 packages, and audited 83 packages in 5s

24 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```
### 3. Install Nodemon
Nodemon allows to run server/node.js files in real time; it updates itself when changes are being saved. The `-g` flag means we are downloading this globally, meaning this module can be reused by other node projects.
```bash
npm install -g nodemon
```
## Setup Database Connection
* Setup environment variables in a .env file. (NOTE: When using Github, always add it in the .gitignore to keep credentials private. Never show it in a repo)
```
# .env
# Sample env variable configuration
DB_USER=postgres
DB_PASSWORD=<database_password>
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=<database_name>
# 5432 is the default port where the database is stored
```
* Create Database using Postgres in either psql CLI or pgadmin interface.
  **Using psql CLI for database**: Press enter for everything aside from the password. Type the password you used when setting up your Postgres. (NOTE: It may look blank when you type but it is recording your keystrokes.)


![postgres connection in psql](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/pv0b3d9ht5uukovktvew.png)




  From here, you can now create your database.
  
  ```SQL
CREATE DATABASE your_db_name;
  ```
  
![created database in psql](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/voap0cjr30k6lg36sn7m.png)


  To use the database you have created we type `\c <database_name>` in the CLI to use the database you created.
  
![connect to database in psql](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/6l5ywhrq3vcdq284yxro.png)


  - **Table creation using pgAdmin**
  Look for your database and open the query tool.
  
![locating database in pgadmin](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/es32v1mxe3epzcj9rxrn.png)
* Here is a sample query to create a table. Say you want to keep track of the records of the clients in a company:

```SQL
CREATE TABLE client_records (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  payment_status VARCHAR(50),
  commission_status VARCHAR(50),
  deadline DATE
);
```
![querying the database in pgadmin](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5mn9g03pllkcsv5zc0t3.png)


* Click run (the play button) to execute the query. *(Note: it is possible to run the query in the psql CLI by simply copy pasting the query above)*

![query success](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/buuwzinrbz7e1b35dj28.png)


* Configure database connection node file (database.js)
```JavaScript
//database.js
const {Pool} = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

module.exports = pool;
```
* Create backend code (index.js). This is where you will place your routing logic for your REST API.
```JavaScript
//index.js

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
```
---
## What is REST API
**REST** stands for **Representational State Transfer**. It is an API that interacts with the server to transfer data, resources, and allows communication between the frontend and the backend systems. It is a simple and versatile API to use and implement as it is highly scalable and uniform.

There are 4 common routing methods for RESTful APIs: **GET, POST, PUT, and DELETE**. These would correspond to the CRUD operations: Create (POST), Read (GET), Update (PUT), and Delete (DELETE)

Let's get our hands dirty with it.

Note that the format of each routing method is as follows
```javascript
app.<route_method>(<route_path>, async(req, res) =>{ 
    try {
        //query, template, params
        //parse result
    }
    catch {
        //code to run when an error occurs
    }
});
```
**GET METHOD (READ)** - used to retrieve or show data or resources. This is typically supported with the SELECT clause in database query. <br>
Note: Status 500 - Internal Server Error
```javascript
app.get('/test', async (req, res) => {
    try {
        //Say we want to get contents of the database
        const result = await pool.query("SELECT * FROM table");
        //The * wildcard would represent all columns from the selected table.
        //You may list specific colums to display specific data.
        
        //Parse the result in JSON format
        res.json(result.rows);
    } catch (error) {
        //catch error
        console.error(error);
        res.status(500).send("An error occurred in the server");
    }
});
```

Sample Database:
```javascript
//index.js
app.get('/test', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM client_records");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred in the server");
    }
});
```

**POST METHOD (CREATE)** - create or add new resources or data. This is supported with the INSERT clause in the database query <br>
Status 201: Content Created
```javascript
app.post('/test', async (req, res) => {
    try {
        //We could create a template for parameters we would add in our database
        const {param1, param2} = req.body;

        //query new data into database. Note the order of placeholders in the query as it is replaced by the selected parameters.
        const result = await pool.query(
            "INSERT INTO table (param1, param2) VALUES ($1, $2) RETURNING *",
            [param1, param2]
        );
        //The first item in the array is what will we be returning in our created resource. The other rows are probably junk and are not needed.
        res.status(201).json(result.rows[0]);

        //send configuration of resource
        console.log("Resource created successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred in the server.");
    }
});
```

Sample Database:
```javascript
//index.js
app.post('/test', async (req, res) => {
    try {
        const { username, payment_status, commission_status, deadline } = req.body;
        const result = await pool.query(
            "INSERT INTO client_records (username, payment_status, commission_status, deadline) VALUES ($1, $2, $3, $4) RETURNING *",
            [username, payment_status, commission_status, deadline]
        );
        res.status(201).json(result.rows[0]);
        console.log("Resource created successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred in the server.");
    }
});
```


**PUT METHOD (UPDATE)** - update or modify an existing resource or data. 
```javascript
app.put('/test/:param1', async (req, res) => {
    try {
        //Create template for target parameter(s).
        const { param1 } = req.params;

        //Create template for parameter(s) we want to change 
        const { param2 } = req.body;

        //Query to modify resource
        const result = await pool.query(
            `UPDATE table SET username = $2 WHERE param1 = $1 `,
            [param1, param2]
        );
        res.status(201).json(result.rows[0]);

        //send confirmation of resource
        console.log("Resource updated successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred in the server.");
    }
});
```


Sample Database:

```javascript
//index.js
app.put('/test/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { username, payment_status, commission_status, deadline } = req.body;
        const result = await pool.query(
            "UPDATE client_records SET username = $1, payment_status = $2, commission_status = $3, deadline = $4 WHERE id = $5 RETURNING *",
            [username, payment_status, commission_status, deadline, id]
        );
        res.status(201).json(result.rows[0]);
        console.log("Resource updated successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred in the server.");
    }
});
```











**DELETE METHOD (DELETE)** - Deletes an existing resource or data
```javascript
app.delete('/test/:param1', async (req, res) => {
    try {
        //set target parameter
        const { param1 } = req.params;

        //query to delete with the target parameter
        const result = await pool.query(
            "DELETE FROM table WHERE param1 = $1",
            [param1]);
        //confirm deletion
        console.log("Resource deleted successfully");
        res.status(204).send(); 
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred in the server.");
    }
});
```


Sample Database:
```javascript
//index.js
app.delete('/test/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "DELETE FROM client_records WHERE id = $1",
            [id]);
        console.log("Resource deleted successfully");
        res.status(204).send(); 
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred in the server.");
    }
});
```
*For a complete reference of the status code refer to https://www.restapitutorial.com/httpstatuscodes*


### How to know if each of these methods are working fine?
We would use nodemon to run our backend code
```bash
nodemon index.js
```
![running nodemon on bash](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/imp0z8k7uk4h2o4e53r5.png)


Note: Ctrl+C to stop the server




We would test each method in Postman to see if the method works completely fine using the database we have created earlier, in this example, the client_db database.

**METHOD 1: GET**
Type http://localhost:8000/test to retrieve the data from your database.

![retrieve data using postman](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/my4l23ljzcnvgacka5tt.png)

(As you can see, when you type this down our database is still empty. We will change that by using the POST method.)

**METHOD 2: POST**
* Go to Body. Set to raw and JSON.
* Type down values for each attribute. <br>

Sample input:
>JSON
```json
{   
"username": "vaizravana",
"payment_status": "Fully Paid",
"commission_status": "Completed",
"deadline": "2025-07-12"
}
```
* Click Send.

![post method in postman](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/suzeqqexevpzrjahzfzw.png)

* Now let’s check using GET method. We now have successfully created our first data.

![get method in postman, showing the first row of data](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/1yn3n81gvas5kwjcl191.png)



**METHOD 3: PUT**
* To change the values, use the PUT method. In this example, we want to alter the payment_status and commission_status of himari.

(Post this input to have 2 data set on your database.)
> JSON
```json
{
"username": "himari",
"payment_status": "Partially Paid",
"commission_status": "Work in Progress",
"deadline": "2026-02-26T16:00:00.000Z"
}
```
You must get this kind of output in Postman

![Postman output having two rows of data in the database](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/xg6rt28lbg00tzdbwhon.png)



* Now, add the index of what you want to change to the url. In this case, 
```
http://localhost:8000/test/2
```

* Go to Body. Set to raw and JSON.
* Write down all the attributes and change what is needed.

Sample input:
>JSON
```json
{
"username": "himari",
"payment_status": "Fully Paid",
"commission_status": "Completed",
"deadline": "2026-02-26T16:00:00.000Z"
}
```
* Click Send. The changes have been now added.

![put method in postman](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/yxsm6puyaiuz34y440lz.png)


![put method in postman verified by get method](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/2mkgpaw1rzye5socohmp.png)




**METHOD 4: DELETE**
* To choose what data to delete, just add the index at the end of the url.
```
http://localhost:8000/test/2
```
* Click Send.

![delete method in postman](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/m7mihz9eie5o6m4ho1rj.png)



* “id” : 2 has now been deleted.


![delete method successful as shown by get method](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/43b0et3zsf33saozzwit.png)





---



## Conclusion

**Congratulations!** You have successfully created a REST API! You may use this interface in your own website or software and connect with the frontend (if you want), or now that you know how to create a basic REST API, you can experiment further with different routing methods, query optimization, more on express.js and node, and others.

Based on experience, learning how to use and implement API for the first time feels like climbing a steep mountain without any proper equipment or tools, especially when it is required for a project. However, learning REST API is straightforward, as it uses familiar HTTP requests such as the GET, POST, PUT, and DELETE. It is also highly scalable with its statelessness, making it process server-side requests very quickly. Moreover, Express.js provides templates for each routing method making RESTful APIs simpler to implement.


## References:
* https://www.restapitutorial.com/introduction
* https://www.geeksforgeeks.org/node-js/rest-api-introduction/
* https://www.youtube.com/watch?v=ldYcgPKEZC8
* https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
* https://www.w3schools.com/postgresql/index.php
* https://expressjs.com/en/guide/routing.html
* https://expressjs.com/en/starter/installing.html
* https://www.geeksforgeeks.org/blogs/why-rest-api-is-important-to-learn/
* https://blog.alexrusin.com/5-key-benefits-of-using-express-in-your-node-js-projects/







