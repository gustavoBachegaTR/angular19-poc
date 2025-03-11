import { AlertComponent } from "../../components/alert/alert.component";

export enum EAlertMessage {
    DefaultMessage
};

export type AlertMessage = Pick<AlertComponent, 'message' | 'appearance'>;

export const alertMessages: Record<EAlertMessage, AlertMessage> = {
    [EAlertMessage.DefaultMessage]: {
        message: 'This is a default alert using pre default data',
        appearance: 'success'
    }
} 