import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Subject } from 'rxjs';
import { SafAppearance } from '../../types/saf-appearance';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-alert',
  imports: [],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent {
  message!: string;
  appearance: SafAppearance = 'success'

}
