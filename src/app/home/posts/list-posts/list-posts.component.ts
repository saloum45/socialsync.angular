import { Component, OnDestroy, OnInit ,signal } from '@angular/core';
  import { ApiService } from '../../../service/api/api.service';
  import { AddPostsComponent } from '../add-posts/add-posts.component';
  import { EditPostsComponent } from '../edit-posts/edit-posts.component';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  import { NgSelectModule } from '@ng-select/ng-select';
  import { CommonModule } from '@angular/common';
  import { FormsModule } from '@angular/forms';
  @Component({
    selector: 'app-list-posts',
    standalone: true, // Composant autonome
    imports: [CommonModule,NgSelectModule,FormsModule], // Dépendances importées
    templateUrl: './list-posts.component.html',
    styleUrls: ['./list-posts.component.scss']
  })
  export class ListPostsComponent implements OnInit, OnDestroy{
    loading_get_posts=signal(false);
    loading_delete_posts=signal(false);
    posts: any[] = []
    list: any[] = []
    filter: any = {
      text: [],
    };
    constructor(public api: ApiService,private modalService: NgbModal) {
  
    }
    ngOnInit(): void {
      console.groupCollapsed("ListPostsComponent");
      this.get_posts()
    }
    ngOnDestroy(): void {
      console.groupEnd();
    }
    get_posts() {
      this.loading_get_posts.set(true);
      this.api.taf_get("posts", (reponse: any) => {
        if (reponse.status_code) {
          this.posts = reponse.data
          this.list= reponse.data
          console.log("Opération effectuée avec succés sur la table posts. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table posts a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_posts.set(false);
      }, (error: any) => {
        this.loading_get_posts.set(false);
      })
    }
    filter_change(event?: any) {
      this.list = this.posts.filter((one: any) => {
        let search = !event?.term || JSON.stringify(one).toLowerCase().replace(/s/g, '')
          .includes(event?.term?.toLowerCase().replace(/s/g, ''))
        return search// && text
      })
    }
    delete_posts (posts : any){
      this.loading_delete_posts.set(true);
      this.api.taf_post("posts/delete", posts,(reponse: any)=>{
        //when success
        if(reponse.status_code){
          console.log("Opération effectuée avec succés sur la table posts . Réponse = ",reponse)
          this.get_posts()
          this.api.Swal_success("Opération éffectuée avec succés")
        }else{
          console.log("L'opération sur la table posts  a échoué. Réponse = ",reponse)
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_delete_posts.set(false);
      },
      (error: any)=>{
        //when error
        console.log("Erreur inconnue! ",error)
        this.loading_delete_posts.set(false);
      })
    }
    openModal_add_posts() {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(AddPostsComponent, { ...options, backdrop: 'static' })
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status_code) {
          this.get_posts()
        } else {

        }
      })
    }
    openModal_edit_posts(one_posts: any) {
      let options: any = {
        centered: true,
        scrollable: true,
        size: "lg"//'sm' | 'lg' | 'xl' | string
      }
      const modalRef = this.modalService.open(EditPostsComponent, { ...options, backdrop: 'static', })
      modalRef.componentInstance.posts_to_edit = one_posts;
      modalRef.result.then((result: any) => {
        console.log('Modal closed with:', result);
        if (result?.status_code) {
          this.get_posts()
        } else {

        }
      })
    }
  }