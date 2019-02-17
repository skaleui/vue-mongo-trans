const User = require('../../models/User')

module.exports = function (router) {
  router.get('/user/:id', function (req, res) {
    console.log('Get user by id', req.params.id)

    User.countDocuments({}, (err, count) => {
      if (err) console.log(err)
      console.log('count', count)
    })

    User.find({ '_id': req.params.id }).exec()
      .then(docs => {
        console.log(docs)
        res.status(200)
          .json(docs)
      })
      .catch(err => res.status(500)
        .json({
          message: 'Error finding user',
          error: err
        }))
  })

  router.get('/user/email/:email', function (req, res) {
    console.log(req.params)
    User.find({ 'email': req.params.email }).exec()
      .then(docs => res.status(200)
        .json(docs))
      .catch(err => res.status(500)
        .json({
          message: 'Error finding user',
          error: err
        }))
  })

  router.get('/user/first/:first', function (req, res) {
    console.log(req.params.first)
    User.find({ 'first': req.params.first }).exec()
      .then(docs => res.status(200)
        .json(docs))
      .catch(err => res.status(500)
        .json({
          message: 'Error finding user',
          error: err
        }))
  })

  router.post('/user', function (req, res) {
    let user = new User(req.body)
    console.log(user)
    user.save(function (err, user) {
      if (err) return console.log(err)
      res.status(200).json(user)
    })
  })

  router.put('/user/:id', function (req, res) {
    console.log('put', req.params)
    console.log('put body', req.body)
    let qry = { _id: req.params.id }
    let doc = {
      first: req.body.first,
      last: req.body.last,
      email: req.body.email,
      password: req.body.password,
      isActive: req.body.isActive
    }
    console.log(doc)
    User.updateOne(qry, doc, function (err, respRaw) {
      if (err) return console.log(err)
      res.status(200).json(respRaw)
    })
  })
}
