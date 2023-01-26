const router = require('express').Router()
const { resto_profile } = require('../models' )
const passportJWT = require('../lib/passport-jwt')

function format(user) {
    const { id, username } = user
    return {
     id,
     username,
     accessToken : user.generateToken()
    }}

    const restrictJWT = passportJWT.authenticate('jwt', {
            session: false
        })
            
router.post('/login', (req, res) => {
    resto_profile.authenticate (req.body)
    .then(user => {
    res.json(
    format(user)
    )
    })
})
    
router.get('/home', restrictJWT, (req, res) => {
   res.send('Welcome to protected api section')
})

router.get('/whoami', restrictJWT, (req, res) => {
    const currentUser = req.user.dataValues
    res.json(currentUser)
 })

module.exports = router