// blog-data.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BlogDataService {
  private allBlogData: any[] = [];

  setAllBlogData(data: any[]) {
    this.allBlogData = data;
  }

  getAllBlogData() {
    return this.allBlogData;
  }

  removeBlogById(blogId: string) {
    this.allBlogData = this.allBlogData.filter(blog => blog.id !== blogId);
  }
}
