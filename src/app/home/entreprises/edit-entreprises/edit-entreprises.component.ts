import { Component, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
@Component({
  selector: 'app-edit-entreprises',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule], // Dépendances importées
  templateUrl: './edit-entreprises.component.html',
  styleUrls: ['./edit-entreprises.component.scss']
})
export class EditEntreprisesComponent implements OnInit, OnDestroy {
  reactiveForm_edit_entreprises !: FormGroup;
  submitted=signal(false);
  loading_edit_entreprises=signal(false);
  @Input()
  entreprises_to_edit: any;
  form_details: any = {}
  loading_get_details_edit_entreprises_form =signal(false);
  constructor(private formBuilder: FormBuilder, public api: ApiService, public activeModal: NgbActiveModal) { 
      
  }
  ngOnInit(): void {
      console.groupCollapsed("EditEntreprisesComponent");
      this.get_details_edit_entreprises_form()
      this.update_form(this.entreprises_to_edit)
  }
  ngOnDestroy(): void {
    console.groupEnd();
  }
  // mise à jour du formulaire
  update_form(entreprises_to_edit:any) {
      this.reactiveForm_edit_entreprises = this.formBuilder.group({
          nom : [entreprises_to_edit.nom, Validators.required],
adresse : [entreprises_to_edit.adresse, Validators.required],
telephone : [entreprises_to_edit.telephone, Validators.required]
      });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_edit_entreprises .controls; }
  // validation du formulaire
  onSubmit_edit_entreprises() {
      this.submitted.set(true);
      console.log(this.reactiveForm_edit_entreprises.value)
      // stop here if form is invalid
      if (this.reactiveForm_edit_entreprises.invalid) {
          return;
      }
      var entreprises = this.reactiveForm_edit_entreprises.value
      this.edit_entreprises(entreprises)
  }
  // vider le formulaire
  onReset_edit_entreprises() {
      this.submitted.set(false);
      this.reactiveForm_edit_entreprises.reset();
  }
  edit_entreprises(entreprises: any) {
        this.loading_edit_entreprises.set(true);
        this.api.taf_put("entreprises/"+this.entreprises_to_edit.id, entreprises, (reponse: any) => {
            if (reponse.status_code) {
                this.activeModal.close(reponse)
                console.log("Opération effectuée avec succés sur la table entreprises. Réponse= ", reponse);
                //this.onReset_edit_entreprises()
                this.api.Swal_success("Opération éffectuée avec succés")
            } else {
                console.log("L'opération sur la table entreprises a échoué. Réponse= ", reponse);
                this.api.Swal_error("L'opération a echoué")
            }
            this.loading_edit_entreprises.set(false);
        }, (error: any) => {
            this.loading_edit_entreprises.set(false);
        })
    }
    get_details_edit_entreprises_form() {
        this.loading_get_details_edit_entreprises_form.set(true);
        this.api.taf_get("entreprises/getformdetails", (reponse: any) => {
          if (reponse.status_code) {
            this.form_details = reponse.data
            console.log("Opération effectuée avec succés sur la table entreprises. Réponse= ", reponse);
          } else {
            console.log("L'opération sur la table entreprises a échoué. Réponse= ", reponse);
            this.api.Swal_error("L'opération a echoué")
          }
          this.loading_get_details_edit_entreprises_form.set(false);
        }, (error: any) => {
        this.loading_get_details_edit_entreprises_form.set(false);
      })
    }
}