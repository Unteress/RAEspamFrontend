import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonSearchbar, IonList, IonItem, IonLabel, IonButton, IonAvatar, AlertController, IonActionSheet } from '@ionic/angular/standalone';
import { UsersService } from '../services/users.service';
import { RouterLink, Router  } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  standalone: true,
  imports: [RouterLink, IonActionSheet, IonList, IonSearchbar, CommonModule, FormsModule, IonContent, IonHeader, IonToolbar, IonItem, IonLabel, IonButton, IonAvatar]
})
export class SearchComponent {
  searchQuery: string = '';
  searchResults: any[] = [];
  searchTimeout: any;
  isActionSheetOpen = false;
  activeUser: any = null;

  

  constructor(
    private usersService: UsersService,
    private alertController: AlertController,
    private router: Router
  ) {}

  onSearchChange(event: any) {
    const query = event.target.value;
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    if (query && query.trim() !== '') {
      this.searchTimeout = setTimeout(() => {
        this.usersService.searchUsers(query).subscribe({
          next: (data) => {
            const userIds = data.users.map((user: any) => user.id);
            this.usersService.checkStatusesForUsers(userIds).subscribe({
              next: (statuses) => {
                this.searchResults = data.users.map((user: any) => {
                  const status = statuses.find((s: any) => s.id === user.id);
                  return {
                    ...user,
                    requestSent: status?.requestSent || false,
                    isFriend: status?.isFriend || false,
                  };
                });
              },
              error: (error) => {
                console.error('Error al verificar estados de amistad:', error);
              },
            });
          },
          error: (error) => {
            console.error('Error al buscar usuarios:', error);
          },
        });
      }, 500);
    } else {
      this.searchResults = [];
    }
  }
  
  async sendFriendRequest(friendId: number) {
    this.usersService.sendFriendRequest(friendId).subscribe({
      next: (response) => {
        console.log('Solicitud de amistad enviada', response);
        const user = this.searchResults.find(user => user.id === friendId);
        if (user) {
          user.requestSent = true;
          user.isFriend = false;
        }
      },
      error: async (error) => {
        console.error('Error al enviar solicitud de amistad:', error);
        let message = '';
        if (error.status === 409) {
          message = 'Ya existe una solicitud de amistad o amistad con este usuario.';
        } else if (error.status === 400) {
          message = 'No puedes enviarte una solicitud de amistad a ti mismo.';
        } else {
          message = 'Ocurrió un error al enviar la solicitud.';
        }

        const alert = await this.alertController.create({
          header: 'Error',
          message,
          buttons: ['OK'],
        });
        await alert.present();

        // Marcar como solicitud enviada en caso de error para evitar múltiples intentos
        const user = this.searchResults.find(user => user.id === friendId);
        if (user) {
          user.requestSent = true;
        }
      }
    });
  }

  deleteFriendRequest(friendId: number) {
    this.usersService.deleteFriend(friendId).subscribe({
      next: (response) => {
        console.log('Amistad/Solicitud eliminada', response);
        const user = this.searchResults.find((user) => user.id === friendId);
        if (user) {
          user.requestSent = false;
          user.isFriend = false;
        }
      },
      error: async (error) => {
        console.error('Error al eliminar amistad/solicitud:', error);
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Ocurrió un error al eliminar la amistad/solicitud.',
          buttons: ['OK'],
        });
        await alert.present();
      },
    });
  }
  
    
  viewProfile(friendId: number) {
    this.router.navigate(['/profile-friends', friendId]);
  }
  

  

  public getActionSheetButtons(user: any) {
    if (!user) {
      return [];
    }
  
    const buttons = [
      {
        text: 'Eliminar amistad/Solicitud',
        role: 'destructive',
        handler: () => {
          if (this.activeUser) {
            this.deleteFriendRequest(this.activeUser.id);
          }
        },
        isVisible: user.requestSent || user.isFriend,
      },
      {
        text: 'Ver Perfil',
        role: '',
        handler: () => {
          if (this.activeUser) {
            this.viewProfile(this.activeUser.id);
          }
        },
        isVisible: user.isFriend, // Solo visible si la amistad está aceptada
      },
      {
        text: 'Enviar solicitud',
        handler: () => {
          if (this.activeUser) {
            this.sendFriendRequest(this.activeUser.id);
          }
        },
        isVisible: !user.requestSent && !user.isFriend,
      },
      {
        text: 'Cancel',
        role: 'cancel',
        data: { action: 'cancel' },
      },
    ];
  
    // Filtramos los botones que no son visibles
    return buttons.filter((button) => button.isVisible !== false);
  }
  
  

  setOpen(userId: number | null) {
    if (userId === null) {
      this.isActionSheetOpen = false;
      return;
    }

    const user = this.searchResults.find((user: any) => user.id === userId);
    if (user) {
      this.activeUser = user;
      this.isActionSheetOpen = true;
    }
  }
}
