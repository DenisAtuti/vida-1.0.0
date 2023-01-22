import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { Post } from 'src/app/Models/post-model';
import { CanGetPostService } from '../can-get-post.service';
import { CompletedService } from '../completed.service';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class SubredditService {

  constructor(
    private data: DataService,
    private completedService: CompletedService,
    private canGetPost: CanGetPostService
  ) { }

  posts: Post[] = []
  subreddit: string
  page: number = 0
  isLastPage:boolean = false
  loadedVideos = 0
  getPostCount = 0
  isCanGetPost: boolean = true;
  canGetPostSubscription: Subscription
  completeSubscription: Subscription
  private subject = new Subject<Post[]>()

  getPosts():Observable<Post[]>{
    return this.subject.asObservable()
  }

  determineSubredditChange(subreddit:string){
    if(this.subreddit === null){
      this.subreddit = subreddit
    }else if(this.subreddit !== null && this.subreddit !== subreddit){
      this.subreddit = subreddit;
      this.posts.length = 0;
      this.page = 0
      localStorage.setItem('subreddit_scrolled_height', '0')
    }
  }

  isVideosLoaded(){
    this.completeSubscription = this.completedService.videoIsLoaded().subscribe(
      (response) =>{
        if(response === 'subreddit'){
          this.loadedVideos++
          if(
            this.loadedVideos >= this.posts.length && 
            this.getPostCount <= 1 && 
            this.isCanGetPost &&
            this.isLastPage === false
          ){
            this.getPostFromServer()
            this.getPostCount++
          }
        }
      }
    )
  }

  getPostFromServer() {
    this.data
      .getSubredditPost(this.subreddit, this.page)
      .subscribe((posts: any) => {
        posts.forEach((post) => {
          this.posts.push(post);
          this.isLastPage = post.isLast;
        });
        this.page++;
        this.subject.next(this.posts.slice());
      });
  }

  canGetPostFun(){
    this.canGetPostSubscription = this.canGetPost.canGetPost().subscribe((response: any) => {
      if (response.componentPage === 'subreddit') {
        const videoId = response.videoId;
        const index = this.posts.findIndex((post) => post.id === videoId);
        if (this.posts.length - (index + 1) >= 5) {
          this.isCanGetPost = false;
        } else if(this.isLastPage === false && this.loadedVideos >= this.posts.length){
          this.isCanGetPost = true;
          this.getPostCount = 0;
          this.getPostFromServer();
          
        }else{
          this.isCanGetPost = false;
        }
      }
    });
  }

  unsubscribeCanGetPostFun(){
    this.canGetPostSubscription.unsubscribe()
  }

  unsubscribeIsVideosLoaded(){
    this.canGetPostSubscription.unsubscribe()
  }
}
