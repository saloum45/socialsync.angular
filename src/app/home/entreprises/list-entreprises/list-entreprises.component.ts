import { Component, OnDestroy, OnInit ,signal } from '@angular/core';
  import { ApiService } from '../../../service/api/api.service';
  import { AddEntreprisesComponent } from '../add-entreprises/add-entreprises.component';
  import { EditEntreprisesComponent } from '../edit-entreprises/edit-entreprises.component';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  import { NgSelectModule } from '@ng-select/ng-select';
  import { CommonModule } from '@angular/common';
  import { FormsModule } from '@angular/forms';
  @Component({
    selector: 'app-list-entreprises',
    standalone: true, // Composant autonome
    imports: [CommonModule,NgSelectModule,FormsModule], // Dépendances importées
    templateUrl: './list-entreprises.component.html',
    styleUrls: ['./list-entreprises.component.scss']
  })
  export class ListEntreprisesComponent implements OnInit, OnDestroy{
    loading_get_entreprises=signal(false);
    loading_delete_entreprises=signal(false);
    entreprises: any[] = []
    list: any[] = []
    filter: any = {
      text: [],
    };
    constructor(public api: ApiService,private modalService: NgbModal) {
  
    }
    ngOnInit(): void {
      console.groupCollapsed("ListEntreprisesComponent");
      this.get_entreprises()
    }
    ngOnDestroy(): void {
      console.groupEnd();
    }
    get_entreprises() {
      this.loading_get_entreprises.set(true);
      this.api.taf_get("entreprises", (reponse: any) => {
        if (reponse.status_code) {
          this.entreprises = reponse.data
          this.list= reponse.data
          console.log("Opération effectuée avec succés sur la table entreprises. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table entreprises a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_entreprises.set(false);
      }, (error: any) => {
        this.loading_get_entreprises.set(false);
      })
    }
    filter_change(event?: any) {
      this.list = this.entreprises.filter((one: any) => {
        let search = !event?.term || JSON.stringify(one).toLowerCase().replace(/s/g, '')
          .includes(event?.term?.toLowerCase().replace(/s/g, ''))
        return search// && text
      })
    }
    delete_entreprises (entreprises : any){
      this.loading_delete_entreprises.set(true);
      this.api.taf_post("entreprises/delete", entreprises,(reponse: any)=>{
        //when success
        if(reponse.status_code){
          console.log("Opération effectuée avec succés sur la table entreprises . Réponse = ",reponse)
          this.get_entreprises()
          this.api.Swal_success("Opération éffectuée avec succés")
        }else{
          console.log("L'opération sur la table entreprises  a échoué. Réponse = ",reponse)
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_delete_entreprises.set(false);
      },
      (error: any)=>{
        //when error
        console.log("Erreur inconnue! ",error)
        this.loading_delete_entreprises.set(false);
      })
    }
    openModal_add_entreprises() {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(AddEntreprisesComponent, { ...options, backdrop: 'static' })
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status_code) {
          this.get_entreprises()
        } else {

        }
      })
    }
    openModal_edit_entreprises(one_entreprises: any) {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(EditEntreprisesComponent, { ...options, backdrop: 'static', })
      modalRef.componentInstance.entreprises_to_edit = one_entreprises;
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status_code) {
          this.get_entreprises()
        } else {

        }
      })
    }
  }