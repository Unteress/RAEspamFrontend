import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButtons, IonCard, IonCardTitle, IonCardHeader, IonCardContent, IonAvatar, IonButton } from '@ionic/angular/standalone';
import { arrowBackOutline, createOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { RouterLink,ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { MenuComponent } from '../menu/menu.component';
@Component({
  selector: 'app-profile-friends',
  templateUrl: './profile-friends.page.html',
  styleUrls: ['./profile-friends.page.scss'],
  standalone: true,
  imports: [MenuComponent, IonButton, IonAvatar, IonCardContent, IonCardHeader, IonCardTitle, IonCard, IonButtons, RouterLink, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})

export class ProfileFriendsPage implements OnInit {

  friendId: number = 0; // El ID del amigo recibido de la URL
  friend: any = {
    user: '',
    email: '',
    nombres: '',
    apellidos: '',
    photo: ''
  };

  constructor(
    private router: Router,
    private usersService: UsersService,
    private route: ActivatedRoute
  ) {
    addIcons({arrowBackOutline});
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.friendId = +params['friendId']; // Obtener el ID del amigo desde la URL
      this.loadFriendProfile();
    });
  }

  loadFriendProfile() {
    const userIdString = localStorage.getItem('id');
    const userId = userIdString ? parseInt(userIdString, 10) : null;

    if (!userId || !localStorage.getItem('token')) {
      console.error('El usuario no está autenticado.');
      this.router.navigate(['/login']);
      return;
    }

    if (this.friendId) {
      this.usersService.getFriendProfile(this.friendId).subscribe({
        next: (data: any) => {
          this.friend = {
            user: data.user,
            email: data.email,
            nombres: data.nombres,
            apellidos: data.apellidos,
            photo: data.photo ? `http://localhost:3000${data.photo}` : '/assets/default-profile.png',
          };
          console.log('Datos del perfil del amigo cargados con éxito:', this.friend);
        },
        error: (error: any) => {
          console.error('Error al cargar los datos del perfil del amigo:', error);
        }
      });
    } else {
      console.error('No se encontró el ID del amigo en la URL');
    }
  }

  ionViewWillEnter() {
    console.log('Volviendo al perfil del amigo, recargando datos...');
    this.loadFriendProfile();
  }
 
}