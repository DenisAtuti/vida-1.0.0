import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IsLoggedService } from './Services/is-logged.service';
import { LandingService } from './Services/landing.service';
import { SetScrolledHeightService } from './Services/set-scrolled-height.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  constructor(
    private landingService: LandingService, 
    private logged: IsLoggedService,
    private scroll: SetScrolledHeightService
    ){}
  
  title = 'vida';
  isLanding: boolean = false;
  landingSub: Subscription

  ngOnInit(): void {
    this.landingSub = this.landingService.landingSubj.subscribe(
      (landing: boolean) =>{
        this.isLanding = landing;
      }) 

    this.isLanding = localStorage.getItem("isLanding") === 'true' ? true : false;
    this.logged.verifyToken()
    this.scroll.setAllComponentScollToDefault();
  }

  openLanding(){
    setTimeout(() => {
      localStorage.setItem("isLanding","true")
      this.landingService.landingSubj.next(true)
      console.log("subjecting");
    }, 10000);
  }


  ngOnDestroy(): void {
    this.landingSub.unsubscribe()
  }
}
