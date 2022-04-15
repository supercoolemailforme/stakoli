import { Injectable } from '@angular/core';

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

  constructor() { }
}
