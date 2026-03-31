import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ApiService } from '../../../service/api/api.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, CommonModule,RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class Sidebar {
  navCollapsed!: boolean;
  navCollapsedMob!: boolean;
  isDarkMode = false;
  isMobileMenuOpen = false;

  constructor(public api: ApiService) {

  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
}
