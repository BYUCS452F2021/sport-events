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
      datetime              BIGINT unsigned NOT NULL,                 
      difficulty_lvl        VARCHAR(150) NOT NULL,    
      players_needed        INT unsigned NOT NULL,    
      PRIMARY KEY     (event_id)                                 
    );`;
  let createTables3 = `
    CREATE TABLE IF NOT EXISTS join_event(
      request_id           INT unsigned NOT NULL AUTO_INCREMENT,
      event_id             INT unsigned NOT NULL,               
      user_id              INT unsigned NOT NULL,      
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
    difficulty: "intermediate",
    playersNeeded: 6
  },
  {
    eventID: 2,
    creatorID: 1,
    creatorUsername: 'malcolm_reynolds',
    sport: 'Ultimate Frisbee',
    city: 'Orem',
    dateTime: 1635277000,
    difficulty: "beginning",
    playersNeeded: 14
  },
  {
    eventID: 3,
    creatorID: 2,
    creatorUsername: 'kaylee_frye',
    sport: 'Hockey',
    city: 'Lehi',
    dateTime: 1635277111,
    difficulty: "hard",
    playersNeeded: 11
  },
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
  let now = new Date().getTime();
  let stmt = 'SELECT sport_events.*, user_info.username FROM sport_events JOIN user_info ON sport_events.creator_id=user_info.user_id WHERE sport_events.datetime > ?;';
  let values = [now];
  await con.query(stmt, values, (err, results, fields) => {
    if (err) {
      res.status(400).send({message: "error querying db for upcoming events"});
      return;
    }
    let events = []
    for(record of results) {
      events.push({
        eventID: record.event_id,
        creator: record.username,
        sport: record.sport_name,
        city: record.city,
        dateTime: record.datetime,
        difficulty: record.difficulty_lvl,
        playersNeeded: record.players_needed
      })
    }
    res.send(events)
  });
});

//get events I have joined
app.get('/joined/:id', async (req, res) => {
  //todo: get events based on event membership table (approved only)
  let userID = req.params.id;
  let stmt = `SELECT sport_events.*, user_info.username FROM join_event 
                JOIN sport_events ON join_event.event_id=sport_events.event_id 
                JOIN user_info ON sport_events.creator_id=user_info.user_id
                WHERE join_event.user_id = ?;`;
  let values = [userID];
  await con.query(stmt, values, (err, results, fields) => {
    if (err) {
      res.status(400).send({message: "error querying db for my joined events"});
      return;
    }
    let events = []
    for(record of results) {
      events.push({
        eventID: record.event_id,
        creator: record.username,
        sport: record.sport_name,
        city: record.city,
        dateTime: record.datetime,
        difficulty: record.difficulty_lvl,
        playersNeeded: record.players_needed
      })
    }
    res.send(events)
  });
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
  let stmt = 'INSERT INTO sport_events (creator_id, sport_name, city, datetime, difficulty_lvl, players_needed) VALUES(?,?,?,?,?,?);';
  let values = [newEvent.creatorID, newEvent.sport, newEvent.city, newEvent.dateTime, newEvent.difficulty, newEvent.playersNeeded];
  await con.query(stmt, values, (err, results, fields) => {
    if (err) {
      console.log(err)
      res.status(400).send({message: "error inserting event into db"});
      return;
    }
    let event_id = results.insertId
    create_join_event_record(res, event_id, newEvent.creatorID);
  });
  
});

//get all events created by a particular user
app.get('/event/:id', async (req, res) => {
  let userID = req.params.id;
  let stmt = `SELECT sport_events.*, user_info.username FROM sport_events 
                JOIN user_info ON sport_events.creator_id=user_info.user_id
                WHERE sport_events.creator_id = ?;`;
  let values = [userID];
  await con.query(stmt, values, (err, results, fields) => {
    if (err) {
      res.status(400).send({message: "error querying db for events created by user"});
      return;
    }
    let events = []
    for(record of results) {
      events.push({
        eventID: record.event_id,
        creator: record.username,
        sport: record.sport_name,
        city: record.city,
        dateTime: record.datetime,
        difficulty: record.difficulty_lvl,
        playersNeeded: record.players_needed
      })
    }
    res.send(events)
  });
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
  let stmt = `UPDATE sport_events SET
                players_needed = ?,
                sport_name = ?,
                city = ?,
                datetime = ?,
                difficulty_lvl = ?
                WHERE event_id = ?;`;
  let values = [updatedEvent.playersNeeded, updatedEvent.sport, updatedEvent.city, updatedEvent.dateTime, updatedEvent.difficulty, eventID];
  await con.query(stmt, values, (err, results, fields) => {
    if (err) {
      console.log(err)
      res.status(400).send({message: "error updating event"});
      return;
    }
    res.sendStatus(200);
  });
});

let create_join_event_record = (res, eventID, userID) => {
  let stmt = 'INSERT INTO join_event (event_id, user_id) VALUES(?,?);';
  let values = [eventID, userID];
  con.query(stmt, values, (err, results, fields) => {
    if (err) {
      console.log(err)
      res.status(400).send({message: "error inserting event_join into db"});
      return;
    }
    res.sendStatus(200);
  });
}

//request to join event
app.post('/membership', async (req, res) => {
  let newMemberRequest = {
    eventID: req.body.eventID,
    userID: req.body.userID,
  };
  create_join_event_record(res, newMemberRequest.eventID, newMemberRequest.userID)
});

//manage event membership
app.delete('/membership', async (req, res) => {
  let eventID = req.body.eventID;
  let userID = req.body.userID;
  let stmt = 'DELETE FROM join_event WHERE event_id = ? AND user_id = ?';
  let values = [eventID, userID];
  await con.query(stmt, values, (err, results, fields) => {
    if (err) {
      console.log(err)
      res.status(400).send({message: "error deleting event_join from db"});
      return;
    }
    res.sendStatus(200);
  });
});

//get all members (whether approved or not) of an event
app.get('/membership/:id', async (req, res) => {
  let eventID = req.params.id;
  //todo: get all records from membership table with that eventID.
  let stmt = `SELECT user_info.username FROM join_event
                JOIN user_info ON join_event.user_id=user_info.user_id
                WHERE join_event.event_id = ?;`;
  let values = [eventID];
  await con.query(stmt, values, (err, results, fields) => {
    if (err) {
      res.status(400).send({message: "error querying db for members of event"});
      return;
    }
    let usernames = []
    for(record of results) {
      usernames.push(record.username)
    }
    res.send(usernames)
  });
});

app.listen(3000, () => console.log('Server listening on port 3000!'));
