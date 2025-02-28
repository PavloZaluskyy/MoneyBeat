import { Component, inject, signal, TemplateRef, ViewEncapsulation, WritableSignal } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  // encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
  private offcanvasService = inject(NgbOffcanvas);
  closeResult: WritableSignal<string> = signal('');
  open(content: TemplateRef<any>) {
		this.offcanvasService.open(content, { ariaLabelledBy: 'offcanvas-basic-title' }).result.then(
			
		);
	}
  openEnd(content: TemplateRef<any>) {
		this.offcanvasService.open(content, { position: 'end' });
	}
}
