import { AppState, AppActions, Page, AppActionType } from './types';

const initialState: AppState = {
	page: Page.SURVEY,
	isColorLoading: false,
	isDataLoading: true
};

export const app = (state: AppState = initialState, action: AppActions): AppState => {
	if (action.type === AppActionType.START_DATA_LOAD) {
		return { ...state, isDataLoading: true };
	} else if (action.type === AppActionType.FETCH_DATA_LOAD_SUCCESS) {
		return { ...state, isDataLoading: false };
	} else if (action.type === AppActionType.START_COLOR_LOAD) {
		return { ...state, isColorLoading: true };
	} else if (action.type === AppActionType.FETCH_COLOR_LOAD_SUCCESS) {
        return { ...state, isColorLoading: false };
	} else {
		return state;
	}
};
