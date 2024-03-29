import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AdsterraService } from './Services/adsterra.service';
import { IsLoggedService } from './Services/is-logged.service';
import { SetScrolledHeightService } from './Services/set-scrolled-height.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,  AfterViewInit{
  constructor(
    private renderer: Renderer2, 
    private logged: IsLoggedService,
    private scroll: SetScrolledHeightService,
    private adService: AdsterraService
    ){}
  
  
  title = 'vida';
  isAdActive: boolean = false;
  @ViewChild("content", {static: false}) contentEl: ElementRef;
  content:any;
  adInterval: number;

  ngOnInit(): void {
    this.logged.verifyToken()
    this.scroll.setAllComponentScollToDefault();
    this.adInterval = 60000;
    
  }

  ngAfterViewInit(): void {
    this.content = this.contentEl.nativeElement
    this.renderer.listen(this.content, 'mouseenter' ,()=>{
      this.fullScreenOnMobile()
    })

    setTimeout(() => {
      this.adService.setAd(true)
      this.isAdActive = true
     
    }, 3000);

    setInterval(() => {
      this.isAdActive = false
      this.adService.setAd(false)
      // this.ads.displayAd()
      setTimeout(() => {
        this.adService.setAd(true)
        this.isAdActive = true
      },30000)
    },  this.adInterval)
   

    // this.autoDisplayAd()
  }



  fullScreenOnMobile(){
    if (document.fullscreenElement == null && window.innerWidth <= 768) {
      this.content.requestFullscreen()
      // console.log(this.content)
    }
  }

  closeAd(){
    this.isAdActive = false
    this.adService.setAd(false)
    this.adInterval = 0;
    // this.ads.displayAd()
    setTimeout(() => {
      this.adService.setAd(true)
      this.isAdActive = true
      this.adInterval = 60000;
    }, 30000);
  }

}
