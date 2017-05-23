import { Component } from '@angular/core';
import {
	IonicPage,
	NavController,
	NavParams,
	ActionSheetController,
	Platform,
	AlertController 
} from 'ionic-angular';
import { BillProvider } from '../../providers/bill/bill';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage({
	segment: 'bill/:billId'
})
@Component({
	selector: 'page-bill-detail',
	templateUrl: 'bill-detail.html',
})

export class BillDetailPage {
	public bill: Object;
	public placeholderPicture: string = "assets/img/credit.png";

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public actionCtrl: ActionSheetController, 
		public platform: Platform,
		public alertCtrl: AlertController, 
		public billProvider: BillProvider,
		public authProvider: AuthProvider
	) {
		this.billProvider.getBill(this.navParams.get("billId"))
			.subscribe( billSnap => { this.bill = billSnap });
	}

	showOptions(billId): void{
	    const action = this.actionCtrl.create({
	      title: 'Изменить займ',
	      buttons: [
	        {
	          text: 'Удалить',
	          role: 'destructive',
	          icon: !this.platform.is('ios') ? 'trash' : null,
	          handler: () => {
	            this.billProvider.removeBill(billId)
	              .then( () => { this.navCtrl.pop(); });
	          }
	        },
	        {
	          text: 'Пометить как оплаченный!',
	          icon: !this.platform.is('ios') ? 'checkmark' : null,
	          handler: () => {
	            this.billProvider.payBill(billId);
	          }
	        },
	        {
	          text: 'Отмена',
	          role: 'cancel',
	          icon: !this.platform.is('ios') ? 'close' : null,
	          handler: () => {
	            console.log('Cancel clicked');
	          }
	        }
	      ]
	    });
	    action.present();
	}

	
}