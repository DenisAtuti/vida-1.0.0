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


        this.title.setTitle('Vida videos the new age Porn viewing and watching');
        this.meta.updateTag({
          name: 'description',
          content: `vida videos the world's best porn sites of ${this.state.getYeah()}. Watch free porn videos, 
          sex movies and premium HD porn on the most popular porn tubes. All the top porn like Hentai ,Well hung,Huge breasts,
          Anal, Ebony,Mature, Teen,Amateur,MILF,Lesbian etc`,
        });
      });

    this.mainService.canGetPostFun();
    this.mainService.videosLoaded();
    this.mainService.unfollowLoadedAffilliate();
    this.mainService.followLoadedAffilliate();
  }

  ngAfterViewInit() {
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
