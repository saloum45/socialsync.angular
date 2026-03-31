import { Component, OnDestroy, OnInit ,signal } from '@angular/core';
  import { ApiService } from '../../../service/api/api.service';
  import { AddUsersComponent } from '../add-users/add-users.component';
  import { EditUsersComponent } from '../edit-users/edit-users.component';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  import { NgSelectModule } from '@ng-select/ng-select';
  import { CommonModule } from '@angular/common';
  import { FormsModule } from '@angular/forms';
  @Component({
    selector: 'app-list-users',
    standalone: true, // Composant autonome
    imports: [CommonModule,NgSelectModule,FormsModule], // Dépendances importées
    templateUrl: './list-users.component.html',
    styleUrls: ['./list-users.component.scss']
  })
  export class ListUsersComponent implements OnInit, OnDestroy{
    loading_get_users=signal(false);
    loading_delete_users=signal(false);
    users: any[] = []
    list: any[] = []
    filter: any = {
      text: [],
    };
    constructor(public api: ApiService,private modalService: NgbModal) {
  
    }
    ngOnInit(): void {
      console.groupCollapsed("ListUsersComponent");
      this.get_users()
    }
    ngOnDestroy(): void {
      console.groupEnd();
    }
    get_users() {
      this.loading_get_users.set(true);
      this.api.taf_get("users", (reponse: any) => {
        if (reponse.status_code) {
          this.users = reponse.data
          this.list= reponse.data
          console.log("Opération effectuée avec succés sur la table users. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table users a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_users.set(false);
      }, (error: any) => {
        this.loading_get_users.set(false);
      })
    }
    filter_change(event?: any) {
      this.list = this.users.filter((one: any) => {
        let search = !event?.term || JSON.stringify(one).toLowerCase().replace(/s/g, '')
          .includes(event?.term?.toLowerCase().replace(/s/g, ''))
        return search// && text
      })
    }
    delete_users (users : any){
      this.loading_delete_users.set(true);
      this.api.taf_post("users/delete", users,(reponse: any)=>{
        //when success
        if(reponse.status_code){
          console.log("Opération effectuée avec succés sur la table users . Réponse = ",reponse)
          this.get_users()
          this.api.Swal_success("Opération éffectuée avec succés")
        }else{
          console.log("L'opération sur la table users  a échoué. Réponse = ",reponse)
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_delete_users.set(false);
      },
      (error: any)=>{
        //when error
        console.log("Erreur inconnue! ",error)
        this.loading_delete_users.set(false);
      })
    }
    openModal_add_users() {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(AddUsersComponent, { ...options, backdrop: 'static' })
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status_code) {
          this.get_users()
        } else {

        }
      })
    }
    openModal_edit_users(one_users: any) {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(EditUsersComponent, { ...options, backdrop: 'static', })
      modalRef.componentInstance.users_to_edit = one_users;
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status_code) {
          this.get_users()
        } else {

        }
      })
    }
  }