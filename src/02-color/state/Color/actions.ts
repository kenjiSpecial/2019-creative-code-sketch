import { ColorUpdateAction, ColorActionType, ColorState, IColor, SelectColorAction, UpdateSelectAction, RemoveColorAction, IRGB, SelectColorsAction } from './types';

export const updateColor = (colors: IColor[]): ColorUpdateAction => ({
	type: ColorActionType.UPDATE_COLOR,
	colors: colors
});

export const selectColors = (colors: IRGB[]): SelectColorsAction => ({
	type: ColorActionType.SELECT_COLORS,
	colors: colors
})

export const selectColor = (color: IColor): SelectColorAction => ({
	type: ColorActionType.SELECT_COLOR,
	color: color
})

export const updateSelect = (): UpdateSelectAction => ({
	type: ColorActionType.UPDATE_SELECT
})

export const removeColor =(color: IColor): RemoveColorAction => ({
	type: ColorActionType.REMOVE_COLOR,
	color: color
})