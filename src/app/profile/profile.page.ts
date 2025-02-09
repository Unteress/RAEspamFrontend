import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonMenuButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButtons,
  IonButton,
  IonIcon, IonAvatar, IonItem, IonLabel, IonTabButton } from '@ionic/angular/standalone';
import { CapitalizePipe } from '../capitalize.pipe';
import { MenuComponent } from '../menu/menu.component';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBackOutline, createOutline, settingsOutline, camera } from 'ionicons/icons';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonTabButton, IonLabel, IonItem, IonAvatar, 
    IonIcon,
    RouterLink,
    IonButton,
    IonMenuButton,
    MenuComponent,
    IonButtons,
    CapitalizePipe,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule
  ]
})
export class ProfilePage implements OnInit {
  user: any = {
    user: '',
    email: '',
    person: {
      name: '',
      lastName: '',
      adress: '',
      photo: ''
    }
  };

  constructor(private router: Router, private usersService: UsersService) {
    addIcons({arrowBackOutline, camera, createOutline, settingsOutline});
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    const userIdString = localStorage.getItem('id');
    const userId = userIdString ? parseInt(userIdString, 10) : null;

    if (!userId || !localStorage.getItem('token')) {
      console.error('El usuario no está autenticado.');
      this.router.navigate(['/login']);
      return;
    }

    if (userId) {
      this.usersService.getOneUser(userId).subscribe({
        next: (data: any) => {
          if (data?.user) {
            this.user = {
              user: data.user.user,
              email: data.user.email,
              person: data.user.person
                ? data.user.person
                : { name: '', lastName: '', adress: '', photo: '' }
            };

            // Asegúrate de que la foto de perfil tiene la URL base correcta
            this.user.person.photo = this.user.person.photo
              ? `http://localhost:3000${this.user.person.photo}`
              : '/assets/default-profile.png';

            console.log('Datos del perfil cargados con éxito:', this.user);
          }
        },
        error: (error: any) => {
          console.error('Error al cargar los datos del perfil:', error);
        }
      });
    } else {
      console.error('No se encontró el ID del usuario en el almacenamiento local');
    }
  }

  ionViewWillEnter() {
    console.log('Volviendo al perfil, recargando datos...');
    this.loadUserProfile();
  }

  goToEditPage() {
    this.router.navigate(['/person']);
  }
}
