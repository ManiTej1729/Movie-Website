import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './styles/playlist.css'
import { Link, useNavigate } from 'react-router-dom'

function WatchList () {
  const [lists, setLists] = useState([])
  const [reRender, setReRender] = useState(false)

  const navigate = useNavigate()
  const email = localStorage.getItem('token')

  useEffect(() => {
    console.log(email, typeof email)
    if (email === "" || email === null || email === undefined) {
      navigate('/')
    }
  }, [email])

  useEffect(() => {
    // get all the watch lists
    axios.post('http://localhost:5500/getLists', { email: email })
    .then(response => {
      console.log(response.data)
      setLists(response.data.lists)
    })
  }, [reRender])

  function openMovie (movieName) {
    console.log(movieName)
    movieName.replace(/ /g, '+')
    navigate(`/title?t=${movieName}`)
  }

  function createWatchList() {
    const listName = prompt("Enter the new watch list's name")
    console.log(listName, typeof listName)
    if (listName === "") {
      return
    }
    axios.post('http://localhost:5500/addList', {
      listName,
      email
    }).then(response => {
      console.log(response.data);
      if (response.data.msg === `Watchlist ${listName} already exists`) {
        alert(response.data.msg)
      }
      else {
        // trigger re-render
        setReRender((past) => !past)
      }
    })
  }

  function removeMovie(listName, movie_name) {
    console.log(listName, movie_name)
  }
  
  function deleteWatchList(listName) {
    console.log(listName)
  }

  return (
    <div id='shell'>
      <div id='header'>
        <h1 id='logo' className='center'>
          Watch Lists
        </h1>
        <div id='sub-navigation'>
          <ul>
            <li>
              <Link to='/home'>HOME</Link>
            </li>
            <li>
              <Link to='/'>LOGOUT</Link>
            </li>
          </ul>
        </div>
      </div>
      <div id='main'>
        {lists.map((listObj, idx) => {
          return (
            <div className="list" key={idx}>
              <button
                className="delete-button"
                onClick={() => {deleteWatchList(listObj.listName)}}
              >
                Delete
              </button>
              <h2>{listObj.listName}</h2>
              <ul>
                {listObj.movies.map((movie_name, idx) => {
                  return <li onClick={() => {openMovie(movie_name)}} key={idx}>{movie_name}<button className="remove-btn" onClick={removeMovie(listObj.listName, movie_name)}>Remove</button></li>
                })}
              </ul>
            </div>
          )
        })}
        <div className='list create' onClick={createWatchList}>
          <h2>Create New WatchList</h2>
        </div>
      </div>
    </div>
  )
}

export default WatchList
