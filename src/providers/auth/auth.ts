import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';

@Injectable()
export class AuthProvider {
	fireAuth: any;

	constructor(public afAuth: AngularFireAuth, afDatabase: AngularFireDatabase) {
		this.afAuth.authState.subscribe( user => {
			if (user) {
				this.fireAuth = user;
			}
		});
	}

	getUser():firebase.User { 
		return this.fireAuth; 
	}

	loginUser(newEmail: string, newPassword: string):firebase.Promise<any> {
		return this.afAuth.auth.signInWithEmailAndPassword(newEmail, newPassword);
	}

	anonymousLogin():firebase.Promise<any> {
		return this.afAuth.auth.signInAnonymously();
	}

	linkAccount(email: string, password: string):firebase.Promise<any> {
		const userProfile = firebase.database().ref('/userProfile');
		const credential = firebase.auth.EmailAuthProvider.credential(email, password);
		
		return firebase.auth().currentUser.link(credential).then(
			user => {
				userProfile.child(user.uid).update({ email: email });
			},
			error => {
				console.log("There was an error linking the account", error);
			}
		);
	}

	resetPassword(email: string):firebase.Promise<any> {
		return this.afAuth.auth.sendPasswordResetEmail(email);
	}

	logoutUser():firebase.Promise<void> { 
		return this.afAuth.auth.signOut();
	}
}