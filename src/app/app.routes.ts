import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'new-acount',
    loadComponent: () => import('./new-acount/new-acount.page').then( m => m.NewAcountPage)
  },
  {
    path: 'person',
    loadComponent: () => import('./person/person.page').then( m => m.PersonPage)
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.page').then( m => m.ProfilePage)
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings.page').then( m => m.SettingsPage)
  },
  {
    path: 'change-password',
    loadComponent: () => import('./change-password/change-password.page').then( m => m.ChangePasswordPage)
  },
  {
    path: 'profile-friends/:friendId',
    loadComponent: () => import('./profile-friends/profile-friends.page').then( m => m.ProfileFriendsPage)
  },
  {
    path: 'profile-friends',
    loadComponent: () => import('./profile-friends/profile-friends.page').then( m => m.ProfileFriendsPage)
  },
  {
    path: 'friends-list',
    loadComponent: () => import('./friends-list/friends-list.page').then( m => m.FriendsListPage)
  },
  {
    path: 'chat',
    loadComponent: () => import('./chat/chat.page').then( m => m.ChatPage)
  },
  {
    path: 'chat/:id',
    loadComponent: () => import('./chat/chat.page').then(m => m.ChatPage)
  },


];
