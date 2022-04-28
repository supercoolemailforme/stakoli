import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import readXlsxFile, { readSheetNames } from 'read-excel-file';
import { Department, Person } from '../data-models/department';
import { Integer } from 'read-excel-file/types';
import { EventHandlerVars } from '@angular/compiler/src/compiler_util/expression_converter';
import { EventManager } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  /*
  data: any = {'Dienstbetrieb': [{
                      vorname: 'Max', nachname: 'Mustermann', dienstgrad: 'Vzlt', funktion: 'OvT',
                      anwesenheiten: [{'1.1': 'anw', '1.2': 'anw', '1.3': 'k'}]}
                    ,
                    {
                      vorname: 'Joe', nachname: 'Doe', dienstgrad: 'Wm', funktion: 'Ausbilder',
                      anwesenheiten: [{'1.1': 'abw', '1.2': 'abw', '1.3': 'anw'}]}
                      ,
                      {
                        vorname: 'Alexander', nachname: 'Neuböck-Trpisovsky', dienstgrad: 'Rekr', funktion: 'Cyber-Gwd',
                        anwesenheiten: []}
                    ]};*/
  data: Department[] = [];
  attendanceTypes: string[] = ['K', 'Anw', 'DZ', 'AE', 'P', 'DR', 'ADR', '---', 'A'];
  year: number = 2021;

  OnNewDataApplied: EventEmitter<string> = new EventEmitter<string>();

  OnAddPersonEvent: undefined | ((p: Person | undefined) => void) = undefined;


  // utility-variables
  loadingActive = new Subject<boolean>();
  modalMode = new Subject<ModalModes>();

  // readData
  foundSheetsList: any[] = [];
  activeFile: File | null = null;




  constructor() { 
    this.loadingActive.next(true);
    this.modalMode.next(ModalModes.NONE);

    let temp = [
        "{\"name\":\"Dienstbetrieb\",\"department\":{\"name\":\"Dienstbetrieb\",\"persons\":[{\"attendances\":{},\"firstName\":\"\",\"lastName\":\"Brugger\",\"rank\":\"\",\"position\":\"funk1\"},{\"attendances\":{\"3.1\":\"K\",\"4.1\":\"K\",\"5.1\":\"K\",\"6.1\":\"K\",\"7.1\":\"K\",\"8.1\":\"K\",\"2.1\":\"K\",\"2.2\":\"K\",\"2.3\":\"K\"},\"firstName\":\"\",\"lastName\":\"Hutka\",\"rank\":\"\",\"position\":\"funk2\"},{\"attendances\":{\"5.1\":\"K\",\"6.1\":\"Anw\",\"7.1\":\"Anw\"},\"firstName\":\"\",\"lastName\":\"Rumpler\",\"rank\":\"\",\"position\":\"funk3\"},{\"attendances\":{\"5.1\":\"Anw\",\"6.1\":\"Anw\",\"7.1\":\"Anw\"},\"firstName\":\"\",\"lastName\":\"Blasl\",\"rank\":\"\",\"position\":\"funk3\"},{\"attendances\":{},\"firstName\":\"\",\"lastName\":\"Mayer\",\"rank\":\"\",\"position\":\"funk4\"},{\"attendances\":{},\"firstName\":\"\",\"lastName\":\"Medwenitsch\",\"rank\":\"\",\"position\":\"funk5\"},{\"attendances\":{\"4.1\":\"DZ\",\"5.1\":\"DZ\",\"6.1\":\"AE\",\"7.1\":\"Anw\",\"8.1\":\"Anw\"},\"firstName\":\"\",\"lastName\":\"Seidl\",\"rank\":\"\",\"position\":\"funk5\"},{\"attendances\":{\"3.1\":\"DZ\",\"4.1\":\"DZ\",\"5.1\":\"DZ\",\"6.1\":\"AE\",\"7.1\":\"Anw\",\"8.1\":\"Anw\"},\"firstName\":\"\",\"lastName\":\"Klenner\",\"rank\":\"\",\"position\":\"funk5\"}]}}",
        "{\"name\":\"Dienstbetrieb_2\",\"department\":{\"name\":\"Dienstbetrieb_2\",\"persons\":[{\"attendances\":{\"3.1\":\"K\",\"4.1\":\"K\",\"5.1\":\"K\",\"6.1\":\"K\",\"7.1\":\"K\",\"8.1\":\"K\",\"2.1\":\"K\",\"2.2\":\"K\",\"2.3\":\"K\"},\"firstName\":\"\",\"lastName\":\"Brugger2\",\"rank\":\"\",\"position\":\"funk1\"},{\"attendances\":{\"5.1\":\"K\",\"6.1\":\"Anw\",\"7.1\":\"Anw\"},\"firstName\":\"\",\"lastName\":\"Hutka2\",\"rank\":\"\",\"position\":\"funk2\"},{\"attendances\":{\"5.1\":\"Anw\",\"6.1\":\"Anw\",\"7.1\":\"Anw\"},\"firstName\":\"\",\"lastName\":\"Rumpler2\",\"rank\":\"\",\"position\":\"funk3\"},{\"attendances\":{\"4.1\":\"DZ\",\"5.1\":\"DZ\",\"6.1\":\"AE\",\"7.1\":\"Anw\",\"8.1\":\"Anw\"},\"firstName\":\"\",\"lastName\":\"Medwenitsch2\",\"rank\":\"\",\"position\":\"funk5\"},{\"attendances\":{\"3.1\":\"DZ\",\"4.1\":\"DZ\",\"5.1\":\"DZ\",\"6.1\":\"AE\",\"7.1\":\"Anw\",\"8.1\":\"Anw\"},\"firstName\":\"\",\"lastName\":\"Seidl2\",\"rank\":\"\",\"position\":\"funk5\"},{\"attendances\":{},\"firstName\":\"\",\"lastName\":\"Klenner2\",\"rank\":\"\",\"position\":\"funk5\"}]}}",
        "{\"name\":\"S6\",\"department\":{\"name\":\"S6\",\"persons\":[{\"attendances\":{},\"firstName\":\"\",\"lastName\":\"Tischler\",\"rank\":\"\",\"position\":\"\"},{\"attendances\":{},\"firstName\":\"\",\"lastName\":\"Pointinger\",\"rank\":\"\",\"position\":\"\"},{\"attendances\":{},\"firstName\":\"\",\"lastName\":\"Stevic\",\"rank\":\"\",\"position\":\"\"},{\"attendances\":{},\"firstName\":\"\",\"lastName\":\"Vural\",\"rank\":\"\",\"position\":\"\"},{\"attendances\":{},\"firstName\":\"\",\"lastName\":\"Neuböck\",\"rank\":\"\",\"position\":\"\"},{\"attendances\":{},\"firstName\":\"\",\"lastName\":\"Mayerhofer\",\"rank\":\"\",\"position\":\"\"}]}}"
    ];
    for (let i of temp) {
      let dep = JSON.parse(i).department as Department;
      this.data.push(new Department(dep.name, dep.persons));
    }
    console.log(this.data);
  }

  openFileTest(event: Event) {
    let files: FileList | null = (event.target as HTMLInputElement).files;
    
    if (files && files[0]) {
      this.activeFile = files[0];
      this._readExcelFile(this.activeFile);
    }

    (event.target as HTMLInputElement).value = "";
  }

  _readExcelFile(file: File) {
    this.foundSheetsList = [];
    this.loadingActive.next(true);

    readSheetNames(file).then((sheetNames: string[]) => {
      let i = 0;

      if (sheetNames.length === 0) {
        this.loadingActive.next(false);
      }

      for (let name of sheetNames) {
        readXlsxFile(file, {sheet: name}).then(rows => {
          try {
            this.foundSheetsList.push({name: name, obj: this.interpretSheetFormat(name, rows)});
          }
          catch(e: any) {
            this.foundSheetsList.push({name: name, error: e});
          }
          ++i;

          if (i === sheetNames.length) {
            this.loadingActive.next(false);
            this.modalMode.next(ModalModes.OLD_EXCEL);
          }
        });
      }
    });
  }

  interpretSheetFormat(sheetName: string, sheetContent: any): {department: Department, year: number, attendanceTypes: string[], daysCount: number} {
    let dep = new Department(sheetName);
    let attendanceTypes: string[] = [];
    let year: number = NaN;

    // Hilfsvariablen
    let days: {day: number, month: number, rowIndex: number}[] = [];
    let firstElementNameRow = -1;
    let lastElementNameRow = -1;
    let lastNameColumn = -1;
    let firstNameColumn = -1;
    let functionColumn = -1;
    let fromColumn = -1;
    let toColumn = -1;
    let rankColumn = -1;

    // Datum-Liste suche
    let firstRow = sheetContent[0];
    for (let i = 0; i < firstRow.length; ++i) {
      if (typeof firstRow[i] === "string" && firstRow[i].match("^[0-3]?[0-9]\\.[0-1]?[0-9]\\.?$")) {
        let parts: string[] = firstRow[i].split(".");

        days.push({day: Number.parseInt(parts[0]), month: Number.parseInt(parts[1]), rowIndex: i});
      }
    }

    if (days.length === 0) {
      throw "datum not ok";
    }

    // Spalten Indizes finden
    for (let i = 0; i < sheetContent.length && i < 10; ++i) {
      lastNameColumn = this.containsIgnoreCase(sheetContent[i], ["name", "nachname"]);

      if (lastNameColumn !== -1) {
        firstElementNameRow = i + 1;

        firstNameColumn = sheetContent[i].indexOf("vorname");
        functionColumn = sheetContent[i].indexOf("funktion");
        fromColumn = sheetContent[i].indexOf("von");
        toColumn = sheetContent[i].indexOf("bis");
        rankColumn = sheetContent[i].indexOf("rang");

        break;
      }
    }

    if (lastNameColumn === -1) {
      throw "header not ok";
    }

    // Personen suchen
    let funktion = "";

    for (let i = firstElementNameRow; i < sheetContent.length; ++i) {
      // Prüfen ob alle Personen durchgegangen
      let keywords = ["gesammt", "summen", "summe"];
      let check = (columnId: number): boolean => {return keywords.indexOf(this.getRowValue(sheetContent[i], columnId).toLocaleLowerCase()) !== -1}

      if (check(lastNameColumn) || check(functionColumn) || check(fromColumn) || check(toColumn)) {
        lastElementNameRow = i - 1;
        break;
      }


      // Prüfen auf leere Zeile
      if (sheetContent[i][lastNameColumn] === null) {
        for (let temp of sheetContent[i]) {
          if (temp !== null) {
            throw "person sus";
          }
        }

        continue;
      }

      // Anwesenheiten lesen
      let attendances: any = {};

      for (let dayElement of days) {
        let value = sheetContent[i][dayElement.rowIndex];

        if (value !== null) {
          if (attendanceTypes.indexOf(value) === -1) {
            attendanceTypes.push(value);
          }

          attendances[dayElement.day.toString() + "." + dayElement.month.toString()] = value;
        }
      }

      // Person hinzufügen
      let firstName: string;
      let lastName: string = sheetContent[i][lastNameColumn];
      funktion = this.getRowValue(sheetContent[i], functionColumn, funktion);

      if (firstNameColumn === -1) {
        let temp: string[] = lastName.split(" ", 1);

        firstName = temp.length > 1 ? temp[1] : "";
        lastName = temp[0];
      }
      else {
        firstName = this.getRowValue(sheetContent[i], firstNameColumn);
      }

      dep.addPerson(new Person(lastName
                                , funktion
                                , this.getRowValue(sheetContent[i], rankColumn)
                                , firstName
                                , attendances
                    ));
    }

    // Liste von Anweseneheits-Kürzel finden
    let columnIndex = -1;

    for (let i = lastElementNameRow + 1; i < sheetContent.length; ++i) {
      if (columnIndex === -1) {
        if (this.containsIgnoreCase(sheetContent[i], ["Drop-Down-Items"]) !== -1) {
          columnIndex = this.containsIgnoreCase(sheetContent[i], ["Drop-Down-Items"]);
        }
      }
      else {
        if (sheetContent[i][columnIndex] === null) {
          break;
        }
        else {
          if (attendanceTypes.indexOf(sheetContent[i][columnIndex]) === -1) {
            attendanceTypes.push(sheetContent[i][columnIndex]);
          }
        }
      }
    }

    // Jahr finden
    if (firstElementNameRow > 1 && days[0].rowIndex > 3 && sheetContent[1][3] !== null && ((typeof sheetContent[1][3] === "string" && sheetContent[1][3].match("^(1-9)(0-9){3}$")) || (typeof sheetContent[1][3] === "number" && sheetContent[1][3] < 10000 && sheetContent[1][3] > 999))) {
      if (typeof sheetContent[1][3] === "string") {
        year = Number.parseInt(sheetContent[1][3]);
      }
      else {
        year = sheetContent[1][3];
      }
    }

    console.log({department: dep, year: year, attendanceTypes: attendanceTypes, daysCount: days.length} );

    return {department: dep, year: year, attendanceTypes: attendanceTypes, daysCount: days.length};
  }

  containsIgnoreCase(arr: string[], matches: string[]): number {
    for (let i = 0; i < matches.length; ++i) {
      matches[i] = matches[i].toLocaleLowerCase();
    }

    for (let i = 0; i < arr.length; ++i) {
      if (typeof(arr[i]) === "string" && matches.indexOf(arr[i].toLocaleLowerCase()) !== -1) {
        return i;
      }
    }

    return -1;
  }

  getRowValue(row: string[], index: number, alternativ: any = ""): any {
    if (index === -1 || row[index] === null) {
      return alternativ;
    }

    return row[index];
  }

  mergeArrays<Type>(arr1: Type[], arr2: Type[]): Type[] {
    for (let value of arr2) {
      if (arr1.indexOf(value) === -1) {
        arr1.push(value);
      }
    }

    return arr1;
  }

  getArray(length: number): Array<any> {
    return new Array(length);
  }
}

export enum ModalModes{ NONE, OLD_EXCEL, PERSON }; 