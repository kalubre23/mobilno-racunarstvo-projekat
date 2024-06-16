import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isAuth = false;
  private _userId = 'u1';

  constructor() { }

  get userId() {
    return this._userId;
  }

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
