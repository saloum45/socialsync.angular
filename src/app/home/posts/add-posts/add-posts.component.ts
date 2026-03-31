import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
@Component({
  selector: 'app-add-posts',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './add-posts.component.html',
  styleUrls: ['./add-posts.component.scss']
})
export class AddPostsComponent implements OnInit, OnDestroy {
  reactiveForm_add_posts !: FormGroup;
  submitted=signal(false);
  loading_add_posts =signal(false);
  form_details: any = {}
  loading_get_details_add_posts_form = signal(false);
  constructor(private formBuilder: FormBuilder,public api:ApiService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
      console.groupCollapsed("AddPostsComponent");
      this.get_details_add_posts_form()
      this.init_form()
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  init_form() {
      this.reactiveForm_add_posts  = this.formBuilder.group({
          id_entreprise: ["", Validators.required],
id_user: ["", Validators.required],
contenu: ["", Validators.required],
scheduled_at: ["", Validators.required],
status: ["", Validators.required],
media_url: ["", Validators.required],
media: ["", Validators.required]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_add_posts .controls; }
  // validation du formulaire
  onSubmit_add_posts () {
      this.submitted.set(true);
      console.log(this.reactiveForm_add_posts .value)
      // stop here if form is invalid
      if (this.reactiveForm_add_posts .invalid) {
          return;
      }
      var posts =this.reactiveForm_add_posts .value
      this.add_posts (posts )
  }
  // vider le formulaire
  onReset_add_posts () {
      this.submitted.set(false);
      this.reactiveForm_add_posts .reset();
  }
 add_posts(posts: any) {
      this.loading_add_posts.set(true);
      this.api.taf_post("posts", posts, (reponse: any) => {
      this.loading_add_posts.set(false);
      if (reponse.status_code) {
          console.log("Opération effectuée avec succés sur la table posts. Réponse= ", reponse);
          this.onReset_add_posts()
          this.api.Swal_success("Opération éffectuée avec succés")
          this.activeModal.close(reponse)
      } else {
          console.log("L'opération sur la table posts a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
      }
    }, (error: any) => {
        this.loading_add_posts.set(false);
    })
  }
  
  get_details_add_posts_form() {
      this.loading_get_details_add_posts_form.set(true);
      this.api.taf_get("posts/getformdetails", (reponse: any) => {
        if (reponse.status_code) {
          this.form_details = reponse.data
          console.log("Opération effectuée avec succés sur la table posts. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table posts a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_details_add_posts_form.set(false);;
      }, (error: any) => {
      this.loading_get_details_add_posts_form.set(false);;
    })
  }
}
