import { Directive, ElementRef, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appOpenMiniMenu]'
})
export class OpenMiniMenuDirective {

  @HostBinding('class.active') isOpen = false;
  @HostListener('document:click',['$event']) toggleOpen(event: Event){
    this.isOpen = this.elementRef.nativeElement.contains(event.target) ? !this.isOpen : false;
  }

  constructor(private elementRef: ElementRef) { }

}
