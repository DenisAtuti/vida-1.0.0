import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from 'src/app/Models/post-model';
import { DataService } from 'src/app/Services/Data/data.service';
import { IsLoggedService } from 'src/app/Services/is-logged.service';
import { NotifierService } from 'src/app/Services/notifier.service';
import { OpenCommentModelService } from 'src/app/Services/open-comment-model.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit, AfterViewInit {

  isActive: boolean = false
  isAutoPlay: boolean = false
  isNavigator: boolean = true;
  isLogged: boolean
  isLoading: boolean

  observer:any

  @ViewChild("player", {static: false}) playerEl: ElementRef;
  @Input() post: any;
  @Input() componentPage:string
  
  @Output() playVideoEvent = new Subject<any>();
  @Output() navigatorSubj = new Subject<boolean>()
  @Output() videoId: number;
  @Output() affiliateName: string;
  @Output() videoUrl: string;
 

  constructor(
    private openCommentModelService: OpenCommentModelService,
    private notiferService: NotifierService,
    private logged: IsLoggedService,
    private http: HttpClient,
    private data: DataService
  ) { }
  
  ngOnInit(): void {
    this.logged.isLoggedIn().subscribe(
      (log: boolean) =>{
        this.isLogged = log
      }
    )

    this.isLogged = this.logged.isLogged
    this.videoId = this.post.id;
    this.affiliateName = this.post.affiliateName; 
    // console.log(this.post)
    // this.videoUrl = this.post.videoLocationUrl
    
  }
  
  ngAfterViewInit(): void { 
      
    this.intersectionObserver()
    this.observer.observe(this.playerEl.nativeElement as HTMLElement)
    
  }

  toggleOpenNavigator(){
    this.isNavigator = !this.isNavigator
    this.navigatorSubj.next(true)
  }

  intersectionObserver(){
    let options = {
      root: null,
      rootMargin: '0px',
      threshold: 1
    }
    
    this.observer = new IntersectionObserver((entries)=>{

      const entry  = entries[0]

      if(entry.isIntersecting){

        this.playVideoEvent.next(true)
        this.post.viewsCount++
        this.data.addPostViewCount(this.videoId)

        setTimeout(() => {
          this.isActive = true
        }, 1000);

      }else{
        this.playVideoEvent.next(false)

        this.isActive = false;
        this.isNavigator = true;
      }
    }, options);

  }
  onlikeCliked(liked: boolean){
    if(!this.isLogged){
      this.notiferService.showNotification({
        header:"Warning",
        message: "Please login to like this post",
        mode: "warning"
      })
    }else{
      if(!liked){
        this.post.likesCount++
        this.post.isLiked = true;
        this.incrementLike()
      }else{
        this.post.likesCount--
        this.post.isLiked = false;
        this.decrementLike()
      }
      // return
    }
    
  }
  openCommentModel(videoId: number){
    this.openCommentModelService.sendVideoId(videoId)
  }

  shareBtnClicked(videoId){
    const myUrl = new URL(window.location.href)
    navigator.clipboard.writeText(`${myUrl.host}/shared/post/${videoId}`);
    this.showNotifier("Success", "You have copied video link", "success")
  }

  downloadBtnClicked(url: string, model:string, videoId:number){
    const filename = model + "_" + videoId
    this.download(url, filename)
  }

  onFollowBtnClicked(affiliateName: string){
    if(!this.isLogged){
      this.showNotifier(
        "Warning", 
        `Please login to follow ${affiliateName}`, 
        "warning"
      )
    }else{
      this.isLoading = true
      this.data.addfollower(affiliateName)
      setTimeout(()=>{
        this.isLoading = false
        this.post.isFollowing = true;
      },2000)
    }
  }
  onUnfollowBtnClicked(affiliateName: string){
    if(!this.isLogged){
      this.showNotifier(
        "Warning", 
        `Please login to follow ${affiliateName}`, 
        "warning"
      )
    }else{
      this.isLoading = true
      this.data.removefollower(affiliateName)
      setTimeout(()=>{
        this.isLoading = false
        this.post.isFollowing = false;
      },2000)
    }
  }

  openAd(link: string){
    window.open(link, '_blank');
  }

  closeAd(){
    this.isActive = false;
  }

  private incrementLike(){
    this.data.increamentLike(this.post.id)
  }
  private decrementLike(){
    this.data.decreamentLike(this.post.id)
  }

  private showNotifier(header: string, message:string, mode:string){
    this.notiferService.showNotification({
        header: header,
        message: message,
        mode: mode
      })
  }

  private download(url:string, filename:string){
    this.http.get(url,{responseType: 'blob'})
      .subscribe(
        (blob) =>{
        const link = document.createElement('a')
        const objUrl = URL.createObjectURL(blob)
        link.href = objUrl;
        link.download = filename + ".mp4"
        link.click()
        URL.revokeObjectURL(objUrl)
        this.showNotifier("Success", "Video download has started", "success")
      })
  }

}
