import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { PositionRoutingModule } from './position-routing.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {SanitizeHtmlPipe} from './pipes/sanitize-html.pipe';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDialogModule} from '@angular/material/dialog';
import {MatGridListModule} from '@angular/material/grid-list';
import { PositionItemComponent } from './components/position-item/position-item.component';
import {MatToolbarModule} from '@angular/material/toolbar';
@NgModule({
  declarations: [HomeComponent, SanitizeHtmlPipe, PositionItemComponent],
  imports: [
    MatPaginatorModule,
    MatTableModule,
    MatInputModule,
    MatDialogModule,
    MatGridListModule,
    CommonModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    PositionRoutingModule
  ],
  entryComponents: [HomeComponent],
  providers: [HttpClient]
})
export class PositionModule { }
