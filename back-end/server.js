const express = require('express');
const bodyParser = require("body-parser");
const mysql = require('mysql');

let con = mysql.createConnection({
  host: "localhost",
  user: "sport-events",
  password: "CS452",
  database: 'sportevents'
});

con.connect((err) => {
  if(err) throw err;
  console.log("connected to mysql db");

  let createTables = `CREATE TABLE IF NOT EXISTS user_info(
      user_id              INT unsigned NOT NULL AUTO_INCREMENT,
      username             VARCHAR(150) NOT NULL UNIQUE,               
      password             VARCHAR(150) NOT NULL,               
      email                VARCHAR(150) NOT NULL UNIQUE,               
      PRIMARY KEY     (user_id)                                 
    );`;
  let createTables2 = `
    CREATE TABLE IF NOT EXISTS sport_events(
      event_id INT unsigned NOT NULL AUTO_INCREMENT,
      creator_id            INT unsigned NOT NULL,              
      sport_name            VARCHAR(150) NOT NULL,               
      city                  VARCHAR(150) NOT NULL,               
      time              TIME NOT NULL,               
      date              DATE NOT NULL,                 
      difficulty_lvl        VARCHAR(150) NOT NULL,    
      players_needed        INT unsigned NOT NULL,    
      PRIMARY KEY     (event_id)                                 
    );`;
  let createTables3 = `
    CREATE TABLE IF NOT EXISTS join_event(
      request_id           INT unsigned NOT NULL AUTO_INCREMENT,
      event_id             INT unsigned NOT NULL,               
      user_id              INT unsigned NOT NULL,               
      accepted         VARCHAR(150) NOT NULL,                
      PRIMARY KEY     (request_id)                           
    );`;

  con.query(createTables, function(err, results, fields) {
    if (err) {
      console.log(err.message);
    }
  });
  con.query(createTables2, function(err, results, fields) {
    if (err) {
      console.log(err.message);
    }
  });
  con.query(createTables3, function(err, results, fields) {
    if (err) {
      console.log(err.message);
    }
  });
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

let fakeEvents = [
  {
    eventID: 1,
    creatorID: 1,
    creatorUsername: 'malcolm_reynolds',
    sport: 'Basketball',
    city: 'Provo',
    dateTime: 1635277954,
    difficulty: 3,
    playersNeeded: 6
  },
  {
    eventID: 2,
    creatorID: 1,
    creatorUsername: 'malcolm_reynolds',
    sport: 'Ultimate Frisbee',
    city: 'Orem',
    dateTime: 1635277000,
    difficulty: 1,
    playersNeeded: 14
  },
  {
    eventID: 3,
    creatorID: 2,
    creatorUsername: 'kaylee_frye',
    sport: 'Hockey',
    city: 'Lehi',
    dateTime: 1635277111,
    difficulty: 8,
    playersNeeded: 11
  },
];

let fakeMembership = [
  {
    eventID: 1,
    userID: 1,
    approved: true
  },
  {
    eventID: 1,
    userID: 2,
    approved: true
  },
  {
    eventID: 1,
    userID: 3,
    approved: false
  }
];

//register
app.post('/register', async (req, res) => {
  let user = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  };
  //todo: put user in the db. if username already exists, send failure message. otherwise, send userID of new user.
  let stmt = 'INSERT INTO user_info (username, password, email) VALUES(?,?,?);';
  let values = [user.username, user.password, user.email];
  await con.query(stmt, values, (err, results, fields) => {
    if (err) {
      res.status(400).send({message: "username already taken"});
      return;
    }
    res.send({userID: results.insertId});
  });
});

//login
app.post('/login', async (req, res) => {
  let credentials = {
    username: req.body.username,
    password: req.body.password
  };
  //todo: check to see if credentials exist in the db (and they match). If yes, send userID of user, else send failure.
  let stmt = 'SELECT user_id, password FROM user_info WHERE username = ?;';
  let values = [credentials.username];
  await con.query(stmt, values, (err, results, fields) => {
    if (err) {
      res.status(400).send({message: "unkown error"});
      return;
    }
    if(results.length == 0) {
      res.status(400).send({message: "incorrect credentials"});
      return;
    }
    if (results[0].password == credentials.password) {
      res.send({userID: results[0].user_id});
      return;
    }
    res.status(400).send({message: "incorrect credentials"});
  });
});

//get upcoming events
app.get('/upcoming', async (req, res) => {
  //todo: find all events not yet passed, join with user table, return it
  res.send(fakeEvents);
});

//get events I have joined
app.get('/joined', async (req, res) => {
  //todo: get events based on event membership table (approved only)
  let userID = req.body.userID;
  res.send(fakeEvents);
});

//create new event
app.post('/event', async (req, res) => {
  //todo: insert new event into table
  let newEvent = {
    creatorID: req.body.userID,
    sport: req.body.sport,
    city: req.body.city,
    dateTime: req.body.dateTime,
    difficulty: req.body.difficulty,
    playersNeeded: req.body.playersNeeded
  };
  res.send();
});

//edit event
app.put('/event/:id', async (req, res) => {
  //todo: find event with eventID, update it.
  let eventID = req.params.id;
  let updatedEvent = {
    sport: req.body.sport,
    city: req.body.city,
    dateTime: req.body.dateTime,
    difficulty: req.body.difficulty,
    playersNeeded: req.body.playersNeeded
  };
  res.send();
});

//request to join event
app.post('/membership', async (req, res) => {
  let newMemberRequest = {
    eventID: req.body.eventID,
    userID: req.body.userID,
    approved: false
  };
  res.send();
});

//manage event membership
app.put('/membership', async (req, res) => {
  let eventID = req.body.eventID;
  let userID = req.body.userID;
  let approved = req.body.approved;
  //todo: update the membership with the new approval status
  res.send();
});

//get all members (whether approved or not) of an event
app.get('/membership/:id', async (req, res) => {
  let eventID = req.params.id;
  //todo: get all records from membership table with that eventID.
  res.send(fakeMembership);
});

app.listen(3000, () => console.log('Server listening on port 3000!'));
