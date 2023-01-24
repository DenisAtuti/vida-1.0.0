import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  constructor() { }

  getYeah(){
    return new Date().getFullYear()
  }
}
