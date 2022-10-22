import { NgModule, Component, Input, Output, EventEmitter, forwardRef, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export const RATING_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Rating),
    multi: true
};
export class Rating {
    constructor(cd) {
        this.cd = cd;
        this.stars = 5;
        this.cancel = true;
        this.iconOnClass = 'pi pi-star-fill';
        this.iconOffClass = 'pi pi-star';
        this.iconCancelClass = 'pi pi-ban';
        this.onRate = new EventEmitter();
        this.onCancel = new EventEmitter();
        this.onModelChange = () => { };
        this.onModelTouched = () => { };
    }
    ngOnInit() {
        this.starsArray = [];
        for (let i = 0; i < this.stars; i++) {
            this.starsArray[i] = i;
        }
    }
    rate(event, i) {
        if (!this.readonly && !this.disabled) {
            this.value = (i + 1);
            this.onModelChange(this.value);
            this.onModelTouched();
            this.onRate.emit({
                originalEvent: event,
                value: (i + 1)
            });
        }
        event.preventDefault();
    }
    clear(event) {
        if (!this.readonly && !this.disabled) {
            this.value = null;
            this.onModelChange(this.value);
            this.onModelTouched();
            this.onCancel.emit(event);
        }
        event.preventDefault();
    }
    writeValue(value) {
        this.value = value;
        this.cd.detectChanges();
    }
    registerOnChange(fn) {
        this.onModelChange = fn;
    }
    registerOnTouched(fn) {
        this.onModelTouched = fn;
    }
    setDisabledState(val) {
        this.disabled = val;
        this.cd.markForCheck();
    }
}
Rating.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Rating, deps: [{ token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
Rating.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.7", type: Rating, selector: "p-rating", inputs: { disabled: "disabled", readonly: "readonly", stars: "stars", cancel: "cancel", iconOnClass: "iconOnClass", iconOnStyle: "iconOnStyle", iconOffClass: "iconOffClass", iconOffStyle: "iconOffStyle", iconCancelClass: "iconCancelClass", iconCancelStyle: "iconCancelStyle" }, outputs: { onRate: "onRate", onCancel: "onCancel" }, host: { classAttribute: "p-element" }, providers: [RATING_VALUE_ACCESSOR], ngImport: i0, template: `
        <div class="p-rating" [ngClass]="{'p-readonly': readonly, 'p-disabled': disabled}">
            <span [attr.tabindex]="(disabled || readonly) ? null : '0'" *ngIf="cancel" (click)="clear($event)" (keydown.enter)="clear($event)" class="p-rating-icon p-rating-cancel" [ngClass]="iconCancelClass" [ngStyle]="iconCancelStyle"></span>
            <span *ngFor="let star of starsArray;let i=index" class="p-rating-icon" [attr.tabindex]="(disabled || readonly) ? null : '0'"  (click)="rate($event,i)" (keydown.enter)="rate($event,i)"
                [ngClass]="(!value || i >= value) ? iconOffClass : iconOnClass"
                [ngStyle]="(!value || i >= value) ? iconOffStyle : iconOnStyle"></span>
        </div>
    `, isInline: true, styles: [".p-rating-icon{cursor:pointer}.p-rating.p-rating-readonly .p-rating-icon{cursor:default}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Rating, decorators: [{
            type: Component,
            args: [{ selector: 'p-rating', template: `
        <div class="p-rating" [ngClass]="{'p-readonly': readonly, 'p-disabled': disabled}">
            <span [attr.tabindex]="(disabled || readonly) ? null : '0'" *ngIf="cancel" (click)="clear($event)" (keydown.enter)="clear($event)" class="p-rating-icon p-rating-cancel" [ngClass]="iconCancelClass" [ngStyle]="iconCancelStyle"></span>
            <span *ngFor="let star of starsArray;let i=index" class="p-rating-icon" [attr.tabindex]="(disabled || readonly) ? null : '0'"  (click)="rate($event,i)" (keydown.enter)="rate($event,i)"
                [ngClass]="(!value || i >= value) ? iconOffClass : iconOnClass"
                [ngStyle]="(!value || i >= value) ? iconOffStyle : iconOnStyle"></span>
        </div>
    `, providers: [RATING_VALUE_ACCESSOR], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        'class': 'p-element'
                    }, styles: [".p-rating-icon{cursor:pointer}.p-rating.p-rating-readonly .p-rating-icon{cursor:default}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }]; }, propDecorators: { disabled: [{
                type: Input
            }], readonly: [{
                type: Input
            }], stars: [{
                type: Input
            }], cancel: [{
                type: Input
            }], iconOnClass: [{
                type: Input
            }], iconOnStyle: [{
                type: Input
            }], iconOffClass: [{
                type: Input
            }], iconOffStyle: [{
                type: Input
            }], iconCancelClass: [{
                type: Input
            }], iconCancelStyle: [{
                type: Input
            }], onRate: [{
                type: Output
            }], onCancel: [{
                type: Output
            }] } });
export class RatingModule {
}
RatingModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: RatingModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
RatingModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.7", ngImport: i0, type: RatingModule, declarations: [Rating], imports: [CommonModule], exports: [Rating] });
RatingModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: RatingModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: RatingModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [Rating],
                    declarations: [Rating]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmF0aW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9jb21wb25lbnRzL3JhdGluZy9yYXRpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQVEsS0FBSyxFQUFDLE1BQU0sRUFBQyxZQUFZLEVBQUMsVUFBVSxFQUFtQix1QkFBdUIsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUMxSixPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLGlCQUFpQixFQUF1QixNQUFNLGdCQUFnQixDQUFDOzs7QUFFdkUsTUFBTSxDQUFDLE1BQU0scUJBQXFCLEdBQVE7SUFDeEMsT0FBTyxFQUFFLGlCQUFpQjtJQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQztJQUNyQyxLQUFLLEVBQUUsSUFBSTtDQUNaLENBQUM7QUFvQkYsTUFBTSxPQUFPLE1BQU07SUEwQmYsWUFBb0IsRUFBcUI7UUFBckIsT0FBRSxHQUFGLEVBQUUsQ0FBbUI7UUFwQmhDLFVBQUssR0FBVyxDQUFDLENBQUM7UUFFbEIsV0FBTSxHQUFZLElBQUksQ0FBQztRQUV2QixnQkFBVyxHQUFXLGlCQUFpQixDQUFDO1FBSXhDLGlCQUFZLEdBQVcsWUFBWSxDQUFDO1FBSXBDLG9CQUFlLEdBQVcsV0FBVyxDQUFDO1FBSXJDLFdBQU0sR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUUvQyxhQUFRLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFNM0Qsa0JBQWEsR0FBYSxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUM7UUFFbkMsbUJBQWMsR0FBYSxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUM7SUFOUSxDQUFDO0lBVTdDLFFBQVE7UUFDSixJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztRQUNyQixLQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNoQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUMxQjtJQUNMLENBQUM7SUFFRCxJQUFJLENBQUMsS0FBSyxFQUFFLENBQVM7UUFDakIsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2hDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDckIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDL0IsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3RCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO2dCQUNiLGFBQWEsRUFBRSxLQUFLO2dCQUNwQixLQUFLLEVBQUUsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDO2FBQ2YsQ0FBQyxDQUFDO1NBQ047UUFDRCxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUVELEtBQUssQ0FBQyxLQUFLO1FBQ1AsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2hDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2xCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQy9CLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN0QixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM3QjtRQUNELEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRUQsVUFBVSxDQUFDLEtBQVU7UUFDakIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUM1QixDQUFDO0lBRUQsZ0JBQWdCLENBQUMsRUFBWTtRQUN6QixJQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQztJQUM1QixDQUFDO0lBRUQsaUJBQWlCLENBQUMsRUFBWTtRQUMxQixJQUFJLENBQUMsY0FBYyxHQUFHLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBRUQsZ0JBQWdCLENBQUMsR0FBWTtRQUN6QixJQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQztRQUNwQixJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQzNCLENBQUM7O21HQWxGUSxNQUFNO3VGQUFOLE1BQU0scVpBUkosQ0FBQyxxQkFBcUIsQ0FBQywwQkFSeEI7Ozs7Ozs7S0FPVDsyRkFTUSxNQUFNO2tCQWxCbEIsU0FBUzsrQkFDSSxVQUFVLFlBQ1Y7Ozs7Ozs7S0FPVCxhQUNVLENBQUMscUJBQXFCLENBQUMsbUJBQ2pCLHVCQUF1QixDQUFDLE1BQU0saUJBQ2hDLGlCQUFpQixDQUFDLElBQUksUUFFL0I7d0JBQ0YsT0FBTyxFQUFFLFdBQVc7cUJBQ3ZCO3dHQUlRLFFBQVE7c0JBQWhCLEtBQUs7Z0JBRUcsUUFBUTtzQkFBaEIsS0FBSztnQkFFRyxLQUFLO3NCQUFiLEtBQUs7Z0JBRUcsTUFBTTtzQkFBZCxLQUFLO2dCQUVHLFdBQVc7c0JBQW5CLEtBQUs7Z0JBRUcsV0FBVztzQkFBbkIsS0FBSztnQkFFRyxZQUFZO3NCQUFwQixLQUFLO2dCQUVHLFlBQVk7c0JBQXBCLEtBQUs7Z0JBRUcsZUFBZTtzQkFBdkIsS0FBSztnQkFFRyxlQUFlO3NCQUF2QixLQUFLO2dCQUVJLE1BQU07c0JBQWYsTUFBTTtnQkFFRyxRQUFRO3NCQUFqQixNQUFNOztBQWtFWCxNQUFNLE9BQU8sWUFBWTs7eUdBQVosWUFBWTswR0FBWixZQUFZLGlCQTFGWixNQUFNLGFBc0ZMLFlBQVksYUF0RmIsTUFBTTswR0EwRk4sWUFBWSxZQUpYLFlBQVk7MkZBSWIsWUFBWTtrQkFMeEIsUUFBUTttQkFBQztvQkFDTixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7b0JBQ3ZCLE9BQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQztvQkFDakIsWUFBWSxFQUFFLENBQUMsTUFBTSxDQUFDO2lCQUN6QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TmdNb2R1bGUsQ29tcG9uZW50LE9uSW5pdCxJbnB1dCxPdXRwdXQsRXZlbnRFbWl0dGVyLGZvcndhcmRSZWYsQ2hhbmdlRGV0ZWN0b3JSZWYsQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtOR19WQUxVRV9BQ0NFU1NPUiwgQ29udHJvbFZhbHVlQWNjZXNzb3J9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuZXhwb3J0IGNvbnN0IFJBVElOR19WQUxVRV9BQ0NFU1NPUjogYW55ID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gUmF0aW5nKSxcbiAgbXVsdGk6IHRydWVcbn07XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC1yYXRpbmcnLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJwLXJhdGluZ1wiIFtuZ0NsYXNzXT1cInsncC1yZWFkb25seSc6IHJlYWRvbmx5LCAncC1kaXNhYmxlZCc6IGRpc2FibGVkfVwiPlxuICAgICAgICAgICAgPHNwYW4gW2F0dHIudGFiaW5kZXhdPVwiKGRpc2FibGVkIHx8IHJlYWRvbmx5KSA/IG51bGwgOiAnMCdcIiAqbmdJZj1cImNhbmNlbFwiIChjbGljayk9XCJjbGVhcigkZXZlbnQpXCIgKGtleWRvd24uZW50ZXIpPVwiY2xlYXIoJGV2ZW50KVwiIGNsYXNzPVwicC1yYXRpbmctaWNvbiBwLXJhdGluZy1jYW5jZWxcIiBbbmdDbGFzc109XCJpY29uQ2FuY2VsQ2xhc3NcIiBbbmdTdHlsZV09XCJpY29uQ2FuY2VsU3R5bGVcIj48L3NwYW4+XG4gICAgICAgICAgICA8c3BhbiAqbmdGb3I9XCJsZXQgc3RhciBvZiBzdGFyc0FycmF5O2xldCBpPWluZGV4XCIgY2xhc3M9XCJwLXJhdGluZy1pY29uXCIgW2F0dHIudGFiaW5kZXhdPVwiKGRpc2FibGVkIHx8IHJlYWRvbmx5KSA/IG51bGwgOiAnMCdcIiAgKGNsaWNrKT1cInJhdGUoJGV2ZW50LGkpXCIgKGtleWRvd24uZW50ZXIpPVwicmF0ZSgkZXZlbnQsaSlcIlxuICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cIighdmFsdWUgfHwgaSA+PSB2YWx1ZSkgPyBpY29uT2ZmQ2xhc3MgOiBpY29uT25DbGFzc1wiXG4gICAgICAgICAgICAgICAgW25nU3R5bGVdPVwiKCF2YWx1ZSB8fCBpID49IHZhbHVlKSA/IGljb25PZmZTdHlsZSA6IGljb25PblN0eWxlXCI+PC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICBgLFxuICAgIHByb3ZpZGVyczogW1JBVElOR19WQUxVRV9BQ0NFU1NPUl0sXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgICBzdHlsZVVybHM6IFsnLi9yYXRpbmcuY3NzJ10sXG4gICAgaG9zdDoge1xuICAgICAgICAnY2xhc3MnOiAncC1lbGVtZW50J1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgUmF0aW5nIGltcGxlbWVudHMgT25Jbml0LENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcblxuICAgIEBJbnB1dCgpIGRpc2FibGVkOiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgcmVhZG9ubHk6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSBzdGFyczogbnVtYmVyID0gNTtcblxuICAgIEBJbnB1dCgpIGNhbmNlbDogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBASW5wdXQoKSBpY29uT25DbGFzczogc3RyaW5nID0gJ3BpIHBpLXN0YXItZmlsbCc7XG5cbiAgICBASW5wdXQoKSBpY29uT25TdHlsZTogYW55O1xuXG4gICAgQElucHV0KCkgaWNvbk9mZkNsYXNzOiBzdHJpbmcgPSAncGkgcGktc3Rhcic7XG5cbiAgICBASW5wdXQoKSBpY29uT2ZmU3R5bGU6IGFueTtcblxuICAgIEBJbnB1dCgpIGljb25DYW5jZWxDbGFzczogc3RyaW5nID0gJ3BpIHBpLWJhbic7XG5cbiAgICBASW5wdXQoKSBpY29uQ2FuY2VsU3R5bGU6IGFueTtcblxuICAgIEBPdXRwdXQoKSBvblJhdGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uQ2FuY2VsOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgY2Q6IENoYW5nZURldGVjdG9yUmVmKSB7fVxuXG4gICAgdmFsdWU6IG51bWJlcjtcblxuICAgIG9uTW9kZWxDaGFuZ2U6IEZ1bmN0aW9uID0gKCkgPT4ge307XG5cbiAgICBvbk1vZGVsVG91Y2hlZDogRnVuY3Rpb24gPSAoKSA9PiB7fTtcblxuICAgIHB1YmxpYyBzdGFyc0FycmF5OiBudW1iZXJbXTtcblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLnN0YXJzQXJyYXkgPSBbXTtcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMuc3RhcnM7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5zdGFyc0FycmF5W2ldID0gaTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJhdGUoZXZlbnQsIGk6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMucmVhZG9ubHkmJiF0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gKGkgKyAxKTtcbiAgICAgICAgICAgIHRoaXMub25Nb2RlbENoYW5nZSh0aGlzLnZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMub25Nb2RlbFRvdWNoZWQoKTtcbiAgICAgICAgICAgIHRoaXMub25SYXRlLmVtaXQoe1xuICAgICAgICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2ZW50LFxuICAgICAgICAgICAgICAgIHZhbHVlOiAoaSsxKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICBjbGVhcihldmVudCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMucmVhZG9ubHkmJiF0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMub25Nb2RlbENoYW5nZSh0aGlzLnZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMub25Nb2RlbFRvdWNoZWQoKTtcbiAgICAgICAgICAgIHRoaXMub25DYW5jZWwuZW1pdChldmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpIDogdm9pZCB7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5jZC5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJPbkNoYW5nZShmbjogRnVuY3Rpb24pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vbk1vZGVsQ2hhbmdlID0gZm47XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IEZ1bmN0aW9uKTogdm9pZCB7XG4gICAgICAgIHRoaXMub25Nb2RlbFRvdWNoZWQgPSBmbjtcbiAgICB9XG5cbiAgICBzZXREaXNhYmxlZFN0YXRlKHZhbDogYm9vbGVhbik6IHZvaWQge1xuICAgICAgICB0aGlzLmRpc2FibGVkID0gdmFsO1xuICAgICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbUmF0aW5nXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtSYXRpbmddXG59KVxuZXhwb3J0IGNsYXNzIFJhdGluZ01vZHVsZSB7IH1cbiJdfQ==