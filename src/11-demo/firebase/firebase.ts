import firebase from 'firebase/app';
import 'firebase/database';
import { firebaseConfig } from './_config';
import EventEmitter from 'wolfy87-eventemitter';

export class Firebase extends EventEmitter {
	private database: firebase.database.Database;
	private root: firebase.database.Reference;
	private id: string;
	public datas = {};

	constructor() {
		super();

		firebase.initializeApp(firebaseConfig);
		this.database = firebase.database();
		this.root = this.database.ref('players');

		this.root.on('value', (snapshot) => {
			const value = snapshot.val();
			console.log(value);
			this.datas = {};
			for (const key in value) {
				this.datas[key] = value[key];
			}

			console.log(this.datas);

			this.emit('update');
		});
	}

	public addPlayer(name: string) {
		const playerRef = this.root.push();
		playerRef.once('value', (snapshot) => {
			const value = snapshot.val();
			const key = snapshot.key;
			console.log(key);
			this.id = key;
			this.emit('register');
		});
		playerRef.set({
			name,
		});
	}

	public removePlayer() {
		console.log(this.id);
		if (this.id) {
			const database = firebase.database();
			database
				.ref(`players/${this.id}`)
				.remove()
				.then(function () {
					console.log('Remove succeeded.');
				})
				.catch(function (error) {
					console.log('Remove failed: ' + error.message);
				});
			// this.database.ref(`players/${this.id}`).remove();
			this.id = null;
		}
	}
}
