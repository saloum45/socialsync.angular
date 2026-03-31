import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { ApiService } from '../../../service/api/api.service';
import { AddSocialAccountsComponent } from '../add-social-accounts/add-social-accounts.component';
import { EditSocialAccountsComponent } from '../edit-social-accounts/edit-social-accounts.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-list-social-accounts',
  standalone: true, // Composant autonome
  imports: [CommonModule, NgSelectModule, FormsModule], // Dépendances importées
  templateUrl: './list-social-accounts.component.html',
  styleUrls: ['./list-social-accounts.component.scss']
})
export class ListSocialAccountsComponent implements OnInit, OnDestroy {
  loading_get_social_accounts = signal(false);
  loading_delete_social_accounts = signal(false);
  loading_get_details_add_social_accounts_form = signal(false);
  social_accounts: any[] = []
  list: any[] = []
  form_details: any;
  filter: any = {
    text: [],
  };
  constructor(public api: ApiService, private modalService: NgbModal) {

  }
  ngOnInit(): void {
    console.groupCollapsed("ListSocialAccountsComponent");
    this.get_social_accounts()
    this.get_details_add_social_accounts_form();
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  get_social_accounts() {
    this.loading_get_social_accounts.set(true);
    this.api.taf_get("social_accounts", (reponse: any) => {
      if (reponse.status_code) {
        this.social_accounts = reponse.data
        this.list = reponse.data
        console.log("Opération effectuée avec succés sur la table social_accounts. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table social_accounts a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_social_accounts.set(false);
    }, (error: any) => {
      this.loading_get_social_accounts.set(false);
    })
  }
  filter_change(event?: any) {
    this.list = this.social_accounts.filter((one: any) => {
      let search = !event?.term || JSON.stringify(one).toLowerCase().replace(/s/g, '')
        .includes(event?.term?.toLowerCase().replace(/s/g, ''))
      return search// && text
    })
  }
  delete_social_accounts(social_accounts: any) {
    this.loading_delete_social_accounts.set(true);
    this.api.taf_post("social_accounts/delete", social_accounts, (reponse: any) => {
      //when success
      if (reponse.status_code) {
        console.log("Opération effectuée avec succés sur la table social_accounts . Réponse = ", reponse)
        this.get_social_accounts()
        this.api.Swal_success("Opération éffectuée avec succés")
      } else {
        console.log("L'opération sur la table social_accounts  a échoué. Réponse = ", reponse)
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_delete_social_accounts.set(false);
    },
      (error: any) => {
        //when error
        console.log("Erreur inconnue! ", error)
        this.loading_delete_social_accounts.set(false);
      })
  }
  openModal_add_social_accounts() {
    let options: any = {
      centered: true,
      scrollable: true,
      size: "lg"//'sm' | 'lg' | 'xl' | string
    }
    const modalRef = this.modalService.open(AddSocialAccountsComponent, { ...options, backdrop: 'static' })
    modalRef.result.then((result: any) => {
      console.log('Modal closed with:', result);
      if (result?.status_code) {
        this.get_social_accounts()
      } else {

      }
    })
  }
  openModal_edit_social_accounts(one_social_accounts: any) {
    let options: any = {
      centered: true,
      scrollable: true,
      size: "lg"//'sm' | 'lg' | 'xl' | string
    }
    const modalRef = this.modalService.open(EditSocialAccountsComponent, { ...options, backdrop: 'static', })
    modalRef.componentInstance.social_accounts_to_edit = one_social_accounts;
    modalRef.result.then((result: any) => {
      console.log('Modal closed with:', result);
      if (result?.status_code) {
        this.get_social_accounts()
      } else {

      }
    })
  }


  get_details_add_social_accounts_form() {
    this.loading_get_details_add_social_accounts_form.set(true);
    this.api.taf_get("social_accounts/getformdetails", (reponse: any) => {
      if (reponse.status_code) {
        this.form_details = reponse.data
        console.log("Opération effectuée avec succés sur la table social_accounts. Réponse= ", reponse);
      } else {
        console.log("L'opération sur la table social_accounts a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_get_details_add_social_accounts_form.set(false);;
    }, (error: any) => {
      this.loading_get_details_add_social_accounts_form.set(false);;
    })
  }
  get_social_account_sign_up(social_account_name: any) {
    window.open(this.api.taf_base_url + social_account_name.toLowerCase() + "/auth", '_blank');
  }



  // ── Computed counts ────────────────────────────────────────────────
  get connectedCount(): number {
    return this.social_accounts.filter(a =>
      a.social_accounts?.length > 0 && !this.isExpired(a) && !this.isExpiringSoon(a)
    ).length;
  }
  get expiringCount(): number {
    return this.social_accounts.filter(a =>
      a.social_accounts?.length > 0 && (this.isExpiringSoon(a) || this.isExpired(a))
    ).length;
  }
  get disconnectedCount(): number {
    return this.social_accounts.filter(a => !a.social_accounts?.length).length;
  }

  // ── Token helpers ──────────────────────────────────────────────────
  isExpired(account: any): boolean {
    const sa = account.social_accounts?.[0];
    if (!sa?.expires_at) return false;
    return new Date(sa.expires_at) < new Date();
  }

  isExpiringSoon(account: any): boolean {
    const sa = account.social_accounts?.[0];
    if (!sa?.expires_at) return false;
    const diff = new Date(sa.expires_at).getTime() - Date.now();
    return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000; // < 7 jours
  }

  /**
   * Retourne le % de validité du token.
   * On estime la durée totale à 60 jours (standard OAuth),
   * à adapter selon votre logique métier.
   */
  getTokenPercent(account: any): number {
    const sa = account.social_accounts?.[0];
    if (!sa?.expires_at) return 0;
    const totalDuration = 60 * 24 * 60 * 60 * 1000; // 60 jours
    const remaining = new Date(sa.expires_at).getTime() - Date.now();
    const percent = Math.round((remaining / totalDuration) * 100);
    return Math.max(0, Math.min(100, percent));
  }

  // ── Status badge ───────────────────────────────────────────────────
  getStatusLabel(account: any): string {
    if (!account.social_accounts?.length) return 'Non connecté';
    if (this.isExpired(account)) return 'Expiré';
    if (this.isExpiringSoon(account)) return 'Expire bientôt';
    return 'Actif';
  }

  getStatusClass(account: any): string {
    if (!account.social_accounts?.length) return 'status-badge badge-disconnected';
    if (this.isExpired(account)) return 'status-badge badge-expired';
    if (this.isExpiringSoon(account)) return 'status-badge badge-expiring';
    return 'status-badge badge-connected';
  }

  // ── Actions ────────────────────────────────────────────────────────
  connectAccount(account: any): void {
    // Rediriger vers le flow OAuth du réseau
    console.log('Connect:', account);
  }

  reconnect(account: any): void {
    // Renouveler le token (refresh_token ou re-auth)
    console.log('Reconnect:', account);
  }

  refreshToken(account: any): void {
    console.log('Refresh token:', account);
  }

  disconnect(account: any): void {
    console.log('Disconnect:', account);
  }

  viewDetails(account: any): void {
    console.log('Details:', account);
  }


}
