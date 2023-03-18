import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, Inject } from '@angular/core';

@Directive({
  selector: '[appAdsterra]'
})
export class AdsterraDirective implements AfterViewInit  {  
  
  // "https://socialize-backend.herokuapp.com/api/v1/ad/get/all"

  constructor(
    private el: ElementRef,
    @Inject(DOCUMENT) private document: Document               
  ) { }

  ngAfterViewInit(){
    const templateEl = this.el.nativeElement as HTMLElement;
    const scriptEl = this.document.createElement('script');
    const adEl = this.document.createElement('div');

    scriptEl.src = "//pl18739161.highrevenuegate.com/328c52aa897942775d14ebb6cb7a6c41/invoke.js"
    scriptEl.setAttribute("async","async")
    scriptEl.setAttribute("data-cfasync","false")
    adEl.id = "container-328c52aa897942775d14ebb6cb7a6c41"
    adEl.className = "ads-container"

    templateEl.appendChild(scriptEl)

    scriptEl.addEventListener("load", () => {
      console.log("File loaded")
      templateEl.appendChild(adEl)
    });

    scriptEl.addEventListener("error", (ev) => {
      console.log("Error on loading file", ev);
      templateEl.appendChild(this.createNativeAd())
    });


  }

  createNativeAd(){
    const nativeAdEl = document.createElement("a")
    // nativeAdEl.setAttribute("href","https://www.highrevenuegate.com/qv905grx?key=be9d6988c6876b6c623e1c8612170918");
    nativeAdEl.setAttribute("href","https://t.adtng2.com/228803/3785/0?bo=2753,2754,2755,2756&pyt=multi&po=6456");
    nativeAdEl.setAttribute("target","_blank");

    const nativeAdImage = document.createElement("img")
    nativeAdImage.setAttribute("src","https://vida-videos.com/uploads/images/vida-3.gif")
    nativeAdEl.appendChild(nativeAdImage)

    return nativeAdEl;

  }



}
