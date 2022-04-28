import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StakoliTableComponent } from './stakoli-table/stakoli-table.component';
import { LoadingComponent } from './loading/loading.component';
import { ReadOldExcelModalComponent } from './modals/read-old-excel-modal/read-old-excel-modal.component';
import { PersonViewModalComponent } from './modals/person-view-modal/person-view-modal.component';
import { FormsModule } from '@angular/forms';
import { AttendancePickerComponent } from './attendance-picker/attendance-picker.component';
import { AutofocusDirective } from './directives/autofocus.directive';

@NgModule({
  declarations: [
    AppComponent,
    StakoliTableComponent,
    LoadingComponent,
    ReadOldExcelModalComponent,
    PersonViewModalComponent,
    AttendancePickerComponent,
    AutofocusDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
