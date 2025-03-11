import { TestBed } from "@angular/core/testing";
import { AlertService } from "./alert.service";
import { CreateDomElementService } from "../create-dom-element/create-dom-element.service";
import { EAlertMessage } from "../../../ui-messages/alert-messages";

describe('AlertService', () => {
    let service: AlertService;
    let moqCreateDomElement: jasmine.SpyObj<CreateDomElementService>;

    beforeEach(() => {
        moqCreateDomElement = jasmine.createSpyObj('CreateDomElementService', [
            'createComponent'
        ])
        TestBed.configureTestingModule({
            providers: [
                AlertService,
                { provide: CreateDomElementService, useValue: moqCreateDomElement }
            ]
        });

        service = TestBed.inject(AlertService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call createComponent when show', () => {
        moqCreateDomElement.createComponent.and.returnValue({
            close: (ms: number | undefined) => {
                console.log('closed')
            },
            instance: {} as any
        })
        service.show(EAlertMessage.DefaultMessage, { default: 'test' }, 1000);
        expect(moqCreateDomElement.createComponent).toHaveBeenCalled();
    });

    it('should call createComponent when show with duration by default', () => {
        moqCreateDomElement.createComponent.and.returnValue({
            close: (ms: number | undefined) => {
                console.log('closed')
            },
            instance: {} as any
        })
        service.show(EAlertMessage.DefaultMessage, { default: 'test' });
        expect(moqCreateDomElement.createComponent).toHaveBeenCalled();
    });

    it('should call createComponent and send parameters when showMessage', () => {
        moqCreateDomElement.createComponent.and.returnValue({
            close: (ms: number | undefined) => {
                console.log('closed')
            },
            instance: {} as any
        })
        service.showMessage({
            appearance: 'error', message: 'error'
        }, 1000);
        expect(moqCreateDomElement.createComponent).toHaveBeenCalled();
    });

    it('should call createComponent and send parameters when showMessage with duration by default', () => {
        moqCreateDomElement.createComponent.and.returnValue({
            close: (ms: number | undefined) => {
                console.log('closed')
            },
            instance: {} as any
        })
        service.showMessage({
            appearance: 'error', message: 'error'
        });
        expect(moqCreateDomElement.createComponent).toHaveBeenCalled();
    });
});