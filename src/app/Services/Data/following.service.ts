import { Injectable } from '@angular/core';
import { Subject, Observable, Subscription } from 'rxjs';
import { Post } from 'src/app/Models/post-model';
import { CanGetPostService } from '../can-get-post.service';
import { CompletedService } from '../completed.service';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class FollowingService {

  constructor(
    private data: DataService,
    private completeService: CompletedService,
    private canGetPost: CanGetPostService
  ) { }

  posts: Post [] = []
  page: number = 0
  loadedVideos: number = 0;
  isCanGetPost: boolean = true;
  isLastPage: boolean = false;
  getPostCount: number = 0;
  private subject = new Subject<Post[]>()
  private completeSubscription: Subscription
  private canGetPostSubscription: Subscription

  getPosts():Observable<Post[]>{
    return this.subject.asObservable()
  }

  getPostsFromServer(){
    this.data.getFollowingPost(this.page).subscribe(
      (posts: Post[]) =>{
        posts.forEach(post =>{
          this.posts.push(post)
          this.isLastPage = post.isLast;
          
        })
        this.subject.next(this.posts.slice())
        this.page++;
      }
    )
  }

  isVideosLoaded() {
    this.completeSubscription = this.completeService.videoIsLoaded().subscribe((componentPage: string) => {
      if (componentPage === 'following') {
        this.loadedVideos++;
        if (
          this.loadedVideos >= this.posts.length &&
          this.isCanGetPost &&
          this.getPostCount <= 2 &&
          this.isLastPage === false
        ) {
          this.getPostsFromServer()
          this.getPostCount++;
        }
      }
    });
  }
  canGetPostFun(){
    this.canGetPostSubscription = this.canGetPost.canGetPost().subscribe((response: any) => {
      if (response.componentPage === 'following') {
        const videoId = response.videoId;
        const index = this.posts.findIndex((post) => post.id === videoId);
        if (this.posts.length - (index + 1) >= 5) {
          this.isCanGetPost = false;
        } else if(!this.isLastPage && this.loadedVideos >= this.posts.length){
          this.isCanGetPost = true;
          this.getPostCount = 0;
          this.getPostsFromServer();
          
        }
      }
    });
  }

  unsubscribeCanGetPostFun(){
    this.canGetPostSubscription.unsubscribe()
  }

  unsubscribeIsVideoLoadedFun(){
    this.completeSubscription.unsubscribe()
  }

}
