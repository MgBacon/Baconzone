##Introduction

This project is a try at node.js and web dev in general. It's not meant to be great, but mainly a tool to ~~annoy~~ show other people what I've produced so far.

## Requirements
You will require node.js for this project (obviously) while the version number is rather irrelevant (atleast LTS) and Postgresql with a table with the following structure
```
  * ID INT (AUTO_INCREMENT)
  * quote TEXT
  * author TEXT
  * year TEXT
  * date DATE
  * UserID INT
```
## Installation

* Clone the repository.
* Run `npm install`.
* Create a `config.js` file in the root folder with the connection string for the postgresql database following structure: `module.exports.connectionString = <your db path here>;`
* Run the code by launching the server with `node app.js`.
* Break ***all*** the things!
