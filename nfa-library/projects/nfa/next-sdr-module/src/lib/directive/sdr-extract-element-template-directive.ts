import {AfterViewInit, Directive, ElementRef, EventEmitter, OnInit, Output, ViewContainerRef} from '@angular/core';

/**
 * Una direttiva che aggiunge l'evento onElementExtracted sul tag su cui viene applicata.
 * L'evento onElementExtracted torna l'{@link ElementRef} del tag su cui è applicata
 * non appena la direttiva viene inizializzata.
 */
@Directive({
  selector: '[sdrExtractElement]',
})
export class SdrExtractElementFromTemplateDirective implements OnInit{

  @Output() onElementExtracted = new EventEmitter<ElementRef>();

  protected lunched = false;

  constructor( private vcRef: ViewContainerRef) {}


  // @Input() set sdrExtractInstance(element: any) {
  //
  //   if (element && !this.lunched) {
  //     this.onInstanceExtracted.emit(element);
  //     this.lunched = true;
  //   }
  // }


  ngOnInit(): void {
    if (this.vcRef && this.vcRef.element && !this.lunched) {
      this.onElementExtracted.emit(this.vcRef.element);
      this.lunched = true;
    }
  }




}
