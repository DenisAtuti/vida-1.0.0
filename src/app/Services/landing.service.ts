import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LandingService {

  constructor() { }

  landingSubj = new Subject<boolean>();

}
