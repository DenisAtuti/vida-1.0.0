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
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
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


        this.title.setTitle('watch, share and download short nude, amateur, tiktok, reddit, instagram and facebook videos');
        this.meta.updateTag({
          name: 'description',
          content: `vida videos the world's best short social media adult videos for ${this.state.getYeah()}. Watch free short videos, 
          sex movies and premium HD short videos on the most popular porn and adult tubes, tiktok, instagram and facebook. All the top short videos like Hentai,Huge breasts,
          Anal, Ebony,Mature, Teen,Amateur,MILF,Lesbian etc , are available here`,
        });
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
