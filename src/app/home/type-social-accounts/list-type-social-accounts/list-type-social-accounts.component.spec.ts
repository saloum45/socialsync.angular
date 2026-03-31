import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListTypeSocialAccountsComponent } from './list-type-social-accounts.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ListTypeSocialAccountsComponent', () => {
  let component: ListTypeSocialAccountsComponent;
  let fixture: ComponentFixture<ListTypeSocialAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
       providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListTypeSocialAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
