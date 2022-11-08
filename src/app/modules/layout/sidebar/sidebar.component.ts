import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor() { }

  menuItems: MenuItem[] = [];

  ngOnInit(): void {
    this.menuItems = [
      // { label: 'Home', routerLink: '/dapp/dashboard', icon: 'pi pi-home' },
      { label: 'Scan', routerLink: '/dapp/scan', icon: 'pi pi-search' },
      { label: 'Block', routerLink: '/dapp/blocks', icon: 'pi pi-th-large' },
      { label: 'Contract', routerLink: '/dapp/contract', icon: 'pi pi-file-edit' },
    ];
  }
}
