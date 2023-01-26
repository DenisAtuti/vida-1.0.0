import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FollowUnfollowService {
  private unfollow = new Subject<string>();
  private follow = new Subject<string>();

  constructor() {}

  setUnfollow(model: string) {
    this.unfollow.next(model);
  }

  getUnfollow(): Observable<string> {
    return this.unfollow.asObservable();
  }

  setFollow(model: string) {
    this.follow.next(model);
  }

  getFollow(): Observable<string> {
    return this.follow.asObservable();
  }
}
