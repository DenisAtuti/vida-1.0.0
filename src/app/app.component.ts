import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { IsLoggedService } from './Services/is-logged.service';
import { LandingService } from './Services/landing.service';
import { SetScrolledHeightService } from './Services/set-scrolled-height.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,  AfterViewInit, OnDestroy{
  constructor(
    private landingService: LandingService, 
    private renderer: Renderer2, 
    private logged: IsLoggedService,
    private scroll: SetScrolledHeightService
    ){}
  
  
  title = 'vida';
  isLanding: boolean = false;
  isAdActive: boolean = false;
  landingSub: Subscription
  @ViewChild("content", {static: false}) contentEl: ElementRef;
  content:any;

  ngOnInit(): void {
    this.landingSub = this.landingService.landingSubj.subscribe(
      (landing: boolean) =>{
        this.isLanding = landing;
      }) 

    this.isLanding = localStorage.getItem("isLanding") === 'true' ? true : false;
    this.logged.verifyToken()
    this.scroll.setAllComponentScollToDefault();
    
  }

  ngAfterViewInit(): void {
    this.content = this.contentEl.nativeElement
    this.renderer.listen(this.content, 'mouseenter' ,()=>{
      this.fullScreenOnMobile()
    })

    setTimeout(() => {
      this.isAdActive = true
    }, 3000);
  }

  openLanding(){
    setTimeout(() => {
      localStorage.setItem("isLanding","true")
      this.landingService.landingSubj.next(true)
      console.log("subjecting");
    }, 30000);
  }

  fullScreenOnMobile(){
    if (document.fullscreenElement == null && window.innerWidth <= 768) {
      this.content.requestFullscreen()
      console.log(this.content)
    }
  }

  closeAd(){
    this.isAdActive = false
    setTimeout(() => {
      this.isAdActive = true
    }, 25000);
  }


  ngOnDestroy(): void {
    this.landingSub.unsubscribe()
  }
}
