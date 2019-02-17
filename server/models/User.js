const mongoose = require('mongoose')
const Schema = mongoose.Schema

let userSchema = new Schema({
  email: String,
  first: String,
  last: String,
  password: String,
  isActive: Boolean
})

const User = mongoose.model('User', userSchema)

// let userModel = new User({
//   'email': 'user1@test.com',
//   'first': 'user1',
//   'last': 'test',
//   'password': 'user111',
//   'isActive': true
// })

// userModel.save()
//   .then(doc => {
//     console.log(doc)
//   })
//   .catch(err => {
//     console.error(err)
//   })

module.exports = User
