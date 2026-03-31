import { Component, OnDestroy, OnInit ,signal } from '@angular/core';
  import { ApiService } from '../../../service/api/api.service';
  import { AddTypeSocialAccountsComponent } from '../add-type-social-accounts/add-type-social-accounts.component';
  import { EditTypeSocialAccountsComponent } from '../edit-type-social-accounts/edit-type-social-accounts.component';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  import { NgSelectModule } from '@ng-select/ng-select';
  import { CommonModule } from '@angular/common';
  import { FormsModule } from '@angular/forms';
  @Component({
    selector: 'app-list-type-social-accounts',
    standalone: true, // Composant autonome
    imports: [CommonModule,NgSelectModule,FormsModule], // Dépendances importées
    templateUrl: './list-type-social-accounts.component.html',
    styleUrls: ['./list-type-social-accounts.component.scss']
  })
  export class ListTypeSocialAccountsComponent implements OnInit, OnDestroy{
    loading_get_type_social_accounts=signal(false);
    loading_delete_type_social_accounts=signal(false);
    type_social_accounts: any[] = []
    list: any[] = []
    filter: any = {
      text: [],
    };
    constructor(public api: ApiService,private modalService: NgbModal) {
  
    }
    ngOnInit(): void {
      console.groupCollapsed("ListTypeSocialAccountsComponent");
      this.get_type_social_accounts()
    }
    ngOnDestroy(): void {
      console.groupEnd();
    }
    get_type_social_accounts() {
      this.loading_get_type_social_accounts.set(true);
      this.api.taf_get("type_social_accounts", (reponse: any) => {
        if (reponse.status_code) {
          this.type_social_accounts = reponse.data
          this.list= reponse.data
          console.log("Opération effectuée avec succés sur la table type_social_accounts. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table type_social_accounts a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_type_social_accounts.set(false);
      }, (error: any) => {
        this.loading_get_type_social_accounts.set(false);
      })
    }
    filter_change(event?: any) {
      this.list = this.type_social_accounts.filter((one: any) => {
        let search = !event?.term || JSON.stringify(one).toLowerCase().replace(/s/g, '')
          .includes(event?.term?.toLowerCase().replace(/s/g, ''))
        return search// && text
      })
    }
    delete_type_social_accounts (type_social_accounts : any){
      this.loading_delete_type_social_accounts.set(true);
      this.api.taf_post("type_social_accounts/delete", type_social_accounts,(reponse: any)=>{
        //when success
        if(reponse.status_code){
          console.log("Opération effectuée avec succés sur la table type_social_accounts . Réponse = ",reponse)
          this.get_type_social_accounts()
          this.api.Swal_success("Opération éffectuée avec succés")
        }else{
          console.log("L'opération sur la table type_social_accounts  a échoué. Réponse = ",reponse)
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_delete_type_social_accounts.set(false);
      },
      (error: any)=>{
        //when error
        console.log("Erreur inconnue! ",error)
        this.loading_delete_type_social_accounts.set(false);
      })
    }
    openModal_add_type_social_accounts() {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(AddTypeSocialAccountsComponent, { ...options, backdrop: 'static' })
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status_code) {
          this.get_type_social_accounts()
        } else {

        }
      })
    }
    openModal_edit_type_social_accounts(one_type_social_accounts: any) {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(EditTypeSocialAccountsComponent, { ...options, backdrop: 'static', })
      modalRef.componentInstance.type_social_accounts_to_edit = one_type_social_accounts;
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status_code) {
          this.get_type_social_accounts()
        } else {

        }
      })
    }
  }