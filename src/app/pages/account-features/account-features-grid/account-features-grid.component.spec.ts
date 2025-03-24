import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountFeaturesGridComponent } from './account-features-grid.component';
import { CollectionView } from '@grapecity/wijmo';
import { WjFlexGrid } from '@grapecity/wijmo.angular2.grid';
import { WjFlexGridFilter } from '@grapecity/wijmo.angular2.grid.filter';
import { WjFlexGridColumn } from '@grapecity/wijmo.angular2.grid';
import { WjFlexGridCellTemplate } from '@grapecity/wijmo.angular2.grid';
import { FlexGridXlsxConverter } from '@grapecity/wijmo.grid.xlsx';
import { AccountFeature } from 'src/app/shared/models/account/account-features.model';

describe('AccountFeaturesGridComponent', () => {
  let component: AccountFeaturesGridComponent;
  let fixture: ComponentFixture<AccountFeaturesGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AccountFeaturesGridComponent,
        WjFlexGrid,
        WjFlexGridFilter,
        WjFlexGridColumn,
        WjFlexGridCellTemplate,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountFeaturesGridComponent);
    component = fixture.componentInstance;

    const mockData: AccountFeature[] = [
      {
        id: 1,
        displayName: 'Test User',
        ofs: { name: 'Manual' },
        status: 'Active',
        isVisible: true,
      },
    ];
    component.data = new CollectionView<AccountFeature>(mockData);
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the grid columns with correct widths', () => {
    component.ngAfterViewInit();

    const idColumn = component.flexGrid.columns.getColumn('id');
    const displayNameColumn =
      component.flexGrid.columns.getColumn('displayName');
    const ofsNameColumn = component.flexGrid.columns.getColumn('ofs.name');
    const statusColumn = component.flexGrid.columns.getColumn('status');
    const isVisibleColumn = component.flexGrid.columns.getColumn('isVisible');

    expect(idColumn.width).toBe('10*');
    expect(displayNameColumn.width).toBe('22.5*');
    expect(ofsNameColumn.width).toBe('22.5*');
    expect(statusColumn.width).toBe('22.5*');
    expect(isVisibleColumn.width).toBe('22.5*');
  });

  it('should export grid data to Excel', () => {
    spyOn(FlexGridXlsxConverter, 'save').and.callFake(
      (grid, options, fileName, batchSize) => {
        return {} as any;
      },
    );

    component.exportToExcel();
    expect(FlexGridXlsxConverter.save).toHaveBeenCalled();
  });

  it('should return correct status class based on status', () => {
    expect(component.getStatusClass('Active')).toBe('badge badge-green');
    expect(component.getStatusClass('Canceled')).toBe('badge badge-red');
    expect(component.getStatusClass('Trial')).toBe('badge badge-orange');
    expect(component.getStatusClass('Unknown')).toBe('');
  });

  it('should toggle admin display visibility', () => {
    const mockItem = { isVisible: true };
    component.toggleAdminDisplay(mockItem);
    expect(mockItem.isVisible).toBe(false);

    component.toggleAdminDisplay(mockItem);
    expect(mockItem.isVisible).toBe(true);
  });

  it('should bind data to the grid', () => {
    const mockData: AccountFeature[] = [
      {
        id: 1,
        displayName: 'Test User',
        ofs: { name: 'Manual' },
        status: 'Active',
        isVisible: true,
      },
      {
        id: 2,
        displayName: 'Another User',
        ofs: { name: 'Auto' },
        status: 'Canceled',
        isVisible: false,
      },
    ];
    component.data = new CollectionView<AccountFeature>(mockData);
    fixture.detectChanges();

    expect(component.flexGrid.itemsSource).toBe(component.data);
    expect(component.flexGrid.itemsSource.items.length).toBe(2);
  });

  it('should render grid rows correctly', () => {
    const rows = component.flexGrid.rows;
    expect(rows.length).toBe(1);
    expect(rows[0].dataItem.displayName).toBe('Test User');
  });

  it('should apply filters correctly', () => {
    const mockData: AccountFeature[] = [
      {
        id: 1,
        displayName: 'Test User',
        ofs: { name: 'Manual' },
        status: 'Active',
        isVisible: true,
      },
      {
        id: 2,
        displayName: 'Another User',
        ofs: { name: 'Auto' },
        status: 'Canceled',
        isVisible: false,
      },
    ];
    component.data = new CollectionView<AccountFeature>(mockData);
    component.data.filter = (item: AccountFeature) => item.status === 'Active';
    component.data.refresh();
    fixture.detectChanges();

    expect(component.flexGrid.itemsSource.items.length).toBe(1);
    expect(component.flexGrid.itemsSource.items[0].status).toBe('Active');
  });
});
