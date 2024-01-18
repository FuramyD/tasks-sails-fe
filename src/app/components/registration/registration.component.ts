import { Component, DestroyRef, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { Router, RouterLink } from "@angular/router";
import {
    TuiAlertService,
    TuiButtonModule,
    TuiErrorModule,
    TuiHintModule,
    TuiLinkModule,
    TuiPrimitiveTextfieldModule
} from "@taiga-ui/core";
import { TUI_VALIDATION_ERRORS, TuiFieldErrorPipeModule, TuiInputModule, TuiInputPasswordModule } from "@taiga-ui/kit";
import { HttpErrorResponse } from "@angular/common/http";
import { catchError, EMPTY } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

enum FormControls {
    USERNAME = "username",
    PASSWORD = "password",
    CONFIRM_PASSWORD = "confirmPassword",
    EMAIL = "email",
}

@Component({
    selector: "app-registration",
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink, TuiButtonModule, TuiErrorModule, TuiFieldErrorPipeModule, TuiInputModule, TuiInputPasswordModule, TuiLinkModule, TuiPrimitiveTextfieldModule, TuiHintModule],
    templateUrl: "./registration.component.html",
    styleUrl: "./registration.component.less",
    providers: [
        {
            provide: TUI_VALIDATION_ERRORS,
            useFactory: () => {
                const messages = inject(TUI_VALIDATION_ERRORS, { optional: true, skipSelf: true }) ?? {};
                return {
                    ...messages,
                    confirmedValidator: "Passwords don't match",
                }
            },
        }
    ]
})
export class RegistrationComponent {
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    private readonly alerts = inject(TuiAlertService);
    private readonly destroyRef = inject(DestroyRef);

    public readonly FormControls = FormControls;
    public readonly registrationForm = new FormGroup({
        [FormControls.USERNAME]: new FormControl<string>("", {
            nonNullable: true,
            validators: [Validators.required, Validators.minLength(6), Validators.maxLength(16)],
        }),
        [FormControls.PASSWORD]: new FormControl<string>("", {
            nonNullable: true,
            validators: [Validators.required, Validators.minLength(6), Validators.maxLength(16)],
        }),
        [FormControls.CONFIRM_PASSWORD]: new FormControl<string>("", {
            nonNullable: true,
            validators: [Validators.required, Validators.minLength(6), Validators.maxLength(16)],
        }),
        [FormControls.EMAIL]: new FormControl<string>("", {
            nonNullable: true,
            validators: [Validators.required, Validators.email],
        }),
    }, {
        validators: [this.matchValidator(FormControls.PASSWORD, FormControls.CONFIRM_PASSWORD)],
    });

    public loading: boolean = false;

    public register(): void {
        if (this.registrationForm.invalid) {
            return;
        }

        this.authService.register({
            username: this.registrationForm.controls[FormControls.USERNAME].value,
            password: this.registrationForm.controls[FormControls.PASSWORD].value,
            email: this.registrationForm.controls[FormControls.EMAIL].value,
        }).pipe(
            catchError((error: HttpErrorResponse) => {
                console.error("Error when trying to login", error);
                this.showRegistrationErrorAlert(error);
                this.loading = false;
                return EMPTY;
            }),
            takeUntilDestroyed(this.destroyRef)
        )
            .subscribe(() => this.router.navigate(["/"]));;
    }

    private showRegistrationErrorAlert(error: HttpErrorResponse): void {
        this.alerts.open(error.error.message, {
            label: "Login error",
            status: "error",
            autoClose: 3000,
        }).subscribe();
    }

    private matchValidator(controlName: string, matchingControlName: string): ValidatorFn {
        return (abstractControl: AbstractControl) => {
            const control = abstractControl.get(controlName);
            const matchingControl = abstractControl.get(matchingControlName);

            if (matchingControl!.errors && !matchingControl!.errors?.["confirmedValidator"]) {
                return null;
            }

            if (control!.value !== matchingControl!.value) {
                const error = { confirmedValidator: true };
                matchingControl!.setErrors(error);
                return error;
            } else {
                matchingControl!.setErrors(null);
                return null;
            }
        };
    }

}
