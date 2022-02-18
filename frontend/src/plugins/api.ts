import axios from "axios";

export const API = axios.create({
	baseURL: "http://" + location.hostname + ":" + process.env.VUE_APP_BACKEND_PORT,
	headers: {
		"Content-Type": "application/json",
		"Authorization": "Bearer " + localStorage.getItem("token")
	},
});
