import { Component, OnDestroy, OnInit ,signal } from '@angular/core';
  import { ApiService } from '../../../service/api/api.service';
  import { AddPostPublicationsComponent } from '../add-post-publications/add-post-publications.component';
  import { EditPostPublicationsComponent } from '../edit-post-publications/edit-post-publications.component';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  import { NgSelectModule } from '@ng-select/ng-select';
  import { CommonModule } from '@angular/common';
  import { FormsModule } from '@angular/forms';
  @Component({
    selector: 'app-list-post-publications',
    standalone: true, // Composant autonome
    imports: [CommonModule,NgSelectModule,FormsModule], // Dépendances importées
    templateUrl: './list-post-publications.component.html',
    styleUrls: ['./list-post-publications.component.scss']
  })
  export class ListPostPublicationsComponent implements OnInit, OnDestroy{
    loading_get_post_publications=signal(false);
    loading_delete_post_publications=signal(false);
    post_publications: any[] = []
    list: any[] = []
    filter: any = {
      text: [],
    };
    constructor(public api: ApiService,private modalService: NgbModal) {
  
    }
    ngOnInit(): void {
      console.groupCollapsed("ListPostPublicationsComponent");
      this.get_post_publications()
    }
    ngOnDestroy(): void {
      console.groupEnd();
    }
    get_post_publications() {
      this.loading_get_post_publications.set(true);
      this.api.taf_get("post_publications", (reponse: any) => {
        if (reponse.status_code) {
          this.post_publications = reponse.data
          this.list= reponse.data
          console.log("Opération effectuée avec succés sur la table post_publications. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table post_publications a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_post_publications.set(false);
      }, (error: any) => {
        this.loading_get_post_publications.set(false);
      })
    }
    filter_change(event?: any) {
      this.list = this.post_publications.filter((one: any) => {
        let search = !event?.term || JSON.stringify(one).toLowerCase().replace(/s/g, '')
          .includes(event?.term?.toLowerCase().replace(/s/g, ''))
        return search// && text
      })
    }
    delete_post_publications (post_publications : any){
      this.loading_delete_post_publications.set(true);
      this.api.taf_post("post_publications/delete", post_publications,(reponse: any)=>{
        //when success
        if(reponse.status_code){
          console.log("Opération effectuée avec succés sur la table post_publications . Réponse = ",reponse)
          this.get_post_publications()
          this.api.Swal_success("Opération éffectuée avec succés")
        }else{
          console.log("L'opération sur la table post_publications  a échoué. Réponse = ",reponse)
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_delete_post_publications.set(false);
      },
      (error: any)=>{
        //when error
        console.log("Erreur inconnue! ",error)
        this.loading_delete_post_publications.set(false);
      })
    }
    openModal_add_post_publications() {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(AddPostPublicationsComponent, { ...options, backdrop: 'static' })
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status_code) {
          this.get_post_publications()
        } else {

        }
      })
    }
    openModal_edit_post_publications(one_post_publications: any) {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(EditPostPublicationsComponent, { ...options, backdrop: 'static', })
      modalRef.componentInstance.post_publications_to_edit = one_post_publications;
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status_code) {
          this.get_post_publications()
        } else {

        }
      })
    }
  }