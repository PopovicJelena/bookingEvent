const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const Event = require('./models/event')
const User = require('./models/user')

const app = express()

app.use(express.json())

app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type User {
            _id: ID!
            email: String!
            password: String
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!            
        }

        input UserInput {
            email: String!
            password: String
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return Event.find()
                    .then(events => {
                        return events.map(event => {
                            return {...event._doc, _id: event.id}
                        })
                    })
                    .catch(err => {
                        throw err
                    })
        },
        createEvent: (args) => {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: '613e3a4e1cb3583f1829e9ca'                
            })
            let createdEvent
            return event.save().then(res => {
                createdEvent = {...res._doc, _id: res._doc._id.toString()}
                return User.findById('613e3a4e1cb3583f1829e9ca')
            })
            .then(user => {
                if (!user) {
                    throw new Error('User not found.')
                }
                user.createdEvents.push(event)
                return user.save()
            })
            .then(result => {
                return createdEvent
            })
            .catch(err => {
                console.log(err)
                throw err
            })
        },
        createUser: (args) => {
            return User.findOne({ email: args.userInput.email })
            .then(user => {
                if (user) {
                throw new Error('User exists already.')
                }
                return bcrypt.hash(args.userInput.password, 12)
            })
            .then(hashedPassword => {
                const user = new User({
                email: args.userInput.email,
                password: hashedPassword
                })
                return user.save()
            })
            .then(res => {
                return { ...res._doc, password: null, _id: res.id };
            })
            .catch(err => {
                throw err
            })            
        }
    },
    graphiql: true
}))

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@events.fnv3s.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`).then(() => {
    app.listen(3000)
}).catch(err => {
    console.log(err)
})