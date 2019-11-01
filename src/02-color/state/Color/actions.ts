import { ColorUpdateAction, ColorActionType, ColorState, IColor, SelectColorAction } from './types';

export const updateColor = (colors: IColor[]): ColorUpdateAction => ({
	type: ColorActionType.UPDATE_COLOR,
	colors: colors
});

export const selectColor = (color: IColor): SelectColorAction => ({
	type: ColorActionType.SELECT_COLOR,
	color: color
})