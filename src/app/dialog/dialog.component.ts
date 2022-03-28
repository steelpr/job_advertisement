import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

interface Type {
  value: string;
  viewValue: string;
}

interface Ctegory {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  adForm!: FormGroup;
  actionBtn: string = "Save"
  url: string = "jobList"
  newJob: any = {};

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<DialogComponent>, @Inject(MAT_DIALOG_DATA) public userId: any) { }

  types: Type[] = [
    { value: 'Full-time', viewValue: 'Full-time' },
    { value: 'Part-time', viewValue: 'Part-time' },
    { value: 'Remote', viewValue: 'Remote' }
  ];

  categories: Ctegory[] = [
    { value: 'Office administration', viewValue: 'Office administration' },
    { value: 'Full-Stack Developer', viewValue: 'Full-Stack Developer' },
    { value: 'Back-End Developer', viewValue: 'Back-End Developer' },
    { value: 'Front-End Developer', viewValue: 'Front-End Developer' }


  ];

  ngOnInit(): void {
    this.adForm = this.formBuilder.group({
      title: ['', Validators.required],
      type: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required],
      likes: [0],
      candidates: [0]

    });

    if (this.editData) {
      this.actionBtn = "Update";
      this.adForm.controls['title'].setValue(this.editData.title);
      this.adForm.controls['type'].setValue(this.editData.type);
      this.adForm.controls['category'].setValue(this.editData.category);
      this.adForm.controls['description'].setValue(this.editData.description);
      this.adForm.controls['likes'].setValue(this.editData.likes);
      this.adForm.controls['candidates'].setValue(this.editData.likes);


    }
    this.api.getJob("jobList").subscribe(data => { this.newJob = data });
  }

  addJob() {
    const url = "jobList";
    if (!this.editData) {
      if (this.adForm.valid) {
        this.api.postJob(this.adForm.value, url)
          .subscribe({
            next: (res) => {

              alert("The advertisement added successfully")

              this.adForm.reset()
              this.dialogRef.close("save");
            },
            error: () => {
              alert("Error while adding the advertisement")
            }
          })
        this.relationUserJob();
      }
    } else {
      this.updateJob();
    }
  }

  relationUserJob() {
    console.log(this.newJob.length)//.map(ds => ds.length).headers.get('X-Total-Count')); })
    var user = JSON.parse(localStorage.getItem("user")!);
    var data = { jobId: this.newJob[this.newJob.length - 1].id + 1, userId: user.id }
    this.api.postJob(data, "organizationJob").subscribe({
    })
  }

  updateJob() {
    this.api.putJob(this.adForm.value, this.editData.id, "jobList")
      .subscribe({
        next: (res) => {
          alert("Advertisement updated successfully");
          this.adForm.reset();
          this.dialogRef.close('update');
        },
        error: () => {
          alert("Error while updating the advertisement");
        }

      })
  }
}
