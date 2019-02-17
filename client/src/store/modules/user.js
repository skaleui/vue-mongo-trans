import Vue from 'vue'

const state = {
  email: '',
  userId: null,
  first: '',
  last: '',
  isLoggedIn: false,
  loginError: ''
}

const getters = {
  isLoggedIn: state => state.isLoggedIn,
  userId: state => state.userId,
  loginError: state => state.loginError
}

const actions = {
  async logInUser ({ commit }, payload) {
    await Vue.axios.get('/user/email/' + payload.email)
      .then((resp) => {
        let data = resp.data
        if (data && data.length > 0) {
          if (data[0].password === payload.password) {
            const user = data[0]
            payload.userId = user._id
            payload.first = user.first
            payload.last = user.last
            payload.email = user.email
            commit('logInUser', payload)
          } else {
            commit('loginError')
          }
        }
      })
      .catch(() => {
        commit('loginError')
      })
  },

  updateUserProfile ({ commit }, payload) {
    // TODO encrypt the user's password
    console.log('updateUserprofile', payload)
    Vue.axios.put('/user/' + this.state.user.userId, payload)
      .then((resp) => {
        console.log(resp)
      })
      .catch((err) => {
        console.log(err)
      })
  }
}

const mutations = {
  logInUser (state, payload) {
    state.isLoggedIn = true
    state.email = payload.email
    state.first = payload.first
    state.last = payload.last
    state.userId = payload.userId
    state.isLoggedIn = true
  },
  loginError (state) {
    state.isLoggedIn = false
    state.loginError = 'Email and/or password are invalid. Login Failed'
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
