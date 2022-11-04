import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  iconName: string = "";
  titleName: string = "";

  home!: MenuItem;
  headerMenuItems: MenuItem[] = [
    { label: 'Scan', routerLink: '/dapp/scan' },
    { label: 'Block' },
    { label: 'Contract', routerLink: '/dapp/contract' },
    { label: 'App' }
  ];

  networks: any[] = ['Main', 'Test', 'Local'];
  selectedNetwork: any = "Local";

  constructor(
    private router: Router
  ) {

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) { }
      if (event instanceof NavigationEnd) {
        switch (event.url) {
          // case '/dapp':
          //   this.iconName = "pi pi-home";
          //   this.titleName = "Home";
          //   this.menuItems = [
          //     { label: 'Home' }
          //   ];
          //   break;
          // case '/dapp/dashboard':
          //   this.iconName = "pi pi-home";
          //   this.titleName = "Home";

          //   this.menuItems = [
          //     { label: 'Home' }
          //   ];
          //   break;
          case '/dapp':
            this.iconName = "pi pi-search";
            this.titleName = "Scan";
            break;
          case '/dapp/scan':
            this.iconName = "pi pi-search";
            this.titleName = "Scan";
            break;
          case '/dapp/contract':
            this.iconName = "pi pi-file-edit";
            this.titleName = "Contract";
            break;
          default:
            break;
        }

        this.home = { icon: 'pi pi-search', routerLink: '/dapp' };
      }

      if (event instanceof NavigationError) { }
    });

  }

  networkOnChange(event: any): void {
    localStorage.setItem('network', this.selectedNetwork);
    setTimeout(() => {
      location.reload();
    }, 300);
  }

  ngOnInit(): void {
    let network = localStorage.getItem('network');
    setTimeout(() => {
      if (network == null) {
        this.selectedNetwork = 'Test';
        localStorage.setItem('network', this.selectedNetwork);
        setTimeout(() => {
          location.reload();
        }, 100);
      } else {
        this.selectedNetwork = network;
      }
    }, 500);
  }
}
