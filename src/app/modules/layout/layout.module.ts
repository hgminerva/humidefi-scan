import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';

import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { DividerModule } from 'primeng/divider';
import { ProgressBarModule } from 'primeng/progressbar';

import { LayoutComponent } from './layout.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MobilebarComponent } from './mobilebar/mobilebar.component';
import { TopbarComponent } from './topbar/topbar.component';
import {DropdownModule} from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import {MenubarModule} from 'primeng/menubar';

@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    MobilebarComponent,
    TopbarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    LayoutRoutingModule,
    MenuModule,
    ButtonModule,
    BreadcrumbModule,
    DialogModule,
    TableModule,
    DividerModule,
    ProgressBarModule,
    DropdownModule,
    MenubarModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    TopbarComponent,
    MobilebarComponent
  ]
})
export class LayoutModule { }
