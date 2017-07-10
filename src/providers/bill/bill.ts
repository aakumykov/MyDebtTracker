import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import {
	AngularFireDatabase,
	FirebaseListObservable,
	FirebaseObjectObservable,
} from 'angularfire2/database';
import * as firebase from 'firebase';

@Injectable()
export class BillProvider {
	public billList: FirebaseListObservable<any>;
	public billDetail: FirebaseObjectObservable<any>;
	public userId: string;

	constructor(public afAuth: AngularFireAuth, public afDatabase: AngularFireDatabase) {
		this.afAuth.authState.subscribe(
			auth => {
				if (auth){
					// console.log('BillProvider.constructor(), auth.uid: '+auth.uid);
					
					this.billList = this.afDatabase.list(`/userProfile/${auth.uid}/billList`);
					
					// console.log('BillProvider.constructor(), this.billList:');
					// console.log(this.billList);
					
					this.userId = auth.uid;
				}
			}
		);
	}

	getBillList(): FirebaseListObservable<any> {
		// console.log('BillProvider.getBillList(), this.billList: '+this.billList);
		return this.billList; 
	}

	getBill(billId: string): FirebaseObjectObservable<any> {
		return this.billDetail = this.afDatabase
			.object(`/userProfile/${this.userId}/billList/${billId}`);
	}

	createBill(
		name: string, 
		amount: number, 
		dueDate: string = null,
		paid: boolean = false
	): firebase.Promise<any> {
		return this.billList.push(
			{ 
				name, 
				amount, 
				dueDate,
				paid,
			}
		);
	}

	removeBill(billId: string): firebase.Promise<any> {
		return this.billList.remove(billId);
	}

	payBill(billId: string): firebase.Promise<any> {
		return this.billList.update(billId, {paid: true});
	}

	uploadBillPhoto(billId: string, imageURL: string): any {
		console.info('BillProvider.uploadBillPhoto()');

		const storageRef = firebase.storage().ref(this.userId);
		console.info('BillProvider.uploadBillPhoto(), storageRef: '+storageRef);
		
		return storageRef.child(billId).child('billPicture')
			.put(imageURL).then(
				pictureSnapshot => {
					console.info('BillProvider.uploadBillPhoto(), pictureSnapshot:');
					console.info(pictureSnapshot);
					this.billList.update(billId, { picture: pictureSnapshot.downloadURL });
				},
				error => {
					console.info('BillProvider.uploadBillPhoto(), ERROR: '+error.message);
				}
			);
	}


}
