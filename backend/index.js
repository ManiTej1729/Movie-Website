require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const bcryptjs = require('bcryptjs')

const app = express()
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}))
app.use(bodyParser.json())

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch(error => {
    console.error('Connection error un-official', error)
  })

const port = process.env.PORT || 5500

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
    // console.log(found)
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
  let found = await User.find({email: req.body.email})
  if (found.length !== 0) {
    res.json({msg: 'User already exists'})
  }
  else {
    const hashedPwd = await bcryptjs.hash(req.body.pwd, 10)
    const newUser = new User({
      username: req.body.name,
      email: req.body.email,
      password: hashedPwd
    })
    await newUser.save()
    found = await User.findOne({ email: req.body.email }, { email: 1 })
    res.json({ msg: 'Sign-in successful', uId: found._id, email: found.email })
  }
})

app.post('/getLists', async (req, res) => {
  const found = await User.findOne({ email: req.body.email }, { watchLists: 1 })
  const response = found.watchLists
  res.json({ lists: response })
})

app.post('/addList', async (req, res) => {
  const email = req.body.email
  const user = await User.findOne({ email: email }, { watchLists: 1 })
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
})

app.post('/removeMfromL', async (req, res) => {
  const email = req.body.email
  const user = await User.findOne({ email: email }, { watchLists: 1 })
  const watchListsArray = user.watchLists
  for (listObj of watchListsArray) {
    if (listObj.listName === req.body.listName) {
      const movieIndex = listObj.movies.indexOf(req.body.movieName)
      if (movieIndex !== -1) {
        listObj.movies.splice(movieIndex, 1)
        await User.updateOne({ email: email }, { $set: { watchLists: watchListsArray } })
        res.json({ msg: `Removed ${req.body.movieName} from ${req.body.listName}` })
      }
      else {
        res.json({ msg: `The movie ${req.body.movieName} is not in ${req.body.listName}` })
      }
      break
    }
  }
})

app.post('/deleteList', async (req, res) => {
  const email = req.body.email
  const user = await User.findOne({ email: email }, { watchLists: 1 })
  const watchListsArray = user.watchLists
  const updatedWatchLists = watchListsArray.filter(listObj => listObj.listName !== req.body.listName)
  if (updatedWatchLists.length === watchListsArray.length) {
    res.json({ msg: `Watchlist ${req.body.listName} does not exist` })
  }
  else {
    await User.updateOne({ email: email }, { $set: { watchLists: updatedWatchLists } })
    res.json({ msg: `Watchlist ${req.body.listName} deleted successfully` })
  }
})

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`)
})
