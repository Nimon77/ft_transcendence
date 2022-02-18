module.exports = {
    devServer: {
		// Fixing issue with WDS disconnected and sockjs network error
		host: '0.0.0.0',
		public: '0.0.0.0:8080',
		disableHostCheck: true,
		// End of fix
		progress: false,
		// proxy: 'http://localhost:3000/user'
	},

    transpileDependencies: [
      'vuetify',
	  'vue-auth-image'
    ]
}
