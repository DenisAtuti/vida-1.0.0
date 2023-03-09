import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminTemplateRemoverService {
  
  private subject = new Subject<boolean>();

  constructor() { }

  removeTemplate(): Observable<boolean>{
    return this.subject.asObservable()
  } 

  setTemplate(isAdmin: boolean){
    this.subject.next(isAdmin);             
  }

}
