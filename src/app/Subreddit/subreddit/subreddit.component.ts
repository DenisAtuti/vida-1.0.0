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
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';
import { Post } from 'src/app/Models/post-model';
import { SubredditService } from 'src/app/Services/Data/subreddit.service';
import { NotifierService } from 'src/app/Services/notifier.service';
import { SetScrolledHeightService } from 'src/app/Services/set-scrolled-height.service';
import { AutoScrollService } from 'src/app/Services/auto-scroll.service';
import { Title, Meta } from '@angular/platform-browser';
import { StateService } from 'src/app/Services/State/state.service';

@Component({
  selector: 'app-subreddit',
  template: `
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
          <app-post [post]="post" [componentPage]="componentPage"></app-post>
        </div>
      </div>
    </div>
  `,
})
export class SubredditComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private subredditService: SubredditService,
    private scroll: SetScrolledHeightService,
    private renderer: Renderer2,
    private notifier: NotifierService,
    private autoScroll: AutoScrollService,
    private state: StateService,
    private title: Title,
    private meta: Meta
  ) {}

  posts: Post[] = [];
  subscription: Subscription;
  autoScrollSub: Subscription;
  isLastPage: boolean = false;
  isLoading: boolean = false;
  isContent: boolean = false;
  @Output() componentPage: string = 'subreddit';
  @ViewChild('container', { static: true }) container: ElementRef;

  ngOnInit(): void {
    this.isLoading = true;
    const subreddit = this.route.snapshot.paramMap.get('name');
    this.subredditService.determineSubredditChange(subreddit);
    this.subredditService.getPostFromServer();
    this.subredditService.isVideosLoaded();
    this.subscription = this.subredditService
      .getPosts()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
        if (posts.length === 0) this.isContent = true;
        posts.forEach((post) => {
          if (post.isLast) {
            this.isLastPage = post.isLast;
          }
        });
      });

    const seoTitle = `vida videos| Watch, share and download ${subreddit} subreddit short nude, amateur, tiktok, reddit, instagram and facebook videos`;
    const seoDescription = `vida videos ${subreddit} subreddit has best short NSFW social media adult videos for ${this.state.getYeah()}. Watch free short videos, 
      sex movies and premium HD short videos on the most popular porn and adult tubes, tiktok, instagram and facebook. All the top short videos like Hentai,Huge breasts,
      Anal, Ebony,Mature, Teen,Amateur,MILF,Lesbian etc, are available here`;
    const seoImage = 'https://vida-videos.com/uploads/images/vida-1.gif';
    const seoUrl = `subreddit/account/${subreddit}`;

    this.title.setTitle(seoTitle);
    this.meta.addTags([
      { name: 'description', content: seoDescription },
      // Facebook Meta Tags
      { name: 'og:url', content: seoUrl },
      { name: 'og:type', content: 'website' },
      { name: 'og:title', content: seoTitle },
      { name: 'og:description', content: seoDescription },
      { name: 'og:image', content: seoImage },

      // Twitter Meta Tags
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:domain', content: 'vida-videos.com' },
      { name: 'twitter:url', content: seoUrl },
      { name: 'twitter:title', content: seoTitle },
      { name: 'twitter:description', content: seoDescription },
      { name: 'twitter:image', content: seoImage },
    ]);

    this.subredditService.canGetPostFun();
    this.subredditService.unfollowLoadedAffilliate();
    this.subredditService.followLoadedAffilliate();
  }

  ngAfterViewInit() {
    this.scrollFun();
    this.autoScrollFun(this.container.nativeElement);
    this.renderer.listen(this.container.nativeElement, 'scroll', (e) => {
      this.determineLastPage(e);
      setTimeout(() => {
        this.scroll.setScrolledHeight(
          this.container.nativeElement,
          'subreddit_scrolled_height'
        );
      }, 1000);
    });
  }

  private autoScrollFun(container: any) {
    this.autoScrollSub = this.autoScroll
      .autoScroll()
      .subscribe((componentPage: string) => {
        if (componentPage === 'subreddit') {
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

  scrollFun() {
    const observable = new Observable((subscribe) => {
      setInterval(() => {
        subscribe.next(this.posts.length);
      }, 100);
    }).subscribe((response) => {
      if (response >= 1) {
        this.scroll.getScrolledHeight(
          this.container.nativeElement,
          'subreddit_scrolled_height'
        );
        observable.unsubscribe();
      }
    });
  }

  ngOnDestroy(): void {
    this.subredditService.unsubscribeCanGetPostFun();
    this.subredditService.unsubscribeIsVideosLoaded();
    this.subscription.unsubscribe();
    this.autoScrollSub.unsubscribe();
    this.subredditService.unsubscribeFolloUnfollow();
  }
}
