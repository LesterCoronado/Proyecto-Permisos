import { Component, OnInit } from '@angular/core';
import { GoogleLoginProvider, SocialAuthService } from "@abacritt/angularx-social-login";
import { SocialUser } from "@abacritt/angularx-social-login";

import {
  FacebookLoginProvider,
  AmazonLoginProvider,
  VKLoginProvider,
  MicrosoftLoginProvider,
}
from "@abacritt/angularx-social-login";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: SocialUser | undefined;
  GoogleLoginProvider = GoogleLoginProvider;

  constructor(private readonly _authService: SocialAuthService) {}

  ngOnInit() {

    this._authService.authState.subscribe((user) => {
      this.user = user,
     
      sessionStorage.setItem('email', `${user.email}`);
    });
  }

  signInWithFB(): void {
    this._authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signInWithAmazon(): void {
    this._authService.signIn(AmazonLoginProvider.PROVIDER_ID);
  }

  signInWithVK(): void {
    this._authService.signIn(VKLoginProvider.PROVIDER_ID);
  }

  signInWithMicrosoft(): void {
    this._authService.signIn(MicrosoftLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this._authService.signOut();
  }

  refreshGoogleToken(): void {
    this._authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }

}
