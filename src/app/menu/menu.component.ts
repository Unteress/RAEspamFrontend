import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../services/users.service';
import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonIcon,
  IonFooter, IonButton, IonCard } from '@ionic/angular/standalone';
import { CapitalizePipe } from '../capitalize.pipe'; // Asegúrate de usar la ruta correcta
import { Router, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { homeOutline, exitOutline, settingsOutline, lockClosedOutline, peopleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [IonCard, IonButton, 
    RouterLink,
    IonFooter,
    IonIcon,
    CommonModule,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonAvatar,
    IonLabel,
    CapitalizePipe
  ]
})
export class MenuComponent implements OnInit {
  user: any = {
    user: '',
    person: {
      photo: '',
    },
  };

  constructor(private router: Router, private usersService: UsersService) {
    addIcons({settingsOutline,peopleOutline,exitOutline});
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

    this.usersService.getOneUser(userId).subscribe({
      next: (data: any) => {
        if (data?.user) {
          this.user = {
            user: data.user.user,
            person: data.user.person ? data.user.person : { photo: '' }
          };

          this.user.person.photo = this.user.person.photo
            ? `http://localhost:3000${this.user.person.photo}`
            : '/assets/default-profile.png';
        }
      },
      error: (error: any) => {
        console.error('Error al cargar los datos del menú:', error);
      }
    });
  }

  // Recargar datos al entrar a la vista
  ionViewWillEnter() {
    this.loadUserProfile(); 
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login'], { replaceUrl: true });
  }
  
}