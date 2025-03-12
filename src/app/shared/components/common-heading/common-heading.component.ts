import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-common-heading',
  imports: [CommonModule],
  templateUrl: './common-heading.component.html',
  styleUrl: './common-heading.component.scss'
})
export class CommonHeadingComponent {
  @Input() title!: string;
  @Input() subtitle?: string;
  @Input() tertiaryTitle?: string;
}
