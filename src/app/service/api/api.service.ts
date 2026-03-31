import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IdbService } from '../idb/idb.service';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  local_storage_prefixe = "communitymanagerhub.angular";
  taf_base_url = "https://socialsync.chitari.tech/backend/api/";
  // taf_base_url = "http://localhost:8000/api/";
  menu: any = [];
  network: any = {
    token: undefined,
    status: true,
    message: "Aucun probléme détecté",
  }
  token: any = {
    token: null,
    // token_decoded: null,
    user_connected: null,
    // is_expired: null,
    // date_expiration: null
  }

  current_entreprise: any =JSON.parse(localStorage.getItem("current_entreprise")?? '{}');
  id_current_entreprise: any = localStorage.getItem("id_current_entreprise") ?? '{}';
  id_current_privilege: any = localStorage.getItem("id_current_privilege") ?? '{}';
  user_permissions: any = localStorage.getItem("user_permissions") ?? '[]';
  loading_current_entreprise = false;

  constructor(private http: HttpClient, private route: Router, private idb: IdbService,public _location: Location) { }
  // sauvegardes
  async get_from_local_storage(key: string): Promise<any> {
    try {
      let res: any = await this.idb.get_from_indexedDB(key)
      return res
    } catch (error) {
      console.error("erreur de recuperation", error)
      return null
    }
  }
  async save_on_local_storage(key: string, value: any): Promise<void> {
    await this.idb.save_on_indexedDB(key, value);
  }
  async delete_from_local_storage(key: string) {
    await this.idb.delete_from_indexedDB(key);
  }


  async get_token() {
    // //le token n'est pas encore chargé
    // if (this.network.token == undefined) {
    //   this.network.token = await this.get_from_local_storage("token").token
    //   if (this.network.token != undefined && this.network.token != null) {// token existant
    //     this.update_data_from_token()// mise a jour du token
    //   }
    // } else {// token dèja chargé
    //   this.update_data_from_token()// mise a jour du token
    // }
    // console.warn((await this.get_from_local_storage("token")).token)
       if (this.token.token == null) {
      this.update_data_from_token();
    }
    return (await this.get_from_local_storage("token"))?.token
  }
  async get_token_profil() {
    return (await this.get_from_local_storage("token"))?.data
  }
  //les requetes http
    async taf_post(path: string, data_to_send: any, on_success: Function, on_error: Function) {
    let api_url = this.taf_base_url + path;
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + await this.get_token(),
      })
    };
    this.http.post(api_url, data_to_send, httpOptions).subscribe(
      (reponse: any) => {// on success
        on_success(reponse)
      },
      (error: any) => {// on error
        this.on_taf_post_error(error, on_error)
      }
    )
  }
  on_taf_get_error(error: any, on_error: Function) {
    this.network.status = false;
    this.network.message = error
    this.Swal_info("Merci de vérifier votre connexion")
    on_error(error)
  }
  async taf_get(path: string, on_success: Function, on_error: Function) {
    let api_url = this.taf_base_url + path;
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + await this.get_token(),
      })
    };

    this.http.get(api_url, httpOptions).subscribe(
      (reponse: any) => {// on success
        on_success(reponse)
      },
      (error: any) => {// on error
        this.on_taf_get_error(error, on_error)
      }
    )
  }
  async taf_delete(path: string, on_success: Function, on_error: Function) {
    let api_url = this.taf_base_url + path;
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + await this.get_token(),
      })
    };

    this.http.delete(api_url, httpOptions).subscribe(
      (reponse: any) => {// on success
        on_success(reponse)
      },
      (error: any) => {// on error
        this.on_taf_get_error(error, on_error)
      }
    )
  }
  async taf_put(path: string, data_to_send: any, on_success: Function, on_error: Function) {
    let api_url = this.taf_base_url + path;
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + await this.get_token(),
      })
    };
    this.http.put(api_url, data_to_send, httpOptions).subscribe(
      (reponse: any) => {// on success
        on_success(reponse)
      },
      (error: any) => {// on error
        this.on_taf_post_error(error, on_error)
      }
    )
  }
  async taf_post_login(path: string, data_to_send: any, on_success: Function, on_error: Function) {
    let api_url = this.taf_base_url + path;

    this.http.post(api_url, data_to_send).subscribe(
      (reponse: any) => {// on success
        on_success(reponse)
      },
      (error: any) => {// on error
        this.on_taf_post_error(error, on_error)
      }
    )
  }
  on_taf_post_error(error: any, on_error: any) {
    this.network.status = false;
    this.network.message = error
    this.Swal_info("Merci de vérifier votre connexion")
    on_error(error)
  }
  async update_data_from_token() {
    let token_key = (await this.get_from_local_storage("token"))
    // const helper = new JwtHelperService();
    // const decodedToken = helper.decodeToken(token_key);
    // const expirationDate = helper.getTokenExpirationDate(token_key);
    // const isExpired = helper.isTokenExpired(token_key);

    this.token = {
      token: token_key?.token,
      // token_decoded: decodedToken,
      user_connected: token_key?.data,
      // is_expired: isExpired,
      // date_expiration: expirationDate
    }
    if (this.token?.is_expired) {
      this.on_token_expire()
    }
  }
  on_token_expire() {
    this.Swal_info("Votre session s'est expiré! Veuillez vous connecter à nouveau")
    this.delete_from_local_storage("token")
    this.route.navigate(['/public/login'])
  }

  Swal_success(title: any) {
    let succes = Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: title,
      showConfirmButton: false,
      timer: 1000,
      toast: true,
      timerProgressBar: true,
    });
    return succes
  }

  Swal_error(title: any) {
    let succes = Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: title,
      showConfirmButton: false,
      timer: 1500,
      toast: true,
      timerProgressBar: true,
    });
    return succes
  }
  Swal_info(title: any) {
    let succes = Swal.fire({
      position: 'top-end',
      icon: 'info',
      title: title,
      showConfirmButton: false,
      timer: 1500,
      toast: true,
      timerProgressBar: true,
    });
    return succes
  }
  Swal_blue(title: any) {
    let succes = Swal.fire({
      position: 'top-end',
      icon: 'info',
      title: title,
      showConfirmButton: false,
      timer: 1500,
      toast: true,
      timerProgressBar: true,
    });
    return succes
  }
  is_already_selected(id: any, form: any, condition: string) {//la fonction désactive les options déja sélectionné dans le select
    let is_in=form.filter((one_detail: any) => one_detail[condition] == id)[0]?.[condition];
    return is_in;
  }

  format_date(date_string: string) {
    return {
      full: moment(date_string).locale("fr").format("dddd Do MMMM YYYY"),// 27 février 2023
      jma: moment(date_string).locale("fr").format("Do MMMM YYYY"),// jeudi ...
      jma2: moment(date_string).locale("fr").format("DD-MM-YYYY"),// 01-11-2023
      jma3: moment(date_string).locale("fr").format("YYYY-MM-DD"),// 2023-10-21
      jma3_hour: moment(date_string).locale("fr").format("YYYY-MM-DD HH:mm"),// 2023-10-21 14:50
      full_datetime: moment(date_string).locale("fr").format("dddd Do MMMM YYYY à HH:mm"),// 27 février 2023
    }
  }
  format_current_date() {
    return {
      full: moment().locale("fr").format("dddd Do MMMM YYYY"),// 27 février 2023
      jma: moment().locale("fr").format("Do MMMM YYYY"),// jeudi ...
      jma2: moment().locale("fr").format("DD-MM-YYYY"),// 01-11-2023
      jma3: moment().locale("fr").format("YYYY-MM-DD"),// 2023-10-21
      jma3_hour: moment().locale("fr").format("YYYY-MM-DD HH:mm"),// 2023-10-21 14:50
      full_datetime: moment().locale("fr").format("dddd Do MMMM YYYY à HH:mm"),// 27 février 2023
    }
  }

    les_droits: any = {
    // Gestion de la parti commerciale
    "produit.add": [1, 5, 6, 8],
    "produit.edit": [1, 5, 6, 8],
  };

  full_menu: any[] = [
    {
      menu_header: "Projet",
      items: [
        {
          text: "Entreprises",
          path: "/home/entreprises",
          icon: "bi bi-speedometer",
          privileges: [],
          items: [],
          show_on_sidebar: false,
          les_actions: [
            { id: "add_entreprises", description: "Ajouter un entreprises" },
            { id: "edit_entreprises", description: "Modifier un entreprises" },
            { id: "delete_entreprises", description: "Supprimer un entreprises" },
            { id: "liste_entreprises", description: "Lister les entreprises" },
          ]
        }
    ,
        {
          text: "PostPublications",
          path: "/home/post_publications",
          icon: "bi bi-speedometer",
          privileges: [],
          items: [],
          show_on_sidebar: false,
          les_actions: [
            { id: "add_post_publications", description: "Ajouter un post_publications" },
            { id: "edit_post_publications", description: "Modifier un post_publications" },
            { id: "delete_post_publications", description: "Supprimer un post_publications" },
            { id: "liste_post_publications", description: "Lister les post_publications" },
          ]
        }
    ,
        {
          text: "Posts",
          path: "/home/posts",
          icon: "bi bi-speedometer",
          privileges: [],
          items: [],
          show_on_sidebar: true,
          les_actions: [
            { id: "add_posts", description: "Ajouter un posts" },
            { id: "edit_posts", description: "Modifier un posts" },
            { id: "delete_posts", description: "Supprimer un posts" },
            { id: "liste_posts", description: "Lister les posts" },
          ]
        }
    ,
        {
          text: "Privileges",
          path: "/home/privileges",
          icon: "bi bi-speedometer",
          privileges: [],
          items: [],
          show_on_sidebar: false,
          les_actions: [
            { id: "add_privileges", description: "Ajouter un privileges" },
            { id: "edit_privileges", description: "Modifier un privileges" },
            { id: "delete_privileges", description: "Supprimer un privileges" },
            { id: "liste_privileges", description: "Lister les privileges" },
          ]
        }
    ,
        {
          text: "SocialAccounts",
          path: "/home/social_accounts",
          icon: "bi bi-speedometer",
          privileges: [],
          items: [],
          show_on_sidebar: true,
          les_actions: [
            { id: "add_social_accounts", description: "Ajouter un social_accounts" },
            { id: "edit_social_accounts", description: "Modifier un social_accounts" },
            { id: "delete_social_accounts", description: "Supprimer un social_accounts" },
            { id: "liste_social_accounts", description: "Lister les social_accounts" },
          ]
        }
    ,
        {
          text: "TypeSocialAccounts",
          path: "/home/type_social_accounts",
          icon: "bi bi-speedometer",
          privileges: [],
          items: [],
          show_on_sidebar: true,
          les_actions: [
            { id: "add_type_social_accounts", description: "Ajouter un type_social_accounts" },
            { id: "edit_type_social_accounts", description: "Modifier un type_social_accounts" },
            { id: "delete_type_social_accounts", description: "Supprimer un type_social_accounts" },
            { id: "liste_type_social_accounts", description: "Lister les type_social_accounts" },
          ]
        }
    ,
        {
          text: "UserPrivileges",
          path: "/home/user_privileges",
          icon: "bi bi-speedometer",
          privileges: [],
          items: [],
          show_on_sidebar: false,
          les_actions: [
            { id: "add_user_privileges", description: "Ajouter un user_privileges" },
            { id: "edit_user_privileges", description: "Modifier un user_privileges" },
            { id: "delete_user_privileges", description: "Supprimer un user_privileges" },
            { id: "liste_user_privileges", description: "Lister les user_privileges" },
          ]
        }
    ,
        {
          text: "Users",
          path: "/home/users",
          icon: "bi bi-speedometer",
          privileges: [],
          items: [],
          show_on_sidebar: true,
          les_actions: [
            { id: "add_users", description: "Ajouter un users" },
            { id: "edit_users", description: "Modifier un users" },
            { id: "delete_users", description: "Supprimer un users" },
            { id: "liste_users", description: "Lister les users" },
          ]
        }
    ]
    },];

      can(action: string) {
    // Vérifie d’abord qu’on a bien les permissions chargées
    if (!this.user_permissions || !Array.isArray(this.user_permissions)) {
      return false;
    }

    // On vérifie si l’action existe dans le tableau des permissions
    return this.user_permissions.some((perm: any) => perm.id === action);
  }

