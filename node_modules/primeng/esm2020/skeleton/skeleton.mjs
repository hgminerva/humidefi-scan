import { NgModule, Component, ChangeDetectionStrategy, ViewEncapsulation, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class Skeleton {
    constructor() {
        this.shape = "rectangle";
        this.animation = "wave";
        this.borderRadius = null;
        this.size = null;
        this.width = "100%";
        this.height = "1rem";
    }
    containerClass() {
        return {
            'p-skeleton p-component': true,
            'p-skeleton-circle': this.shape === 'circle',
            'p-skeleton-none': this.animation === 'none'
        };
    }
    containerStyle() {
        if (this.size)
            return { ...this.style, width: this.size, height: this.size, borderRadius: this.borderRadius };
        else
            return { ...this.style, width: this.width, height: this.height, borderRadius: this.borderRadius };
    }
}
Skeleton.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Skeleton, deps: [], target: i0.ɵɵFactoryTarget.Component });
Skeleton.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.7", type: Skeleton, selector: "p-skeleton", inputs: { styleClass: "styleClass", style: "style", shape: "shape", animation: "animation", borderRadius: "borderRadius", size: "size", width: "width", height: "height" }, host: { classAttribute: "p-element" }, ngImport: i0, template: `
        <div [ngClass]="containerClass()" [class]="styleClass" [ngStyle]="containerStyle()">
        </div>
    `, isInline: true, styles: [".p-skeleton{position:relative;overflow:hidden}.p-skeleton:after{content:\"\";animation:p-skeleton-animation 1.2s infinite;height:100%;left:0;position:absolute;right:0;top:0;transform:translate(-100%);z-index:1}.p-skeleton.p-skeleton-circle{border-radius:50%}.p-skeleton-none:after{animation:none}@keyframes p-skeleton-animation{0%{transform:translate(-100%)}to{transform:translate(100%)}}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Skeleton, decorators: [{
            type: Component,
            args: [{ selector: 'p-skeleton', template: `
        <div [ngClass]="containerClass()" [class]="styleClass" [ngStyle]="containerStyle()">
        </div>
    `, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        'class': 'p-element'
                    }, styles: [".p-skeleton{position:relative;overflow:hidden}.p-skeleton:after{content:\"\";animation:p-skeleton-animation 1.2s infinite;height:100%;left:0;position:absolute;right:0;top:0;transform:translate(-100%);z-index:1}.p-skeleton.p-skeleton-circle{border-radius:50%}.p-skeleton-none:after{animation:none}@keyframes p-skeleton-animation{0%{transform:translate(-100%)}to{transform:translate(100%)}}\n"] }]
        }], propDecorators: { styleClass: [{
                type: Input
            }], style: [{
                type: Input
            }], shape: [{
                type: Input
            }], animation: [{
                type: Input
            }], borderRadius: [{
                type: Input
            }], size: [{
                type: Input
            }], width: [{
                type: Input
            }], height: [{
                type: Input
            }] } });
export class SkeletonModule {
}
SkeletonModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: SkeletonModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
SkeletonModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.7", ngImport: i0, type: SkeletonModule, declarations: [Skeleton], imports: [CommonModule], exports: [Skeleton] });
SkeletonModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: SkeletonModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: SkeletonModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [Skeleton],
                    declarations: [Skeleton]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2tlbGV0b24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvc2tlbGV0b24vc2tlbGV0b24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsdUJBQXVCLEVBQUUsaUJBQWlCLEVBQUUsS0FBSyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3RHLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7O0FBZS9DLE1BQU0sT0FBTyxRQUFRO0lBYnJCO1FBbUJhLFVBQUssR0FBVyxXQUFXLENBQUM7UUFFNUIsY0FBUyxHQUFXLE1BQU0sQ0FBQztRQUUzQixpQkFBWSxHQUFXLElBQUksQ0FBQztRQUU1QixTQUFJLEdBQVcsSUFBSSxDQUFDO1FBRXBCLFVBQUssR0FBVyxNQUFNLENBQUM7UUFFdkIsV0FBTSxHQUFXLE1BQU0sQ0FBQztLQWdCcEM7SUFkRyxjQUFjO1FBQ1YsT0FBTztZQUNILHdCQUF3QixFQUFFLElBQUk7WUFDOUIsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLEtBQUssS0FBSyxRQUFRO1lBQzVDLGlCQUFpQixFQUFFLElBQUksQ0FBQyxTQUFTLEtBQUssTUFBTTtTQUMvQyxDQUFDO0lBQ04sQ0FBQztJQUVELGNBQWM7UUFDVixJQUFJLElBQUksQ0FBQyxJQUFJO1lBQ0wsT0FBTyxFQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBQyxDQUFDOztZQUU3RixPQUFPLEVBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLFlBQVksRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFDLENBQUM7SUFDNUcsQ0FBQzs7cUdBL0JRLFFBQVE7eUZBQVIsUUFBUSxxUUFYUDs7O0tBR1Q7MkZBUVEsUUFBUTtrQkFicEIsU0FBUzsrQkFDSSxZQUFZLFlBQ1o7OztLQUdULG1CQUNnQix1QkFBdUIsQ0FBQyxNQUFNLGlCQUNoQyxpQkFBaUIsQ0FBQyxJQUFJLFFBRS9CO3dCQUNGLE9BQU8sRUFBRSxXQUFXO3FCQUN2Qjs4QkFJUSxVQUFVO3NCQUFsQixLQUFLO2dCQUVHLEtBQUs7c0JBQWIsS0FBSztnQkFFRyxLQUFLO3NCQUFiLEtBQUs7Z0JBRUcsU0FBUztzQkFBakIsS0FBSztnQkFFRyxZQUFZO3NCQUFwQixLQUFLO2dCQUVHLElBQUk7c0JBQVosS0FBSztnQkFFRyxLQUFLO3NCQUFiLEtBQUs7Z0JBRUcsTUFBTTtzQkFBZCxLQUFLOztBQXVCVixNQUFNLE9BQU8sY0FBYzs7MkdBQWQsY0FBYzs0R0FBZCxjQUFjLGlCQXZDZCxRQUFRLGFBbUNQLFlBQVksYUFuQ2IsUUFBUTs0R0F1Q1IsY0FBYyxZQUpiLFlBQVk7MkZBSWIsY0FBYztrQkFMMUIsUUFBUTttQkFBQztvQkFDTixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7b0JBQ3ZCLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQztvQkFDbkIsWUFBWSxFQUFFLENBQUMsUUFBUSxDQUFDO2lCQUMzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlLCBDb21wb25lbnQsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBWaWV3RW5jYXBzdWxhdGlvbiwgSW5wdXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdwLXNrZWxldG9uJyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8ZGl2IFtuZ0NsYXNzXT1cImNvbnRhaW5lckNsYXNzKClcIiBbY2xhc3NdPVwic3R5bGVDbGFzc1wiIFtuZ1N0eWxlXT1cImNvbnRhaW5lclN0eWxlKClcIj5cbiAgICAgICAgPC9kaXY+XG4gICAgYCxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAgIHN0eWxlVXJsczogWycuL3NrZWxldG9uLmNzcyddLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgJ2NsYXNzJzogJ3AtZWxlbWVudCdcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIFNrZWxldG9uIHtcblxuICAgIEBJbnB1dCgpIHN0eWxlQ2xhc3M6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHN0eWxlOiBhbnk7XG5cbiAgICBASW5wdXQoKSBzaGFwZTogc3RyaW5nID0gXCJyZWN0YW5nbGVcIjtcblxuICAgIEBJbnB1dCgpIGFuaW1hdGlvbjogc3RyaW5nID0gXCJ3YXZlXCI7XG5cbiAgICBASW5wdXQoKSBib3JkZXJSYWRpdXM6IHN0cmluZyA9IG51bGw7XG5cbiAgICBASW5wdXQoKSBzaXplOiBzdHJpbmcgPSBudWxsO1xuXG4gICAgQElucHV0KCkgd2lkdGg6IHN0cmluZyA9IFwiMTAwJVwiO1xuXG4gICAgQElucHV0KCkgaGVpZ2h0OiBzdHJpbmcgPSBcIjFyZW1cIjtcblxuICAgIGNvbnRhaW5lckNsYXNzKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJ3Atc2tlbGV0b24gcC1jb21wb25lbnQnOiB0cnVlLFxuICAgICAgICAgICAgJ3Atc2tlbGV0b24tY2lyY2xlJzogdGhpcy5zaGFwZSA9PT0gJ2NpcmNsZScsXG4gICAgICAgICAgICAncC1za2VsZXRvbi1ub25lJzogdGhpcy5hbmltYXRpb24gPT09ICdub25lJ1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGNvbnRhaW5lclN0eWxlKCkge1xuICAgICAgICBpZiAodGhpcy5zaXplKVxuICAgICAgICAgICAgICAgIHJldHVybiB7Li4udGhpcy5zdHlsZSwgd2lkdGg6IHRoaXMuc2l6ZSwgaGVpZ2h0OiB0aGlzLnNpemUsIGJvcmRlclJhZGl1czogdGhpcy5ib3JkZXJSYWRpdXN9O1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHJldHVybiB7Li4udGhpcy5zdHlsZSwgd2lkdGg6IHRoaXMud2lkdGgsIGhlaWdodDogdGhpcy5oZWlnaHQsIGJvcmRlclJhZGl1czogdGhpcy5ib3JkZXJSYWRpdXN9O1xuICAgIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbU2tlbGV0b25dLFxuICAgIGRlY2xhcmF0aW9uczogW1NrZWxldG9uXVxufSlcbmV4cG9ydCBjbGFzcyBTa2VsZXRvbk1vZHVsZSB7IH1cbiJdfQ==