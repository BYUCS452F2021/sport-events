const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

// connect to the mongodb database
mongoose.connect('mongodb://localhost:27017/sport-events', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
});

const eventSchema = new mongoose.Schema({
  creatorId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  sport_name: String,
  city: String,
  datetime: Number,
  difficulty_lvl: String,
  players_needed: Number,
})

const joinSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Event'
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
})

// create models from the schemas
const User = mongoose.model('User', userSchema);
const Event = mongoose.model('Event', eventSchema)
const JoinEvent = mongoose.model('JoinEvent', joinSchema)

//   let createTables = `CREATE TABLE IF NOT EXISTS user_info(
//       user_id              INT unsigned NOT NULL AUTO_INCREMENT,
//       username             VARCHAR(150) NOT NULL UNIQUE,
//       password             VARCHAR(150) NOT NULL,
//       email                VARCHAR(150) NOT NULL UNIQUE,
//       PRIMARY KEY     (user_id)
//     );`;
//   let createTables2 = `
//     CREATE TABLE IF NOT EXISTS sport_events(
//       event_id INT unsigned NOT NULL AUTO_INCREMENT,
//       creator_id            INT unsigned NOT NULL,
//       sport_name            VARCHAR(150) NOT NULL,
//       city                  VARCHAR(150) NOT NULL,
//       datetime              BIGINT unsigned NOT NULL,
//       difficulty_lvl        VARCHAR(150) NOT NULL,
//       players_needed        INT unsigned NOT NULL,
//       PRIMARY KEY     (event_id)
//     );`;
//   let createTables3 = `
//     CREATE TABLE IF NOT EXISTS join_event(
//       request_id           INT unsigned NOT NULL AUTO_INCREMENT,
//       event_id             INT unsigned NOT NULL,
//       user_id              INT unsigned NOT NULL,
//       PRIMARY KEY     (request_id)
//     );`;

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
  console.log(req.body.username)
  console.log(req.body.password)
  console.log(req.body.email)
  // if (!req.body.username || !req.body.password || !req.body.email) {
  //   res.status(400).send({message: "missing request info"})
  //   return
  // }

  try {
    let user = await User.findOne({
      username: req.body.username
    });

    if (user) {
      res.status(400).send({message: "username already exists"})
      return
    }

    user = new User({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
    });
    user.save()
    res.send({userID: user._id});
    return;
  } catch(error) {
    console.log(error)
    res.status(500).send({message: "server error"})
    return
  }
});

//login
app.post('/login', async (req, res) => {
  // if (!req.body.username || !req.body.password) {
  //   res.status(400).send({message: "missing request info"})
  //   return
  // }

  try {
    const user = await User.findOne({
      username: req.body.username,
      password: req.body.password
    })

    console.log(user)
    if (!user) {
      res.status(400).send({message: "username or password incorrect"})
      return
    }
    res.send({userID: user._id});
    return;
  } catch(error) {
    res.status(400).send({message: "server error"})
    return
  }
});

