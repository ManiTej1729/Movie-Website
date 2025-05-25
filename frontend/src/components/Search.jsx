import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

function Search () {
  const inpField = useRef('')

  const navigate = useNavigate()
  const basicStyles = ['', '', '', '', '', 'last']
  const stylesList = [
    ...basicStyles,
    ...basicStyles,
    ...basicStyles,
    ...basicStyles,
    ...basicStyles,
    ...basicStyles,
    ...basicStyles,
    ...basicStyles,
    ...basicStyles,
    ...basicStyles
  ]

  const [params] = useSearchParams()
  const query = params.get('s')
  const apikey = '8e52cc67'

  const defaultObj = {
    name: "Loading...",
    src: "",
    style: ''
  }
  const [movies, setMovies] = useState([defaultObj, defaultObj, defaultObj, defaultObj, defaultObj, defaultObj, defaultObj, defaultObj, defaultObj, defaultObj])

  useEffect(() => {
    axios
      .get(`http://www.omdbapi.com/?s=${query}&apikey=${apikey}`)
      .then(response => {
        console.log(response.data)
        const tempMovies = response.data.Search
        let idx = 0
        for (let movie of tempMovies) {
          movies[idx] = {
            name: movie.Title,
            src: movie.Poster,
            style: stylesList[idx]
          }
          idx++
        }
        setMovies([...movies])
      })
  }, [query])

  function handleSearch () {
    console.log(inpField.current.value)
    let movieName = inpField.current.value
    movieName.replace(/ /g, '+')
    navigate(`/search?s=${movieName}`)
  }

  function openMovie (movieName) {
    console.log(movieName)
    movieName.replace(/ /g, '+')
    navigate(`/title?t=${movieName}`)
  }

  return (
    <div id='shell'>
      <div id='header'>
        <h1 id='logo' className='center'>
          FasalMovies
        </h1>
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
              className='blink search-field'
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
          <div className='box'>
            <div className='head'>
              <p>TOP RESULTS</p>
              <br />
              <p className='text-right'>
                <a className='invis' href='/home'>
                  See all
                </a>
              </p>
            </div>
            {movies.map((movie, idx) => {
              return (
                <div className={'movie' + ' ' + movie.style} key={idx}>
                  <div className='movie-image'>
                    <img
                      loading='lazy'
                      src={movie.src}
                      alt='No poster available'
                      onClick={() => {
                        openMovie(movie.name)
                      }}
                    />
                  </div>
                  <div className='rating'>
                    <p className='center'>{movie.name}</p>
                  </div>
                </div>
              )
            })}
            <br />
          </div>
          <br />
        </div>
        <div className='cl'>&nbsp;</div>
      </div>
      <div id='footer'>
        <p className='lf'>
          Copyright &copy; 2024 <a href='/home'>FasalMovies</a> - All Rights
          Reserved
        </p>
      </div>
    </div>
  )
}

export default Search
