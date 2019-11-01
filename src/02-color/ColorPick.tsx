import * as React from 'react';
import { Component } from 'react';
import { url } from './constants';
import { store } from './state/index';
import { startColorLoad, fetchColorSuccesss } from './state/App/actions';
import { IColor } from './state/Color/types';
import { color } from './state/Color/reducers';
import { updateColor } from './state/Color/actions';
import { ColorCard } from './ColorCard';

interface IState {
	colors: IColor[];
}

export class ColorPick extends Component<{}, IState> {
	state = { colors: [] };

	componentDidMount() {
		this.getColors();
		store.subscribe(() => {
			const colors = store.getState().color.colors;
			this.setState({ colors: colors });
		});
	}

	private getColors() {
		store.dispatch(startColorLoad());
		const data = {
			model: 'default'
        };
        

		const http = new XMLHttpRequest();

		const self = this;
		http.onreadystatechange = function() {
			if (http.readyState == 4 && http.status == 200) {
				var palette = JSON.parse(http.responseText).result as number[][];
				store.dispatch(fetchColorSuccesss());
                store.dispatch(updateColor(self.parseColor(palette)));
                console.log('hello');
			}
		};

		http.open('POST', url, true);
		http.send(JSON.stringify(data));
	}
	private parseColor(colors: number[][]) {
		const colorArr = [];
		for (let ii = 0; ii < colors.length; ii = ii + 1) {
			colorArr.push({
				r: colors[ii][0],
				g: colors[ii][1],
				b: colors[ii][2]
			});
		}

		return colorArr;
	}
	render() {
		return (
			<div  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
				{this.state.colors.map((item, index) => (
					<ColorCard color={item} key={index} index={index} />
				))}
			</div>
		);
	}
}
