import { Action } from 'redux';

export interface AppState {
	page: string;
	isColorLoading: boolean;
	isDataLoading: boolean;
}

export enum Page {
	RESULT = 'RESULT',
	SURVEY = 'SURVEY'
}

export enum AppActionType {
	UPDATE_PAGE = 'updatePage',
	START_COLOR_LOAD = 'startColorLoad',
	FETCH_COLOR_LOAD_SUCCESS = 'fetchColorLoadSuccess',
	START_DATA_LOAD = 'startDataLoad',
	FETCH_DATA_LOAD_SUCCESS = 'fetchDataLoadSuccess'
}

export interface UpdatePageAction extends Action {
	type: AppActionType.UPDATE_PAGE;
	page: string;
}

export interface StartColorLoadAction extends Action {
	type: AppActionType.START_COLOR_LOAD;
}

export interface FetchColorLoadSuccessAction extends Action {
	type: AppActionType.FETCH_COLOR_LOAD_SUCCESS;
}

export interface StartDataLoadAction extends Action {
	type: AppActionType.START_DATA_LOAD;
}

export interface FetchDataLoadSuccessAction extends Action {
	type: AppActionType.FETCH_DATA_LOAD_SUCCESS;
}

export type AppActions =
	| UpdatePageAction
	| StartColorLoadAction
	| FetchColorLoadSuccessAction
	| StartDataLoadAction
	| FetchDataLoadSuccessAction;
