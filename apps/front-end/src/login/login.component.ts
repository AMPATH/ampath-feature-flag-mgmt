import { Component, inject } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from "../services/authentication.service";
import { CommonModule } from "@angular/common";
import { SessionUtils } from "../services/utils/sessions.utils";
import { Router } from "@angular/router";
import { Subject, takeUntil, tap } from "rxjs";

@Component({
    imports: [FormsModule, CommonModule],
    selector: 'app-login',
    templateUrl: './login.component.html',
})
export class LoginComponent {
    private authenticationService = inject(AuthenticationService);
    private sessionUtils = inject(SessionUtils);
    private router = inject(Router);

    public username = "";
    public password = "";
    public loginError = "";

    private destroy$ = new Subject<void>();

    public onSubmitLogin(event: any) {
        event.preventDefault();

        if (!this.username || !this.password) {
            this.loginError = "Username and password are required!";
            return;
        }


        this.authenticationService.authenticate(this.username, this.password)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response: any) => {
                    if (!response.authenticated) {
                        this.loginError = "Wrong credentials!";
                        return;
                    }

                    const body = {
                        uuid: response.user.uuid,
                        username: response.user.username,
                        role_name: response.user.roles.length > 0 ? response.user.roles[0].display : "",
                        person_name: response.user.person.display
                    };

                    this.sessionUtils.setSession(body);
                    this.router.navigate(["/dashboard"])
                },
                error: () => {
                    this.loginError = "An error occurred during login.";
                }
            });
    }
}