import { Component, inject } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from "../services/authentication.service";
import { CommonModule } from "@angular/common";
import { SessionUtils } from "../services/utils/sessions.utils";
import { Router } from "@angular/router";

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

    public onSubmitLogin(event: any) {
        event.preventDefault();
        this.loginError = "";

        if(this.username !== "" && this.password !== "") {
            this.authenticationService.authenticate(this.username, this.password)
            .subscribe((response: any) => {
                if(response.authenticated) {
                    const role = response.user.roles.length > 0 ? response.user.roles[0].display : "";
                    const body = {
                        uuid: response.user.uuid,
                        username: response.user.username,
                        role_name: role,
                        person_name: response.user.person.display
                    };

                    this.sessionUtils.setSession(body);
                    this.router.navigate(["/dashboard"]);
                    return;
                }
                this.loginError = "Wrong credentials!";
            });
        } else {
             this.loginError = "Username and password are required!";
        }
    }
}