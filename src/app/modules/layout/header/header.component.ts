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
  titleName: string = "Humidefi";
  home!: MenuItem;
  menuItems: MenuItem[] = [
    { label: 'Scan' },
    { label: 'Block' },
    { label: 'Smart Contract' },
    { label: 'App' },
  ];

  selected_network: any = "Local";
  isComponentShown: boolean = false;

  networks: any[] = [
    {
      name: 'Main',
      icon: 'testnet-icon'
    },
    {
      name: 'Test',
      icon: 'testnet-icon'
    },
    {
      name: 'Local',
      icon: 'devnet-icon'
    }
  ];

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
          // case '/dapp':
          //   this.iconName = "pi pi-search";
          //   this.titleName = "Scan";
          //   this.menuItems = [
          //     { label: 'Home' }
          //   ];
          //   break;
          // case '/dapp/scan':
          //   this.iconName = "pi pi-search";
          //   this.titleName = "Scan";
          //   this.menuItems = [
          //     { label: 'Home' }
          //   ];
          //   break;
          // default:
          //   break;
        }

        this.home = { icon: 'pi pi-search', routerLink: '/dapp' };
      }

      if (event instanceof NavigationError) { }
    });
  }

  networkOnChange(event: any): void {
    localStorage.setItem('network', this.selected_network);
    setTimeout(() => {
      location.reload();
    }, 300);
  }
  ngOnInit(): void {
    let network = localStorage.getItem('network');
    setTimeout(() => {
      if (network == null) {
        this.selected_network = 'Test';
        localStorage.setItem('network', this.selected_network);
        setTimeout(() => {
          location.reload();
        }, 100);
      } else {
        this.selected_network = network;
      }

      this.isComponentShown = true;
    }, 500);
  }
}
