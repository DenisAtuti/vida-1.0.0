import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataService } from 'src/app/Services/Data/data.service';
import { IsLoggedService } from 'src/app/Services/is-logged.service';
import { LogActiveService } from 'src/app/Services/log-active.service';
import { NotifierService } from 'src/app/Services/notifier.service';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css'],
})
export class LogComponent implements OnInit {
  isActive: boolean;
  @ViewChild('myForm') form: NgForm;
  isLoading: boolean;

  constructor(
    private logActiveService: LogActiveService,
    private isLogged: IsLoggedService,
    private notifierService: NotifierService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.logActiveService.activeEv.subscribe(() => {
      this.isActive = true;
    });
  }

  onSubmit() {
    this.isLoading = true;
    this.dataService.login(this.form.value).subscribe(
      (response: any) => {
        const token = 'Bearer ' + response.headers.get('Jwt-token');

        this.notifierService.showNotification({
          header: 'Success',
          message: 'Your successfully logged',
          mode: 'success',
        });

        if (response.ok) {
          this.isActive = false;
        }

        localStorage.setItem('token', token);
        localStorage.setItem('user', response.body.username);
        this.isLogged.setlog(true)

        this.isLoading = false;
      },
      (error) => {
        if (
          error.error.httpStatusCode >= 400 &&
          error.error.httpStatusCode < 600
        ) {
          this.notifierService.showNotification({
            header: 'Error',
            message: error.error.message,
            mode: 'error',
          });

          this.isLoading = false;
        }
        console.log(error.error);
      }
    );
  }

  onCloseBtnClicked() {
    this.isActive = false;
  }
}
