import {Pipe, PipeTransform} from '@angular/core';
/*
 * Converts newlines into html breaks
*/
@Pipe({ name: 'arrayToString' })
export class ArrayToStringPipe implements PipeTransform {
    transform(value: string, args?: string[]): any {
        return value.toString().replace(',', ', ');
    }
}