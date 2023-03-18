import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
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
    private scroll: SetScrolledHeightService
    ){}
  
  
  title = 'vida';
  isAdActive: boolean = false;
  @ViewChild("content", {static: false}) contentEl: ElementRef;
  content:any;

  ngOnInit(): void {
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

}
