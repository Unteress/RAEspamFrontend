import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonMenuButton, IonHeader, IonToolbar, IonTitle, IonContent, IonAvatar, IonItem, IonLabel, IonButtons, IonApp, IonMenu, IonCardHeader, IonCardTitle, IonList, IonTab, IonTabs, IonTabBar, IonTabButton, IonIcon } from '@ionic/angular/standalone';
import { CapitalizePipe } from '../capitalize.pipe';
import { MenuComponent } from '../menu/menu.component';
import { NotificationsComponent } from '../notifications/notifications.component';
import { SearchComponent } from '../search/search.component';
import { addIcons } from 'ionicons';
import { library, playCircle, radio, search, homeOutline, notificationsOutline, personAddOutline, chatboxOutline } from 'ionicons/icons';
import { ListMessagesComponent } from '../list-messages/list-messages.component';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [ListMessagesComponent, IonIcon, IonTabButton, IonTabBar, IonTabs, IonTab, MenuComponent, SearchComponent, CapitalizePipe, IonCardTitle, IonCardHeader, IonMenuButton, IonApp, IonButtons, IonLabel, IonItem, IonAvatar, IonHeader, IonToolbar, IonTitle, IonContent, IonMenu, IonList, RouterLink, CommonModule, CapitalizePipe, NotificationsComponent]
})
export class HomePage implements OnInit {
  user: any;
  menuKey: number = 0;
  constructor() {
    addIcons({homeOutline,personAddOutline,chatboxOutline,search,notificationsOutline,library,radio,playCircle});
  }
  ngOnInit() {
    this.user = localStorage.getItem('userName');
    this.menuKey++;
  }
}
