import { Component, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import {
  FormGroup,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { DatePipe, JsonPipe } from '@angular/common';


interface FormData {
  start_time: string;
  end_time: string;
  resolution: number | null;
  field: string;
}

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    JsonPipe,
  ],
  providers: [DatePipe],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
})
export class FormComponent {
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  formData: FormData = {
    start_time: '',
    end_time: '',
    resolution: null,
    field: '',
  };

  constructor(private datePipe: DatePipe) {
  }

  @Output() submitEvent = new EventEmitter<FormData>();

  /**
   * Lifecycle hook that is called when any input property changes.
   * It applies the filter/query criterias.
   * It resets all selected filters if reset input is true.
   *
   * @param changes - SimpleChanges object containing the changed properties
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reset'] && changes['reset'].currentValue) {
      this.handleReset();
    }
  }

  /**
   * Handles the reset operation by resetting the search data.
   */
  handleReset(): void {
    this.formData = {
      start_time: '',
      end_time: '',
      resolution: null,
      field: 'string',
    };
    this.submitEvent.emit(this.formData);
  }

  /**
   * Handles the apply operation by emitting data.
   */
  handleApply(): void {
    this.submitEvent.emit(this.formData);
  }

  /**
   * Handles the change event when a panel item changes.
   *
   * @param event - Event object containing the changed data
   */
  handleChange(event: any): void {
    this.formData = {
      ...this.formData,
      [event.key as keyof FormData]: event.value,
    };
  }
}
