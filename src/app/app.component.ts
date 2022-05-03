import { Component } from '@angular/core';
import { Person } from './data-models/department';
import { DataService, ModalModes } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  dataService: DataService;
  modalModes = ModalModes;

  activeModalMode: ModalModes = ModalModes.NONE;

  constructor(data: DataService) {
    this.dataService = data;

    data.modalMode.subscribe(mm => {
      this.activeModalMode = mm;
    });
  }

  newPerson(): Person {
    return new Person("");
  }
}
