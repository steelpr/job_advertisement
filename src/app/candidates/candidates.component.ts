import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../services/api.service';


@Component({
  selector: 'app-candidates',
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.scss']
})
export class CandidatesComponent implements OnInit {
  id!: any;
  candidates: any[] = []
  allCandidates: string[] = []
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['username'];

  constructor(private api: ApiService, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.id = data.item
  }

  ngOnInit(): void {
    const url = "usersJob";
    this.api.getJob(url)
      .subscribe(res => {
        this.candidates = res;
        for (var val of this.candidates) {
          if (val.jobId == this.id.id) {
            this.allCandidates.push(val)
          }
        }
        this.dataSource = new MatTableDataSource(this.allCandidates);

      })
  }
}



