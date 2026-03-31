import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
@Component({
  selector: 'app-add-post-publications',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './add-post-publications.component.html',
  styleUrls: ['./add-post-publications.component.scss']
})
export class AddPostPublicationsComponent implements OnInit, OnDestroy {
  reactiveForm_add_post_publications !: FormGroup;
  submitted=signal(false);
  loading_add_post_publications =signal(false);
  form_details: any = {}
  loading_get_details_add_post_publications_form = signal(false);
  constructor(private formBuilder: FormBuilder,public api:ApiService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
      console.groupCollapsed("AddPostPublicationsComponent");
      this.get_details_add_post_publications_form()
      this.init_form()
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  init_form() {
      this.reactiveForm_add_post_publications  = this.formBuilder.group({
          id_entreprise: ["", Validators.required],
id_user: ["", Validators.required],
post_id: ["", Validators.required],
id_social_account: ["", Validators.required],
platform_post_id: ["", Validators.required],
status: ["", Validators.required],
published_at: ["", Validators.required]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_add_post_publications .controls; }
  // validation du formulaire
  onSubmit_add_post_publications () {
      this.submitted.set(true);
      console.log(this.reactiveForm_add_post_publications .value)
      // stop here if form is invalid
      if (this.reactiveForm_add_post_publications .invalid) {
          return;
      }
      var post_publications =this.reactiveForm_add_post_publications .value
      this.add_post_publications (post_publications )
  }
  // vider le formulaire
  onReset_add_post_publications () {
      this.submitted.set(false);
      this.reactiveForm_add_post_publications .reset();
  }
 add_post_publications(post_publications: any) {
      this.loading_add_post_publications.set(true);
      this.api.taf_post("post_publications", post_publications, (reponse: any) => {
      this.loading_add_post_publications.set(false);
      if (reponse.status_code) {
          console.log("Opération effectuée avec succés sur la table post_publications. Réponse= ", reponse);
          this.onReset_add_post_publications()
          this.api.Swal_success("Opération éffectuée avec succés")
          this.activeModal.close(reponse)
      } else {
          console.log("L'opération sur la table post_publications a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
      }
    }, (error: any) => {
        this.loading_add_post_publications.set(false);
    })
  }
  
  get_details_add_post_publications_form() {
      this.loading_get_details_add_post_publications_form.set(true);
      this.api.taf_get("post_publications/getformdetails", (reponse: any) => {
        if (reponse.status_code) {
          this.form_details = reponse.data
          console.log("Opération effectuée avec succés sur la table post_publications. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table post_publications a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_details_add_post_publications_form.set(false);;
      }, (error: any) => {
      this.loading_get_details_add_post_publications_form.set(false);;
    })
  }
}
