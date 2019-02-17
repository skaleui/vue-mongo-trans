import Vue from 'vue'
import App from '../../App.vue'
import { shallowMount } from '@vue/test-utils'
import Login from '../../components/Login.vue'
import store from '../../store'

describe ('Login.vue', function () {
  new Vue({
    el: '#app',
    store,
    components: { App },
    template: '<App/>'
  })
  it('renders Login when invoked', function () {
    const wrapper = shallowMount(Login, {store: store})
    expect (wrapper.findAll('h2')).toHaveLength(1)
  })
})
