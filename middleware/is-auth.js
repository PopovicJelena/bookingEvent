const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization')
    // const authHeader = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTNlM2E0ZTFjYjM1ODNmMTgyOWU5Y2EiLCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE2MzE2NDg1MzIsImV4cCI6MTYzMTY1MjEzMn0.iryMWkiYkpogZ2mfBAY9R-976eghfxw9qYLVT0XG2bA"
    if(!authHeader) {
        req.isAuth = false
        return next()
    }
    const token = authHeader.split(' ')[1]
    if(!token || token === '') {
        req.isAuth = false
        return next()
    }
    
    let decodedToken 
    try {
        decodedToken = jwt.verify(token, 'somesupersecretkey')        
    } catch (err) {
        req.isAuth = false
        return next()
    }
    req.isAuth = true
    req.userId = decodedToken.userId
    next()
}