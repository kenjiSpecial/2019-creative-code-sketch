import firebase from 'firebase/app';
import 'firebase/database';
import { firebaseConfig } from './_config';
import EventEmitter from 'wolfy87-eventemitter';

export class Firebase extends EventEmitter {
	private database: firebase.database.Database;
	private players: firebase.database.Reference;
	private messages: firebase.database.Reference;
	private playerRef: firebase.database.Reference;
	private id: string;
	private messageID: string;
	public datas = {};

	constructor() {
		super();

		firebase.initializeApp(firebaseConfig);
		this.database = firebase.database();
		this.players = this.database.ref('players');
		// this.messages = this.database.ref('messages');

		this.players.on('value', (snapshot) => {
			const value = snapshot.val();
			this.datas = {};
			for (const key in value) {
				this.datas[key] = value[key];
			}

			this.emit('update');
		});
	}

	public addPlayer(name: string) {
		const playerRef = this.players.push();
		playerRef.once('value', (snapshot) => {
			const value = snapshot.val();
			const key = snapshot.key;
			this.id = key;
			this.emit('register');
		});
		playerRef.set({
			name: name,
			message: '',
		});
		this.playerRef = playerRef;
	}

	public removePlayer() {
		// console.log(this.id);
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

	public getID() {
		return this.id;
	}

	public updateMessage(message: string) {
		
		this.playerRef.once('value')
		this.playerRef.set({
			message: message,
		});		
	}
}
