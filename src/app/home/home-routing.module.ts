import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListEntreprisesComponent } from './entreprises/list-entreprises/list-entreprises.component';
import { ListPostPublicationsComponent } from './post-publications/list-post-publications/list-post-publications.component';
import { ListPostsComponent } from './posts/list-posts/list-posts.component';
import { ListPrivilegesComponent } from './privileges/list-privileges/list-privileges.component';
import { ListSocialAccountsComponent } from './social-accounts/list-social-accounts/list-social-accounts.component';
import { ListTypeSocialAccountsComponent } from './type-social-accounts/list-type-social-accounts/list-type-social-accounts.component';
import { ListUserPrivilegesComponent } from './user-privileges/list-user-privileges/list-user-privileges.component';
import { ListUsersComponent } from './users/list-users/list-users.component';

const routes: Routes = [
  {path:"",component:ListEntreprisesComponent},
{path:"entreprises",component:ListEntreprisesComponent},
{path:"post_publications",component:ListPostPublicationsComponent},
{path:"posts",component:ListPostsComponent},
{path:"privileges",component:ListPrivilegesComponent},
{path:"social_accounts",component:ListSocialAccountsComponent},
{path:"type_social_accounts",component:ListTypeSocialAccountsComponent},
{path:"user_privileges",component:ListUserPrivilegesComponent},
{path:"users",component:ListUsersComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }