import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { Post } from 'src/app/Models/post-model';
import { CanGetPostService } from '../can-get-post.service';
import { CompletedService } from '../completed.service';
import { FollowUnfollowService } from '../follow-unfollow.service';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  constructor(
    private data: DataService,
    private completeService: CompletedService,
    private canGetPost: CanGetPostService,
    private router: Router,
    private followUnfollowService: FollowUnfollowService
  ) {}

  posts: any[] = [];
  postsLength: number;
  loadedVideos: number = 0;
  isCanGetPost: boolean = true;
  getPostCount: number = 0;
  private canGetPostSubscription: Subscription;
  private videoLoadedSubscription: Subscription;
  private unfollowLoadedAffilliateSub: Subscription;
  private followLoadedAffilliateSub: Subscription;
  private subject: Subject<any> = new Subject();

  init(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.data.getPosts().subscribe((posts: any[]) => {
        posts.forEach((item) => {
          this.posts.push(item);
        });
        this.videosLoaded();
        resolve(true);
      });
    });
  }

  reload() {
    this.router.navigate(['/']);
    // window.location.reload()
  }

  videosLoaded() {
    this.videoLoadedSubscription = this.completeService
      .videoIsLoaded()
      .subscribe((componentPage: string) => {
        if (componentPage === 'main') {
          this.loadedVideos++;
          if (
            this.loadedVideos >= this.posts.length &&
            this.isCanGetPost &&
            this.getPostCount <= 1
          ) {
            this.getPostsFromServer();
            this.getPostCount++;
          }
        }
      });
  }

  getPost(): Observable<Post[]> {
    return this.subject.asObservable();
  }

  getPostsFromServer() {
    this.data.getPosts().subscribe((posts: any) => {
      posts.forEach((post) => {
        this.posts.push(post);
      });
      this.subject.next(this.posts.slice());
    });
  }

  canGetPostFun() {
    this.canGetPostSubscription = this.canGetPost
      .canGetPost()
      .subscribe((response: any) => {
        if (response.componentPage === 'main') {
          const videoId = response.videoId;
          const index = this.posts.findIndex((post) => post.id === videoId);
          if (this.posts.length - (index + 1) >= 5) {
            this.isCanGetPost = false;
          } else if (this.loadedVideos >= this.posts.length) {
            this.isCanGetPost = true;
            this.getPostCount = 0;
            this.getPostsFromServer();
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
  }

  unsbuscribeVideoLoaded() {
    this.videoLoadedSubscription.unsubscribe();
  }
  unsubscribeFolloUnfollow() {
    this.unfollowLoadedAffilliateSub.unsubscribe();
    this.followLoadedAffilliateSub.unsubscribe();
  }
}
