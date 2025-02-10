// communication.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  // Subject para emitir eventos (en este caso, para refrescar la lista)
  private refreshSubject = new Subject<any>();

  // Observable al que se pueden suscribir otros componentes
  refreshObservable$ = this.refreshSubject.asObservable();

  // Método para emitir el evento de refresco
  emitRefreshEvent(data: any) {
    this.refreshSubject.next(data);
  }
}
