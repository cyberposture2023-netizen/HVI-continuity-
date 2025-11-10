import React, { useState } from 'react'
import apiService from '../services/apiService'

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const result = await apiService.login(credentials)
      alert(`Login successful: ${JSON.stringify(result)}`)
    } catch (error) {
      alert('Login failed. Check console for details.')
      console.error('Login error:', error)
    }
  }

  return (
    <div className="login">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Username"
            value={credentials.username}
            onChange={(e) => setCredentials({...credentials, username: e.target.value})}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Login
