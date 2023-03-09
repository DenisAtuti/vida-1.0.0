import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { finalize, Subject } from 'rxjs';
import { AdminTemplateRemoverService } from 'src/app/Services/admin-template-remover.service';
import { DataService } from 'src/app/Services/Data/data.service';
import { FollowUnfollowService } from 'src/app/Services/follow-unfollow.service';
import { IsLoggedService } from 'src/app/Services/is-logged.service';
import { LogActiveService } from 'src/app/Services/log-active.service';
import { NotifierService } from 'src/app/Services/notifier.service';
import { OpenCommentModelService } from 'src/app/Services/open-comment-model.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit, AfterViewInit {

  isActive: boolean = false
  isAdmin: boolean = true
  isAutoPlay: boolean = false
  isNavigator: boolean = true;
  isLogged: boolean
  isLoading: boolean
  isDownloading: boolean = false;
  downloads: number

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
    private logActiveService: LogActiveService,
    private adminTemplateService: AdminTemplateRemoverService,
    private logged: IsLoggedService,
    private followUnfollowService: FollowUnfollowService,
    private http: HttpClient,
    private data: DataService
  ) { }
  
  ngOnInit(): void {
    this.logged.isLoggedIn().subscribe(
      (log: boolean) =>{
        this.isLogged = log
      }
    )
    
    this.adminTemplateService.removeTemplate().subscribe(
      (response: boolean) => {
        this.post.isAdmin = response
        this.isAdmin = false

      }
    )

    this.isLogged = this.logged.isLogged
    this.videoId = this.post.id;
    this.affiliateName = this.post.affiliateName; 

    if(this.post.sharedCount - 67 <= 0 ){
      this.downloads = 19 
    }else{
      this.downloads = this.post.sharedCount - 67
    }
    
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
      this.logActiveService.setActive()
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
    const link = `${myUrl.host}/#/shared/post/${videoId}`
    const width = window.innerWidth
   
    if(navigator.share && width <= 768){
      navigator.share({
        text: 'WATCH 18+ free tiktoks',
        url: `/#/shared/post/${videoId}`
      }).then(()=>{
        console.log('shareing')
      }).catch((err) =>{
        console.log(err)
      })
    }else{
      navigator.clipboard.writeText(link);
      this.showNotifier("Success", "You have copied video link", "success")
    }
  }

  downloadBtnClicked(url: string, model:string, videoId:number){  
    const filename = model + "_" + videoId
    if(this.isDownloading){
      this.showNotifier(
        "Warning", 
        `Wait, still downloading previous video`, 
        "warning"
      )
    }else{
      this.isDownloading = true
      this.download(url, filename)
    }
   
  }

  onFollowBtnClicked(affiliateName: string){
    if(!this.isLogged){
      this.showNotifier(
        "Warning", 
        `Please login to follow ${affiliateName}`, 
        "warning"
      )
      this.logActiveService.setActive()
    }else{
      this.followUnfollowService.setFollow(affiliateName)
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
      this.followUnfollowService.setUnfollow(affiliateName)
      this.isLoading = true
      this.data.removefollower(affiliateName)
      setTimeout(()=>{
        this.isLoading = false
        this.post.isFollowing = false;
      },2000)
    }
  }

  openAd(link: string, ad_id: number){
    console.log(ad_id)
    this.data.updatingAdsClicks(ad_id)
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
      .pipe(
        finalize(() =>{
          setTimeout(()=>{
            this.isDownloading = false
          },1000)
        })
      )
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
