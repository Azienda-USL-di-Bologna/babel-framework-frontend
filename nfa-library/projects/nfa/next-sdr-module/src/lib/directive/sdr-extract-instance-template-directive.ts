import {AfterViewInit, Directive, EventEmitter, OnInit, Output, ViewContainerRef} from '@angular/core';

/**
 * Una direttiva che aggiunge l'evento onInstanceExtracted sul tag su cui viene applicata.
 * L'evento onInstanceExtracted torna l'istanza del tag, se presente, su cui è applicata
 * non appena la direttiva viene inizializzata.
 * ATTENZIONE non vengono usati metodi previsti dalle api ma metodi interni, per cui su future release di angular potrebbe non funzionare!
 */
@Directive({
  selector: '[sdrExtractInstance]',
})
export class SdrExtractInstanceFromTemplateDirective implements OnInit{

  @Output() onInstanceExtracted = new EventEmitter<any>();

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
    const a: any = this.vcRef;
    if (a && a._data && a._data.componentView && a._data.componentView.component  && !this.lunched) {
      this.onInstanceExtracted.emit(a._data.componentView.component);
      this.lunched = true;
    }
  }




}
