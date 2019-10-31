import { ColorUpdateAction, ColorActionType, ColorState, IColor } from './types';

export const updateColor = (colors: IColor[]): ColorUpdateAction => ({
	type: ColorActionType.UPDATE_COLOR,
	colors: colors
});
