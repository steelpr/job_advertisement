import { Injectable } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  constructor() { }

  onSubmit() {
    localStorage.clear(); 
  }
}
