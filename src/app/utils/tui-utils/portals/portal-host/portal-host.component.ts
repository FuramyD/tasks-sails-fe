import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AbstractTuiPortalHostComponent, AbstractTuiPortalService } from "@taiga-ui/cdk";
import { CustomPortalService } from "../custom-portal.service";

@Component({
    selector: "app-portal-host",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./portal-host.component.html",
    styleUrl: "./portal-host.component.less",
    providers: [{ provide: AbstractTuiPortalService, useExisting: CustomPortalService }],
})
export class PortalHostComponent extends AbstractTuiPortalHostComponent {

}
