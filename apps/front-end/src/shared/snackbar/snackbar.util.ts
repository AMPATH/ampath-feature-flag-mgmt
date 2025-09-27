import { inject, Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";
import { SnackBarMode } from "./snackbar.types";

@Injectable({ providedIn: 'root' })
export class SnackBarUtil {
    private _snackBar = inject(MatSnackBar);

    public open(message: string, mode: SnackBarMode) {
        const config: MatSnackBarConfig = {
            duration: 5000,
            horizontalPosition: "right",
            verticalPosition: "top",
            panelClass: [
                `mode-${mode}`
            ]
        };
        this._snackBar.open(message, "", config);
    }
}