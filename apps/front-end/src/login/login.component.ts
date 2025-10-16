import { Component, inject } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from "../services/authentication.service";
import { CommonModule } from "@angular/common";
import { SessionUtils } from "../services/utils/sessions.utils";
import { Router } from "@angular/router";
import { catchError, finalize, Subject, takeUntil, tap } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { SnackBarUtil } from "../shared/snackbar/snackbar.util";

@Component({
    imports: [FormsModule, CommonModule, MatProgressSpinnerModule, MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule],
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    private authenticationService = inject(AuthenticationService);
    private sessionUtils = inject(SessionUtils);
    private router = inject(Router);
    private snackBar = inject(SnackBarUtil);

    public busy = false;
    public username = "";
    public password = "";

    private destroy$ = new Subject<void>();

    public onSubmitLogin(event: any) {
        event.preventDefault();

        if (!this.username || !this.password) {
            this.snackBar.open(`Username and password are required!`, "error");
            return;
        }

        this.busy = true;
        this.authenticationService.authenticate(this.username, this.password)
            .pipe(
                takeUntil(this.destroy$),
                tap((response: any) => {
                    if (!response.user.authenticated) {
                        this.snackBar.open(`Wrong credentials!`, "error");
                        return;
                    }

                    const body = {
                        uuid: response.user.user.uuid,
                        username: response.user.user.username,
                        role_name: response.user.user.roles.length > 0 ? response.user.user.roles[0].display : "",
                        person_name: response.user.user.person.display,
                        access_token: response.access_token,
                        expires_at: response.expires_at
                    };

                    this.sessionUtils.setSession(body);
                    this.router.navigate(["/home"])
                }),
                catchError((error: HttpErrorResponse) => {
                    this.snackBar.open(error.statusText, "error");
                    throw error;
                }),
                finalize(() => {
                    this.busy = false;
                })
            ).subscribe();
    }
}