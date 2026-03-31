import { Component, OnDestroy, OnInit ,signal } from '@angular/core';
  import { ApiService } from '../../../service/api/api.service';
  import { AddPrivilegesComponent } from '../add-privileges/add-privileges.component';
  import { EditPrivilegesComponent } from '../edit-privileges/edit-privileges.component';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  import { NgSelectModule } from '@ng-select/ng-select';
  import { CommonModule } from '@angular/common';
  import { FormsModule } from '@angular/forms';
  @Component({
    selector: 'app-list-privileges',
    standalone: true, // Composant autonome
    imports: [CommonModule,NgSelectModule,FormsModule], // Dépendances importées
    templateUrl: './list-privileges.component.html',
    styleUrls: ['./list-privileges.component.scss']
  })
  export class ListPrivilegesComponent implements OnInit, OnDestroy{
    loading_get_privileges=signal(false);
    loading_delete_privileges=signal(false);
    privileges: any[] = []
    list: any[] = []
    filter: any = {
      text: [],
    };
    constructor(public api: ApiService,private modalService: NgbModal) {
  
    }
    ngOnInit(): void {
      console.groupCollapsed("ListPrivilegesComponent");
      this.get_privileges()
    }
    ngOnDestroy(): void {
      console.groupEnd();
    }
    get_privileges() {
      this.loading_get_privileges.set(true);
      this.api.taf_get("privileges", (reponse: any) => {
        if (reponse.status_code) {
          this.privileges = reponse.data
          this.list= reponse.data
          console.log("Opération effectuée avec succés sur la table privileges. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table privileges a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_privileges.set(false);
      }, (error: any) => {
        this.loading_get_privileges.set(false);
      })
    }
    filter_change(event?: any) {
      this.list = this.privileges.filter((one: any) => {
        let search = !event?.term || JSON.stringify(one).toLowerCase().replace(/s/g, '')
          .includes(event?.term?.toLowerCase().replace(/s/g, ''))
        return search// && text
      })
    }
    delete_privileges (privileges : any){
      this.loading_delete_privileges.set(true);
      this.api.taf_post("privileges/delete", privileges,(reponse: any)=>{
        //when success
        if(reponse.status_code){
          console.log("Opération effectuée avec succés sur la table privileges . Réponse = ",reponse)
          this.get_privileges()
          this.api.Swal_success("Opération éffectuée avec succés")
        }else{
          console.log("L'opération sur la table privileges  a échoué. Réponse = ",reponse)
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_delete_privileges.set(false);
      },
      (error: any)=>{
        //when error
        console.log("Erreur inconnue! ",error)
        this.loading_delete_privileges.set(false);
      })
    }
    openModal_add_privileges() {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(AddPrivilegesComponent, { ...options, backdrop: 'static' })
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status_code) {
          this.get_privileges()
        } else {

        }
      })
    }
    openModal_edit_privileges(one_privileges: any) {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(EditPrivilegesComponent, { ...options, backdrop: 'static', })
      modalRef.componentInstance.privileges_to_edit = one_privileges;
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status_code) {
          this.get_privileges()
        } else {

        }
      })
    }
  }