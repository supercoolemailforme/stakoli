import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-read-old-excel-modal',
  templateUrl: './read-old-excel-modal.component.html',
  styleUrls: ['./read-old-excel-modal.component.css']
})
export class ReadOldExcelModalComponent implements OnInit {

  dataService: DataService;

  constructor(data: DataService) {
    this.dataService = data;
  }

  ngOnInit(): void {
  }

}
