import { applyMiddleware, combineReducers, compose, createStore, Store } from 'redux';
import logger from 'redux-logger';
import { color } from './Color/reducers';
import { ColorState } from './Color/types';
import { app } from './App/reducers';
import { AppState } from './App/types';

const reducer = combineReducers({
	color,
	app
});

export interface State {
	app: AppState;
	color: ColorState;
}

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middleWares = [logger];

function configureStore(initialState?: State) {
	const middleware = applyMiddleware(logger);
	const store = createStore(
		reducer,
		initialState,
		composeEnhancers(applyMiddleware(...middleWares))
	);

	return store;
}

export const store = configureStore();
