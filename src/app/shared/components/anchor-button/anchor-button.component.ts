import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output } from '@angular/core';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-anchor-button',
  imports: [],
  templateUrl: './anchor-button.component.html',
  styleUrl: './anchor-button.component.scss'
})
export class AnchorButtonComponent {
  @Input() buttonText!: string;
  @Input() isDisabled = false;

  @Output() click = new EventEmitter<void>();


  handleClick(): void {
    this.click.emit();
  }
}
