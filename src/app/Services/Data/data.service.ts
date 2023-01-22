import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map , catchError , Observable, throwError } from 'rxjs';
import { Post } from 'src/app/Models/post-model';
import { NotifierService } from '../notifier.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private baseUrl = 'https://socialize-backend.herokuapp.com';

  constructor(
    private http: HttpClient, 
    private notifier: NotifierService,
  ) { }

  
  getAllModelNames():Observable<string[]>{
    return this.http.get<any>(`${this.baseUrl}/api/v1/affiliate/get/all/affiliate/names`)
  }

  getPosts():Observable<Post[]>{
    const user = localStorage.getItem('user');
    return this.http.get<any>(`${this.baseUrl}/api/v1/videos/page?username${user}`).pipe(
      map(response => {
        const posts: Post [] = []

        const isLast = response.last;

        response.content.map(item =>{
          const post = this.createPostObj(item, isLast)
          posts.push(post)
        })

        return posts;
      })

    )
  
  }

  // AFFILIATE SECTION

  getAffiliatePost(name: string, page:number){
    let url = "";
    const user = localStorage.getItem('user');
    if(user !== null) url = `&username=${user}`
    return this.http.get<any>(`${this.baseUrl}/api/v1/videos/get/affiliate/videos/${name}?page=${page}${url}`).pipe(
      map(response => {
        const posts: Post [] = []

        const isLast = response.last;

        response.content.map(item =>{  
          const post = this.createPostObj(item, isLast)
          posts.push(post)
        })

        return posts;
      }),
      catchError(error => this.catchedError(error))
    )
  }

  // SECTION SUBREDDIT
  getSubredditPost(subreddit: string, page:number){
    let token = localStorage.getItem('token');
    if(token === null) token = '';
    const httpOpts = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "*/*",
      }).set('Authorization', token),
      observe: "response" as 'body'
    }
    return this.http.get<any>(`${this.baseUrl}/api/v1/videos/get/subreddit/${subreddit}?page=${page}`, httpOpts).pipe(
      map(response => {
        const posts: Post [] = []

        const isLast = response.body.last;

        response.body.content.map(item =>{  
          const post = this.createPostObj(item, isLast)
          posts.push(post)
        })

        return posts;
      }),
      catchError(error => this.catchedError(error))
    )
  }

  // LIKED SECTION
  getLikedPost(page:number){
    const token = localStorage.getItem('token');
    const httpOpts = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "*/*",
      }).set('Authorization', token),
      observe: "response" as 'body'
    }
    return this.http.get<any>(`${this.baseUrl}/api/v1/videos/get/all/liked/videos?page=${page}`, httpOpts).pipe(
      map(response => {
        const posts: Post [] = []

        const isLast = response.body.last;

        response.body.content.map(item =>{  
          const post = this.createPostObj(item.video, isLast)
          posts.push(post)
        })

        return posts;
      }),
      catchError(error => this.catchedError(error))
    )
  }

  // FOLLOWING SECTION
  getFollowingPost(page:number){
    const token = localStorage.getItem('token');
    const httpOpts = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "*/*",
      }).set('Authorization', token),
      observe: "response" as 'body'
    }
    return this.http.get<any>(`${this.baseUrl}/api/v1/videos/get/following?page=${page}`, httpOpts).pipe(
      map(response => {
        const posts: Post [] = []

        console.log(response.body.content)

        const isLast = response.body.last;

        response.body.content.map(item =>{  
          const post = this.createPostObj(item, isLast)
          posts.push(post)
        })

        return posts;
      }),
      catchError(error => this.catchedError(error))
    )
  }

  // VERIFIED AFFILIATES
  getVerfiedAffiliates(){
    return this.http.get<any>(`${this.baseUrl}/api/v1/affiliate/get/verified/affiliates`).pipe(
      map(response => {
        return response;
      }),
      catchError(error => this.catchedError(error))
    )
  }

  // ADD POST VIEW COUNT
  addPostViewCount(videoId){
    const httpOpts = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "*/*",
      }),
      observe: "response" as 'body'
    }
    this.http.post<any>(`${this.baseUrl}/api/v1/videos/add/view/${videoId}`, null, httpOpts).pipe(
      map(response => {
        return response;
      }),
      catchError(error => this.catchedError(error))
    ).subscribe()
  }

  // POST SECTION
  increamentLike(videoId: number){
    const token = localStorage.getItem('token');
    const httpOpts = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "*/*",
      }).set('Authorization', token),
      observe: "response" as 'body'
    }
    this.http.post<any>(`${this.baseUrl}/add/like?videoId=${videoId}`, null, httpOpts).pipe(
      map(response => {
        return response;
      }),
      catchError(error => this.catchedError(error))
    ).subscribe()
  }

  decreamentLike(videoId: number){
    const token = localStorage.getItem('token');
    const httpOpts = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "*/*",
      }).set('Authorization', token),
      observe: "response" as 'body'
    }

    this.http.post<any>(`${this.baseUrl}/api/v1/videos/remove/like?videoId=${videoId}`, null, httpOpts).pipe(
      map(response => {
        return response;
      }),
    ).subscribe()
  }

  addfollower(model: string){
    const token = localStorage.getItem('token');
    const httpOpts = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "*/*",
      }).set('Authorization', token),
      observe: "response" as 'body'
    }

    this.http.post<any>(`${this.baseUrl}/api/v1/user/follow?affiliateName=${model}`, null, httpOpts).pipe(
      map(response => {
        console.log(response)
        return response;
      }),
    ).subscribe()

  }

  removefollower(model: string){
    const token = localStorage.getItem('token');
    const httpOpts = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "*/*",
      }).set('Authorization', token),
      observe: "response" as 'body'
    }

    this.http.post<any>(`${this.baseUrl}/api/v1/user/unfollow?affiliateName=${model}`, null, httpOpts).pipe(
      map(response => {
        console.log(response)
        return response;
      }),
    ).subscribe()

  }

  // SHARED POST SECTION
  getsharedPost(videoId):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/api/v1/videos/get/by/id/${videoId}`)
    .pipe(
      (response: any) =>{
        return  response
      },
      // catchError(error => this.catchedError(error))
    )
  }


  // comment section
  getComments(videoId: number):Observable<any>{
    return this.http.get<number>(`${this.baseUrl}/api/v1/posts/get/all/posts?videoId=${videoId}`)
      .pipe(
        catchError(error => this.catchedError(error))
      )
  }

  addComment(comment: any): Observable<any>{
    const token = localStorage.getItem('token');
    const httpOpts = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "*/*",
      }).set('Authorization', token),
      observe: "response" as 'body'
    }
    return this.http.post<any>(`${this.baseUrl}/api/v1/posts/post`, comment , httpOpts).pipe(
      (response: any) =>{
        this.successNotifier("success","You've successfully commented","success")
        return response
      }
    )
  }


  // REPLY SECTION
  getReplies(commentId):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/api/v1/comments/get/post/comments/${commentId}`)
          .pipe(
            catchError(error => this.catchedError(error))
          )
  }

  addResplies(reply: any):Observable<any>{
    const token = localStorage.getItem('token');
    const httpOpts = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "*/*",
      }).set('Authorization', token),
      observe: "response" as 'body'
    }

    return this.http.post<any>(`${this.baseUrl}/api/v1/comments/comment`, reply , httpOpts)
            .pipe(
              (response: any)=>{
                this.successNotifier("success","You've successfully replied","success")
                return response
              },
              catchError(error => this.catchedError(error))
            )

  }

  verfyToken(token: string):Observable<boolean>{
    const httpOpts = {
      headers: new HttpHeaders({
        Authorization: token
      })
    }
    return this.http.get<boolean>(`${this.baseUrl}/api/v1/videos/token/validity`,httpOpts)
  }

  
  

  login(value: any):Observable<any>{
    const httpOpts = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: "Jwt-token",
      }),
      observe: "response" as 'body'
    }
    return this.http.post<any>(`${this.baseUrl}/api/v1/user/join`, value , httpOpts)
  }

  private successNotifier(header: string, message: string, mode: string){
    this.notifier.showNotification({
      header: header,
      message: message,
      mode: mode
    })
  }

  private createPostObj(item:any, isLast:boolean){
    // item.videoLocationUrl = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
    return new Post(
      item.id, 
      item.videoId ,
      item.title,
      item.subreddit,
      item.affiliateName,
      item.isFollowing,
      item.isVerified,
      item.videoLocationUrl,
      this.createAudioUrl(item.videoLocationUrl),
      item.isLiked,
      item.viewsCount,
      item.userLikes.length,
      item.commentCount,
      item.sharedCount,
      isLast,                                                                                          
      item.ad
    )
  }

  private createAudioUrl(url):string{
    return url.slice(0, 32) + 'DASH_audio.mp4' 
  }


  private catchedError(error): Observable<Response>{
    this.notifier.showNotification({
      header: error.error.reason,
      message: error.error.message,
      mode: "error"
    })
    return throwError(error)
  }

}
