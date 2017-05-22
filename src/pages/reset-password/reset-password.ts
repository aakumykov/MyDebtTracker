import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
	selector: 'page-reset-password',
	templateUrl: 'reset-password.html',
})

export class ResetPasswordPage {
	resetPasswordForm: FormGroup;
	
	constructor(
		public navCtrl: NavController, 
		public alertCtrl: AlertController,
		public authProvider: AuthProvider, 
		public formBuilder: FormBuilder
	) {
		this.resetPasswordForm = formBuilder.group({
			email: ['', Validators.required]
		});
	}

	resetPassword():void {
		if (!this.resetPasswordForm.valid){
			console.log(this.resetPasswordForm.value);
		} else {
			this.authProvider.resetPassword(this.resetPasswordForm.value.email).then(
				(user) => {
					const alert = this.alertCtrl.create({
						message: "Вам отправлено письмо для восстановления пароля",
						buttons: [{
							text: "Угу",
							role: 'cancel',
							handler: () => {
								this.navCtrl.pop();
							}
						}]
					});
					alert.present();
				}, 
				(error) => {
					var errorMessage: string = error.message;
					const errorAlert = this.alertCtrl.create({
						message: errorMessage,
						buttons: [{
							text: "Угу",
							role: 'cancel'
						}]
					});
					errorAlert.present();
				}
			);
		}
	}


}
