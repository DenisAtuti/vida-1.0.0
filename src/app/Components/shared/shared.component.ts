import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/Models/post-model';
import { DataService } from 'src/app/Services/Data/data.service';
import { StateService } from 'src/app/Services/State/state.service';

@Component({
  selector: 'app-shared',
  templateUrl: './shared.component.html',
  styleUrls: ['./shared.component.css']
})
export class SharedComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private data: DataService,
    private title: Title,
    private state: StateService,
    private meta: Meta
  ) { }

  post: Post 
  isLoading: boolean 
  isContent: boolean
  isPost: boolean

  ngOnInit(): void {
    this.isLoading = true
    const videoId = this.route.snapshot.paramMap.get('videoId')
    this.data.getsharedPost(videoId).subscribe(
      (response) =>{
        console.log(response)
        if(response === null) this.isContent = true

        response.viewsCount = this.generateStatistic(500000)
        response.userLikes.length = this.generateStatistic(50000)
        response.commentCount = this.generateStatistic(1000)
        response.sharedCount = this.generateStatistic(1000)
        
        this.isLoading = false
        this.isPost = true;
        // response.videoLocationUrl = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"

        this.post = new Post(
          response.id, 
          response.videoId ,
          response.title,
          response.subreddit,
          response.affiliateName,
          response.isFollowing,
          response.isVerified,
          response.videoLocationUrl,
          this.createAudioUrl(response.videoLocationUrl),
          response.isLiked,
          response.viewsCount,
          response.userLikes.length,
          response.commentCount,
          response.sharedCount,
          true,
          true,
          response.ad
        ) 

        this.title.setTitle(
          `vida videos| watch, share and download ${response.affiliateName} short nude, amateur, tiktok, reddit, instagram and facebook videos`
        );
        this.meta.updateTag({
          name: 'description',
          content:  `vida videos' ${response.affiliateName} is world's best short social media adult videos creator for ${this.state.getYeah()}. Watch free ${response.affiliateName} short videos, 
          sex movies and premium HD short videos on the most popular porn and adult tubes, tiktok, instagram and facebook. All the top short videos like Hentai,Huge breasts,
          Anal, Ebony,Mature, Teen,Amateur,MILF,Lesbian etc, are available here`,
        });

      },
      (error) =>{
        this.isPost = false;
        this.isLoading = false;
        this.isContent = true
      }
    )

    
  }

  private createAudioUrl(url):string{
    return url.slice(0, 32) + 'DASH_audio.mp4' 
  }

  private generateStatistic(max = 500000){
    let rand = Math.random() * max;
    rand = Math.floor(rand); // 99
    return rand;
  }

}
