import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { finalize, Subscription } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { AutoScrollService } from 'src/app/Services/auto-scroll.service';
import { CanGetPostService } from 'src/app/Services/can-get-post.service';
import { CompletedService } from 'src/app/Services/completed.service';
import { NotifierService } from 'src/app/Services/notifier.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() videoUrl: string;
  @Input() videoId: number;
  @Input () affiliateName: string;
  @Input() playVideoEvent: Subject<boolean>;
  @Input() navigatorSubj: Subject<boolean>;
  @Input() componentPage: string;

  @ViewChild("video", {static: false}) videoEl: ElementRef;
  @ViewChild("audio", {static: false}) audioEl: ElementRef;
  @ViewChild("videoWrapper", {static: false}) videoWrapperEl: ElementRef;
  @ViewChild("timelineContainer", {static: false}) timelineContainerEl: ElementRef;

  playVideoSub: Subscription;
  navigatorSub: Subscription;

  video: any;
  audio:any;
  videoWrapper:any;
  fileName: string;
  timelineContainer: any;
  timelineEl:any;
  timelineThumb: any;


  isNavigator:boolean;
  isPlaying: boolean = false; 
  isFullScreen: boolean = false;
  isPictureMode = false;
  isComplete: boolean = false;
  isScrubbing:boolean;
  isDownloading: boolean = false;

  totalTime:any;
  currentTime:any;

  constructor(
    private renderer: Renderer2, 
    private http: HttpClient,
    private completedService: CompletedService,
    private canGetPost: CanGetPostService,
    private autoScroll: AutoScrollService,
    private notiferService: NotifierService,
  ) { }
  
  ngOnInit(): void {
    this.navigatorSub = this.navigatorSubj.subscribe(
      (value:boolean)=>{
        this.isNavigator = value
        setTimeout(() => {
          this.isNavigator = false
        }, 1000);
      }
    )
    this.playVideo() 
  }

  ngAfterViewInit(){
    this.video = this.videoEl.nativeElement;
    const audiofile = this.createAudioUrl(this.video.src)
    this.audio = this.audioEl.nativeElement;
    this.audio.src = audiofile
    this.videoWrapper = this.videoWrapperEl.nativeElement;

    this.timelineContainer = this.timelineContainerEl.nativeElement;

    this.timelineEl = this.timelineContainer.querySelector(".timeline")
    this.timelineThumb = this.timelineContainer.querySelector(".timeline-thumb")

    this.fileName = this.affiliateName + "_" + this.videoId    

    this.renderer.listen(this.video, 'playing' ,()=>{
      this.isPlaying = true;
      this.audio.currentTime = this.video.currentTime
      this.audio.play()
    })

    this.renderer.listen(this.video, 'ended' ,()=>{
      this.video.currentTime = 0
      this.scrollFun()
    })

    this.renderer.listen(this.video, 'waiting' ,()=>{
      this.isPlaying = false;
      this.audio.currentTime = this.video.currentTime
      this.audio.pause()
    })

    this.renderer.listen(this.video, 'loadeddata' ,()=>{
      this.totalTime = this.formatTime(this.video.duration);
      const width = window.innerWidth
      if(this.video.videoHeight > this.video.videoWidth && width <= 425){
        this.renderer.addClass(this.video, 'portrait')
      } 
    })

    this.renderer.listen(this.video, 'timeupdate' ,()=>{
      this.handleTimelineUpdate();
    })

    this.renderer.listen(this.video, 'enterpictureinpicture' ,()=>{
      this.isPictureMode = true;
    })

    this.renderer.listen(this.video, 'leavepictureinpicture' ,()=>{
      this.isPictureMode = false;
    })

    this.renderer.listen(this.videoWrapper, 'mouseenter' ,()=>{
      this.toggleControlsDisplay()
    })

    this.renderer.listen(this.videoWrapper, 'mousemove' ,()=>{
      this.toggleControlsDisplay()
    })


    this.renderer.listen(this.timelineContainer, 'click' ,(e)=>{
      this.handleMouseClick(e)
      
    })

    this.renderer.listen(this.timelineContainer, 'mousemove' ,(e) =>{
      this.handleMouseMove(e) 
    })

    this.renderer.listen(this.timelineContainer, 'mousemove' ,(e)=>{
      this.handleMouseScrubbing(e);    
    })

    this.renderer.listen(this.video, 'loadeddata' ,(e)=>{
      this.videoLoaded(e)  
    })


  }
  
  videoLoaded(event: any){
    if(event.target.readyState >= 3 && this.isComplete === false){
      this.completedService.isVideoLoaded(this.componentPage)
      this.isComplete = true;
    }                                                                                                                                            
  } 

  playVideo(){
    this.playVideoSub = this.playVideoEvent.subscribe(
      (value: boolean) =>{

        if(!value){
          this.isNavigator = false;
        }
        
        this.video.currentTime = 0;

        if(value){
          this.video.play()
          this.canGetPost.setCanGetPost(this.componentPage, this.videoId)
          
        }else{
          this.video.pause()
        }
      }
    )
  }

  togglePlayPause(){
    if(this.isPlaying){
      this.onPauseBtnClicked()
    }else{
      this.onPlayBtnClicked()
    }
  }

  onPauseBtnClicked(){
    this.video.pause();
    this.isPlaying = false;
  }

  onPlayBtnClicked(){
    this.video.play();
    this.isPlaying = true;
  }

  

  onPictureModeBtnClicked(){

    if (this.isPictureMode) {
      document.exitPictureInPicture()

    } else {
      this.video.requestPictureInPicture()
    }
  }

  onDownloadBtnClicked(){
    if(this.isDownloading){
      this.showNotifier(
        "Warning", 
        `Wait, still downloading previous video`, 
        "warning"
      )
    }else{
      this.isDownloading = true;
      this.download(this.videoUrl, this.fileName)
    }
  }

  onfullscreenBtnClicked(){
    this.videoWrapper.requestFullscreen()
    this.isFullScreen = true;
    this.renderer.removeClass(this.video, 'portrait')

  }
  onNotfullscreenBtnClicked(){
    document.exitFullscreen()
    this.isFullScreen = false;
    const width = window.innerWidth
    if(this.video.videoHeight > this.video.videoWidth && width <= 425){
      this.renderer.addClass(this.video, 'portrait')
    } 
  }

  private scrollFun(){
    this.autoScroll.setAutoScroll(this.componentPage)
  }

  private toggleControlsDisplay(){
    this.isNavigator = true
      setTimeout(() => {
        this.isNavigator = false;
      }, 2000);
  }

  leadingZeroFormatter = new Intl.NumberFormat(undefined,{minimumIntegerDigits:2})
  private formatTime(time){
    const seconds = Math.floor(time % 60)
    const minutes = Math.floor(time / 60) % 60;
    const hours = Math.floor(time / 3600);

    if (hours === 0) {
      return `${minutes}:${this.leadingZeroFormatter.format(seconds)}`
    }else{
      return `${hours}
        :${this.leadingZeroFormatter.format(minutes)}
        :${this.leadingZeroFormatter.format(seconds)}`
    }
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

  private createAudioUrl(url):string{
    return url.slice(0, 32) + 'DASH_audio.mp4' 
  }

  private handleTimelineUpdate(){
    this.currentTime = this.formatTime(this.video.currentTime);
    const percent = this.video.currentTime / this.video.duration;
    this.renderer.setProperty(this.timelineContainer,'style',`--progress-positon: ${percent}`)
  }

  private handleMouseClick(event:any){
    const timelineWidth = this.timelineContainer.clientWidth;
    this.video.currentTime = (event.offsetX / timelineWidth) * this.video.duration
    const percent = this.video.currentTime / this.video.duration;
    this.renderer.setProperty(this.timelineContainer,'style',`--progress-positon: ${percent}`)
  }

  private handleMouseMove(e){
    const rect = this.timelineContainer.getBoundingClientRect()
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width  
    this.renderer.setProperty(this.timelineContainer,'style',`--preview-position: ${percent}`)
    const currentTimePercent = this.video.currentTime / this.video.duration;
    this.renderer.setProperty(this.timelineContainer,'style',`--progress-positon: ${currentTimePercent}`)

    if(this.isScrubbing){
      this.renderer.setProperty(this.timelineContainer,'style',`--progress-positon: ${percent}`)
      e.preventDefault()
    }
  }

  private handleMouseScrubbing(event: any){
    const timelineWidth = this.timelineContainer.clientWidth;
    this.isScrubbing = (event.buttons & 1) === 1;
    const percent = this.video.currentTime / this.video.duration;
    this.renderer.setProperty(this.timelineContainer,'style',`--preview-position: ${percent}`)

    if(this.isScrubbing){
      event.preventDefault()
      this.renderer.setProperty(this.timelineContainer,'style',`--progress-positon: ${percent}`)       
      this.video.currentTime = (event.offsetX / timelineWidth) * this.video.duration
      this.video.pause()
    }else{
      this.video.play()
    }

    this.handleMouseMove(event)
    
  }

  private showNotifier(header: string, message:string, mode:string){
    this.notiferService.showNotification({
        header: header,
        message: message,
        mode: mode
      })
  }


  
  ngOnDestroy(): void {
    this.playVideoSub.unsubscribe()
    this.navigatorSub.unsubscribe()
  }

  // https://v.redd.it/pbza0meh7n0a1/DASH_1080.mp4

}
