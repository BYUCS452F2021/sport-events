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

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

//register
app.post('/register', async (req, res) => {
  if (!req.body.username || !req.body.password || !req.body.email) {
    res.status(400).send({message: "missing request info"})
    return
  }

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
    await user.save()
    res.send({userID: user._id});
  } catch(error) {
    console.log(error)
    res.status(500).send({message: "server error"})
  }
});

//login
app.post('/login', async (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).send({message: "missing request info"})
    return
  }

  try {
    const user = await User.findOne({
      username: req.body.username,
      password: req.body.password
    })

    if (!user) {
      res.status(400).send({message: "username or password incorrect"})
      return
    }
    res.send({userID: user._id});
  } catch(error) {
    res.status(500).send({message: "server error"})
  }
});

//get upcoming events
app.get('/upcoming', async (req, res) => {
  let now = new Date().getTime();
  try {
    const events = await Event.find({
      datetime: {$gt: now}
    }).populate("creatorId")
    let ret = []
    for(record of events) {
      ret.push({
        eventID: record._id,
        creator: record.creatorId.username,
        sport: record.sport_name,
        city: record.city,
        dateTime: record.datetime,
        difficulty: record.difficulty_lvl,
        playersNeeded: record.players_needed
      })
    }
    res.send(ret)
  } catch(error) {
    res.status(500).send({message: "server error"})
  }
});

//get events I have joined
app.get('/joined/:id', async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id
    })
    const joins = await JoinEvent.find({
      userId: user
    }).populate({
      path: "eventId",
      populate: {path: "creatorId"}
    })
    let ret = []
    for(record of joins) {
      ret.push({
        eventID: record.eventId._id,
        creator: record.eventId.creatorId.username,
        sport: record.eventId.sport_name,
        city: record.eventId.city,
        dateTime: record.eventId.datetime,
        difficulty: record.eventId.difficulty_lvl,
        playersNeeded: record.eventId.players_needed
      })
    }
    res.send(ret)
  } catch(error) {
    res.status(500).send({message: "server error"})
  }
});

//create new event
app.post('/event', async (req, res) => {
  //todo: insert new event into table
  try {
    let user = await User.findOne({
      _id: req.body.userID
    })
    if(!user) {
      res.status(400).send({message: "unable to insert event because associated user does not exist"})
    }
    let newEvent = new Event({
      creatorId: user,
      sport_name: req.body.sport,
      city: req.body.city,
      datetime: req.body.dateTime,
      difficulty_lvl: req.body.difficulty,
      players_needed: req.body.playersNeeded
    });
    await newEvent.save()
    create_join_event_record(res, newEvent._id, newEvent.creatorId._id);
  } catch(error) {
    res.status(500).send({message: "server error"})
  }
});

//get all events created by a particular user
app.get('/event/:id', async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id
    })
    const events = await Event.find({
      creatorId: user
    })
    let ret = []
    for(record of events) {
      ret.push({
        eventID: record._id,
        creator: user.username,
        sport: record.sport_name,
        city: record.city,
        dateTime: record.datetime,
        difficulty: record.difficulty_lvl,
        playersNeeded: record.players_needed
      })
    }
    res.send(ret)
  } catch(error) {
    res.status(500).send({message: "server error"})
  }
});

//edit event
app.put('/event/:id', async (req, res) => {
  try {
    let event = await Event.findOne({
      _id: req.params.id
    })
    event.sport_name = req.body.sport
    event.city = req.body.city
    event.datetime = req.body.dateTime
    event.difficulty_lvl = req.body.difficulty
    event.players_needed = req.body.playersNeeded
    await event.save()
    res.sendStatus(200)
  } catch(error) {
    res.status(500).send({message: "server error"})
  }
});

let create_join_event_record = async (res, eventID, userID) => {
  try {
    let event = await Event.findOne({
      _id: eventID
    })
    let user = await User.findOne({
      _id: userID
    })
    if(!event || !user) {
      res.status(400).send({message: "unable to insert join event because event or user does not exist"})
      return
    }
    let membership = new JoinEvent({
      eventId: event,
      userId: user
    })
    await membership.save()
    res.sendStatus(200)
  } catch(error) {
    res.status(500).send({message: "server error"})
  }
}

//request to join event
app.post('/membership', async (req, res) => {
  create_join_event_record(res, req.body.eventID, req.body.userID)
});

//manage event membership
app.delete('/membership/:eventId/:userId', async (req, res) => {
  console.log("eventId " + req.params.eventId)
  console.log("userId " + req.params.userId)
  try {
    const membership = await JoinEvent.deleteOne({
      eventId: req.params.eventId,
      userId: req.params.userId
    })
    if(!membership) {
      res.status(400).send({message: "eventId or userId does not exist"})
      return
    }
    res.sendStatus(200)
  } catch(error) {
    res.status(500).send({message: "server error"})
  }
});

//get all members (whether approved or not) of an event
app.get('/membership/:id', async (req, res) => {
  try {
    let event = await Event.findOne({
      _id: req.params.id
    })
    const membership = await JoinEvent.find({
      eventId: event,
    }).populate("userId");
    console.log("membership");
    console.log(membership);
    let users = []
    for(record of membership) {
      users.push(record.userId)
    }
    res.send(users)
  } catch(error) {
    res.status(500).send({message: "server error"})
  }
});

app.listen(3000, () => console.log('Server listening on port 3000!'));
