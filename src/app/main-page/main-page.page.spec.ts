import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MainPagePage } from './main-page.page';

describe('MainPagePage', () => {
  let component: MainPagePage;
  let fixture: ComponentFixture<MainPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainPagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MainPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
