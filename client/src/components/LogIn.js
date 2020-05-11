import React, { useState } from 'react';

function LogIn(){
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  // const [userData, setUserDat] = useState({})

  const onSubmitForm = async (event) => {
    event.preventDefault();
    try{
      const body = {username, password}
      console.log(body)
      const response = await fetch('http://localhost:5000/login',{
        method: 'POST',
        credentials : 'same-origin',
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify(body)
      })
      console.log(response)
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
          value={username}
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
          value={password}
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
