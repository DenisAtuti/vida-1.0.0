import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { DataService } from './Data/data.service';
import { NotifierService } from './notifier.service';

@Injectable({
  providedIn: 'root',
})
export class IsLoggedService implements OnDestroy {
  isLoggedInSub = new Subject<boolean>();
  isLogged: boolean
  subcription: Subscription;

  constructor(private data: DataService, private notifier: NotifierService) {}

  ngOnDestroy(): void {
    this.subcription.unsubscribe();
  }

  verifyToken() {
    const token = this.getToken();
    if (token != null) {
      this.subcription = this.data
        .verfyToken(token)
        .subscribe((log: boolean) => {
          this.setlog(log)
        });
    }
  }

  isLoggedIn():Observable<boolean>{
    return this.isLoggedInSub.asObservable()
  }

  setlog(log:boolean){
    this.isLoggedInSub.next(log)
    this.isLogged = log
  }

  getToken(): string {
    const token = localStorage.getItem('token');
    return token;
  }

  logout() {
    this.setlog(false)
    localStorage.clear();
    this.notifier.notifierSubject.next({
      header: 'Success',
      message: "Yo've successfully logout",
      mode: 'success',
    });
  }
}
