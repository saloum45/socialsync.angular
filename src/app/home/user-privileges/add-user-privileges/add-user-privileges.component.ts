import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
@Component({
  selector: 'app-add-user-privileges',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './add-user-privileges.component.html',
  styleUrls: ['./add-user-privileges.component.scss']
})
export class AddUserPrivilegesComponent implements OnInit, OnDestroy {
  reactiveForm_add_user_privileges !: FormGroup;
  submitted=signal(false);
  loading_add_user_privileges =signal(false);
  form_details: any = {}
  loading_get_details_add_user_privileges_form = signal(false);
  constructor(private formBuilder: FormBuilder,public api:ApiService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
      console.groupCollapsed("AddUserPrivilegesComponent");
      this.get_details_add_user_privileges_form()
      this.init_form()
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  init_form() {
      this.reactiveForm_add_user_privileges  = this.formBuilder.group({
          id_user: ["", Validators.required],
id_privilege: ["", Validators.required],
id_entreprise: ["", Validators.required]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_add_user_privileges .controls; }
  // validation du formulaire
  onSubmit_add_user_privileges () {
      this.submitted.set(true);
      console.log(this.reactiveForm_add_user_privileges .value)
      // stop here if form is invalid
      if (this.reactiveForm_add_user_privileges .invalid) {
          return;
      }
      var user_privileges =this.reactiveForm_add_user_privileges .value
      this.add_user_privileges (user_privileges )
  }
  // vider le formulaire
  onReset_add_user_privileges () {
      this.submitted.set(false);
      this.reactiveForm_add_user_privileges .reset();
  }
 add_user_privileges(user_privileges: any) {
      this.loading_add_user_privileges.set(true);
      this.api.taf_post("user_privileges", user_privileges, (reponse: any) => {
      this.loading_add_user_privileges.set(false);
      if (reponse.status_code) {
          console.log("Opération effectuée avec succés sur la table user_privileges. Réponse= ", reponse);
          this.onReset_add_user_privileges()
          this.api.Swal_success("Opération éffectuée avec succés")
          this.activeModal.close(reponse)
      } else {
          console.log("L'opération sur la table user_privileges a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
      }
    }, (error: any) => {
        this.loading_add_user_privileges.set(false);
    })
  }
  
  get_details_add_user_privileges_form() {
      this.loading_get_details_add_user_privileges_form.set(true);
      this.api.taf_get("user_privileges/getformdetails", (reponse: any) => {
        if (reponse.status_code) {
          this.form_details = reponse.data
          console.log("Opération effectuée avec succés sur la table user_privileges. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table user_privileges a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_details_add_user_privileges_form.set(false);;
      }, (error: any) => {
      this.loading_get_details_add_user_privileges_form.set(false);;
    })
  }
}
