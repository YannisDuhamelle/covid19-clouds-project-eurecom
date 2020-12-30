import { Injectable } from '@angular/core';

import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})

// This is the service that is handling everything related to the connection of the user
export class SigninServiceService {

  // By default, an user owned 4 values : uid, name, email (those 3 given by the Google Account) and admin (this is the right to access add-news page)
  userLogged = {
    uid: "",
    displayName: "",
    email: "",
    admin: false
  };

  constructor(private afAuth: AngularFireAuth, private router: Router, private firestore: AngularFirestore) { }

  // This function is called when the user click on the button "Sign in with Google"
  async signInWithGoogle() {

    // We wait for the credentials of the user given by Google Authentication
    const credentials = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());

    // If the credentials are not null (the user logged in), we create the user with those data (and the admin value to false) and strore it locally
    if (credentials.user != null) {
      if (credentials.user.uid != null && credentials.user.displayName != null && credentials.user.email != null) {

        this.userLogged = {
          uid: credentials.user.uid,
          displayName: credentials.user.displayName,
          email: credentials.user.email,
          admin: false
        };
        localStorage.setItem("users", JSON.stringify(this.userLogged));

        // We are looking at the firestore DB if the user exist
        this.firestore.collection("users").doc(this.userLogged!.uid).get().subscribe((doc) => {

          // If the user exist, we are looking at its admin attribute
          if (doc.exists) {
            // If its admin attribute is true, we update the user stored locally to the admin attribute true and redirect the user to add-news
            if (doc.get("admin") == true) {
              let buffer_user = JSON.parse(localStorage.getItem("users")!);
              buffer_user["admin"] = true;
              localStorage.removeItem("users");
              this.userLogged = buffer_user;
              localStorage.setItem("users", JSON.stringify(buffer_user));
              console.log(localStorage.getItem("users"));
              this.router.navigate(["add-news"]);
            }
            // If its admin attribute is true, we redirect the user to signin page (where a essage will be displayed to tell him that he must be admin)
            else {
              this.router.navigate(["signin"]);
            }
          }
          // If the user doe not exist, we add it to the firestore DB and redirect him to the signin page
          else {
            this.addUser();
            this.router.navigate(["signin"]);
          }
        });        
      }
    }
  }

  // This function is storing the user logged in on the firestore database
  private addUser() {
    this.firestore.collection("users").doc(this.userLogged!.uid).set({
      uid: this.userLogged!.uid,
      displayName: this.userLogged!.displayName,
      email: this.userLogged!.email,
      admin: this.userLogged!.admin
    }, { merge: true });
  }

  // This function is used to sign out the user and we redirect him to signin
  public signOut() {
    this.afAuth.signOut();
    localStorage.removeItem("users");
    this.userLogged = { uid: "", displayName: "", email: "", admin: false };
    this.router.navigate(["signin"]);
  }

  // This function return true if the user is signed in and false if it is not the casse
  userSignedIn(): boolean {
    //localStorage.removeItem("users");
    if (localStorage.getItem("users") != null) {
      return JSON.parse(localStorage.getItem("users")!) != null;
    }
    else { return false; }
  }

  // This function is returning the user signed in
  getUser() {
    if (this.userSignedIn() == true) {
      return JSON.parse(localStorage.getItem("users")!);
    }
    return this.userLogged;
  }
}
