import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { LoginData } from '../../shared/types/login-data.type';
import { from, Observable } from 'rxjs';
import { SignupData } from '../../shared/types/signup-data.type';
import { collection, collectionData, doc, Firestore, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import {
  Auth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
  user,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  firebaseAuth = inject(Auth);
  firestore = inject(Firestore);
  usersCollection = collection(this.firestore, 'users')
  user$ = user(this.firebaseAuth);
  userData$: WritableSignal<User | null> = signal(null);

  constructor() {}

  login(data: LoginData) {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      data.email,
      data.password
    );

    return from(promise);
  }

  signup(data: SignupData) {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      data.email,
      data.password
    ).then((res) => {
      updateProfile(res.user, { displayName: data.name });
      sendEmailVerification(res.user);
      this.addUserToCollection(data, res.user.uid);
    });

    return from(promise);
  }

  logout() {
    const promise = signOut(this.firebaseAuth)

    return from(promise);
  }

  resetPassword(email: string) {
    const promise = sendPasswordResetEmail(this.firebaseAuth, email);

    return from(promise);
  }

  addUserToCollection(user: SignupData, uid: string) {
    const newUser: any = { ...user };

    delete newUser.password;
    delete newUser.passwordConfirm;

    newUser.id = uid;

    const userDocRef = doc(this.usersCollection, uid);
    setDoc(userDocRef, newUser);
  }

  getUserData(): Observable<SignupData[]> {
    const id = this.userData$()?.uid;

    const usersQuery = query(
      this.usersCollection,
      where('id', '==', id)
    );

    return collectionData(usersQuery, { idField: 'id' }) as Observable<SignupData[]>;
  }

  editUserData(id: string, userData: SignupData) {
    const docRef = doc(this.firestore, 'users/' + id);
    const updatedUser = {
      ...userData,
      id: this.userData$()?.uid
    };
    const promise = updateDoc(docRef, updatedUser);

    return from(promise);
  }
}
