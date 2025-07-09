import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import './styles/auth.css'

function Login () {
  const [errMsg, setErrMsg] = useState("")
  const [email, setEmail] = useState("")
  const [pwd, setPwd] = useState("")

  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;
  console.log(BASE_URL)

  async function handleSubmit (e) {
    e.preventDefault()
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/login`, {
      email: email,
      pwd: pwd
    })
    console.log(response.data)
    if (response.data.msg === "You don't have an account") {
      setErrMsg("You don't have an account")
    }
    else if (response.data.msg === "Password Incorrect") {
      setPwd('')
      setErrMsg("Password Incorrect")
    }
    else {
      // here update local storage
      localStorage.setItem('token', email)
      console.log(response.data.email)
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
          <input type="submit" value="Log In" />
          <p className="msg">
            New to our website? <a href='/signup'>Create an account</a>
          </p>
          <p className='err'>{errMsg}</p>
        </form>
        <footer className="footer" >
            <h2>FasalMovies</h2>
            <p>Copyright © 2024 pRock Pvt. Ltd. All rights reserved.</p>
        </footer>
    </div>
  )
}

export default Login;
