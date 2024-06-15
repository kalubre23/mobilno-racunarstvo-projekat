import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading = false;
  isLogin = true;

  constructor(private authService: AuthService, 
    private router: Router,
    private loadingCtrl: LoadingController) { }

  ngOnInit() {
  }

  onLogin(){
    //prvo se uloguje, i onda dok se kao ceka da se uloguje prikaze se overlay
    //kad se zavrsi login dismissuje se overlay i ide dalje
    this.isLoading = true;
    this.authService.login();
    //da se tastatura zatvori sama keyboardClose
    this.loadingCtrl.create({keyboardClose: true, message: 'Logging...'}).then(
      loadingEl => {
        loadingEl.present();
        setTimeout(() => {
          this.isLoading = false;
          loadingEl.dismiss();
          this.router.navigateByUrl('/places/tabs/discover');
        }, 1500)
      }
    );
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;
    console.log(email, password);

    if (this.isLogin) {
      //login
    } else {
      //zahtjev za signup
    }
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;

  }

}
