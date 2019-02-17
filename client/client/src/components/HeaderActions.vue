<template>
  <div class="d-flex align-center" style="margin-left: auto">
    <v-menu open-on-hover bottom offset-y>
      <v-btn icon slot="activator">
        <v-icon>person</v-icon>
      </v-btn>
      <v-list>
        <v-list-tile v-on:click="showProfile">
          <v-list-tile-action>
            <v-icon>assignment</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Show Profile</v-list-tile-title>
        </v-list-tile>
        <v-list-tile v-on:click="logOut">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Log Out</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>

    <v-btn icon>
      <v-icon>notification</v-icon>
    </v-btn>

    <v-dialog v-model="profileDialog" persistent max-width="600px">
      <v-card>
      <v-card-title>
        <span class="headline">User Profile</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 sm6>
              <v-text-field label="First Name" v-model="user.first" required></v-text-field>
            </v-flex>
            <v-flex xs12 sm6>
              <v-text-field label="Last Name" v-model="user.last" required></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field label="Email" v-model="user.email" required></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field label="Password" v-model="user.password" type="password"></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field label="Verify Password" v-model="user.verifyPassword" type="password"
              hint="When changing password enter twice" persistent-hint
              :rules="[
                () => user.password == user.verifyPassword || 'Passwords entered should be same'
              ]"
              required></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
        <small>*indicates required field</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click.native="profileDialog = false">Close</v-btn>
        <v-btn color="blue darken-1" flat @click.native="saveProfile">Save</v-btn>
      </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
export default {
  data () {
    return {
      profileDialog: false,
      user: {
        first: '',
        last: '',
        email: '',
        password: '',
        verifyPassword: '',
        isActive: true
      }
    }
  },
  methods: {
    showProfile: function () {
      this.profileDialog = true
    },
    saveProfile: function () {
      let vm = this
      this.$store.dispatch('updateUserProfile', this.user).then(() => {
        vm.password = vm.verifyPassword = ''
      })
    },
    logOut: function () {
      // TODO
      console.log('User logout')
    }
  },
  mounted: function () {
    const loggedInUser = this.$store.state.user

    this.user.first = loggedInUser.first
    this.user.last = loggedInUser.last
    this.user.email = loggedInUser.email
  }

}
</script>

<style>

</style>
