import { TestBed } from '@angular/core/testing';
import { ApplicationRef } from '@angular/core';
import { CreateDomElementService } from './create-dom-element.service';
import { AlertComponent } from '../../components/alert/alert.component';


describe('CreateDomElementService', () => {
  let service: CreateDomElementService;

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

  describe('createTemplate', () => {
    it('should create template by default', () => {
      const htmlTemplate = document.createElement('div');
      htmlTemplate.innerText = 'Hello test'
      const moqTemplateRef = jasmine.createSpyObj('TemplateRef', ['createEmbeddedView'])
      const moqEmbeddedViewRef = jasmine.createSpyObj('EmbeddedViewRef', ['attachToAppRef', 'destroy', 'detachFromAppRef'], {
        rootNodes: [
          htmlTemplate
        ]
      });
      moqTemplateRef.createEmbeddedView.and.returnValue(moqEmbeddedViewRef);
      const response = service.createTemplate(moqTemplateRef);
      response.close();
      
      expect(moqTemplateRef.createEmbeddedView).toHaveBeenCalled();
    });

    it('should create template in specific place', () => {
      const htmlTemplate = document.createElement('div');
      htmlTemplate.innerText = 'Hello test'
      const templateToShow = document.createElement('div');
      templateToShow.innerText = 'Hello template'
      const moqTemplateRef = jasmine.createSpyObj('TemplateRef', ['createEmbeddedView', ])
      const moqEmbeddedViewRef = jasmine.createSpyObj('EmbeddedViewRef', ['attachToAppRef', 'destroy', 'detachFromAppRef'], {
        rootNodes: [
          htmlTemplate
        ]
      });
      moqTemplateRef.createEmbeddedView.and.returnValue(moqEmbeddedViewRef);
      const response = service.createTemplate(moqTemplateRef, templateToShow);
      response.close();
      
      expect(moqTemplateRef.createEmbeddedView).toHaveBeenCalled();
    })
  });

  describe('createComponent', () => {
    it('should create component by default', () => {
      const context = {
        message: 'Hello test',
        appearance: 'success'
      }
      const response = service.createComponent(AlertComponent, context as any);
      response.close();
      expect(response.close).toBeTruthy();
      expect(response.instance).toBeTruthy();
    });

    it('should create component with template to show', () => {
      const templateToShow = document.createElement('div');
      templateToShow.innerText = 'Hello template'
      const context = {
        message: 'Hello test',
        appearance: 'success'
      }
      const response = service.createComponent(AlertComponent, context as any, templateToShow);
      response.close();
      expect(response.close).toBeTruthy();
      expect(response.instance).toBeTruthy();
    });
  });

});