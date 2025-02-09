import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalize',
  standalone: true // Añadir esta línea para hacerlo standalone
})
export class CapitalizePipe implements PipeTransform {
  transform(value: any): string {
    if (typeof value !== 'string' || !value) {
      return ''; // Devuelve una cadena vacía si el valor no es válido
    }
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
}
