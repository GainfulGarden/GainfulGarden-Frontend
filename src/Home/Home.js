import React, { Component } from 'react';
import { signUpUser, loginUser } from '../Utils/ApiUtils.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Home.css';

export default class Home extends Component {
    state = {
        name: '',
        email: '',
        password: '',
        returningEmail: '',
        returningPassword: '',
    }

  handleNameChange = (e) => this.setState({ name: e.target.value });

  handleEmailChange = (e) => this.setState({ email: e.target.value });

  handlePasswordChange = (e) => this.setState({ password: e.target.value });

  handleReturnEmailChange = (e) =>
    this.setState({ returningEmail: e.target.value });

  handleReturnPasswordChange = (e) =>
    this.setState({ returningPassword: e.target.value });

  showToast = (msg) => {
    toast(msg, {
      className: 'toast',
      bodyClassName: 'toastBody',
      progressClassName: 'fancy-progress-bar',
    });
  };

  handleSignUpSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await signUpUser(
        this.state.name,
        this.state.email,
        this.state.password
      );
      this.props.handleUserChange(user);
      this.props.history.push('/search');
    } catch {
      toast(`Are you sure that gardener doesn't already exist?`);
    }
  };

  handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await loginUser(
        this.state.returningEmail,
        this.state.returningPassword
      );
      this.props.handleUserChange(user);
      this.props.history.push('/search');
    } catch {
      toast(`We couldn't find that garden plot, would you like to try again?`);
    }
  };

  render() {
    return (
      <div>
        {/* nice find! */}
        <ToastContainer
          position='top-center'
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        <h2>Sign In To Start Planning Your Home or Community Garden</h2>
        {/* this form should probably be its own component */}
        <div className='container'>
          <div className='form-wrap'>
            <form className='signup' onSubmit={this.handleSignUpSubmit}>
              <h2>New Gardener</h2>
              <div className='form-group'>
                <label>
                  Name:
                  <input
                    onChange={this.handleNameChange}
                    value={this.state.name}
                  />
                </label>
              </div>
              <div className='form-group'>
                <label>
                  Email:
                  <input
                    type='email'
                    onChange={this.handleEmailChange}
                    value={this.state.email}
                  />
                </label>
              </div>

              <div className='form-group'>
                <label>
                  Password:
                  <input
                    type='password'
                    onChange={this.handlePasswordChange}
                    value={this.state.password}
                  />
                </label>
              </div>

              <button type='submit' className='btn'>
                Sign Up
              </button>
            </form>
          </div>
        </div>

      {/* this form should probably be its own component */}
        <div className='container'>
          <div className='form-wrap'>
            <form className='signin' onSubmit={this.handleLoginSubmit}>
              <h2>Established Gardener</h2>
              <div className='form-group'>
                <label>
                  Email:
                  <input
                    type='email'
                    onChange={this.handleReturnEmailChange}
                    value={this.state.returningEmail}
                  />
                </label>
              </div>

              <div className='form-group'>
                <label>
                  Password:
                  <input
                    type='password'
                    onChange={this.handleReturnPasswordChange}
                    value={this.state.returningPassword}
                  />
                </label>
              </div>
              <button type='submit'>Sign In</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
