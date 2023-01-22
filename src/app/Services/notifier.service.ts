import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { NotifierOpt } from '../Models/notifierOpt-model';

@Injectable({
  providedIn: 'root'
})
export class NotifierService {

  notifierSubject = new Subject<NotifierOpt>();
  textSubject = new Subject<boolean>();

  constructor() { }

  init():Promise<boolean>{
    return new Promise<boolean>((resolve) =>{
      this.textSubject.next(true)
      console.log("shit")
      resolve(true)
    })
    
  }

  showNotification(options: NotifierOpt) {
    this.notifierSubject.next(options);
  }
}
