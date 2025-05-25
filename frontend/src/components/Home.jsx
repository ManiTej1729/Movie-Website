import React, { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './styles/home.css'

function Home () {
  const inpField = useRef('')

  const navigate = useNavigate()

  const stylesList = ['', '', '', '', '', 'last']
  const sources1 = [
    'https://m.media-amazon.com/images/M/MV5BNDBhNDJiMWEtOTg4Yi00NTYzLWEzOGMtMjNmNjAxNTBlMzY3XkEyXkFqcGdeQXVyNTIzOTk5ODM@._V1_.jpg',
    'https://image.tmdb.org/t/p/original/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    'https://m.media-amazon.com/images/I/71DwIcSgFcS.jpg',
    'https://images.jdmagicbox.com/comp/jd_social/news/2018jul13/image-46993-40zlbvqplm.jpg',
    'https://images-cdn.ubuy.co.in/6350e84bd5194b74054681be-ytch-movie-poster-gladiator-canvas-art.jpg',
    'https://image.tmdb.org/t/p/original/gLhHHZUzeseRXShoDyC4VqLgsNv.jpg'
  ]
  const sources2 = [
    'https://m.media-amazon.com/images/I/81218n6JFgL._AC_UF1000,1000_QL80_.jpg',
    'https://m.media-amazon.com/images/M/MV5BMzU3YWYwNTQtZTdiMC00NjY5LTlmMTMtZDFlYTEyODBjMTk5XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_FMjpg_UX1000_.jpg',
    'https://m.media-amazon.com/images/I/51qboNmFw3L._AC_UF894,1000_QL80_.jpg',
    'https://i.etsystatic.com/10683147/r/il/d6e3c2/2049546509/il_570xN.2049546509_n8i9.jpg',
    'https://img.fruugo.com/product/5/25/14537255_max.jpg',
    'https://m.media-amazon.com/images/M/MV5BMjEzNzM2MjgxMF5BMl5BanBnXkFtZTcwNTQ1MTM0Mg@@._V1_.jpg'
  ]
  const movie_names1 = [
    'X-MEN',
    'INTERSTELLAR',
    'INCEPTION',
    'VALKYRIE',
    'GLADIATOR',
    'ICE AGE'
  ]
  const movie_names2 = [
    'OPPENHEIMER',
    'TENET',
    'KUNG FU PANDA',
    'EAGLE EYE',
    'NARNIA',
    'ANGELS & DEMONS'
  ]
  const indices = [0, 1, 2, 3, 4, 5]

  const movies1 = []
  const movies2 = []

  for (let idx of indices) {
    movies1.push({
      key: idx,
      name: movie_names1[idx],
      src: sources1[idx],
      style: stylesList[idx]
    })

    movies2.push({
      key: idx,
      name: movie_names2[idx],
      src: sources2[idx],
      style: stylesList[idx]
    })
  }

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
              <p>MOVIES & TV SHOWS</p><br />
              <p className='text-right'>
                <a className='invis' href='/home'>
                  See all
                </a>
              </p>
            </div>
            {movies1.map(movie => {
              return (
                <div className={'movie' + " " + movie.style} key={movie.key}>
                  <div className='movie-image'>
                    <img
                      loading='lazy'
                      src={movie.src}
                      alt=''
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
          </div><br />
          <div className='box'>
            <div className='head'>
              <p className='text-right'>
                <a className='invis' href='/home'>
                  See all
                </a>
              </p>
            </div>
            {movies2.map(movie => {
              return (
                <div className={'movie' + " " + movie.style} key={movie.key}>
                  <div className='movie-image'>
                    <img
                      loading='lazy'
                      src={movie.src}
                      alt=''
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
            <div className='cl'>&nbsp;</div>
          </div>
        </div>
        <div id='news'>
          <div className='head'>
            <p>NEWS</p>
            <p className='text-right'>
              <a className='invis' href='/home'>
                See all
              </a>
            </p>
          </div>
          <div className='content'>
            <p className='date'>12.04.09</p>
            <h4>Disney's A Christmas Carol</h4>
            <p>
              &quot;Disney's A Christmas Carol,&quot; a multi-sensory thrill
              ride re-envisioned by Academy Award&reg;-winning filmmaker Robert
              Zemeckis, captures...
            </p>
          </div>
          <div className='content'>
            <p className='date'>11.04.09</p>
            <h4>Where the Wild Things Are</h4>
            <p>
              Innovative director Spike Jonze collaborates with celebrated
              author Maurice Sendak to bring one of the most beloved books of
              all time to the big screen in &quot;Where the Wild Things
              Are,&quot;...
            </p>
          </div>
          <div className='content'>
            <p className='date'>10.04.09</p>
            <h4>The Box</h4>
            <p>
              Norma and Arthur Lewis are a suburban couple with a young child
              who receive an anonymous gift bearing fatal and irrevocable
              consequences.
            </p>
          </div>
        </div>
        <div id='coming'>
          <div className='head'>
            <p>
              COMING SOON<strong>!</strong>
            </p>
            <p className='text-right'>
              <a className='invis' href='/home'>
                See all
              </a>
            </p>
          </div>
          <div className='content'>
            <h4>The Princess and the Frog</h4>
            <img
              loading='lazy'
              src='https://image.tmdb.org/t/p/original/yprv5PbnEksoVj2v6XEnDBg9joR.jpg'
              alt=''
            />
            <p>
              Walt Disney Animation Studios presents the musical &quot;The
              Princess and the Frog,&quot; an animated comedy set in the great
              city of New Orleans...
            </p>
          </div>
          <div className='cl'>&nbsp;</div>
          <div className='content'>
            <h4>Fantastic Mr.Fox</h4>
            <img
              loading='lazy'
              src='https://m.media-amazon.com/images/M/MV5BOGUwYTU4NGEtNDM4MS00NDRjLTkwNmQtOTkwMWMyMjhmMjdlXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg'
              alt=''
            />
            <p>
              Walt Disney Animation Studios presents the musical &quot;Fantastic
              Mr.Fox,&quot; an animated comedy set in the great city of New
              Orleans...
            </p>
          </div>
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

export default Home
