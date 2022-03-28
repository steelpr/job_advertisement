import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  loginForm!: FormGroup;


  form: any = {
    username: null,
    password: null
  };

  roles: string[] = [];
  constructor(
    private dialogRef: MatDialogRef<LoginComponent>, private formBuilder: FormBuilder, private http: HttpClient) { }
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })

  }
  onLogin() {
    this.http.get<any>("http://localhost:3000/user")
      .subscribe(res => {
        const user = res.find((a: any) => {
          return a.username === this.loginForm.value.username && a.password === this.loginForm.value.password
        });
        if (user) {
          console.log(user)
          localStorage.setItem("user", JSON.stringify(user));

          alert("Login Successfull");

          this.loginForm.reset();
          this.dialogRef.close("login");
        } else {
          alert("User not found")
        }
      }, error => {
        alert("Something went wrong");
      })
  }
  reloadPage(): void {
    window.location.reload();
  }
}
