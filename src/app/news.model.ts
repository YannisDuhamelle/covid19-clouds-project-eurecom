import { SigninServiceService } from './signin-service.service';

// This is the model for the News object
export class News {

  date: Date;
  news: string;
  author = {
    uid: "",
    displayName: "",
    email: "",
    admin: false
  };
  country: string;

  constructor(newsP: string, countryP: string) {
    this.date = new Date();
    this.news = newsP;
    this.country = countryP;
  }
}
