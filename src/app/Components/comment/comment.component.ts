import { Component, ElementRef, OnInit, Renderer2, ViewChild, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataService } from 'src/app/Services/Data/data.service';
import { NotifierService } from 'src/app/Services/notifier.service';
import { OpenCommentModelService } from 'src/app/Services/open-comment-model.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit, AfterViewInit {

  isActive:boolean = false;
  isInput:boolean = true;

  @ViewChild('replyInput', {static: true}) replyInputEL: ElementRef;
  @ViewChild("commentInput", {static: true}) commentInputEL: ElementRef;
  @ViewChildren("btn") btnsELs: QueryList<ElementRef>;
  @ViewChildren("replyContainers") replyContainerEls: QueryList<ElementRef>;
  @ViewChild('commentForm') commentForm: NgForm;
  @ViewChild('replyForm') replyForm: NgForm;

  btns:any;
  replyContainers: any;
  comments: any [] = []
  videoId: number
  replies: any [] = []
  commentId: number

  constructor(
    private openCommentModelService: OpenCommentModelService,
    private renderer : Renderer2,
    private dataService: DataService,
    private notifier: NotifierService
  ) { }

  ngOnInit(): void {
    this.openCommentModelService.getVideoId().subscribe(
      (videoId: number)=>{
        console.log(videoId);
        this.videoId = videoId;
        this.getComments(videoId)
        this.isActive = true;
        this.setInputsFocus()   
    })
  }

  ngAfterViewInit(): void {
   this.btns = this.btnsELs;
   this.replyContainers = this.replyContainerEls
  }

  // get comments
  getComments(videoId: number){
    this.dataService.getComments(videoId).subscribe(
      // 361286
      (response: any) =>{
        this.comments = response
      }
    )
  }

  onSubmit(){
    const text: string = this.commentForm.value.comment

    const comment = {
      text : text,
      postVideoId: this.videoId
    }

    this.commentForm.reset()


    this.dataService.addComment(comment).subscribe(
      (response: any) =>{
        this.comments.push(response.body)
      }
    )
    
  }

  // reverse comments array to ensure the latest  shows at the top
  reverseComments(): any [] {
    return this.comments.reverse()
  }


  // REPLY SECTION

  reverseReplies(): any [] {
    return this.replies.reverse()
  }

  getReplies(commentId: number){
    this.dataService.getReplies(commentId).subscribe(
      (response: any) =>{
        this.replies = response
      }
    )
  }

  onSubmitReply(){
    const reply = {
      reply: this.replyForm.value.reply,
      postId: this.commentId
    }

    this.dataService.addResplies(reply).subscribe(
      (response: any) => {
        this.replies.push(response.body)  
        this.checkingReplyInputValue("")
      }
    )

  
  }
 
  usernameText:string ;
  usernameLength:number 
  replyBtnClicked(event: any, commentId: number){

    this.commentId = commentId;

    const evElement = event.target;

    if (!evElement.classList.contains("active")){
      this.removeAllActiveBtns(this.btns)
      evElement.classList.add("active")
      this.replyInputEL.nativeElement.querySelector('input').focus()
    }else{
      evElement.classList.remove("active")
    }
    
    this.usernameText = "@" + event.target
    .parentElement.parentElement
    .querySelector(".username").innerText + " "
    
    this.usernameLength = this.usernameText.length
    
    
    this.isInput = !this.isInput;    

    
  }

  openReplyModel(event: any, commentId: number){

    
    const replyContainer = event.target
      .parentElement
      .parentElement
      .parentElement
      .parentElement
      .querySelector(".reply-container")

    this.closeAllReplyContainers(this.replyContainers)
    
    replyContainer.classList.toggle("active")
    
      
      
    this.getReplies(commentId)

  }

  checkingReplyInputValue(value: string){
    if(value.length < this.usernameLength){
      this.isInput = true
      this.removeAllActiveBtns(this.btns)
      this.closeAllReplyContainers(this.replyContainers)
    }
  }

  closeCommentModel(){
    this.removeAllActiveBtns(this.btns)
    this.closeAllReplyContainers(this.replyContainers)
    this.commentForm.reset()
    this.isActive = false;
  }


  private setInputsFocus(){
    this.replyInputEL.nativeElement.querySelector('input').focus()    
    this.commentInputEL.nativeElement.querySelector('input').focus()
  }

  private removeAllActiveBtns(btns){
    btns.forEach((btn)=>{      
      btn.nativeElement.classList.remove("active")
    })
    this.isInput = true;
  }

  private closeAllReplyContainers(containers: any){
    containers.forEach((container) =>{
      this.renderer.removeClass(container.nativeElement,'active')
    })
  }

}
