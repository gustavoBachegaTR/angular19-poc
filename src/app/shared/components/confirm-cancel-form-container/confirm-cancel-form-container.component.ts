import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output } from '@angular/core';
import { CommonHeadingComponent } from '../common-heading/common-heading.component';
import { AnchorButtonComponent } from "../anchor-button/anchor-button.component";

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-confirm-cancel-form-container',
  imports: [CommonModule, CommonHeadingComponent, AnchorButtonComponent],
  templateUrl: './confirm-cancel-form-container.component.html',
  styleUrl: './confirm-cancel-form-container.component.scss'
})
export class ConfirmCancelFormContainerComponent {
  @Input() headerText: string = 'Form';
  @Input() subHeaderText?: string;
  @Input() isFormInvalid: boolean = false;
  @Input() isProcessing: boolean = false;
  
  @Input() acceptButtonText: string = 'Accept';
  @Input() cancelButtonText: string = 'Cancel';
  @Input() resetButtonText: string = 'Reset form';
  
  @Output() accept = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() reset = new EventEmitter<void>();
  
  onAccept(): void {
    this.accept.emit();
  }
  
  onCancel(): void {
    this.cancel.emit();
  }
  
  onReset(): void {
    this.reset.emit();
  }
}
