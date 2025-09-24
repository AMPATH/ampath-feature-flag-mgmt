import { Component } from "@angular/core";
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from "@angular/router";
import { MatMenuModule } from "@angular/material/menu";

@Component({
    imports: [MatSidenavModule,
        MatToolbarModule,
        MatIconModule,
        MatListModule,
        MatButtonModule, MatMenuModule, RouterModule],
    selector: 'app-navbar',
    styleUrl: 'navbar.component.scss',
    templateUrl: './navbar.component.html',
})

export class NavBarComponent {
    logout() {
        console.log("logged out");
    }
}