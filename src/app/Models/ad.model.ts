export interface Ad {
    id: number;
    campaign: string;
    company: string;
    file: string
    fileName: string;
    clicks: number;
    impressions: number
    clientImageUrl:string;
    affiliateLink: string;
    uploadedDate: Date;
    payPerClick: number;
    signUp: number;
}