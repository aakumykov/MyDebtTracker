import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BillProvider } from '../../providers/bill/bill';

@IonicPage()
@Component({
	selector: 'page-create-bill',
	templateUrl: 'create-bill.html',
})

export class CreateBillPage {
	public newBillForm: FormGroup;

	constructor(
		public navCtrl: NavController, 
		public formBuilder: FormBuilder,
		public billProvider: BillProvider
	) {
		this.newBillForm = formBuilder.group({
			name: ['', Validators.required],
			amount: ['', Validators.required],
			dueDate: ['', Validators.required],
		});
	}

	createBill():void {
		if (!this.newBillForm.valid){
			console.log(this.newBillForm.value);
		} else {
			this.billProvider.createBill(
				this.newBillForm.value.name,
				this.newBillForm.value.amount,
				this.newBillForm.value.dueDate
			).then( () => {
					this.navCtrl.pop();
				}, error => {
					console.log(error);
			});
		}
	}

	
}