import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, Inject, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appAdsterra]'
})
export class AdsterraDirective implements AfterViewInit  {  
  
  // "https://socialize-backend.herokuapp.com/api/v1/ad/get/all"

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document               
  ) { }

  ngAfterViewInit(){
    const templateEl = this.el.nativeElement as HTMLElement;
    this.renderer.addClass(this.el.nativeElement, "adsterra")
    const scriptEl = this.document.createElement('script');
    const adEl = this.document.createElement('div');

    scriptEl.src = "//pl18739161.highrevenuegate.com/328c52aa897942775d14ebb6cb7a6c41/invoke.js"
    scriptEl.setAttribute("async","async")
    scriptEl.setAttribute("data-cfasync","false")
    adEl.id = "container-328c52aa897942775d14ebb6cb7a6c41"
    adEl.className = "ads-container"
    adEl.style.backgroundColor = '#000';  
    adEl.style.color = '#fff'; 

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
    nativeAdEl.setAttribute("href","https://t.adtng2.com/228803/3785/0?bo=2753,2754,2755,2756&pyt=multi&po=6456");
    nativeAdEl.setAttribute("target","_blank");
    nativeAdEl.style.inset = '0';
    nativeAdEl.style.height = '100%';
    nativeAdEl.style.display = 'flex';
    nativeAdEl.style.justifyContent = 'center';
    nativeAdEl.style.alignItems = 'center';  
    nativeAdEl.style.backgroundColor = '#000';  
    nativeAdEl.style.color = '#fff';  
    
    const nativeAdImage = document.createElement("img")
    nativeAdImage.setAttribute("src",`https://vida-videos.com/uploads/images/vida-${this.getRandomNumber()}.gif`)
    nativeAdImage.alt = "This is an add"
    nativeAdImage.style.height = '100%';
    nativeAdImage.style.width = 'auto';
    nativeAdImage.style.objectFit = 'cover';


    nativeAdEl.appendChild(nativeAdImage); 

    return nativeAdEl;

  }

  getRandomNumber(){
    return Math.floor(Math.random() * 20) + 1;
  }



}
