import { Routes } from '@angular/router';

import { AuthGuard } from './guard/auth/auth.guard';
import { PublicComponent } from './public/public/public.component';
import { HomeComponent } from './home/home/home.component';

export const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "public" },
  {
    path: "home",
    component: HomeComponent,
    children: [
      {
        path: "",
        loadChildren: () => import("./home/home.module").then((m) => m.HomeModule)
      }
    ],
    // canActivate: [AuthGuard]
  },
  {
    path: "public",
    component: PublicComponent,
    children: [
      {
        path: "",
        loadChildren: () => import("./public/public.module").then((m) => m.PublicModule)
      }
    ],
  },
];
