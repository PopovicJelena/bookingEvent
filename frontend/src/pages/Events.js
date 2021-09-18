import React, {useState, useRef, useContext, useEffect} from 'react'
import Modal from '../components/Modal/Modal'
import Backdrop from '../components/Backdrop/Backdrop'
import './Events.css'
import { AuthContext } from '../context/authContext'
import EventList from '../components/Events/EventList/EventList'
import Spinner from '../components/Spinner/Spinner'

function EventsPage() {
    const [createEvent, setCreateEvent] = useState(false)
    const [events, setEvents] = useState([])
    const [isLoading, setisLoading] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState(null)

    const context = useContext(AuthContext)
    const isActive = useRef(true)

    const titleRef = useRef(null)
    const priceRef = useRef(null)
    const dateRef = useRef(null)
    const descriptionRef = useRef(null)

    const fetchEvents = () => {
        setisLoading(true)
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
            const events = resData.data.events
            if(isActive) {
                setEvents(events)
                setisLoading(false)
            }
        })
        .catch(err => {
            console.log(err)
            if(isActive) {
                setisLoading(false)
            }
        })
    }

    useEffect(() => {
        fetchEvents()
    }, [])

    const createEventHandler = () => {
        setCreateEvent(true)
    }

    const modalCancelHandler = () => {
        setCreateEvent(false)
        setSelectedEvent(null)
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
            const newEvent = {
                _id: resData.data.createEvent._id,
                title: resData.data.createEvent.title,
                description: resData.data.createEvent.description,
                date: resData.data.createEvent.date,
                price: resData.data.createEvent.price,
                creator: {
                _id: context.userId
                }
            }
            console.log(newEvent)
            const newEventList = [...events, newEvent]
            setEvents(newEventList)
        })
        .catch(err => {
            console.log(err)
        })
    }

    const showDetailHandler = (eventId) => {
        const chosenEvent = events.find(el => el._id === eventId)
        setSelectedEvent(chosenEvent)
    }

    const bookEventHandler = () => {
         if (!context.token) {
            setSelectedEvent(null)
            return
        }
        const requestBody = {
            query: `
                mutation {
                    bookEvent(eventId: "${selectedEvent._id}") {
                        _id
                        createdAt
                        updatedAt
                    }
                }
            `
        }
                 
        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + context.token
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
            setSelectedEvent(null)            
        })
        .catch(err => {
            console.log(err)
        })

    }

    useEffect(() => {
        return () => {
            isActive.current = false
        }
    }, [])

    return (
        <>
        {(createEvent || selectedEvent) && <Backdrop />}
        {createEvent && <Modal title="Add Event"
            canCancel
            canConfirm
            onCancel={modalCancelHandler}
            onConfirm={modalConfirmHandler}
            confirmText = "Confirm"
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
        {selectedEvent && <Modal title={selectedEvent.title}
            canCancel
            canConfirm
            onCancel={modalCancelHandler}
            onConfirm={bookEventHandler}
            confirmText = {context.token ? 'Book' : 'Confirm'}
        >
            <h1>{selectedEvent.title}</h1>
            <h2>
              ${selectedEvent.price} - {new Date(selectedEvent.date).toLocaleDateString()}
            </h2>
            <p>{selectedEvent.description}</p>
        </Modal>}
        {context.token && <div className='events-control'>
            <p>Share your own events!</p>
            <button className='btn' onClick={createEventHandler}>Create Event</button>
        </div>}
        {isLoading ? 
        <Spinner /> : 
        <EventList events={events} authUserId={context.userId} onViewDetail={showDetailHandler}/> }
        </>
    )
}

export default EventsPage