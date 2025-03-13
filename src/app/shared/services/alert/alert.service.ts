import { inject, Injectable } from "@angular/core";
import { CreateDomElementService } from "@shared/services/create-dom-element/create-dom-element.service";
import { AlertMessage, EAlertMessage, alertMessages } from "@app/ui-messages/alert-messages";
import { AlertComponent } from "@shared/components/alert/alert.component";

@Injectable()
export class AlertService {
    private createDomElement = inject(CreateDomElementService);

    show<T>(T: EAlertMessage, params: object | undefined, duration: number = 5000): void {
        const alert = alertMessages[T];
        alert.message = this.applyParams(params, alert.message);
        this.createDomElement.createComponent(AlertComponent, alert).close(duration);
    }

    showMessage(alert: AlertMessage, duration: number = 5000): void {
        this.createDomElement.createComponent(AlertComponent, alert).close(duration);
    }

    private applyParams(params: object | undefined, val: string): string {
        if (params && Object.keys(params)?.length > 0) {
            for (let key in params) {
                val = val.replaceAll(`{{${key}}}`, (params as any)[key]);
            }
        }
        return val;
    }

}