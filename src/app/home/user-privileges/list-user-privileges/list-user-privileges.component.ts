import { Component, OnDestroy, OnInit ,signal } from '@angular/core';
  import { ApiService } from '../../../service/api/api.service';
  import { AddUserPrivilegesComponent } from '../add-user-privileges/add-user-privileges.component';
  import { EditUserPrivilegesComponent } from '../edit-user-privileges/edit-user-privileges.component';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  import { NgSelectModule } from '@ng-select/ng-select';
  import { CommonModule } from '@angular/common';
  import { FormsModule } from '@angular/forms';
  @Component({
    selector: 'app-list-user-privileges',
    standalone: true, // Composant autonome
    imports: [CommonModule,NgSelectModule,FormsModule], // Dépendances importées
    templateUrl: './list-user-privileges.component.html',
    styleUrls: ['./list-user-privileges.component.scss']
  })
  export class ListUserPrivilegesComponent implements OnInit, OnDestroy{
    loading_get_user_privileges=signal(false);
    loading_delete_user_privileges=signal(false);
    user_privileges: any[] = []
    list: any[] = []
    filter: any = {
      text: [],
    };
    constructor(public api: ApiService,private modalService: NgbModal) {
  
    }
    ngOnInit(): void {
      console.groupCollapsed("ListUserPrivilegesComponent");
      this.get_user_privileges()
    }
    ngOnDestroy(): void {
      console.groupEnd();
    }
    get_user_privileges() {
      this.loading_get_user_privileges.set(true);
      this.api.taf_get("user_privileges", (reponse: any) => {
        if (reponse.status_code) {
          this.user_privileges = reponse.data
          this.list= reponse.data
          console.log("Opération effectuée avec succés sur la table user_privileges. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table user_privileges a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_user_privileges.set(false);
      }, (error: any) => {
        this.loading_get_user_privileges.set(false);
      })
    }
    filter_change(event?: any) {
      this.list = this.user_privileges.filter((one: any) => {
        let search = !event?.term || JSON.stringify(one).toLowerCase().replace(/s/g, '')
          .includes(event?.term?.toLowerCase().replace(/s/g, ''))
        return search// && text
      })
    }
    delete_user_privileges (user_privileges : any){
      this.loading_delete_user_privileges.set(true);
      this.api.taf_post("user_privileges/delete", user_privileges,(reponse: any)=>{
        //when success
        if(reponse.status_code){
          console.log("Opération effectuée avec succés sur la table user_privileges . Réponse = ",reponse)
          this.get_user_privileges()
          this.api.Swal_success("Opération éffectuée avec succés")
        }else{
          console.log("L'opération sur la table user_privileges  a échoué. Réponse = ",reponse)
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_delete_user_privileges.set(false);
      },
      (error: any)=>{
        //when error
        console.log("Erreur inconnue! ",error)
        this.loading_delete_user_privileges.set(false);
      })
    }
    openModal_add_user_privileges() {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(AddUserPrivilegesComponent, { ...options, backdrop: 'static' })
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status_code) {
          this.get_user_privileges()
        } else {

        }
      })
    }
    openModal_edit_user_privileges(one_user_privileges: any) {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(EditUserPrivilegesComponent, { ...options, backdrop: 'static', })
      modalRef.componentInstance.user_privileges_to_edit = one_user_privileges;
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status_code) {
          this.get_user_privileges()
        } else {

        }
      })
    }
  }