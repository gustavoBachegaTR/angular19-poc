import { TestBed } from '@angular/core/testing';
import { ApplicationRef, Component, inject, TemplateRef } from '@angular/core';
import { CreateDomElementService } from './create-dom-element.service';
import { AlertComponent } from '../../components/alert/alert.component';


@Component({
    template: `<div>Test Component</div><div #template>Template</div>
    <button type="button" class="test-1" (click)="openModal(modalTest)">Open Default Modal</button>
    <div #alertHere></div>
    <button type="button" class="test-2" (click)="openModal(modalTest, alertHere)">Open Modal</button>
    <button type="button" class="test-3" (click)="openComponent(alertHere)">Open Default Modal from component</button>
    <button type="button" class="test-4" (click)="openComponent()">Open Modal from component</button>
    <ng-template #modalTest>
        <div class="modal">
        Hello world
        </div>
    </ng-template>
    `,
    providers: [CreateDomElementService]
})
class TestComponent {
    createDomElementService = inject(CreateDomElementService);
    test!: string;

    openModal(template: TemplateRef<any>, placeToShow?: HTMLElement) {
        let templateHtml;
        if (placeToShow) {
            templateHtml = this.createDomElementService.createTemplate(template, placeToShow);
        } else {
            templateHtml = this.createDomElementService.createTemplate(template);
        }
        templateHtml.close(5000);
    }

    openComponent(placeToShow?: HTMLElement) {
        let component;
        if (placeToShow) {
            component = this.createDomElementService.createComponent(AlertComponent, {
                message: 'Hi, I\'m a toast'
            }, placeToShow);
        } else {
            component = this.createDomElementService.createComponent(AlertComponent, {
                message: 'Hi, I\'m a toast'
            });
        }
        component.close(5000);
    }

}

describe('CreateDomElementService', () => {
  let service: CreateDomElementService;
  let appRefSpy: jasmine.SpyObj<ApplicationRef>;

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        CreateDomElementService,
        ApplicationRef, 
      ]
    });

    service = TestBed.inject(CreateDomElementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('defaultContainer', () => {
    it('should return the provided element if placeToShow is defined', () => {
      const mockElement = document.createElement('div');
      const result = (service as any).defaultContainer(mockElement);
      expect(result).toEqual([mockElement, false]);
    });

    it('should create a new container and return it if placeToShow is undefined', () => {
      const result = (service as any).defaultContainer(undefined);
      expect(result[0].className).toBe('element-container');
      expect(result[1]).toBeTrue();
      expect(document.body.contains(result[0])).toBeTrue();
      document.body.removeChild(result[0]); // Cleanup
    });
  });

});