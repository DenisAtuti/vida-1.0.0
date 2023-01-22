import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/Services/Data/data.service';
import { IsLoggedService } from 'src/app/Services/is-logged.service';
import { LogActiveService } from 'src/app/Services/log-active.service';
import { NotifierService } from 'src/app/Services/notifier.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  isLogged: boolean
  accounts = []

  constructor(
    private logActiveService: LogActiveService,
    private logged: IsLoggedService,
    private router: Router,
    private notifier: NotifierService,
    private data: DataService
  ) { }


  ngOnInit(): void {
    this.logged.isLoggedIn().subscribe(
      (log: boolean) =>{
        this.isLogged = log
        if(!log){
          this.router.navigate(["/"])
        }
      }
    )
    this.data.getVerfiedAffiliates().subscribe(
      (response) => {
        console.log(response.content)
        this.accounts = response.content
      }
    )

  }

  onLoginBtnClicked(){
    this.logActiveService.setActive()
  }
  onLogoutBtnClicked(){
    this.logged.logout()
  }

  navigateTo(link:string){
    if(this.isLogged){
      this.router.navigate([`/${link}`])
    }else{
      this.displayNotifier()
    }
  }


  displayNotifier(){
    this.notifier.showNotification({
      header: "Info",
      message:"Kindly log in to access this page",
      mode:"info"
    })
  }

}
