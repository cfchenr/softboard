import { createStore, combineReducers } from 'redux';

const INITIAL_STATE = {
	token: ''
};

function auth(state = INITIAL_STATE, action) {
	switch (action.type) {
		case 'SET_TOKEN':
			return { ...state, token: action.token };
		case 'REMOVE_TOKE':
			return { ...state, token: '' };
		default:
			return state;
	}
}

const reducer = combineReducers({ auth: auth });

const store = createStore(reducer);

export default store;
