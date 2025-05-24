const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const bcryptjs = require('bcryptjs')

const app = express()
app.use(cors())
app.use(bodyParser.json())

mongoose
  .connect('mongodb://127.0.0.1:27017/mdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch(error => {
    console.error('Connection error un-official', error)
  })

const port = 5500

const watchListSchema = new mongoose.Schema({
  listName: {
    type: String,
    required: true
  },
  movies: {
    type: [String],
    default: []
  }
})

const usersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  watchLists: {
    type: [watchListSchema],
    default: []
  }
})

const User = mongoose.model('user', usersSchema)

app.get('/', (req, res) => {
  res.end('Backend')
})

app.post('/login', async (req, res) => {
  // console.log(req.headers)
  const found = await User.findOne({email: req.body.email}, {password: 1, email: 1})
  if (found === null || found.length === 0) {
    res.json({msg: "You don't have an account"})
  }
  else {
    console.log(found)
    const isValid = await bcryptjs.compare(req.body.pwd, found.password)
    if (isValid) {
      res.json({ msg: "Login successful", uId: found._id, email: found.email })
    }
    else {
      res.json({ msg: "Password Incorrect" })
    }
  }
})

app.post('/signup', async (req, res) => {
  console.log(req.body)
  let found = await User.find({email: req.body.email})
  if (found.length !== 0) {
    res.json({msg: 'User already exists'})
  }
  else {
    const hashedPwd = await bcryptjs.hash(req.body.pwd, 10)
    console.log(hashedPwd)
    const newUser = new User({
      username: req.body.name,
      email: req.body.email,
      password: hashedPwd
    })
    await newUser.save()
    console.log('User inserted')
    found = await User.findOne({ email: req.body.email }, { email: 1 })
    console.log(found)
    res.json({ msg: 'Sign-in successful', uId: found._id, email: found.email })
  }
})

app.post('/getLists', async (req, res) => {
  // console.log("request printing", req.body)
  const found = await User.findOne({ email: req.body.email }, { watchLists: 1 })
  // console.log("found user", found)
  const response = found.watchLists
  // console.log("generated response", response)
  res.json({ lists: response })
})

app.post('/addList', async (req, res) => {
  console.log(req.body)
  const email = req.body.email
  const user = await User.findOne({ email: email }, { watchLists: 1 })
  console.log("user", user)
  const watchListsArray = user.watchLists
  let repeated = 0;
  for (listObj of watchListsArray) {
    if (listObj.listName === req.body.listName) {
      repeated = 1;
      res.json({ msg: `Watchlist ${listObj.listName} already exists` })
    }
  }
  if (repeated === 0) {
    watchListsArray.push({ listName: req.body.listName })
    await User.updateOne({ email: email }, {$set: { watchLists: watchListsArray }})
    res.json({ msg: "Watchlists updated" })
  }
})

app.post('/addMtoL', async (req, res) => {
  console.log(req.body)
  const email = req.body.email
  const user = await User.findOne({ email: email }, { watchLists: 1 })
  const watchListsArray = user.watchLists
  for (listObj of watchListsArray) {
    if (listObj.listName === req.body.listName) {
      if (listObj.movies.includes(req.body.movieName)) {
        res.json({ msg: `The movie ${req.body.movieName} is already in ${req.body.listName}` })
      }
      else {
        listObj.movies.push(req.body.movieName)
        await User.updateOne({ email: email }, {$set: { watchLists: watchListsArray }})
        res.json({ msg: `Added ${req.body.movieName} to ${req.body.listName}` })
      }
      break
    }
  }
  res.json({msg: 'wtf'})
})

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`)
})
