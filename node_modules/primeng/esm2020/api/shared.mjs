import { NgModule, Directive, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import * as i0 from "@angular/core";
export class Header {
}
Header.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Header, deps: [], target: i0.ɵɵFactoryTarget.Component });
Header.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.7", type: Header, selector: "p-header", ngImport: i0, template: '<ng-content></ng-content>', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Header, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-header',
                    template: '<ng-content></ng-content>'
                }]
        }] });
export class Footer {
}
Footer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Footer, deps: [], target: i0.ɵɵFactoryTarget.Component });
Footer.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.7", type: Footer, selector: "p-footer", ngImport: i0, template: '<ng-content></ng-content>', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Footer, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-footer',
                    template: '<ng-content></ng-content>'
                }]
        }] });
export class PrimeTemplate {
    constructor(template) {
        this.template = template;
    }
    getType() {
        return this.name;
    }
}
PrimeTemplate.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: PrimeTemplate, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
PrimeTemplate.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.0.7", type: PrimeTemplate, selector: "[pTemplate]", inputs: { type: "type", name: ["pTemplate", "name"] }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: PrimeTemplate, decorators: [{
            type: Directive,
            args: [{
                    selector: '[pTemplate]',
                    host: {}
                }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; }, propDecorators: { type: [{
                type: Input
            }], name: [{
                type: Input,
                args: ['pTemplate']
            }] } });
export class SharedModule {
}
SharedModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: SharedModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
SharedModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.7", ngImport: i0, type: SharedModule, declarations: [Header, Footer, PrimeTemplate], imports: [CommonModule], exports: [Header, Footer, PrimeTemplate] });
SharedModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: SharedModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: SharedModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [Header, Footer, PrimeTemplate],
                    declarations: [Header, Footer, PrimeTemplate]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcmVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9jb21wb25lbnRzL2FwaS9zaGFyZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFFBQVEsRUFBYyxTQUFTLEVBQUMsS0FBSyxFQUE0RSxNQUFNLGVBQWUsQ0FBQztBQUMvSSxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGVBQWUsQ0FBQzs7QUFNeEMsTUFBTSxPQUFPLE1BQU07O21HQUFOLE1BQU07dUZBQU4sTUFBTSxnREFGTCwyQkFBMkI7MkZBRTVCLE1BQU07a0JBSmxCLFNBQVM7bUJBQUM7b0JBQ1AsUUFBUSxFQUFFLFVBQVU7b0JBQ3BCLFFBQVEsRUFBRSwyQkFBMkI7aUJBQ3hDOztBQU9ELE1BQU0sT0FBTyxNQUFNOzttR0FBTixNQUFNO3VGQUFOLE1BQU0sZ0RBRkwsMkJBQTJCOzJGQUU1QixNQUFNO2tCQUpsQixTQUFTO21CQUFDO29CQUNQLFFBQVEsRUFBRSxVQUFVO29CQUNwQixRQUFRLEVBQUUsMkJBQTJCO2lCQUN4Qzs7QUFRRCxNQUFNLE9BQU8sYUFBYTtJQU10QixZQUFtQixRQUEwQjtRQUExQixhQUFRLEdBQVIsUUFBUSxDQUFrQjtJQUFHLENBQUM7SUFFakQsT0FBTztRQUNILE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQztJQUNyQixDQUFDOzswR0FWUSxhQUFhOzhGQUFiLGFBQWE7MkZBQWIsYUFBYTtrQkFMekIsU0FBUzttQkFBQztvQkFDUCxRQUFRLEVBQUUsYUFBYTtvQkFDdkIsSUFBSSxFQUFFLEVBQ0w7aUJBQ0o7a0dBR1ksSUFBSTtzQkFBWixLQUFLO2dCQUVjLElBQUk7c0JBQXZCLEtBQUs7dUJBQUMsV0FBVzs7QUFjdEIsTUFBTSxPQUFPLFlBQVk7O3lHQUFaLFlBQVk7MEdBQVosWUFBWSxpQkEvQlosTUFBTSxFQU1OLE1BQU0sRUFPTixhQUFhLGFBY1osWUFBWSxhQTNCYixNQUFNLEVBTU4sTUFBTSxFQU9OLGFBQWE7MEdBa0JiLFlBQVksWUFKWCxZQUFZOzJGQUliLFlBQVk7a0JBTHhCLFFBQVE7bUJBQUM7b0JBQ04sT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO29CQUN2QixPQUFPLEVBQUUsQ0FBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLGFBQWEsQ0FBQztvQkFDdEMsWUFBWSxFQUFFLENBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxhQUFhLENBQUM7aUJBQzlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtOZ01vZHVsZSxFdmVudEVtaXR0ZXIsRGlyZWN0aXZlLElucHV0LE91dHB1dCxDb250ZW50Q2hpbGRyZW4sQ29udGVudENoaWxkLFRlbXBsYXRlUmVmLEFmdGVyQ29udGVudEluaXQsUXVlcnlMaXN0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtDb21wb25lbnR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3AtaGVhZGVyJyxcbiAgICB0ZW1wbGF0ZTogJzxuZy1jb250ZW50PjwvbmctY29udGVudD4nXG59KVxuZXhwb3J0IGNsYXNzIEhlYWRlciB7fVxuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3AtZm9vdGVyJyxcbiAgICB0ZW1wbGF0ZTogJzxuZy1jb250ZW50PjwvbmctY29udGVudD4nXG59KVxuZXhwb3J0IGNsYXNzIEZvb3RlciB7fVxuXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogJ1twVGVtcGxhdGVdJyxcbiAgICBob3N0OiB7XG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBQcmltZVRlbXBsYXRlIHtcbiAgICBcbiAgICBASW5wdXQoKSB0eXBlOiBzdHJpbmc7XG4gICAgXG4gICAgQElucHV0KCdwVGVtcGxhdGUnKSBuYW1lOiBzdHJpbmc7XG4gICAgXG4gICAgY29uc3RydWN0b3IocHVibGljIHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+KSB7fVxuICAgIFxuICAgIGdldFR5cGUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmFtZTtcbiAgICB9XG59XG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG4gICAgZXhwb3J0czogW0hlYWRlcixGb290ZXIsUHJpbWVUZW1wbGF0ZV0sXG4gICAgZGVjbGFyYXRpb25zOiBbSGVhZGVyLEZvb3RlcixQcmltZVRlbXBsYXRlXVxufSlcbmV4cG9ydCBjbGFzcyBTaGFyZWRNb2R1bGUgeyB9XG4iXX0=