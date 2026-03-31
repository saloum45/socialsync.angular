import { Component, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
@Component({
  selector: 'app-edit-social-accounts',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './edit-social-accounts.component.html',
  styleUrls: ['./edit-social-accounts.component.scss']
})
export class EditSocialAccountsComponent implements OnInit, OnDestroy {
  reactiveForm_edit_social_accounts !: FormGroup;
  submitted=signal(false);
  loading_edit_social_accounts=signal(false);
  @Input()
  social_accounts_to_edit: any;
  form_details: any = {}
  loading_get_details_edit_social_accounts_form =signal(false);
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) { 
      
  }
  ngOnInit(): void {
      console.groupCollapsed("EditSocialAccountsComponent");
      this.get_details_edit_social_accounts_form()
      this.update_form(this.social_accounts_to_edit)
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  // mise à jour du formulaire
  update_form(social_accounts_to_edit:any) {
      this.reactiveForm_edit_social_accounts = this.formBuilder.group({
          id_entreprise : [social_accounts_to_edit.id_entreprise, Validators.required],
id_user : [social_accounts_to_edit.id_user, Validators.required],
id_type_social_account : [social_accounts_to_edit.id_type_social_account, Validators.required],
account_id : [social_accounts_to_edit.account_id, Validators.required],
account_name : [social_accounts_to_edit.account_name, Validators.required],
access_token : [social_accounts_to_edit.access_token, Validators.required],
refresh_token : [social_accounts_to_edit.refresh_token, Validators.required],
expires_at : [social_accounts_to_edit.expires_at, Validators.required]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_edit_social_accounts .controls; }
  // validation du formulaire
  onSubmit_edit_social_accounts() {
      this.submitted.set(true);
      console.log(this.reactiveForm_edit_social_accounts.value)
      // stop here if form is invalid
      if (this.reactiveForm_edit_social_accounts.invalid) {
          return;
      }
      var social_accounts = this.reactiveForm_edit_social_accounts.value
      this.edit_social_accounts(social_accounts)
  }
  // vider le formulaire
  onReset_edit_social_accounts() {
      this.submitted.set(false);
      this.reactiveForm_edit_social_accounts.reset();
  }
  edit_social_accounts(social_accounts: any) {
        this.loading_edit_social_accounts.set(true);
        this.api.taf_put("social_accounts/"+this.social_accounts_to_edit.id, social_accounts, (reponse: any) => {
            if (reponse.status_code) {
                this.activeModal.close(reponse)
                console.log("Opération effectuée avec succés sur la table social_accounts. Réponse= ", reponse);
                //this.onReset_edit_social_accounts()
                this.api.Swal_success("Opération éffectuée avec succés")
            } else {
                console.log("L'opération sur la table social_accounts a échoué. Réponse= ", reponse);
                this.api.Swal_error("L'opération a echoué")
            }
            this.loading_edit_social_accounts.set(false);
        }, (error: any) => {
            this.loading_edit_social_accounts.set(false);
        })
    }
    get_details_edit_social_accounts_form() {
        this.loading_get_details_edit_social_accounts_form.set(true);
        this.api.taf_get("social_accounts/getformdetails", (reponse: any) => {
          if (reponse.status_code) {
            this.form_details = reponse.data
            console.log("Opération effectuée avec succés sur la table social_accounts. Réponse= ", reponse);
          } else {
            console.log("L'opération sur la table social_accounts a échoué. Réponse= ", reponse);
            this.api.Swal_error("L'opération a echoué")
          }
          this.loading_get_details_edit_social_accounts_form.set(false);
        }, (error: any) => {
        this.loading_get_details_edit_social_accounts_form.set(false);
      })
    }
}