import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonIcon, IonItem, IonLabel, IonInput, IonCard, IonButton, AlertController, IonCardContent, IonItemDivider } from '@ionic/angular/standalone';
import { RouterLink, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
  standalone: true,
  imports: [IonItemDivider, IonCardContent, IonButton, IonCard, IonInput, IonLabel, IonItem, RouterLink, IonIcon, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ChangePasswordPage implements OnInit {
  currentPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';

  constructor(
    private usersService: UsersService,
    private alertController: AlertController,
    private router: Router
  ) {
    addIcons({ arrowBackOutline });
  }

  ngOnInit() {
    addIcons({ arrowBackOutline });
  }

  async changePassword() {
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[A-Z])(?=.*[.,-_@$!%*?&])[A-Za-z\d.,-_@$!%*?&]{10,}$/;

    if (!passwordPattern.test(this.newPassword)) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'La nueva contraseña debe tener al menos 10 caracteres, incluir una letra mayúscula, una letra minúscula, un número y un carácter especial (.,-_@$!%*?&).',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    if (this.newPassword !== this.confirmNewPassword) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Las contraseñas nuevas no coinciden.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    const userId = localStorage.getItem('id');
    if (userId) {
      this.usersService.changePassword(parseInt(userId, 10), { currentPassword: this.currentPassword, newPassword: this.newPassword }).subscribe({
        next: async () => {
          const alert = await this.alertController.create({
            header: 'Éxito',
            message: 'Contraseña actualizada correctamente.',
            buttons: ['OK'],
          });
          await alert.present();
          this.router.navigate(['/settings']);
        },
        error: async (error) => {
          const alert = await this.alertController.create({
            header: 'Error',
            message: error.error?.message || 'Error al actualizar la contraseña.',
            buttons: ['OK'],
          });
          await alert.present();
        }
      });
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se encontró el ID del usuario en el almacenamiento local.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
}
