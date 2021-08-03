import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        oper_address : undefined,
        contributed : undefined,
    },
    mutations: {
        set_address(state, oper_address) {
            state.oper_address = oper_address
        },
        set_contributed(state, contributed) {
            state.contributed = contributed
        }
    }

})

export { store }
