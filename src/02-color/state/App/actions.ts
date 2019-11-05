import {
	StartDataLoadAction,
	AppActionType,
	FetchDataLoadSuccessAction,
	StartColorLoadAction,
	FetchColorLoadSuccessAction,
	UpdatePageAction
} from './types';

export const startDataLoad = (): StartDataLoadAction => ({
	type: AppActionType.START_DATA_LOAD
});

export const fetchDataSuccesss = (): FetchDataLoadSuccessAction => ({
	type: AppActionType.FETCH_DATA_LOAD_SUCCESS
});

export const startColorLoad = (): StartColorLoadAction => ({
	type: AppActionType.START_COLOR_LOAD
});

export const fetchColorSuccesss = (): FetchColorLoadSuccessAction => ({
	type: AppActionType.FETCH_COLOR_LOAD_SUCCESS
});

export const updatePage = (page: string): UpdatePageAction => ({
	type: AppActionType.UPDATE_PAGE,
	page: page
});
