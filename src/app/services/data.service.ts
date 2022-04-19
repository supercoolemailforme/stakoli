import { Injectable } from '@angular/core';
import { Observable, Subject, Subscriber } from 'rxjs';
import readXlsxFile, { readSheetNames } from 'read-excel-file';

@Injectable({
  providedIn: 'root'
})
export class DataService {

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
                    ]};


  // utility-variables
  loadingActive = new Subject<boolean>();

  constructor() { 
    this.loadingActive.next(true);
  }

  openFileTest(event: Event) {
    let files = (event.target as HTMLInputElement).files;
    
    if (files && files[0]) {
      this.loadingActive.next(true);

      let file: File = files[0];

      readSheetNames(file).then((sheetNames: string[]) => {
        let i = 0;

        if (sheetNames.length === 0) {
          this.loadingActive.next(false);
        }

        for (let name of sheetNames) {
          readXlsxFile(file, {sheet: name}).then(rows => {
            console.log(rows);
            ++i;

            if (i === sheetNames.length) {
              this.loadingActive.next(false);
            }
          });
        }
      });
    }
  }
}
