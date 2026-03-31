import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListPrivilegesComponent } from './list-privileges.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ListPrivilegesComponent', () => {
  let component: ListPrivilegesComponent;
  let fixture: ComponentFixture<ListPrivilegesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
       providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPrivilegesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
