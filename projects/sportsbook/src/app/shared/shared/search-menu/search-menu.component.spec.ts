import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchMenuComponent } from './search-menu.component';

describe('SearchMenurComponent', () => {
  let component: SearchMenuComponent;
  let fixture: ComponentFixture<SearchMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchMenuComponent]
    });
    fixture = TestBed.createComponent(SearchMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
