import { ColorState, ColorActions } from './types';

const initialState: ColorState = {
	progress: 0,
	isSelctable: false,
	colors: [],
	selectedColor: [],
	notSelectedColor: []
};

export const color = (state: ColorState = initialState, action: ColorActions): ColorState => {
	return state;
};
