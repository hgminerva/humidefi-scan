import { NgModule, Component, Input, ChangeDetectionStrategy, ViewEncapsulation, ContentChildren, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule, PrimeTemplate } from 'primeng/api';
import { trigger, style, transition, animate, } from '@angular/animations';
import { DomHandler } from 'primeng/dom';
import { ZIndexUtils } from 'primeng/utils';
import * as i0 from "@angular/core";
import * as i1 from "primeng/api";
import * as i2 from "@angular/common";
export class Image {
    constructor(config, cd) {
        this.config = config;
        this.cd = cd;
        this.preview = false;
        this.showTransitionOptions = '150ms cubic-bezier(0, 0, 0.2, 1)';
        this.hideTransitionOptions = '150ms cubic-bezier(0, 0, 0.2, 1)';
        this.onShow = new EventEmitter();
        this.onHide = new EventEmitter();
        this.onImageError = new EventEmitter();
        this.maskVisible = false;
        this.previewVisible = false;
        this.rotate = 0;
        this.scale = 1;
        this.previewClick = false;
        this.zoomSettings = {
            default: 1,
            step: 0.1,
            max: 1.5,
            min: 0.5
        };
    }
    get isZoomOutDisabled() {
        return this.scale - this.zoomSettings.step <= this.zoomSettings.min;
    }
    get isZoomInDisabled() {
        return this.scale + this.zoomSettings.step >= this.zoomSettings.max;
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'indicator':
                    this.indicatorTemplate = item.template;
                    break;
                default:
                    this.indicatorTemplate = item.template;
                    break;
            }
        });
    }
    onImageClick() {
        if (this.preview) {
            this.maskVisible = true;
            this.previewVisible = true;
        }
    }
    onMaskClick() {
        if (!this.previewClick) {
            this.closePreview();
        }
        this.previewClick = false;
    }
    onPreviewImageClick() {
        this.previewClick = true;
    }
    rotateRight() {
        this.rotate += 90;
        this.previewClick = true;
    }
    rotateLeft() {
        this.rotate -= 90;
        this.previewClick = true;
    }
    zoomIn() {
        this.scale = this.scale + this.zoomSettings.step;
        this.previewClick = true;
    }
    zoomOut() {
        this.scale = this.scale - this.zoomSettings.step;
        this.previewClick = true;
    }
    onAnimationStart(event) {
        switch (event.toState) {
            case 'visible':
                this.container = event.element;
                this.wrapper = this.container.parentElement;
                this.appendContainer();
                this.moveOnTop();
                break;
            case 'void':
                DomHandler.addClass(this.wrapper, 'p-component-overlay-leave');
                break;
        }
    }
    onAnimationEnd(event) {
        switch (event.toState) {
            case 'void':
                ZIndexUtils.clear(this.wrapper);
                this.maskVisible = false;
                this.container = null;
                this.wrapper = null;
                this.cd.markForCheck();
                this.onHide.emit({});
                break;
            case 'visible':
                this.onShow.emit({});
                break;
        }
    }
    moveOnTop() {
        ZIndexUtils.set('modal', this.wrapper, this.config.zIndex.modal);
    }
    appendContainer() {
        if (this.appendTo) {
            if (this.appendTo === 'body')
                document.body.appendChild(this.wrapper);
            else
                DomHandler.appendChild(this.wrapper, this.appendTo);
        }
    }
    imagePreviewStyle() {
        return { transform: 'rotate(' + this.rotate + 'deg) scale(' + this.scale + ')' };
    }
    containerClass() {
        return {
            'p-image p-component': true,
            'p-image-preview-container': this.preview
        };
    }
    handleToolbarClick(event) {
        event.stopPropagation();
    }
    closePreview() {
        this.previewVisible = false;
        this.rotate = 0;
        this.scale = this.zoomSettings.default;
    }
    imageError(event) {
        this.onImageError.emit(event);
    }
}
Image.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Image, deps: [{ token: i1.PrimeNGConfig }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
Image.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.7", type: Image, selector: "p-image", inputs: { imageClass: "imageClass", imageStyle: "imageStyle", styleClass: "styleClass", style: "style", src: "src", alt: "alt", width: "width", height: "height", appendTo: "appendTo", preview: "preview", showTransitionOptions: "showTransitionOptions", hideTransitionOptions: "hideTransitionOptions" }, outputs: { onShow: "onShow", onHide: "onHide", onImageError: "onImageError" }, host: { classAttribute: "p-element" }, queries: [{ propertyName: "templates", predicate: PrimeTemplate }], viewQueries: [{ propertyName: "mask", first: true, predicate: ["mask"], descendants: true }], ngImport: i0, template: `
        <span [ngClass]="containerClass()" [class]="styleClass" [ngStyle]="style">
            <img [attr.src]="src" [attr.alt]="alt" [attr.width]="width" [attr.height]="height" [ngStyle]="imageStyle" [class]="imageClass" (error)="imageError($event)"/>
            <div class="p-image-preview-indicator" *ngIf="preview" (click)="onImageClick()">
                <ng-container *ngIf="indicatorTemplate;else defaultTemplate">
                    <ng-container *ngTemplateOutlet="indicatorTemplate"></ng-container>
                </ng-container>
                <ng-template #defaultTemplate>
                    <i class="p-image-preview-icon pi pi-eye"></i>
                </ng-template>
            </div>
            <div #mask class="p-image-mask p-component-overlay p-component-overlay-enter" *ngIf="maskVisible" (click)="onMaskClick()">
                <div class="p-image-toolbar" (click)="handleToolbarClick($event)">
                    <button class="p-image-action p-link" (click)="rotateRight()" type="button">
                        <i class="pi pi-refresh"></i>
                    </button>
                    <button class="p-image-action p-link" (click)="rotateLeft()" type="button">
                        <i class="pi pi-undo"></i>
                    </button>
                    <button class="p-image-action p-link" (click)="zoomOut()" type="button" [disabled]="isZoomOutDisabled">
                        <i class="pi pi-search-minus"></i>
                    </button>
                    <button class="p-image-action p-link" (click)="zoomIn()" type="button" [disabled]="isZoomInDisabled">
                        <i class="pi pi-search-plus"></i>
                    </button>
                    <button class="p-image-action p-link" type="button" (click)="closePreview()">
                        <i class="pi pi-times"></i>
                    </button>
                </div>
                <div *ngIf="previewVisible" [@animation]="{value: 'visible', params: {showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions}}"
                    (@animation.start)="onAnimationStart($event)" (@animation.done)="onAnimationEnd($event)">
                    <img [attr.src]="src" class="p-image-preview" [ngStyle]="imagePreviewStyle()" (click)="onPreviewImageClick()"/>
                </div>
            </div>
        </span>
    `, isInline: true, styles: [".p-image-mask{display:flex;align-items:center;justify-content:center}.p-image-preview-container{position:relative;display:inline-block}.p-image-preview-indicator{position:absolute;left:0;top:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .3s}.p-image-preview-icon{font-size:1.5rem}.p-image-preview-container:hover>.p-image-preview-indicator{opacity:1;cursor:pointer}.p-image-preview-container>img{cursor:pointer}.p-image-toolbar{position:absolute;top:0;right:0;display:flex;z-index:1}.p-image-action.p-link{display:flex;justify-content:center;align-items:center}.p-image-action.p-link[disabled]{opacity:.5}.p-image-preview{transition:transform .15s;max-width:100vw;max-height:100vh}\n"], dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i2.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], animations: [
        trigger('animation', [
            transition('void => visible', [
                style({ transform: 'scale(0.7)', opacity: 0 }),
                animate('{{showTransitionParams}}')
            ]),
            transition('visible => void', [
                animate('{{hideTransitionParams}}', style({ transform: 'scale(0.7)', opacity: 0 }))
            ])
        ])
    ], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Image, decorators: [{
            type: Component,
            args: [{ selector: 'p-image', template: `
        <span [ngClass]="containerClass()" [class]="styleClass" [ngStyle]="style">
            <img [attr.src]="src" [attr.alt]="alt" [attr.width]="width" [attr.height]="height" [ngStyle]="imageStyle" [class]="imageClass" (error)="imageError($event)"/>
            <div class="p-image-preview-indicator" *ngIf="preview" (click)="onImageClick()">
                <ng-container *ngIf="indicatorTemplate;else defaultTemplate">
                    <ng-container *ngTemplateOutlet="indicatorTemplate"></ng-container>
                </ng-container>
                <ng-template #defaultTemplate>
                    <i class="p-image-preview-icon pi pi-eye"></i>
                </ng-template>
            </div>
            <div #mask class="p-image-mask p-component-overlay p-component-overlay-enter" *ngIf="maskVisible" (click)="onMaskClick()">
                <div class="p-image-toolbar" (click)="handleToolbarClick($event)">
                    <button class="p-image-action p-link" (click)="rotateRight()" type="button">
                        <i class="pi pi-refresh"></i>
                    </button>
                    <button class="p-image-action p-link" (click)="rotateLeft()" type="button">
                        <i class="pi pi-undo"></i>
                    </button>
                    <button class="p-image-action p-link" (click)="zoomOut()" type="button" [disabled]="isZoomOutDisabled">
                        <i class="pi pi-search-minus"></i>
                    </button>
                    <button class="p-image-action p-link" (click)="zoomIn()" type="button" [disabled]="isZoomInDisabled">
                        <i class="pi pi-search-plus"></i>
                    </button>
                    <button class="p-image-action p-link" type="button" (click)="closePreview()">
                        <i class="pi pi-times"></i>
                    </button>
                </div>
                <div *ngIf="previewVisible" [@animation]="{value: 'visible', params: {showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions}}"
                    (@animation.start)="onAnimationStart($event)" (@animation.done)="onAnimationEnd($event)">
                    <img [attr.src]="src" class="p-image-preview" [ngStyle]="imagePreviewStyle()" (click)="onPreviewImageClick()"/>
                </div>
            </div>
        </span>
    `, animations: [
                        trigger('animation', [
                            transition('void => visible', [
                                style({ transform: 'scale(0.7)', opacity: 0 }),
                                animate('{{showTransitionParams}}')
                            ]),
                            transition('visible => void', [
                                animate('{{hideTransitionParams}}', style({ transform: 'scale(0.7)', opacity: 0 }))
                            ])
                        ])
                    ], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        'class': 'p-element'
                    }, styles: [".p-image-mask{display:flex;align-items:center;justify-content:center}.p-image-preview-container{position:relative;display:inline-block}.p-image-preview-indicator{position:absolute;left:0;top:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .3s}.p-image-preview-icon{font-size:1.5rem}.p-image-preview-container:hover>.p-image-preview-indicator{opacity:1;cursor:pointer}.p-image-preview-container>img{cursor:pointer}.p-image-toolbar{position:absolute;top:0;right:0;display:flex;z-index:1}.p-image-action.p-link{display:flex;justify-content:center;align-items:center}.p-image-action.p-link[disabled]{opacity:.5}.p-image-preview{transition:transform .15s;max-width:100vw;max-height:100vh}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.PrimeNGConfig }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { imageClass: [{
                type: Input
            }], imageStyle: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], style: [{
                type: Input
            }], src: [{
                type: Input
            }], alt: [{
                type: Input
            }], width: [{
                type: Input
            }], height: [{
                type: Input
            }], appendTo: [{
                type: Input
            }], preview: [{
                type: Input
            }], showTransitionOptions: [{
                type: Input
            }], hideTransitionOptions: [{
                type: Input
            }], onShow: [{
                type: Output
            }], onHide: [{
                type: Output
            }], onImageError: [{
                type: Output
            }], mask: [{
                type: ViewChild,
                args: ['mask']
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }] } });
export class ImageModule {
}
ImageModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ImageModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ImageModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.7", ngImport: i0, type: ImageModule, declarations: [Image], imports: [CommonModule], exports: [Image, SharedModule] });
ImageModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ImageModule, imports: [CommonModule, SharedModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ImageModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [Image, SharedModule],
                    declarations: [Image]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1hZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvaW1hZ2UvaW1hZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFjLHVCQUF1QixFQUFFLGlCQUFpQixFQUFpQyxlQUFlLEVBQWEsTUFBTSxFQUFFLFlBQVksRUFBcUIsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2xPLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsWUFBWSxFQUFFLGFBQWEsRUFBaUIsTUFBTSxhQUFhLENBQUM7QUFDekUsT0FBTyxFQUFDLE9BQU8sRUFBQyxLQUFLLEVBQUMsVUFBVSxFQUFDLE9BQU8sR0FBa0IsTUFBTSxxQkFBcUIsQ0FBQztBQUV0RixPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7QUEwRDVDLE1BQU0sT0FBTyxLQUFLO0lBbUVkLFlBQW9CLE1BQXFCLEVBQVUsRUFBcUI7UUFBcEQsV0FBTSxHQUFOLE1BQU0sQ0FBZTtRQUFVLE9BQUUsR0FBRixFQUFFLENBQW1CO1FBL0MvRCxZQUFPLEdBQVksS0FBSyxDQUFDO1FBRXpCLDBCQUFxQixHQUFXLGtDQUFrQyxDQUFDO1FBRW5FLDBCQUFxQixHQUFXLGtDQUFrQyxDQUFDO1FBRWxFLFdBQU0sR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUUvQyxXQUFNLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFFL0MsaUJBQVksR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQVEvRCxnQkFBVyxHQUFZLEtBQUssQ0FBQztRQUU3QixtQkFBYyxHQUFhLEtBQUssQ0FBQztRQUVqQyxXQUFNLEdBQVcsQ0FBQyxDQUFDO1FBRW5CLFVBQUss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cEIsV0FBVztrQkFMdkIsUUFBUTttQkFBQztvQkFDTixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7b0JBQ3ZCLE9BQU8sRUFBRSxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUM7b0JBQzlCLFlBQVksRUFBRSxDQUFDLEtBQUssQ0FBQztpQkFDeEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSwgQ29tcG9uZW50LCBJbnB1dCwgRWxlbWVudFJlZiwgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIFZpZXdFbmNhcHN1bGF0aW9uLCBUZW1wbGF0ZVJlZiwgQWZ0ZXJDb250ZW50SW5pdCwgQ29udGVudENoaWxkcmVuLCBRdWVyeUxpc3QsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBDaGFuZ2VEZXRlY3RvclJlZiwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgU2hhcmVkTW9kdWxlLCBQcmltZVRlbXBsYXRlLCBQcmltZU5HQ29uZmlnIH0gZnJvbSAncHJpbWVuZy9hcGknO1xuaW1wb3J0IHt0cmlnZ2VyLHN0eWxlLHRyYW5zaXRpb24sYW5pbWF0ZSwgQW5pbWF0aW9uRXZlbnQsfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7IFNhZmVVcmwgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcbmltcG9ydCB7IERvbUhhbmRsZXIgfSBmcm9tICdwcmltZW5nL2RvbSc7XG5pbXBvcnQgeyBaSW5kZXhVdGlscyB9IGZyb20gJ3ByaW1lbmcvdXRpbHMnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3AtaW1hZ2UnLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxzcGFuIFtuZ0NsYXNzXT1cImNvbnRhaW5lckNsYXNzKClcIiBbY2xhc3NdPVwic3R5bGVDbGFzc1wiIFtuZ1N0eWxlXT1cInN0eWxlXCI+XG4gICAgICAgICAgICA8aW1nIFthdHRyLnNyY109XCJzcmNcIiBbYXR0ci5hbHRdPVwiYWx0XCIgW2F0dHIud2lkdGhdPVwid2lkdGhcIiBbYXR0ci5oZWlnaHRdPVwiaGVpZ2h0XCIgW25nU3R5bGVdPVwiaW1hZ2VTdHlsZVwiIFtjbGFzc109XCJpbWFnZUNsYXNzXCIgKGVycm9yKT1cImltYWdlRXJyb3IoJGV2ZW50KVwiLz5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwLWltYWdlLXByZXZpZXctaW5kaWNhdG9yXCIgKm5nSWY9XCJwcmV2aWV3XCIgKGNsaWNrKT1cIm9uSW1hZ2VDbGljaygpXCI+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImluZGljYXRvclRlbXBsYXRlO2Vsc2UgZGVmYXVsdFRlbXBsYXRlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJpbmRpY2F0b3JUZW1wbGF0ZVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSAjZGVmYXVsdFRlbXBsYXRlPlxuICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cInAtaW1hZ2UtcHJldmlldy1pY29uIHBpIHBpLWV5ZVwiPjwvaT5cbiAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2ICNtYXNrIGNsYXNzPVwicC1pbWFnZS1tYXNrIHAtY29tcG9uZW50LW92ZXJsYXkgcC1jb21wb25lbnQtb3ZlcmxheS1lbnRlclwiICpuZ0lmPVwibWFza1Zpc2libGVcIiAoY2xpY2spPVwib25NYXNrQ2xpY2soKVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwLWltYWdlLXRvb2xiYXJcIiAoY2xpY2spPVwiaGFuZGxlVG9vbGJhckNsaWNrKCRldmVudClcIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInAtaW1hZ2UtYWN0aW9uIHAtbGlua1wiIChjbGljayk9XCJyb3RhdGVSaWdodCgpXCIgdHlwZT1cImJ1dHRvblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJwaSBwaS1yZWZyZXNoXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInAtaW1hZ2UtYWN0aW9uIHAtbGlua1wiIChjbGljayk9XCJyb3RhdGVMZWZ0KClcIiB0eXBlPVwiYnV0dG9uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cInBpIHBpLXVuZG9cIj48L2k+XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwicC1pbWFnZS1hY3Rpb24gcC1saW5rXCIgKGNsaWNrKT1cInpvb21PdXQoKVwiIHR5cGU9XCJidXR0b25cIiBbZGlzYWJsZWRdPVwiaXNab29tT3V0RGlzYWJsZWRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwicGkgcGktc2VhcmNoLW1pbnVzXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInAtaW1hZ2UtYWN0aW9uIHAtbGlua1wiIChjbGljayk9XCJ6b29tSW4oKVwiIHR5cGU9XCJidXR0b25cIiBbZGlzYWJsZWRdPVwiaXNab29tSW5EaXNhYmxlZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJwaSBwaS1zZWFyY2gtcGx1c1wiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJwLWltYWdlLWFjdGlvbiBwLWxpbmtcIiB0eXBlPVwiYnV0dG9uXCIgKGNsaWNrKT1cImNsb3NlUHJldmlldygpXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cInBpIHBpLXRpbWVzXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2ICpuZ0lmPVwicHJldmlld1Zpc2libGVcIiBbQGFuaW1hdGlvbl09XCJ7dmFsdWU6ICd2aXNpYmxlJywgcGFyYW1zOiB7c2hvd1RyYW5zaXRpb25QYXJhbXM6IHNob3dUcmFuc2l0aW9uT3B0aW9ucywgaGlkZVRyYW5zaXRpb25QYXJhbXM6IGhpZGVUcmFuc2l0aW9uT3B0aW9uc319XCJcbiAgICAgICAgICAgICAgICAgICAgKEBhbmltYXRpb24uc3RhcnQpPVwib25BbmltYXRpb25TdGFydCgkZXZlbnQpXCIgKEBhbmltYXRpb24uZG9uZSk9XCJvbkFuaW1hdGlvbkVuZCgkZXZlbnQpXCI+XG4gICAgICAgICAgICAgICAgICAgIDxpbWcgW2F0dHIuc3JjXT1cInNyY1wiIGNsYXNzPVwicC1pbWFnZS1wcmV2aWV3XCIgW25nU3R5bGVdPVwiaW1hZ2VQcmV2aWV3U3R5bGUoKVwiIChjbGljayk9XCJvblByZXZpZXdJbWFnZUNsaWNrKClcIi8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9zcGFuPlxuICAgIGAsXG4gICAgYW5pbWF0aW9uczogW1xuICAgICAgICB0cmlnZ2VyKCdhbmltYXRpb24nLCBbXG4gICAgICAgICAgICB0cmFuc2l0aW9uKCd2b2lkID0+IHZpc2libGUnLCBbXG4gICAgICAgICAgICAgICAgc3R5bGUoeyB0cmFuc2Zvcm06ICdzY2FsZSgwLjcpJywgb3BhY2l0eTogMCB9KSxcbiAgICAgICAgICAgICAgICBhbmltYXRlKCd7e3Nob3dUcmFuc2l0aW9uUGFyYW1zfX0nKVxuICAgICAgICAgICAgXSksXG4gICAgICAgICAgICB0cmFuc2l0aW9uKCd2aXNpYmxlID0+IHZvaWQnLCBbXG4gICAgICAgICAgICAgICAgYW5pbWF0ZSgne3toaWRlVHJhbnNpdGlvblBhcmFtc319Jywgc3R5bGUoeyB0cmFuc2Zvcm06ICdzY2FsZSgwLjcpJywgb3BhY2l0eTogMCB9KSlcbiAgICAgICAgICAgIF0pXG4gICAgICAgIF0pXG4gICAgXSxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAgIHN0eWxlVXJsczogWycuL2ltYWdlLmNzcyddLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgJ2NsYXNzJzogJ3AtZWxlbWVudCdcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIEltYWdlIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCB7XG5cbiAgICBASW5wdXQoKSBpbWFnZUNsYXNzOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBpbWFnZVN0eWxlOiBhbnk7XG5cbiAgICBASW5wdXQoKSBzdHlsZUNsYXNzOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBzdHlsZTogYW55O1xuXG4gICAgQElucHV0KCkgc3JjOiBzdHJpbmcgfCBTYWZlVXJsO1xuXG4gICAgQElucHV0KCkgYWx0OiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSB3aWR0aDogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgaGVpZ2h0OiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBhcHBlbmRUbzogYW55O1xuXG4gICAgQElucHV0KCkgcHJldmlldzogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgQElucHV0KCkgc2hvd1RyYW5zaXRpb25PcHRpb25zOiBzdHJpbmcgPSAnMTUwbXMgY3ViaWMtYmV6aWVyKDAsIDAsIDAuMiwgMSknO1xuXG4gICAgQElucHV0KCkgaGlkZVRyYW5zaXRpb25PcHRpb25zOiBzdHJpbmcgPSAnMTUwbXMgY3ViaWMtYmV6aWVyKDAsIDAsIDAuMiwgMSknO1xuXG4gICAgQE91dHB1dCgpIG9uU2hvdzogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25IaWRlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvbkltYWdlRXJyb3I6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgIFxuICAgIEBWaWV3Q2hpbGQoJ21hc2snKSBtYXNrOiBFbGVtZW50UmVmO1xuXG4gICAgQENvbnRlbnRDaGlsZHJlbihQcmltZVRlbXBsYXRlKSB0ZW1wbGF0ZXM6IFF1ZXJ5TGlzdDxhbnk+O1xuXG4gICAgaW5kaWNhdG9yVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBtYXNrVmlzaWJsZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgcHJldmlld1Zpc2libGU6IGJvb2xlYW4gPSAgZmFsc2U7XG5cbiAgICByb3RhdGU6IG51bWJlciA9IDA7XG5cbiAgICBzY2FsZTogbnVtYmVyID0gMTtcblxuICAgIHByZXZpZXdDbGljazogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgY29udGFpbmVyOiBIVE1MRWxlbWVudDtcblxuICAgIHdyYXBwZXI6IEhUTUxFbGVtZW50O1xuXG4gICAgcHVibGljIGdldCBpc1pvb21PdXREaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2NhbGUgLSB0aGlzLnpvb21TZXR0aW5ncy5zdGVwIDw9IHRoaXMuem9vbVNldHRpbmdzLm1pbjtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IGlzWm9vbUluRGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnNjYWxlICsgdGhpcy56b29tU2V0dGluZ3Muc3RlcCA+PSB0aGlzLnpvb21TZXR0aW5ncy5tYXg7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB6b29tU2V0dGluZ3MgPSB7XG4gICAgICAgIGRlZmF1bHQ6IDEsXG4gICAgICAgIHN0ZXA6IDAuMSxcbiAgICAgICAgbWF4OiAxLjUsXG4gICAgICAgIG1pbjogMC41XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBjb25maWc6IFByaW1lTkdDb25maWcsIHByaXZhdGUgY2Q6IENoYW5nZURldGVjdG9yUmVmKSB7IH1cblxuICAgIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgc3dpdGNoKGl0ZW0uZ2V0VHlwZSgpKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnaW5kaWNhdG9yJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmRpY2F0b3JUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmluZGljYXRvclRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgb25JbWFnZUNsaWNrKCkge1xuICAgICAgICBpZiAodGhpcy5wcmV2aWV3KSB7XG4gICAgICAgICAgICB0aGlzLm1hc2tWaXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMucHJldmlld1Zpc2libGUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25NYXNrQ2xpY2soKSB7XG4gICAgICAgIGlmICghdGhpcy5wcmV2aWV3Q2xpY2spIHtcbiAgICAgICAgICAgIHRoaXMuY2xvc2VQcmV2aWV3KCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnByZXZpZXdDbGljayA9IGZhbHNlO1xuICAgIH1cblxuICAgIG9uUHJldmlld0ltYWdlQ2xpY2soKSB7XG4gICAgICAgIHRoaXMucHJldmlld0NsaWNrID0gdHJ1ZTtcbiAgICB9XG5cbiAgICByb3RhdGVSaWdodCgpIHtcbiAgICAgICAgdGhpcy5yb3RhdGUgKz0gOTA7XG4gICAgICAgIHRoaXMucHJldmlld0NsaWNrID0gdHJ1ZTtcbiAgICB9XG5cbiAgICByb3RhdGVMZWZ0KCkge1xuICAgICAgICB0aGlzLnJvdGF0ZSAtPSA5MDtcbiAgICAgICAgdGhpcy5wcmV2aWV3Q2xpY2sgPSB0cnVlO1xuICAgIH1cblxuICAgIHpvb21JbigpIHtcbiAgICAgICAgdGhpcy5zY2FsZSA9IHRoaXMuc2NhbGUgKyB0aGlzLnpvb21TZXR0aW5ncy5zdGVwO1xuICAgICAgICB0aGlzLnByZXZpZXdDbGljayA9IHRydWU7XG4gICAgfVxuXG4gICAgem9vbU91dCgpIHtcbiAgICAgICAgdGhpcy5zY2FsZSA9IHRoaXMuc2NhbGUgLSB0aGlzLnpvb21TZXR0aW5ncy5zdGVwO1xuICAgICAgICB0aGlzLnByZXZpZXdDbGljayA9IHRydWU7XG4gICAgfVxuXG4gICAgb25BbmltYXRpb25TdGFydChldmVudDogQW5pbWF0aW9uRXZlbnQpIHtcbiAgICAgICAgc3dpdGNoKGV2ZW50LnRvU3RhdGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3Zpc2libGUnOlxuICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyID0gZXZlbnQuZWxlbWVudDtcbiAgICAgICAgICAgICAgICB0aGlzLndyYXBwZXIgPSB0aGlzLmNvbnRhaW5lci5wYXJlbnRFbGVtZW50O1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwZW5kQ29udGFpbmVyKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZlT25Ub3AoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICd2b2lkJzpcbiAgICAgICAgICAgICAgICBEb21IYW5kbGVyLmFkZENsYXNzKHRoaXMud3JhcHBlciwgJ3AtY29tcG9uZW50LW92ZXJsYXktbGVhdmUnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25BbmltYXRpb25FbmQoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KSB7XG4gICAgICAgIHN3aXRjaChldmVudC50b1N0YXRlKSB7XG4gICAgICAgICAgICBjYXNlICd2b2lkJzpcbiAgICAgICAgICAgICAgICBaSW5kZXhVdGlscy5jbGVhcih0aGlzLndyYXBwZXIpO1xuICAgICAgICAgICAgICAgIHRoaXMubWFza1Zpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lciA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy53cmFwcGVyID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgICAgICAgICAgICAgIHRoaXMub25IaWRlLmVtaXQoe30pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICd2aXNpYmxlJzpcbiAgICAgICAgICAgICAgICB0aGlzLm9uU2hvdy5lbWl0KHt9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbW92ZU9uVG9wKCkge1xuICAgICAgICBaSW5kZXhVdGlscy5zZXQoJ21vZGFsJywgdGhpcy53cmFwcGVyLCB0aGlzLmNvbmZpZy56SW5kZXgubW9kYWwpO1xuICAgIH1cblxuICAgIGFwcGVuZENvbnRhaW5lcigpIHtcbiAgICAgICAgaWYgKHRoaXMuYXBwZW5kVG8pIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmFwcGVuZFRvID09PSAnYm9keScpXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLndyYXBwZXIpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIERvbUhhbmRsZXIuYXBwZW5kQ2hpbGQodGhpcy53cmFwcGVyLCB0aGlzLmFwcGVuZFRvKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGltYWdlUHJldmlld1N0eWxlKCkge1xuICAgICAgICByZXR1cm4ge3RyYW5zZm9ybTogJ3JvdGF0ZSgnICsgdGhpcy5yb3RhdGUgKyAnZGVnKSBzY2FsZSgnICsgdGhpcy5zY2FsZSArICcpJ307XG4gICAgfVxuXG4gICAgY29udGFpbmVyQ2xhc3MoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAncC1pbWFnZSBwLWNvbXBvbmVudCc6IHRydWUsXG4gICAgICAgICAgICAncC1pbWFnZS1wcmV2aWV3LWNvbnRhaW5lcic6IHRoaXMucHJldmlld1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGhhbmRsZVRvb2xiYXJDbGljayhldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG5cbiAgICBjbG9zZVByZXZpZXcoKTogdm9pZCB7XG4gICAgICAgIHRoaXMucHJldmlld1Zpc2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5yb3RhdGUgPSAwO1xuICAgICAgICB0aGlzLnNjYWxlID0gdGhpcy56b29tU2V0dGluZ3MuZGVmYXVsdDtcbiAgICB9XG5cbiAgICBpbWFnZUVycm9yKGV2ZW50KSB7XG4gICAgICAgIHRoaXMub25JbWFnZUVycm9yLmVtaXQoZXZlbnQpO1xuICAgIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbSW1hZ2UsIFNoYXJlZE1vZHVsZV0sXG4gICAgZGVjbGFyYXRpb25zOiBbSW1hZ2VdXG59KVxuZXhwb3J0IGNsYXNzIEltYWdlTW9kdWxlIHsgfVxuIl19