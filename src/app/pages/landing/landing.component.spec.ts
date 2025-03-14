import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingComponent } from './landing.component';
import { MenuComponent } from '@shared/components/menu/menu.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AlertService } from '@shared/services/alert/alert.service';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingComponent, MenuComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [AlertService]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
