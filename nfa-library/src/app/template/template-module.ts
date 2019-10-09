import {NgModule} from '@angular/core';
import {SharedComponentsModule} from '../shared-component-module/shared-component-module';
import {MenuComponent} from './menu-component/menu-component';
import {MainTemplateComponent} from './main-template-component/main-template-component';
import {RouterModule} from '@angular/router';
import {ToastMessageComponent} from './message-component/toast-message-component/toast-message-component';
import {DominiSelectionComponent} from './domini-selection-component/domini-selection-component';
import {ToolbarComponent} from './toolbar/toolbar-component';
import {DialogMessageComponent} from './message-component/dialog-message-component/dialog-message-component';


/**
 * Modulo per definire template quali menu e layout
 */
@NgModule({
  declarations: [
    MenuComponent,
    MainTemplateComponent,
    DominiSelectionComponent,
    ToastMessageComponent,
    DialogMessageComponent,
    ToolbarComponent
  ],
  imports: [
    RouterModule,
    SharedComponentsModule,
  ],
  exports: [
    MenuComponent,
    MainTemplateComponent,
    DominiSelectionComponent,
    ToolbarComponent
  ],
  entryComponents: [],
  providers: []
})
export class TemplateModule {
}
