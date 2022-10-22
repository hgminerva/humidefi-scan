import { NgModule, Component, ChangeDetectionStrategy, ViewEncapsulation, Input, ContentChildren, ViewChild, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomHandler } from 'primeng/dom';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class Splitter {
    constructor(cd, el) {
        this.cd = cd;
        this.el = el;
        this.stateStorage = "session";
        this.stateKey = null;
        this.layout = "horizontal";
        this.gutterSize = 4;
        this.minSizes = [];
        this.onResizeEnd = new EventEmitter();
        this.onResizeStart = new EventEmitter();
        this.nested = false;
        this.panels = [];
        this.dragging = false;
        this.mouseMoveListener = null;
        this.mouseUpListener = null;
        this.touchMoveListener = null;
        this.touchEndListener = null;
        this.size = null;
        this.gutterElement = null;
        this.startPos = null;
        this.prevPanelElement = null;
        this.nextPanelElement = null;
        this.nextPanelSize = null;
        this.prevPanelSize = null;
        this._panelSizes = [];
        this.prevPanelIndex = null;
    }
    get panelSizes() {
        return this._panelSizes;
    }
    set panelSizes(val) {
        this._panelSizes = val;
        if (this.el && this.el.nativeElement && this.panels.length > 0) {
            let children = [...this.el.nativeElement.children[0].children].filter(child => DomHandler.hasClass(child, 'p-splitter-panel'));
            let _panelSizes = [];
            this.panels.map((panel, i) => {
                let panelInitialSize = this.panelSizes.length - 1 >= i ? this.panelSizes[i] : null;
                let panelSize = panelInitialSize || (100 / this.panels.length);
                _panelSizes[i] = panelSize;
                children[i].style.flexBasis = 'calc(' + panelSize + '% - ' + ((this.panels.length - 1) * this.gutterSize) + 'px)';
            });
        }
    }
    ngOnInit() {
        this.nested = this.isNested();
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'panel':
                    this.panels.push(item.template);
                    break;
                default:
                    this.panels.push(item.template);
                    break;
            }
        });
    }
    ngAfterViewInit() {
        if (this.panels && this.panels.length) {
            let initialized = false;
            if (this.isStateful()) {
                initialized = this.restoreState();
            }
            if (!initialized) {
                let children = [...this.el.nativeElement.children[0].children].filter(child => DomHandler.hasClass(child, 'p-splitter-panel'));
                let _panelSizes = [];
                this.panels.map((panel, i) => {
                    let panelInitialSize = this.panelSizes.length - 1 >= i ? this.panelSizes[i] : null;
                    let panelSize = panelInitialSize || (100 / this.panels.length);
                    _panelSizes[i] = panelSize;
                    children[i].style.flexBasis = 'calc(' + panelSize + '% - ' + ((this.panels.length - 1) * this.gutterSize) + 'px)';
                });
                this._panelSizes = _panelSizes;
            }
        }
    }
    resizeStart(event, index) {
        this.gutterElement = event.currentTarget;
        this.size = this.horizontal() ? DomHandler.getWidth(this.containerViewChild.nativeElement) : DomHandler.getHeight(this.containerViewChild.nativeElement);
        this.dragging = true;
        this.startPos = this.horizontal() ? (event.pageX || event.changedTouches[0].pageX) : (event.pageY || event.changedTouches[0].pageY);
        this.prevPanelElement = this.gutterElement.previousElementSibling;
        this.nextPanelElement = this.gutterElement.nextElementSibling;
        this.prevPanelSize = 100 * (this.horizontal() ? DomHandler.getOuterWidth(this.prevPanelElement, true) : DomHandler.getOuterHeight(this.prevPanelElement, true)) / this.size;
        this.nextPanelSize = 100 * (this.horizontal() ? DomHandler.getOuterWidth(this.nextPanelElement, true) : DomHandler.getOuterHeight(this.nextPanelElement, true)) / this.size;
        this.prevPanelIndex = index;
        DomHandler.addClass(this.gutterElement, 'p-splitter-gutter-resizing');
        DomHandler.addClass(this.containerViewChild.nativeElement, 'p-splitter-resizing');
        this.onResizeStart.emit({ originalEvent: event, sizes: this._panelSizes });
    }
    onResize(event) {
        let newPos;
        if (this.horizontal())
            newPos = (event.pageX * 100 / this.size) - (this.startPos * 100 / this.size);
        else
            newPos = (event.pageY * 100 / this.size) - (this.startPos * 100 / this.size);
        let newPrevPanelSize = this.prevPanelSize + newPos;
        let newNextPanelSize = this.nextPanelSize - newPos;
        if (this.validateResize(newPrevPanelSize, newNextPanelSize)) {
            this.prevPanelElement.style.flexBasis = 'calc(' + newPrevPanelSize + '% - ' + ((this.panels.length - 1) * this.gutterSize) + 'px)';
            this.nextPanelElement.style.flexBasis = 'calc(' + newNextPanelSize + '% - ' + ((this.panels.length - 1) * this.gutterSize) + 'px)';
            this._panelSizes[this.prevPanelIndex] = newPrevPanelSize;
            this._panelSizes[this.prevPanelIndex + 1] = newNextPanelSize;
        }
    }
    resizeEnd(event) {
        if (this.isStateful()) {
            this.saveState();
        }
        this.onResizeEnd.emit({ originalEvent: event, sizes: this._panelSizes });
        DomHandler.removeClass(this.gutterElement, 'p-splitter-gutter-resizing');
        DomHandler.removeClass(this.containerViewChild.nativeElement, 'p-splitter-resizing');
        this.clear();
    }
    onGutterMouseDown(event, index) {
        this.resizeStart(event, index);
        this.bindMouseListeners();
    }
    onGutterTouchStart(event, index) {
        if (event.cancelable) {
            this.resizeStart(event, index);
            this.bindTouchListeners();
            event.preventDefault();
        }
    }
    onGutterTouchEnd(event) {
        this.resizeEnd(event);
        this.unbindTouchListeners();
        if (event.cancelable)
            event.preventDefault();
    }
    validateResize(newPrevPanelSize, newNextPanelSize) {
        if (this.minSizes.length >= 1 && this.minSizes[0] && this.minSizes[0] > newPrevPanelSize) {
            return false;
        }
        if (this.minSizes.length > 1 && this.minSizes[1] && this.minSizes[1] > newNextPanelSize) {
            return false;
        }
        return true;
    }
    bindMouseListeners() {
        if (!this.mouseMoveListener) {
            this.mouseMoveListener = event => this.onResize(event);
            document.addEventListener('mousemove', this.mouseMoveListener);
        }
        if (!this.mouseUpListener) {
            this.mouseUpListener = event => {
                this.resizeEnd(event);
                this.unbindMouseListeners();
            };
            document.addEventListener('mouseup', this.mouseUpListener);
        }
    }
    bindTouchListeners() {
        if (!this.touchMoveListener) {
            this.touchMoveListener = event => this.onResize(event.changedTouches[0]);
            document.addEventListener('touchmove', this.touchMoveListener);
        }
        if (!this.touchEndListener) {
            this.touchEndListener = event => {
                this.resizeEnd(event);
                this.unbindTouchListeners();
            };
            document.addEventListener('touchend', this.touchEndListener);
        }
    }
    unbindMouseListeners() {
        if (this.mouseMoveListener) {
            document.removeEventListener('mousemove', this.mouseMoveListener);
            this.mouseMoveListener = null;
        }
        if (this.mouseUpListener) {
            document.removeEventListener('mouseup', this.mouseUpListener);
            this.mouseUpListener = null;
        }
    }
    unbindTouchListeners() {
        if (this.touchMoveListener) {
            document.removeEventListener('touchmove', this.touchMoveListener);
            this.touchMoveListener = null;
        }
        if (this.touchEndListener) {
            document.removeEventListener('touchend', this.touchEndListener);
            this.touchEndListener = null;
        }
    }
    clear() {
        this.dragging = false;
        this.size = null;
        this.startPos = null;
        this.prevPanelElement = null;
        this.nextPanelElement = null;
        this.prevPanelSize = null;
        this.nextPanelSize = null;
        this.gutterElement = null;
        this.prevPanelIndex = null;
    }
    isNested() {
        if (this.el.nativeElement) {
            let parent = this.el.nativeElement.parentElement;
            while (parent && !DomHandler.hasClass(parent, 'p-splitter')) {
                parent = parent.parentElement;
            }
            return parent !== null;
        }
        else {
            return false;
        }
    }
    isStateful() {
        return this.stateKey != null;
    }
    getStorage() {
        switch (this.stateStorage) {
            case 'local':
                return window.localStorage;
            case 'session':
                return window.sessionStorage;
            default:
                throw new Error(this.stateStorage + ' is not a valid value for the state storage, supported values are "local" and "session".');
        }
    }
    saveState() {
        this.getStorage().setItem(this.stateKey, JSON.stringify(this._panelSizes));
    }
    restoreState() {
        const storage = this.getStorage();
        const stateString = storage.getItem(this.stateKey);
        if (stateString) {
            this._panelSizes = JSON.parse(stateString);
            let children = [...this.containerViewChild.nativeElement.children].filter(child => DomHandler.hasClass(child, 'p-splitter-panel'));
            children.forEach((child, i) => {
                child.style.flexBasis = 'calc(' + this._panelSizes[i] + '% - ' + ((this.panels.length - 1) * this.gutterSize) + 'px)';
            });
            return true;
        }
        return false;
    }
    containerClass() {
        return {
            'p-splitter p-component': true,
            'p-splitter-horizontal': this.layout === "horizontal",
            'p-splitter-vertical': this.layout === "vertical"
        };
    }
    panelContainerClass() {
        return {
            'p-splitter-panel': true,
            'p-splitter-panel-nested': true
        };
    }
    gutterStyle() {
        if (this.horizontal())
            return { width: this.gutterSize + 'px' };
        else
            return { height: this.gutterSize + 'px' };
    }
    horizontal() {
        return this.layout === 'horizontal';
    }
}
Splitter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Splitter, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
Splitter.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.7", type: Splitter, selector: "p-splitter", inputs: { styleClass: "styleClass", panelStyleClass: "panelStyleClass", style: "style", panelStyle: "panelStyle", stateStorage: "stateStorage", stateKey: "stateKey", layout: "layout", gutterSize: "gutterSize", minSizes: "minSizes", panelSizes: "panelSizes" }, outputs: { onResizeEnd: "onResizeEnd", onResizeStart: "onResizeStart" }, host: { properties: { "class.p-splitter-panel-nested": "nested" }, classAttribute: "p-element" }, queries: [{ propertyName: "templates", predicate: PrimeTemplate }], viewQueries: [{ propertyName: "containerViewChild", first: true, predicate: ["container"], descendants: true }], ngImport: i0, template: `
        <div #container [ngClass]="containerClass()" [class]="styleClass" [ngStyle]="style">
            <ng-template ngFor let-panel let-i="index" [ngForOf]="panels">
                <div [ngClass]="panelContainerClass()" [class]="panelStyleClass" [ngStyle]="panelStyle">
                    <ng-container *ngTemplateOutlet="panel"></ng-container>
                </div>
                <div class="p-splitter-gutter" *ngIf="i !== (panels.length - 1)" [ngStyle]="gutterStyle()"
                    (mousedown)="onGutterMouseDown($event, i)" (touchstart)="onGutterTouchStart($event, i)">
                    <div class="p-splitter-gutter-handle"></div>
                </div>
            </ng-template>
        </div>
    `, isInline: true, styles: [".p-splitter{display:flex;flex-wrap:nowrap}.p-splitter-vertical{flex-direction:column}.p-splitter-panel{flex-grow:1}.p-splitter-panel-nested{display:flex}.p-splitter-panel p-splitter{flex-grow:1}.p-splitter-panel .p-splitter{flex-grow:1;border:0 none}.p-splitter-gutter{flex-grow:0;flex-shrink:0;display:flex;align-items:center;justify-content:center;cursor:col-resize}.p-splitter-horizontal.p-splitter-resizing{cursor:col-resize;-webkit-user-select:none;user-select:none}.p-splitter-horizontal>.p-splitter-gutter>.p-splitter-gutter-handle{height:24px;width:100%}.p-splitter-horizontal>.p-splitter-gutter{cursor:col-resize}.p-splitter-vertical.p-splitter-resizing{cursor:row-resize;-webkit-user-select:none;user-select:none}.p-splitter-vertical>.p-splitter-gutter{cursor:row-resize}.p-splitter-vertical>.p-splitter-gutter>.p-splitter-gutter-handle{width:24px;height:100%}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Splitter, decorators: [{
            type: Component,
            args: [{ selector: 'p-splitter', template: `
        <div #container [ngClass]="containerClass()" [class]="styleClass" [ngStyle]="style">
            <ng-template ngFor let-panel let-i="index" [ngForOf]="panels">
                <div [ngClass]="panelContainerClass()" [class]="panelStyleClass" [ngStyle]="panelStyle">
                    <ng-container *ngTemplateOutlet="panel"></ng-container>
                </div>
                <div class="p-splitter-gutter" *ngIf="i !== (panels.length - 1)" [ngStyle]="gutterStyle()"
                    (mousedown)="onGutterMouseDown($event, i)" (touchstart)="onGutterTouchStart($event, i)">
                    <div class="p-splitter-gutter-handle"></div>
                </div>
            </ng-template>
        </div>
    `, encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, host: {
                        'class': 'p-element',
                        '[class.p-splitter-panel-nested]': 'nested'
                    }, styles: [".p-splitter{display:flex;flex-wrap:nowrap}.p-splitter-vertical{flex-direction:column}.p-splitter-panel{flex-grow:1}.p-splitter-panel-nested{display:flex}.p-splitter-panel p-splitter{flex-grow:1}.p-splitter-panel .p-splitter{flex-grow:1;border:0 none}.p-splitter-gutter{flex-grow:0;flex-shrink:0;display:flex;align-items:center;justify-content:center;cursor:col-resize}.p-splitter-horizontal.p-splitter-resizing{cursor:col-resize;-webkit-user-select:none;user-select:none}.p-splitter-horizontal>.p-splitter-gutter>.p-splitter-gutter-handle{height:24px;width:100%}.p-splitter-horizontal>.p-splitter-gutter{cursor:col-resize}.p-splitter-vertical.p-splitter-resizing{cursor:row-resize;-webkit-user-select:none;user-select:none}.p-splitter-vertical>.p-splitter-gutter{cursor:row-resize}.p-splitter-vertical>.p-splitter-gutter>.p-splitter-gutter-handle{width:24px;height:100%}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i0.ElementRef }]; }, propDecorators: { styleClass: [{
                type: Input
            }], panelStyleClass: [{
                type: Input
            }], style: [{
                type: Input
            }], panelStyle: [{
                type: Input
            }], stateStorage: [{
                type: Input
            }], stateKey: [{
                type: Input
            }], layout: [{
                type: Input
            }], gutterSize: [{
                type: Input
            }], minSizes: [{
                type: Input
            }], onResizeEnd: [{
                type: Output
            }], onResizeStart: [{
                type: Output
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }], containerViewChild: [{
                type: ViewChild,
                args: ['container', { static: false }]
            }], panelSizes: [{
                type: Input
            }] } });
export class SplitterModule {
}
SplitterModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: SplitterModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
SplitterModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.7", ngImport: i0, type: SplitterModule, declarations: [Splitter], imports: [CommonModule], exports: [Splitter, SharedModule] });
SplitterModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: SplitterModule, imports: [CommonModule, SharedModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: SplitterModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [Splitter, SharedModule],
                    declarations: [Splitter]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BsaXR0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvc3BsaXR0ZXIvc3BsaXR0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsdUJBQXVCLEVBQUUsaUJBQWlCLEVBQUUsS0FBSyxFQUFFLGVBQWUsRUFBeUQsU0FBUyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDaE4sT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDekMsT0FBTyxFQUFFLGFBQWEsRUFBRSxZQUFZLEVBQUUsTUFBTSxhQUFhLENBQUM7OztBQXlCMUQsTUFBTSxPQUFPLFFBQVE7SUFnRmpCLFlBQW1CLEVBQXFCLEVBQVUsRUFBYztRQUE3QyxPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQUFVLE9BQUUsR0FBRixFQUFFLENBQVk7UUF0RXZELGlCQUFZLEdBQVcsU0FBUyxDQUFDO1FBRWpDLGFBQVEsR0FBVyxJQUFJLENBQUM7UUFFeEIsV0FBTSxHQUFXLFlBQVksQ0FBQztRQUU5QixlQUFVLEdBQVcsQ0FBQyxDQUFDO1FBRXZCLGFBQVEsR0FBYSxFQUFFLENBQUM7UUFFdkIsZ0JBQVcsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUVwRCxrQkFBYSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBMEJoRSxXQUFNLEdBQUcsS0FBSyxDQUFDO1FBRWYsV0FBTSxHQUFHLEVBQUUsQ0FBQztRQUVaLGFBQVEsR0FBRyxLQUFLLENBQUM7UUFFakIsc0JBQWlCLEdBQUcsSUFBSSxDQUFDO1FBRXpCLG9CQUFlLEdBQUcsSUFBSSxDQUFDO1FBRXZCLHNCQUFpQixHQUFHLElBQUksQ0FBQztRQUV6QixxQkFBZ0IsR0FBRyxJQUFJLENBQUM7UUFF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QUFZLEVBQUUsQ0FBQyxRQUFRLENBQUM7aUJBQzNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUsIENvbXBvbmVudCwgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIFZpZXdFbmNhcHN1bGF0aW9uLCBJbnB1dCwgQ29udGVudENoaWxkcmVuLCBRdWVyeUxpc3QsIEVsZW1lbnRSZWYsIENoYW5nZURldGVjdG9yUmVmLCBUZW1wbGF0ZVJlZiwgVmlld0NoaWxkLCBPdXRwdXQsIEV2ZW50RW1pdHRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IERvbUhhbmRsZXIgfSBmcm9tICdwcmltZW5nL2RvbSc7XG5pbXBvcnQgeyBQcmltZVRlbXBsYXRlLCBTaGFyZWRNb2R1bGUgfSBmcm9tICdwcmltZW5nL2FwaSc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC1zcGxpdHRlcicsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGRpdiAjY29udGFpbmVyIFtuZ0NsYXNzXT1cImNvbnRhaW5lckNsYXNzKClcIiBbY2xhc3NdPVwic3R5bGVDbGFzc1wiIFtuZ1N0eWxlXT1cInN0eWxlXCI+XG4gICAgICAgICAgICA8bmctdGVtcGxhdGUgbmdGb3IgbGV0LXBhbmVsIGxldC1pPVwiaW5kZXhcIiBbbmdGb3JPZl09XCJwYW5lbHNcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IFtuZ0NsYXNzXT1cInBhbmVsQ29udGFpbmVyQ2xhc3MoKVwiIFtjbGFzc109XCJwYW5lbFN0eWxlQ2xhc3NcIiBbbmdTdHlsZV09XCJwYW5lbFN0eWxlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJwYW5lbFwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwLXNwbGl0dGVyLWd1dHRlclwiICpuZ0lmPVwiaSAhPT0gKHBhbmVscy5sZW5ndGggLSAxKVwiIFtuZ1N0eWxlXT1cImd1dHRlclN0eWxlKClcIlxuICAgICAgICAgICAgICAgICAgICAobW91c2Vkb3duKT1cIm9uR3V0dGVyTW91c2VEb3duKCRldmVudCwgaSlcIiAodG91Y2hzdGFydCk9XCJvbkd1dHRlclRvdWNoU3RhcnQoJGV2ZW50LCBpKVwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC1zcGxpdHRlci1ndXR0ZXItaGFuZGxlXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICA8L2Rpdj5cbiAgICBgLFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gICAgc3R5bGVVcmxzOiBbJy4vc3BsaXR0ZXIuY3NzJ10sXG4gICAgaG9zdDoge1xuICAgICAgICAnY2xhc3MnOiAncC1lbGVtZW50JyxcbiAgICAgICAgJ1tjbGFzcy5wLXNwbGl0dGVyLXBhbmVsLW5lc3RlZF0nOiAnbmVzdGVkJ1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgU3BsaXR0ZXIge1xuXG4gICAgQElucHV0KCkgc3R5bGVDbGFzczogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgcGFuZWxTdHlsZUNsYXNzOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBzdHlsZTogYW55O1xuXG4gICAgQElucHV0KCkgcGFuZWxTdHlsZTogYW55O1xuXG4gICAgQElucHV0KCkgc3RhdGVTdG9yYWdlOiBzdHJpbmcgPSBcInNlc3Npb25cIjtcblxuICAgIEBJbnB1dCgpIHN0YXRlS2V5OiBzdHJpbmcgPSBudWxsO1xuXG4gICAgQElucHV0KCkgbGF5b3V0OiBzdHJpbmcgPSBcImhvcml6b250YWxcIjtcblxuICAgIEBJbnB1dCgpIGd1dHRlclNpemU6IG51bWJlciA9IDQ7XG5cbiAgICBASW5wdXQoKSBtaW5TaXplczogbnVtYmVyW10gPSBbXTtcblxuICAgIEBPdXRwdXQoKSBvblJlc2l6ZUVuZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25SZXNpemVTdGFydDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAQ29udGVudENoaWxkcmVuKFByaW1lVGVtcGxhdGUpIHRlbXBsYXRlczogUXVlcnlMaXN0PGFueT47XG5cbiAgICBAVmlld0NoaWxkKCdjb250YWluZXInLCB7IHN0YXRpYzogZmFsc2UgfSkgY29udGFpbmVyVmlld0NoaWxkOiBFbGVtZW50UmVmO1xuXG4gICAgQElucHV0KCkgZ2V0IHBhbmVsU2l6ZXMoKTogbnVtYmVyW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5fcGFuZWxTaXplcztcbiAgICB9XG5cbiAgICBzZXQgcGFuZWxTaXplcyh2YWw6IG51bWJlcltdKSB7XG4gICAgICAgIHRoaXMuX3BhbmVsU2l6ZXMgPSB2YWw7XG5cbiAgICAgICAgaWYgKHRoaXMuZWwgJiYgdGhpcy5lbC5uYXRpdmVFbGVtZW50ICYmIHRoaXMucGFuZWxzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGxldCBjaGlsZHJlbiA9IFsuLi50aGlzLmVsLm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW5bMF0uY2hpbGRyZW5dLmZpbHRlcihjaGlsZCA9PiBEb21IYW5kbGVyLmhhc0NsYXNzKGNoaWxkLCAncC1zcGxpdHRlci1wYW5lbCcpKTtcbiAgICAgICAgICAgIGxldCBfcGFuZWxTaXplcyA9IFtdO1xuXG4gICAgICAgICAgICB0aGlzLnBhbmVscy5tYXAoKHBhbmVsLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHBhbmVsSW5pdGlhbFNpemUgPSB0aGlzLnBhbmVsU2l6ZXMubGVuZ3RoIC0xID49IGkgPyB0aGlzLnBhbmVsU2l6ZXNbaV06IG51bGw7XG4gICAgICAgICAgICAgICAgbGV0IHBhbmVsU2l6ZSA9IHBhbmVsSW5pdGlhbFNpemUgfHwgKDEwMCAvIHRoaXMucGFuZWxzLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgX3BhbmVsU2l6ZXNbaV0gPSBwYW5lbFNpemU7XG4gICAgICAgICAgICAgICAgY2hpbGRyZW5baV0uc3R5bGUuZmxleEJhc2lzID0gJ2NhbGMoJyArIHBhbmVsU2l6ZSArICclIC0gJyArICgodGhpcy5wYW5lbHMubGVuZ3RoIC0gMSkgKiB0aGlzLmd1dHRlclNpemUpICsgJ3B4KSc7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5lc3RlZCA9IGZhbHNlO1xuXG4gICAgcGFuZWxzID0gW107XG5cbiAgICBkcmFnZ2luZyA9IGZhbHNlO1xuXG4gICAgbW91c2VNb3ZlTGlzdGVuZXIgPSBudWxsO1xuXG4gICAgbW91c2VVcExpc3RlbmVyID0gbnVsbDtcblxuICAgIHRvdWNoTW92ZUxpc3RlbmVyID0gbnVsbDtcblxuICAgIHRvdWNoRW5kTGlzdGVuZXIgPSBudWxsO1xuXG4gICAgc2l6ZSA9IG51bGw7XG5cbiAgICBndXR0ZXJFbGVtZW50ID0gbnVsbDtcblxuICAgIHN0YXJ0UG9zID0gbnVsbDtcblxuICAgIHByZXZQYW5lbEVsZW1lbnQgPSBudWxsO1xuXG4gICAgbmV4dFBhbmVsRWxlbWVudCA9IG51bGw7XG5cbiAgICBuZXh0UGFuZWxTaXplID0gbnVsbDtcblxuICAgIHByZXZQYW5lbFNpemUgPSBudWxsO1xuXG4gICAgX3BhbmVsU2l6ZXM6IG51bWJlcltdID0gW107XG5cbiAgICBwcmV2UGFuZWxJbmRleCA9IG51bGw7XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgY2Q6IENoYW5nZURldGVjdG9yUmVmLCBwcml2YXRlIGVsOiBFbGVtZW50UmVmKSB7IH1cblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLm5lc3RlZCA9IHRoaXMuaXNOZXN0ZWQoKTtcbiAgICB9XG5cbiAgICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgICAgIHRoaXMudGVtcGxhdGVzLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIHN3aXRjaChpdGVtLmdldFR5cGUoKSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ3BhbmVsJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYW5lbHMucHVzaChpdGVtLnRlbXBsYXRlKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhbmVscy5wdXNoKGl0ZW0udGVtcGxhdGUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgaWYgKHRoaXMucGFuZWxzICYmIHRoaXMucGFuZWxzLmxlbmd0aCkge1xuICAgICAgICAgICAgbGV0IGluaXRpYWxpemVkID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAodGhpcy5pc1N0YXRlZnVsKCkpIHtcbiAgICAgICAgICAgICAgICBpbml0aWFsaXplZCA9IHRoaXMucmVzdG9yZVN0YXRlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghaW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGRyZW4gPSBbLi4udGhpcy5lbC5uYXRpdmVFbGVtZW50LmNoaWxkcmVuWzBdLmNoaWxkcmVuXS5maWx0ZXIoY2hpbGQgPT4gRG9tSGFuZGxlci5oYXNDbGFzcyhjaGlsZCwgJ3Atc3BsaXR0ZXItcGFuZWwnKSk7XG4gICAgICAgICAgICAgICAgbGV0IF9wYW5lbFNpemVzID0gW107XG5cbiAgICAgICAgICAgICAgICB0aGlzLnBhbmVscy5tYXAoKHBhbmVsLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBwYW5lbEluaXRpYWxTaXplID0gdGhpcy5wYW5lbFNpemVzLmxlbmd0aCAtMSA+PSBpID8gdGhpcy5wYW5lbFNpemVzW2ldOiBudWxsO1xuICAgICAgICAgICAgICAgICAgICBsZXQgcGFuZWxTaXplID0gcGFuZWxJbml0aWFsU2l6ZSB8fCAoMTAwIC8gdGhpcy5wYW5lbHMubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgX3BhbmVsU2l6ZXNbaV0gPSBwYW5lbFNpemU7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuW2ldLnN0eWxlLmZsZXhCYXNpcyA9ICdjYWxjKCcgKyBwYW5lbFNpemUgKyAnJSAtICcgKyAoKHRoaXMucGFuZWxzLmxlbmd0aCAtIDEpICogdGhpcy5ndXR0ZXJTaXplKSArICdweCknO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fcGFuZWxTaXplcyA9IF9wYW5lbFNpemVzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVzaXplU3RhcnQoZXZlbnQsIGluZGV4KSB7XG4gICAgICAgIHRoaXMuZ3V0dGVyRWxlbWVudCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQ7XG4gICAgICAgIHRoaXMuc2l6ZSA9IHRoaXMuaG9yaXpvbnRhbCgpID8gRG9tSGFuZGxlci5nZXRXaWR0aCh0aGlzLmNvbnRhaW5lclZpZXdDaGlsZC5uYXRpdmVFbGVtZW50KSA6IERvbUhhbmRsZXIuZ2V0SGVpZ2h0KHRoaXMuY29udGFpbmVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICB0aGlzLmRyYWdnaW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5zdGFydFBvcyA9IHRoaXMuaG9yaXpvbnRhbCgpID8gKGV2ZW50LnBhZ2VYIHx8IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VYKSA6IChldmVudC5wYWdlWSB8fCBldmVudC5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWSk7XG4gICAgICAgIHRoaXMucHJldlBhbmVsRWxlbWVudCA9IHRoaXMuZ3V0dGVyRWxlbWVudC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuICAgICAgICB0aGlzLm5leHRQYW5lbEVsZW1lbnQgPSB0aGlzLmd1dHRlckVsZW1lbnQubmV4dEVsZW1lbnRTaWJsaW5nO1xuICAgICAgICB0aGlzLnByZXZQYW5lbFNpemUgPSAxMDAgKiAodGhpcy5ob3Jpem9udGFsKCkgPyBEb21IYW5kbGVyLmdldE91dGVyV2lkdGgodGhpcy5wcmV2UGFuZWxFbGVtZW50LCB0cnVlKTogRG9tSGFuZGxlci5nZXRPdXRlckhlaWdodCh0aGlzLnByZXZQYW5lbEVsZW1lbnQsIHRydWUpKSAvIHRoaXMuc2l6ZTtcbiAgICAgICAgdGhpcy5uZXh0UGFuZWxTaXplID0gMTAwICogKHRoaXMuaG9yaXpvbnRhbCgpID8gRG9tSGFuZGxlci5nZXRPdXRlcldpZHRoKHRoaXMubmV4dFBhbmVsRWxlbWVudCwgdHJ1ZSk6IERvbUhhbmRsZXIuZ2V0T3V0ZXJIZWlnaHQodGhpcy5uZXh0UGFuZWxFbGVtZW50LCB0cnVlKSkgLyB0aGlzLnNpemU7XG4gICAgICAgIHRoaXMucHJldlBhbmVsSW5kZXggPSBpbmRleDtcbiAgICAgICAgRG9tSGFuZGxlci5hZGRDbGFzcyh0aGlzLmd1dHRlckVsZW1lbnQsICdwLXNwbGl0dGVyLWd1dHRlci1yZXNpemluZycpO1xuICAgICAgICBEb21IYW5kbGVyLmFkZENsYXNzKHRoaXMuY29udGFpbmVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQsICdwLXNwbGl0dGVyLXJlc2l6aW5nJyk7XG4gICAgICAgIHRoaXMub25SZXNpemVTdGFydC5lbWl0KHtvcmlnaW5hbEV2ZW50OiBldmVudCwgc2l6ZXM6IHRoaXMuX3BhbmVsU2l6ZXN9KTtcbiAgICB9XG5cbiAgICBvblJlc2l6ZShldmVudCkge1xuICAgICAgICBsZXQgbmV3UG9zO1xuICAgICAgICBpZiAodGhpcy5ob3Jpem9udGFsKCkpXG4gICAgICAgICAgICBuZXdQb3MgPSAoZXZlbnQucGFnZVggKiAxMDAgLyB0aGlzLnNpemUpIC0gKHRoaXMuc3RhcnRQb3MgKiAxMDAgLyB0aGlzLnNpemUpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBuZXdQb3MgPSAoZXZlbnQucGFnZVkgICogMTAwIC8gdGhpcy5zaXplKSAtICh0aGlzLnN0YXJ0UG9zICogMTAwIC8gdGhpcy5zaXplKTtcblxuICAgICAgICBsZXQgbmV3UHJldlBhbmVsU2l6ZSA9IHRoaXMucHJldlBhbmVsU2l6ZSArIG5ld1BvcztcbiAgICAgICAgbGV0IG5ld05leHRQYW5lbFNpemUgPSB0aGlzLm5leHRQYW5lbFNpemUgLSBuZXdQb3M7XG5cbiAgICAgICAgaWYgKHRoaXMudmFsaWRhdGVSZXNpemUobmV3UHJldlBhbmVsU2l6ZSwgbmV3TmV4dFBhbmVsU2l6ZSkpIHtcbiAgICAgICAgICAgIHRoaXMucHJldlBhbmVsRWxlbWVudC5zdHlsZS5mbGV4QmFzaXMgPSAnY2FsYygnICsgbmV3UHJldlBhbmVsU2l6ZSArICclIC0gJyArICgodGhpcy5wYW5lbHMubGVuZ3RoIC0gMSkgKiB0aGlzLmd1dHRlclNpemUpICsgJ3B4KSc7XG4gICAgICAgICAgICB0aGlzLm5leHRQYW5lbEVsZW1lbnQuc3R5bGUuZmxleEJhc2lzID0gJ2NhbGMoJyArIG5ld05leHRQYW5lbFNpemUgKyAnJSAtICcgKyAoKHRoaXMucGFuZWxzLmxlbmd0aCAtIDEpICogdGhpcy5ndXR0ZXJTaXplKSArICdweCknO1xuICAgICAgICAgICAgdGhpcy5fcGFuZWxTaXplc1t0aGlzLnByZXZQYW5lbEluZGV4XSA9IG5ld1ByZXZQYW5lbFNpemU7XG4gICAgICAgICAgICB0aGlzLl9wYW5lbFNpemVzW3RoaXMucHJldlBhbmVsSW5kZXggKyAxXSA9IG5ld05leHRQYW5lbFNpemU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXNpemVFbmQoZXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNTdGF0ZWZ1bCgpKSB7XG4gICAgICAgICAgICB0aGlzLnNhdmVTdGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5vblJlc2l6ZUVuZC5lbWl0KHtvcmlnaW5hbEV2ZW50OiBldmVudCwgc2l6ZXM6IHRoaXMuX3BhbmVsU2l6ZXN9KTtcbiAgICAgICAgRG9tSGFuZGxlci5yZW1vdmVDbGFzcyh0aGlzLmd1dHRlckVsZW1lbnQsICdwLXNwbGl0dGVyLWd1dHRlci1yZXNpemluZycpO1xuICAgICAgICBEb21IYW5kbGVyLnJlbW92ZUNsYXNzKHRoaXMuY29udGFpbmVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQsICdwLXNwbGl0dGVyLXJlc2l6aW5nJyk7XG4gICAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICB9XG5cbiAgICBvbkd1dHRlck1vdXNlRG93bihldmVudCwgaW5kZXgpIHtcbiAgICAgICAgdGhpcy5yZXNpemVTdGFydChldmVudCwgaW5kZXgpO1xuICAgICAgICB0aGlzLmJpbmRNb3VzZUxpc3RlbmVycygpO1xuICAgIH1cblxuICAgIG9uR3V0dGVyVG91Y2hTdGFydChldmVudCwgaW5kZXgpIHtcbiAgICAgICAgaWYgKGV2ZW50LmNhbmNlbGFibGUpe1xuICAgICAgICAgICAgdGhpcy5yZXNpemVTdGFydChldmVudCwgaW5kZXgpO1xuICAgICAgICAgICAgdGhpcy5iaW5kVG91Y2hMaXN0ZW5lcnMoKTtcblxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uR3V0dGVyVG91Y2hFbmQoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5yZXNpemVFbmQoZXZlbnQpO1xuICAgICAgICB0aGlzLnVuYmluZFRvdWNoTGlzdGVuZXJzKCk7XG5cbiAgICAgICAgaWYgKGV2ZW50LmNhbmNlbGFibGUpXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIHZhbGlkYXRlUmVzaXplKG5ld1ByZXZQYW5lbFNpemUsIG5ld05leHRQYW5lbFNpemUpIHtcbiAgICAgICAgaWYgKHRoaXMubWluU2l6ZXMubGVuZ3RoID49IDEgJiYgdGhpcy5taW5TaXplc1swXSAmJiB0aGlzLm1pblNpemVzWzBdID4gbmV3UHJldlBhbmVsU2l6ZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMubWluU2l6ZXMubGVuZ3RoID4gMSAmJiB0aGlzLm1pblNpemVzWzFdICYmIHRoaXMubWluU2l6ZXNbMV0gPiBuZXdOZXh0UGFuZWxTaXplKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBiaW5kTW91c2VMaXN0ZW5lcnMoKSB7XG4gICAgICAgIGlmICghdGhpcy5tb3VzZU1vdmVMaXN0ZW5lcikge1xuICAgICAgICAgICAgdGhpcy5tb3VzZU1vdmVMaXN0ZW5lciA9IGV2ZW50ID0+IHRoaXMub25SZXNpemUoZXZlbnQpXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLm1vdXNlTW92ZUxpc3RlbmVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5tb3VzZVVwTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMubW91c2VVcExpc3RlbmVyID0gZXZlbnQgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucmVzaXplRW5kKGV2ZW50KTtcbiAgICAgICAgICAgICAgICB0aGlzLnVuYmluZE1vdXNlTGlzdGVuZXJzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5tb3VzZVVwTGlzdGVuZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYmluZFRvdWNoTGlzdGVuZXJzKCkge1xuICAgICAgICBpZiAoIXRoaXMudG91Y2hNb3ZlTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMudG91Y2hNb3ZlTGlzdGVuZXIgPSBldmVudCA9PiB0aGlzLm9uUmVzaXplKGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdKVxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy50b3VjaE1vdmVMaXN0ZW5lcik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMudG91Y2hFbmRMaXN0ZW5lcikge1xuICAgICAgICAgICAgdGhpcy50b3VjaEVuZExpc3RlbmVyID0gZXZlbnQgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucmVzaXplRW5kKGV2ZW50KTtcbiAgICAgICAgICAgICAgICB0aGlzLnVuYmluZFRvdWNoTGlzdGVuZXJzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMudG91Y2hFbmRMaXN0ZW5lcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1bmJpbmRNb3VzZUxpc3RlbmVycygpIHtcbiAgICAgICAgaWYgKHRoaXMubW91c2VNb3ZlTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMubW91c2VNb3ZlTGlzdGVuZXIpO1xuICAgICAgICAgICAgdGhpcy5tb3VzZU1vdmVMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5tb3VzZVVwTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLm1vdXNlVXBMaXN0ZW5lcik7XG4gICAgICAgICAgICB0aGlzLm1vdXNlVXBMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1bmJpbmRUb3VjaExpc3RlbmVycygpIHtcbiAgICAgICAgaWYgKHRoaXMudG91Y2hNb3ZlTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMudG91Y2hNb3ZlTGlzdGVuZXIpO1xuICAgICAgICAgICAgdGhpcy50b3VjaE1vdmVMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy50b3VjaEVuZExpc3RlbmVyKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMudG91Y2hFbmRMaXN0ZW5lcik7XG4gICAgICAgICAgICB0aGlzLnRvdWNoRW5kTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xlYXIoKSB7XG4gICAgICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zaXplID0gbnVsbDtcbiAgICAgICAgdGhpcy5zdGFydFBvcyA9IG51bGw7XG4gICAgICAgIHRoaXMucHJldlBhbmVsRWxlbWVudCA9IG51bGw7XG4gICAgICAgIHRoaXMubmV4dFBhbmVsRWxlbWVudCA9IG51bGw7XG4gICAgICAgIHRoaXMucHJldlBhbmVsU2l6ZSA9IG51bGw7XG4gICAgICAgIHRoaXMubmV4dFBhbmVsU2l6ZSA9IG51bGw7XG4gICAgICAgIHRoaXMuZ3V0dGVyRWxlbWVudCA9IG51bGw7XG4gICAgICAgIHRoaXMucHJldlBhbmVsSW5kZXggPSBudWxsO1xuICAgIH1cblxuICAgIGlzTmVzdGVkKCkge1xuICAgICAgICBpZiAodGhpcy5lbC5uYXRpdmVFbGVtZW50KSB7XG4gICAgICAgICAgICBsZXQgcGFyZW50ID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgICAgICAgICB3aGlsZSAocGFyZW50ICYmICFEb21IYW5kbGVyLmhhc0NsYXNzKHBhcmVudCwgJ3Atc3BsaXR0ZXInKSkge1xuICAgICAgICAgICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnRFbGVtZW50O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcGFyZW50ICE9PSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaXNTdGF0ZWZ1bCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGVLZXkgIT0gbnVsbDtcbiAgICB9XG5cbiAgICBnZXRTdG9yYWdlKCkge1xuICAgICAgICBzd2l0Y2godGhpcy5zdGF0ZVN0b3JhZ2UpIHtcbiAgICAgICAgICAgIGNhc2UgJ2xvY2FsJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gd2luZG93LmxvY2FsU3RvcmFnZTtcblxuICAgICAgICAgICAgY2FzZSAnc2Vzc2lvbic6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5zZXNzaW9uU3RvcmFnZTtcblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IodGhpcy5zdGF0ZVN0b3JhZ2UgKyAnIGlzIG5vdCBhIHZhbGlkIHZhbHVlIGZvciB0aGUgc3RhdGUgc3RvcmFnZSwgc3VwcG9ydGVkIHZhbHVlcyBhcmUgXCJsb2NhbFwiIGFuZCBcInNlc3Npb25cIi4nKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNhdmVTdGF0ZSgpIHtcbiAgICAgICAgdGhpcy5nZXRTdG9yYWdlKCkuc2V0SXRlbSh0aGlzLnN0YXRlS2V5LCBKU09OLnN0cmluZ2lmeSh0aGlzLl9wYW5lbFNpemVzKSk7XG4gICAgfVxuXG4gICAgcmVzdG9yZVN0YXRlKCkge1xuICAgICAgICBjb25zdCBzdG9yYWdlID0gdGhpcy5nZXRTdG9yYWdlKCk7XG4gICAgICAgIGNvbnN0IHN0YXRlU3RyaW5nID0gc3RvcmFnZS5nZXRJdGVtKHRoaXMuc3RhdGVLZXkpO1xuXG4gICAgICAgIGlmIChzdGF0ZVN0cmluZykge1xuICAgICAgICAgICAgdGhpcy5fcGFuZWxTaXplcyA9IEpTT04ucGFyc2Uoc3RhdGVTdHJpbmcpO1xuICAgICAgICAgICAgbGV0IGNoaWxkcmVuID0gWy4uLnRoaXMuY29udGFpbmVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW5dLmZpbHRlcihjaGlsZCA9PiBEb21IYW5kbGVyLmhhc0NsYXNzKGNoaWxkLCAncC1zcGxpdHRlci1wYW5lbCcpKTtcbiAgICAgICAgICAgIGNoaWxkcmVuLmZvckVhY2goKGNoaWxkLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgY2hpbGQuc3R5bGUuZmxleEJhc2lzID0gJ2NhbGMoJyArIHRoaXMuX3BhbmVsU2l6ZXNbaV0gKyAnJSAtICcgKyAoKHRoaXMucGFuZWxzLmxlbmd0aCAtIDEpICogdGhpcy5ndXR0ZXJTaXplKSArICdweCknO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnRhaW5lckNsYXNzKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJ3Atc3BsaXR0ZXIgcC1jb21wb25lbnQnOiB0cnVlLFxuICAgICAgICAgICAgJ3Atc3BsaXR0ZXItaG9yaXpvbnRhbCc6IHRoaXMubGF5b3V0ID09PSBcImhvcml6b250YWxcIixcbiAgICAgICAgICAgICdwLXNwbGl0dGVyLXZlcnRpY2FsJzogdGhpcy5sYXlvdXQgPT09IFwidmVydGljYWxcIlxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHBhbmVsQ29udGFpbmVyQ2xhc3MoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAncC1zcGxpdHRlci1wYW5lbCc6IHRydWUsXG4gICAgICAgICAgICAncC1zcGxpdHRlci1wYW5lbC1uZXN0ZWQnOiB0cnVlXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZ3V0dGVyU3R5bGUoKSB7XG4gICAgICAgIGlmICh0aGlzLmhvcml6b250YWwoKSlcbiAgICAgICAgICAgIHJldHVybiB7d2lkdGg6IHRoaXMuZ3V0dGVyU2l6ZSArICdweCd9O1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4ge2hlaWdodDogdGhpcy5ndXR0ZXJTaXplICsgJ3B4J307XG4gICAgfVxuXG4gICAgaG9yaXpvbnRhbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGF5b3V0ID09PSAnaG9yaXpvbnRhbCc7XG4gICAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdLFxuICAgIGV4cG9ydHM6IFtTcGxpdHRlciwgU2hhcmVkTW9kdWxlXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtTcGxpdHRlcl1cbn0pXG5leHBvcnQgY2xhc3MgU3BsaXR0ZXJNb2R1bGUgeyB9XG4iXX0=