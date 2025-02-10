import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonIcon, 
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, 
  IonFooter, IonItem, IonInput, IonList, IonLabel, IonBackButton, IonAvatar, IonActionSheet
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBackOutline, trashOutline, checkmarkOutline, sendOutline} from 'ionicons/icons';
import { UsersService } from '../services/users.service';
import { FormsModule } from '@angular/forms';
import { interval } from 'rxjs';
import { ViewChild } from '@angular/core';
import { CommunicationService } from '../services/CommunicationService';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [
    IonAvatar, IonBackButton, IonLabel, IonList, IonInput, IonItem, IonFooter, 
    IonButton, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonIcon, 
    RouterLink, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, 
    CommonModule, FormsModule, IonActionSheet
  ]
})
export class ChatPage implements OnInit {
  friendId: string | null = null;
  friendName: string = 'Amigo';
  chatId!: number;
  messages: any[] = [];
  newMessage: string = '';
  currentUserId!: number;
  friendPhoto: string = '';
  isActionSheetOpen = false;
  actionSheetButtons: any[] = [];


  @ViewChild(IonContent) content!: IonContent; 


  constructor(private route: ActivatedRoute, private usersService: UsersService, private communicationService: CommunicationService ) {
    addIcons({ arrowBackOutline, trashOutline, checkmarkOutline, sendOutline});
  }

  ngOnInit() { 
    this.friendId = this.route.snapshot.paramMap.get('id');
    if (this.friendId) {
      this.chatId = parseInt(this.friendId, 10);
      this.currentUserId = Number(localStorage.getItem('id')); 

      this.usersService.getFriendProfile(Number(this.friendId)).subscribe(
        (response: any) => {
          if (response) {
            this.friendName = response.nombres && response.apellidos 
              ? `${response.nombres} ${response.apellidos}` 
              : response.user;
            this.friendPhoto = 'http://localhost:3000' + response.photo;
          }
        },
        (error: any) => {
          console.error('Error al obtener el perfil del amigo', error);
          this.friendName = 'Amigo';
        }
      );

      this.loadMessages();
      //ACTIVAR PARA DESPLIEGUE
      //interval(1000).subscribe(() => this.loadMessages());
    }
  }

  loadMessages() {
    this.usersService.getMessages(this.chatId).subscribe(
      (response: any) => {
        if (response && response.messages) {
          this.messages = response.messages.map((msg: any) => {
            if (msg.createdAt && msg.createdAt._seconds) {
              msg.createdAt = new Date(msg.createdAt._seconds * 1000);
            }
            return msg;
          });
          // Espera a que los mensajes se rendericen y luego desplaza el scroll al final.
          setTimeout(() => {
            this.content.scrollToBottom(300); // 300ms de animación
          }, 100);
        }
      },
      (error: any) => {
        console.error('Error al cargar los mensajes', error);
      }
    );
  }
  

  sendMessage() {
    if (!this.newMessage.trim()) return;
  
    const data = {
      receiverId: Number(this.friendId),
      content: this.newMessage,
      media_url: null
    };
  
    this.usersService.sendMessage(data).subscribe(
      () => {
        this.newMessage = '';
        this.loadMessages();
        // Opcional: también puedes hacer scroll inmediatamente aquí si lo prefieres
        // setTimeout(() => {
        //   this.content.scrollToBottom(300);
        // }, 100);
      },
      (error: any) => {
        console.error('Error al enviar el mensaje', error);
      }
    );
  }
  

  deleteMessage(messageId: number) {
    this.usersService.deleteMessage(messageId).subscribe(
      () => this.loadMessages(),
      (error: any) => console.error('Error al eliminar el mensaje', error)
    );
  }

  markAsRead(messageId: number) {
    this.usersService.updateMessageStatus(messageId, 'read').subscribe(
      () => this.loadMessages(),
      (error: any) => console.error('Error al actualizar el estado del mensaje', error)
    );
  }

  onBackClick() {
    // Emitimos un evento indicando que se debe refrescar la lista de mensajes
    this.communicationService.emitRefreshEvent({ refresh: true });
    // El ion-back-button se encarga de la navegación (defaultHref) de forma automática.
  }

  openOptions(msg: any, event: Event) {
    event.stopPropagation(); // Para evitar que se navegue cuando se hace clic en los tres puntos
    this.actionSheetButtons = [
      {
        text: 'Eliminar mensaje',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.deleteMessage(msg.id); // Elimina el mensaje
        },
      },
      {
        text: 'Cancelar',
        role: 'cancel',
        icon: 'close',
      },
    ];

    this.isActionSheetOpen = true; // Muestra el ActionSheet
  }

}
