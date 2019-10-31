import { Action } from 'redux';

export interface ColorState {
	isSelctable: boolean;
	progress: number,
	colors: IColor[];
	selectedColor: IColor[];
	notSelectedColor: IColor[];
}

export interface IColor {
	r: number;
	g: number;
	b: number;
}

export enum ColorActionType {
	UPDATE_COLOR = 'updateColor',
	SELECT_COLOR = 'selectColor',
	NOT_SELECT_COLOR = 'notSelectColor'
}

export interface ColorUpdateAction extends Action {
	type: ColorActionType.UPDATE_COLOR;
	colors: IColor[];
}

export interface SelectColorAction extends Action {
	type: ColorActionType.SELECT_COLOR;
	colors: IColor[];
}

export interface NotSelectColorAction extends Action {
	type: ColorActionType.NOT_SELECT_COLOR;
	colors: IColor[];
}

export type ColorActions = ColorUpdateAction | SelectColorAction | NotSelectColorAction;
