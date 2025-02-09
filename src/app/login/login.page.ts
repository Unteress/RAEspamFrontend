import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonItem, IonInput, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonLabel } from '@ionic/angular/standalone';
import { UsersService } from '../services/users.service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonLabel, IonCardTitle, IonCardHeader, IonCardContent, IonCard, RouterLink, IonInput, IonItem, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, HttpClientModule]
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';

  constructor(
    private usersService: UsersService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  async login() {
    if (!this.email || !this.password) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, completa todos los campos.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
      spinner: 'circles',
    });
    await loading.present();

    this.usersService.serviceLogin(this.email, this.password).subscribe({
      next: (response: any) => {
        console.log('Logeado con éxito:', response);

        // Guardar el token en el localStorage para futuras solicitudes
        localStorage.setItem('token', response.token);
        localStorage.setItem('id', response.dataUser.id); 
        localStorage.setItem('userName', response.dataUser.user); 

        // Redirigir al usuario
        this.router.navigate(['/home']);
        loading.dismiss();
      },
      error: async (error: any) => {
        console.error('Error en el login:', error);
        loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Error',
          message: error.error?.message || 'Error al iniciar sesión. Por favor, intenta de nuevo.',
          buttons: ['OK'],
        });
        await alert.present();
      }
    });
  }
}
