import { Component ,OnDestroy, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators,ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../service/api/api.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-list-login',
  standalone: true, // Composant autonome
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './list-login.component.html',
  styleUrls: ['./list-login.component.scss']
})
export class ListLoginComponent implements OnInit, OnDestroy {
   reactiveForm_login_login !: FormGroup;
  submitted: boolean = false
  loading_login_login: boolean = false
  showPassword: boolean = false;
  constructor(private formBuilder: FormBuilder, public api: ApiService, private router: Router) { }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
   this.init_form();
  }
  init_form() {
    this.reactiveForm_login_login = this.formBuilder.group({
      email: ["", Validators.required],
      password: ["", Validators.required]
    });
  }

  // acces facile au champs de votre formulaire
  get f(): any { return this.reactiveForm_login_login.controls; }
  // validation du formulaire
  onSubmit_login_login() {
    this.submitted = true;
    console.log(this.reactiveForm_login_login.value)
    // stop here if form is invalid
    if (this.reactiveForm_login_login.invalid) {
      return;
    }
    var login = this.reactiveForm_login_login.value
    this.login_login(login)
  }
  // vider le formulaire
  onReset_login_login() {
    this.submitted = false;
    this.reactiveForm_login_login.reset();
  }
  login_login(login: any) {
    this.loading_login_login = true;
    this.api.taf_post("login", login, async (reponse: any) => {
      if (reponse.status_code) {
        console.log("Opération effectuée avec succés sur la table login. Réponse= ", reponse);
        this.onReset_login_login()
        await this.api.save_on_local_storage("token", reponse)

        await this.api.update_data_from_token();
        this.api.Swal_success("Opération éffectuée avec succés")
        // this.router.navigate(['/home'])
        // 👉 Déclencher animation
        const page = document.querySelector('.login-page');
        page?.classList.add('zooming');

        // 👉 Attendre fin anim puis naviguer
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1000); // doit correspondre à la durée CSS
      } else {
        console.log("L'opération sur la table login a échoué. Réponse= ", reponse);
        this.api.Swal_error("L'opération a echoué")
      }
      this.loading_login_login = false;
    }, (error: any) => {
      this.loading_login_login = false;
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
