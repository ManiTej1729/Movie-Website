import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './styles/auth.css'
import axios from 'axios'

function Signup () {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [pwd, setPwd] = useState("")
  const [errMsg, setErrMsg] = useState("")

  const navigate = useNavigate();

  async function handleSubmit (e) {
    e.preventDefault()
    const response = await axios.post('http://localhost:5500/signup', {
      name: username,
      email: email,
      pwd: pwd
    })
    console.log(response.data)
    if (response.data.msg === "User already exists") {
      setEmail('')
      setPwd('')
      setErrMsg("User already exists")
    }
    else {
      // here update local storage
      localStorage.setItem('token', email)
      navigate('/home')
    }
  }

  return (
    <div>
      <br />
        <h1 align="center">Kindly enter required details</h1>
        <br />
        <form onSubmit={handleSubmit} method='post'>
          <input
            value={username}
            onChange={(e) => setEmail(e.target.value)}
            type='text'
            placeholder='Username'
            required
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type='email'
            placeholder='Email'
            required
          />
          <input
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            type='password'
            placeholder='Password'
            required
          />
          <input type="submit" value="Signup" />
          <p className='err'>{errMsg}</p>
        </form>
        <footer className="footer" >
            <h2>FasalMovies</h2>
            <p>Copyright © 2024 pRock Pvt. Ltd. All rights reserved.</p>
        </footer>
    </div>
  )
}

export default Signup
