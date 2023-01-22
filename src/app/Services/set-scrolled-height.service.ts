import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SetScrolledHeightService {

  constructor() { }

  setScrolledHeight(component: any, name: string){
    const scrolledHeight = component.scrollTop
    localStorage.setItem(name, scrolledHeight)
  }

  getScrolledHeight(component:any, name:string){
    const scrolledHeight = localStorage.getItem(name)
    if(scrolledHeight != null) component.scrollTop = scrolledHeight
  }

  setAllComponentScollToDefault(){
    localStorage.setItem('main_scrolled_height', '0')
    localStorage.setItem('affiliate_scrolled_height', '0')
    localStorage.setItem('subreddit_scrolled_height', '0')
    localStorage.setItem('following_scrolled_height', '0')
    localStorage.setItem('liked_scrolled_height', '0')
  }
}
