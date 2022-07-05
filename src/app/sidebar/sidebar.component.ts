import { Component, OnInit } from '@angular/core';
import { DataService, ModalModes } from '../services/data.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  ModalModes = ModalModes;

  constructor(public dataService: DataService) { }

  ngOnInit(): void {
  }

}
