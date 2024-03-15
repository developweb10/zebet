import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogComponent } from './blog.component';
import { BlogPostComponent } from './blogpost/blog-post.component';

const blogRoutes: Routes = [
    { path: '' , component: BlogComponent },
    { path: ':slug' , component: BlogPostComponent },
];

@NgModule({
  imports: [RouterModule.forChild(blogRoutes)],
  exports: [RouterModule]
})
export class BlogRoutingModule { }
