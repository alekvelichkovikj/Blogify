const router = require('express').Router()
const Editor = require('../models/Editor')
const Post = require('../models/Post')

router.get('/guest/guestView', (req, res, next) => {
  Post.find()
    .populate('editorId')
    .then((postFromDB) => {
      res.render('guest/guestView', {
        post: postFromDB[Math.floor(Math.random() * postFromDB.length)],
        docName: 'Random Post',
      })
    })
    .catch((err) => next(err))
})

module.exports = router