custom_menu() {
    if (!this.user_permissions || !Array.isArray(this.user_permissions)) {
      this.user_permissions = JSON.parse(localStorage.getItem("user_permissions") ?? '[]');
    }
    // Liste des IDs d’actions autorisées (ex: ["add_Vente", "edit_produit"])
    const permission_ids = this.user_permissions.map((p: any) => p.id);

    this.menu = this.full_menu
      .map((section: any) => {
        const new_section = { ...section };

        // Ne garde que les items avec au moins une action autorisée
        new_section.items = section.items.filter((item: any) => {
          if (!item.les_actions || item.les_actions.length === 0) return false;

          // Vérifie si au moins une action de l’item est dans les permissions
          return item.les_actions.some((act: any) =>
            permission_ids.includes(act.id)
          );
        });

        return new_section;
      })
      // Supprime les sections vides
      .filter((section: any) => section.items.length > 0);

    console.log('MENU Adapté aux privileges:', this.menu);
  }

    retour() {
    this._location.back()
  }

    formatNumber(value: any): string {
    if (!value || isNaN(Number(value))) {
      return value; // Retourne la valeur telle quelle si elle est null, vide ou non numérique
    }
    return Number(value).toLocaleString('fr-FR'); // Utilise Number.toLocaleString pour formater le nombre
  }

}
