import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonFooter, IonItem, IonInput, IonList, IonLabel, IonBackButton, IonAvatar } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBackOutline, trashOutline, checkmarkOutline } from 'ionicons/icons';
import { UsersService } from '../services/users.service';
import { interval } from 'rxjs';
import { FormsModule } from '@angular/forms';  // <-- Agrega esta línea

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [IonAvatar, 
    IonBackButton,
    IonLabel,
    IonList,
    IonInput,
    IonItem,
    IonFooter,
    IonButton,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonIcon,
    RouterLink,
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule   // <-- Asegúrate de incluir FormsModule aquí
  ]
})
export class ChatPage implements OnInit {
  friendId: string | null = null;      // ID del amigo (viene de la URL)
  friendName: string = 'Amigo';          // Nombre del amigo (se actualizará al obtener el perfil)
  chatId!: number;                     // Se usa el operador "!" para indicar que se asignará posteriormente
  messages: any[] = [];                // Lista de mensajes del chat
  newMessage: string = '';             // Mensaje a enviar (vinculado al input)
  currentUserId!: number;    
  friendPhoto: string = ''; 
   
  trashIcon = trashOutline;
  checkIcon = checkmarkOutline;
  backIcon = arrowBackOutline;

  constructor(private route: ActivatedRoute, private usersService: UsersService) {
    addIcons({ arrowBackOutline });
  }

  ngOnInit() { 
    this.friendId = this.route.snapshot.paramMap.get('id');
    if (this.friendId) {
      
      this.chatId = parseInt(this.friendId, 10);
      // Se asume que el ID del usuario actual está almacenado en localStorage
      this.currentUserId = Number(localStorage.getItem('id')); 

      // Consultar el perfil del amigo para obtener su nombre real
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

      // Cargar mensajes al iniciar la vista
      this.loadMessages();

      // Refrescar la lista de mensajes cada 5 segundos (opcional)
      interval(5000).subscribe(() => this.loadMessages());
    }
  }

  // Cargar los mensajes del chat consultando la API
  loadMessages() {
    if (this.chatId) {
      this.usersService.getMessages(this.chatId).subscribe(
        (response: any) => {
          if (response && response.messages) {
            // Mapea cada mensaje y convierte el timestamp a Date
            this.messages = response.messages.reverse().map((msg: any) => {
              if (msg.createdAt && msg.createdAt._seconds) {
                msg.createdAt = new Date(msg.createdAt._seconds * 1000);
              }
              return msg;
            }); 
          }
        },
        (error: any) => {
          console.error('Error al cargar los mensajes', error);
        }
      );
    }
  }
  
  
  

  sendMessage() {
    if (!this.newMessage.trim()) return;

    const data = {
      receiverId: Number(this.friendId), // El backend espera el campo "receiverId"
      content: this.newMessage,
      media_url: null
    };

    this.usersService.sendMessage(data).subscribe(
      (response: any) => {
        this.newMessage = '';
        this.loadMessages();
      },
      (error: any) => {
        console.error('Error al enviar el mensaje', error);
      }
    );
  }

  // Elimina un mensaje dado su ID
  deleteMessage(messageId: number) {
    this.usersService.deleteMessage(messageId).subscribe(
      (response: any) => this.loadMessages(),
      (error: any) => console.error('Error al eliminar el mensaje', error)
    );
  }

  // Marca un mensaje como "read" (solo para los mensajes recibidos que no estén leídos)
  markAsRead(messageId: number) {
    this.usersService.updateMessageStatus(messageId, 'read').subscribe(
      (response: any) => this.loadMessages(),
      (error: any) => console.error('Error al actualizar el estado del mensaje', error)
    );
  }
}
