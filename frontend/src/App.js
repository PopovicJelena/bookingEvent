import React, {useState} from 'react'
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom'
import './App.css'
import AuthPage from './pages/Auth'
import BookingPage from './pages/Booking'
import EventsPage from './pages/Events'
import MainNavigation from './components/Navigation/MainNavigation'
import { AuthContext } from './context/authContext'

function App() {
  const [token, setToken] = useState(null)
  const [userId, setUserId] = useState(null)

  const login = (token, userId, tokenExpiration) => {
    setToken(token)
    setUserId(userId)
  }

  const logout = () => {
    setToken(null)
    setUserId(null)    
  }

  return (
    <Router>
      <AuthContext.Provider value={{token, userId, login, logout}}>
        <MainNavigation />
        <main className="main-content">
          <Switch>
            {token && <Redirect from="/" to="/events" exact />}
            {token && <Redirect from="/auth" to="/events" exact />}
            {!token && <Route path='/auth' component={AuthPage}/>}
            <Route path='/events' component={EventsPage}/>
            {token && <Route path='/booking' component={BookingPage}/>}
            {!token && <Redirect to='/auth' exact />}
          </Switch>
        </main>
      </AuthContext.Provider>
    </Router>
  )
}

export default App;
