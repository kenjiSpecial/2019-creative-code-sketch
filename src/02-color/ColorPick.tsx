import * as React from 'react';
import { Component } from 'react';
import { url } from './constants';
import { store } from './state/index';
import { startColorLoad, fetchColorSuccesss } from './state/App/actions';
import { IColor, ColorState } from './state/Color/types';
import { color } from './state/Color/reducers';
import { updateColor, updateSelect } from './state/Color/actions';
import { ColorCard } from './ColorCard';
import { AppState, Page } from './state/App/types';
import { Unsubscribe } from 'redux';

interface IState {
	colors: IColor[];
}

export class ColorPick extends Component<{}, IState> {
	state = { colors: [] };
	unsubscribe: Unsubscribe;
	componentDidMount() {
		this.getColors();

		this.unsubscribe = observeStore();

		const self = this;
		function observeStore() {
			let currentState: {
				color: ColorState;
				app: AppState;
			};

			function handleChange() {
				let nextState = store.getState();
				const colors = store.getState().color.colors;
				self.setState({ colors: colors });

				if (currentState && nextState !== currentState) {
					if (
						nextState.color.isSelctable === false &&
						currentState.color.isSelctable === true
					) {
						self.getColors();
					}

					if (
						nextState.app.page === Page.SURVEY &&
						currentState.app.page === Page.RESULT
					) {
						self.getColors();
					}
				}

				currentState = nextState;
			}

			return store.subscribe(handleChange);
		}
	}

	private getColors() {
		if (store.getState().app.isColorLoading) {
			return;
		}

		store.dispatch(startColorLoad());
		setTimeout(() => {
			const selectColors = store.getState().color.selectedColor;

			const colors = { r: 0, g: 0, b: 0 };
			for (let ii = 0; ii < selectColors.length; ii = ii + 1) {
				colors.r += selectColors[ii].r / selectColors.length;
				colors.g += selectColors[ii].g / selectColors.length;
				colors.b += selectColors[ii].b / selectColors.length;
			}
			const colorR = [255 -Math.floor(colors.r), 255 -Math.floor(colors.g), 255 -Math.floor(colors.b)];
			const colorA =
				store.getState().color.focusColor.r !== 0 &&
				store.getState().color.focusColor.g !== 0 &&
				store.getState().color.focusColor.b !== 0
					? [
							255 - Math.floor(store.getState().color.focusColor.r),
							255 - Math.floor(store.getState().color.focusColor.g),
							255- Math.floor(store.getState().color.focusColor.b)
					  ]
					: colorR;
					  
					console.log(colorR);

			const data = {
				model: 'default',
				input: [colorA, 'N', 'N', 'N', 'N']
			};

			const http = new XMLHttpRequest();

			const self = this;
			http.onreadystatechange = function() {
				if (http.readyState == 4 && http.status == 200) {
					var palette = JSON.parse(http.responseText).result as number[][];
					console.log(self.parseColor(palette));
					store.dispatch(fetchColorSuccesss());
					store.dispatch(updateColor(self.parseColor(palette)));
				}
			};

			http.open('POST', url, true);
			http.send(JSON.stringify(data));
		}, 800);
	}

	private parseColor(colors: number[][]) {
		const colorArr = [];

		for (let ii = 0; ii < colors.length; ii = ii + 1) {
			colorArr.push({
				r: colors[ii][0],
				g: colors[ii][1],
				b: colors[ii][2],
				index: ii,
				key: store.getState().color.group * 5 + ii,
				group: store.getState().color.group,
				live: true
			});
		}

		return colorArr;
	}

	render() {
		return (
			<div>
				{this.state.colors.map((item, index) => (
					<ColorCard color={item} key={item.key} />
				))}
			</div>
		);
	}
}
