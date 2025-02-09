import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../services/users.service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonInput,
  IonButton,
  IonLabel,
  IonRadioGroup,
  IonRadio,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonDatetime,
  LoadingController,
  AlertController
} from '@ionic/angular/standalone';
import { CapitalizePipe } from '../capitalize.pipe';

@Component({
  selector: 'app-new-acount',
  templateUrl: './new-acount.page.html',
  styleUrls: ['./new-acount.page.scss'],
  standalone: true,
  imports: [
    
    CommonModule,
    RouterLink,
    FormsModule,
    IonDatetime,
    IonInput,
    IonItem,
    IonButton,
    IonLabel,
    IonRadio,
    IonRadioGroup,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
  ],
})
export class NewAcountPage implements OnInit {
  user: any = {
    user: '',
    password: '',
    confirmPassword: '',
    email: '',
    //genero: '',
    //name: '',
    //lastName: '',
  };

  constructor(
    private usersService: UsersService, 
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  async register() {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[A-Z])(?=.*[.,-_@$!%*?&])[A-Za-z\d.,-_@$!%*?&]{10,}$/;
  
    if (!this.user.user || !this.user.email || !this.user.password || !this.user.confirmPassword) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, completa todos los campos.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }
  
    if (!emailPattern.test(this.user.email)) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Correo electrónico incorrecto.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }
  
    if (!passwordPattern.test(this.user.password)) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'La contraseña debe tener al menos 10 caracteres, incluir una letra mayúscula, una letra minúscula, un número y un carácter especial (.,-_@$!%*?&).',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }
  
    if (this.user.password !== this.user.confirmPassword) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Las contraseñas no coinciden.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }
  
    const loading = await this.loadingController.create({
      message: 'Creando cuenta...',
      spinner: 'circles',
    });
    await loading.present();
  
    this.usersService.serviceRegister(this.user).subscribe({
      next: (response: any) => {
        console.log('Registrado con éxito:', response);
        localStorage.setItem('token', response.token);
        this.router.navigate(['/login']);
        loading.dismiss();
      },
      error: async (error: any) => {
        console.error('Error al registrar:', error);
        loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Error',
          message: error.error?.message || 'Error al registrar el usuario. Por favor, intenta de nuevo.',
          buttons: ['OK'],
        });
        await alert.present();
      },
    });
  }
  
  
}

