import React, { useState } from 'react';

function LogIn(){
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  // const [userData, setUserDat] = useState({})

  const onSubmitForm = async (event) => {
    event.preventDefault();
    try{
      const body = {username, password}
      const response = await fetch('http://localhost:5000/login',{
        method: 'POST',
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify(body)
      })
      const parseRes = await response.json()
      console.log(parseRes)
    } catch (error) {
      console.error(error.message)
    }
  };


  return (
    <div className='container'>
    <div className='child' >
      <div>
        <h1 className="welcomeTitle" >FLIP FLOP PHOTO APP</h1>
      </div>
      <div>
      <form className='signupForm' onSubmit={onSubmitForm} >
        <input
          name='username'
          type='text'
          placeholder='Email'
          className="form-control"
          onChange={event => setUserName(event.target.value)}
          required>
        </input>
        <input
          name='password'
          type='password'
          placeholder='Password'
          className="form-control"
          onChange={event =>setPassword(event.target.value)}
          required>
        </input>
        <button>Log In</button>
      </form>
      </div>
    </div>
    </div>
  )
}
 export default LogIn
