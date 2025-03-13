import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateUserFormComponent } from './create-update-user-form.component';

describe('CreateUpdateUserFormComponent', () => {
  let component: CreateUpdateUserFormComponent;
  let fixture: ComponentFixture<CreateUpdateUserFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateUpdateUserFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateUpdateUserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
