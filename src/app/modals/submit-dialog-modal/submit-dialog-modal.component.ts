import { NgTemplateOutlet } from '@angular/common';
import { TemplateLiteral, TemplateLiteralElement } from '@angular/compiler';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-submit-dialog-modal',
  templateUrl: './submit-dialog-modal.component.html',
  styleUrls: ['./submit-dialog-modal.component.css']
})
export class SubmitDialogModalComponent implements OnInit {

  @Input() textTemplate!: TemplateRef<any>;
  @Input() dialogMode: SubmitDialogOption = SubmitDialogOption.Ok;
  @Output() OnResult: EventEmitter<SubmitDialogResult> = new EventEmitter<SubmitDialogResult>();

  SubmitDialogOption = SubmitDialogOption;
  SubmitDialogResult = SubmitDialogResult;

  constructor() { }

  ngOnInit(): void {
    console.log(this.textTemplate);
  }

  emitResult(result: SubmitDialogResult) {
    this.OnResult.emit(result);
  }

}

export enum SubmitDialogOption {YesNo, YesNoCancle, Ok}
export enum SubmitDialogResult {Ok, Yes, No, Cancle}