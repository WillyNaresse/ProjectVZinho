import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, query, where, updateDoc } from '@angular/fire/firestore';
import { ChecklistData } from '../../shared/types/checklist-data.type';
import { LoginService } from '../login/login.service';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChecklistService {

  firestore = inject(Firestore);
  checklistsCollection = collection(this.firestore, 'checklists')
  checklistData$: WritableSignal<ChecklistData[] | null> = signal(null);

  constructor(private loginService: LoginService) {}

  getChecklists(): Observable<ChecklistData[]> {
    const userUid = this.loginService.userData$()?.uid;

    const checklistsQuery = query(
      this.checklistsCollection,
      where('userUid', '==', userUid)
    );

    return collectionData(checklistsQuery, { idField: 'id' }) as Observable<ChecklistData[]>;
  }

  addChecklistToCollection(checklist: ChecklistData) {
    const newChecklist: any = {
      ...checklist,
      userUid: this.loginService.userData$()?.uid
    };

    const promise = addDoc(this.checklistsCollection, newChecklist);

    return from(promise);
  }

  editChecklist(id: string, checklist: ChecklistData) {
    const docRef = doc(this.firestore, 'checklists/' + id);
    const updatedChecklist = {
      ...checklist,
      userUid: this.loginService.userData$()?.uid
    };
    const promise = updateDoc(docRef, updatedChecklist);

    return from(promise);
  }

  editChecklistItems(id: string, checklistItems: any[]) {
    const docRef = doc(this.firestore, 'checklists/' + id);

    const promise = updateDoc(docRef, {
      checklistItems: checklistItems
    });

    return from(promise);
  }

  deleteChecklist(id: string) {
    const docRef = doc(this.firestore, 'checklists/' + id);
    const promise = deleteDoc(docRef);

    return from(promise);
  }
}
