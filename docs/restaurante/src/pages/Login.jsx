import {useNavigate} from 'react-router-dom'
import {useContext, useState} from 'react';
import {AuthContext} from '../contexts/AuthContext'


export default function Login() {
    const navigate = useNavigate();
    const {login} = useContext(AuthContext);
    async function handleSubmit(event){
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);
        const success = await login(data)

        if(success){
        navigate('/', {state: {message: 'Login efetuado com sucesso'}})
        } else {
          alert('erro de login')
        }
    }
 
    return (
      <form onSubmit={handleSubmit} action = "/backend">
        <h2>welcome to SORA</h2>
        <div className="control">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" required />
        </div>
        <div className="control-row">
          <div className="control">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" name="password" required />
          </div>
        </div>
        <hr />
        <p className="form-actions">
          <button type="submit" className="button">
            Login
          </button>
        </p>
      </form>
    );
  }