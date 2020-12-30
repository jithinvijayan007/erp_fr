import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'positive'
})
export class PositivePipe implements PipeTransform {

  transform(value: number): number {
 
    
    return Math.abs(value);
    
  }

}
