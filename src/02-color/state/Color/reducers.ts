import { ColorState, ColorActions, ColorActionType } from './types';

const initialState: ColorState = {
	progress: 0,
	isSelctable: false,
	colors: [],
	selectedColor: [],
	notSelectedColor: []
};

export const color = (state: ColorState = initialState, action: ColorActions): ColorState => {
	switch(action.type){
		case ColorActionType.UPDATE_COLOR:
			console.log(action.colors);
			return {...state, colors: action.colors, isSelctable: true}
		default:
			return state;			
	}
	// return state;
};
