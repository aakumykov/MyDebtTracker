import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireAuth } from 'angularfire2/auth';

import { HomePage } from '../pages/home/home';
@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	rootPage:any;

	constructor(
		platform: Platform, 
		statusBar: StatusBar, 
		splashScreen: SplashScreen,
		afAuth: AngularFireAuth,
	) {
		platform.ready().then(() => {
			statusBar.styleDefault();
			splashScreen.hide();

			const authListener = afAuth.authState.subscribe( user => {
				if (user){
					this.rootPage = HomePage;
					authListener.unsubscribe();
				} else {
					this.rootPage = 'LandingPage';
					authListener.unsubscribe();
				}
			});

			
		});
	}
}

