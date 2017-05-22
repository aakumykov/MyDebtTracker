import { Component } from '@angular/core';
import { NavController, ActionSheetController, Platform } from 'ionic-angular';

import { BillProvider } from '../../providers/bill/bill';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	public billList: any;
	
	constructor(
		public navCtrl: NavController,
		public actionCtrl: ActionSheetController, 
		public platform: Platform,
		public billProvider: BillProvider,
	) {
		this.billList = this.billProvider.getBillList();
	}

	createBill(): void { this.navCtrl.push('CreateBillPage'); }

	goToPaidBill(billId: string): void {
		this.navCtrl.push('BillDetailPage', { 'billId': billId });
	}

	moreBillOptions(billId){
		let action = this.actionCtrl.create({
			title: 'Изменить займ',
			buttons: [
				{
					text: 'Удалить',
					role: 'destructive',
					icon: !this.platform.is('ios') ? 'trash' : null,
					handler: () => {
						this.billProvider.removeBill(billId);
					}
				},
				{
					text: 'Подробнее',
					icon: !this.platform.is('ios') ? 'play' : null,
					handler: () => {
						this.navCtrl.push('BillDetailPage', { 'billId': billId });
					}
				},
				{
					text: 'Пометить оплаченным',
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
