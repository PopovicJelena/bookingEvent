import React from 'react'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BOOKINGS_BUCKETS = [
  {
    category: 'cheap',
    min: 0,
    max: 100
  },
  {
    category: 'normal',
    min: 100,
    max: 200
  },
  {
    category: 'expensive',
    min: 200,
    max: 10000000
  }
]


function BookingChart(props) {
  let chartData = []
    for (const bucket in BOOKINGS_BUCKETS) {
      const filteredBookingsCount = props.bookings.reduce((prev, current) => {
      if (
          current.event.price > BOOKINGS_BUCKETS[bucket].min &&
          current.event.price < BOOKINGS_BUCKETS[bucket].max
      ) {
          return prev + 1;
      } else {
          return prev;
      }
      }, 0)
        chartData.push({...BOOKINGS_BUCKETS[bucket], value: filteredBookingsCount}) 
      }
      console.log(chartData);
    return (
    <div style={{display:'flex', justifyContent: "center"}}>

    <div style={{height:300, width:600}}>
        <ResponsiveContainer>
            <BarChart
            data={chartData}
            margin={{
                top: 5,
                right: 30, 
                left: 20,
                bottom: 5,
            }}
            >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
    </div>
    </div>   
        
    )
}

export default BookingChart