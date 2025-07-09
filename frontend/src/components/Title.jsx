import { useRef, useState, useEffect } from 'react'
import axios from 'axios'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import './styles/movie.css'

function Title () {
  const inpField = useRef('')

  const email = localStorage.getItem('token')

  const navigate = useNavigate()

  const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

  const apikey = process.env.OMDB_API_KEY
  if (!apikey) {
    console.error('OMDB_API_KEY is not defined in the environment variables.')
  }
  const [params] = useSearchParams()
  const title = params.get('t')
  const movie = {
    Title: 'Loading...',
    Released: 'Loading...',
    Rated: 'Loading...',
    Runtime: 'Loading...',
    Actors: 'Loading...',
    Director: 'Loading...',
    Genre: 'Loading...',
    Language: 'Loading...',
    Poster: 'Loading...',
    Plot: 'Loading...',
    Ratings: ['Loading...', 'Loading...', 'Loading...'],
    imdbID: 'Loading...'
  }

  const [movieData, setData] = useState(movie)
  const [modal, setModal] = useState('modal')
  const [shellClass, setShellClass] = useState('')
  const [lists, setLists] = useState([])

  useEffect(() => {
    axios
      .get(`http://www.omdbapi.com/?t=${title}&apikey=${apikey}`)
      .then(response => {
        // console.log(response.data)
        setData(oldData => {
          const ratings = ['', '', '']
          for (let item of response.data.Ratings) {
            if (item.Source === 'Internet Movie Database') {
              ratings[0] = item.Value
            }
            if (item.Source === 'Rotten Tomatoes') {
              ratings[1] = item.Value
            }
            if (item.Source === 'Metacritic') {
              ratings[2] = item.Value
            }
          }
          return {
            Title: response.data.Title,
            Released: response.data.Released,
            Rated: response.data.Rated,
            Runtime: response.data.Runtime,
            Actors: response.data.Actors,
            Director: response.data.Director,
            Genre: response.data.Genre,
            Language: response.data.Language,
            Poster: response.data.Poster,
            Plot: response.data.Plot,
            Ratings: ratings,
            imdbID: response.data.imdbID
          }
        })
      })
  }, [title])

  useEffect(() => {
    // get all the watch lists
    axios.post(`${BASE_URL}/getLists`, { email: email })
    .then(response => {
      const wholeData = response.data.lists
      setLists(() => {
        return [...wholeData]
      })
    })
  }, [title])

  function handleSearch () {
    console.log(inpField.current.value)
    let movieName = inpField.current.value
    movieName.replace(/ /g, '+')
    navigate(`/search?s=${movieName}`)
  }

  function showModal () {
    setModal((modal) => modal + ' ' + 'flex')
    setShellClass('fade-background')
  }
  
  function closeModal () {
    setModal((modal) => modal.slice(0, 5))
    setShellClass('')
  }

  function addToWatchList(listName) {
    console.log(listName)
    let movieName = title
    axios.post(`${BASE_URL}/addMtoL`, {
      email: email,
      listName: listName,
      movieName: movieName
    }).then(response => {
      console.log(response.data)
      if (response.data.msg === `The movie ${movieName} is already in ${listName}`) {
        alert(response.data.msg)
      }
      else {
        console.log(response.data.msg)
        alert(response.data.msg)
      }
    })
  }

  return (
    <div>
      <div id='shell' className={shellClass}>
        <div id='header'>
          <h1 id='logo'>FasalMovies</h1>
          <div id='sub-navigation'>
            <ul>
              <li>
                <Link to='/home'>HOME</Link>
              </li>
              <li>
                <Link to='/playlists'>PLAYLISTS</Link>
              </li>
              <li>
                <Link to='/'>LOGOUT</Link>
              </li>
            </ul>
            <div id='search'>
              <input
                type='text'
                placeholder='Enter search here'
                id='search-field'
                className='search-field'
                ref={inpField}
              />
              <button className='search-button' onClick={handleSearch}>
                Go
              </button>
            </div>
          </div>
        </div>
        <div id='main'>
          <div id='content'>
            <div className='movie-detail'>
              <div className='movie-image'>
                <img
                  loading='lazy'
                  src={movieData['Poster']}
                  alt='Movie Poster'
                />
              </div>
              <div className='movie-info'>
                <h2 className='movie-title'>{movieData['Title']}</h2>
                <p>Release Date: {movieData['Released']}</p>
                <p>Rated: {movieData['Rated']}</p>
                <p>Duration: {movieData['Runtime']}</p>
                <p>Cast: {movieData['Actors']}</p>
                <p>Director: {movieData['Director']}</p>
                <p>Genres: {movieData['Genre']}</p>
                <p>Languages: {movieData['Language']}</p>
                <p>{movieData['Plot']}</p>
                <div className='movie-ratings'>
                  <p>IMDB: {movieData['Ratings'][0]}</p>
                  <p>Rotten Tomatoes: {movieData['Ratings'][1]}</p>
                  <p>Metacritic: {movieData['Ratings'][2]}</p>
                </div>
                <button className='add-watchlist-button' onClick={showModal}>
                  Add to Watch List
                </button>
                <p className='invis' id='imdbID'>
                  {movieData['imdbID']}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="modal" className={modal}>
        <div className="modal-content">
          <div className="modal-header">Select a Watch List</div>
          <ul className="modal-list">
          {lists.map((listObj, idx) => {
            return <li onClick={() => { addToWatchList(listObj.listName)} } key={idx}>{listObj.listName}</li>
          })}
          </ul>
          <button className="close-button" onClick={closeModal}>Close</button>
        </div>
      </div>
    </div>
  )
}

export default Title
