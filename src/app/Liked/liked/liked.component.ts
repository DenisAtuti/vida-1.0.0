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
import { Observable, Subscription } from 'rxjs';
import { Post } from 'src/app/Models/post-model';
import { LikedService } from 'src/app/Services/Data/liked.service';
import { NotifierService } from 'src/app/Services/notifier.service';
import { SetScrolledHeightService } from 'src/app/Services/set-scrolled-height.service';
import { AutoScrollService } from 'src/app/Services/auto-scroll.service';
import { Title, Meta } from '@angular/platform-browser';
import { StateService } from 'src/app/Services/State/state.service';

@Component({
  selector: 'app-liked',
  templateUrl: './liked.component.html',
  styleUrls: ['./liked.component.css'],
})
export class LikedComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private likedService: LikedService,
    private renderer: Renderer2,
    private notifier: NotifierService,
    private scroll: SetScrolledHeightService,
    private autoScroll: AutoScrollService,
    private state: StateService,
    private title: Title,
    private meta: Meta
  ) {}

  posts: Post[] = [];
  isLastPage: boolean = false;
  isLoading: boolean = false;
  isContent: boolean = false;
  private subscription: Subscription;
  autoScrollSub: Subscription;
  @Output() componentPage: string = 'liked';
  @ViewChild('container', { static: true }) container: ElementRef;

  ngOnInit(): void {
    this.isLoading = true;
    this.likedService.loadedVideos = 0;
    this.likedService.getPostsFromServer();
    this.subscription = this.likedService
      .getPosts()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
        this.isLoading = false;
        if (posts.length === 0) this.isContent = true;
        posts.forEach((post) => {
          if (post.isLast) {
            this.isLastPage = post.isLast;
          }
        });
        console.log(posts);
      });

    this.title.setTitle(`vida videos| Watch, share and download the most liked short nude, amateur, tiktok, reddit, instagram and facebook videos`);
    this.meta.updateTag({
      name: 'description',
      content: `vida videos the world's best short social media adult videos for ${this.state.getYeah()}. Watch free short videos, 
      sex movies and premium HD short videos on the most popular porn and adult tubes, tiktok, instagram and facebook. All the top short videos like Hentai,Huge breasts,
      Anal, Ebony,Mature, Teen,Amateur,MILF,Lesbian etc, are available here`
    });

    this.likedService.canGetPostFun();
    this.likedService.isVideosLoaded();
    this.likedService.unfollowLoadedAffilliate();
    this.likedService.followLoadedAffilliate();
  }
  ngAfterViewInit(): void {
    this.scrollFun();
    this.autoScrollFun(this.container.nativeElement);
    this.renderer.listen(this.container.nativeElement, 'scroll', (e) => {
      this.determineLastPage(e);
      setTimeout(() => {
        this.scroll.setScrolledHeight(
          this.container.nativeElement,
          'liked_scrolled_height'
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
          'liked_scrolled_height'
        );
        observable.unsubscribe();
      }
    });
  }

  private autoScrollFun(container: any) {
    this.autoScrollSub = this.autoScroll
      .autoScroll()
      .subscribe((componentPage: string) => {
        if (componentPage === 'liked') {
          container.scrollBy({
            top: 100,
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
          message: 'This is the last post',
          mode: 'warning',
        });
      }
    }
  }

  ngOnDestroy(): void {
    this.likedService.unsubscribeCanGetPostFun();
    this.likedService.unsubscribeIsVideoLoadedFun();
    this.subscription.unsubscribe();
    this.autoScrollSub.unsubscribe();
    this.likedService.unsubscribeFolloUnfollow();
  }
}
