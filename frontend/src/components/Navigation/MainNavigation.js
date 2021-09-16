import React,  { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../../context/authContext'
import './MainNavigation.css'

function MainNavigation(props) {
    const context = useContext(AuthContext)
    return (
        <header className="main-navigation">
            <div className='main-navigation__logo'>
                <h1>Easy Event</h1>
            </div>
            <nav className="main-navigation__items">
                <ul>
                    {!context.token && <li>
                        <NavLink to="/auth">Authenticate</NavLink>
                    </li>}
                    <li>
                        <NavLink to="/events">Events</NavLink>
                    </li>
                    {context.token && (
                        <React.Fragment>
                            <li>
                                <NavLink to="/bookings">Bookings</NavLink>
                            </li>
                            <li>
                                <button onClick={context.logout}>Logout</button>
                            </li>
                        </React.Fragment>
                    )}
                </ul>
            </nav>            
        </header>
    )
}

export default MainNavigation