import React, { useState, useEffect } from 'react'
import './App.css'
import { useDispatch } from 'react-redux'
import { Header } from './components/index'
import { login, logout } from './store/authSlice'
import authService from './services/auth'
import { Outlet } from 'react-router-dom'

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  useEffect(() => {
    const checkAuth = async () => {
      try {

        const user = await authService.getCurrentUser()
        if (user) {
          dispatch(login(user.user))
        } else {
          dispatch(logout())
        }
      }
      catch (error) {
        dispatch(logout())
        // console.log(error)
      }
      finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [dispatch])

  return !loading ? (
    <div className="min-h-screen ">
      <Header />
      <main>
        <Outlet />
      </main>
    </div >
  ) :
    null;
}

export default App
