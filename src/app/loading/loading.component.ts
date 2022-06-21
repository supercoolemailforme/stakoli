import { Component, OnInit } from '@angular/core';
import { max, Subscription } from 'rxjs';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  active: boolean = false;
  _active: Subscription;
  overallFadeOut: boolean = false;

  dataService: DataService;

  triangleWidth = 75;
  triangleHeight = 64;
  trianglesColumnCnt = 8;
  trianglesRowCtn = 8;

  colors: string[] = 	["#343721", "#333f1f", "#3d4a35", "#4e5a43", "#626c55"];

  // utilities
  randomColorList: any = {};
  randomDisappearValueList: any = {};


  constructor(data: DataService) {
    this.dataService = data;

    this._active = data.loadingActive.subscribe(value => {
      if (this.active && !value) {
        this.overallFadeOut = true;
        setTimeout(() => {
          this.active = value;
        }, 850);
      }
      else {
        this.overallFadeOut = false;
        this.active = value;
      }
    });
  }

  ngOnInit(): void {
    
  }

  getPolygonPoints1(columnIndex: number, rowIndex: number): string {
    let output: string = "";
    let offset = rowIndex % 2 === 1 ? -0.5 : 0;

    // left-top Point
    output += this.triangleWidth * (columnIndex + offset) + ',';
    output += this.triangleHeight * rowIndex + ' ';

    // right-top Point
    output += this.triangleWidth * (columnIndex + 1 + offset) + ',';
    output += this.triangleHeight * rowIndex + ' ';

    // mittle-bottom Point
    output += this.triangleWidth * (columnIndex + 0.5 + offset) + ',';
    output += this.triangleHeight * (rowIndex + 1);

    return output;
  }

  getPolygonPoints2(columnIndex: number, rowIndex: number): string {
    let output: string = "";
    let offset = rowIndex % 2 === 1 ? -0.5 : 0;

    // left-bottom Point
    output += this.triangleWidth * (columnIndex + 0.5 + offset) + ',';
    output += this.triangleHeight * (rowIndex + 1) + ' ';

    // right-bottom Point
    output += this.triangleWidth * (columnIndex + 1.5 + offset) + ',';
    output += this.triangleHeight * (rowIndex + 1) + ' ';

    // mittle-top Point
    output += this.triangleWidth * (columnIndex + 1 + offset) + ',';
    output += this.triangleHeight * rowIndex;

    return output;
  }

  getRandomColor(columnIndex: number, rowIndex: number) {
    if (! this.randomColorList[columnIndex + " " + rowIndex]) {
      this.randomColorList[columnIndex + " " + rowIndex] = this.colors[Math.round(Math.random() * (this.colors.length - 1))];
    }
    return this.randomColorList[columnIndex + " " + rowIndex];
  }

  getDistance(columnIndex: number, rowIndex: number): number {
    return Math.min(columnIndex, (this.trianglesColumnCnt - 1) - columnIndex) + Math.min(rowIndex, (this.trianglesRowCtn - 1) - rowIndex);
  }

  getDisappearValue(columnIndex: number, rowIndex: number): boolean {
    let disappearValue = this.getDistance(columnIndex, rowIndex);

    if (disappearValue <= 1) {
      return true;
    }
    else if (disappearValue > 3) {
      return false;
    }

    if (! this.randomColorList[columnIndex + " " + rowIndex]) {
      this.randomColorList[columnIndex + " " + rowIndex] = (disappearValue + 3.5) * Math.random();
    }
    return this.randomColorList[columnIndex + " " + rowIndex] < 1.5;
  }

  getTriangleAnimationDelay(columnIndex: number, rowIndex: number): string {
    return 1.5 + (columnIndex + rowIndex) * 0.12 + 's';
  }

}
