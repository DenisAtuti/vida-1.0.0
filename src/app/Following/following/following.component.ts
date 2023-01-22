import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';
import { Post } from 'src/app/Models/post-model';
import { FollowingService } from 'src/app/Services/Data/following.service';
import { NotifierService } from 'src/app/Services/notifier.service';
import { SetScrolledHeightService } from 'src/app/Services/set-scrolled-height.service';
import { AutoScrollService } from 'src/app/Services/auto-scroll.service';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css']
})
export class FollowingComponent implements OnInit, AfterViewInit,  OnDestroy {

  constructor(
    private followingService: FollowingService,
    private renderer: Renderer2,
    private notifier: NotifierService,
    private scroll: SetScrolledHeightService,
    private autoScroll: AutoScrollService
  ) { }

  posts: Post[] = []
  isLastPage: boolean = false;
  isLoading :boolean = false
  isContent: boolean  = false
  private subscription: Subscription;
  autoScrollSub: Subscription
  @Output() componentPage:string = "following"
  @ViewChild("container", {static: true}) container: ElementRef ;

  ngOnInit(): void {
    this.followingService.loadedVideos = 0
    this.isLoading = true
    this.followingService.getPostsFromServer()
    this.subscription = this.followingService.getPosts().subscribe(
      (posts: Post[]) =>{
        this.posts = posts
        this.isLoading = false
        if(posts.length === 0) this.isContent = true
      }
    )

    this.followingService.canGetPostFun()
    this.followingService.isVideosLoaded()
  }

  ngAfterViewInit(): void {
    this.scrollFun()
    this.autoScrollFun(this.container.nativeElement)
    this.renderer.listen(this.container.nativeElement, 'scroll' , (e) =>{
      this.determineLastPage(e)
      setTimeout(() => {  
        this.scroll.setScrolledHeight(this.container.nativeElement, "following_scrolled_height")
      }, 1000);
    })

  }

  scrollFun(){ 
    const observable = new Observable(subscribe =>{
      setInterval(()=>{
        subscribe.next(this.posts.length)
      },100)
    })
    .subscribe(response =>{
      if(response >= 1){
        this.scroll.getScrolledHeight(this.container.nativeElement, "following_scrolled_height") 
        observable.unsubscribe()
      }
    })
  }

  private autoScrollFun(container: any){
    this.autoScrollSub = this.autoScroll.autoScroll().subscribe(
      (componentPage: string) =>{
        if(componentPage === "following"){
          container.scrollBy({
            top:100,
            behavior:'smooth'
          })
        }
      }
    )
  }

  determineLastPage(event){
    const container = event.target;
    if( container.scrollTop >= (container.scrollHeight - container.offsetHeight)){
      if (!this.isLastPage) {
        this.notifier.showNotification({
          header: "Warning",
          message:"Videos are still loading",
          mode:"warning"
        })
      } 

      if (this.isLastPage) {
        this.notifier.showNotification({
          header: "Warning",
          message:"This is the last post",
          mode:"warning"
        })
      }
    }
  }
 

  ngOnDestroy(): void {
    this.followingService.unsubscribeCanGetPostFun()
    this.followingService.unsubscribeIsVideoLoadedFun()
    this.subscription.unsubscribe()
    this.autoScrollSub.unsubscribe()
  }

}
