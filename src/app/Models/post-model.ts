import { Ad } from "./ad.model";

export class Post{
    constructor(
        public id: number,
        public videoId: string,
        public title: string,
        public subreddit: string,
        public affiliateName: string,
        public isFollowing: boolean,
        public isVerified: boolean,
        public videoLocationUrl: string,
        public audioUrl: string,
        public isLiked: boolean,
        public viewsCount: number,
        public likesCount: number,
        public commentsCount:number,
        public sharedCount:number,
        public isLast:boolean,
        public ad: Ad
    ){}
}
