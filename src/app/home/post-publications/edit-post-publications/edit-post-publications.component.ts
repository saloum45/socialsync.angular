import { Component, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
@Component({
  selector: 'app-edit-post-publications',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './edit-post-publications.component.html',
  styleUrls: ['./edit-post-publications.component.scss']
})
export class EditPostPublicationsComponent implements OnInit, OnDestroy {
  reactiveForm_edit_post_publications !: FormGroup;
  submitted=signal(false);
  loading_edit_post_publications=signal(false);
  @Input()
  post_publications_to_edit: any;
  form_details: any = {}
  loading_get_details_edit_post_publications_form =signal(false);
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) { 
      
  }
  ngOnInit(): void {
      console.groupCollapsed("EditPostPublicationsComponent");
      this.get_details_edit_post_publications_form()
      this.update_form(this.post_publications_to_edit)
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  // mise à jour du formulaire
  update_form(post_publications_to_edit:any) {
      this.reactiveForm_edit_post_publications = this.formBuilder.group({
          id_entreprise : [post_publications_to_edit.id_entreprise, Validators.required],
id_user : [post_publications_to_edit.id_user, Validators.required],
post_id : [post_publications_to_edit.post_id, Validators.required],
id_social_account : [post_publications_to_edit.id_social_account, Validators.required],
platform_post_id : [post_publications_to_edit.platform_post_id, Validators.required],
status : [post_publications_to_edit.status, Validators.required],
published_at : [post_publications_to_edit.published_at, Validators.required]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_edit_post_publications .controls; }
  // validation du formulaire
  onSubmit_edit_post_publications() {
      this.submitted.set(true);
      console.log(this.reactiveForm_edit_post_publications.value)
      // stop here if form is invalid
      if (this.reactiveForm_edit_post_publications.invalid) {
          return;
      }
      var post_publications = this.reactiveForm_edit_post_publications.value
      this.edit_post_publications(post_publications)
  }
  // vider le formulaire
  onReset_edit_post_publications() {
      this.submitted.set(false);
      this.reactiveForm_edit_post_publications.reset();
  }
  edit_post_publications(post_publications: any) {
        this.loading_edit_post_publications.set(true);
        this.api.taf_put("post_publications/"+this.post_publications_to_edit.id, post_publications, (reponse: any) => {
            if (reponse.status_code) {
                this.activeModal.close(reponse)
                console.log("Opération effectuée avec succés sur la table post_publications. Réponse= ", reponse);
                //this.onReset_edit_post_publications()
                this.api.Swal_success("Opération éffectuée avec succés")
            } else {
                console.log("L'opération sur la table post_publications a échoué. Réponse= ", reponse);
                this.api.Swal_error("L'opération a echoué")
            }
            this.loading_edit_post_publications.set(false);
        }, (error: any) => {
            this.loading_edit_post_publications.set(false);
        })
    }
    get_details_edit_post_publications_form() {
        this.loading_get_details_edit_post_publications_form.set(true);
        this.api.taf_get("post_publications/getformdetails", (reponse: any) => {
          if (reponse.status_code) {
            this.form_details = reponse.data
            console.log("Opération effectuée avec succés sur la table post_publications. Réponse= ", reponse);
          } else {
            console.log("L'opération sur la table post_publications a échoué. Réponse= ", reponse);
            this.api.Swal_error("L'opération a echoué")
          }
          this.loading_get_details_edit_post_publications_form.set(false);
        }, (error: any) => {
        this.loading_get_details_edit_post_publications_form.set(false);
      })
    }
}