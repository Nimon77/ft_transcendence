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
	// connection: 'http://' + location.hostname + ':' + process.env.VUE_APP_BACKEND_PORT + '/notify',
	connection: SocketIO('http://127.0.0.1:3000/notify', options),
	vuex: {
		store,
		actionPrefix: 'NOTIFY_',
		mutationPrefix: 'NOTIFY_'
	}
}));
