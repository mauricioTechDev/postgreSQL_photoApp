import React, { useState } from 'react';

function SignUp () {

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')

  const onSubmitForm = async (event) => {
    event.preventDefault();
    try{
      const body = { firstName, lastName, username, password }
      const response = await fetch('http://localhost:5000/join', {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify(body)
      })
      console.log(response)
      window.location = '/'
    } catch (error){
      console.error(error.message)
    }
  }

    return (
      <div className='container'>
      <div className='child' >
        <div>
          <h1 className="welcomeTitle" >FLIP FLOP PHOTO APP</h1>
        </div>
        <div>
        <form className='signupForm' onSubmit={onSubmitForm}>
          <input
            name='firstName'
            type='text'
            className="form-control"
            placeholder='First Name'
            onChange={event =>setFirstName(event.target.value)}
            required></input>
          <input
            name='lastName'
            type='text'
            placeholder='Last Name'
            className="form-control"
            onChange={event =>setLastName(event.target.value)}
            required></input>
          <input
            name='username'
            type='text'
            placeholder='Email'
            className="form-control"
            onChange={event =>setUserName(event.target.value)}
            required></input>
          <input
            name='password'
            type='password'
            placeholder='Password'
            className="form-control"
            onChange={event =>setPassword(event.target.value)}
            required></input>
          <button>Sign Up</button>
        </form>
        </div>
      </div>
      </div>
    )

};

export default SignUp;
