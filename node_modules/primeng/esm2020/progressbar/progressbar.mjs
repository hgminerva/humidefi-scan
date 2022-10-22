import { NgModule, Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class ProgressBar {
    constructor() {
        this.showValue = true;
        this.unit = '%';
        this.mode = 'determinate';
    }
}
ProgressBar.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ProgressBar, deps: [], target: i0.ɵɵFactoryTarget.Component });
ProgressBar.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.7", type: ProgressBar, selector: "p-progressBar", inputs: { value: "value", showValue: "showValue", style: "style", styleClass: "styleClass", unit: "unit", mode: "mode" }, host: { classAttribute: "p-element" }, ngImport: i0, template: `
        <div [class]="styleClass" [ngStyle]="style" role="progressbar" aria-valuemin="0" [attr.aria-valuenow]="value" aria-valuemax="100"
            [ngClass]="{'p-progressbar p-component': true, 'p-progressbar-determinate': (mode === 'determinate'), 'p-progressbar-indeterminate': (mode === 'indeterminate')}">
            <div *ngIf="mode === 'determinate'" class="p-progressbar-value p-progressbar-value-animate" [style.width]="value + '%'" style="display:flex">
                <div *ngIf="showValue" class="p-progressbar-label" [style.display]="value != null && value !== 0 ? 'flex' : 'none'">{{value}}{{unit}}</div>
            </div>
            <div *ngIf="mode === 'indeterminate'" class="p-progressbar-indeterminate-container">
                <div class="p-progressbar-value p-progressbar-value-animate"></div>
            </div>
        </div>
    `, isInline: true, styles: [".p-progressbar{position:relative;overflow:hidden}.p-progressbar-determinate .p-progressbar-value{height:100%;width:0%;position:absolute;display:none;border:0 none;display:flex;align-items:center;justify-content:center;overflow:hidden}.p-progressbar-determinate .p-progressbar-label{display:inline-flex}.p-progressbar-determinate .p-progressbar-value-animate{transition:width 1s ease-in-out}.p-progressbar-indeterminate .p-progressbar-value:before{content:\"\";position:absolute;background-color:inherit;top:0;left:0;bottom:0;will-change:left,right;animation:p-progressbar-indeterminate-anim 2.1s cubic-bezier(.65,.815,.735,.395) infinite}.p-progressbar-indeterminate .p-progressbar-value:after{content:\"\";position:absolute;background-color:inherit;top:0;left:0;bottom:0;will-change:left,right;animation:p-progressbar-indeterminate-anim-short 2.1s cubic-bezier(.165,.84,.44,1) infinite;animation-delay:1.15s}@keyframes p-progressbar-indeterminate-anim{0%{left:-35%;right:100%}60%{left:100%;right:-90%}to{left:100%;right:-90%}}@keyframes p-progressbar-indeterminate-anim-short{0%{left:-200%;right:100%}60%{left:107%;right:-8%}to{left:107%;right:-8%}}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ProgressBar, decorators: [{
            type: Component,
            args: [{ selector: 'p-progressBar', template: `
        <div [class]="styleClass" [ngStyle]="style" role="progressbar" aria-valuemin="0" [attr.aria-valuenow]="value" aria-valuemax="100"
            [ngClass]="{'p-progressbar p-component': true, 'p-progressbar-determinate': (mode === 'determinate'), 'p-progressbar-indeterminate': (mode === 'indeterminate')}">
            <div *ngIf="mode === 'determinate'" class="p-progressbar-value p-progressbar-value-animate" [style.width]="value + '%'" style="display:flex">
                <div *ngIf="showValue" class="p-progressbar-label" [style.display]="value != null && value !== 0 ? 'flex' : 'none'">{{value}}{{unit}}</div>
            </div>
            <div *ngIf="mode === 'indeterminate'" class="p-progressbar-indeterminate-container">
                <div class="p-progressbar-value p-progressbar-value-animate"></div>
            </div>
        </div>
    `, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        'class': 'p-element'
                    }, styles: [".p-progressbar{position:relative;overflow:hidden}.p-progressbar-determinate .p-progressbar-value{height:100%;width:0%;position:absolute;display:none;border:0 none;display:flex;align-items:center;justify-content:center;overflow:hidden}.p-progressbar-determinate .p-progressbar-label{display:inline-flex}.p-progressbar-determinate .p-progressbar-value-animate{transition:width 1s ease-in-out}.p-progressbar-indeterminate .p-progressbar-value:before{content:\"\";position:absolute;background-color:inherit;top:0;left:0;bottom:0;will-change:left,right;animation:p-progressbar-indeterminate-anim 2.1s cubic-bezier(.65,.815,.735,.395) infinite}.p-progressbar-indeterminate .p-progressbar-value:after{content:\"\";position:absolute;background-color:inherit;top:0;left:0;bottom:0;will-change:left,right;animation:p-progressbar-indeterminate-anim-short 2.1s cubic-bezier(.165,.84,.44,1) infinite;animation-delay:1.15s}@keyframes p-progressbar-indeterminate-anim{0%{left:-35%;right:100%}60%{left:100%;right:-90%}to{left:100%;right:-90%}}@keyframes p-progressbar-indeterminate-anim-short{0%{left:-200%;right:100%}60%{left:107%;right:-8%}to{left:107%;right:-8%}}\n"] }]
        }], propDecorators: { value: [{
                type: Input
            }], showValue: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], unit: [{
                type: Input
            }], mode: [{
                type: Input
            }] } });
export class ProgressBarModule {
}
ProgressBarModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ProgressBarModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ProgressBarModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.7", ngImport: i0, type: ProgressBarModule, declarations: [ProgressBar], imports: [CommonModule], exports: [ProgressBar] });
ProgressBarModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ProgressBarModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ProgressBarModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [ProgressBar],
                    declarations: [ProgressBar]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3NiYXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvcHJvZ3Jlc3NiYXIvcHJvZ3Jlc3NiYXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsS0FBSyxFQUFDLHVCQUF1QixFQUFFLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ2xHLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQzs7O0FBc0I3QyxNQUFNLE9BQU8sV0FBVztJQXBCeEI7UUF3QmEsY0FBUyxHQUFZLElBQUksQ0FBQztRQU0xQixTQUFJLEdBQVcsR0FBRyxDQUFDO1FBRW5CLFNBQUksR0FBVyxhQUFhLENBQUM7S0FFekM7O3dHQWRZLFdBQVc7NEZBQVgsV0FBVyxzTkFsQlY7Ozs7Ozs7Ozs7S0FVVDsyRkFRUSxXQUFXO2tCQXBCdkIsU0FBUzsrQkFDSSxlQUFlLFlBQ2Y7Ozs7Ozs7Ozs7S0FVVCxtQkFDZ0IsdUJBQXVCLENBQUMsTUFBTSxpQkFDaEMsaUJBQWlCLENBQUMsSUFBSSxRQUUvQjt3QkFDRixPQUFPLEVBQUUsV0FBVztxQkFDdkI7OEJBSVEsS0FBSztzQkFBYixLQUFLO2dCQUVHLFNBQVM7c0JBQWpCLEtBQUs7Z0JBRUcsS0FBSztzQkFBYixLQUFLO2dCQUVHLFVBQVU7c0JBQWxCLEtBQUs7Z0JBRUcsSUFBSTtzQkFBWixLQUFLO2dCQUVHLElBQUk7c0JBQVosS0FBSzs7QUFTVixNQUFNLE9BQU8saUJBQWlCOzs4R0FBakIsaUJBQWlCOytHQUFqQixpQkFBaUIsaUJBckJqQixXQUFXLGFBaUJWLFlBQVksYUFqQmIsV0FBVzsrR0FxQlgsaUJBQWlCLFlBSmhCLFlBQVk7MkZBSWIsaUJBQWlCO2tCQUw3QixRQUFRO21CQUFDO29CQUNOLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztvQkFDdkIsT0FBTyxFQUFFLENBQUMsV0FBVyxDQUFDO29CQUN0QixZQUFZLEVBQUUsQ0FBQyxXQUFXLENBQUM7aUJBQzlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtOZ01vZHVsZSxDb21wb25lbnQsSW5wdXQsQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3AtcHJvZ3Jlc3NCYXInLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxkaXYgW2NsYXNzXT1cInN0eWxlQ2xhc3NcIiBbbmdTdHlsZV09XCJzdHlsZVwiIHJvbGU9XCJwcm9ncmVzc2JhclwiIGFyaWEtdmFsdWVtaW49XCIwXCIgW2F0dHIuYXJpYS12YWx1ZW5vd109XCJ2YWx1ZVwiIGFyaWEtdmFsdWVtYXg9XCIxMDBcIlxuICAgICAgICAgICAgW25nQ2xhc3NdPVwieydwLXByb2dyZXNzYmFyIHAtY29tcG9uZW50JzogdHJ1ZSwgJ3AtcHJvZ3Jlc3NiYXItZGV0ZXJtaW5hdGUnOiAobW9kZSA9PT0gJ2RldGVybWluYXRlJyksICdwLXByb2dyZXNzYmFyLWluZGV0ZXJtaW5hdGUnOiAobW9kZSA9PT0gJ2luZGV0ZXJtaW5hdGUnKX1cIj5cbiAgICAgICAgICAgIDxkaXYgKm5nSWY9XCJtb2RlID09PSAnZGV0ZXJtaW5hdGUnXCIgY2xhc3M9XCJwLXByb2dyZXNzYmFyLXZhbHVlIHAtcHJvZ3Jlc3NiYXItdmFsdWUtYW5pbWF0ZVwiIFtzdHlsZS53aWR0aF09XCJ2YWx1ZSArICclJ1wiIHN0eWxlPVwiZGlzcGxheTpmbGV4XCI+XG4gICAgICAgICAgICAgICAgPGRpdiAqbmdJZj1cInNob3dWYWx1ZVwiIGNsYXNzPVwicC1wcm9ncmVzc2Jhci1sYWJlbFwiIFtzdHlsZS5kaXNwbGF5XT1cInZhbHVlICE9IG51bGwgJiYgdmFsdWUgIT09IDAgPyAnZmxleCcgOiAnbm9uZSdcIj57e3ZhbHVlfX17e3VuaXR9fTwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2ICpuZ0lmPVwibW9kZSA9PT0gJ2luZGV0ZXJtaW5hdGUnXCIgY2xhc3M9XCJwLXByb2dyZXNzYmFyLWluZGV0ZXJtaW5hdGUtY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtcHJvZ3Jlc3NiYXItdmFsdWUgcC1wcm9ncmVzc2Jhci12YWx1ZS1hbmltYXRlXCI+PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgYCxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAgIHN0eWxlVXJsczogWycuL3Byb2dyZXNzYmFyLmNzcyddLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgJ2NsYXNzJzogJ3AtZWxlbWVudCdcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIFByb2dyZXNzQmFyIHtcblxuICAgIEBJbnB1dCgpIHZhbHVlOiBhbnk7XG5cbiAgICBASW5wdXQoKSBzaG93VmFsdWU6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgQElucHV0KCkgc3R5bGU6IGFueTtcblxuICAgIEBJbnB1dCgpIHN0eWxlQ2xhc3M6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHVuaXQ6IHN0cmluZyA9ICclJztcblxuICAgIEBJbnB1dCgpIG1vZGU6IHN0cmluZyA9ICdkZXRlcm1pbmF0ZSc7XG5cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbUHJvZ3Jlc3NCYXJdLFxuICAgIGRlY2xhcmF0aW9uczogW1Byb2dyZXNzQmFyXVxufSlcbmV4cG9ydCBjbGFzcyBQcm9ncmVzc0Jhck1vZHVsZSB7IH1cbiJdfQ==