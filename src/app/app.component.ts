import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LogoutService } from './logout.service';
import { CandidatesComponent } from './candidates/candidates.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  title = 'job_advertisement';
  displayedColumns: string[] = ['title', 'type', 'category', 'description', 'likes', 'candidates', 'action'];
  dataSource!: MatTableDataSource<any>;



  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private roles: string[] = [];

  isLogin?: boolean;
  isOrganization = false;
  showOrganizationBoard = false;
  userId?: number;
  username?: string;
  candidates: string[] = [];

  constructor(private dialog: MatDialog, private api: ApiService) {

  }

  ngOnInit(): void {
    this.getAllAdvertisement();
    this.isLoginUser();
    this.currentUserRole();
    console.log(localStorage.length)
    var c = this.api.getJob("jobList").subscribe(data => { console.log(data.length) });


  }


  openDialog() {
    this.dialog.open(DialogComponent, {
      width: '30%'
    }).afterClosed().subscribe(val => {
      if (val === 'save') {
        this.getAllAdvertisement();

      }
    })
  }

  openLogin() {
    this.dialog.open(LoginComponent, {
      width: '30%'
    }).afterClosed().subscribe(val => {
      if (val === 'login') {
        this.isLoginUser();
        this.currentUserRole();
        this.getAllAdvertisement();
      }
    })
  }

  openRegister() {
    this.dialog.open(RegisterComponent, {
      width: '30%'
    }).afterClosed().subscribe(val => {
      if (val === 'register') {
        this.isLoginUser();
        this.currentUserRole();
        this.getAllAdvertisement();
      }
    })
  }

  openCandidates(row: any) {
    this.dialog.open(CandidatesComponent, {
      data: { item: row },
      width: '30%'
    }).afterClosed().subscribe(val => {

      this.isLoginUser();
      this.getAllAdvertisement();

    })
  }
  addCandidates(row: any) {
    const url = "usersJob";
    this.api.getJob(url).subscribe(res => {
      const user = res.find((a: any) => {
        console.log(a.userId)
        return a.userId === this.userId && a.jobId === row.id;
      })
      if (user) {
        alert("you have already applied")
      } else {
        row.candidates += 1;
        this.api.putJob(row, row.id, "jobList").subscribe({
          next: res =>
            alert("You have successfully applied")
        });

        const data = { userId: this.userId, username: this.getUsername(), jobTitle: row.title, jobId: row.id };
        this.api.postJob(data, url).subscribe({
          next: res =>
            this.getAllAdvertisement()
        });
      }
    })
  }

  getAllAdvertisement() {
    const url = "jobList";
    this.api.getJob(url)
      .subscribe({
        next: (res) => {
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: (err) => {
          alert("Error whilefetching records.")
        }
      })
  }

  isLoginUser() {
    if (localStorage["user"] != null) {
      this.isLogin = true;
    } else {
      this.isLogin = false;

    }
  }

  getUsername() {
    var user = JSON.parse(localStorage.getItem("user")!);
    return user.username;
  }

  currentUserRole() {
    if (this.isLogin) {
      var user = JSON.parse(localStorage.getItem("user")!);
      this.userId = user.id;
      if (user.role === "Organization") {
        this.isOrganization = true;
      } else {
        this.isOrganization = false;
      }
    }
    this.getAllAdvertisement();
  }


  logout() {
    localStorage.removeItem("user");
    this.isLoginUser();
    this.getAllAdvertisement();
  }

  editAdvertisement(row: any) {
    const url = "organizationJob";
    this.api.getJob(url).subscribe(res => {
      const user = res.find((a: any) => {
        return a.userId === this.userId && a.jobId === row.id;
      })
      if (user) {
        this.dialog.open(DialogComponent, {
          width: '30%',
          data: row
        }).afterClosed().subscribe(val => {
          if (val === 'update') {
            this.getAllAdvertisement();
          }
        })

      } else {
        alert("You can edit the ads you have publish")

      }
    })
  }


  editLike(row: any) {
    const url = "useLike";
    this.api.getJob(url).subscribe(res => {
      const user = res.find((a: any) => {
        console.log(a.userId)
        return a.userId === this.userId && a.jobId === row.id;
      })
      if (user) {
        alert("You already liked the ad")
      } else {
        row.likes += 1;
        this.api.putJob(row, row.id, "jobList").subscribe({
          next: res =>
            alert("You liked it successfully the ad.")
        });
        const data = { userId: this.userId, jobId: row.id };
        this.api.postJob(data, url).subscribe({
          next: res =>
            this.getAllAdvertisement()
        });
      }
    })
  }

  deleteUsersJob(id: any) {
    const url = "organizationJob";
    this.api.deleteJob(id, url).subscribe(res => {

    });
  }

  deleteJob(row: any) {
    const url = "organizationJob";
    this.api.getJob(url).subscribe(res => {
      const user = res.find((a: any) => {
        return a.userId === this.userId && a.jobId === row.id;
      })
      console.log(user)
      if (user) {
        this.api.deleteJob(row.id, "jobList")
          .subscribe({
            next: (res) => {
              this.deleteUsersJob(user.id)

              alert("Advertisement deleted succefffully.");

              this.getAllAdvertisement();
            }
          })
      } else {
        alert("You can delete the ads you have published");
      }
    })
  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

