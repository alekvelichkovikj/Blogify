const router = require('express').Router()

// ℹ️ Handles password encryption
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

// How many rounds should bcrypt run the salt (default [10 - 12 rounds])
const saltRounds = 10

// Require the User model in order to interact with the database
const User = require('../models/User.model')

// Require necessary (isLoggedOut and isLoggedIn) middleware in order to control access to specific routes
const isLoggedOut = require('../middleware/isLoggedOut')
const isLoggedIn = require('../middleware/isLoggedIn')
const Editor = require('../models/Editor')

const { fileUploader, cloudinary } = require('../config/cloudinary')

// SignUp Route
router.get('/signup', isLoggedOut, (req, res, next) => {
  res.render('signUp', { docName: 'Sign Up' })
})

router.post(
  '/signup',
  fileUploader.single('profile-image'),
  (req, res, next) => {
    const { username, name, password, bio, email } = req.body

    let imageUrl = ''
    let imgName = ''
    let publicId = ''

    if (req.file) {
      imageUrl = req.file.path
      imgName = req.file.originalname
      publicId = req.file.filename
    }

    if (password.length < 8) {
      res.render('signUp', {
        errorMessage: 'Your password needs to be at least 8 characters long.',
      })
      return
    }
    if (username.length === 0) {
      res.render('signUp', { errorMessage: 'Your username cannot be empty.' })
      return
    }

    Editor.findOne({ username: username }).then((editorFromDB) => {
      if (editorFromDB !== null) {
        res.render('signUp', { errorMessage: 'Your username is already taken' })
      } else {
        const salt = bcrypt.genSaltSync()
        const hash = bcrypt.hashSync(password, salt)
        Editor.create({
          username: username.toLowerCase(),
          password: hash,
          name: name,
          bio: bio,
          email: email,
          imageUrl: imageUrl,
          imgName: imgName,
          publicId: publicId,
        })
          .then((editorFromDB) => {
            req.session.user = editorFromDB
            res.redirect('/profile')
          })
          .catch((err) => next(err))
      }
    })
  }
)

// Login Route
router.get('/login', isLoggedOut, (req, res, next) => {
  res.render('logIn', { docName: 'Log In' })
})

router.post('/login', isLoggedOut, (req, res, next) => {
  const { username, password } = req.body

  if (!username) {
    return res
      .status(400)
      .render('logIn', { errorMessage: 'Please provide your username.' })
  }

  // - either length based parameters or we check the strength of a password
  if (password.length < 8) {
    return res.status(400).render('logIn', {
      errorMessage: 'Your password needs to be at least 8 characters long.',
    })
  }

  // Search the database for a user with the username submitted in the form
  Editor.findOne({ username })
    .then((user) => {
      // If the user isn't found, send the message that user provided wrong credentials
      if (!user) {
        return res
          .status(400)
          .render('logIn', { errorMessage: 'Wrong credentials.' })
      }

      // If user is found based on the username, check if the in putted password matches the one saved in the database
      bcrypt.compare(password, user.password).then((isSamePassword) => {
        if (!isSamePassword) {
          return res
            .status(400)
            .render('logIn', { errorMessage: 'Wrong credentials.' })
        }
        req.session.user = user
        // req.session.user = user._id; // ! better and safer but in this case we saving the entire user object
        return res.redirect('profile')
      })
    })

    .catch((err) => {
      next(err)
    })
})

module.exports = router
