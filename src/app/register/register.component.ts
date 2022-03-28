import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Router } from '@angular/router';
interface Role {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})


export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;


  form: any = {
    username: null,
    email: null,
    password: null,
    role: null

  };

  roles: Role[] = [
    { value: 'Individual', viewValue: 'Individual' },
    { value: 'Organization', viewValue: 'Organization' }
  ];

  errorMessage = '';
  constructor( private dialogRef: MatDialogRef<RegisterComponent>,
    private formBuilder: FormBuilder, private http: HttpClient, private router: Router) { }
  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required]
    });
  }
  onSubmit() {
    this.http.post<any>("http://localhost:3000/user", this.registerForm.value)
      .subscribe(res => {
        localStorage.setItem("user", JSON.stringify(this.registerForm.value));
        alert("Signup Successfull");
        this.registerForm.reset();
        this.dialogRef.close("register");
      }, error => {
        alert("Something went wrong");
      })
  }
  reloadPage(): void {
    window.location.reload();
  }
}
