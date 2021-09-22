import React, {useState, useContext, useEffect} from 'react'
import { AuthContext } from '../context/authContext'
import Spinner from '../components/Spinner/Spinner'
import BookingList from '../components/Bookings/BookingList/BookingList'
import BookingChart from '../components/Bookings/BookingChart/BookingChart'
import BookingControls from '../components/Bookings/BookingControls/BookingControls'

function BookingPage() {
    const [isLoading, setisLoading] = useState(false)
    const [bookings, setBookings] = useState([])
    const [outputType, setOutputType] = useState('list')
    const context = useContext(AuthContext)

    const fetchBookings = () => {
        setisLoading(true)
        const requestBody = {
        query: `
            query {
                bookings {
                    _id
                    createdAt
                    event {
                        _id
                        title
                        date
                        price
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
                Authorization: 'Bearer ' + context.token
            }
        })
        .then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!')
            }
            return res.json()
        })
        .then(resData => {
            console.log(resData);
            const bookings = resData.data.bookings
            setBookings(bookings)
            setisLoading(false)
        })
        .catch(err => {
            console.log(err)
            setisLoading(false)
        })
    }

    const deleteBookingHandler = (bookingId) => {
        setisLoading(true)
        const requestBody = {
        query: `
            mutation {
                cancelBooking(bookingId: "${bookingId}") {
                    _id
                    title
                }
            }
            `
        }

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + context.token
            }
        })
        .then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!')
            }
            return res.json()
        })
        .then(resData => {
            console.log(resData);
            const updatedBookings = bookings.filter(booking => {
                return booking._id !== bookingId
            })
            setBookings(updatedBookings)
            setisLoading(false)
        })
        .catch(err => {
            console.log(err)
            setisLoading(false)
        })        
    }

    useEffect(() => {
        fetchBookings()
    }, [])

    const changeOutputTypeHandler = (outputType) => {
        if (outputType === 'list') {
        setOutputType('list')
        } else {
        setOutputType('chart')
        }
    }

    let content = <Spinner />
    if (!isLoading) {
        content = (
            <>
                <div>
                    <BookingControls
                        activeOutputType={outputType}
                        onChange={changeOutputTypeHandler}
                    />
                </div>
                <div>
                    {outputType === 'list' ? (
                    <BookingList
                        bookings={bookings}
                        onDelete={deleteBookingHandler}
                    />
                    ) : (
                    <BookingChart bookings={bookings} />
                    )}
                </div>
            </>
        )
    }
    return (
        <>{content}</>
    )
}

export default BookingPage