import { Component, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
@Component({
  selector: 'app-edit-users',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './edit-users.component.html',
  styleUrls: ['./edit-users.component.scss']
})
export class EditUsersComponent implements OnInit, OnDestroy {
  reactiveForm_edit_users !: FormGroup;
  submitted=signal(false);
  loading_edit_users=signal(false);
  @Input()
  users_to_edit: any;
  form_details: any = {}
  loading_get_details_edit_users_form =signal(false);
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) { 
      
  }
  ngOnInit(): void {
      console.groupCollapsed("EditUsersComponent");
      this.get_details_edit_users_form()
      this.update_form(this.users_to_edit)
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  // mise à jour du formulaire
  update_form(users_to_edit:any) {
      this.reactiveForm_edit_users = this.formBuilder.group({
          prenom : [users_to_edit.prenom, Validators.required],
nom : [users_to_edit.nom, Validators.required],
adresse : [users_to_edit.adresse, Validators.required],
telephone : [users_to_edit.telephone, Validators.required],
email : [users_to_edit.email, Validators.required],
password : [users_to_edit.password, Validators.required]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_edit_users .controls; }
  // validation du formulaire
  onSubmit_edit_users() {
      this.submitted.set(true);
      console.log(this.reactiveForm_edit_users.value)
      // stop here if form is invalid
      if (this.reactiveForm_edit_users.invalid) {
          return;
      }
      var users = this.reactiveForm_edit_users.value
      this.edit_users(users)
  }
  // vider le formulaire
  onReset_edit_users() {
      this.submitted.set(false);
      this.reactiveForm_edit_users.reset();
  }
  edit_users(users: any) {
        this.loading_edit_users.set(true);
        this.api.taf_put("users/"+this.users_to_edit.id, users, (reponse: any) => {
            if (reponse.status_code) {
                this.activeModal.close(reponse)
                console.log("Opération effectuée avec succés sur la table users. Réponse= ", reponse);
                //this.onReset_edit_users()
                this.api.Swal_success("Opération éffectuée avec succés")
            } else {
                console.log("L'opération sur la table users a échoué. Réponse= ", reponse);
                this.api.Swal_error("L'opération a echoué")
            }
            this.loading_edit_users.set(false);
        }, (error: any) => {
            this.loading_edit_users.set(false);
        })
    }
    get_details_edit_users_form() {
        this.loading_get_details_edit_users_form.set(true);
        this.api.taf_get("users/getformdetails", (reponse: any) => {
          if (reponse.status_code) {
            this.form_details = reponse.data
            console.log("Opération effectuée avec succés sur la table users. Réponse= ", reponse);
          } else {
            console.log("L'opération sur la table users a échoué. Réponse= ", reponse);
            this.api.Swal_error("L'opération a echoué")
          }
          this.loading_get_details_edit_users_form.set(false);
        }, (error: any) => {
        this.loading_get_details_edit_users_form.set(false);
      })
    }
}