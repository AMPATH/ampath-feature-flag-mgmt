import { Route } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { NavBarComponent } from '../navbar/navbar.component';

export const appRoutes: Route[] = [
    {
        path: '',
        component: LoginComponent
    },
    {
        path: 'dashboard',
        component: NavBarComponent
    }
];
