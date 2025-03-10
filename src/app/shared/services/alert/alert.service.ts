import { inject, Injectable } from "@angular/core";
import { CreateDomElementService } from "../create-dom-element/create-dom-element.service";
import { AlertMessage, EAlertMessage, alertMessages } from "./alert-messages";
import { AlertComponent } from "../../components/alert/alert.component";

@Injectable()
export class AlertService {
    private createDomElement = inject(CreateDomElementService);

    show<T>(T: EAlertMessage, duration: number = 5000): void {
        const alert = alertMessages[T];
        this.createDomElement.createComponent(AlertComponent, alert).close(duration);
    }

    showMessage(alert: AlertMessage, duration: number = 5000): void {
        this.createDomElement.createComponent(AlertComponent, alert).close(duration);
    }

}