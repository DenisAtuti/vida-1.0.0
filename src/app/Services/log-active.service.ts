import { EventEmitter, Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogActiveService implements OnInit {

  activeEv = new EventEmitter<void>()

  constructor() { }

  ngOnInit(): void {
    this.setActive()
  }

  setActive(){
    this.activeEv.emit()    
  }
}
