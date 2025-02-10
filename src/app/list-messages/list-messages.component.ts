import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { CommonModule } from '@angular/common';
import {
  IonActionSheet,
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
  IonCardTitle,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { sendOutline, trashOutline, ellipsisVertical } from 'ionicons/icons';
import { CommunicationService } from '../services/CommunicationService';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-list-messages',
  templateUrl: './list-messages.component.html',
  styleUrls: ['./list-messages.component.scss'],
  standalone: true,
  imports: [
    
    IonIcon,
    IonActionSheet,
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
    IonTitle,
    CommonModule,
    IonRefresherContent,
    IonRefresher,
    IonButton
  ],
})
export class ListMessagesComponent implements OnInit {
  chats: any[] = [];
  userId: number = 0; // ID del usuario autenticado
  private refreshSubscription!: Subscription;
  isActionSheetOpen = false;
  actionSheetButtons: any[] = [];
  selectedChat: any = null;

  constructor(private usersService: UsersService, private communicationService: CommunicationService) {
    addIcons({ sendOutline, trashOutline, ellipsisVertical });
  }

  ngOnInit(): void {
    this.userId = this.getAuthenticatedUserId(); // Obtener el ID correctamente
    this.fetchChats();

    // Suscribirse al evento de refresco
    this.refreshSubscription = this.communicationService.refreshObservable$.subscribe(event => {
      if (event && event.refresh) {
        const dummyEvent = { target: { complete: () => {} } };
        this.doRefresh(dummyEvent);
      }
    });

    // Activar actualización periódica de los chats (descomentar para producción)
     //interval(1000).subscribe(() => this.fetchChats());
    

  }



  fetchChats() {
    this.usersService.getActiveChats().subscribe({
      next: (response: any) => {
        this.chats = response.chats.map((chat: any) => {
          const lastMessageContent = chat.lastMessage?.content || 'Sin mensajes aún';
          const isMyMessage = chat.lastMessage && (chat.lastMessage.sender_id === this.userId);
          return {
            id: chat.id,
            friendId: chat.friend.id,
            username: chat.friend.user || 'Usuario desconocido',
            lastMessage: lastMessageContent,
            prefixedLastMessage: chat.lastMessage
              ? (isMyMessage ? 'Tú: ' + lastMessageContent : lastMessageContent)
              : 'Sin mensajes aún',
            photoUrl: chat.friend.person?.photo
              ? `http://localhost:3000${chat.friend.person.photo}`
              : 'assets/default-avatar.png',
            isLastMessageFromUser: isMyMessage,
          };
        });
      },
      error: (error) => {
        console.error('Error al obtener los chats:', error);
      }
    });
  }

  doRefresh(event: any) {
    this.usersService.getActiveChats().subscribe({
      next: (response: any) => {
        this.chats = response.chats.map((chat: any) => {
          const lastMessageContent = chat.lastMessage?.content || 'Sin mensajes aún';
          const isMyMessage = chat.lastMessage && (chat.lastMessage.sender_id === this.userId);

          return {
            id: chat.id,
            friendId: chat.friend.id,
            username: chat.friend.user || 'Usuario desconocido',
            lastMessage: lastMessageContent,
            prefixedLastMessage: chat.lastMessage
              ? (isMyMessage ? 'Tú: ' + lastMessageContent : lastMessageContent)
              : 'Sin mensajes aún',
            photoUrl: chat.friend.person?.photo
              ? `http://localhost:3000${chat.friend.person.photo}`
              : 'assets/default-avatar.png',
            isLastMessageFromUser: isMyMessage,
          };
        });
        event.target.complete();
      },
      error: (error) => {
        console.error('Error al actualizar los chats:', error);
        event.target.complete();
      }
    });
  }

  getAuthenticatedUserId(): number {
    return Number(localStorage.getItem('id')) || 1;
  }
  
  openOptions(chat: any, event: Event) {
  event.stopPropagation(); // Evita la navegación al hacer clic en los tres puntos
  this.selectedChat = chat;
  this.actionSheetButtons = [
    {
      text: 'Eliminar chat',
      role: 'destructive',
      icon: 'trash',
      handler: () => this.deleteChat(chat.id),
    },
    {
      text: 'Ver perfil',
      icon: 'person-circle',
      handler: () => {
        console.log('Ver perfil de:', chat.username);
      },
    },
    {
      text: 'Cancelar',
      role: 'cancel',
      icon: 'close',
    },
  ];
  this.isActionSheetOpen = true;
}

  deleteChat(chatId: number) {
    this.usersService.deleteChat(chatId).subscribe({
      next: () => {
        this.chats = this.chats.filter(chat => chat.id !== chatId);
      },
      error: (error) => {
        console.error('Error al eliminar el chat:', error);
      },
    });
    this.fetchChats();
  }


  truncateMessage(message: string, maxLength: number = 30): string {
    if (message.length > maxLength) {
      return message.substring(0, maxLength) + '...';
    }
    return message;
  }



}



