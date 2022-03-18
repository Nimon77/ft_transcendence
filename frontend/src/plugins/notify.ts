import Vue from 'vue';
import store from '@/store';
import SocketIO from 'socket.io-client';
import VueSocketIO from 'vue-socket.io';

const options = {
	transportOptions: {
	polling: { extraHeaders: { Authorization: 'Bearer ' + localStorage.getItem('token') } },
	},
};

Vue.use(new VueSocketIO({
	debug: true,
	connection: SocketIO(`http://${window.location.hostname}:${process.env.VUE_APP_BACKEND_PORT}/notify`,options),
	vuex: {
		store,
		actionPrefix: 'NOTIFY_',
		mutationPrefix: 'NOTIFY_'
	}
}));
