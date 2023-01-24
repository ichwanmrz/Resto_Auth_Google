const express = require('express');
const app = express();
const { resto_profile, resto_product } = require('./models');
const flash = require('express-flash');
const port = 3000;
const passport = require('./lib/passport');
const session = require('express-session');
const restrict = require('./middlewares/restrict');

app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(express.static(__dirname));
app.use(session({
    secret: 'Buat ini jadi rahasia',
    resave: false,
    saveUninitialized: false
    }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.set("view engine", "ejs");

app.get('/', (req, res) => {
    res.render('home.ejs')
})

app.get('/about', restrict, (req, res) => {
  res.render('about.ejs')
})

app.get('/register', (req, res) => {
    res.render("register.ejs");
  });

app.post('/register', (req, res) => {
    const {username, password, address} = req.body
    resto_profile.register({username, password, address})
    .then(() => {
        res.redirect('/login')
    })
})

app.get('/login', (req, res) => {
    res.render("login.ejs");
  });

app.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/whoami', restrict, (req, res) => {
    const {username} = req.user.dataValues
    res.render('whoami.ejs', { username })
})

app.get('/profile/',  restrict, (req, res) => {
  const {username, password, address, membership} = req.user.dataValues
        res.render("profile.ejs", {
          username, password, address, membership
        });
});

app.get("/detail/:id", restrict, (req, res) => {
    const { id } = req.params;
    const {username} = req.user.dataValues
    resto_profile
      .findOne({
        where: {id}, 
        include: resto_product
      })
      .then((resto) => {
        res.render("detail.ejs", {
          resto, username,
        });
      });
    });
  
  app.get("/dashboard", restrict, (req, res) => {
    const {username} = req.user.dataValues
    resto_product
      .findAll({})
      .then((resto) => {
        res.render("dashboard.ejs", {
          resto, username,
        });
      });
  });
  
  app.get("/edit/:id", restrict, (req, res) => {
    const {
      id
    } = req.params;
    const {username} = req.user.dataValues
    resto_profile
      .findOne({
        where: {id,},
        include: resto_product,
      })
      .then((resto) => {
        res.render("edit.ejs", {
          resto, username,
        });
      });
  });
  
  app.post("/edit/:id", (req, res) => {
    const {
      id
    } = req.params;
    const {
          name,
          address,
          products,
          price,
          category
    } = req.body;
   resto_profile
      .update({
          name,
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
    const {username} = req.user.dataValues
      res.render("add.ejs",{username});
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