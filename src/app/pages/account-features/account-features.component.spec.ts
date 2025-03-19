import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountFeaturesPageComponent } from '@app/pages/account-features/account-features.component';
import { AccountFeaturesGridComponent } from './account-features-grid/account-features-grid.component';
import { DataService } from 'src/app/shared/services/data.service';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AccountFeature } from 'src/app/shared/models/account/account-features.model';

describe('AccountFeaturesPageComponent', () => {
  let component: AccountFeaturesPageComponent;
  let fixture: ComponentFixture<AccountFeaturesPageComponent>;
  let mockDataService: jasmine.SpyObj<DataService>;

  beforeEach(async () => {
    mockDataService = jasmine.createSpyObj('DataService', [
      'getAccountFeature',
    ]);

    await TestBed.configureTestingModule({
      imports: [AccountFeaturesPageComponent, AccountFeaturesGridComponent],
      providers: [{ provide: DataService, useValue: mockDataService }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountFeaturesPageComponent);
    component = fixture.componentInstance;
  });

  it('should display the grid when data is loaded', async () => {
    const mockData: AccountFeature[] = [
      {
        id: 1,
        displayName: 'Test User',
        status: 'Active',
        isVisible: true,
        ofs: { name: 'Manual' },
      },
    ];
    mockDataService.getAccountFeature.and.returnValue(of([{ row: mockData }]));
    fixture.detectChanges();

    await fixture.whenStable();
    fixture.detectChanges();

    const grid = fixture.nativeElement.querySelector(
      'app-account-features-grid',
    );
    expect(grid).toBeTruthy();
  });

  it('should display the empty state when search yields no results', async () => {
    const mockData: AccountFeature[] = [
      {
        id: 1,
        displayName: 'Test User',
        status: 'Active',
        isVisible: true,
        ofs: { name: 'Manual' },
      },
    ];
    mockDataService.getAccountFeature.and.returnValue(of([{ row: mockData }]));
    fixture.detectChanges();

    await fixture.whenStable();
    component.searchFilter({ target: { value: 'nonexistent' } });
    fixture.detectChanges();

    const emptyStateElement =
      fixture.nativeElement.querySelector('saf-empty-state');
    expect(emptyStateElement).toBeTruthy();
  });

  it('should filter data based on search input', async () => {
    const mockData: AccountFeature[] = [
      {
        id: 1,
        displayName: 'Test User',
        status: 'Active',
        isVisible: true,
        ofs: { name: 'Manual' },
      },
      {
        id: 2,
        displayName: 'Another User',
        status: 'Inactive',
        isVisible: false,
        ofs: { name: 'Auto' },
      },
    ];
    mockDataService.getAccountFeature.and.returnValue(of([{ row: mockData }]));
    fixture.detectChanges();

    await fixture.whenStable();
    fixture.detectChanges();

    component.searchFilter({ target: { value: 'Test' } });
    fixture.detectChanges();

    const filteredData = component.data();
    expect(filteredData?.sourceCollection.length).toBe(2);
    expect(filteredData?.sourceCollection[0].displayName).toBe('Test User');
  });
});
