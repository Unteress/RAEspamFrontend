import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators'; 

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getOneUser(id: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    return this.http.get<any>(`${this.apiUrl}/user/${id}`, { headers });
  }
  
  updatePhoto(id: number, file: File): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    const formData = new FormData();
    formData.append('photo', file);

    return this.http.put<any>(`${this.apiUrl}/user/photo/${id}`, formData, { headers });
  }

  serviceLogin(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { email, password };
    return this.http.post<any>(`${this.apiUrl}/login`, body, { headers });
  }

  serviceRegister(user: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.apiUrl}/register`, user, { headers });
  }

  updateUser(id: number, userData: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    return this.http.put<any>(`${this.apiUrl}/full-user/${id}`, userData, { headers });
  }

  changePassword(id: number, passwords: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    return this.http.put<any>(`${this.apiUrl}/user/password/${id}`, passwords, { headers });
  }

  searchUsers(query: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    return this.http.get<any>(`${this.apiUrl}/search?query=${query}`, { headers });
  }

  sendFriendRequest(friendId: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    return this.http.post<any>(`${this.apiUrl}/friends/send-request/${friendId}`, {}, { headers });
  }
  
  checkStatusesForUsers(userIds: number[]): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    return this.http.post<any>(`${this.apiUrl}/friends/check-statuses`, { userIds }, { headers });
  }
  
  deleteFriend(friendId: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    return this.http.delete<any>(`${this.apiUrl}/friends/delete-friend/${friendId}`, { headers });
  }

  getPendingRequests(): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    return this.http.get<any>(`${this.apiUrl}/friends/pending-requests`, { headers });
  }

  acceptFriendRequest(friendId: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    return this.http.put<any>(`${this.apiUrl}/friends/accept-request/${friendId}`, {}, { headers });
  }

  getAcceptedFriends(): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    return this.http.get<any>(`${this.apiUrl}/friends/accepted-friends`, { headers });
  }
  

  getActiveChats(): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    return this.http.get<any>(`${this.apiUrl}/chats`, { headers }).pipe(
      // Aquí añadimos el log para ver la respuesta o el error
      tap({
        next: (response) => {
          console.log('Respuesta de la API (chats):', response);  // Log de la respuesta
        },
        error: (error) => {
          console.error('Error al obtener los chats:', error);  // Log del error
        }
      })
    );
  }
  
  deleteChat(chatId: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    return this.http.delete<any>(`${this.apiUrl}/chats/${chatId}`, { headers });  // Cambié a '/chats/:chatId'
  }
  

  getFriendProfile(friendId: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    return this.http.get<any>(`${this.apiUrl}/friends/friend-profile/${friendId}`, { headers });
  }
  
  
 // Obtiene los mensajes de un chat (se envía el ID del chat)
  getMessages(chatId: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    return this.http.get<any>(`${this.apiUrl}/messages/get/${chatId}`, { headers });
  }

  // Envía un mensaje nuevo
  sendMessage(data: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    return this.http.post<any>(`${this.apiUrl}/messages/send`, data, { headers });
  }

  // Elimina un mensaje por su ID
  deleteMessage(messageId: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    return this.http.delete<any>(`${this.apiUrl}/messages/delete/${messageId}`, { headers });
  }

  // Actualiza el estado de un mensaje (por ejemplo, de "sent" a "read")
  updateMessageStatus(messageId: number, status: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    return this.http.patch<any>(`${this.apiUrl}/messages/status/${messageId}`, { status }, { headers });
  }

}
