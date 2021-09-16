import React, { useState, useRef, useContext } from 'react'
import './Auth.css'
import { AuthContext } from '../context/authContext'

function AuthPage() {
    const [isLogin, setIsLogin] = useState(true)
    
    const context = useContext(AuthContext)
    
    const emailRef = useRef(null)
    const passwordRef = useRef(null)

    const submithandler = (event) => {
        event.preventDefault()
        const email =  emailRef.current.value
        const password = passwordRef.current.value

        if(email.trim().length !== 0 || password.trim().length !== 0) {
            let requestBody = {
                query: `
                    query {
                        login(email: "${email}", password: "${password}") {
                            userId
                            token
                            tokenExpiration
                        }
                    }
                `
            }

            if(!isLogin) {
                requestBody = {
                    query: `
                        mutation {
                            createUser(userInput: {email: "${email}", password: "${password}"}) {
                            _id
                            email
                            }
                        }
                    `
                }
            }
            
            fetch('http://localhost:8000/graphql', {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!')
                }
                return res.json()
            })
            .then(resData => {
                console.log(resData)
                if (resData.data.login.token) {
                    context.login(
                        resData.data.login.token,
                        resData.data.login.userId,
                        resData.data.login.tokenExpiration
                    )
                }
            })
            .catch(err => {
                console.log(err)
            })
        }
    }

    const switchModeHandler = () => {
        setIsLogin(!isLogin)
    }

    return (
        <form className="auth-form" onSubmit={submithandler}>
            <div className="form-control">
                <label htmlFor="email">E-Mail</label>
                <input type="email" id="email" ref={emailRef}/>
            </div>
            <div className="form-control">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" ref={passwordRef}/>
            </div>
            <div className="form-actions">
                <button type="submit">Submit</button>
                <button type="button" onClick={switchModeHandler}>Switch to {isLogin ? 'Signup' : 'Login'}</button>
            </div>
        </form>
    )
}

export default AuthPage