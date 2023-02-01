const express = require('express');
const app = express();
const port = 3000;
const { resto_profile, resto_product } = require('./models');
const passport = require("passport");
// const passport = require('./lib/passport');
const session = require('express-session');
const restrict = require('./middlewares/restrict');
require('./lib/passport-oauth');
const isLoggin = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/login')
  }
}

app.use(session({
  secret: 'Buat ini jadi rahasia',
  resave: false,
  saveUninitialized: false
  }));
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(express.static(__dirname));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {res.render('home.ejs')})

app.get('/failed', (req, res) => {res.send("you failed")})
app.get('/good', isLoggin, (req, res) => {res.send(`welcome mr ${req.user.displayName}`)})
app.get('/google', passport.authenticate('google', { scope:[ 'profile', 'email' ] }));
app.get( '/google/callback', passport.authenticate( 'google', {failureRedirect: '/failed'}),
    function(req, res) {res.redirect('/dashboard')});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send({ error: "Logout error" });
    }
    res.clearCookie("connect.sid");
    // return res.send({ success: true });
    return res.redirect('/login')
  });
});

app.get("/dashboard", isLoggin, (req, res) => {
  // const {username} = req.user.dataValues
  resto_product
    .findAll({})
    .then((resto) => {
      res.render("dashboard.ejs", {
        resto,  email:req.user.displayName
      });
    });
});

app.get('/about', (req, res) => {
  res.render("about.ejs");
})

app.get('/register', (req, res) => {
    res.render("register.ejs");
  });

app.post('/register', (req, res) => {
    const {email, username, password, address} = req.body
    resto_profile.register({email, username, password, address})
    .then(() => {
        res.redirect('/login')
    })
})

app.get('/login', (req, res) => {
    res.render("login.ejs");
  });

app.post('/login', passport.authenticate('local',  {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
}))


app.get('/profile/', restrict,  (req, res) => {
  // const {username, password, address, membership} = req.user.dataValues
        res.render("profile.ejs", {
        //  username, password, address, membership, 
         email:req.user.displayName
        });
});

app.get("/detail/:id", restrict, (req, res) => {
    const { id } = req.params;
    // const {username} = req.user.dataValues
    resto_profile
      .findOne({
        where: {id}, 
        include: resto_product
      })
      .then((resto) => {
        res.render("detail.ejs", {
          resto, email:req.user.displayName
        });
      });
    });
  
  
  app.get("/edit/:id", restrict, (req, res) => {
    const {
      id
    } = req.params;
    // const {username} = req.user.dataValues
    resto_profile
      .findOne({
        where: {id,},
        include: resto_product,
      })
      .then((resto) => {
        res.render("edit.ejs", {
          resto, email:req.user.displayName
        });
      });
  });
  
  app.post("/edit/:id", (req, res) => {
    const {
      id
    } = req.params;
    const {
          username,
          email,
          address,
          name,
          products,
          price,
          category
    } = req.body;
   resto_profile
      .update({
          email,
          username,
          address,
          membership: true,
      }, {
        where: {
          id,
        },
      })
      .then((response) => {
        resto_product
          .update({
              name,
              products,
              price,
              category
          }, {
            where: {
              id: id,
            },
          })
          .then((response) => {
            res.redirect("/dashboard");
          });
      });
  });
  
  app.get("/delete/:id", (req, res) => {
    const {
      id
    } = req.params;
    resto_profile.destroy({
      where: {id},
    }).then((response) => {
      resto_product.destroy({
          where: {id},
        })
        .then((response) => {
          res.redirect("/dashboard");
        })
      })
  });
  
  app.get("/add", restrict,(req, res) => {
    // const {username} = req.user.dataValues
      res.render("add.ejs",{ email:req.user.displayName});
    });
  
  app.post("/add", (req, res) => {
    const { id } = req.params;
    const {
          name,
          products,
          price,
          category
    } = req.body;
        resto_product
          .create({
          id,
          name,
          products,
          price,
          category
          })
          .then((response) => {
            res.redirect("/dashboard");
          });
  });
  
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})