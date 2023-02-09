module.exports = (req, res, next) => {
    if (req.isAuthenticated()) return next()
    // res.redirect('/login')
    
    else if (req.user) {
      next();
    } else {
      res.redirect('/login')
    }
  }
    
