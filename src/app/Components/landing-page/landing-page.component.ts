import { Component, OnInit } from '@angular/core';
import { LandingService } from 'src/app/Services/landing.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit{

  constructor(private landingService: LandingService) { }

  ngOnInit() {
  }

  onEnterClicked(){
    localStorage.setItem("isLanding", "false")
    this.landingService.landingSubj.next(false)
  }

}
