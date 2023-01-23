const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const { resto_profile } = require('../models')

async function authenticate(username, password, done) {
try {
 
 const user = await resto_profile.authenticate({ username, password })
 
 return done(null, user)
}
catch(err) {
 return done(null, false, { message: err.message })
}
}

passport.use(
    new LocalStrategy({ usernameField: 'username', passwordField: 'password' }, authenticate)
    )
    
    passport.serializeUser(
    (user, done) => done(null, user.id)
    )
    passport.deserializeUser(
    async (id, done) => done(null, await resto_profile.findByPk(id))
    )
    
    module.exports = passport