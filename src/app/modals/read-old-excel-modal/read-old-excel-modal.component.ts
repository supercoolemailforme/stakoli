import { Component, OnInit } from '@angular/core';
import { Department, Person } from 'src/app/data-models/department';
import { DataService, ModalModes } from 'src/app/services/data.service';

@Component({
  selector: 'app-read-old-excel-modal',
  templateUrl: './read-old-excel-modal.component.html',
  styleUrls: ['./read-old-excel-modal.component.css']
})
export class ReadOldExcelModalComponent implements OnInit {

  sheetCheck: boolean[] = [];

  yearMissmatch: boolean = false;
  selectedYear: number = NaN;

  errorMessages: any = {"no days found": "Es konnte kein Datum gefunden werden. Wenn es sich bei dieser Tabelle um eine Tabelle ohne Personen- und Anwesenheits-Informationen handelt können sie diesen Fehler ignorieren. Dies trifft zum Beispiel auf Zusammenfassungen anderer Tabellen zu.",
                        "header unreadable": "Es konnte keinen Spalten für Personendaten gefunden werden. Wenn es sich bei dieser Tabelle um eine Tabelle ohne Personen- und Anwesenheits-Informationen handelt können sie diesen Fehler ignorieren. Dies trifft zum Beispiel auf Zusammenfassungen anderer Tabellen zu.",
                        "person undetectable": "Es wurde eine Person gefunden, für die kein Nachname eingetragen wurde oder das Ende der Personenliste ist nicht ausreichend gekennzeichnet."};

  isNan = isNaN;
  Number = Number;



  constructor(public dataService: DataService) { }

  ngOnInit(): void {
    //console.log(JSON.stringify(this.dataService.foundSheetsList))
    for (let dataSet of this.dataService.foundSheetsList) {
      if (dataSet.error || isNaN(dataSet.obj.year)) {
        continue;
      }

      if (isNaN(this.selectedYear)) {
        this.selectedYear = dataSet.obj.year;
      }
      else {
        if (this.selectedYear !== dataSet.obj.year) {
          this.yearMissmatch = true;
          break;
        }
      }
    }

    if (isNaN(this.selectedYear)) {
      this.selectedYear = new Date().getFullYear();
    }

    if (this.yearMissmatch) {
      this.sheetCheck = new Array<boolean>(this.dataService.foundSheetsList.length);
    }
    else {
      for (let dataSet of this.dataService.foundSheetsList) {
        this.sheetCheck.push(dataSet.error === undefined);
      }
    }

    for (let sheet of this.dataService.foundSheetsList) {
      if (sheet.obj) {
        let cnt = 0;
        
        for (let person of sheet.obj.department.persons) {
          cnt += person.getAttendanceLength();
        }
  
        sheet.datasetCnt = cnt;
      }
    }
  }

  applyData(): void {
    let output: Department[] = [];

    for (let i = 0; i < this.sheetCheck.length; ++i) {
      if (this.sheetCheck[i]) {
        output.push(this.dataService.foundSheetsList[i].obj.department);
        this.dataService.attendanceTypes = this.dataService.mergeArrays(this.dataService.attendanceTypes, this.dataService.foundSheetsList[i].obj.attendanceTypes);
      }
    }

    let temp = [];
    for (let i of output) {
      temp.push(JSON.stringify(i));
    }
    console.log(temp);

    this.dataService.data = output;
    this.dataService.year = this.getPositivInteger(this.selectedYear);
    this.dataService.OnNewDataApplied.emit();

    this.close();
  }

  onYearChanged(event: Event) {
    let element = event.target as HTMLInputElement;
    element.valueAsNumber = this.getPositivInteger(element.valueAsNumber);
  }

  getPositivInteger(value: number): number {
    if (this.isNan(value)) {
      return 0;
    }
    return Number.parseInt(value.toString().replace(/[^0-9]/g, ""));
  }

  close(): void {
    this.dataService.modalMode.next(ModalModes.NONE);
  }

  getCheckedSheetCnt(): number {
    let cnt = 0;

    for (let sheetBool of this.sheetCheck) {
      if (sheetBool) {
        ++cnt;
      }
    }

    return cnt;
  }

  getErrorMessage(error: string): string {
    console.log(error);
    if (this.errorMessages[error] === undefined) {
      return "Unbekannter Fehler";
    }
    else {
      return this.errorMessages[error];
    }
  }

}
