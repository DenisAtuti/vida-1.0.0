import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';
import { AutoScrollService } from 'src/app/Services/auto-scroll.service';
import { MainService } from 'src/app/Services/Data/main.service';
import { NotifierService } from 'src/app/Services/notifier.service';
import { SetScrolledHeightService } from 'src/app/Services/set-scrolled-height.service';
import { StateService } from 'src/app/Services/State/state.service';

@Component({
  selector: 'app-main',
  template:`
    <div class="content-container">
      <div class="no-content-wrapper">
          <div class="no-content" *ngIf="isContent">
              <h2>There are no video posts to display, click the button below</h2>
              <button routerLink="/">Home</button>
          </div>
          <div class="post-loader" *ngIf="isLoading"></div>  
      </div>
      <div class="post-container" #container>
          <div class="post" *ngFor="let post of posts">
              <app-post [post] = "post" [componentPage]="componentPage"></app-post>
          </div>  
      </div>
      
  </div> 
  `,
})
export class MainComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(
    private mainService: MainService,
    private renderer: Renderer2,
    private scroll: SetScrolledHeightService,
    private element: ElementRef,
    private notifier: NotifierService,
    private autoScroll: AutoScrollService,
    private state: StateService,
    private title: Title,
    private meta: Meta
  ) {}

  posts: any[];
  subscription: Subscription;
  autoScrollSub: Subscription;
  isAdActive: boolean = false;
  isLastPage: boolean = false;
  isLoading: boolean = false;
  isContent: boolean = false;
  @Output() componentPage: string = 'main';
  @ViewChild('container', { static: true }) container: ElementRef;

  ngOnInit(): void {
    this.isLoading = true;
    this.mainService.loadedVideos = 0; //this is to ensure on init submissino of complete always inicciated
    this.mainService.getPostsFromServer();
    this.subscription = this.mainService
      .getPost()
      .subscribe((response: any[]) => {
        this.isLoading = false;
        if (response.length === 0) this.isContent = true;
        this.posts = response;

        const seoTitle = "watch, share and download short nude, porn, amateur, tiktok, reddit, instagram and facebook videos"
        const seoDescription = `vida videos the world's best short social media adult videos for ${this.state.getYeah()}. Watch free short videos, 
        sex movies and premium HD short videos on the most popular porn and adult tubes, tiktok, instagram and facebook. All the top short videos like Hentai,Huge breasts,
        Anal, Ebony,Mature, Teen,Amateur,MILF,Lesbian etc , are available here`
        const seoImage = "https://vida-videos.com/uploads/images/vida-1.gif"
        const seoUrl = "/"

        this.title.setTitle(seoTitle);
        this.meta.updateTag({ name: 'description', content: seoDescription })

         // Facebook Meta Tags 
        this.meta.updateTag({ property: "og:url", content: seoUrl })
        this.meta.updateTag({ name: "og:type", content:"website" })
        this.meta.updateTag({ property:"og:title",content:seoTitle })
        this.meta.updateTag({ property: "og:description", content: seoDescription })
        this.meta.updateTag({ property: "og:image", content: seoImage })

        // Twitter Meta Tags
        this.meta.updateTag({ property: "twitter:card", content:"summary_large_image" })
        this.meta.updateTag({ property: "twitter:domain", content: "vida-videos.com" })
        this.meta.updateTag({ property: "twitter:url", content: seoUrl })
        this.meta.updateTag({ property: "twitter:title", content:seoTitle })
        this.meta.updateTag({ property: "twitter:description", content: seoDescription })
        this.meta.updateTag({ property: "twitter:image", content: seoImage })
      });

    this.mainService.canGetPostFun();
    this.mainService.videosLoaded();
    this.mainService.unfollowLoadedAffilliate();
    this.mainService.followLoadedAffilliate();
  }
  
  ngAfterViewInit() {
    setTimeout(() => {
      this.isAdActive = true
    }, 5000);

    this.scrollFun();
    this.autoScrollFun(this.container.nativeElement);
    // this.scroll.getScrolledHeight(this.container.nativeElement, "main_scrolled_height")
    this.renderer.listen(this.container.nativeElement, 'scroll', (e) => {
      this.determineLastPage(e);
      setTimeout(() => {
        this.scroll.setScrolledHeight(
          this.container.nativeElement,
          'main_scrolled_height'
        );
      }, 1000);
    });
  }

  scrollFun() {
    const observable = new Observable((subscribe) => {
      setInterval(() => {
        subscribe.next(this.posts.length);
      }, 100);
    }).subscribe((response) => {
      if (response >= 1) {
        this.scroll.getScrolledHeight(
          this.container.nativeElement,
          'main_scrolled_height'
        );
        observable.unsubscribe();
      }
    });
  }

  private autoScrollFun(container: any) {
    this.autoScrollSub = this.autoScroll
      .autoScroll()
      .subscribe((componentPage: string) => {
        if (componentPage === 'main') {
          container.scrollBy({
            top: 1,
            behavior: 'smooth',
          });
        }
      });
  }

  determineLastPage(event) {
    const container = event.target;
    if (
      container.scrollTop >=
      container.scrollHeight - container.offsetHeight
    ) {
      if (!this.isLastPage) {
        this.notifier.showNotification({
          header: 'Warning',
          message: 'Videos are still loading',
          mode: 'warning',
        });
      }

      if (this.isLastPage) {
        this.notifier.showNotification({
          header: 'Warning',
          message: 'Last page',
          mode: 'warning',
        });
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.autoScrollSub.unsubscribe();
    this.mainService.loadedVideos = 0;
    this.mainService.unsubscribeCanGetPostFun();
    this.mainService.unsbuscribeVideoLoaded();
    this.mainService.unsubscribeFolloUnfollow();
  }
}
