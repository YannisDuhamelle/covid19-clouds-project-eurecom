import { Injectable } from '@angular/core';

import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SigninServiceService {

  userLogged = {
    uid: "",
    displayName: "",
    email: "",
    admin: false
  };

  constructor(private afAuth: AngularFireAuth, private router: Router, private firestore: AngularFirestore) { }

  async signInWithGoogle() {
    const credentials = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    if (credentials.user != null) {
      if (credentials.user.uid != null && credentials.user.displayName != null && credentials.user.email != null) {
        this.userLogged = {
          uid: credentials.user.uid,
          displayName: credentials.user.displayName,
          email: credentials.user.email,
          admin: false
        };
        localStorage.setItem("users", JSON.stringify(this.userLogged));
        this.firestore.collection("users").doc(this.userLogged!.uid).get().subscribe((doc) => {
          if (doc.exists) {
            if (doc.get("admin") == true) {
              this.router.navigate(["add-news"]);
            }
            else {
              this.router.navigate(["signin"]);
            }
          }
          else {
            this.addUser();
            this.router.navigate(["signin"]);
          }
        });        
      }
    }
  }

  private addUser() {
    //collection("users") est la collection
    this.firestore.collection("users").doc(this.userLogged!.uid).set({
      uid: this.userLogged!.uid,
      displayName: this.userLogged!.displayName,
      email: this.userLogged!.email,
      admin: this.userLogged!.admin
    }, { merge: true });
  }

  public signOut() {
    this.afAuth.signOut();
    localStorage.removeItem("users");
    this.userLogged = { uid: "", displayName: "", email: "", admin: false };
    this.router.navigate(["signin"]);
  }

  public isLoggedIn() {
    if (this.userLogged.uid == "") {
      return false;
    }
    else {
      return true;
    }
  }

  userSignedIn(): boolean {
    if (localStorage.getItem("users") != null) {
      return JSON.parse(localStorage.getItem("users")!) != null;
    }
    else { return false; }
  }

  getUser() {
    if (this.userSignedIn() == true && this.userLogged.uid != "") {
      return JSON.parse(localStorage.getItem("users")!);
    }
    return this.userLogged;
  }


}
