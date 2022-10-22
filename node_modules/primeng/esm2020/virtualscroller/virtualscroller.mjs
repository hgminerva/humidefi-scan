import { NgModule, Component, Input, Output, EventEmitter, ContentChild, ContentChildren, ChangeDetectionStrategy, ViewEncapsulation, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header, Footer, PrimeTemplate, SharedModule } from 'primeng/api';
import { ScrollerModule } from 'primeng/scroller';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "primeng/api";
import * as i3 from "primeng/scroller";
export class VirtualScroller {
    constructor(el, cd) {
        this.el = el;
        this.cd = cd;
        this.delay = 250;
        this.onLazyLoad = new EventEmitter();
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'item':
                    this.itemTemplate = item.template;
                    break;
                case 'loadingItem':
                    this.loadingItemTemplate = item.template;
                    break;
                case 'header':
                    this.headerTemplate = item.template;
                    break;
                case 'footer':
                    this.footerTemplate = item.template;
                    break;
                default:
                    this.itemTemplate = item.template;
                    break;
            }
        });
    }
    onLazyItemLoad(event) {
        if (this.virtualScrollTimeout) {
            clearTimeout(this.virtualScrollTimeout);
        }
        this.virtualScrollTimeout = setTimeout(() => {
            this.onLazyLoad.emit({
                ...event,
                rows: event.last - event.first,
                forceUpdate: () => this.cd.detectChanges()
            });
        }, this.delay);
    }
    getBlockableElement() {
        return this.el.nativeElement.children[0];
    }
    scrollToIndex(index, mode) {
        this.scroller?.scrollToIndex(index, mode);
    }
}
VirtualScroller.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: VirtualScroller, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
VirtualScroller.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.7", type: VirtualScroller, selector: "p-virtualScroller", inputs: { value: "value", itemSize: "itemSize", style: "style", styleClass: "styleClass", scrollHeight: "scrollHeight", lazy: "lazy", options: "options", delay: "delay" }, outputs: { onLazyLoad: "onLazyLoad" }, host: { classAttribute: "p-element" }, queries: [{ propertyName: "header", first: true, predicate: Header, descendants: true }, { propertyName: "footer", first: true, predicate: Footer, descendants: true }, { propertyName: "templates", predicate: PrimeTemplate }], viewQueries: [{ propertyName: "scroller", first: true, predicate: ["scroller"], descendants: true }], ngImport: i0, template: `
        <div [ngClass]="'p-virtualscroller p-component'" [ngStyle]="style" [class]="styleClass">
            <div class="p-virtualscroller-header" *ngIf="header || headerTemplate">
                <ng-content select="p-header"></ng-content>
                <ng-container *ngTemplateOutlet="headerTemplate"></ng-container>
            </div>
            <div #content class="p-virtualscroller-content">
                <p-scroller #scroller [items]="value" styleClass="p-virtualscroller-list" [style]="{'height': scrollHeight}" [itemSize]="itemSize"
                    [lazy]="lazy" (onLazyLoad)="onLazyItemLoad($event)" [options]="options">
                    <ng-template pTemplate="item" let-item let-scrollerOptions="options">
                        <div [ngStyle]="{'height': itemSize + 'px'}" class="p-virtualscroller-item">
                            <ng-container *ngTemplateOutlet="item ? itemTemplate : loadingItemTemplate; context: {$implicit: item, options: scrollerOptions}"></ng-container>
                        </div>
                    </ng-template>
                </p-scroller>
            </div>
            <div class="p-virtualscroller-footer" *ngIf="footer || footerTemplate">
                <ng-content select="p-footer"></ng-content>
                <ng-container *ngTemplateOutlet="footerTemplate"></ng-container>
            </div>
        </div>
    `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i2.PrimeTemplate, selector: "[pTemplate]", inputs: ["type", "pTemplate"] }, { kind: "component", type: i3.Scroller, selector: "p-scroller", inputs: ["id", "style", "styleClass", "tabindex", "items", "itemSize", "scrollHeight", "scrollWidth", "orientation", "delay", "resizeDelay", "lazy", "disabled", "loaderDisabled", "columns", "showSpacer", "showLoader", "numToleratedItems", "loading", "autoSize", "trackBy", "options"], outputs: ["onLazyLoad", "onScroll", "onScrollIndexChange"] }], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: VirtualScroller, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-virtualScroller',
                    template: `
        <div [ngClass]="'p-virtualscroller p-component'" [ngStyle]="style" [class]="styleClass">
            <div class="p-virtualscroller-header" *ngIf="header || headerTemplate">
                <ng-content select="p-header"></ng-content>
                <ng-container *ngTemplateOutlet="headerTemplate"></ng-container>
            </div>
            <div #content class="p-virtualscroller-content">
                <p-scroller #scroller [items]="value" styleClass="p-virtualscroller-list" [style]="{'height': scrollHeight}" [itemSize]="itemSize"
                    [lazy]="lazy" (onLazyLoad)="onLazyItemLoad($event)" [options]="options">
                    <ng-template pTemplate="item" let-item let-scrollerOptions="options">
                        <div [ngStyle]="{'height': itemSize + 'px'}" class="p-virtualscroller-item">
                            <ng-container *ngTemplateOutlet="item ? itemTemplate : loadingItemTemplate; context: {$implicit: item, options: scrollerOptions}"></ng-container>
                        </div>
                    </ng-template>
                </p-scroller>
            </div>
            <div class="p-virtualscroller-footer" *ngIf="footer || footerTemplate">
                <ng-content select="p-footer"></ng-content>
                <ng-container *ngTemplateOutlet="footerTemplate"></ng-container>
            </div>
        </div>
    `,
                    changeDetection: ChangeDetectionStrategy.Default,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        'class': 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { value: [{
                type: Input
            }], itemSize: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], scrollHeight: [{
                type: Input
            }], lazy: [{
                type: Input
            }], options: [{
                type: Input
            }], delay: [{
                type: Input
            }], header: [{
                type: ContentChild,
                args: [Header]
            }], footer: [{
                type: ContentChild,
                args: [Footer]
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }], scroller: [{
                type: ViewChild,
                args: ['scroller']
            }], onLazyLoad: [{
                type: Output
            }] } });
export class VirtualScrollerModule {
}
VirtualScrollerModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: VirtualScrollerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
VirtualScrollerModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.7", ngImport: i0, type: VirtualScrollerModule, declarations: [VirtualScroller], imports: [CommonModule, SharedModule, ScrollerModule], exports: [VirtualScroller, SharedModule, ScrollerModule] });
VirtualScrollerModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: VirtualScrollerModule, imports: [CommonModule, SharedModule, ScrollerModule, SharedModule, ScrollerModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: VirtualScrollerModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, SharedModule, ScrollerModule],
                    exports: [VirtualScroller, SharedModule, ScrollerModule],
                    declarations: [VirtualScroller]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlydHVhbHNjcm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9jb21wb25lbnRzL3ZpcnR1YWxzY3JvbGxlci92aXJ0dWFsc2Nyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQWdDLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxlQUFlLEVBQTBCLHVCQUF1QixFQUFFLGlCQUFpQixFQUFvQixTQUFTLEVBQXFCLE1BQU0sZUFBZSxDQUFDO0FBQ2xRLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxhQUFhLEVBQUUsWUFBWSxFQUFlLE1BQU0sYUFBYSxDQUFDO0FBQ3ZGLE9BQU8sRUFBWSxjQUFjLEVBQW1CLE1BQU0sa0JBQWtCLENBQUM7Ozs7O0FBZ0M3RSxNQUFNLE9BQU8sZUFBZTtJQXNDeEIsWUFBbUIsRUFBYyxFQUFTLEVBQXFCO1FBQTVDLE9BQUUsR0FBRixFQUFFLENBQVk7UUFBUyxPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQXRCdEQsVUFBSyxHQUFXLEdBQUcsQ0FBQztRQVVuQixlQUFVLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7SUFZTSxDQUFDO0lBRXBFLGtCQUFrQjtRQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDNUIsUUFBUSxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUU7Z0JBQ3BCLEtBQUssTUFBTTtvQkFDUCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7b0JBQ2xDLE1BQU07Z0JBRVYsS0FBSyxhQUFhO29CQUNkLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO29CQUN6QyxNQUFNO2dCQUVWLEtBQUss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RSxDQUFDLGVBQWUsQ0FBQztpQkFDbEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSwgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBBZnRlckNvbnRlbnRJbml0LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIENvbnRlbnRDaGlsZCwgQ29udGVudENoaWxkcmVuLCBRdWVyeUxpc3QsIFRlbXBsYXRlUmVmLCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgVmlld0VuY2Fwc3VsYXRpb24sIEluamVjdCwgT3B0aW9uYWwsIFZpZXdDaGlsZCwgQ2hhbmdlRGV0ZWN0b3JSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBIZWFkZXIsIEZvb3RlciwgUHJpbWVUZW1wbGF0ZSwgU2hhcmVkTW9kdWxlLCBCbG9ja2FibGVVSSB9IGZyb20gJ3ByaW1lbmcvYXBpJztcbmltcG9ydCB7IFNjcm9sbGVyLCBTY3JvbGxlck1vZHVsZSwgU2Nyb2xsZXJPcHRpb25zIH0gZnJvbSAncHJpbWVuZy9zY3JvbGxlcic7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC12aXJ0dWFsU2Nyb2xsZXInLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxkaXYgW25nQ2xhc3NdPVwiJ3AtdmlydHVhbHNjcm9sbGVyIHAtY29tcG9uZW50J1wiIFtuZ1N0eWxlXT1cInN0eWxlXCIgW2NsYXNzXT1cInN0eWxlQ2xhc3NcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwLXZpcnR1YWxzY3JvbGxlci1oZWFkZXJcIiAqbmdJZj1cImhlYWRlciB8fCBoZWFkZXJUZW1wbGF0ZVwiPlxuICAgICAgICAgICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cInAtaGVhZGVyXCI+PC9uZy1jb250ZW50PlxuICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJoZWFkZXJUZW1wbGF0ZVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2ICNjb250ZW50IGNsYXNzPVwicC12aXJ0dWFsc2Nyb2xsZXItY29udGVudFwiPlxuICAgICAgICAgICAgICAgIDxwLXNjcm9sbGVyICNzY3JvbGxlciBbaXRlbXNdPVwidmFsdWVcIiBzdHlsZUNsYXNzPVwicC12aXJ0dWFsc2Nyb2xsZXItbGlzdFwiIFtzdHlsZV09XCJ7J2hlaWdodCc6IHNjcm9sbEhlaWdodH1cIiBbaXRlbVNpemVdPVwiaXRlbVNpemVcIlxuICAgICAgICAgICAgICAgICAgICBbbGF6eV09XCJsYXp5XCIgKG9uTGF6eUxvYWQpPVwib25MYXp5SXRlbUxvYWQoJGV2ZW50KVwiIFtvcHRpb25zXT1cIm9wdGlvbnNcIj5cbiAgICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlIHBUZW1wbGF0ZT1cIml0ZW1cIiBsZXQtaXRlbSBsZXQtc2Nyb2xsZXJPcHRpb25zPVwib3B0aW9uc1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBbbmdTdHlsZV09XCJ7J2hlaWdodCc6IGl0ZW1TaXplICsgJ3B4J31cIiBjbGFzcz1cInAtdmlydHVhbHNjcm9sbGVyLWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiaXRlbSA/IGl0ZW1UZW1wbGF0ZSA6IGxvYWRpbmdJdGVtVGVtcGxhdGU7IGNvbnRleHQ6IHskaW1wbGljaXQ6IGl0ZW0sIG9wdGlvbnM6IHNjcm9sbGVyT3B0aW9uc31cIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgIDwvcC1zY3JvbGxlcj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtdmlydHVhbHNjcm9sbGVyLWZvb3RlclwiICpuZ0lmPVwiZm9vdGVyIHx8IGZvb3RlclRlbXBsYXRlXCI+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwicC1mb290ZXJcIj48L25nLWNvbnRlbnQ+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImZvb3RlclRlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgYCxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkRlZmF1bHQsXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgICBob3N0OiB7XG4gICAgICAgICdjbGFzcyc6ICdwLWVsZW1lbnQnXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBWaXJ0dWFsU2Nyb2xsZXIgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBCbG9ja2FibGVVSSB7XG5cbiAgICBASW5wdXQoKSB2YWx1ZTogYW55W107XG5cbiAgICBASW5wdXQoKSBpdGVtU2l6ZTogbnVtYmVyO1xuXG4gICAgQElucHV0KCkgc3R5bGU6IGFueTtcblxuICAgIEBJbnB1dCgpIHN0eWxlQ2xhc3M6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHNjcm9sbEhlaWdodDogYW55O1xuXG4gICAgQElucHV0KCkgbGF6eTogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIG9wdGlvbnM6IFNjcm9sbGVyT3B0aW9ucztcblxuICAgIEBJbnB1dCgpIGRlbGF5OiBudW1iZXIgPSAyNTA7XG5cbiAgICBAQ29udGVudENoaWxkKEhlYWRlcikgaGVhZGVyOiBIZWFkZXI7XG5cbiAgICBAQ29udGVudENoaWxkKEZvb3RlcikgZm9vdGVyOiBGb290ZXI7XG5cbiAgICBAQ29udGVudENoaWxkcmVuKFByaW1lVGVtcGxhdGUpIHRlbXBsYXRlczogUXVlcnlMaXN0PGFueT47XG5cbiAgICBAVmlld0NoaWxkKCdzY3JvbGxlcicpIHNjcm9sbGVyOiBTY3JvbGxlcjtcblxuICAgIEBPdXRwdXQoKSBvbkxhenlMb2FkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIGl0ZW1UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIGhlYWRlclRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgZm9vdGVyVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBsb2FkaW5nSXRlbVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgdmlydHVhbFNjcm9sbFRpbWVvdXQ6IGFueTtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBlbDogRWxlbWVudFJlZiwgcHVibGljIGNkOiBDaGFuZ2VEZXRlY3RvclJlZikgeyB9XG5cbiAgICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgICAgIHRoaXMudGVtcGxhdGVzLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIHN3aXRjaCAoaXRlbS5nZXRUeXBlKCkpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdpdGVtJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtVGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2xvYWRpbmdJdGVtJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkaW5nSXRlbVRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdoZWFkZXInOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhlYWRlclRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdmb290ZXInOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZvb3RlclRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICB0aGlzLml0ZW1UZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvbkxhenlJdGVtTG9hZChldmVudCkge1xuICAgICAgICBpZiAodGhpcy52aXJ0dWFsU2Nyb2xsVGltZW91dCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudmlydHVhbFNjcm9sbFRpbWVvdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy52aXJ0dWFsU2Nyb2xsVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5vbkxhenlMb2FkLmVtaXQoe1xuICAgICAgICAgICAgICAgIC4uLmV2ZW50LFxuICAgICAgICAgICAgICAgIHJvd3M6IGV2ZW50Lmxhc3QgLSBldmVudC5maXJzdCxcbiAgICAgICAgICAgICAgICBmb3JjZVVwZGF0ZTogKCkgPT4gdGhpcy5jZC5kZXRlY3RDaGFuZ2VzKClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCB0aGlzLmRlbGF5KTtcbiAgICB9XG5cbiAgICBnZXRCbG9ja2FibGVFbGVtZW50KCk6IEhUTUxFbGVtZW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWwubmF0aXZlRWxlbWVudC5jaGlsZHJlblswXTtcbiAgICB9XG5cbiAgICBzY3JvbGxUb0luZGV4KGluZGV4OiBudW1iZXIsIG1vZGU/OiBTY3JvbGxCZWhhdmlvcik6IHZvaWQge1xuICAgICAgICB0aGlzLnNjcm9sbGVyPy5zY3JvbGxUb0luZGV4KGluZGV4LCBtb2RlKTtcbiAgICB9XG59XG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgU2hhcmVkTW9kdWxlLCBTY3JvbGxlck1vZHVsZV0sXG4gICAgZXhwb3J0czogW1ZpcnR1YWxTY3JvbGxlciwgU2hhcmVkTW9kdWxlLCBTY3JvbGxlck1vZHVsZV0sXG4gICAgZGVjbGFyYXRpb25zOiBbVmlydHVhbFNjcm9sbGVyXVxufSlcbmV4cG9ydCBjbGFzcyBWaXJ0dWFsU2Nyb2xsZXJNb2R1bGUgeyB9XG5cbiJdfQ==