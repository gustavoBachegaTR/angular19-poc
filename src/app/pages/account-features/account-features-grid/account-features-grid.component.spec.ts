import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountFeaturesGridComponent } from './account-features-grid.component';
import { CollectionView } from '@grapecity/wijmo';
import { WjFlexGrid } from '@grapecity/wijmo.angular2.grid';
import { WjFlexGridFilter } from '@grapecity/wijmo.angular2.grid.filter';
import { WjFlexGridColumn } from '@grapecity/wijmo.angular2.grid';
import { WjFlexGridCellTemplate } from '@grapecity/wijmo.angular2.grid';
import { FlexGridXlsxConverter } from '@grapecity/wijmo.grid.xlsx';

describe('AccountFeaturesGridComponent', () => {
  let component: AccountFeaturesGridComponent;
  let fixture: ComponentFixture<AccountFeaturesGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AccountFeaturesGridComponent, // Importamos el componente standalone
        WjFlexGrid, // Importamos los componentes standalone necesarios
        WjFlexGridFilter,
        WjFlexGridColumn,
        WjFlexGridCellTemplate,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountFeaturesGridComponent);
    component = fixture.componentInstance;

    const mockData = new CollectionView([
      {
        id: 1,
        displayName: 'Test User',
        ofs: { name: 'Manual' },
        status: 'Active',
        isVisible: true,
      },
    ]);
    component.data = mockData;
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule(); // Limpia manualmente el módulo de pruebas
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
    const mockData = new CollectionView([
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
    ]);
    component.data = mockData;
    fixture.detectChanges();

    expect(component.flexGrid.itemsSource).toBe(mockData);
    expect(component.flexGrid.itemsSource.items.length).toBe(2);
  });
});
