import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompletedService {

  private isCompletedSubject = new Subject<string>();

  constructor() { }

  isVideoLoaded(component: string){
    this.isCompletedSubject.next(component)
  }

  videoIsLoaded():Observable<string>{
    return this.isCompletedSubject.asObservable()
  }
  
}
