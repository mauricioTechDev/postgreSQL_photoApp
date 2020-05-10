import React, { Component } from 'react';

class Welcome extends Component {
  constructor(props){
    super(props);


    this.handleLogIn = this.handleLogIn.bind(this)
    this.handleSignUp = this.handleSignUp.bind(this)
  }

  handleSignUp(event){
    event.preventDefault()
    this.props.history.push(`/signUp`)
  }
  handleLogIn(event){
    event.preventDefault()
    this.props.history.push(`/logIn`)
  }
  render() {
    return (
      <div className='container'>
        <div className='child' >
          <div>
            <h1 className="welcomeTitle" >FLIP FLOP PHOTO APP</h1>
          </div>
          <div>
            <button className='logIn' onClick={this.handleLogIn}>LOG IN</button>
          </div>
          <div>
            <button className='signUp' onClick={this.handleSignUp}>SIGN UP</button>
          </div>
        </div>
      </div>
    )
  }
}

export default Welcome
