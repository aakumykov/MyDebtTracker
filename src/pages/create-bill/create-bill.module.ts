import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateBillPage } from './create-bill';

@NgModule({
  declarations: [
    CreateBillPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateBillPage),
  ],
  exports: [
    CreateBillPage
  ]
})
export class CreateBillPageModule {}
