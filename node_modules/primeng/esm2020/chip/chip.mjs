import { NgModule, Component, ChangeDetectionStrategy, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class Chip {
    constructor() {
        this.removeIcon = "pi pi-times-circle";
        this.onRemove = new EventEmitter();
        this.onImageError = new EventEmitter();
        this.visible = true;
    }
    containerClass() {
        return {
            'p-chip p-component': true,
            'p-chip-image': this.image != null
        };
    }
    close(event) {
        this.visible = false;
        this.onRemove.emit(event);
    }
    imageError(event) {
        this.onImageError.emit(event);
    }
}
Chip.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Chip, deps: [], target: i0.ɵɵFactoryTarget.Component });
Chip.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.7", type: Chip, selector: "p-chip", inputs: { label: "label", icon: "icon", image: "image", style: "style", styleClass: "styleClass", removable: "removable", removeIcon: "removeIcon" }, outputs: { onRemove: "onRemove", onImageError: "onImageError" }, host: { classAttribute: "p-element" }, ngImport: i0, template: `
        <div [ngClass]="containerClass()" [class]="styleClass" [ngStyle]="style" *ngIf="visible">
            <ng-content></ng-content>
            <img [src]="image" *ngIf="image;else iconTemplate" (error)="imageError($event)">
            <ng-template #iconTemplate><span *ngIf="icon" [class]="icon" [ngClass]="'p-chip-icon'"></span></ng-template>
            <div class="p-chip-text" *ngIf="label">{{label}}</div>
            <span *ngIf="removable" tabindex="0" [class]="removeIcon" [ngClass]="'pi-chip-remove-icon'" (click)="close($event)" (keydown.enter)="close($event)"></span>
        </div>
    `, isInline: true, styles: [".p-chip{display:inline-flex;align-items:center}.p-chip-text,.p-chip-icon.pi{line-height:1.5}.pi-chip-remove-icon{line-height:1.5;cursor:pointer}.p-chip img{border-radius:50%}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Chip, decorators: [{
            type: Component,
            args: [{ selector: 'p-chip', template: `
        <div [ngClass]="containerClass()" [class]="styleClass" [ngStyle]="style" *ngIf="visible">
            <ng-content></ng-content>
            <img [src]="image" *ngIf="image;else iconTemplate" (error)="imageError($event)">
            <ng-template #iconTemplate><span *ngIf="icon" [class]="icon" [ngClass]="'p-chip-icon'"></span></ng-template>
            <div class="p-chip-text" *ngIf="label">{{label}}</div>
            <span *ngIf="removable" tabindex="0" [class]="removeIcon" [ngClass]="'pi-chip-remove-icon'" (click)="close($event)" (keydown.enter)="close($event)"></span>
        </div>
    `, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        'class': 'p-element'
                    }, styles: [".p-chip{display:inline-flex;align-items:center}.p-chip-text,.p-chip-icon.pi{line-height:1.5}.pi-chip-remove-icon{line-height:1.5;cursor:pointer}.p-chip img{border-radius:50%}\n"] }]
        }], propDecorators: { label: [{
                type: Input
            }], icon: [{
                type: Input
            }], image: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], removable: [{
                type: Input
            }], removeIcon: [{
                type: Input
            }], onRemove: [{
                type: Output
            }], onImageError: [{
                type: Output
            }] } });
export class ChipModule {
}
ChipModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ChipModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ChipModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.7", ngImport: i0, type: ChipModule, declarations: [Chip], imports: [CommonModule], exports: [Chip] });
ChipModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ChipModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ChipModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [Chip],
                    declarations: [Chip]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy9jaGlwL2NoaXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsdUJBQXVCLEVBQUUsaUJBQWlCLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDN0gsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDOzs7QUFvQi9DLE1BQU0sT0FBTyxJQUFJO0lBbEJqQjtRQWdDYSxlQUFVLEdBQVcsb0JBQW9CLENBQUM7UUFFekMsYUFBUSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBRWpELGlCQUFZLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFFL0QsWUFBTyxHQUFZLElBQUksQ0FBQztLQWlCM0I7SUFmRyxjQUFjO1FBQ1YsT0FBTztZQUNILG9CQUFvQixFQUFFLElBQUk7WUFDMUIsY0FBYyxFQUFFLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSTtTQUNyQyxDQUFDO0lBQ04sQ0FBQztJQUVELEtBQUssQ0FBQyxLQUFLO1FBQ1AsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFDckIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDN0IsQ0FBQztJQUVELFVBQVUsQ0FBQyxLQUFLO1FBQ1osSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbEMsQ0FBQzs7aUdBcENRLElBQUk7cUZBQUosSUFBSSw0U0FoQkg7Ozs7Ozs7O0tBUVQ7MkZBUVEsSUFBSTtrQkFsQmhCLFNBQVM7K0JBQ0ksUUFBUSxZQUNSOzs7Ozs7OztLQVFULG1CQUNnQix1QkFBdUIsQ0FBQyxNQUFNLGlCQUNoQyxpQkFBaUIsQ0FBQyxJQUFJLFFBRS9CO3dCQUNGLE9BQU8sRUFBRSxXQUFXO3FCQUN2Qjs4QkFJUSxLQUFLO3NCQUFiLEtBQUs7Z0JBRUcsSUFBSTtzQkFBWixLQUFLO2dCQUVHLEtBQUs7c0JBQWIsS0FBSztnQkFFRyxLQUFLO3NCQUFiLEtBQUs7Z0JBRUcsVUFBVTtzQkFBbEIsS0FBSztnQkFFRyxTQUFTO3NCQUFqQixLQUFLO2dCQUVHLFVBQVU7c0JBQWxCLEtBQUs7Z0JBRUksUUFBUTtzQkFBakIsTUFBTTtnQkFFRyxZQUFZO3NCQUFyQixNQUFNOztBQTBCWCxNQUFNLE9BQU8sVUFBVTs7dUdBQVYsVUFBVTt3R0FBVixVQUFVLGlCQTVDVixJQUFJLGFBd0NILFlBQVksYUF4Q2IsSUFBSTt3R0E0Q0osVUFBVSxZQUpULFlBQVk7MkZBSWIsVUFBVTtrQkFMdEIsUUFBUTttQkFBQztvQkFDTixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7b0JBQ3ZCLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQztvQkFDZixZQUFZLEVBQUUsQ0FBQyxJQUFJLENBQUM7aUJBQ3ZCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUsIENvbXBvbmVudCwgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIFZpZXdFbmNhcHN1bGF0aW9uLCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC1jaGlwJyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8ZGl2IFtuZ0NsYXNzXT1cImNvbnRhaW5lckNsYXNzKClcIiBbY2xhc3NdPVwic3R5bGVDbGFzc1wiIFtuZ1N0eWxlXT1cInN0eWxlXCIgKm5nSWY9XCJ2aXNpYmxlXCI+XG4gICAgICAgICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgICAgICAgICA8aW1nIFtzcmNdPVwiaW1hZ2VcIiAqbmdJZj1cImltYWdlO2Vsc2UgaWNvblRlbXBsYXRlXCIgKGVycm9yKT1cImltYWdlRXJyb3IoJGV2ZW50KVwiPlxuICAgICAgICAgICAgPG5nLXRlbXBsYXRlICNpY29uVGVtcGxhdGU+PHNwYW4gKm5nSWY9XCJpY29uXCIgW2NsYXNzXT1cImljb25cIiBbbmdDbGFzc109XCIncC1jaGlwLWljb24nXCI+PC9zcGFuPjwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC1jaGlwLXRleHRcIiAqbmdJZj1cImxhYmVsXCI+e3tsYWJlbH19PC9kaXY+XG4gICAgICAgICAgICA8c3BhbiAqbmdJZj1cInJlbW92YWJsZVwiIHRhYmluZGV4PVwiMFwiIFtjbGFzc109XCJyZW1vdmVJY29uXCIgW25nQ2xhc3NdPVwiJ3BpLWNoaXAtcmVtb3ZlLWljb24nXCIgKGNsaWNrKT1cImNsb3NlKCRldmVudClcIiAoa2V5ZG93bi5lbnRlcik9XCJjbG9zZSgkZXZlbnQpXCI+PC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICBgLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gICAgc3R5bGVVcmxzOiBbJy4vY2hpcC5jc3MnXSxcbiAgICBob3N0OiB7XG4gICAgICAgICdjbGFzcyc6ICdwLWVsZW1lbnQnXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBDaGlwIHtcblxuICAgIEBJbnB1dCgpIGxhYmVsOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBpY29uOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBpbWFnZTogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgc3R5bGU6IGFueTtcblxuICAgIEBJbnB1dCgpIHN0eWxlQ2xhc3M6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHJlbW92YWJsZTogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIHJlbW92ZUljb246IHN0cmluZyA9IFwicGkgcGktdGltZXMtY2lyY2xlXCI7XG5cbiAgICBAT3V0cHV0KCkgb25SZW1vdmU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgIFxuICAgIEBPdXRwdXQoKSBvbkltYWdlRXJyb3I6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgIFxuICAgIHZpc2libGU6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgY29udGFpbmVyQ2xhc3MoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAncC1jaGlwIHAtY29tcG9uZW50JzogdHJ1ZSxcbiAgICAgICAgICAgICdwLWNoaXAtaW1hZ2UnOiB0aGlzLmltYWdlICE9IG51bGxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBjbG9zZShldmVudCkge1xuICAgICAgICB0aGlzLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5vblJlbW92ZS5lbWl0KGV2ZW50KVxuICAgIH1cblxuICAgIGltYWdlRXJyb3IoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5vbkltYWdlRXJyb3IuZW1pdChldmVudCk7XG4gICAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdLFxuICAgIGV4cG9ydHM6IFtDaGlwXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtDaGlwXVxufSlcbmV4cG9ydCBjbGFzcyBDaGlwTW9kdWxlIHsgfVxuIl19