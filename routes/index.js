const router = require('express').Router()
const isLoggedOut = require('../middleware/isLoggedOut')
const isLoggedIn = require('../middleware/isLoggedIn')
const Post = require('../models/Post')
const Editor = require('../models/Editor')

/* GET home page */
router.get('/', isLoggedOut, (req, res, next) => {
  res.render('index', { docName: 'Home Page' })
})

// View Blog Posts Route
router.get('/view', (req, res, next) => {
  const editorId = req.session.user._id
  Post.find({ editorId })
    .populate('editorId')
    .then((postFromDB) => {
      console.log(postFromDB)

      res.render('viewBlogPosts', { post: postFromDB, docName: 'Blog Posts' })

    })
})

router.get('/view/:username', (req, res, next) => {
  const username = req.params.username
  Editor.find({username : username})
    .then((editorFromDB) => {
     const editorId = editorFromDB[0]._id
     Post.find({editorId})
     .populate('editorId')
     .then(postFromDB => {
       res.render('viewBlogPosts', {post : postFromDB})
     })
    })
})


// Create Edit Post Routes
router.get('/edit/:id',isLoggedIn, (req, res, next) => {
  const id = req.params.id

  Post.findById(id)
    .then((postFromDB) => {
      res.render('editBlogPost', { post: postFromDB, docName: 'Edit Post' })
    })
    .catch((err) => next(err))
})







router.post('/edit/:id', (req, res, next) => {
  const { title, content } = req.body

  Post.findByIdAndUpdate(req.params.id, { title, content }, { new: true })
    .then((updatedPost) => {
      res.redirect(`/details/${updatedPost._id}`)
    })
    .catch((err) => next(err))
})

//Detail Route
router.get('/details/:id', (req, res, next) => {
  let user = req.session.user

  Post.findById(req.params.id)
    .populate('editorId')
    .then((postFromDb) => {
      res.render('details', {
        post: postFromDb,
        user: user,
        docName: 'Read More',
      })
    })
    .catch((err) => next(err))
})

// Create Blog Post Route
router.get('/create', isLoggedIn, (req, res, next) => {
  console.log(req.session.user)
  res.render('createBlogPost', { docName: 'Create Post' })

})

router.post('/create', (req, res, next) => {
  const { title, content } = req.body
  const editorId = req.session.user._id

  Post.create({ title, content, editorId })
    .then((createdPost) => {
      res.redirect(`/details/${createdPost._id}`)
    })
    .catch((err) => next(err))
})

// Delete Post Route
router.get('/details/delete/:id',isLoggedIn, (req, res, next) => {
  const id = req.params.id

  Post.findByIdAndDelete(id)
    .then(() => {
      res.redirect('/view')
    })
    .catch((err) => {
      next(err)
    })
})

module.exports = router
