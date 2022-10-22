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
  menuItems: MenuItem[] = [];

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
            this.menuItems = [
              { label: 'Home' }
            ];
            break;
          default:
            break;
        }

        this.home = { icon: 'pi pi-home', routerLink: '/dapp' };
      }

      if (event instanceof NavigationError) { }
    });
  }

  ngOnInit(): void {
    
  }
}
