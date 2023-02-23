import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AffiliateComponent } from './Affiliate/affiliate/affiliate.component';
import { FollowingComponent } from './Following/following/following.component';
import { LikedComponent } from './Liked/liked/liked.component';
import { MainComponent } from './Main/main/main.component';
import { NavComponent } from './Nav/nav/nav.component';
import { SubredditComponent } from './Subreddit/subreddit/subreddit.component';
import { LogComponent } from './Log/log/log.component';
import { ContentComponent } from './Components/content/content.component';
import { OpenMiniMenuDirective } from './Directives/open-mini-menu.directive';
import { PostComponent } from './Components/post/post.component';
import { CommentComponent } from './Components/comment/comment.component';
import { ErrorPageComponent } from './Components/error-page/error-page.component';
import { LandingPageComponent } from './Components/landing-page/landing-page.component';
import { PlayerComponent } from './Components/player/player.component';
import { NotifierComponent } from './Components/notifier/notifier.component';
import { MainService } from './Services/Data/main.service';
import { SharedComponent } from './Components/shared/shared.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { ShortNumberPipe } from './Pipe/short-number.pipe';

@NgModule({
  declarations: [
    AppComponent,
    AffiliateComponent,
    FollowingComponent,
    LikedComponent,
    MainComponent,
    NavComponent,
    SubredditComponent,
    LogComponent,
    ContentComponent,
    OpenMiniMenuDirective,
    PostComponent,
    CommentComponent,
    ErrorPageComponent,
    LandingPageComponent,
    PlayerComponent,
    NotifierComponent,
    SharedComponent,
    ShortNumberPipe,
     
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy}
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: initMain,
    //   deps:[MainService],
    //   multi: true
    // }
    
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }

export function initMain(main: MainService){
  return async ()=> {
    await main.init();
  }
}
