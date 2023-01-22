import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class AutoScrollService {

  private subject = new Subject<string>();
  constructor() { }

  autoScroll(): Observable<string>{
    return this.subject.asObservable()
  } 

  setAutoScroll(componentPage: string){
    this.subject.next(componentPage)
  }

}
