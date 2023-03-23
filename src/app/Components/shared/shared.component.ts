import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/Models/post-model';
import { DataService } from 'src/app/Services/Data/data.service';
import { StateService } from 'src/app/Services/State/state.service';

@Component({
  selector: 'app-shared',
  templateUrl: './shared.component.html',
  styleUrls: ['./shared.component.css'],
})
export class SharedComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private data: DataService,
    private title: Title,
    private state: StateService,
    private meta: Meta
  ) {}

  post: Post;
  isLoading: boolean;
  isContent: boolean;
  isPost: boolean;

  ngOnInit(): void {
    this.isLoading = true;
    const videoId = this.route.snapshot.paramMap.get('videoId');
    this.data.getsharedPost(videoId).subscribe(
      (response) => {
        console.log(response);
        if (response === null) this.isContent = true;

        response.viewsCount = this.generateStatistic(500000);
        response.userLikes.length = this.generateStatistic(50000);
        response.commentCount = this.generateStatistic(1000);
        response.sharedCount = this.generateStatistic(1000);

        this.isLoading = false;
        this.isPost = true;
        // response.videoLocationUrl = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"

        this.post = new Post(
          response.id,
          response.videoId,
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
        );

        const seoTitle = `vida videos| watch, share and download ${response.affiliateName} short nude, porn, amateur, tiktok, reddit, instagram and facebook videos`;
        const seoDescription = `vida videos' ${
          response.affiliateName
        } is world's best short social media adult videos creator for ${this.state.getYeah()}. Watch free ${
          response.affiliateName
        } short videos, 
        sex movies and premium HD short videos on the most popular porn and adult tubes, tiktok, instagram and facebook. All the top short videos like Hentai,Huge breasts,
        Anal, Ebony,Mature, Teen,Amateur,MILF,Lesbian etc, are available here`;
        const seoImage = 'https://vida-videos.com/uploads/images/vida-1.gif';
        const seoUrl = `/shared/post/${videoId}`;

        this.title.setTitle(seoTitle);
        this.meta.addTags([
          { name: 'description', content: seoDescription },
          // Facebook Meta Tags
          { name: 'og:url', content: seoUrl },
          { name: 'og:type', content: 'website' },
          { name: 'og:title', content: seoTitle },
          { name: 'og:description', content: seoDescription },
          { name: 'og:image', content: seoImage },

          // Twitter Meta Tags
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:domain', content: 'vida-videos.com' },
          { name: 'twitter:url', content: seoUrl },
          { name: 'twitter:title', content: seoTitle },
          { name: 'twitter:description', content: seoDescription },
          { name: 'twitter:image', content: seoImage },
        ]);
      },
      (error) => {
        this.isPost = false;
        this.isLoading = false;
        this.isContent = true;
      }
    );
  }

  private createAudioUrl(url): string {
    return url.slice(0, 32) + 'DASH_audio.mp4';
  }

  private generateStatistic(max = 500000) {
    let rand = Math.random() * max;
    rand = Math.floor(rand); // 99
    return rand;
  }
}
