import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify'
import router from './router/index'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import '@mdi/font/css/materialdesignicons.css'
import store from './store'

Vue.config.productionTip = true;
Vue.use(mavonEditor)

new Vue({
    vuetify,
    router,
    store,
    render: h => h(App)
}).$mount('#app');
