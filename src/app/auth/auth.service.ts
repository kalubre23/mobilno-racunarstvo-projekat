import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isAuth = false;

  constructor() { }

  get isAuth() {
    return this._isAuth;
  }

  login() {
    this._isAuth = true;
  }

  logout() {
    this._isAuth = false;
  }
}
