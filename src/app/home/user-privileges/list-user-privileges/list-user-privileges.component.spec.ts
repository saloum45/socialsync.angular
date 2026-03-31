import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListUserPrivilegesComponent } from './list-user-privileges.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ListUserPrivilegesComponent', () => {
  let component: ListUserPrivilegesComponent;
  let fixture: ComponentFixture<ListUserPrivilegesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
       providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListUserPrivilegesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
