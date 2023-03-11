import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, Inject } from '@angular/core';

@Directive({
  selector: '[appAdsterra]'
})
export class AdsterraDirective implements AfterViewInit  {               

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

    templateEl.appendChild(scriptEl)
    templateEl.appendChild(adEl)

  }

}
