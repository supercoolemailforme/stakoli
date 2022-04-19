import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StakoliTableComponent } from './stakoli-table/stakoli-table.component';
import { LoadingComponent } from './loading/loading.component';
import { ReadOldExcelModalComponent } from './modals/read-old-excel-modal/read-old-excel-modal.component';
import { PersonViewModalComponent } from './modals/person-view-modal/person-view-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    StakoliTableComponent,
    LoadingComponent,
    ReadOldExcelModalComponent,
    PersonViewModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
