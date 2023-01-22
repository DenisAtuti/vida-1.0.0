import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotifierOpt } from 'src/app/Models/notifierOpt-model';
import { NotifierService } from 'src/app/Services/notifier.service';

@Component({
  selector: 'app-notifier',
  templateUrl: './notifier.component.html',
  styleUrls: ['./notifier.component.css']
})

export class NotifierComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild("notierEL", {static: false}) notierEL: ElementRef;

  isActive:boolean
  notifierContainer:any
  notifierIcon:string

  // notifierOpts
  header: string;
  message: string;
  mode: string;

  subscription: Subscription;

  timeout:any
  
  constructor(private renderer: Renderer2, private NotifierService: NotifierService) {}
 
  ngOnInit(): void {
    this.subscription = this.NotifierService.notifierSubject.subscribe(
      (options: NotifierOpt) =>{
        this.header = options.header;
        this.message = options.message
        this.mode = options.mode

        this.notifierIcon = options.mode

        this.isActive = true

        this.getColor()

        this.timeout = setTimeout(() => {
          this.isActive = false;
        }, 5000);
        
      }
    )
  }

  ngAfterViewInit() {
    this.notifierContainer = this.notierEL.nativeElement
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe;
  }

  getColor(){
    const mode:string = this.mode;
    switch (mode) {
        case "success":
          this.renderer.setProperty(this.notifierContainer,'style','--notifier-color:#49D663')
            break;
        case "error":
          this.renderer.setProperty(this.notifierContainer,'style','--notifier-color:#FE365A')
            break;
        case "info":
          this.renderer.setProperty(this.notifierContainer,'style','--notifier-color:#2C87EB')
            break;
        case "warning":
          this.renderer.setProperty(this.notifierContainer,'style','--notifier-color:#FFBF27')
            break;
        default:
          this.renderer.setProperty(this.notifierContainer,'style','--notifier-color:#fff')
          break;
    }
  }

  onCloseNotifier(){
    this.isActive = false;
    clearTimeout(this.timeout)
  }

}
