import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service'; 
import { AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ViewWillEnter } from '@ionic/angular';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonInput,
  IonButton,
  IonLabel,
  IonRadioGroup,
  IonRadio,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonDatetime,
  IonList,
  IonAvatar,
  IonSpinner, IonRefresher, IonRefresherContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  standalone: true,
  imports: [IonRefresherContent, IonRefresher, IonSpinner, IonAvatar, IonList, CommonModule,
    IonDatetime,
    IonInput,
    IonItem,
    IonButton,
    IonLabel,
    IonRadio,
    IonRadioGroup,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
  ],
})

export class NotificationsComponent implements OnInit, ViewWillEnter {
  pendingRequests: any[] = []; // Lista de solicitudes pendientes
  isLoading = true; // Mostrar spinner mientras se cargan los datos

  constructor(
    private usersService: UsersService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadPendingRequests(); // Primera carga al inicializar el componente
  }

  ionViewWillEnter() {
    this.loadPendingRequests(); // Recargar las solicitudes al entrar en la vista
  }

  // Función para cargar las solicitudes pendientes
  loadPendingRequests() {
    this.isLoading = true;
    this.usersService.getPendingRequests().subscribe({
      next: (response) => {
        this.pendingRequests = response.pendingRequests;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar solicitudes pendientes:', error);
        this.isLoading = false;
      },
    });
  }

  // Manejar el refresco al arrastrar hacia abajo
  doRefresh(event: any) {
    this.usersService.getPendingRequests().subscribe({
      next: (response) => {
        this.pendingRequests = response.pendingRequests;
        event.target.complete(); // Detener el indicador de refresco
      },
      error: (error) => {
        console.error('Error al cargar solicitudes pendientes:', error);
        event.target.complete(); // Detener el indicador incluso en caso de error
      },
    });
  }

  // Aceptar solicitud de amistad
  acceptRequest(friendId: number) {
    this.usersService.acceptFriendRequest(friendId).subscribe({
      next: () => {
        this.loadPendingRequests();
      },
      error: (error) => {
        console.error('Error al aceptar la solicitud:', error);
      },
    });
  }

  // Rechazar solicitud de amistad
  rejectRequest(friendId: number) {
    this.usersService.deleteFriend(friendId).subscribe({
      next: () => {
        this.loadPendingRequests();
      },
      error: (error) => {
        console.error('Error al rechazar la solicitud:', error);
      },
    });
  }
}