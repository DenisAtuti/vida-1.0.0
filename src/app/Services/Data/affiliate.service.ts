import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { Post } from 'src/app/Models/post-model';
import { CanGetPostService } from '../can-get-post.service';
import { CompletedService } from '../completed.service';
import { FollowUnfollowService } from '../follow-unfollow.service';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class AffiliateService {
  posts: Post[] = [];
  page: number = 1;
  affiliate: string = null;
  loadedVideos: number = 0;
  getPostCount: number = 0;
  isCanGetPost: boolean = true;
  isLastPage: boolean = false;

  private subject = new Subject<Post[]>();
  private canGetPostSubscription: Subscription;
  private unfollowLoadedAffilliateSub: Subscription;
  private followLoadedAffilliateSub: Subscription;

  constructor(
    private data: DataService,
    private completeService: CompletedService,
    private canGetPost: CanGetPostService,
    private followUnfollowService: FollowUnfollowService
  ) {}

  getPosts(): Observable<Post[]> {
    return this.subject.asObservable();
  }

  getPostsFromServer() {
    this.getPost();
    this.videosLoaded();
  }

  videosLoaded() {
    this.completeService.videoIsLoaded().subscribe((componentPage: string) => {
      if (componentPage === 'affiliate') {
        this.loadedVideos++;
        if (
          this.loadedVideos >= this.posts.length &&
          this.isCanGetPost &&
          this.getPostCount <= 2 &&
          this.isLastPage === false
        ) {
          this.getPost();
          this.page++;
          this.getPostCount++;
        }
      }
    });
  }

  determineAffiliateChange(name: string) {
    if (this.affiliate === null) {
      this.affiliate = name;
      this.getPostsFromServer();
    } else if (this.affiliate != null && name != this.affiliate) {
      this.affiliate = name;
      this.posts.length = 0;
      this.page = 1;
      localStorage.setItem('affiliate_scrolled_height', '0');
      this.getPostsFromServer();
    } else {
      return;
    }
  }

  private getPost() {
    this.data
      .getAffiliatePost(this.affiliate, this.page)
      .subscribe((posts: any) => {
        posts.forEach((post) => {
          this.posts.push(post);
        });
        this.page++;
        this.subject.next(this.posts.slice());
      });
  }

  canGetPostFun() {
    this.canGetPostSubscription = this.canGetPost
      .canGetPost()
      .subscribe((response: any) => {
        if (response.componentPage === 'affiliate') {
          const videoId = response.videoId;
          const index = this.posts.findIndex((post) => post.id === videoId);
          if (this.posts.length - (index + 1) >= 5) {
            this.isCanGetPost = false;
          } else if (
            !this.isLastPage &&
            this.loadedVideos >= this.posts.length
          ) {
            this.isCanGetPost = true;
            this.getPostCount = 0;
            this.getPost();
          }
        }
      });
  }

  unfollowLoadedAffilliate() {
    this.unfollowLoadedAffilliateSub = this.followUnfollowService
      .getUnfollow()
      .subscribe((affiliate: string) => {
        this.posts.filter((post) => {
          if (post.affiliateName === affiliate) {
            post.isFollowing = false;
            this.subject.next(this.posts.slice());
          }
        });
      });
  }

  followLoadedAffilliate() {
    this.followLoadedAffilliateSub = this.followUnfollowService
      .getFollow()
      .subscribe((affiliate: string) => {
        this.posts.filter((post) => {
          if (post.affiliateName === affiliate) {
            post.isFollowing = true;
            this.subject.next(this.posts.slice());
          }
        });
      });
  }

  unsubscribeCanGetPostFun() {
    this.canGetPostSubscription.unsubscribe();
    this.followLoadedAffilliateSub.unsubscribe();
    this.unfollowLoadedAffilliateSub.unsubscribe();
  }
}
