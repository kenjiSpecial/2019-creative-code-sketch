import { ColorState, ColorActions, ColorActionType } from './types';
import { Colors } from '../../Colors';

const initialState: ColorState = {
	group: 0,
	isSelctable: false,
	prevIsSelctable: false,
	focusColor: {
		r:0,
		g: 0,
		b: 0,
		index: 0,
		group: 0,
		key: 0,
		live: false
	},
	colors: [],
	selectedColor: [],
	notSelectedColor: []
};

export const color = (state: ColorState = initialState, action: ColorActions): ColorState => {
	switch (action.type) {
		case ColorActionType.UPDATE_COLOR:
			for (let ii = 0; ii < action.colors.length; ii = ii + 1) {
				state.colors.push(action.colors[ii]);
			}

			return {
				...state,
				colors: state.colors,
				group: state.group + 1,
				isSelctable: true,
				prevIsSelctable: state.isSelctable
			};
		case ColorActionType.SELECT_COLOR:
			const selectedColorArr = state.selectedColor;
			selectedColorArr.push({ r: action.color.r, g: action.color.g, b: action.color.b });
			return {
				...state,
				focusColor: action.color,
				selectedColor: selectedColorArr,
				isSelctable: false,
				prevIsSelctable: state.isSelctable
			};
		case ColorActionType.SELECT_COLORS:
			// const selectedColorArr = state.;
			// selectedColorArr.push({ r: action.color.r, g: action.color.g, b: action.color.b });
			return {
				...state,
				selectedColor: action.colors,
			};
		case ColorActionType.REMOVE_COLOR:
			let colorindex;

			for (let ii = 0; ii < state.colors.length; ii = ii + 1) {
				const color = state.colors[ii];
				if (color.key === action.color.key) {
					colorindex = ii;
					break;
				}
			}

			if (colorindex > -1) {
				state.colors.splice(colorindex, 1);
			}
			return { ...state, colors: state.colors };
		case ColorActionType.UPDATE_SELECT:
			return { ...state, prevIsSelctable: state.isSelctable };
		default:
			return state;
	}
	// return state;
};
