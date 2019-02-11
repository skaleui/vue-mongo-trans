import Vue from 'vue'

const state = {
  months: [
    { name: 'Zero', abrev: 'ZZZ', index: 0 },
    { name: 'January', abrev: 'Jan', index: 1 },
    { name: 'February', abrev: 'Feb', index: 2 },
    { name: 'March', abrev: 'Mar', index: 3 },
    { name: 'April', abrev: 'Apr', index: 4 },
    { name: 'May', abrev: 'May', index: 5 },
    { name: 'June', abrev: 'Jun', index: 6 },
    { name: 'July', abrev: 'Jul', index: 7 },
    { name: 'August', abrev: 'Aug', index: 8 },
    { name: 'September', abrev: 'Sep', index: 9 },
    { name: 'October', abrev: 'Oct', index: 10 },
    { name: 'November', abrev: 'Nov', index: 11 },
    { name: 'December', abrev: 'Dec', index: 12 }
  ],
  currentMonth: 12,
  currentyear: 2018,
  balanceCharges: 0,
  balanceDeposits: 0,
  transactions: []
}

const getters = {
  transactionsByMonth: state => state.transactions,
  balanceCharges: state => state.balanceCharges,
  balanceDeposits: state => state.balanceDeposits
}

const actions = {
  getTransactionsByMonth ({ commit, state, rootState }, payload) {
    commit('transactionsByMonth', [])
    // Will make API call here

    Vue.axios.get('/transaction/' + state.currentyear + '/' + state.currentMonth,
      {headers: { 'userId': rootState.user.userId }})
      .then((resp) => {
        let data = resp.data
        console.log('getTransactionsByMonth', data)
        if (data && data.length > 0) {
          commit('transactionsByMonth', data)
        }
      })
      .catch((err) => {
        console.log('Dang! There was an error getting transactions by month: ' + err)
      })
  },
  getPreviousMonthsBalances ({ commit, state, rootState }, payload) {
    commit('transactionsByMonth', [])
    // Will make API call here
    Vue.axios.get('/transaction/balance/' + state.currentyear + '/' + state.currentMonth,
      {headers: { 'userId': rootState.user.userId }})
      .then((resp) => {
        let data = resp.data
        if (data && data.length > 0) {
          commit('balanceCharges', data[0].charges)
          commit('balanceDeposits', data[0].deposits)
        } else {
          commit('balanceCharges', 0)
          commit('balanceDeposits', 0)
        }
      })
      .catch((err) => {
        console.log('Dang! There was an error getting balances: ' + err)
      })
  },
  async gotoMonth ({ commit }, increment) {
    commit('gotoMonth', increment)
  },
  async gotoCurrentMonth ({ commit }, increment) {
    commit('gotoCurrentMonth', increment)
  },
  saveTransaction ({commit, dispatch, state, rootState}, transaction) {
    transaction.userId = rootState.user.userId

    Vue.axios.post('/transaction', transaction)
      .then((resp) => {
        dispatch('getTransactionsByMonth').then(() => {
          dispatch('getPreviousMonthsBalances')
        })
      })
      .catch((err) => {
        console.log('Error saving transaction')
        console.log(err)
      })
  }
}

const mutations = {
  transactionsByMonth (state, data) {
    state.transactions = []

    if (data && data.length > 0) {
      data.forEach(tx => {
        state.transactions.push(mapTransaction(tx, state))
      })
    }
    console.log('Transactions by month mutated: ', state.transactions)
  },
  balanceCharges (state, data) {
    state.balanceCharges = data
  },
  balanceDeposits (state, data) {
    state.balanceDeposits = data
  },
  gotoMonth (state, increment) {
    let newMonth = state.currentMonth + increment
    // sanity checks
    if (newMonth > 12) {
      newMonth = 1
      state.currentyear += 1
    } else if (newMonth < 1) {
      newMonth = 12
      state.currentyear -= 1
    }
    state.currentMonth = newMonth
  },
  gotoCurrentMonth (state) {
    let dt = new Date(Date.now())
    state.currentMonth = dt.getUTCMonth() + 1
    state.currentyear = dt.getUTCFullYear()
  }
}

// Helper functions

function mapTransaction (tx, state) {
  const transDate = new Date(tx.transactionDate)
  const months = state.months
  let transaction = {
    transactionDate: transDate.getFullYear() + '-' + months[transDate.getUTCMonth() + 1].abrev + '-' + transDate.getUTCDate(),
    transactionType: tx.transactionType,
    description: tx.description,
    charge: moneyFormatter(tx.charge),
    deposit: moneyFormatter(tx.deposit),
    balance: moneyFormatter(calcRunningBalance(tx))
  }
  return transaction
}
function moneyFormatter (amount) {
  let formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  })
  return formatter.format(amount)
}
function calcRunningBalance (tx) {
  // any new charges
  if (tx && tx.charge > 0) {
    state.balanceCharges += tx.charge
  } else if (tx && tx.deposit > 0) {
    state.balanceDeposits += tx.deposit
  }
  return (state.balanceCharges - state.balanceDeposits)
}

export default {
  state,
  getters,
  actions,
  mutations
}
