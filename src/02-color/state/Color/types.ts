import { Action } from 'redux';

export interface ColorState {
	group: number;
	isSelctable: boolean;
	prevIsSelctable: boolean;
	focusColor: IColor;
	colors: IColor[];
	selectedColor: IRGB[];
	notSelectedColor: IRGB[];
}

export interface IColor {
	r: number;
	g: number;
	b: number;
	index: number;
	group: number;
	key: number;
	live: boolean;
}

export interface IRGB {
	r: number;
	g: number;
	b: number;	
}

export enum ColorActionType {
	UPDATE_COLOR = 'updateColor',
	SELECT_COLOR = 'selectColor',
	SELECT_COLORS = 'selectColors',
	UPDATE_SELECT = 'updateSelect',
	NOT_SELECT_COLOR = 'notSelectColor',
	REMOVE_COLOR = 'removeColor'
}

export interface ColorUpdateAction extends Action {
	type: ColorActionType.UPDATE_COLOR;
	colors: IColor[];
}

export interface SelectColorsAction extends Action {
	type: ColorActionType.SELECT_COLORS;
	colors: IRGB[];
}

export interface SelectColorAction extends Action {
	type: ColorActionType.SELECT_COLOR;
	color: IColor;
}

export interface NotSelectColorAction extends Action {
	type: ColorActionType.NOT_SELECT_COLOR;
	colors: IColor[];
}

export interface UpdateSelectAction extends Action {
	type: ColorActionType.UPDATE_SELECT;
}

export interface RemoveColorAction extends Action {
	type: ColorActionType.REMOVE_COLOR;
	color: IColor;
}

export type ColorActions =
	| ColorUpdateAction
	| SelectColorAction
	| SelectColorsAction
	| NotSelectColorAction
	| UpdateSelectAction
	| RemoveColorAction;
