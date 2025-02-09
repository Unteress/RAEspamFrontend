import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { CommonModule } from '@angular/common'; 
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonItem,
  IonLabel,
  IonContent,
  IonAvatar,
  IonList,
  IonCard,
  IonCardHeader,
  IonCardTitle, IonIcon, IonRefresher, IonRefresherContent, IonButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { sendOutline, trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-list-messages',
  templateUrl: './list-messages.component.html',
  styleUrls: ['./list-messages.component.scss'],
  standalone: true,
  imports: [IonIcon, 
    RouterLink,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonList,
    IonAvatar,
    IonContent,
    IonLabel,
    IonItem,
    IonHeader,
    IonToolbar,
    IonTitle, CommonModule,
    IonRefresherContent, IonRefresher, IonButton
  ],
})

export class ListMessagesComponent implements OnInit {
  chats: any[] = [];
  userId: number = 0; // Asegúrate de obtener el ID del usuario autenticado.

  constructor(private usersService: UsersService) {
    addIcons({ sendOutline, trashOutline });
  }

  ngOnInit() {
    this.userId = this.getAuthenticatedUserId(); // Implementa esta lógica si es necesario.
    this.fetchChats();
  }

  fetchChats() {
    this.usersService.getActiveChats().subscribe({
      next: (response: any) => {
        this.chats = response.chats.map((chat: any) => {
          const isUser1 = chat.user1.id !== this.userId;
          const otherUser = isUser1 ? chat.user1 : chat.user2;
  
          return {
            username: otherUser.user || "Usuario desconocido",
            lastMessage: chat.lastMessage?.content || "Sin mensajes aún",
            photoUrl: otherUser.person.photo
              ? `http://localhost:3000${otherUser.person.photo}`
              : "assets/default-avatar.png",
            isLastMessageFromUser: chat.lastMessage?.sender_id === this.userId, // Nuevo campo.
            id: chat.id // Asegúrate de tener el ID del chat.
          };
        });
      },
      error: (error) => {
        console.error("Error al obtener los chats:", error);
      },
    });
  }

  // Función para actualizar los mensajes cuando se desliza hacia arriba
  doRefresh(event: any) {
    this.usersService.getActiveChats().subscribe({
      next: (response: any) => {
        this.chats = response.chats.map((chat: any) => {
          const isUser1 = chat.user1.id !== this.userId;
          const otherUser = isUser1 ? chat.user1 : chat.user2;
  
          return {
            username: otherUser.user || "Usuario desconocido",
            lastMessage: chat.lastMessage?.content || "Sin mensajes aún",
            photoUrl: otherUser.person.photo
              ? `http://localhost:3000${otherUser.person.photo}`
              : "assets/default-avatar.png",
            isLastMessageFromUser: chat.lastMessage?.sender_id === this.userId, // Nuevo campo.
            id: chat.id // Asegúrate de tener el ID del chat.
          };
        });
        event.target.complete(); // Detener el refresco
      },
      error: (error) => {
        console.error("Error al obtener los chats:", error);
        event.target.complete(); // Detener el refresco incluso en caso de error
      },
    });
  }

  // Función para eliminar un chat
  deleteChat(chatId: number) {
    this.usersService.deleteChat(chatId).subscribe({
      next: () => {
        this.chats = this.chats.filter(chat => chat.id !== chatId);
      },
      error: (error) => {
        console.error("Error al eliminar el chat:", error);
      }
    });
  }

  getAuthenticatedUserId(): number {
    // Implementa esta función para obtener el ID del usuario autenticado
    return 1; // Ejemplo: ID estático para pruebas.
  }
}
