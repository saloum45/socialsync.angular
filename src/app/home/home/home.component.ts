import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { Header } from './header/header.component';
import { Sidebar } from './sidebar/sidebar.component';

@Component({
  selector: 'app-home',
  standalone: true, // Composant autonome
  imports: [RouterModule,NgbDropdownModule,Header,Sidebar],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  menu:any={
    titre:"Menu",
    items:[
      {libelle:"Entreprises",path:"/home/entreprises"},
{libelle:"PostPublications",path:"/home/post_publications"},
{libelle:"Posts",path:"/home/posts"},
{libelle:"Privileges",path:"/home/privileges"},
{libelle:"SocialAccounts",path:"/home/social_accounts"},
{libelle:"TypeSocialAccounts",path:"/home/type_social_accounts"},
{libelle:"UserPrivileges",path:"/home/user_privileges"},
{libelle:"Users",path:"/home/users"}
    ]
  }
}
