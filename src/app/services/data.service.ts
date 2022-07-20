import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import readXlsxFile, { readSheetNames } from 'read-excel-file';
import { Department, Person } from '../data-models/department';
import { Integer } from 'read-excel-file/types';
import { EventHandlerVars } from '@angular/compiler/src/compiler_util/expression_converter';
import { EventManager } from '@angular/platform-browser';
import { setUncaughtExceptionCaptureCallback } from 'process';

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
  attendanceTypes: string[] = ['K', 'Anw', 'DZ', 'AE', 'P', 'DR', 'ADR', '---', 'A', 'WWWW', 'MMMM', 'ZZZZ'];
  ranksRekrut: {long: string, short: string}[] = [{long: "Rekrut", short: "Rekr"}];
  ranksChargen: {long: string, short: string}[] = [{long: "Gefreiter", short: "Gfr"}, {long: "Korporal", short: "Kpl"}, {long: "Zugsführer", short: "Zgf"}];
  ranksUO: {long: string, short: string}[] = [{long: "Wachtmeister", short: "Wm"}, {long: "Oberwachtmeister", short: "OWm"}, {long: "Stabswachtmeister", short: "StWm"}, {long: "Oberstabswachtmeister", short: "OStWm"}, {long: "Offiziersstellvertreter", short: "OStv"}, {long: "Vizeleutnant", short: "Vzlt"}];
  ranksOffizier: {long: string, short: string}[] = [{long: "Fähnrich", short: "Fhr"}, {long: "Leutnant", short: "Lt"}, {long: "Oberleutnant", short: "Olt"}, {long: "Hauptmann", short: "Hptm"}, {long: "Major", short: "Mjr"}, {long: "Oberstleutnant", short: "Obstlt"}, {long: "Oberst", short: "Obst"}, {long: "Brigadier", short: "Bgdr"}, {long: "Generalmajor", short: "GenMjr"}, {long: "Generalleutnant", short: "GenLt"}, {long: "General", short: "Gen"}];

  get ranks(): {long: string, short: string}[] {
    return [...this.ranksRekrut, ...this.ranksChargen, ...this.ranksUO, ...this.ranksOffizier];
  }
  year: number = 2022;

  OnNewDataApplied: EventEmitter<string> = new EventEmitter<string>();

  selectedPerson: {departmentIndex: number, personIndex: number} | undefined = undefined;
  editPerson: Person | undefined;
  OnAddPersonEvent: undefined | ((p: Person | undefined) => void) = undefined;


  // utility-variables
  loadingActive = new Subject<boolean>();
  modalMode = new Subject<ModalModes>();

  // readData
  foundSheetsList: any[] = [];
  activeFile: File | null = null;
  //fileHandle: FileSystemFileHandle | null = null;
  fileHandle: any;
  get IsFileOpen(): boolean {
    return this.temp;
  }
  temp: boolean = true;




  constructor() { 
    this.loadingActive.next(true);
    this.modalMode.next(ModalModes.NONE);

    this.foundSheetsList = JSON.parse('[{"name":"Dienstbetrieb","obj":{"department":{"name":"Dienstbetrieb","persons":[{"attendances":{},"firstName":"","lastName":"Brugger","rank":"","position":"funk1"},{"attendances":{"3.1":"K","4.1":"K","5.1":"K","6.1":"K","7.1":"K","8.1":"K","2.1":"K","2.2":"K","2.3":"K"},"firstName":"","lastName":"Hutka","rank":"","position":"funk2"},{"attendances":{"5.1":"K","6.1":"Anw","7.1":"Anw"},"firstName":"","lastName":"Rumpler","rank":"","position":"funk3"},{"attendances":{"5.1":"Anw","6.1":"Anw","7.1":"Anw"},"firstName":"","lastName":"Blasl","rank":"","position":"funk3"},{"attendances":{},"firstName":"","lastName":"Mayer","rank":"","position":"funk4"},{"attendances":{},"firstName":"","lastName":"Medwenitsch","rank":"","position":"funk5"},{"attendances":{"4.1":"DZ","5.1":"DZ","6.1":"AE","7.1":"Anw","8.1":"Anw"},"firstName":"","lastName":"Seidl","rank":"","position":"funk5"},{"attendances":{"3.1":"DZ","4.1":"DZ","5.1":"DZ","6.1":"AE","7.1":"Anw","8.1":"Anw"},"firstName":"","lastName":"Klenner","rank":"","position":"funk5"}]},"year":2021,"attendanceTypes":["K","Anw","DZ","AE"],"daysCount":9}},{"name":"Dienstbetrieb_2","obj":{"department":{"name":"Dienstbetrieb_2","persons":[{"attendances":{"3.1":"K","4.1":"K","5.1":"K","6.1":"K","7.1":"K","8.1":"K","2.1":"K","2.2":"K","2.3":"K"},"firstName":"","lastName":"Brugger2","rank":"","position":"funk1"},{"attendances":{"5.1":"K","6.1":"Anw","7.1":"Anw"},"firstName":"","lastName":"Hutka2","rank":"","position":"funk2"},{"attendances":{"5.1":"Anw","6.1":"Anw","7.1":"Anw"},"firstName":"","lastName":"Rumpler2","rank":"","position":"funk3"},{"attendances":{"4.1":"DZ","5.1":"DZ","6.1":"AE","7.1":"Anw","8.1":"Anw"},"firstName":"","lastName":"Medwenitsch2","rank":"","position":"funk5"},{"attendances":{"3.1":"DZ","4.1":"DZ","5.1":"DZ","6.1":"AE","7.1":"Anw","8.1":"Anw"},"firstName":"","lastName":"Seidl2","rank":"","position":"funk5"},{"attendances":{},"firstName":"","lastName":"Klenner2","rank":"","position":"funk5"}]},"year":null,"attendanceTypes":["K","Anw","DZ","AE"],"daysCount":9}},{"name":"S6","obj":{"department":{"name":"S6","persons":[{"attendances":{},"firstName":"","lastName":"Tischler","rank":"","position":""},{"attendances":{},"firstName":"","lastName":"Pointinger","rank":"","position":""},{"attendances":{},"firstName":"","lastName":"Stevic","rank":"","position":""},{"attendances":{},"firstName":"","lastName":"Vural","rank":"","position":""},{"attendances":{},"firstName":"","lastName":"Neuböck","rank":"","position":""},{"attendances":{},"firstName":"","lastName":"Mayerhofer","rank":"","position":""}]},"year":2022,"attendanceTypes":["Anw","P","DR","ADR","---","A"],"daysCount":10}},{"name":"Gesammt","error":{"message": "header unreadable"}}]');

    for (let sheet of this.foundSheetsList) {
      if (!sheet.obj) {
        continue;
      }

      if (sheet.obj.year === null) {
        sheet.obj.year = NaN;
      }

      let p: Person[] = [];
      
      console.log(sheet);

      for (let person of sheet.obj.department.persons) {
        p.push(new Person(person.lastName, person.position, person.rank, person.firstName, person.attendances));
      }

      sheet.obj.department.persons = p;
    }

    let temp = [
        "{\"name\":\"Dienstbetrieb\",\"department\":{\"name\":\"Dienstbetrieb\",\"persons\":[{\"attendances\":{},\"firstName\":\"Anton\",\"lastName\":\"Brugger\",\"rank\":\"Hptm\",\"position\":\"Kommandant\"},{\"attendances\":{\"3.1\":\"K\",\"4.1\":\"K\",\"5.1\":\"K\",\"6.1\":\"K\",\"7.1\":\"K\",\"8.1\":\"K\",\"2.1\":\"K\",\"2.2\":\"K\",\"2.3\":\"K\"},\"firstName\":\"\",\"lastName\":\"Hutka\",\"rank\":\"\",\"position\":\"funk2\"},{\"attendances\":{\"5.1\":\"K\",\"6.1\":\"Anw\",\"7.1\":\"Anw\"},\"firstName\":\"\",\"lastName\":\"Rumpler\",\"rank\":\"\",\"position\":\"funk3\"},{\"attendances\":{\"5.1\":\"Anw\",\"6.1\":\"Anw\",\"7.1\":\"Anw\"},\"firstName\":\"\",\"lastName\":\"Blasl\",\"rank\":\"\",\"position\":\"funk3\"},{\"attendances\":{},\"firstName\":\"\",\"lastName\":\"Mayer\",\"rank\":\"\",\"position\":\"funk4\"},{\"attendances\":{},\"firstName\":\"\",\"lastName\":\"Medwenitsch\",\"rank\":\"\",\"position\":\"funk5\"},{\"attendances\":{\"4.1\":\"DZ\",\"5.1\":\"DZ\",\"6.1\":\"AE\",\"7.1\":\"Anw\",\"8.1\":\"Anw\"},\"firstName\":\"\",\"lastName\":\"Seidl\",\"rank\":\"\",\"position\":\"funk5\"},{\"attendances\":{\"3.1\":\"DZ\",\"4.1\":\"DZ\",\"5.1\":\"DZ\",\"6.1\":\"AE\",\"7.1\":\"Anw\",\"8.1\":\"Anw\"},\"firstName\":\"\",\"lastName\":\"Klenner\",\"rank\":\"\",\"position\":\"funk5\"}]}}",
        "{\"name\":\"Dienstbetrieb_2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\",\"department\":{\"name\":\"Dienstbetrieb_2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\",\"persons\":[{\"attendances\":{\"3.1\":\"K\",\"4.1\":\"K\",\"5.1\":\"K\",\"6.1\":\"K\",\"7.1\":\"K\",\"8.1\":\"K\",\"2.1\":\"K\",\"2.2\":\"K\",\"2.3\":\"K\"},\"firstName\":\"\",\"lastName\":\"Brugger2\",\"rank\":\"\",\"position\":\"funk1\"},{\"attendances\":{\"5.1\":\"K\",\"6.1\":\"Anw\",\"7.1\":\"Anw\"},\"firstName\":\"\",\"lastName\":\"Hutka2\",\"rank\":\"\",\"position\":\"funk2\"},{\"attendances\":{\"5.1\":\"Anw\",\"6.1\":\"Anw\",\"7.1\":\"Anw\"},\"firstName\":\"\",\"lastName\":\"Rumpler2\",\"rank\":\"\",\"position\":\"funk3\"},{\"attendances\":{\"4.1\":\"DZ\",\"5.1\":\"DZ\",\"6.1\":\"AE\",\"7.1\":\"Anw\",\"8.1\":\"Anw\"},\"firstName\":\"\",\"lastName\":\"Medwenitsch2\",\"rank\":\"\",\"position\":\"funk5\"},{\"attendances\":{\"3.1\":\"DZ\",\"4.1\":\"DZ\",\"5.1\":\"DZ\",\"6.1\":\"AE\",\"7.1\":\"Anw\",\"8.1\":\"Anw\"},\"firstName\":\"\",\"lastName\":\"Seidl2\",\"rank\":\"\",\"position\":\"funk5\"},{\"attendances\":{},\"firstName\":\"\",\"lastName\":\"Klenner2\",\"rank\":\"\",\"position\":\"funk5\"}]}}",
        "{\"name\":\"S6\",\"department\":{\"name\":\"S6\",\"persons\":[{\"attendances\":{},\"firstName\":\"\",\"lastName\":\"Tischler\",\"rank\":\"\",\"position\":\"\"},{\"attendances\":{},\"firstName\":\"\",\"lastName\":\"Pointinger\",\"rank\":\"\",\"position\":\"\"},{\"attendances\":{},\"firstName\":\"\",\"lastName\":\"Stevic\",\"rank\":\"\",\"position\":\"\"},{\"attendances\":{},\"firstName\":\"\",\"lastName\":\"Vural\",\"rank\":\"\",\"position\":\"\"},{\"attendances\":{},\"firstName\":\"Alexander Leopold\",\"lastName\":\"Neuböck-Trpisovsky\",\"rank\":\"Rekr\",\"position\":\"Cyber-Gwd\"},{\"attendances\":{},\"firstName\":\"Maximilian\",\"lastName\":\"Mayerhofer\",\"rank\":\"Gefr\",\"position\":\"Cyber-Gwd\"}]}}"
    ];
    for (let i of temp) {
      let dep = JSON.parse(i).department as Department;
      let pers: Person[] = [];

      for (let p of dep.persons) {
        pers.push(new Person(p.lastName, p.position, p.rank, p.firstName, p.attendances));
      }

      this.data.push(new Department(dep.name, pers));
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
      throw {"message": "no days found"};
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
      throw {"message": "header unreadable"};
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
            throw {message: "person undetectable", row: i, column: lastNameColumn};
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

  getRankIndex(rank: string): number {
    for (let i = 0; i < this.ranks.length; ++i) {
      if (this.ranks[i].short === rank || this.ranks[i].long === rank) {
        return i;
      }
    }

    return -1;
  }

  getRankLong(rank: string): string {
    let idx = this.getRankIndex(rank);

    if (idx !== -1) {
      return this.ranks[idx].long;
    }
    else {
      return rank;
    }
  }

  async openDialog() {
    if (!(<WindowWithChromeFilePicker>window).showOpenFilePicker) {
      alert("Dieser Browser unterstützt keinen Chromium-File-Dialog");
      return;
    }
    [this.fileHandle] = await (<WindowWithChromeFilePicker>window).showOpenFilePicker({types: [{description: "StaKoLi File", accept: {"stakoli/input": [".json"]}}], excludeAcceptAllOption: true, multiple: false});
    if (!this.fileHandle) {
      return;
    }
    console.log(this.fileHandle);
    //console.log(((await this.fileHandle.getFile()).stream().));
    await this.saveToHandle();
  }

  async saveToHandle() {/*
    if (this.fileHandle) {
      const stream = await this.fileHandle.createWritable();
      const data = this.data;
      await stream.write({type: "write", position: 0, data: new TextEncoder().encode("const data=" + JSON.stringify(data))});
      await stream.close();
    }*/
  }

  getLocalStorage(key: string, altValue: any): any {
    return window.localStorage.getItem(key) !== null ? window.localStorage.getItem(key) : altValue;
  }
}


type WindowWithChromeFilePicker = Window & typeof globalThis & {showOpenFilePicker: (options: {types: {description: string, accept: {[name: string]: string[]}}[], excludeAcceptAllOption: boolean, multiple: boolean}) => any[]};

export enum ModalModes{ NONE, OLD_EXCEL, PERSON, PERSON_MAIN, ATTENDANCES_LIST }; 