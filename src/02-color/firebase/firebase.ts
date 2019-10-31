import firebase from 'firebase/app';
import 'firebase/database';
// import { counterModule } from '../store/modules/couter';
// import store from '../store/store';
// import { firebaseConfig } from './config';

const firebaseConfig = {
    apiKey: "AIzaSyDSlTdL6ujGfA5sHGtPElv86ROFby-zf04",
    authDomain: "creative-coding-sketches.firebaseapp.com",
    databaseURL: "https://creative-coding-sketches.firebaseio.com",
    projectId: "creative-coding-sketches",
    storageBucket: "creative-coding-sketches.appspot.com",
    messagingSenderId: "918212412691",
    appId: "1:918212412691:web:7b8412eeb19d4f0f57c6e6",
    measurementId: "G-EXWQF2GK7P"
  };

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

		this.colors.once('value', snapshot => {
            const value = snapshot.val();
			
			for(let key in value){
				console.log(key);
			}

			if (value) {

            }
            callback();
		});
	}

	public updateCount(value: Number) {
		// const updates = {
		// 	'/colors': {'test': true}
		// };

		// // tslint:disable-next-line: no-floating-promises
		// this.database.ref().update(updates);
		// var newPostRef = this.counter.push();
		// newPostRef.set({
		// 	'test': 'hello'
		// });
	}


}