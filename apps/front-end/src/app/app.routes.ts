import { Route } from '@angular/router';
import { Login } from '../login/login';
import { NavBar } from '../navbar/navbar';

export const appRoutes: Route[] = [
    {
        path: '',
        component: Login
    },
    {
        path: 'dashboard',
        component: NavBar
    }
];
