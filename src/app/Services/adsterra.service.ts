import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class AdsterraService {

  private ads = new Subject<boolean>();

  constructor() { }

  setAd(isAd: boolean){
    this.ads.next(isAd);
  }

  getAd(){
    return this.ads.asObservable();
  }
}
