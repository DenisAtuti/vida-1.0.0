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
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';
import { Post } from 'src/app/Models/post-model';
import { AffiliateService } from 'src/app/Services/Data/affiliate.service';
import { NotifierService } from 'src/app/Services/notifier.service';
import { SetScrolledHeightService } from 'src/app/Services/set-scrolled-height.service';
import { AutoScrollService } from 'src/app/Services/auto-scroll.service';
import { Title, Meta } from '@angular/platform-browser';
import { StateService } from 'src/app/Services/State/state.service';

@Component({
  selector: 'app-affiliate',
  templateUrl: './affiliate.component.html',
  styleUrls: ['./affiliate.component.css'],
})
export class AffiliateComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private afiliateService: AffiliateService,
    private scroll: SetScrolledHeightService,
    private renderer: Renderer2,
    private notifier: NotifierService,
    private element: ElementRef,
    private state: StateService,
    private title: Title,
    private meta: Meta,
    private autoScroll: AutoScrollService
  ) {}

  posts: Post[] = [];
  affiliate: string;
  private subscription: Subscription;
  private paramSubscription: Subscription;
  autoScrollSub: Subscription;
  isLastPage: boolean = false;
  isLoading: boolean;
  isContent: boolean;
  @Output() componentPage: string = 'affiliate';
  @ViewChild('container', { static: true }) container: ElementRef;

  ngOnInit(): void {
    this.isLoading = true;
    this.afiliateService.loadedVideos = 0;
    this.paramSubscription = this.route.params.subscribe((params: Params) => {
      this.affiliate = this.route.snapshot.paramMap.get('name');
      this.afiliateService.determineAffiliateChange(this.affiliate);
    });

    this.subscription = this.afiliateService
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
      });
    this.title.setTitle(
      `vida videos| watch, share and download ${this.affiliate} short nude, amateur, tiktok, reddit, instagram and facebook videos`
    );
    this.meta.updateTag({
      name: 'description',
      content: `vida videos' ${this.affiliate} is world's best short social media adult videos creator for ${this.state.getYeah()}. Watch free  ${this.affiliate} short videos, 
      sex movies and premium HD short videos on the most popular porn and adult tubes, tiktok, instagram and facebook. All the top short videos like Hentai,Huge breasts,
      Anal, Ebony,Mature, Teen,Amateur,MILF,Lesbian etc, are available here`,
    });

    this.afiliateService.canGetPostFun();
    this.afiliateService.unfollowLoadedAffilliate();
    this.afiliateService.followLoadedAffilliate();
  }

  ngAfterViewInit() {
    this.scrollFun();
    this.autoScrollFun(this.container.nativeElement);
    this.renderer.listen(this.container.nativeElement, 'scroll', (e) => {
      this.determineLastPage(e);
      setTimeout(() => {
        this.scroll.setScrolledHeight(
          this.container.nativeElement,
          'affiliate_scrolled_height'
        );
      }, 1000);
    });
  }

  private autoScrollFun(container: any) {
    this.autoScrollSub = this.autoScroll
      .autoScroll()
      .subscribe((componentPage: string) => {
        if (componentPage === 'affiliate') {
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
        console.log('post length is ' + response);
        this.scroll.getScrolledHeight(
          this.container.nativeElement,
          'affiliate_scrolled_height'
        );
        observable.unsubscribe();
      }
    });
  }

  ngOnDestroy(): void {
    this.afiliateService.unsubscribeCanGetPostFun();
    this.subscription.unsubscribe();
    this.paramSubscription.unsubscribe();
    this.autoScrollSub.unsubscribe();
  }
}
