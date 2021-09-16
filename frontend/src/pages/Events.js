import React, {useState, useRef, useContext, useEffect, useCallback} from 'react'
import Modal from '../components/Modal/Modal'
import Backdrop from '../components/Backdrop/Backdrop'
import './Events.css'
import { AuthContext } from '../context/authContext'

function EventsPage() {
    const [createEvent, setCreateEvent] = useState(false)
    const [events, setEvents] = useState([])

    const context = useContext(AuthContext)

    const titleRef = useRef(null)
    const priceRef = useRef(null)
    const dateRef = useRef(null)
    const descriptionRef = useRef(null)

    const fetchEvents = useCallback(() => {
        const requestBody = {
            query: `
                query {
                    events {
                        _id
                        title
                        description
                        price
                        date
                        creator {
                            _id
                            email
                        }
                    }
                }
            `
        }
                   
        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(res => {
            if (res.status !== 200 && res.status !== 201) {
            throw new Error('Failed!')
            }
            return res.json()
        })
        .then(resData => {
            // console.log(resData)
            const events = resData.data.events
            setEvents(events)
        })
        .catch(err => {
            console.log(err)
        })
    }, [])

    useEffect(() => {
        fetchEvents()
    }, [fetchEvents])

    const createEventHandler = () => {
        setCreateEvent(true)
    }

    const modalCancelHandler = () => {
        setCreateEvent(false)
    }

    const modalConfirmHandler = () => {
        setCreateEvent(false)

        const title =  titleRef.current.value
        const price = +priceRef.current.value
        const date = dateRef.current.value
        const description = descriptionRef.current.value

        // if(title.trim() !== '' && price <= 0 && date.trim() !== '' && description.trim() !== '') {
            
        // }
        
        const event = {title, price, date, description}
        console.log(event)

        const requestBody = {
            query: `
                mutation {
                    createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
                        _id
                        title
                        description
                        price
                        date
                        creator {
                            _id
                            email
                        }
                    }
                }
            `
        }
        
        const token = context.token
            
        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
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
            fetchEvents()
        })
        .catch(err => {
            console.log(err)
        })
    }

    return (
        <>
        {createEvent && <Backdrop />}
        {createEvent && <Modal title="Add Event"
            canCancel
            canConfirm
            onCancel={modalCancelHandler}
            onConfirm={modalConfirmHandler}
        >
            <form>
                <div className="form-control">
                    <label htmlFor="title">Title</label>
                    <input type="text" id="title" ref={titleRef}/>
                </div>
                <div className="form-control">
                    <label htmlFor="price">Price</label>
                    <input type="number" id="price" ref={priceRef}/>
                </div>
                <div className="form-control">
                    <label htmlFor="date">Date</label>
                    <input type="datetime-local" id="date" ref={dateRef}/>
                </div>
                <div className="form-control">
                    <label htmlFor="description">Description</label>
                    <textarea id="description" rows="4" ref={descriptionRef}/>
                </div>
            </form>
        </Modal>}
        {context.token && <div className='events-control'>
            <p>Share your own events!</p>
            <button className='btn' onClick={createEventHandler}>Create Event</button>
        </div>}
        <ul className="events__list">
            {events.map(event => {
                return <li key={event._id} className="events__list-item">{event.title}</li>
            })}
        </ul>
        </>
    )
}

export default EventsPage