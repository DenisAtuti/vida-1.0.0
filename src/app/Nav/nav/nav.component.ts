import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AdminTemplateRemoverService } from 'src/app/Services/admin-template-remover.service';
import { DataService } from 'src/app/Services/Data/data.service';
import { IsLoggedService } from 'src/app/Services/is-logged.service';
import { LogActiveService } from 'src/app/Services/log-active.service';
import { NotifierService } from 'src/app/Services/notifier.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit, OnDestroy {
  isSearchForm: boolean = true;
  isLoggedIn: boolean;
  isAdmin: boolean = false;
  log: Subscription;

  constructor(
    private logActiveService: LogActiveService,
    private isLogged: IsLoggedService,
    private adminTemplateService: AdminTemplateRemoverService,
    private dataService: DataService,
    private router: Router,
    private notifier: NotifierService
  ) {}

  ngOnInit(): void {
    this.log = this.isLogged.isLoggedIn().subscribe((log: boolean) => {
      this.isLoggedIn = log;
    });
    this.getAllModelNames();
    this.checkAdmin();
  }

  ngOnDestroy(): void {
    this.log.unsubscribe();
  }

  reload(){
    this.router.navigate(["/"]).then(result=>{window.location.href = 'https://www.vida-videos.com/';});
  }

  onLoginBtnClicked(): void {
    this.logActiveService.setActive();
  }

  onLogOutBtnClicked() {
    this.isLogged.logout();
  }

  modelNames: string[] = [];
  getAllModelNames() {
    this.dataService.getAllModelNames().subscribe((namesArray: string[]) => {
      this.modelNames = namesArray;
    });
  }

  getSearchedName(input: any) {
    this.getSearchedModel(input.target.value);
  }

  matches: string[];
  isSearchPresent: boolean = false;
  getSearchedModel(searchTerm: string) {
    this.matches = this.modelNames.filter((model) => {
      const regax = new RegExp(`^${searchTerm}`, 'gi');
      return model.match(regax);
    });

    if (searchTerm.length > 0 && this.matches.length === 0) {
      this.isSearchPresent = true;
    }

    if (searchTerm.length === 0) {
      this.matches = [];
      this.isSearchPresent = false;
    }

    if (searchTerm.length > 0 && this.matches.length === 1) {
      // this.disableSubmit(searchTerm)
    }
  }

  disableSubmit(searchTerm: string) {
    this.isSearchForm = !this.matches.includes(searchTerm);
    if (this.isSearchForm) {
      this.navigateToAffiliate(searchTerm);
    }
  }

  navigateToAffiliate(item: string) {
    this.matches.length = 0;
    this.router.navigate(['/affiliate/model/', item]);
  }

  navigateTo(link:string){
    if(this.isLoggedIn){
      this.router.navigate([`/${link}`])
    }else{
      this.displayNotifier()
    }
  }

  removeTemplate(){
    this.adminTemplateService.setTemplate()
  }

  checkAdmin(){
    const admin = localStorage.getItem('user')
    if(admin === 'keta'){
      this.isAdmin = true
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
