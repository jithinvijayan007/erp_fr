// import { A2CardComponent } from './a2-components/card/card.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnlyNumber } from './onlynumber.directive';
import { OnlyInteger } from './onlyinteger.directive';
import { OnlyAlphaNum} from './onlyalphanum.directive';
import { PositivePipe } from './positive.pipe';


@NgModule({
  imports: [CommonModule],
  exports: [
        // A2CardComponent,
        OnlyNumber,
        OnlyInteger,
        OnlyAlphaNum,
        PositivePipe


  ],
  declarations: [
    // A2CardComponent,
    OnlyNumber,
    OnlyInteger,
    OnlyAlphaNum,
    PositivePipe
  ]
})
export class CardModule {}
