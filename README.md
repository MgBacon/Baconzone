##Introduction

This project is a try at node.js and web dev in general. It's not meant to be great, but mainly a tool to ~~annoy~~ show other people what I've produced so far.

## Requirements
You will require node.js for this project (obviously) while the version number is rather irrelevant (atleast LTS) and Postgresql with a table with the following structure:
(note that this table can still be expanded upon as I add functions)
```
TABLE quotes(
   id SERIAL,
   quote text,
   author text,
   year text,
   date date,
);
```

## Installation

* Clone the repository: `https://github.com/MgBacon/Baconzone.git`.
* Run `npm install` in your console.
* Create a `config.js` file in the root folder with the connection string for the postgresql database following structure: `module.exports.connectionString = <your db path here>;`
* Run the code by launching the server with `node app.js`.
* Connect to the server by typing `localhost:3000` into your browser.
* Break ***all*** the things!
