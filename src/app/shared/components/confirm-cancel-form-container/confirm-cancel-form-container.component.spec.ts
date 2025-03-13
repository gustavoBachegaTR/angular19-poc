import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmCancelFormContainerComponent } from './confirm-cancel-form-container.component';

describe('ConfirmCancelFormContainerComponent', () => {
  let component: ConfirmCancelFormContainerComponent;
  let fixture: ComponentFixture<ConfirmCancelFormContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmCancelFormContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmCancelFormContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
