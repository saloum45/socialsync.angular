import { Component, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
@Component({
  selector: 'app-edit-privileges',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './edit-privileges.component.html',
  styleUrls: ['./edit-privileges.component.scss']
})
export class EditPrivilegesComponent implements OnInit, OnDestroy {
  reactiveForm_edit_privileges !: FormGroup;
  submitted=signal(false);
  loading_edit_privileges=signal(false);
  @Input()
  privileges_to_edit: any;
  form_details: any = {}
  loading_get_details_edit_privileges_form =signal(false);
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) { 
      
  }
  ngOnInit(): void {
      console.groupCollapsed("EditPrivilegesComponent");
      this.get_details_edit_privileges_form()
      this.update_form(this.privileges_to_edit)
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  // mise à jour du formulaire
  update_form(privileges_to_edit:any) {
      this.reactiveForm_edit_privileges = this.formBuilder.group({
          libelle : [privileges_to_edit.libelle, Validators.required],
description : [privileges_to_edit.description, Validators.required]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_edit_privileges .controls; }
  // validation du formulaire
  onSubmit_edit_privileges() {
      this.submitted.set(true);
      console.log(this.reactiveForm_edit_privileges.value)
      // stop here if form is invalid
      if (this.reactiveForm_edit_privileges.invalid) {
          return;
      }
      var privileges = this.reactiveForm_edit_privileges.value
      this.edit_privileges(privileges)
  }
  // vider le formulaire
  onReset_edit_privileges() {
      this.submitted.set(false);
      this.reactiveForm_edit_privileges.reset();
  }
  edit_privileges(privileges: any) {
        this.loading_edit_privileges.set(true);
        this.api.taf_put("privileges/"+this.privileges_to_edit.id, privileges, (reponse: any) => {
            if (reponse.status_code) {
                this.activeModal.close(reponse)
                console.log("Opération effectuée avec succés sur la table privileges. Réponse= ", reponse);
                //this.onReset_edit_privileges()
                this.api.Swal_success("Opération éffectuée avec succés")
            } else {
                console.log("L'opération sur la table privileges a échoué. Réponse= ", reponse);
                this.api.Swal_error("L'opération a echoué")
            }
            this.loading_edit_privileges.set(false);
        }, (error: any) => {
            this.loading_edit_privileges.set(false);
        })
    }
    get_details_edit_privileges_form() {
        this.loading_get_details_edit_privileges_form.set(true);
        this.api.taf_get("privileges/getformdetails", (reponse: any) => {
          if (reponse.status_code) {
            this.form_details = reponse.data
            console.log("Opération effectuée avec succés sur la table privileges. Réponse= ", reponse);
          } else {
            console.log("L'opération sur la table privileges a échoué. Réponse= ", reponse);
            this.api.Swal_error("L'opération a echoué")
          }
          this.loading_get_details_edit_privileges_form.set(false);
        }, (error: any) => {
        this.loading_get_details_edit_privileges_form.set(false);
      })
    }
}