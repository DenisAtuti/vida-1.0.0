import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class StateService{

  constructor() { }
  
  private adActiveSub = new Subject<boolean>();

  getYeah(){
    return new Date().getFullYear()
  }

  openCloseAd():Observable<boolean>{
    return this.adActiveSub.asObservable();                         
  }

  setOpenCloseAd(isAdActive: boolean){                     
    this.adActiveSub.next(isAdActive)
  }


}                   
