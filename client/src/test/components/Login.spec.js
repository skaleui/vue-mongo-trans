import Vuex from 'vuex'
import Vuetify from 'vuetify'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Login from '../../components/Login.vue'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Vuetify)

const store = new Vuex.Store({
  state: {
    loggedIn: false
  }
})
describe('Login.vue', function () {
  it('renders Login when invoked', function () {
    const wrapper = shallowMount(Login, {store, localVue})
    expect(wrapper.findAll('h2')).toHaveLength(1)
  })
})
