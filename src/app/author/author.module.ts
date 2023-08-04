import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { AuthorRoutingModule } from './author-routing.module';
import { AuthorMenuComponent } from './author-menu/author-menu.component';
import { AuthorComponent } from './author.component';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {MatStepperModule } from '@angular/material/stepper';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button'
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox'
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTabsModule} from '@angular/material/tabs';
import {MatBadgeModule} from '@angular/material/badge';



@NgModule({
  declarations: [AuthorMenuComponent, AuthorComponent],
  imports: [
    CommonModule,
    AuthorRoutingModule,

    ReactiveFormsModule,
    FormsModule,
    MatStepperModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatCheckboxModule,
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatExpansionModule,
    MatGridListModule,
    MatTooltipModule,
    MatTabsModule,
    MatBadgeModule


  ],
}) 
export class AuthorModule { }
