import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { arrowBackOutline, playCircle } from 'ionicons/icons';
import { Router } from '@angular/router';
import { AnimationController } from '@ionic/angular';
import {
  AlertController,
  IonMenuButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonLabel,
  IonItem,
  IonButton,
  IonInput,
  IonButtons,
  IonIcon,
  IonPickerLegacy,
  IonAvatar,
  IonModal,
  IonTabs,
  IonTabBar,
  IonTabButton,
} from '@ionic/angular/standalone';
import { MenuComponent } from '../menu/menu.component';
import { RouterLink } from '@angular/router';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-person',
  templateUrl: './person.page.html',
  styleUrls: ['./person.page.scss'],
  standalone: true,
  imports: [
    IonTabButton,
    IonTabBar,
    IonTabs,
    IonModal,
    IonAvatar,
    RouterLink,
    IonIcon,
    IonPickerLegacy,
    IonMenuButton,
    MenuComponent,
    IonButtons,
    IonInput,
    IonButton,
    IonItem,
    IonLabel,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class PersonPage implements OnInit {
  profile: any = {
    user: '',
    person: { name: '', lastName: '', adress: '', photo: '' },
  };
  personId: any;
  user: any = {
    user: '',
    person: { name: '', lastName: '', adress: '', photo: '' },
  };

  currentPhoto: string | null = null;
  preview: string | null = null;
  file: File | null = null;
  showConfirmationModal: boolean = false;

  constructor(
    private animationCtrl: AnimationController,
    private usersService: UsersService,
    private alertController: AlertController,
    private router: Router
  ) {
    addIcons({ arrowBackOutline, playCircle });
    this.personId = localStorage.getItem('id');
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  loadUserProfile(): void {
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
              person: data.user.person
                ? data.user.person
                : { name: '', lastName: '', adress: '', photo: '' },
            };

            // Establecer la foto actual o una por defecto
            this.currentPhoto = data.user.person.photo
              ? `http://localhost:3000${data.user.person.photo}` // Asegúrate de que la URL base es correcta
              : '/assets/default-profile.png';
          }
          console.log('Datos del perfil cargados con éxito:', this.user);
          console.log('URL de la foto de perfil:', this.currentPhoto);
        },
        error: (error: any) => {
          console.error('Error al cargar los datos del perfil:', error);
        },
      });
    } else {
      console.error('No se encontró el ID del usuario en el almacenamiento local');
    }
  }

  selectPhoto(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';
    input.addEventListener('change', (event: any) => this.onFileSelected(event));
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];

      // Mostrar previsualización
      const reader = new FileReader();
      reader.onload = () => {
        this.preview = reader.result as string;
        this.showConfirmationModal = true; // Abrir el menú de confirmación
      };
      reader.readAsDataURL(this.file);
    }
  }

  confirmPhotoUpdate(): void {
    if (!this.file) {
      this.showAlert('Error', 'Por favor selecciona una imagen.');
      return;
    }

    const userId = parseInt(localStorage.getItem('id') || '', 10);
    this.usersService.updatePhoto(userId, this.file).subscribe({
      next: (response) => {
        this.currentPhoto = `http://localhost:3000${response.photo}`; // Actualizar la foto actual
        this.preview = null;
        this.showConfirmationModal = false; // Cerrar el menú
        this.showAlert('Éxito', 'Foto de perfil actualizada.');
      },
      error: (error) => {
        console.error('Error al subir la foto:', error);
        this.showAlert('Error', 'Hubo un problema al subir la foto.');
      },
    });
  }

  cancelPhotoUpdate(): void {
    this.preview = null; // Limpiar la vista previa
    this.showConfirmationModal = false; // Cerrar el menú
  }

  async updateProfile() {
    const filteredProfile = {
      user: this.profile.user?.trim() ? this.profile.user : undefined,
      person: {
        name: this.profile.person.name?.trim() ? this.profile.person.name : undefined,
        lastName: this.profile.person.lastName?.trim()
          ? this.profile.person.lastName
          : undefined,
        adress: this.profile.person.adress?.trim()
          ? this.profile.person.adress
          : undefined,
        photo: this.profile.person.photo?.trim()
          ? this.profile.person.photo
          : undefined,
      },
    };
  
    this.usersService.updateUser(this.personId, filteredProfile).subscribe({
      next: (response) => {
        console.log('Datos actualizados correctamente:', response);
        this.showAlert('Éxito', 'Perfil actualizado correctamente.');
        this.router.navigate(['/profile']);
      },
      error: (error) => {
        console.error('Error al actualizar los datos:', error);
        if (error.status === 409 && error.error?.message === 'Nombre de usuario ya está en uso') {
          this.showAlert('Error', 'El nombre de usuario ya está en uso.');
        } else {
          this.showAlert('Error', 'Ocurrió un error al actualizar el perfil.');
        }
      },
    });
  }
  
}
