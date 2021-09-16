import React, {useState} from 'react'
import Modal from '../components/Modal/Modal'
import Backdrop from '../components/Backdrop/Backdrop'
import './Events.css'

function EventsPage() {
    const [createEvent, setCreateEvent] = useState(false)

    const createEventHandler = () => {
        setCreateEvent(true)
    }

    const modalCancelHandler = () => {
        setCreateEvent(false)
    }

    const modalConfirmHandler = () => {
        setCreateEvent(false)
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
            <p>Modal Content</p>
        </Modal>}
        <div className='events-control'>
            <p>Share your own events!</p>
            <button className='btn' onClick={createEventHandler}>Create Event</button>
        </div>
        </>
    )
}

export default EventsPage