// //get upcoming events
// app.get('/upcoming', async (req, res) => {
//   //todo: find all events not yet passed, join with user table, return it
//   let now = new Date().getTime();
//   let stmt = 'SELECT sport_events.*, user_info.username FROM sport_events JOIN user_info ON sport_events.creator_id=user_info.user_id WHERE sport_events.datetime > ?;';
//   let values = [now];
//   await con.query(stmt, values, (err, results, fields) => {
//     if (err) {
//       res.status(400).send({message: "error querying db for upcoming events"});
//       return;
//     }
//     let events = []
//     for(record of results) {
//       events.push({
//         eventID: record.event_id,
//         creator: record.username,
//         sport: record.sport_name,
//         city: record.city,
//         dateTime: record.datetime,
//         difficulty: record.difficulty_lvl,
//         playersNeeded: record.players_needed
//       })
//     }
//     res.send(events)
//   });
// });
//
// //get events I have joined
// app.get('/joined/:id', async (req, res) => {
//   //todo: get events based on event membership table (approved only)
//   let userID = req.params.id;
//   let stmt = `SELECT sport_events.*, user_info.username FROM join_event
//                 JOIN sport_events ON join_event.event_id=sport_events.event_id
//                 JOIN user_info ON sport_events.creator_id=user_info.user_id
//                 WHERE join_event.user_id = ?;`;
//   let values = [userID];
//   await con.query(stmt, values, (err, results, fields) => {
//     if (err) {
//       res.status(400).send({message: "error querying db for my joined events"});
//       return;
//     }
//     let events = []
//     for(record of results) {
//       events.push({
//         eventID: record.event_id,
//         creator: record.username,
//         sport: record.sport_name,
//         city: record.city,
//         dateTime: record.datetime,
//         difficulty: record.difficulty_lvl,
//         playersNeeded: record.players_needed
//       })
//     }
//     res.send(events)
//   });
// });
//
// //create new event
// app.post('/event', async (req, res) => {
//   //todo: insert new event into table
//   let newEvent = {
//     creatorID: req.body.userID,
//     sport: req.body.sport,
//     city: req.body.city,
//     dateTime: req.body.dateTime,
//     difficulty: req.body.difficulty,
//     playersNeeded: req.body.playersNeeded
//   };
//   let stmt = 'INSERT INTO sport_events (creator_id, sport_name, city, datetime, difficulty_lvl, players_needed) VALUES(?,?,?,?,?,?);';
//   let values = [newEvent.creatorID, newEvent.sport, newEvent.city, newEvent.dateTime, newEvent.difficulty, newEvent.playersNeeded];
//   await con.query(stmt, values, (err, results, fields) => {
//     if (err) {
//       console.log(err)
//       res.status(400).send({message: "error inserting event into db"});
//       return;
//     }
//     let event_id = results.insertId
//     create_join_event_record(res, event_id, newEvent.creatorID);
//   });
//
// });
//
// //get all events created by a particular user
// app.get('/event/:id', async (req, res) => {
//   let userID = req.params.id;
//   let stmt = `SELECT sport_events.*, user_info.username FROM sport_events
//                 JOIN user_info ON sport_events.creator_id=user_info.user_id
//                 WHERE sport_events.creator_id = ?;`;
//   let values = [userID];
//   await con.query(stmt, values, (err, results, fields) => {
//     if (err) {
//       res.status(400).send({message: "error querying db for events created by user"});
//       return;
//     }
//     let events = []
//     for(record of results) {
//       events.push({
//         eventID: record.event_id,
//         creator: record.username,
//         sport: record.sport_name,
//         city: record.city,
//         dateTime: record.datetime,
//         difficulty: record.difficulty_lvl,
//         playersNeeded: record.players_needed
//       })
//     }
//     res.send(events)
//   });
// });
//
// //edit event
// app.put('/event/:id', async (req, res) => {
//   //todo: find event with eventID, update it.
//   let eventID = req.params.id;
//   let updatedEvent = {
//     sport: req.body.sport,
//     city: req.body.city,
//     dateTime: req.body.dateTime,
//     difficulty: req.body.difficulty,
//     playersNeeded: req.body.playersNeeded
//   };
//   let stmt = `UPDATE sport_events SET
//                 players_needed = ?,
//                 sport_name = ?,
//                 city = ?,
//                 datetime = ?,
//                 difficulty_lvl = ?
//                 WHERE event_id = ?;`;
//   let values = [updatedEvent.playersNeeded, updatedEvent.sport, updatedEvent.city, updatedEvent.dateTime, updatedEvent.difficulty, eventID];
//   await con.query(stmt, values, (err, results, fields) => {
//     if (err) {
//       console.log(err)
//       res.status(400).send({message: "error updating event"});
//       return;
//     }
//     res.sendStatus(200);
//   });
// });
//
// let create_join_event_record = (res, eventID, userID) => {
//   let stmt = 'INSERT INTO join_event (event_id, user_id) VALUES(?,?);';
//   let values = [eventID, userID];
//   con.query(stmt, values, (err, results, fields) => {
//     if (err) {
//       console.log(err)
//       res.status(400).send({message: "error inserting event_join into db"});
//       return;
//     }
//     res.sendStatus(200);
//   });
// }
//
// //request to join event
// app.post('/membership', async (req, res) => {
//   let newMemberRequest = {
//     eventID: req.body.eventID,
//     userID: req.body.userID,
//   };
//   create_join_event_record(res, newMemberRequest.eventID, newMemberRequest.userID)
// });
//
//manage event membership
app.delete('/membership/:eventId/:userId', async (req, res) => {
  try {
    const membership = JoinEvent.deleteOne({
      event_id: req.params.eventId,
      user_id: req.params.userId
    })
    res.sendStatus(200)
  } catch(error) {
    res.status(500).send({message: "server error"})
    return
  }
});

// //get all members (whether approved or not) of an event
// app.get('/membership/:id', async (req, res) => {
//   let eventID = req.params.id;
//   //todo: get all records from membership table with that eventID.
//   let stmt = `SELECT user_info.username FROM join_event
//                 JOIN user_info ON join_event.user_id=user_info.user_id
//                 WHERE join_event.event_id = ?;`;
//   let values = [eventID];
//   await con.query(stmt, values, (err, results, fields) => {
//     if (err) {
//       res.status(400).send({message: "error querying db for members of event"});
//       return;
//     }
//     let usernames = []
//     for(record of results) {
//       usernames.push(record.username)
//     }
//     res.send(usernames)
//   });
// });

app.listen(3000, () => console.log('Server listening on port 3000!'));
