<template>
  <div>
    <v-btn
      fab
      bottom
      right
      color="orange"
      dark
      fixed
      @click.stop="showDialog"
    >
      <v-icon>add</v-icon>
    </v-btn>
    <v-dialog v-model="dialog" width="800px">
      <v-card>
        <v-card-title
          class="grey lighten-4 py-4 title"
        >
         {{ (this.newItem ? 'New' : 'Edit') + ' Transaction' }}
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap>
            <v-flex xs12>
              <v-menu
                ref="datePicker"
                lazy
                :close-on-content-click="false"
                v-model="transactionDatePicker"
                transition="scale-transition"
                offset-y
                full-width
                :nudge-right="40"
                max-width="290px"
                min-width="290px"
              >
                <v-text-field
                  slot="activator"
                  label="Select Transaction Date"
                  v-model="transaction.transactionDate"
                  prepend-icon="event"
                  readOnly
                ></v-text-field>
                <v-date-picker
                  v-model="transaction.transactionDate"
                  v-on:input="$refs.datePicker.save(transaction.transactionDate)"
                >
                </v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs12>
              <v-select
                prepend-icon="credit_card"
                v-bind:items="transactionTypes"
                v-model="transaction.transactionType"
                label="Transaction Type"
                single-line
                bottom
              ></v-select>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                prepend-icon="description"
                placeholder="Description"
                v-model="transaction.description"
              ></v-text-field>
            </v-flex>
            <v-flex xs6>
              <v-text-field
                prepend-icon="remove_circle"
                placeholder="Charge (-)"
                v-model="transaction.charge"
              ></v-text-field>
            </v-flex>
            <v-flex xs6>
              <v-text-field
                prepend-icon="add_circle"
                placeholder="Deposit (+)"
                v-model="transaction.deposit"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                prepend-icon="message"
                placeholder="Notes"
                v-model="transaction.notes"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="cancelTransaction">Cancel</v-btn>
          <v-btn flat @click="saveTransaction">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'EditTransaction',
  props: ['showdialog', 'setDialog'],
  watch: {
    showdialog: function (val) {
      console.log('showdialog', val)
      if (typeof val !== 'object') {
        this.transaction.transactionDate = this.getCurrentDate()
        this.newItem = true
        this.dialog = val
      } else {
        if ((val.item !== null || val.item !== undefined) && Object.keys(val.item).length === 0) {
          this.transaction = {}
          this.transaction.transactionDate = this.getCurrentDate()
          this.newItem = true
        } else {
          this.transaction = val.item
          this.newItem = false
        }
        this.dialog = val.show
      }
    }
  },
  data: () => ({
    dialog: false,
    newItem: true,
    transaction: {
      id: null,
      transactionDate: null,
      transactionType: null,
      description: '',
      charge: 0.0,
      deposit: 0.0
    },
    transactionTypes: [
      {text: 'Credit Card', value: 'Credit Card'},
      {text: 'Debit Card', value: 'Debit Card'},
      {text: 'Check', value: 'Check'},
      {text: 'Deposit', value: 'Deposit'}
    ],
    transactionDatePicker: false
  }),
  methods: {
    saveTransaction: function () {
      console.log('Saving trsnsaction record:')

      this.$store.dispatch('saveTransaction', this.transaction)

      this.dialog = false
      this.setDialog(false)
    },
    cancelTransaction: function () {
      this.dialog = false
      this.setDialog(false)
    },
    showEditTransactionDialog: function () {
      this.transaction.transactionDate = this.getCurrentDate()
      this.dialog = true
    },
    getCurrentDate: function () {
      const dt = new Date(Date.now())
      let month = '' + (dt.getMonth() + 1)
      let day = '' + dt.getDate()
      let year = dt.getFullYear()

      if (month.length < 2) month = '0' + month
      if (day.length < 2) day = '0' + day

      return [year, month, day].join('-')
    }
  }

}
</script>

<style>

</style>
