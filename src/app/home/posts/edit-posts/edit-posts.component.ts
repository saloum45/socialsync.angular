import { Component, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
@Component({
  selector: 'app-edit-posts',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './edit-posts.component.html',
  styleUrls: ['./edit-posts.component.scss']
})
export class EditPostsComponent implements OnInit, OnDestroy {
  reactiveForm_edit_posts !: FormGroup;
  submitted=signal(false);
  loading_edit_posts=signal(false);
  @Input()
  posts_to_edit: any;
  form_details: any = {}
  loading_get_details_edit_posts_form =signal(false);
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) { 
      
  }
  ngOnInit(): void {
      console.groupCollapsed("EditPostsComponent");
      this.get_details_edit_posts_form()
      this.update_form(this.posts_to_edit)
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  // mise à jour du formulaire
  update_form(posts_to_edit:any) {
      this.reactiveForm_edit_posts = this.formBuilder.group({
          id_entreprise : [posts_to_edit.id_entreprise, Validators.required],
id_user : [posts_to_edit.id_user, Validators.required],
contenu : [posts_to_edit.contenu, Validators.required],
scheduled_at : [posts_to_edit.scheduled_at, Validators.required],
status : [posts_to_edit.status, Validators.required],
media_url : [posts_to_edit.media_url, Validators.required],
media : [posts_to_edit.media, Validators.required]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_edit_posts .controls; }
  // validation du formulaire
  onSubmit_edit_posts() {
      this.submitted.set(true);
      console.log(this.reactiveForm_edit_posts.value)
      // stop here if form is invalid
      if (this.reactiveForm_edit_posts.invalid) {
          return;
      }
      var posts = this.reactiveForm_edit_posts.value
      this.edit_posts(posts)
  }
  // vider le formulaire
  onReset_edit_posts() {
      this.submitted.set(false);
      this.reactiveForm_edit_posts.reset();
  }
  edit_posts(posts: any) {
        this.loading_edit_posts.set(true);
        this.api.taf_put("posts/"+this.posts_to_edit.id, posts, (reponse: any) => {
            if (reponse.status_code) {
                this.activeModal.close(reponse)
                console.log("Opération effectuée avec succés sur la table posts. Réponse= ", reponse);
                //this.onReset_edit_posts()
                this.api.Swal_success("Opération éffectuée avec succés")
            } else {
                console.log("L'opération sur la table posts a échoué. Réponse= ", reponse);
                this.api.Swal_error("L'opération a echoué")
            }
            this.loading_edit_posts.set(false);
        }, (error: any) => {
            this.loading_edit_posts.set(false);
        })
    }
    get_details_edit_posts_form() {
        this.loading_get_details_edit_posts_form.set(true);
        this.api.taf_get("posts/getformdetails", (reponse: any) => {
          if (reponse.status_code) {
            this.form_details = reponse.data
            console.log("Opération effectuée avec succés sur la table posts. Réponse= ", reponse);
          } else {
            console.log("L'opération sur la table posts a échoué. Réponse= ", reponse);
            this.api.Swal_error("L'opération a echoué")
          }
          this.loading_get_details_edit_posts_form.set(false);
        }, (error: any) => {
        this.loading_get_details_edit_posts_form.set(false);
      })
    }
}