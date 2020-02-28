import { create } from 'apisauce';

const api = create({
	// baseURL: 'http://127.0.0.1:8000/api/v1',
	baseURL: 'https://softboarddev.herokuapp.com/api/v1',
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json'
	}
});

api.addResponseTransform(response => {
	if (!response.ok) {
		throw response;
	}
});

async function remove(endpoint, params, token) {
	return await api
		.delete(endpoint, params, {
			headers: { Authorization: `Bearer ${token}` }
		})
		.then(response => response.data)
		.catch(error => {
			throw error;
		});
}

async function put(endpoint, params, token) {
	return await api
		.put(endpoint, params, {
			headers: { Authorization: `Bearer ${token}` }
		})
		.then(response => response.data)
		.catch(error => {
			throw error;
		});
}

async function post(endpoint, params, token = null) {
	if (token) {
		return await api
			.post(endpoint, params, {
				headers: { Authorization: `Bearer ${token}` }
			})
			.then(response => response.data)
			.catch(error => {
				throw error;
			});
	}
	return await api
		.post(endpoint, params)
		.then(response => response.data)
		.catch(error => {
			throw error;
		});
}

async function get(endpoint, params, token = null) {
	if (token) {
		return await api
			.get(endpoint, params, {
				headers: { Authorization: `Bearer ${token}` }
			})
			.then(response => response.data)
			.catch(error => {
				throw error;
			});
	}
	return await api
		.get(endpoint, params)
		.then(response => response.data)
		.catch(error => {
			throw error;
		});
}

export { post, get, remove, put };
