import firebase from 'firebase/app';
import 'firebase/database';
// import { counterModule } from '../store/modules/couter';
// import store from '../store/store';
// import { firebaseConfig } from './config';
import { IColor } from '../state/Color/types';
import { store } from '../state/index';
import { selectColors } from '../state/Color/actions';
import { firebaseConfig } from './config';

export class Firebase {
	private static instance: Firebase;
	private database: firebase.database.Database;
	private colors: firebase.database.Reference;
	private selectedColor: firebase.database.Reference;
	private notselectedColor: firebase.database.Reference;

	public static GET_INSTANCE(): Firebase {
		if (Firebase.instance === undefined) {
			Firebase.instance = new Firebase();
		}

		return Firebase.instance;
	}

	public init() {
		firebase.initializeApp(firebaseConfig);
	}

	public initDatabase(callback: Function) {
		this.database = firebase.database();

		this.colors = this.database.ref('colors');
		this.selectedColor = this.database.ref('colors/select');
		this.notselectedColor = this.database.ref('colors/not_select');

		this.selectedColor.remove();

		this.colors.on('value', snapshot => {
			const value = snapshot.val();

			if (value) {
				const selectValue = value.select;

				const colors = [];
				for (let key in selectValue) {
					colors.push({
						r: selectValue[key].r,
						g: selectValue[key].g,
						b: selectValue[key].b
					});
				}

				if (colors.length > 0) {
					store.dispatch(selectColors(colors));
				} else {
					store.dispatch(selectColors([{ r: 255, g: 255, b: 255 }]));
				}
			} else {
				store.dispatch(selectColors([{ r: 255, g: 255, b: 255 }]));
			}
			callback();
		});
	}

	public updateColor(color: IColor) {
		const newPostRef = this.selectedColor.push();
		newPostRef.set(color);
	}
}
