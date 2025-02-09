import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service'; 
import { CommonModule } from '@angular/common';
import { ViewWillEnter } from '@ionic/angular';
import { MenuComponent } from '../menu/menu.component';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonAvatar,
  IonLabel,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonSpinner,
  IonRefresher,
  IonRefresherContent, 
  IonButtons, 
  IonIcon, IonSearchbar } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.page.html',
  styleUrls: ['./friends-list.page.scss'],
  standalone: true,
  imports: [IonSearchbar, 
    IonIcon, 
    IonButtons, 
    MenuComponent, 
    RouterLink,
    IonRefresherContent,
    IonRefresher,
    IonSpinner,
    IonAvatar,
    IonList,
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonButton,
    IonLabel
  ],
})
export class FriendsListPage implements OnInit, ViewWillEnter {
  acceptedFriends: any[] = []; // Lista de amigos aceptados
  filteredFriends: any[] = []; // Lista filtrada según búsqueda
  isLoading = true; // Mostrar spinner mientras se cargan los datos

  constructor(private usersService: UsersService) {
    addIcons({ arrowBackOutline });
  }

  ngOnInit() {
    this.loadAcceptedFriends(); // Cargar amigos al inicializar el componente
  }

  ionViewWillEnter() {
    this.loadAcceptedFriends(); // Recargar amigos al entrar en la vista
  }

  // Cargar lista de amigos aceptados
  loadAcceptedFriends() {
    this.isLoading = true;

    this.usersService.getAcceptedFriends().subscribe({
      next: (response) => {
        const userId = parseInt(localStorage.getItem('userId') || '0', 10);

        this.acceptedFriends = response.map((friend: any) => {
          const friendData = friend.user;
          return {
            user: friendData.user,
            email: friendData.email,
            photo: friendData.person?.photo
              ? `http://localhost:3000${friendData.person.photo}`
              : '/assets/default-profile.png',
            id: friendData.id,
          };
        });

        this.filteredFriends = [...this.acceptedFriends]; // Inicialmente muestra todos los amigos
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar amigos aceptados:', error);
        this.isLoading = false;
      },
    });
  }

  // Refrescar la lista de amigos al arrastrar hacia abajo
  doRefresh(event: any) {
    this.loadAcceptedFriends();
    event.target.complete();
  }

  // Filtrar amigos según la búsqueda
  onSearchChange(event: any) {
    const query = event.target.value.toLowerCase();
    if (query && query.trim() !== '') {
      this.filteredFriends = this.acceptedFriends.filter((friend) =>
        friend.user.toLowerCase().includes(query) ||
        friend.email.toLowerCase().includes(query)
      );
    } else {
      this.filteredFriends = [...this.acceptedFriends];
    }
  }
}
