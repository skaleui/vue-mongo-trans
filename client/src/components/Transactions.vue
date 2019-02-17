<template>
  <v-card style="width: 100%">
    <v-card-title>
      <span class="pr-3">
        Transaction for {{ months[currentMonth].name }} - {{ currentYear }}
      </span>
      <v-btn flat icon class="ptr-2" v-on:click="gotoMonth(-1)">
        <v-icon>keyboard_arrow_left</v-icon>
      </v-btn>
      <v-btn flat icon class="ptr-2" v-on:click="gotoCurrentMonth">
        <v-icon>today</v-icon>
      </v-btn>
      <v-btn flat icon class="ptr-2" v-on:click="gotoMonth(1)">
        <v-icon>keyboard_arrow_right</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-text-field
        append-icon="search"
        label="Search"
        single-line
        hide-details
        v-model="search"
      ></v-text-field>
    </v-card-title>
    <v-data-table
      v-bind:headers="headers"
      v-bind:items="items"
      v-bind:search="search"
      item-key="_id"
    >
      <template slot="items" slot-scope="props">
        <tr>
          <td>
           <v-icon @click="editCurrentTransaction(props.item)">edit</v-icon>
          </td>
          <td>
            <v-edit-dialog
              lazy
            > {{props.item.transactionDate }}
              <v-text-field
                slot="input"
                label="Edit"
                v-model="props.item.transactionDate"
                single-line
              ></v-text-field>
            </v-edit-dialog>
          </td>
          <td class="text-xs-left">
            <v-edit-dialog
              lazy>
            {{ props.item.transactionType }}
                          <v-text-field
                slot="input"
                label="Edit"
                v-model="props.item.transactionType"
                single-line
              ></v-text-field>
            </v-edit-dialog>
          </td>
          <td class="text-xs-left" @click="props.expanded = !props.expanded">
            {{ props.item.description }}
          </td>
          <td class="text-xs-right">{{ props.item.charge }}</td>
          <td class="text-xs-right">{{ props.item.deposit }}</td>
          <td class="text-xs-right">{{ props.item.balance }}</td>
        </tr>
      </template>

      <template slot="expand" slot-scope="props">
        <v-card flat class="pl-5">
          <v-card-text class="text-xs-left">
            <v-text-field label="Note" v-model="props.item.notes"></v-text-field>
          </v-card-text>
        </v-card>
      </template>

      <template slot="pageText" slot-scope="{ pageStart, pageStop }">
        From {{ pageStart }} to {{ pageStop }}
      </template>

    </v-data-table>
  </v-card>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'Transactions',
  props: ['setDialog'],
  computed: {
    ...mapState({
      months: state => state.transactions.months,
      currentYear: state => state.transactions.currentyear,
      currentMonth: state => state.transactions.currentMonth
    }),
    ...mapGetters({
      items: 'transactionsByMonth',
      balanceCharges: 'balanceCharges',
      balanceDeposits: 'balanceDeposits'
    })
  },
  data () {
    return {
      max25chars: (v) => v.length <= 25 || 'input too long!',
      search: '',
      itemval: {},
      pagination: {},
      headers: [
        { text: 'Edit', align: 'center', sortable: false, value: '' },
        { text: 'Date', align: 'left', sortable: false, value: 'date' },
        { text: 'Type', align: 'left', sortable: false, value: 'type' },
        { text: 'Description', align: 'center', sortable: false, value: 'description' },
        { text: 'Charge (-)', align: 'right', sortable: false, value: 'paymentAmt' },
        { text: 'Desposit (+)', align: 'right', sortable: false, value: 'despositAmt' },
        { text: 'Balance', align: 'right', sortable: false, value: 'balance' }
      ]
    }
  },
  methods: {
    getTransactionsByMonth: function () {
      console.log('getTransactionsByMonth')
      this.$store.dispatch('getTransactionsByMonth')
    },
    getPreviousMonthsBalances: function () {
      this.$store.dispatch('getPreviousMonthsBalances')
    },
    gotoMonth: function (increment) {
      console.log('gotoMonth')
      this.$store.dispatch('gotoMonth', increment).then(() => {
        this.getPreviousMonthsBalances()
        this.getTransactionsByMonth()
      })
    },
    gotoCurrentMonth: function () {
      console.log('gotoCurrentMonth')
      this.$store.dispatch('gotoCurrentMonth').then(() => {
        this.getPreviousMonthsBalances()
        this.getTransactionsByMonth()
      })
    },
    editCurrentTransaction: function (item) {
      console.log('editCurrentTransaction', item)
      this.itemval = { 'show': true, 'item': item }
      console.log(this.itemval)
      this.setDialog(this.itemval)
    }
  },
  mounted: async function () {
    await this.getPreviousMonthsBalances()
    await this.getTransactionsByMonth()
  }

}
</script>

<style>

</style>
