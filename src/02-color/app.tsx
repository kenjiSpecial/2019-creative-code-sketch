import * as React from 'react';
import { Component } from 'react';
import { Firebase } from './firebase/firebase';
import { Colors } from './Colors';
import { store } from './state/index';
import { fetchDataSuccesss, startDataLoad } from './state/App/actions';

type AppState = {
	isLoading: boolean;
};

export class App extends Component<{}, AppState> {
	state = { isLoading: true };

	componentDidMount() {
    store.dispatch(startDataLoad())
		const firebase = Firebase.GET_INSTANCE();
		firebase.init();
		firebase.initDatabase(() => {
      store.dispatch(fetchDataSuccesss())
    });

		store.subscribe(() => {
			this.setState({ isLoading: store.getState().app.isDataLoading });
		});
		// firebase.updateCount(1);
	}
	render() {
		const isLoading = this.state.isLoading;
		return <div>{isLoading ? <div>loading</div> : <Colors />}</div>;
	}
}
