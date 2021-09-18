import React, {useState, useContext, useEffect} from 'react'
import { AuthContext } from '../context/authContext'
import Spinner from '../components/Spinner/Spinner'

function BookingPage() {
    const [isLoading, setisLoading] = useState(false)
    const [bookings, setBookings] = useState([])
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

    useEffect(() => {
        fetchBookings()
    }, [])

    return (
        <>
            {isLoading ? (<Spinner/>) : (
            <ul>
                {bookings.map(booking => {
                    return <li key={booking._id}>
                        {booking.event.title} -
                        {new Date(booking.createdAt).toLocaleDateString()}
                    </li>
                })}
            </ul>
            )}
        </>
    )
}

export default BookingPage