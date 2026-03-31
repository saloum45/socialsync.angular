import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
@Component({
  selector: 'app-add-type-social-accounts',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './add-type-social-accounts.component.html',
  styleUrls: ['./add-type-social-accounts.component.scss']
})
export class AddTypeSocialAccountsComponent implements OnInit, OnDestroy {
  reactiveForm_add_type_social_accounts !: FormGroup;
  submitted=signal(false);
  loading_add_type_social_accounts =signal(false);
  form_details: any = {}
  loading_get_details_add_type_social_accounts_form = signal(false);
  constructor(private formBuilder: FormBuilder,public api:ApiService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
      console.groupCollapsed("AddTypeSocialAccountsComponent");
      this.get_details_add_type_social_accounts_form()
      this.init_form()
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  init_form() {
      this.reactiveForm_add_type_social_accounts  = this.formBuilder.group({
          libelle: ["", Validators.required],
logo: ["", Validators.required],
lien: ["", Validators.required]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_add_type_social_accounts .controls; }
  // validation du formulaire
  onSubmit_add_type_social_accounts () {
      this.submitted.set(true);
      console.log(this.reactiveForm_add_type_social_accounts .value)
      // stop here if form is invalid
      if (this.reactiveForm_add_type_social_accounts .invalid) {
          return;
      }
      var type_social_accounts =this.reactiveForm_add_type_social_accounts .value
      this.add_type_social_accounts (type_social_accounts )
  }
  // vider le formulaire
  onReset_add_type_social_accounts () {
      this.submitted.set(false);
      this.reactiveForm_add_type_social_accounts .reset();
  }
 add_type_social_accounts(type_social_accounts: any) {
      this.loading_add_type_social_accounts.set(true);
      this.api.taf_post("type_social_accounts", type_social_accounts, (reponse: any) => {
      this.loading_add_type_social_accounts.set(false);
      if (reponse.status_code) {
          console.log("Opération effectuée avec succés sur la table type_social_accounts. Réponse= ", reponse);
          this.onReset_add_type_social_accounts()
          this.api.Swal_success("Opération éffectuée avec succés")
          this.activeModal.close(reponse)
      } else {
          console.log("L'opération sur la table type_social_accounts a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
      }
    }, (error: any) => {
        this.loading_add_type_social_accounts.set(false);
    })
  }
  
  get_details_add_type_social_accounts_form() {
      this.loading_get_details_add_type_social_accounts_form.set(true);
      this.api.taf_get("type_social_accounts/getformdetails", (reponse: any) => {
        if (reponse.status_code) {
          this.form_details = reponse.data
          console.log("Opération effectuée avec succés sur la table type_social_accounts. Réponse= ", reponse);
        } else {
          console.log("L'opération sur la table type_social_accounts a échoué. Réponse= ", reponse);
          this.api.Swal_error("L'opération a echoué")
        }
        this.loading_get_details_add_type_social_accounts_form.set(false);;
      }, (error: any) => {
      this.loading_get_details_add_type_social_accounts_form.set(false);;
    })
  }
}
