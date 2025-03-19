import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountFeaturesPageComponent } from '@app/pages/account-features/account-features.component';
import { AccountFeaturesGridComponent } from './account-features-grid/account-features-grid.component';
import { DataService } from 'src/app/shared/services/data.service';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

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

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the empty state when no data is loaded', () => {
    mockDataService.getAccountFeature.and.returnValue(of([]));
    fixture.detectChanges();

    const emptyStateParagraph = fixture.nativeElement.querySelector(
      '.empty-state#nodata p',
    );
    expect(emptyStateParagraph).toBeTruthy();
    expect(emptyStateParagraph.textContent).toContain(
      'You can add an account feature by clicking the button below.',
    );
  });

  it('should display the grid when data is loaded', () => {
    const mockData = [
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

    const grid = fixture.nativeElement.querySelector(
      'app-account-features-grid',
    );
    expect(grid).toBeTruthy();
  });

  it('should display the empty state when search yields no results', () => {
    const mockData = [
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

    component.searchValue = 'nonexistent';
    component.searchFilter({ target: { value: 'nonexistent' } });
    fixture.detectChanges();

    const emptyStateParagraph =
      fixture.nativeElement.querySelector('.empty-state p');
    expect(emptyStateParagraph).toBeTruthy();
    expect(emptyStateParagraph.textContent).toContain(
      'Try searching again or change your search filters.',
    );
  });

  it('should call exportToExcel when the export button is clicked', () => {
    const mockData = [
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

    spyOn(component.accountFeaturesGrid, 'exportToExcel');
    const exportButton = fixture.nativeElement.querySelector(
      'saf-button[appearance="secondary"]',
    );
    exportButton.click();

    expect(component.accountFeaturesGrid.exportToExcel).toHaveBeenCalled();
  });

  it('should filter data based on search input', () => {
    const mockData = [
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

    component.searchFilter({ target: { value: 'Test' } });
    fixture.detectChanges();

    expect(component.data.items.length).toBe(1);
    expect(component.data.items[0].displayName).toBe('Test User');
  });
});
