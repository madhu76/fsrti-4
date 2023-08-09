import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorComponent } from './author.component';
import { AuthorMenuComponent } from './author-menu/author-menu.component';

const routes: Routes = [{
  path: '',
  component: AuthorComponent,
  children: [
    {
      path: '',
      component: AuthorMenuComponent,
      pathMatch: 'full',
    }
]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthorRoutingModule { }
