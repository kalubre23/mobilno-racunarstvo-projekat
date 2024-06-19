import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

interface AuthResponseData{
  kind: string;
  idToken: string;
  email: string;
  refreshToken:	string;
  expiresIn: string;
  localId: string;
  registered: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isAuth = false;
  private _userId = '';

  constructor(private http: HttpClient) { }

  get userId() {
    return this._userId;
  }

  get isAuth() {
    return this._isAuth;
  }

  signup(email: string, password: string){
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`,
      {email: email, password: password, returnSecureToken: true}
    );
  }

  login() {
    this._isAuth = true;
  }

  logout() {
    this._isAuth = false;
  }
}
