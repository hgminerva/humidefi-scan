import { NgModule, Component, Input, Output, EventEmitter, ContentChildren, ChangeDetectionStrategy, ViewEncapsulation, ViewChild, forwardRef, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { SharedModule, PrimeTemplate } from 'primeng/api';
import { DomHandler } from 'primeng/dom';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "primeng/tooltip";
import * as i3 from "primeng/ripple";
let idx = 0;
export class TabPanel {
    constructor(tabView, viewContainer, cd) {
        this.viewContainer = viewContainer;
        this.cd = cd;
        this.cache = true;
        this.tooltipPosition = 'top';
        this.tooltipPositionStyle = 'absolute';
        this.id = `p-tabpanel-${idx++}`;
        this.tabView = tabView;
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'header':
                    this.headerTemplate = item.template;
                    break;
                case 'content':
                    this.contentTemplate = item.template;
                    break;
                default:
                    this.contentTemplate = item.template;
                    break;
            }
        });
    }
    get selected() {
        return this._selected;
    }
    set selected(val) {
        this._selected = val;
        if (!this.loaded) {
            this.cd.detectChanges();
        }
        if (val)
            this.loaded = true;
    }
    get disabled() {
        return this._disabled;
    }
    ;
    set disabled(disabled) {
        this._disabled = disabled;
        this.tabView.cd.markForCheck();
    }
    get header() {
        return this._header;
    }
    set header(header) {
        this._header = header;
        // We have to wait for the rendering and then retrieve the actual size element from the DOM.
        // in future `Promise.resolve` can be changed to `queueMicrotask` (if ie11 support will be dropped)
        Promise.resolve().then(() => {
            this.tabView.updateInkBar();
            this.tabView.cd.markForCheck();
        });
    }
    get leftIcon() {
        return this._leftIcon;
    }
    set leftIcon(leftIcon) {
        this._leftIcon = leftIcon;
        this.tabView.cd.markForCheck();
    }
    get rightIcon() {
        return this._rightIcon;
    }
    set rightIcon(rightIcon) {
        this._rightIcon = rightIcon;
        this.tabView.cd.markForCheck();
    }
    ngOnDestroy() {
        this.view = null;
    }
}
TabPanel.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: TabPanel, deps: [{ token: forwardRef(() => TabView) }, { token: i0.ViewContainerRef }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
TabPanel.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.7", type: TabPanel, selector: "p-tabPanel", inputs: { closable: "closable", headerStyle: "headerStyle", headerStyleClass: "headerStyleClass", cache: "cache", tooltip: "tooltip", tooltipPosition: "tooltipPosition", tooltipPositionStyle: "tooltipPositionStyle", tooltipStyleClass: "tooltipStyleClass", selected: "selected", disabled: "disabled", header: "header", leftIcon: "leftIcon", rightIcon: "rightIcon" }, host: { classAttribute: "p-element" }, queries: [{ propertyName: "templates", predicate: PrimeTemplate }], ngImport: i0, template: `
        <div [attr.id]="id" class="p-tabview-panel" [hidden]="!selected"
            role="tabpanel" [attr.aria-hidden]="!selected" [attr.aria-labelledby]="id + '-label'" *ngIf="!closed">
            <ng-content></ng-content>
            <ng-container *ngIf="contentTemplate && (cache ? loaded : selected)">
                <ng-container *ngTemplateOutlet="contentTemplate"></ng-container>
            </ng-container>
        </div>
    `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: TabPanel, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-tabPanel',
                    template: `
        <div [attr.id]="id" class="p-tabview-panel" [hidden]="!selected"
            role="tabpanel" [attr.aria-hidden]="!selected" [attr.aria-labelledby]="id + '-label'" *ngIf="!closed">
            <ng-content></ng-content>
            <ng-container *ngIf="contentTemplate && (cache ? loaded : selected)">
                <ng-container *ngTemplateOutlet="contentTemplate"></ng-container>
            </ng-container>
        </div>
    `,
                    host: {
                        'class': 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [forwardRef(() => TabView)]
                }] }, { type: i0.ViewContainerRef }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { closable: [{
                type: Input
            }], headerStyle: [{
                type: Input
            }], headerStyleClass: [{
                type: Input
            }], cache: [{
                type: Input
            }], tooltip: [{
                type: Input
            }], tooltipPosition: [{
                type: Input
            }], tooltipPositionStyle: [{
                type: Input
            }], tooltipStyleClass: [{
                type: Input
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }], selected: [{
                type: Input
            }], disabled: [{
                type: Input
            }], header: [{
                type: Input
            }], leftIcon: [{
                type: Input
            }], rightIcon: [{
                type: Input
            }] } });
export class TabView {
    constructor(el, cd) {
        this.el = el;
        this.cd = cd;
        this.orientation = 'top';
        this.onChange = new EventEmitter();
        this.onClose = new EventEmitter();
        this.activeIndexChange = new EventEmitter();
        this.backwardIsDisabled = true;
        this.forwardIsDisabled = false;
    }
    ngAfterContentInit() {
        this.initTabs();
        this.tabChangesSubscription = this.tabPanels.changes.subscribe(_ => {
            this.initTabs();
        });
    }
    ngAfterViewChecked() {
        if (this.tabChanged) {
            this.updateInkBar();
            this.tabChanged = false;
        }
    }
    ngOnDestroy() {
        if (this.tabChangesSubscription) {
            this.tabChangesSubscription.unsubscribe();
        }
    }
    initTabs() {
        this.tabs = this.tabPanels.toArray();
        let selectedTab = this.findSelectedTab();
        if (!selectedTab && this.tabs.length) {
            if (this.activeIndex != null && this.tabs.length > this.activeIndex)
                this.tabs[this.activeIndex].selected = true;
            else
                this.tabs[0].selected = true;
            this.tabChanged = true;
        }
        this.cd.markForCheck();
    }
    open(event, tab) {
        if (tab.disabled) {
            if (event) {
                event.preventDefault();
            }
            return;
        }
        if (!tab.selected) {
            let selectedTab = this.findSelectedTab();
            if (selectedTab) {
                selectedTab.selected = false;
            }
            this.tabChanged = true;
            tab.selected = true;
            let selectedTabIndex = this.findTabIndex(tab);
            this.preventActiveIndexPropagation = true;
            this.activeIndexChange.emit(selectedTabIndex);
            this.onChange.emit({ originalEvent: event, index: selectedTabIndex });
            this.updateScrollBar(selectedTabIndex);
        }
        if (event) {
            event.preventDefault();
        }
    }
    close(event, tab) {
        if (this.controlClose) {
            this.onClose.emit({
                originalEvent: event,
                index: this.findTabIndex(tab),
                close: () => {
                    this.closeTab(tab);
                }
            });
        }
        else {
            this.closeTab(tab);
            this.onClose.emit({
                originalEvent: event,
                index: this.findTabIndex(tab)
            });
        }
        event.stopPropagation();
    }
    closeTab(tab) {
        if (tab.disabled) {
            return;
        }
        if (tab.selected) {
            this.tabChanged = true;
            tab.selected = false;
            for (let i = 0; i < this.tabs.length; i++) {
                let tabPanel = this.tabs[i];
                if (!tabPanel.closed && !tab.disabled) {
                    tabPanel.selected = true;
                    break;
                }
            }
        }
        tab.closed = true;
    }
    findSelectedTab() {
        for (let i = 0; i < this.tabs.length; i++) {
            if (this.tabs[i].selected) {
                return this.tabs[i];
            }
        }
        return null;
    }
    findTabIndex(tab) {
        let index = -1;
        for (let i = 0; i < this.tabs.length; i++) {
            if (this.tabs[i] == tab) {
                index = i;
                break;
            }
        }
        return index;
    }
    getBlockableElement() {
        return this.el.nativeElement.children[0];
    }
    get activeIndex() {
        return this._activeIndex;
    }
    set activeIndex(val) {
        this._activeIndex = val;
        if (this.preventActiveIndexPropagation) {
            this.preventActiveIndexPropagation = false;
            return;
        }
        if (this.tabs && this.tabs.length && this._activeIndex != null && this.tabs.length > this._activeIndex) {
            this.findSelectedTab().selected = false;
            this.tabs[this._activeIndex].selected = true;
            this.tabChanged = true;
            this.updateScrollBar(val);
        }
    }
    updateInkBar() {
        if (this.navbar) {
            const tabHeader = DomHandler.findSingle(this.navbar.nativeElement, 'li.p-highlight');
            if (!tabHeader) {
                return;
            }
            this.inkbar.nativeElement.style.width = DomHandler.getWidth(tabHeader) + 'px';
            this.inkbar.nativeElement.style.left = DomHandler.getOffset(tabHeader).left - DomHandler.getOffset(this.navbar.nativeElement).left + 'px';
        }
    }
    updateScrollBar(index) {
        let tabHeader = this.navbar.nativeElement.children[index];
        tabHeader.scrollIntoView({ block: 'nearest' });
    }
    updateButtonState() {
        const content = this.content.nativeElement;
        const { scrollLeft, scrollWidth } = content;
        const width = DomHandler.getWidth(content);
        this.backwardIsDisabled = scrollLeft === 0;
        this.forwardIsDisabled = parseInt(scrollLeft) === scrollWidth - width;
    }
    onScroll(event) {
        this.scrollable && this.updateButtonState();
        event.preventDefault();
    }
    getVisibleButtonWidths() {
        return [this.prevBtn?.nativeElement, this.nextBtn?.nativeElement].reduce((acc, el) => el ? acc + DomHandler.getWidth(el) : acc, 0);
    }
    navBackward() {
        const content = this.content.nativeElement;
        const width = DomHandler.getWidth(content) - this.getVisibleButtonWidths();
        const pos = content.scrollLeft - width;
        content.scrollLeft = pos <= 0 ? 0 : pos;
    }
    navForward() {
        const content = this.content.nativeElement;
        const width = DomHandler.getWidth(content) - this.getVisibleButtonWidths();
        const pos = content.scrollLeft + width;
        const lastPos = content.scrollWidth - width;
        content.scrollLeft = pos >= lastPos ? lastPos : pos;
    }
}
TabView.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: TabView, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
TabView.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.7", type: TabView, selector: "p-tabView", inputs: { orientation: "orientation", style: "style", styleClass: "styleClass", controlClose: "controlClose", scrollable: "scrollable", activeIndex: "activeIndex" }, outputs: { onChange: "onChange", onClose: "onClose", activeIndexChange: "activeIndexChange" }, host: { classAttribute: "p-element" }, queries: [{ propertyName: "tabPanels", predicate: TabPanel }], viewQueries: [{ propertyName: "content", first: true, predicate: ["content"], descendants: true }, { propertyName: "navbar", first: true, predicate: ["navbar"], descendants: true }, { propertyName: "prevBtn", first: true, predicate: ["prevBtn"], descendants: true }, { propertyName: "nextBtn", first: true, predicate: ["nextBtn"], descendants: true }, { propertyName: "inkbar", first: true, predicate: ["inkbar"], descendants: true }], ngImport: i0, template: `
        <div [ngClass]="{'p-tabview p-component': true, 'p-tabview-scrollable': scrollable}" [ngStyle]="style" [class]="styleClass">
            <div class="p-tabview-nav-container">
                <button *ngIf="scrollable && !backwardIsDisabled" #prevBtn class="p-tabview-nav-prev p-tabview-nav-btn p-link" (click)="navBackward()" type="button" pRipple>
                    <span class="pi pi-chevron-left"></span>
                </button>
                <div #content class="p-tabview-nav-content" (scroll)="onScroll($event)">
                    <ul #navbar class="p-tabview-nav" role="tablist">
                        <ng-template ngFor let-tab [ngForOf]="tabs">
                            <li role="presentation" [ngClass]="{'p-highlight': tab.selected, 'p-disabled': tab.disabled}" [ngStyle]="tab.headerStyle" [class]="tab.headerStyleClass" *ngIf="!tab.closed">
                                <a role="tab" class="p-tabview-nav-link" [attr.id]="tab.id + '-label'" [attr.aria-selected]="tab.selected" [attr.aria-controls]="tab.id" [pTooltip]="tab.tooltip" [tooltipPosition]="tab.tooltipPosition"
                                    [attr.aria-selected]="tab.selected" [positionStyle]="tab.tooltipPositionStyle" [tooltipStyleClass]="tab.tooltipStyleClass"
                                    (click)="open($event,tab)" (keydown.enter)="open($event,tab)" pRipple [attr.tabindex]="tab.disabled ? null : '0'">
                                    <ng-container *ngIf="!tab.headerTemplate">
                                        <span class="p-tabview-left-icon" [ngClass]="tab.leftIcon" *ngIf="tab.leftIcon"></span>
                                        <span class="p-tabview-title">{{tab.header}}</span>
                                        <span class="p-tabview-right-icon" [ngClass]="tab.rightIcon" *ngIf="tab.rightIcon"></span>
                                    </ng-container>
                                    <ng-container *ngTemplateOutlet="tab.headerTemplate"></ng-container>
                                    <span *ngIf="tab.closable" class="p-tabview-close pi pi-times" (click)="close($event,tab)"></span>
                                </a>
                            </li>
                        </ng-template>
                        <li #inkbar class="p-tabview-ink-bar"></li>
                    </ul>
                </div>
                <button *ngIf="scrollable && !forwardIsDisabled" #nextBtn class="p-tabview-nav-next p-tabview-nav-btn p-link" (click)="navForward()" type="button" pRipple>
                    <span class="pi pi-chevron-right"></span>
                </button>
            </div>
            <div class="p-tabview-panels">
                <ng-content></ng-content>
            </div>
        </div>
    `, isInline: true, styles: [".p-tabview-nav-container{position:relative}.p-tabview-scrollable .p-tabview-nav-container{overflow:hidden}.p-tabview-nav-content{overflow-x:auto;overflow-y:hidden;scroll-behavior:smooth;scrollbar-width:none;overscroll-behavior:contain auto}.p-tabview-nav{display:flex;margin:0;padding:0;list-style-type:none;flex:1 1 auto}.p-tabview-nav-link{cursor:pointer;-webkit-user-select:none;user-select:none;display:flex;align-items:center;position:relative;text-decoration:none;overflow:hidden}.p-tabview-ink-bar{display:none;z-index:1}.p-tabview-nav-link:focus{z-index:1}.p-tabview-title{line-height:1;white-space:nowrap}.p-tabview-nav-btn{position:absolute;top:0;z-index:2;height:100%;display:flex;align-items:center;justify-content:center}.p-tabview-nav-prev{left:0}.p-tabview-nav-next{right:0}.p-tabview-nav-content::-webkit-scrollbar{display:none}.p-tabview-close{z-index:1}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i2.Tooltip, selector: "[pTooltip]", inputs: ["tooltipPosition", "tooltipEvent", "appendTo", "positionStyle", "tooltipStyleClass", "tooltipZIndex", "escape", "showDelay", "hideDelay", "life", "positionTop", "positionLeft", "fitContent", "pTooltip", "tooltipDisabled", "tooltipOptions"] }, { kind: "directive", type: i3.Ripple, selector: "[pRipple]" }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: TabView, decorators: [{
            type: Component,
            args: [{ selector: 'p-tabView', template: `
        <div [ngClass]="{'p-tabview p-component': true, 'p-tabview-scrollable': scrollable}" [ngStyle]="style" [class]="styleClass">
            <div class="p-tabview-nav-container">
                <button *ngIf="scrollable && !backwardIsDisabled" #prevBtn class="p-tabview-nav-prev p-tabview-nav-btn p-link" (click)="navBackward()" type="button" pRipple>
                    <span class="pi pi-chevron-left"></span>
                </button>
                <div #content class="p-tabview-nav-content" (scroll)="onScroll($event)">
                    <ul #navbar class="p-tabview-nav" role="tablist">
                        <ng-template ngFor let-tab [ngForOf]="tabs">
                            <li role="presentation" [ngClass]="{'p-highlight': tab.selected, 'p-disabled': tab.disabled}" [ngStyle]="tab.headerStyle" [class]="tab.headerStyleClass" *ngIf="!tab.closed">
                                <a role="tab" class="p-tabview-nav-link" [attr.id]="tab.id + '-label'" [attr.aria-selected]="tab.selected" [attr.aria-controls]="tab.id" [pTooltip]="tab.tooltip" [tooltipPosition]="tab.tooltipPosition"
                                    [attr.aria-selected]="tab.selected" [positionStyle]="tab.tooltipPositionStyle" [tooltipStyleClass]="tab.tooltipStyleClass"
                                    (click)="open($event,tab)" (keydown.enter)="open($event,tab)" pRipple [attr.tabindex]="tab.disabled ? null : '0'">
                                    <ng-container *ngIf="!tab.headerTemplate">
                                        <span class="p-tabview-left-icon" [ngClass]="tab.leftIcon" *ngIf="tab.leftIcon"></span>
                                        <span class="p-tabview-title">{{tab.header}}</span>
                                        <span class="p-tabview-right-icon" [ngClass]="tab.rightIcon" *ngIf="tab.rightIcon"></span>
                                    </ng-container>
                                    <ng-container *ngTemplateOutlet="tab.headerTemplate"></ng-container>
                                    <span *ngIf="tab.closable" class="p-tabview-close pi pi-times" (click)="close($event,tab)"></span>
                                </a>
                            </li>
                        </ng-template>
                        <li #inkbar class="p-tabview-ink-bar"></li>
                    </ul>
                </div>
                <button *ngIf="scrollable && !forwardIsDisabled" #nextBtn class="p-tabview-nav-next p-tabview-nav-btn p-link" (click)="navForward()" type="button" pRipple>
                    <span class="pi pi-chevron-right"></span>
                </button>
            </div>
            <div class="p-tabview-panels">
                <ng-content></ng-content>
            </div>
        </div>
    `, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        'class': 'p-element'
                    }, styles: [".p-tabview-nav-container{position:relative}.p-tabview-scrollable .p-tabview-nav-container{overflow:hidden}.p-tabview-nav-content{overflow-x:auto;overflow-y:hidden;scroll-behavior:smooth;scrollbar-width:none;overscroll-behavior:contain auto}.p-tabview-nav{display:flex;margin:0;padding:0;list-style-type:none;flex:1 1 auto}.p-tabview-nav-link{cursor:pointer;-webkit-user-select:none;user-select:none;display:flex;align-items:center;position:relative;text-decoration:none;overflow:hidden}.p-tabview-ink-bar{display:none;z-index:1}.p-tabview-nav-link:focus{z-index:1}.p-tabview-title{line-height:1;white-space:nowrap}.p-tabview-nav-btn{position:absolute;top:0;z-index:2;height:100%;display:flex;align-items:center;justify-content:center}.p-tabview-nav-prev{left:0}.p-tabview-nav-next{right:0}.p-tabview-nav-content::-webkit-scrollbar{display:none}.p-tabview-close{z-index:1}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { orientation: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], controlClose: [{
                type: Input
            }], scrollable: [{
                type: Input
            }], content: [{
                type: ViewChild,
                args: ['content']
            }], navbar: [{
                type: ViewChild,
                args: ['navbar']
            }], prevBtn: [{
                type: ViewChild,
                args: ['prevBtn']
            }], nextBtn: [{
                type: ViewChild,
                args: ['nextBtn']
            }], inkbar: [{
                type: ViewChild,
                args: ['inkbar']
            }], tabPanels: [{
                type: ContentChildren,
                args: [TabPanel]
            }], onChange: [{
                type: Output
            }], onClose: [{
                type: Output
            }], activeIndexChange: [{
                type: Output
            }], activeIndex: [{
                type: Input
            }] } });
export class TabViewModule {
}
TabViewModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: TabViewModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
TabViewModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.7", ngImport: i0, type: TabViewModule, declarations: [TabView, TabPanel], imports: [CommonModule, SharedModule, TooltipModule, RippleModule], exports: [TabView, TabPanel, SharedModule] });
TabViewModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: TabViewModule, imports: [CommonModule, SharedModule, TooltipModule, RippleModule, SharedModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: TabViewModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, SharedModule, TooltipModule, RippleModule],
                    exports: [TabView, TabPanel, SharedModule],
                    declarations: [TabView, TabPanel]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFidmlldy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy90YWJ2aWV3L3RhYnZpZXcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQXNCLEtBQUssRUFBQyxNQUFNLEVBQUMsWUFBWSxFQUNqRSxlQUFlLEVBQTBFLHVCQUF1QixFQUFFLGlCQUFpQixFQUFFLFNBQVMsRUFBb0IsVUFBVSxFQUFFLE1BQU0sRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNuTixPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzlDLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUM1QyxPQUFPLEVBQUMsWUFBWSxFQUFDLGFBQWEsRUFBYSxNQUFNLGFBQWEsQ0FBQztBQUNuRSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sYUFBYSxDQUFDOzs7OztBQUd2QyxJQUFJLEdBQUcsR0FBVyxDQUFDLENBQUM7QUFpQnBCLE1BQU0sT0FBTyxRQUFRO0lBNENqQixZQUErQyxPQUFPLEVBQVMsYUFBK0IsRUFBUyxFQUFxQjtRQUE3RCxrQkFBYSxHQUFiLGFBQWEsQ0FBa0I7UUFBUyxPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQXBDbkgsVUFBSyxHQUFZLElBQUksQ0FBQztRQUl0QixvQkFBZSxHQUFXLEtBQUssQ0FBQztRQUVoQyx5QkFBb0IsR0FBVyxVQUFVLENBQUM7UUFzQm5ELE9BQUUsR0FBVyxjQUFjLEdBQUcsRUFBRSxFQUFFLENBQUM7UUFTL0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFrQixDQUFDO0lBQ3RDLENBQUM7SUFFRCxrQkFBa0I7UUFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1lBQzVCLFFBQU8sSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFO2dCQUNuQixLQUFLLFFBQVE7b0JBQ1QsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO29CQUN4QyxNQUFNO2dCQUVOLEtBQUssU0FBUztvQkFDVixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7b0JBQ3pDLE1BQU07Z0JBRU47b0JBQ0ksSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO29CQUN6QyxNQUFNO2FBQ1Q7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxJQUFhLFFBQVE7UUFDakIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQzFCLENBQUM7SUFFRCxJQUFJLFFBQVEsQ0FBQyxHQUFZO1FBQ3JCLElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO1FBRXJCLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2QsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztTQUMzQjtRQUVELElBQUksR0FBRztZQUNILElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0lBQzNCLENBQUM7SUFFRCxJQUFhLFFBQVE7UUFDakIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQzFCLENBQUM7SUFBQSxDQUFDO0lBRUYsSUFBSSxRQUFRLENBQUMsUUFBaUI7UUFDMUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7UUFDMUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDbkMsQ0FBQztJQUVELElBQWEsTUFBTTtRQUNmLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN4QixDQUFDO0lBRUQsSUFBSSxNQUFNLENBQUMsTUFBYztRQUNyQixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUV0Qiw0RkFBNEY7UUFDNUYsbUdBQW1HO1FBQ25HLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ3hCLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDNUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDbkMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsSUFBYSxRQUFRO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUMxQixDQUFDO0lBRUQsSUFBSSxRQUFRLENBQUMsUUFBZ0I7UUFDekIsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7UUFDMUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDbkMsQ0FBQztJQUVELElBQWEsU0FBUztRQUNsQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDM0IsQ0FBQztJQUVELElBQUksU0FBUyxDQUFDLFNBQWlCO1FBQzNCLElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO1FBQzVCLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ25DLENBQUM7SUFFRCxXQUFXO1FBQ1AsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDckIsQ0FBQzs7cUdBN0hRLFFBQVEsa0JBNENHLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7eUZBNUNwQyxRQUFRLGllQWtCQSxhQUFhLDZCQS9CcEI7Ozs7Ozs7O0tBUVQ7MkZBS1EsUUFBUTtrQkFmcEIsU0FBUzttQkFBQztvQkFDUCxRQUFRLEVBQUUsWUFBWTtvQkFDdEIsUUFBUSxFQUFFOzs7Ozs7OztLQVFUO29CQUNELElBQUksRUFBRTt3QkFDRixPQUFPLEVBQUUsV0FBVztxQkFDdkI7aUJBQ0o7OzBCQTZDZ0IsTUFBTTsyQkFBQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDOzJHQTFDcEMsUUFBUTtzQkFBaEIsS0FBSztnQkFFRyxXQUFXO3NCQUFuQixLQUFLO2dCQUVHLGdCQUFnQjtzQkFBeEIsS0FBSztnQkFFRyxLQUFLO3NCQUFiLEtBQUs7Z0JBRUcsT0FBTztzQkFBZixLQUFLO2dCQUVHLGVBQWU7c0JBQXZCLEtBQUs7Z0JBRUcsb0JBQW9CO3NCQUE1QixLQUFLO2dCQUVHLGlCQUFpQjtzQkFBekIsS0FBSztnQkFFMEIsU0FBUztzQkFBeEMsZUFBZTt1QkFBQyxhQUFhO2dCQWdEakIsUUFBUTtzQkFBcEIsS0FBSztnQkFlTyxRQUFRO3NCQUFwQixLQUFLO2dCQVNPLE1BQU07c0JBQWxCLEtBQUs7Z0JBZU8sUUFBUTtzQkFBcEIsS0FBSztnQkFTTyxTQUFTO3NCQUFyQixLQUFLOztBQTBEVixNQUFNLE9BQU8sT0FBTztJQThDaEIsWUFBbUIsRUFBYyxFQUFTLEVBQXFCO1FBQTVDLE9BQUUsR0FBRixFQUFFLENBQVk7UUFBUyxPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQTVDdEQsZ0JBQVcsR0FBVyxLQUFLLENBQUM7UUFzQjNCLGFBQVEsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUVqRCxZQUFPLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFFaEQsc0JBQWlCLEdBQXlCLElBQUksWUFBWSxFQUFFLENBQUM7UUFZdkUsdUJBQWtCLEdBQVksSUFBSSxDQUFDO1FBRW5DLHNCQUFpQixHQUFZLEtBQUssQ0FBQztJQUkrQixDQUFDO0lBRW5FLGtCQUFrQjtRQUNkLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUVoQixJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQy9ELElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNwQixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxrQkFBa0I7UUFDZCxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDakIsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3BCLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1NBQzNCO0lBQ0wsQ0FBQztJQUVELFdBQVc7UUFDUCxJQUFJLElBQUksQ0FBQyxzQkFBc0IsRUFBRTtZQUM3QixJQUFJLENBQUMsc0JBQXNCLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDN0M7SUFDTCxDQUFDO0lBRUQsUUFBUTtRQUNKLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNyQyxJQUFJLFdBQVcsR0FBYSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDbkQsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNsQyxJQUFJLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXO2dCQUMvRCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDOztnQkFFNUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1lBRWpDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1NBQzFCO1FBRUQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRUQsSUFBSSxDQUFDLEtBQVksRUFBRSxHQUFhO1FBQzVCLElBQUksR0FBRyxDQUFDLFFBQVEsRUFBRTtZQUNkLElBQUksS0FBSyxFQUFFO2dCQUNQLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQzthQUMxQjtZQUNELE9BQU87U0FDVjtRQUVELElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFO1lBQ2YsSUFBSSxXQUFXLEdBQWEsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQ25ELElBQUksV0FBVyxFQUFFO2dCQUNiLFdBQVcsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFBO2FBQy9CO1lBRUQsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7WUFDdkIsR0FBRyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7WUFDcEIsSUFBSSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzlDLElBQUksQ0FBQyw2QkFBNkIsR0FBRyxJQUFJLENBQUM7WUFDMUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQzlDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUMsYUFBYSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsZ0JBQWdCLEVBQUMsQ0FBQyxDQUFDO1lBRXBFLElBQUksQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztTQUMxQztRQUVELElBQUksS0FBSyxFQUFFO1lBQ1AsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1NBQzFCO0lBQ0wsQ0FBQztJQUVELEtBQUssQ0FBQyxLQUFZLEVBQUUsR0FBYTtRQUM3QixJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDbkIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7Z0JBQ2QsYUFBYSxFQUFFLEtBQUs7Z0JBQ3BCLEtBQUssRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQztnQkFDN0IsS0FBSyxFQUFFLEdBQUcsRUFBRTtvQkFDUixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUN2QixDQUFDO2FBQUMsQ0FDTCxDQUFDO1NBQ0w7YUFDSTtZQUNELElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbkIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7Z0JBQ2QsYUFBYSxFQUFFLEtBQUs7Z0JBQ3BCLEtBQUssRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQzthQUNoQyxDQUFDLENBQUM7U0FDTjtRQUVELEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUM1QixDQUFDO0lBRUQsUUFBUSxDQUFDLEdBQWE7UUFDbEIsSUFBSSxHQUFHLENBQUMsUUFBUSxFQUFFO1lBQ2QsT0FBTztTQUNWO1FBQ0QsSUFBSSxHQUFHLENBQUMsUUFBUSxFQUFFO1lBQ2QsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7WUFDdkIsR0FBRyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7WUFDckIsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUN0QyxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM1QixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sSUFBRSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUU7b0JBQ2pDLFFBQVEsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO29CQUN6QixNQUFNO2lCQUNUO2FBQ0o7U0FDSjtRQUVELEdBQUcsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0lBQ3RCLENBQUM7SUFFRCxlQUFlO1FBQ1gsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3RDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUU7Z0JBQ3ZCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN2QjtTQUNKO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVELFlBQVksQ0FBQyxHQUFhO1FBQ3RCLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2YsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3RDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLEVBQUU7Z0JBQ3JCLEtBQUssR0FBRyxDQUFDLENBQUM7Z0JBQ1YsTUFBTTthQUNUO1NBQ0o7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRUQsbUJBQW1CO1FBQ2YsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVELElBQWEsV0FBVztRQUNwQixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDN0IsQ0FBQztJQUVELElBQUksV0FBVyxDQUFDLEdBQVU7UUFDdEIsSUFBSSxDQUFDLFlBQVksR0FBRyxHQUFHLENBQUM7UUFDeEIsSUFBSSxJQUFJLENBQUMsNkJBQTZCLEVBQUU7WUFDcEMsSUFBSSxDQUFDLDZCQUE2QixHQUFHLEtBQUssQ0FBQztZQUMzQyxPQUFPO1NBQ1Y7UUFFRCxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNwRyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztZQUN4QyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1lBQzdDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1lBRXZCLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDN0I7SUFDTCxDQUFDO0lBRUQsWUFBWTtRQUNSLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNiLE1BQU0sU0FBUyxHQUF1QixVQUFVLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLGdCQUFnQixDQUFDLENBQUM7WUFFekcsSUFBSSxDQUFDLFNBQVMsRUFBRTtnQkFDWixPQUFPO2FBQ1Y7WUFFRCxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQzlFLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUksVUFBVSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7U0FDOUk7SUFDTCxDQUFDO0lBRUQsZUFBZSxDQUFDLEtBQUs7UUFDakIsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzFELFNBQVMsQ0FBQyxjQUFjLENBQUMsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQTtJQUNsRCxDQUFDO0lBRUQsaUJBQWlCO1FBQ2IsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7UUFDM0MsTUFBTSxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsR0FBRyxPQUFPLENBQUM7UUFDNUMsTUFBTSxLQUFLLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUUzQyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsVUFBVSxLQUFLLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQyxLQUFLLFdBQVcsR0FBRyxLQUFLLENBQUM7SUFDMUUsQ0FBQztJQUVELFFBQVEsQ0FBQyxLQUFLO1FBQ1YsSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUU1QyxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUVELHNCQUFzQjtRQUNsQixPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxhQUFhLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDdkksQ0FBQztJQUVELFdBQVc7UUFDUCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQztRQUMzQyxNQUFNLEtBQUssR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1FBQzNFLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1FBQ3ZDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDNUMsQ0FBQztJQUVELFVBQVU7UUFDTixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQztRQUMzQyxNQUFNLEtBQUssR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1FBQzNFLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1FBQ3ZDLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1FBRTVDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsR0FBRyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDeEQsQ0FBQzs7b0dBeFBRLE9BQU87d0ZBQVAsT0FBTyx1WEFzQkMsUUFBUSxpZEFoRWY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7S0FrQ1Q7MkZBUVEsT0FBTztrQkE1Q25CLFNBQVM7K0JBQ0ksV0FBVyxZQUNYOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0tBa0NULG1CQUNlLHVCQUF1QixDQUFDLE1BQU0saUJBQ2hDLGlCQUFpQixDQUFDLElBQUksUUFFL0I7d0JBQ0wsT0FBTyxFQUFFLFdBQVc7cUJBQ3ZCO2lJQUlZLFdBQVc7c0JBQW5CLEtBQUs7Z0JBRUcsS0FBSztzQkFBYixLQUFLO2dCQUVHLFVBQVU7c0JBQWxCLEtBQUs7Z0JBRUcsWUFBWTtzQkFBcEIsS0FBSztnQkFFRyxVQUFVO3NCQUFsQixLQUFLO2dCQUVnQixPQUFPO3NCQUE1QixTQUFTO3VCQUFDLFNBQVM7Z0JBRUMsTUFBTTtzQkFBMUIsU0FBUzt1QkFBQyxRQUFRO2dCQUVHLE9BQU87c0JBQTVCLFNBQVM7dUJBQUMsU0FBUztnQkFFRSxPQUFPO3NCQUE1QixTQUFTO3VCQUFDLFNBQVM7Z0JBRUMsTUFBTTtzQkFBMUIsU0FBUzt1QkFBQyxRQUFRO2dCQUVRLFNBQVM7c0JBQW5DLGVBQWU7dUJBQUMsUUFBUTtnQkFFZixRQUFRO3NCQUFqQixNQUFNO2dCQUVHLE9BQU87c0JBQWhCLE1BQU07Z0JBRUcsaUJBQWlCO3NCQUExQixNQUFNO2dCQXFKTSxXQUFXO3NCQUF2QixLQUFLOztBQWdGVixNQUFNLE9BQU8sYUFBYTs7MEdBQWIsYUFBYTsyR0FBYixhQUFhLGlCQWpRYixPQUFPLEVBNUtQLFFBQVEsYUF5YVAsWUFBWSxFQUFDLFlBQVksRUFBQyxhQUFhLEVBQUMsWUFBWSxhQTdQckQsT0FBTyxFQTVLUCxRQUFRLEVBMGFVLFlBQVk7MkdBRzlCLGFBQWEsWUFKWixZQUFZLEVBQUMsWUFBWSxFQUFDLGFBQWEsRUFBQyxZQUFZLEVBQ25DLFlBQVk7MkZBRzlCLGFBQWE7a0JBTHpCLFFBQVE7bUJBQUM7b0JBQ04sT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFDLFlBQVksRUFBQyxhQUFhLEVBQUMsWUFBWSxDQUFDO29CQUMvRCxPQUFPLEVBQUUsQ0FBQyxPQUFPLEVBQUMsUUFBUSxFQUFDLFlBQVksQ0FBQztvQkFDeEMsWUFBWSxFQUFFLENBQUMsT0FBTyxFQUFDLFFBQVEsQ0FBQztpQkFDbkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge05nTW9kdWxlLENvbXBvbmVudCxFbGVtZW50UmVmLE9uRGVzdHJveSxJbnB1dCxPdXRwdXQsRXZlbnRFbWl0dGVyLEFmdGVyQ29udGVudEluaXQsXG4gICAgICAgIENvbnRlbnRDaGlsZHJlbixRdWVyeUxpc3QsVGVtcGxhdGVSZWYsRW1iZWRkZWRWaWV3UmVmLFZpZXdDb250YWluZXJSZWYsQ2hhbmdlRGV0ZWN0b3JSZWYsQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIFZpZXdFbmNhcHN1bGF0aW9uLCBWaWV3Q2hpbGQsIEFmdGVyVmlld0NoZWNrZWQsIGZvcndhcmRSZWYsIEluamVjdH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7VG9vbHRpcE1vZHVsZX0gZnJvbSAncHJpbWVuZy90b29sdGlwJztcbmltcG9ydCB7UmlwcGxlTW9kdWxlfSBmcm9tICdwcmltZW5nL3JpcHBsZSc7XG5pbXBvcnQge1NoYXJlZE1vZHVsZSxQcmltZVRlbXBsYXRlLEJsb2NrYWJsZVVJfSBmcm9tICdwcmltZW5nL2FwaSc7XG5pbXBvcnQge0RvbUhhbmRsZXJ9IGZyb20gJ3ByaW1lbmcvZG9tJztcbmltcG9ydCB7U3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcblxubGV0IGlkeDogbnVtYmVyID0gMDtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdwLXRhYlBhbmVsJyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8ZGl2IFthdHRyLmlkXT1cImlkXCIgY2xhc3M9XCJwLXRhYnZpZXctcGFuZWxcIiBbaGlkZGVuXT1cIiFzZWxlY3RlZFwiXG4gICAgICAgICAgICByb2xlPVwidGFicGFuZWxcIiBbYXR0ci5hcmlhLWhpZGRlbl09XCIhc2VsZWN0ZWRcIiBbYXR0ci5hcmlhLWxhYmVsbGVkYnldPVwiaWQgKyAnLWxhYmVsJ1wiICpuZ0lmPVwiIWNsb3NlZFwiPlxuICAgICAgICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImNvbnRlbnRUZW1wbGF0ZSAmJiAoY2FjaGUgPyBsb2FkZWQgOiBzZWxlY3RlZClcIj5cbiAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiY29udGVudFRlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPC9kaXY+XG4gICAgYCxcbiAgICBob3N0OiB7XG4gICAgICAgICdjbGFzcyc6ICdwLWVsZW1lbnQnXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBUYWJQYW5lbCBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsT25EZXN0cm95IHtcblxuICAgIEBJbnB1dCgpIGNsb3NhYmxlOiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgaGVhZGVyU3R5bGU6IGFueTtcblxuICAgIEBJbnB1dCgpIGhlYWRlclN0eWxlQ2xhc3M6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGNhY2hlOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIEBJbnB1dCgpIHRvb2x0aXA6IGFueTtcblxuICAgIEBJbnB1dCgpIHRvb2x0aXBQb3NpdGlvbjogc3RyaW5nID0gJ3RvcCc7XG5cbiAgICBASW5wdXQoKSB0b29sdGlwUG9zaXRpb25TdHlsZTogc3RyaW5nID0gJ2Fic29sdXRlJztcblxuICAgIEBJbnB1dCgpIHRvb2x0aXBTdHlsZUNsYXNzOiBzdHJpbmc7XG5cbiAgICBAQ29udGVudENoaWxkcmVuKFByaW1lVGVtcGxhdGUpIHRlbXBsYXRlczogUXVlcnlMaXN0PGFueT47XG5cbiAgICBjbG9zZWQ6IGJvb2xlYW47XG5cbiAgICB2aWV3OiBFbWJlZGRlZFZpZXdSZWY8YW55PjtcblxuICAgIF9zZWxlY3RlZDogYm9vbGVhbjtcblxuICAgIF9kaXNhYmxlZDogYm9vbGVhbjtcblxuICAgIF9oZWFkZXI6IHN0cmluZztcblxuICAgIF9sZWZ0SWNvbjogc3RyaW5nO1xuXG4gICAgX3JpZ2h0SWNvbjogc3RyaW5nO1xuXG4gICAgbG9hZGVkOiBib29sZWFuO1xuXG4gICAgaWQ6IHN0cmluZyA9IGBwLXRhYnBhbmVsLSR7aWR4Kyt9YDtcblxuICAgIGNvbnRlbnRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIGhlYWRlclRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgdGFiVmlldzogVGFiVmlldztcblxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBUYWJWaWV3KSkgdGFiVmlldywgcHVibGljIHZpZXdDb250YWluZXI6IFZpZXdDb250YWluZXJSZWYsIHB1YmxpYyBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcbiAgICAgICAgdGhpcy50YWJWaWV3ID0gdGFiVmlldyBhcyBUYWJWaWV3O1xuICAgIH1cblxuICAgIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgc3dpdGNoKGl0ZW0uZ2V0VHlwZSgpKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnaGVhZGVyJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oZWFkZXJUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdjb250ZW50JzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50VGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50VGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgc2VsZWN0ZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZDtcbiAgICB9XG5cbiAgICBzZXQgc2VsZWN0ZWQodmFsOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX3NlbGVjdGVkID0gdmFsO1xuXG4gICAgICAgIGlmICghdGhpcy5sb2FkZWQpIHtcbiAgICAgICAgICAgIHRoaXMuY2QuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHZhbClcbiAgICAgICAgICAgIHRoaXMubG9hZGVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kaXNhYmxlZDtcbiAgICB9O1xuXG4gICAgc2V0IGRpc2FibGVkKGRpc2FibGVkOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX2Rpc2FibGVkID0gZGlzYWJsZWQ7XG4gICAgICAgIHRoaXMudGFiVmlldy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgaGVhZGVyKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9oZWFkZXI7XG4gICAgfVxuXG4gICAgc2V0IGhlYWRlcihoZWFkZXI6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9oZWFkZXIgPSBoZWFkZXI7XG5cbiAgICAgICAgLy8gV2UgaGF2ZSB0byB3YWl0IGZvciB0aGUgcmVuZGVyaW5nIGFuZCB0aGVuIHJldHJpZXZlIHRoZSBhY3R1YWwgc2l6ZSBlbGVtZW50IGZyb20gdGhlIERPTS5cbiAgICAgICAgLy8gaW4gZnV0dXJlIGBQcm9taXNlLnJlc29sdmVgIGNhbiBiZSBjaGFuZ2VkIHRvIGBxdWV1ZU1pY3JvdGFza2AgKGlmIGllMTEgc3VwcG9ydCB3aWxsIGJlIGRyb3BwZWQpXG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy50YWJWaWV3LnVwZGF0ZUlua0JhcigpO1xuICAgICAgICAgICAgdGhpcy50YWJWaWV3LmNkLm1hcmtGb3JDaGVjaygpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgbGVmdEljb24oKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xlZnRJY29uO1xuICAgIH1cblxuICAgIHNldCBsZWZ0SWNvbihsZWZ0SWNvbiA6c3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX2xlZnRJY29uID0gbGVmdEljb247XG4gICAgICAgIHRoaXMudGFiVmlldy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgcmlnaHRJY29uKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yaWdodEljb247XG4gICAgfVxuXG4gICAgc2V0IHJpZ2h0SWNvbihyaWdodEljb24gOnN0cmluZykge1xuICAgICAgICB0aGlzLl9yaWdodEljb24gPSByaWdodEljb247XG4gICAgICAgIHRoaXMudGFiVmlldy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy52aWV3ID0gbnVsbDtcbiAgICB9XG59XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC10YWJWaWV3JyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8ZGl2IFtuZ0NsYXNzXT1cInsncC10YWJ2aWV3IHAtY29tcG9uZW50JzogdHJ1ZSwgJ3AtdGFidmlldy1zY3JvbGxhYmxlJzogc2Nyb2xsYWJsZX1cIiBbbmdTdHlsZV09XCJzdHlsZVwiIFtjbGFzc109XCJzdHlsZUNsYXNzXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC10YWJ2aWV3LW5hdi1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uICpuZ0lmPVwic2Nyb2xsYWJsZSAmJiAhYmFja3dhcmRJc0Rpc2FibGVkXCIgI3ByZXZCdG4gY2xhc3M9XCJwLXRhYnZpZXctbmF2LXByZXYgcC10YWJ2aWV3LW5hdi1idG4gcC1saW5rXCIgKGNsaWNrKT1cIm5hdkJhY2t3YXJkKClcIiB0eXBlPVwiYnV0dG9uXCIgcFJpcHBsZT5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwaSBwaS1jaGV2cm9uLWxlZnRcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPGRpdiAjY29udGVudCBjbGFzcz1cInAtdGFidmlldy1uYXYtY29udGVudFwiIChzY3JvbGwpPVwib25TY3JvbGwoJGV2ZW50KVwiPlxuICAgICAgICAgICAgICAgICAgICA8dWwgI25hdmJhciBjbGFzcz1cInAtdGFidmlldy1uYXZcIiByb2xlPVwidGFibGlzdFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlIG5nRm9yIGxldC10YWIgW25nRm9yT2ZdPVwidGFic1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaSByb2xlPVwicHJlc2VudGF0aW9uXCIgW25nQ2xhc3NdPVwieydwLWhpZ2hsaWdodCc6IHRhYi5zZWxlY3RlZCwgJ3AtZGlzYWJsZWQnOiB0YWIuZGlzYWJsZWR9XCIgW25nU3R5bGVdPVwidGFiLmhlYWRlclN0eWxlXCIgW2NsYXNzXT1cInRhYi5oZWFkZXJTdHlsZUNsYXNzXCIgKm5nSWY9XCIhdGFiLmNsb3NlZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSByb2xlPVwidGFiXCIgY2xhc3M9XCJwLXRhYnZpZXctbmF2LWxpbmtcIiBbYXR0ci5pZF09XCJ0YWIuaWQgKyAnLWxhYmVsJ1wiIFthdHRyLmFyaWEtc2VsZWN0ZWRdPVwidGFiLnNlbGVjdGVkXCIgW2F0dHIuYXJpYS1jb250cm9sc109XCJ0YWIuaWRcIiBbcFRvb2x0aXBdPVwidGFiLnRvb2x0aXBcIiBbdG9vbHRpcFBvc2l0aW9uXT1cInRhYi50b29sdGlwUG9zaXRpb25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW2F0dHIuYXJpYS1zZWxlY3RlZF09XCJ0YWIuc2VsZWN0ZWRcIiBbcG9zaXRpb25TdHlsZV09XCJ0YWIudG9vbHRpcFBvc2l0aW9uU3R5bGVcIiBbdG9vbHRpcFN0eWxlQ2xhc3NdPVwidGFiLnRvb2x0aXBTdHlsZUNsYXNzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChjbGljayk9XCJvcGVuKCRldmVudCx0YWIpXCIgKGtleWRvd24uZW50ZXIpPVwib3BlbigkZXZlbnQsdGFiKVwiIHBSaXBwbGUgW2F0dHIudGFiaW5kZXhdPVwidGFiLmRpc2FibGVkID8gbnVsbCA6ICcwJ1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIiF0YWIuaGVhZGVyVGVtcGxhdGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtdGFidmlldy1sZWZ0LWljb25cIiBbbmdDbGFzc109XCJ0YWIubGVmdEljb25cIiAqbmdJZj1cInRhYi5sZWZ0SWNvblwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtdGFidmlldy10aXRsZVwiPnt7dGFiLmhlYWRlcn19PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC10YWJ2aWV3LXJpZ2h0LWljb25cIiBbbmdDbGFzc109XCJ0YWIucmlnaHRJY29uXCIgKm5nSWY9XCJ0YWIucmlnaHRJY29uXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwidGFiLmhlYWRlclRlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiAqbmdJZj1cInRhYi5jbG9zYWJsZVwiIGNsYXNzPVwicC10YWJ2aWV3LWNsb3NlIHBpIHBpLXRpbWVzXCIgKGNsaWNrKT1cImNsb3NlKCRldmVudCx0YWIpXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGkgI2lua2JhciBjbGFzcz1cInAtdGFidmlldy1pbmstYmFyXCI+PC9saT5cbiAgICAgICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uICpuZ0lmPVwic2Nyb2xsYWJsZSAmJiAhZm9yd2FyZElzRGlzYWJsZWRcIiAjbmV4dEJ0biBjbGFzcz1cInAtdGFidmlldy1uYXYtbmV4dCBwLXRhYnZpZXctbmF2LWJ0biBwLWxpbmtcIiAoY2xpY2spPVwibmF2Rm9yd2FyZCgpXCIgdHlwZT1cImJ1dHRvblwiIHBSaXBwbGU+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicGkgcGktY2hldnJvbi1yaWdodFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtdGFidmlldy1wYW5lbHNcIj5cbiAgICAgICAgICAgICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgYCxcbiAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgIHN0eWxlVXJsczogWycuL3RhYnZpZXcuY3NzJ10sXG4gICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ3AtZWxlbWVudCdcbn1cbn0pXG5leHBvcnQgY2xhc3MgVGFiVmlldyBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsQWZ0ZXJWaWV3Q2hlY2tlZCxPbkRlc3Ryb3ksQmxvY2thYmxlVUkge1xuXG4gICAgQElucHV0KCkgb3JpZW50YXRpb246IHN0cmluZyA9ICd0b3AnO1xuXG4gICAgQElucHV0KCkgc3R5bGU6IGFueTtcblxuICAgIEBJbnB1dCgpIHN0eWxlQ2xhc3M6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGNvbnRyb2xDbG9zZTogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIHNjcm9sbGFibGU6IGJvb2xlYW47XG5cbiAgICBAVmlld0NoaWxkKCdjb250ZW50JykgY29udGVudDogRWxlbWVudFJlZjtcblxuICAgIEBWaWV3Q2hpbGQoJ25hdmJhcicpIG5hdmJhcjogRWxlbWVudFJlZjtcblxuICAgIEBWaWV3Q2hpbGQoJ3ByZXZCdG4nKSBwcmV2QnRuOiBFbGVtZW50UmVmO1xuXG4gICAgQFZpZXdDaGlsZCgnbmV4dEJ0bicpIG5leHRCdG46IEVsZW1lbnRSZWY7XG5cbiAgICBAVmlld0NoaWxkKCdpbmtiYXInKSBpbmtiYXI6IEVsZW1lbnRSZWY7XG5cbiAgICBAQ29udGVudENoaWxkcmVuKFRhYlBhbmVsKSB0YWJQYW5lbHM6IFF1ZXJ5TGlzdDxUYWJQYW5lbD47XG5cbiAgICBAT3V0cHV0KCkgb25DaGFuZ2U6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uQ2xvc2U6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIGFjdGl2ZUluZGV4Q2hhbmdlOiBFdmVudEVtaXR0ZXI8bnVtYmVyPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIGluaXRpYWxpemVkOiBib29sZWFuO1xuXG4gICAgdGFiczogVGFiUGFuZWxbXTtcblxuICAgIF9hY3RpdmVJbmRleDogbnVtYmVyO1xuXG4gICAgcHJldmVudEFjdGl2ZUluZGV4UHJvcGFnYXRpb246IGJvb2xlYW47XG5cbiAgICB0YWJDaGFuZ2VkOiBib29sZWFuO1xuXG4gICAgYmFja3dhcmRJc0Rpc2FibGVkOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIGZvcndhcmRJc0Rpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG4gICAgXG4gICAgcHJpdmF0ZSB0YWJDaGFuZ2VzU3Vic2NyaXB0aW9uITogU3Vic2NyaXB0aW9uO1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIGVsOiBFbGVtZW50UmVmLCBwdWJsaWMgY2Q6IENoYW5nZURldGVjdG9yUmVmKSB7fVxuXG4gICAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgICAgICB0aGlzLmluaXRUYWJzKCk7XG5cbiAgICAgICAgdGhpcy50YWJDaGFuZ2VzU3Vic2NyaXB0aW9uID0gdGhpcy50YWJQYW5lbHMuY2hhbmdlcy5zdWJzY3JpYmUoXyA9PiB7XG4gICAgICAgICAgICB0aGlzLmluaXRUYWJzKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG5nQWZ0ZXJWaWV3Q2hlY2tlZCgpIHtcbiAgICAgICAgaWYgKHRoaXMudGFiQ2hhbmdlZCkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVJbmtCYXIoKTtcbiAgICAgICAgICAgIHRoaXMudGFiQ2hhbmdlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnRhYkNoYW5nZXNTdWJzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIHRoaXMudGFiQ2hhbmdlc1N1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaW5pdFRhYnMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMudGFicyA9IHRoaXMudGFiUGFuZWxzLnRvQXJyYXkoKTtcbiAgICAgICAgbGV0IHNlbGVjdGVkVGFiOiBUYWJQYW5lbCA9IHRoaXMuZmluZFNlbGVjdGVkVGFiKCk7XG4gICAgICAgIGlmICghc2VsZWN0ZWRUYWIgJiYgdGhpcy50YWJzLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuYWN0aXZlSW5kZXggIT0gbnVsbCAmJiB0aGlzLnRhYnMubGVuZ3RoID4gdGhpcy5hY3RpdmVJbmRleClcbiAgICAgICAgICAgICAgICB0aGlzLnRhYnNbdGhpcy5hY3RpdmVJbmRleF0uc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRoaXMudGFic1swXS5zZWxlY3RlZCA9IHRydWU7XG5cbiAgICAgICAgICAgIHRoaXMudGFiQ2hhbmdlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cblxuICAgIG9wZW4oZXZlbnQ6IEV2ZW50LCB0YWI6IFRhYlBhbmVsKSB7XG4gICAgICAgIGlmICh0YWIuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIGlmIChldmVudCkge1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRhYi5zZWxlY3RlZCkge1xuICAgICAgICAgICAgbGV0IHNlbGVjdGVkVGFiOiBUYWJQYW5lbCA9IHRoaXMuZmluZFNlbGVjdGVkVGFiKCk7XG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWRUYWIpIHtcbiAgICAgICAgICAgICAgICBzZWxlY3RlZFRhYi5zZWxlY3RlZCA9IGZhbHNlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMudGFiQ2hhbmdlZCA9IHRydWU7XG4gICAgICAgICAgICB0YWIuc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgbGV0IHNlbGVjdGVkVGFiSW5kZXggPSB0aGlzLmZpbmRUYWJJbmRleCh0YWIpO1xuICAgICAgICAgICAgdGhpcy5wcmV2ZW50QWN0aXZlSW5kZXhQcm9wYWdhdGlvbiA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZUluZGV4Q2hhbmdlLmVtaXQoc2VsZWN0ZWRUYWJJbmRleCk7XG4gICAgICAgICAgICB0aGlzLm9uQ2hhbmdlLmVtaXQoe29yaWdpbmFsRXZlbnQ6IGV2ZW50LCBpbmRleDogc2VsZWN0ZWRUYWJJbmRleH0pO1xuXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNjcm9sbEJhcihzZWxlY3RlZFRhYkluZGV4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChldmVudCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNsb3NlKGV2ZW50OiBFdmVudCwgdGFiOiBUYWJQYW5lbCkge1xuICAgICAgICBpZiAodGhpcy5jb250cm9sQ2xvc2UpIHtcbiAgICAgICAgICAgIHRoaXMub25DbG9zZS5lbWl0KHtcbiAgICAgICAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBldmVudCxcbiAgICAgICAgICAgICAgICBpbmRleDogdGhpcy5maW5kVGFiSW5kZXgodGFiKSxcbiAgICAgICAgICAgICAgICBjbG9zZTogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlVGFiKHRhYik7XG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNsb3NlVGFiKHRhYik7XG4gICAgICAgICAgICB0aGlzLm9uQ2xvc2UuZW1pdCh7XG4gICAgICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZlbnQsXG4gICAgICAgICAgICAgICAgaW5kZXg6IHRoaXMuZmluZFRhYkluZGV4KHRhYilcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuXG4gICAgY2xvc2VUYWIodGFiOiBUYWJQYW5lbCkge1xuICAgICAgICBpZiAodGFiLmRpc2FibGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRhYi5zZWxlY3RlZCkge1xuICAgICAgICAgICAgdGhpcy50YWJDaGFuZ2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRhYi5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMudGFicy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCB0YWJQYW5lbCA9IHRoaXMudGFic1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoIXRhYlBhbmVsLmNsb3NlZCYmIXRhYi5kaXNhYmxlZCkge1xuICAgICAgICAgICAgICAgICAgICB0YWJQYW5lbC5zZWxlY3RlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRhYi5jbG9zZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGZpbmRTZWxlY3RlZFRhYigpIHtcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMudGFicy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMudGFic1tpXS5zZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnRhYnNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZmluZFRhYkluZGV4KHRhYjogVGFiUGFuZWwpIHtcbiAgICAgICAgbGV0IGluZGV4ID0gLTE7XG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLnRhYnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnRhYnNbaV0gPT0gdGFiKSB7XG4gICAgICAgICAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbmRleDtcbiAgICB9XG5cbiAgICBnZXRCbG9ja2FibGVFbGVtZW50KCk6IEhUTUxFbGVtZW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWwubmF0aXZlRWxlbWVudC5jaGlsZHJlblswXTtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgYWN0aXZlSW5kZXgoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FjdGl2ZUluZGV4O1xuICAgIH1cblxuICAgIHNldCBhY3RpdmVJbmRleCh2YWw6bnVtYmVyKSB7XG4gICAgICAgIHRoaXMuX2FjdGl2ZUluZGV4ID0gdmFsO1xuICAgICAgICBpZiAodGhpcy5wcmV2ZW50QWN0aXZlSW5kZXhQcm9wYWdhdGlvbikge1xuICAgICAgICAgICAgdGhpcy5wcmV2ZW50QWN0aXZlSW5kZXhQcm9wYWdhdGlvbiA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMudGFicyAmJiB0aGlzLnRhYnMubGVuZ3RoICYmIHRoaXMuX2FjdGl2ZUluZGV4ICE9IG51bGwgJiYgdGhpcy50YWJzLmxlbmd0aCA+IHRoaXMuX2FjdGl2ZUluZGV4KSB7XG4gICAgICAgICAgICB0aGlzLmZpbmRTZWxlY3RlZFRhYigpLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnRhYnNbdGhpcy5fYWN0aXZlSW5kZXhdLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMudGFiQ2hhbmdlZCA9IHRydWU7XG5cbiAgICAgICAgICAgIHRoaXMudXBkYXRlU2Nyb2xsQmFyKHZhbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVJbmtCYXIoKSB7XG4gICAgICAgIGlmICh0aGlzLm5hdmJhcikge1xuICAgICAgICAgICAgY29uc3QgdGFiSGVhZGVyOiBIVE1MRWxlbWVudCB8IG51bGwgPSBEb21IYW5kbGVyLmZpbmRTaW5nbGUodGhpcy5uYXZiYXIubmF0aXZlRWxlbWVudCwgJ2xpLnAtaGlnaGxpZ2h0Jyk7XG5cbiAgICAgICAgICAgIGlmICghdGFiSGVhZGVyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmlua2Jhci5uYXRpdmVFbGVtZW50LnN0eWxlLndpZHRoID0gRG9tSGFuZGxlci5nZXRXaWR0aCh0YWJIZWFkZXIpICsgJ3B4JztcbiAgICAgICAgICAgIHRoaXMuaW5rYmFyLm5hdGl2ZUVsZW1lbnQuc3R5bGUubGVmdCA9ICBEb21IYW5kbGVyLmdldE9mZnNldCh0YWJIZWFkZXIpLmxlZnQgLSBEb21IYW5kbGVyLmdldE9mZnNldCh0aGlzLm5hdmJhci5uYXRpdmVFbGVtZW50KS5sZWZ0ICsgJ3B4JztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZVNjcm9sbEJhcihpbmRleCkge1xuICAgICAgICBsZXQgdGFiSGVhZGVyID0gdGhpcy5uYXZiYXIubmF0aXZlRWxlbWVudC5jaGlsZHJlbltpbmRleF07XG4gICAgICAgIHRhYkhlYWRlci5zY3JvbGxJbnRvVmlldyh7IGJsb2NrOiAnbmVhcmVzdCcgfSlcbiAgICB9XG5cbiAgICB1cGRhdGVCdXR0b25TdGF0ZSgpIHtcbiAgICAgICAgY29uc3QgY29udGVudCA9IHRoaXMuY29udGVudC5uYXRpdmVFbGVtZW50O1xuICAgICAgICBjb25zdCB7IHNjcm9sbExlZnQsIHNjcm9sbFdpZHRoIH0gPSBjb250ZW50O1xuICAgICAgICBjb25zdCB3aWR0aCA9IERvbUhhbmRsZXIuZ2V0V2lkdGgoY29udGVudCk7XG5cbiAgICAgICAgdGhpcy5iYWNrd2FyZElzRGlzYWJsZWQgPSBzY3JvbGxMZWZ0ID09PSAwO1xuICAgICAgICB0aGlzLmZvcndhcmRJc0Rpc2FibGVkID0gcGFyc2VJbnQoc2Nyb2xsTGVmdCkgPT09IHNjcm9sbFdpZHRoIC0gd2lkdGg7XG4gICAgfVxuXG4gICAgb25TY3JvbGwoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5zY3JvbGxhYmxlICYmIHRoaXMudXBkYXRlQnV0dG9uU3RhdGUoKTtcblxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIGdldFZpc2libGVCdXR0b25XaWR0aHMoKSB7XG4gICAgICAgIHJldHVybiBbdGhpcy5wcmV2QnRuPy5uYXRpdmVFbGVtZW50LCB0aGlzLm5leHRCdG4/Lm5hdGl2ZUVsZW1lbnRdLnJlZHVjZSgoYWNjLCBlbCkgPT4gZWwgPyBhY2MgKyBEb21IYW5kbGVyLmdldFdpZHRoKGVsKSA6IGFjYywgMCk7XG4gICAgfVxuXG4gICAgbmF2QmFja3dhcmQoKSB7XG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLmNvbnRlbnQubmF0aXZlRWxlbWVudDtcbiAgICAgICAgY29uc3Qgd2lkdGggPSBEb21IYW5kbGVyLmdldFdpZHRoKGNvbnRlbnQpIC0gdGhpcy5nZXRWaXNpYmxlQnV0dG9uV2lkdGhzKCk7XG4gICAgICAgIGNvbnN0IHBvcyA9IGNvbnRlbnQuc2Nyb2xsTGVmdCAtIHdpZHRoO1xuICAgICAgICBjb250ZW50LnNjcm9sbExlZnQgPSBwb3MgPD0gMCA/IDAgOiBwb3M7XG4gICAgfVxuXG4gICAgbmF2Rm9yd2FyZCgpIHtcbiAgICAgICAgY29uc3QgY29udGVudCA9IHRoaXMuY29udGVudC5uYXRpdmVFbGVtZW50O1xuICAgICAgICBjb25zdCB3aWR0aCA9IERvbUhhbmRsZXIuZ2V0V2lkdGgoY29udGVudCkgLSB0aGlzLmdldFZpc2libGVCdXR0b25XaWR0aHMoKTtcbiAgICAgICAgY29uc3QgcG9zID0gY29udGVudC5zY3JvbGxMZWZ0ICsgd2lkdGg7XG4gICAgICAgIGNvbnN0IGxhc3RQb3MgPSBjb250ZW50LnNjcm9sbFdpZHRoIC0gd2lkdGg7XG5cbiAgICAgICAgY29udGVudC5zY3JvbGxMZWZ0ID0gcG9zID49IGxhc3RQb3MgPyBsYXN0UG9zIDogcG9zO1xuICAgIH1cbn1cblxuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsU2hhcmVkTW9kdWxlLFRvb2x0aXBNb2R1bGUsUmlwcGxlTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbVGFiVmlldyxUYWJQYW5lbCxTaGFyZWRNb2R1bGVdLFxuICAgIGRlY2xhcmF0aW9uczogW1RhYlZpZXcsVGFiUGFuZWxdXG59KVxuZXhwb3J0IGNsYXNzIFRhYlZpZXdNb2R1bGUgeyB9XG4iXX0=