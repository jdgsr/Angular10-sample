import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GithubApiService } from 'src/app/service/github-api.service';
import {Position} from '../../interfaces/position';
@Component({
  selector: 'app-position-item',
  templateUrl: './position-item.component.html',
  styleUrls: ['./position-item.component.css']
})
export class PositionItemComponent implements OnInit {
  isLoadingResults = false;
  position: Position;
  dataId = null;

  constructor(private githubApiService: GithubApiService, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.dataId = data.id;
  }

  /* Id we receive from parent Home component . Get the id from data and make GET Id.json api call */
  ngOnInit(): void {
    this.isLoadingResults = true;
    if (this.dataId) {
      this.githubApiService.getPositionById(this.dataId)
        .subscribe(data => {
          this.position = data;
          this.isLoadingResults = false;
        });
    }
  }
}

