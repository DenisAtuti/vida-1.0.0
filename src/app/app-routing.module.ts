import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AffiliateComponent } from './Affiliate/affiliate/affiliate.component';
import { ErrorPageComponent } from './Components/error-page/error-page.component';
import { SharedComponent } from './Components/shared/shared.component';
import { FollowingComponent } from './Following/following/following.component';
import { LikedComponent } from './Liked/liked/liked.component';
import { MainComponent } from './Main/main/main.component';
import { SubredditComponent } from './Subreddit/subreddit/subreddit.component';

const routes: Routes = [
  {path:'', component:MainComponent},
  {path:'affiliate/model/:name', component:AffiliateComponent},
  {path:'subreddit/account/:name', component:SubredditComponent},
  {path:'following', component:FollowingComponent},
  {path:'liked', component:LikedComponent},
  {path:'shared/post/:videoId', component: SharedComponent},
  {path:'**',component: ErrorPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
