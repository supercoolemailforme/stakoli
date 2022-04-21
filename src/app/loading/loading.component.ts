import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  active: boolean = false;
  _active: Subscription;


  constructor(data: DataService) {
    this._active = data.loadingActive.subscribe(value => {
      this.active = value;
    });
  }

  ngOnInit(): void {
    
  }

}
