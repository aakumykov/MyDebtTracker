import { Component } from '@angular/core';
import {
	IonicPage,
	NavController,
	NavParams,
	ActionSheetController,
	Platform,
	AlertController 
} from 'ionic-angular';
import { Camera } from '@ionic-native/camera';

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
	public file: any = null;
	public uploadResult: string = 'НЕИЗВЕСТНО';

	public billId: string = '';
	public bill: Object;
	public placeholderPicture: string = "assets/img/credit.png";

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public actionCtrl: ActionSheetController, 
		public platform: Platform,
		public alertCtrl: AlertController, 
		public billProvider: BillProvider,
		public authProvider: AuthProvider,
		private camera: Camera,
	) {
		this.billProvider.getBill(this.navParams.get("billId"))
			.subscribe( billSnap => { 
				//console.info('BillDetailPage.constructor(), bill:');
				//console.info(billSnap);
				this.bill = billSnap 
			});

		this.billId = this.navParams.get("billId");
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

	uploadPicture() {
		console.info('BillDetailPage.uploadPicture(), billId: '+this.billId);

		if (true == this.authProvider.getUser().isAnonymous) {
			console.info('BillDetailPage.uploadPicture(), НУЖНА РЕГИСТРАЦИЯ');

			const alert = this.alertCtrl.create({
				message: "Чтобы продолжить, вам нужно зарегистрироваться",
				buttons: [
					{ text: "Нет" },
					{
						text: "Да",
						handler: data => {
							this.navCtrl.push('SignupPage');
						}
					}
				]
			});
			alert.present();
		} else {
			console.info('BillDetailPage.uploadPicture(), ЗАРЕГИСТРИРОВАН, делаю фото');

			console.info('---------- typeof(this.file): ----------');
			console.info(typeof(this.file));
			console.info('---------- this.file: ----------');
			console.info(this.file);

			this.billProvider.uploadBillPhoto(this.billId, this.file).then( () => {
				this.uploadResult = 'УСПЕХ';
				console.info('uploadPicture() SUCCESS');
			}).catch( (error: any) => {
				this.uploadResult = 'ОШИБКА, '+error.message;
				console.error('uploadPicture() ERROR:');
				console.error(error);
			});

			// this.camera.getPicture({
			// 	quality : 95,
			// 	destinationType : this.camera.DestinationType.DATA_URL,
			// 	sourceType : this.camera.PictureSourceType.PHOTOLIBRARY,
			// 	allowEdit : true,
			// 	encodingType: this.camera.EncodingType.PNG,
			// 	targetWidth: 500,
			// 	targetHeight: 500,
			// 	saveToPhotoAlbum: true
			// }).then(
			// 	imageData => {
			// 		// console.info('BillDetailPage.uploadPicture(), imageData: '+imageData);
			// 		this.billProvider.uploadBillPhoto(billId, imageData);
			// 	}, 
			// 	error => {
			// 		console.log("ERROR -> " + JSON.stringify(error));
			// 	}
			// );
		}
	}

	public fileChanged(file: any) {
		this.file = file;
		this.uploadPicture();
	}

}
