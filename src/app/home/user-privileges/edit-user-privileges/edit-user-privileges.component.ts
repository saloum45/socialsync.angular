import { Component, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
@Component({
  selector: 'app-edit-user-privileges',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './edit-user-privileges.component.html',
  styleUrls: ['./edit-user-privileges.component.scss']
})
export class EditUserPrivilegesComponent implements OnInit, OnDestroy {
  reactiveForm_edit_user_privileges !: FormGroup;
  submitted=signal(false);
  loading_edit_user_privileges=signal(false);
  @Input()
  user_privileges_to_edit: any;
  form_details: any = {}
  loading_get_details_edit_user_privileges_form =signal(false);
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) { 
      
  }
  ngOnInit(): void {
      console.groupCollapsed("EditUserPrivilegesComponent");
      this.get_details_edit_user_privileges_form()
      this.update_form(this.user_privileges_to_edit)
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  // mise à jour du formulaire
  update_form(user_privileges_to_edit:any) {
      this.reactiveForm_edit_user_privileges = this.formBuilder.group({
          id_user : [user_privileges_to_edit.id_user, Validators.required],
id_privilege : [user_privileges_to_edit.id_privilege, Validators.required],
id_entreprise : [user_privileges_to_edit.id_entreprise, Validators.required]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_edit_user_privileges .controls; }
  // validation du formulaire
  onSubmit_edit_user_privileges() {
      this.submitted.set(true);
      console.log(this.reactiveForm_edit_user_privileges.value)
      // stop here if form is invalid
      if (this.reactiveForm_edit_user_privileges.invalid) {
          return;
      }
      var user_privileges = this.reactiveForm_edit_user_privileges.value
      this.edit_user_privileges(user_privileges)
  }
  // vider le formulaire
  onReset_edit_user_privileges() {
      this.submitted.set(false);
      this.reactiveForm_edit_user_privileges.reset();
  }
  edit_user_privileges(user_privileges: any) {
        this.loading_edit_user_privileges.set(true);
        this.api.taf_put("user_privileges/"+this.user_privileges_to_edit.id, user_privileges, (reponse: any) => {
            if (reponse.status_code) {
                this.activeModal.close(reponse)
                console.log("Opération effectuée avec succés sur la table user_privileges. Réponse= ", reponse);
                //this.onReset_edit_user_privileges()
                this.api.Swal_success("Opération éffectuée avec succés")
            } else {
                console.log("L'opération sur la table user_privileges a échoué. Réponse= ", reponse);
                this.api.Swal_error("L'opération a echoué")
            }
            this.loading_edit_user_privileges.set(false);
        }, (error: any) => {
            this.loading_edit_user_privileges.set(false);
        })
    }
    get_details_edit_user_privileges_form() {
        this.loading_get_details_edit_user_privileges_form.set(true);
        this.api.taf_get("user_privileges/getformdetails", (reponse: any) => {
          if (reponse.status_code) {
            this.form_details = reponse.data
            console.log("Opération effectuée avec succés sur la table user_privileges. Réponse= ", reponse);
          } else {
            console.log("L'opération sur la table user_privileges a échoué. Réponse= ", reponse);
            this.api.Swal_error("L'opération a echoué")
          }
          this.loading_get_details_edit_user_privileges_form.set(false);
        }, (error: any) => {
        this.loading_get_details_edit_user_privileges_form.set(false);
      })
    }
}