import { Injectable } from "@angular/core"
import { SessionT } from "./sessions.utils.types";

@Injectable({ providedIn: 'root' })
export class SessionUtils {
    public setSession(body: object) {
        for(const [key, value] of Object.entries(body)) {
            sessionStorage.setItem(key, value);
        }
    }

    public getSession(): SessionT {
        const session: any = {};
        for(let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i) ?? "";
            const value = sessionStorage.getItem(key);

            if(key) {
                session[key] = value ?? "";
            }
        }

        const obj: SessionT = session;
        return obj;
    }

    public clearSession() {
        sessionStorage.clear();
    }
}