import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './styles/playlist.css'
import { Link, useNavigate } from 'react-router-dom'

function WatchList () {
  const [lists, setLists] = useState([])
  const [reRender, setReRender] = useState(false)

  const navigate = useNavigate()
  const email = localStorage.getItem('token')

  const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

  useEffect(() => {
    console.log(email, typeof email)
    if (email === "" || email === null || email === undefined) {
      navigate('/')
    }
  }, [email])

  useEffect(() => {
    // get all the watch lists
    axios.post(`${BASE_URL}/getLists`, { email: email })
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
    axios.post(`${BASE_URL}/addList`, {
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
    if (window.confirm(`Are you sure you want to remove ${movie_name} from ${listName}?`)) {
      axios.post(`${BASE_URL}/removeMfromL`, {
        email,
        listName,
        movieName: movie_name
      }).then(response => {
        console.log(response.data);
        if (response.data.msg === `Removed ${movie_name} from ${listName}`) {
          // trigger re-render
          setReRender((past) => !past)
        }
        else {
          alert(response.data.msg)
        }
      })
    }
  }
  
  function deleteWatchList(listName) {
    if (window.confirm(`Are you sure you want to delete the watchlist ${listName}?`)) {
      axios.post(`${BASE_URL}/deleteList`, {
        email,
        listName
      }).then(response => {
        console.log(response.data);
        if (response.data.msg === `Watchlist ${listName} deleted successfully`) {
          // trigger re-render
          setReRender((past) => !past)
        }
        else {
          alert(response.data.msg)
        }
      })
    }
    else {
      return
    }
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
                  return (
                    <><li className='list-item' onClick={() => {openMovie(movie_name)}} key={idx}>{movie_name}</li>
                    <button className="remove-btn" onClick={() => removeMovie(listObj.listName, movie_name)}>Remove</button><br /></>
                  )
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
