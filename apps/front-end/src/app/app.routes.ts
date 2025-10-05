import { Route } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { NavBarComponent } from '../navbar/navbar.component';
import { FeatureFlagsComponent } from '../feature_flags/feature_flags.component';
import { OperatorsComponent } from '../operators/operators.component';
import { AttributesComponent } from '../attributes/attributes.component';
import { RulesComponent } from '../rules/rules.component';

export const appRoutes: Route[] = [
    {
        path: '',
        component: LoginComponent
    },
    {
        path: 'home',
        component: NavBarComponent,
        children: [
            {
                path: 'feature-flags',
                component: FeatureFlagsComponent,
            },
            {
                path: 'operators',
                component: OperatorsComponent
            },
            {
                path: 'attributes',
                component: AttributesComponent
            },
            {
                path: 'feature-flags/:id/rules/:name/:description',
                component: RulesComponent
            }
        ]
    }
];
