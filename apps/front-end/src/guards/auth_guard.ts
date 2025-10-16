import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { jwtDecode } from "jwt-decode";
import { SessionUtils } from "../services/utils/sessions.utils";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard {
    private router = inject(Router);
    private sessionUtils = inject(SessionUtils);

    canActivate(): boolean {
        const access_token = this.sessionUtils.getSession().access_token;
        if (access_token) {
            const decodedToken = jwtDecode(access_token);
            const exp = decodedToken.exp;

            if (exp) {
                return !(exp * 1000 < Date.now());
            }
        }
        this.router.navigate(['']);
        return false;
    }
}