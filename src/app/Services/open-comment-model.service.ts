import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class OpenCommentModelService {
  
  activeEv = new EventEmitter<void>()

  private videoIdSubject = new Subject<number>()

  constructor() { }

  setActive(){
    this.activeEv.emit()    
  }

  sendVideoId(videoId: number){
    this.videoIdSubject.next(videoId)
  }

  getVideoId():Observable<number>{
    return this.videoIdSubject.asObservable()
  }

}