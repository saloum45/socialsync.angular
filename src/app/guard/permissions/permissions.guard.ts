import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { ApiService } from '../../service/api/api.service';

export const permissionsGuard: CanActivateFn = (route, state) => {
  const service = inject(ApiService);
  // console.warn("route -> ", state.url);
  // console.warn("menu -> ", service.menu);
  let decision = false
  service.menu.map((one_menu: any) => {
    // console.warn("one_menu split -> ", state.url.split('/'));
    // console.warn("one_menu split -> ", state.url.split('/').slice(0, -1).join('/'));
    decision=one_menu.items.some((sous_menu: any) => sous_menu.path == state.url);
  });
  // console.warn("decision -> ", decision);
  return decision;
};
