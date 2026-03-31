import { Component, signal } from '@angular/core';
import { RouterLink,Router } from '@angular/router';
import { ApiService } from '../../../service/api/api.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class Header {
  navCollapsed!: boolean;
  navCollapsedMob!: boolean;
  isDarkMode = false;
  isMobileMenuOpen = false;
  loading_logout_logout = signal(false)

  constructor(public api:ApiService,private route:Router) {

  }

    logout() {
    this.loading_logout_logout.set(true);
    this.api.taf_post("logout", {}, async (reponse: any) => {
      if (reponse.status_code == 200) {
        console.log("Opération effectuée avec succés sur la table logout. Réponse= ", reponse);
        this.api.delete_from_local_storage("token");
        this.api.Swal_success("Déconnexion éffectuée avec succés")
        this.route.navigate(['/public']);
      } else {
        console.log("L'opération sur la table logout a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_logout_logout.set(false);
    }, (error: any) => {
      this.loading_logout_logout.set(false);
    })
  }
}

