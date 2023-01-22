import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class CanGetPostService {

  private subject = new Subject<{componentPage:string, videoId:number}>()

  constructor() { }

  setCanGetPost(componentPage: string, videoId: number){
    this.subject.next({componentPage, videoId})
  }

  canGetPost():Observable<any>{
    return this.subject.asObservable()
  }


}
