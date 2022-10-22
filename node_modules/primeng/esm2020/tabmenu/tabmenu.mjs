import { NgModule, Component, Input, ContentChildren, ChangeDetectionStrategy, ViewEncapsulation, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { DomHandler } from 'primeng/dom';
import { TooltipModule } from 'primeng/tooltip';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "@angular/common";
import * as i3 from "primeng/ripple";
import * as i4 from "primeng/tooltip";
export class TabMenu {
    constructor(router, route, cd) {
        this.router = router;
        this.route = route;
        this.cd = cd;
        this.backwardIsDisabled = true;
        this.forwardIsDisabled = false;
        this.timerIdForInitialAutoScroll = null;
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'item':
                    this.itemTemplate = item.template;
                    break;
                default:
                    this.itemTemplate = item.template;
                    break;
            }
        });
    }
    ngAfterViewInit() {
        this.updateInkBar();
        this.initAutoScrollForActiveItem();
        this.initButtonState();
    }
    ngAfterViewChecked() {
        if (this.tabChanged) {
            this.updateInkBar();
            this.tabChanged = false;
        }
    }
    ngOnDestroy() {
        this.clearAutoScrollHandler();
    }
    isActive(item) {
        if (item.routerLink) {
            const routerLink = Array.isArray(item.routerLink) ? item.routerLink : [item.routerLink];
            return this.router.isActive(this.router.createUrlTree(routerLink, { relativeTo: this.route }).toString(), false);
        }
        return item === this.activeItem;
    }
    itemClick(event, item) {
        if (item.disabled) {
            event.preventDefault();
            return;
        }
        if (!item.url && !item.routerLink) {
            event.preventDefault();
        }
        if (item.command) {
            item.command({
                originalEvent: event,
                item: item
            });
        }
        this.activeItem = item;
        this.tabChanged = true;
    }
    updateInkBar() {
        const tabHeader = DomHandler.findSingle(this.navbar.nativeElement, 'li.p-highlight');
        if (tabHeader) {
            this.inkbar.nativeElement.style.width = DomHandler.getWidth(tabHeader) + 'px';
            this.inkbar.nativeElement.style.left = DomHandler.getOffset(tabHeader).left - DomHandler.getOffset(this.navbar.nativeElement).left + 'px';
        }
    }
    getVisibleButtonWidths() {
        return [this.prevBtn?.nativeElement, this.nextBtn?.nativeElement].reduce((acc, el) => el ? acc + DomHandler.getWidth(el) : acc, 0);
    }
    updateButtonState() {
        const content = this.content.nativeElement;
        const { scrollLeft, scrollWidth } = content;
        const width = DomHandler.getWidth(content);
        this.backwardIsDisabled = scrollLeft === 0;
        this.forwardIsDisabled = parseInt(scrollLeft) === scrollWidth - width;
    }
    updateScrollBar(index) {
        const tabHeader = this.navbar.nativeElement.children[index];
        if (!tabHeader) {
            return;
        }
        tabHeader.scrollIntoView({ block: 'nearest', inline: 'center' });
    }
    onScroll(event) {
        this.scrollable && this.updateButtonState();
        event.preventDefault();
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
    initAutoScrollForActiveItem() {
        if (!this.scrollable) {
            return;
        }
        this.clearAutoScrollHandler();
        // We have to wait for the rendering and then can scroll to element.
        this.timerIdForInitialAutoScroll = setTimeout(() => {
            const activeItem = this.model.findIndex(menuItem => this.isActive(menuItem));
            if (activeItem !== -1) {
                this.updateScrollBar(activeItem);
            }
        });
    }
    clearAutoScrollHandler() {
        if (this.timerIdForInitialAutoScroll) {
            clearTimeout(this.timerIdForInitialAutoScroll);
            this.timerIdForInitialAutoScroll = null;
        }
    }
    initButtonState() {
        if (this.scrollable) {
            // We have to wait for the rendering and then retrieve the actual size element from the DOM.
            // in future `Promise.resolve` can be changed to `queueMicrotask` (if ie11 support will be dropped)
            Promise.resolve().then(() => {
                this.updateButtonState();
                this.cd.markForCheck();
            });
        }
    }
}
TabMenu.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: TabMenu, deps: [{ token: i1.Router }, { token: i1.ActivatedRoute }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
TabMenu.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.7", type: TabMenu, selector: "p-tabMenu", inputs: { model: "model", activeItem: "activeItem", scrollable: "scrollable", popup: "popup", style: "style", styleClass: "styleClass" }, host: { classAttribute: "p-element" }, queries: [{ propertyName: "templates", predicate: PrimeTemplate }], viewQueries: [{ propertyName: "content", first: true, predicate: ["content"], descendants: true }, { propertyName: "navbar", first: true, predicate: ["navbar"], descendants: true }, { propertyName: "inkbar", first: true, predicate: ["inkbar"], descendants: true }, { propertyName: "prevBtn", first: true, predicate: ["prevBtn"], descendants: true }, { propertyName: "nextBtn", first: true, predicate: ["nextBtn"], descendants: true }], ngImport: i0, template: `
        <div [ngClass]="{'p-tabmenu p-component': true, 'p-tabmenu-scrollable': scrollable}" [ngStyle]="style" [class]="styleClass">
            <div class="p-tabmenu-nav-container">
                <button *ngIf="scrollable && !backwardIsDisabled" #prevBtn class="p-tabmenu-nav-prev p-tabmenu-nav-btn p-link" (click)="navBackward()" type="button" pRipple>
                    <span class="pi pi-chevron-left"></span>
                </button>
                <div #content class="p-tabmenu-nav-content" (scroll)="onScroll($event)">
                    <ul #navbar class="p-tabmenu-nav p-reset" role="tablist">
                        <li *ngFor="let item of model; let i = index" role="tab" [ngStyle]="item.style" [class]="item.styleClass" [attr.aria-selected]="isActive(item)" [attr.aria-expanded]="isActive(item)"
                            [ngClass]="{'p-tabmenuitem':true,'p-disabled':item.disabled,'p-highlight':isActive(item),'p-hidden': item.visible === false}" pTooltip [tooltipOptions]="item.tooltipOptions">
                            <a *ngIf="!item.routerLink" [attr.href]="item.url" class="p-menuitem-link" role="presentation" (click)="itemClick($event,item)" (keydown.enter)="itemClick($event,item)" [attr.tabindex]="item.disabled ? null : '0'"
                                [target]="item.target" [attr.title]="item.title" [attr.id]="item.id" pRipple>
                                <ng-container *ngIf="!itemTemplate">
                                    <span class="p-menuitem-icon" [ngClass]="item.icon" *ngIf="item.icon" [ngStyle]="item.iconStyle"></span>
                                    <span class="p-menuitem-text" *ngIf="item.escape !== false; else htmlLabel">{{item.label}}</span>
                                    <ng-template #htmlLabel><span class="p-menuitem-text" [innerHTML]="item.label"></span></ng-template>
                                </ng-container>
                                <ng-container *ngTemplateOutlet="itemTemplate; context: {$implicit: item, index: i}"></ng-container>
                            </a>
                            <a *ngIf="item.routerLink" [routerLink]="item.routerLink" [queryParams]="item.queryParams" [routerLinkActive]="'p-menuitem-link-active'" [routerLinkActiveOptions]="item.routerLinkActiveOptions||{exact:false}"
                                role="presentation" class="p-menuitem-link" (click)="itemClick($event,item)" (keydown.enter)="itemClick($event,item)" [attr.tabindex]="item.disabled ? null : '0'"
                                [target]="item.target" [attr.title]="item.title" [attr.id]="item.id"
                                [fragment]="item.fragment" [queryParamsHandling]="item.queryParamsHandling" [preserveFragment]="item.preserveFragment" [skipLocationChange]="item.skipLocationChange" [replaceUrl]="item.replaceUrl" [state]="item.state" pRipple>
                                <ng-container *ngIf="!itemTemplate">
                                    <span class="p-menuitem-icon" [ngClass]="item.icon" *ngIf="item.icon" [ngStyle]="item.iconStyle"></span>
                                    <span class="p-menuitem-text" *ngIf="item.escape !== false; else htmlRouteLabel">{{item.label}}</span>
                                    <ng-template #htmlRouteLabel><span class="p-menuitem-text" [innerHTML]="item.label"></span></ng-template>
                                </ng-container>
                                <ng-container *ngTemplateOutlet="itemTemplate; context: {$implicit: item, index: i}"></ng-container>
                            </a>
                        </li>
                        <li #inkbar class="p-tabmenu-ink-bar"></li>
                    </ul>
                </div>
                <button *ngIf="scrollable && !forwardIsDisabled" #nextBtn class="p-tabmenu-nav-next p-tabmenu-nav-btn p-link" (click)="navForward()" type="button" pRipple>
                    <span class="pi pi-chevron-right"></span>
                </button>
            </div>
        </div>
    `, isInline: true, styles: [".p-tabmenu-nav-container{position:relative}.p-tabmenu-scrollable .p-tabmenu-nav-container{overflow:hidden}.p-tabmenu-nav-content{overflow-x:auto;overflow-y:hidden;scroll-behavior:smooth;scrollbar-width:none;overscroll-behavior:contain auto}.p-tabmenu-nav-btn{position:absolute;top:0;z-index:2;height:100%;display:flex;align-items:center;justify-content:center}.p-tabmenu-nav-prev{left:0}.p-tabmenu-nav-next{right:0}.p-tabview-nav-content::-webkit-scrollbar{display:none}.p-tabmenu-nav{display:flex;margin:0;padding:0;list-style-type:none;flex-wrap:nowrap}.p-tabmenu-nav a{cursor:pointer;-webkit-user-select:none;user-select:none;display:flex;align-items:center;position:relative;text-decoration:none;overflow:hidden}.p-tabmenu-nav a:focus{z-index:1}.p-tabmenu-nav .p-menuitem-text{line-height:1;white-space:nowrap}.p-tabmenu-ink-bar{display:none;z-index:1}.p-tabmenu-nav-content::-webkit-scrollbar{display:none}\n"], dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i2.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i1.RouterLinkWithHref, selector: "a[routerLink],area[routerLink]", inputs: ["target", "queryParams", "fragment", "queryParamsHandling", "preserveFragment", "skipLocationChange", "replaceUrl", "state", "relativeTo", "routerLink"] }, { kind: "directive", type: i1.RouterLinkActive, selector: "[routerLinkActive]", inputs: ["routerLinkActiveOptions", "ariaCurrentWhenActive", "routerLinkActive"], outputs: ["isActiveChange"], exportAs: ["routerLinkActive"] }, { kind: "directive", type: i3.Ripple, selector: "[pRipple]" }, { kind: "directive", type: i4.Tooltip, selector: "[pTooltip]", inputs: ["tooltipPosition", "tooltipEvent", "appendTo", "positionStyle", "tooltipStyleClass", "tooltipZIndex", "escape", "showDelay", "hideDelay", "life", "positionTop", "positionLeft", "fitContent", "pTooltip", "tooltipDisabled", "tooltipOptions"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: TabMenu, decorators: [{
            type: Component,
            args: [{ selector: 'p-tabMenu', template: `
        <div [ngClass]="{'p-tabmenu p-component': true, 'p-tabmenu-scrollable': scrollable}" [ngStyle]="style" [class]="styleClass">
            <div class="p-tabmenu-nav-container">
                <button *ngIf="scrollable && !backwardIsDisabled" #prevBtn class="p-tabmenu-nav-prev p-tabmenu-nav-btn p-link" (click)="navBackward()" type="button" pRipple>
                    <span class="pi pi-chevron-left"></span>
                </button>
                <div #content class="p-tabmenu-nav-content" (scroll)="onScroll($event)">
                    <ul #navbar class="p-tabmenu-nav p-reset" role="tablist">
                        <li *ngFor="let item of model; let i = index" role="tab" [ngStyle]="item.style" [class]="item.styleClass" [attr.aria-selected]="isActive(item)" [attr.aria-expanded]="isActive(item)"
                            [ngClass]="{'p-tabmenuitem':true,'p-disabled':item.disabled,'p-highlight':isActive(item),'p-hidden': item.visible === false}" pTooltip [tooltipOptions]="item.tooltipOptions">
                            <a *ngIf="!item.routerLink" [attr.href]="item.url" class="p-menuitem-link" role="presentation" (click)="itemClick($event,item)" (keydown.enter)="itemClick($event,item)" [attr.tabindex]="item.disabled ? null : '0'"
                                [target]="item.target" [attr.title]="item.title" [attr.id]="item.id" pRipple>
                                <ng-container *ngIf="!itemTemplate">
                                    <span class="p-menuitem-icon" [ngClass]="item.icon" *ngIf="item.icon" [ngStyle]="item.iconStyle"></span>
                                    <span class="p-menuitem-text" *ngIf="item.escape !== false; else htmlLabel">{{item.label}}</span>
                                    <ng-template #htmlLabel><span class="p-menuitem-text" [innerHTML]="item.label"></span></ng-template>
                                </ng-container>
                                <ng-container *ngTemplateOutlet="itemTemplate; context: {$implicit: item, index: i}"></ng-container>
                            </a>
                            <a *ngIf="item.routerLink" [routerLink]="item.routerLink" [queryParams]="item.queryParams" [routerLinkActive]="'p-menuitem-link-active'" [routerLinkActiveOptions]="item.routerLinkActiveOptions||{exact:false}"
                                role="presentation" class="p-menuitem-link" (click)="itemClick($event,item)" (keydown.enter)="itemClick($event,item)" [attr.tabindex]="item.disabled ? null : '0'"
                                [target]="item.target" [attr.title]="item.title" [attr.id]="item.id"
                                [fragment]="item.fragment" [queryParamsHandling]="item.queryParamsHandling" [preserveFragment]="item.preserveFragment" [skipLocationChange]="item.skipLocationChange" [replaceUrl]="item.replaceUrl" [state]="item.state" pRipple>
                                <ng-container *ngIf="!itemTemplate">
                                    <span class="p-menuitem-icon" [ngClass]="item.icon" *ngIf="item.icon" [ngStyle]="item.iconStyle"></span>
                                    <span class="p-menuitem-text" *ngIf="item.escape !== false; else htmlRouteLabel">{{item.label}}</span>
                                    <ng-template #htmlRouteLabel><span class="p-menuitem-text" [innerHTML]="item.label"></span></ng-template>
                                </ng-container>
                                <ng-container *ngTemplateOutlet="itemTemplate; context: {$implicit: item, index: i}"></ng-container>
                            </a>
                        </li>
                        <li #inkbar class="p-tabmenu-ink-bar"></li>
                    </ul>
                </div>
                <button *ngIf="scrollable && !forwardIsDisabled" #nextBtn class="p-tabmenu-nav-next p-tabmenu-nav-btn p-link" (click)="navForward()" type="button" pRipple>
                    <span class="pi pi-chevron-right"></span>
                </button>
            </div>
        </div>
    `, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        'class': 'p-element'
                    }, styles: [".p-tabmenu-nav-container{position:relative}.p-tabmenu-scrollable .p-tabmenu-nav-container{overflow:hidden}.p-tabmenu-nav-content{overflow-x:auto;overflow-y:hidden;scroll-behavior:smooth;scrollbar-width:none;overscroll-behavior:contain auto}.p-tabmenu-nav-btn{position:absolute;top:0;z-index:2;height:100%;display:flex;align-items:center;justify-content:center}.p-tabmenu-nav-prev{left:0}.p-tabmenu-nav-next{right:0}.p-tabview-nav-content::-webkit-scrollbar{display:none}.p-tabmenu-nav{display:flex;margin:0;padding:0;list-style-type:none;flex-wrap:nowrap}.p-tabmenu-nav a{cursor:pointer;-webkit-user-select:none;user-select:none;display:flex;align-items:center;position:relative;text-decoration:none;overflow:hidden}.p-tabmenu-nav a:focus{z-index:1}.p-tabmenu-nav .p-menuitem-text{line-height:1;white-space:nowrap}.p-tabmenu-ink-bar{display:none;z-index:1}.p-tabmenu-nav-content::-webkit-scrollbar{display:none}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.Router }, { type: i1.ActivatedRoute }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { model: [{
                type: Input
            }], activeItem: [{
                type: Input
            }], scrollable: [{
                type: Input
            }], popup: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], content: [{
                type: ViewChild,
                args: ['content']
            }], navbar: [{
                type: ViewChild,
                args: ['navbar']
            }], inkbar: [{
                type: ViewChild,
                args: ['inkbar']
            }], prevBtn: [{
                type: ViewChild,
                args: ['prevBtn']
            }], nextBtn: [{
                type: ViewChild,
                args: ['nextBtn']
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }] } });
export class TabMenuModule {
}
TabMenuModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: TabMenuModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
TabMenuModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.7", ngImport: i0, type: TabMenuModule, declarations: [TabMenu], imports: [CommonModule, RouterModule, SharedModule, RippleModule, TooltipModule], exports: [TabMenu, RouterModule, SharedModule, TooltipModule] });
TabMenuModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: TabMenuModule, imports: [CommonModule, RouterModule, SharedModule, RippleModule, TooltipModule, RouterModule, SharedModule, TooltipModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: TabMenuModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, RouterModule, SharedModule, RippleModule, TooltipModule],
                    exports: [TabMenu, RouterModule, SharedModule, TooltipModule],
                    declarations: [TabMenu]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibWVudS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy90YWJtZW51L3RhYm1lbnUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsS0FBSyxFQUFDLGVBQWUsRUFBdUUsdUJBQXVCLEVBQUUsaUJBQWlCLEVBQUUsU0FBUyxFQUEyQyxNQUFNLGVBQWUsQ0FBQztBQUM3TyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzVDLE9BQU8sRUFBQyxhQUFhLEVBQUUsWUFBWSxFQUFXLE1BQU0sYUFBYSxDQUFDO0FBQ2xFLE9BQU8sRUFBeUIsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDckUsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUN2QyxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0saUJBQWlCLENBQUM7Ozs7OztBQW1EOUMsTUFBTSxPQUFPLE9BQU87SUFvQ2hCLFlBQW9CLE1BQWMsRUFBVSxLQUFvQixFQUFVLEVBQXFCO1FBQTNFLFdBQU0sR0FBTixNQUFNLENBQVE7UUFBVSxVQUFLLEdBQUwsS0FBSyxDQUFlO1FBQVUsT0FBRSxHQUFGLEVBQUUsQ0FBbUI7UUFOL0YsdUJBQWtCLEdBQVksSUFBSSxDQUFDO1FBRW5DLHNCQUFpQixHQUFZLEtBQUssQ0FBQztRQUUzQixnQ0FBMkIsR0FBa0IsSUFBSSxDQUFDO0lBRXlDLENBQUM7SUFFcEcsa0JBQWtCO1FBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUM1QixRQUFPLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRTtnQkFDbkIsS0FBSyxNQUFNO29CQUNQLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFD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YTs7QUF5S2xDLE1BQU0sT0FBTyxhQUFhOzswR0FBYixhQUFhOzJHQUFiLGFBQWEsaUJBak1iLE9BQU8sYUE2TE4sWUFBWSxFQUFDLFlBQVksRUFBQyxZQUFZLEVBQUMsWUFBWSxFQUFDLGFBQWEsYUE3TGxFLE9BQU8sRUE4TEUsWUFBWSxFQUFDLFlBQVksRUFBQyxhQUFhOzJHQUdoRCxhQUFhLFlBSlosWUFBWSxFQUFDLFlBQVksRUFBQyxZQUFZLEVBQUMsWUFBWSxFQUFDLGFBQWEsRUFDekQsWUFBWSxFQUFDLFlBQVksRUFBQyxhQUFhOzJGQUdoRCxhQUFhO2tCQUx6QixRQUFRO21CQUFDO29CQUNOLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBQyxZQUFZLEVBQUMsWUFBWSxFQUFDLFlBQVksRUFBQyxhQUFhLENBQUM7b0JBQzVFLE9BQU8sRUFBRSxDQUFDLE9BQU8sRUFBQyxZQUFZLEVBQUMsWUFBWSxFQUFDLGFBQWEsQ0FBQztvQkFDMUQsWUFBWSxFQUFFLENBQUMsT0FBTyxDQUFDO2lCQUMxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TmdNb2R1bGUsQ29tcG9uZW50LElucHV0LENvbnRlbnRDaGlsZHJlbixRdWVyeUxpc3QsQWZ0ZXJDb250ZW50SW5pdCxBZnRlclZpZXdJbml0LEFmdGVyVmlld0NoZWNrZWQsVGVtcGxhdGVSZWYsQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIFZpZXdFbmNhcHN1bGF0aW9uLCBWaWV3Q2hpbGQsIEVsZW1lbnRSZWYsIENoYW5nZURldGVjdG9yUmVmLCBPbkRlc3Ryb3l9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1JpcHBsZU1vZHVsZX0gZnJvbSAncHJpbWVuZy9yaXBwbGUnO1xuaW1wb3J0IHtQcmltZVRlbXBsYXRlLCBTaGFyZWRNb2R1bGUsIE1lbnVJdGVtfSBmcm9tICdwcmltZW5nL2FwaSc7XG5pbXBvcnQge0FjdGl2YXRlZFJvdXRlLCBSb3V0ZXIsIFJvdXRlck1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7RG9tSGFuZGxlcn0gZnJvbSAncHJpbWVuZy9kb20nO1xuaW1wb3J0IHtUb29sdGlwTW9kdWxlfSBmcm9tICdwcmltZW5nL3Rvb2x0aXAnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3AtdGFiTWVudScsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGRpdiBbbmdDbGFzc109XCJ7J3AtdGFibWVudSBwLWNvbXBvbmVudCc6IHRydWUsICdwLXRhYm1lbnUtc2Nyb2xsYWJsZSc6IHNjcm9sbGFibGV9XCIgW25nU3R5bGVdPVwic3R5bGVcIiBbY2xhc3NdPVwic3R5bGVDbGFzc1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtdGFibWVudS1uYXYtY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiAqbmdJZj1cInNjcm9sbGFibGUgJiYgIWJhY2t3YXJkSXNEaXNhYmxlZFwiICNwcmV2QnRuIGNsYXNzPVwicC10YWJtZW51LW5hdi1wcmV2IHAtdGFibWVudS1uYXYtYnRuIHAtbGlua1wiIChjbGljayk9XCJuYXZCYWNrd2FyZCgpXCIgdHlwZT1cImJ1dHRvblwiIHBSaXBwbGU+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicGkgcGktY2hldnJvbi1sZWZ0XCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxkaXYgI2NvbnRlbnQgY2xhc3M9XCJwLXRhYm1lbnUtbmF2LWNvbnRlbnRcIiAoc2Nyb2xsKT1cIm9uU2Nyb2xsKCRldmVudClcIj5cbiAgICAgICAgICAgICAgICAgICAgPHVsICNuYXZiYXIgY2xhc3M9XCJwLXRhYm1lbnUtbmF2IHAtcmVzZXRcIiByb2xlPVwidGFibGlzdFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpICpuZ0Zvcj1cImxldCBpdGVtIG9mIG1vZGVsOyBsZXQgaSA9IGluZGV4XCIgcm9sZT1cInRhYlwiIFtuZ1N0eWxlXT1cIml0ZW0uc3R5bGVcIiBbY2xhc3NdPVwiaXRlbS5zdHlsZUNsYXNzXCIgW2F0dHIuYXJpYS1zZWxlY3RlZF09XCJpc0FjdGl2ZShpdGVtKVwiIFthdHRyLmFyaWEtZXhwYW5kZWRdPVwiaXNBY3RpdmUoaXRlbSlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cInsncC10YWJtZW51aXRlbSc6dHJ1ZSwncC1kaXNhYmxlZCc6aXRlbS5kaXNhYmxlZCwncC1oaWdobGlnaHQnOmlzQWN0aXZlKGl0ZW0pLCdwLWhpZGRlbic6IGl0ZW0udmlzaWJsZSA9PT0gZmFsc2V9XCIgcFRvb2x0aXAgW3Rvb2x0aXBPcHRpb25zXT1cIml0ZW0udG9vbHRpcE9wdGlvbnNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSAqbmdJZj1cIiFpdGVtLnJvdXRlckxpbmtcIiBbYXR0ci5ocmVmXT1cIml0ZW0udXJsXCIgY2xhc3M9XCJwLW1lbnVpdGVtLWxpbmtcIiByb2xlPVwicHJlc2VudGF0aW9uXCIgKGNsaWNrKT1cIml0ZW1DbGljaygkZXZlbnQsaXRlbSlcIiAoa2V5ZG93bi5lbnRlcik9XCJpdGVtQ2xpY2soJGV2ZW50LGl0ZW0pXCIgW2F0dHIudGFiaW5kZXhdPVwiaXRlbS5kaXNhYmxlZCA/IG51bGwgOiAnMCdcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbdGFyZ2V0XT1cIml0ZW0udGFyZ2V0XCIgW2F0dHIudGl0bGVdPVwiaXRlbS50aXRsZVwiIFthdHRyLmlkXT1cIml0ZW0uaWRcIiBwUmlwcGxlPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiIWl0ZW1UZW1wbGF0ZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwLW1lbnVpdGVtLWljb25cIiBbbmdDbGFzc109XCJpdGVtLmljb25cIiAqbmdJZj1cIml0ZW0uaWNvblwiIFtuZ1N0eWxlXT1cIml0ZW0uaWNvblN0eWxlXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwLW1lbnVpdGVtLXRleHRcIiAqbmdJZj1cIml0ZW0uZXNjYXBlICE9PSBmYWxzZTsgZWxzZSBodG1sTGFiZWxcIj57e2l0ZW0ubGFiZWx9fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSAjaHRtbExhYmVsPjxzcGFuIGNsYXNzPVwicC1tZW51aXRlbS10ZXh0XCIgW2lubmVySFRNTF09XCJpdGVtLmxhYmVsXCI+PC9zcGFuPjwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiaXRlbVRlbXBsYXRlOyBjb250ZXh0OiB7JGltcGxpY2l0OiBpdGVtLCBpbmRleDogaX1cIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgKm5nSWY9XCJpdGVtLnJvdXRlckxpbmtcIiBbcm91dGVyTGlua109XCJpdGVtLnJvdXRlckxpbmtcIiBbcXVlcnlQYXJhbXNdPVwiaXRlbS5xdWVyeVBhcmFtc1wiIFtyb3V0ZXJMaW5rQWN0aXZlXT1cIidwLW1lbnVpdGVtLWxpbmstYWN0aXZlJ1wiIFtyb3V0ZXJMaW5rQWN0aXZlT3B0aW9uc109XCJpdGVtLnJvdXRlckxpbmtBY3RpdmVPcHRpb25zfHx7ZXhhY3Q6ZmFsc2V9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9sZT1cInByZXNlbnRhdGlvblwiIGNsYXNzPVwicC1tZW51aXRlbS1saW5rXCIgKGNsaWNrKT1cIml0ZW1DbGljaygkZXZlbnQsaXRlbSlcIiAoa2V5ZG93bi5lbnRlcik9XCJpdGVtQ2xpY2soJGV2ZW50LGl0ZW0pXCIgW2F0dHIudGFiaW5kZXhdPVwiaXRlbS5kaXNhYmxlZCA/IG51bGwgOiAnMCdcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbdGFyZ2V0XT1cIml0ZW0udGFyZ2V0XCIgW2F0dHIudGl0bGVdPVwiaXRlbS50aXRsZVwiIFthdHRyLmlkXT1cIml0ZW0uaWRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbZnJhZ21lbnRdPVwiaXRlbS5mcmFnbWVudFwiIFtxdWVyeVBhcmFtc0hhbmRsaW5nXT1cIml0ZW0ucXVlcnlQYXJhbXNIYW5kbGluZ1wiIFtwcmVzZXJ2ZUZyYWdtZW50XT1cIml0ZW0ucHJlc2VydmVGcmFnbWVudFwiIFtza2lwTG9jYXRpb25DaGFuZ2VdPVwiaXRlbS5za2lwTG9jYXRpb25DaGFuZ2VcIiBbcmVwbGFjZVVybF09XCJpdGVtLnJlcGxhY2VVcmxcIiBbc3RhdGVdPVwiaXRlbS5zdGF0ZVwiIHBSaXBwbGU+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCIhaXRlbVRlbXBsYXRlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtbWVudWl0ZW0taWNvblwiIFtuZ0NsYXNzXT1cIml0ZW0uaWNvblwiICpuZ0lmPVwiaXRlbS5pY29uXCIgW25nU3R5bGVdPVwiaXRlbS5pY29uU3R5bGVcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtbWVudWl0ZW0tdGV4dFwiICpuZ0lmPVwiaXRlbS5lc2NhcGUgIT09IGZhbHNlOyBlbHNlIGh0bWxSb3V0ZUxhYmVsXCI+e3tpdGVtLmxhYmVsfX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgI2h0bWxSb3V0ZUxhYmVsPjxzcGFuIGNsYXNzPVwicC1tZW51aXRlbS10ZXh0XCIgW2lubmVySFRNTF09XCJpdGVtLmxhYmVsXCI+PC9zcGFuPjwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiaXRlbVRlbXBsYXRlOyBjb250ZXh0OiB7JGltcGxpY2l0OiBpdGVtLCBpbmRleDogaX1cIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpICNpbmtiYXIgY2xhc3M9XCJwLXRhYm1lbnUtaW5rLWJhclwiPjwvbGk+XG4gICAgICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiAqbmdJZj1cInNjcm9sbGFibGUgJiYgIWZvcndhcmRJc0Rpc2FibGVkXCIgI25leHRCdG4gY2xhc3M9XCJwLXRhYm1lbnUtbmF2LW5leHQgcC10YWJtZW51LW5hdi1idG4gcC1saW5rXCIgKGNsaWNrKT1cIm5hdkZvcndhcmQoKVwiIHR5cGU9XCJidXR0b25cIiBwUmlwcGxlPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInBpIHBpLWNoZXZyb24tcmlnaHRcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgYCxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAgIHN0eWxlVXJsczogWycuL3RhYm1lbnUuY3NzJ10sXG4gICAgaG9zdDoge1xuICAgICAgICAnY2xhc3MnOiAncC1lbGVtZW50J1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgVGFiTWVudSBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsQWZ0ZXJWaWV3SW5pdCxBZnRlclZpZXdDaGVja2VkLE9uRGVzdHJveSB7XG5cbiAgICBASW5wdXQoKSBtb2RlbDogTWVudUl0ZW1bXTtcblxuICAgIEBJbnB1dCgpIGFjdGl2ZUl0ZW06IE1lbnVJdGVtO1xuXG4gICAgQElucHV0KCkgc2Nyb2xsYWJsZTogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIHBvcHVwOiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgc3R5bGU6IGFueTtcblxuICAgIEBJbnB1dCgpIHN0eWxlQ2xhc3M6IHN0cmluZztcblxuICAgIEBWaWV3Q2hpbGQoJ2NvbnRlbnQnKSBjb250ZW50OiBFbGVtZW50UmVmO1xuXG4gICAgQFZpZXdDaGlsZCgnbmF2YmFyJykgbmF2YmFyOiBFbGVtZW50UmVmO1xuXG4gICAgQFZpZXdDaGlsZCgnaW5rYmFyJykgaW5rYmFyOiBFbGVtZW50UmVmO1xuXG4gICAgQFZpZXdDaGlsZCgncHJldkJ0bicpIHByZXZCdG46IEVsZW1lbnRSZWY7XG5cbiAgICBAVmlld0NoaWxkKCduZXh0QnRuJykgbmV4dEJ0bjogRWxlbWVudFJlZjtcblxuICAgIEBDb250ZW50Q2hpbGRyZW4oUHJpbWVUZW1wbGF0ZSkgdGVtcGxhdGVzOiBRdWVyeUxpc3Q8YW55PjtcblxuICAgIGl0ZW1UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIHRhYkNoYW5nZWQ6IGJvb2xlYW47XG5cbiAgICBiYWNrd2FyZElzRGlzYWJsZWQ6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgZm9yd2FyZElzRGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIHByaXZhdGUgdGltZXJJZEZvckluaXRpYWxBdXRvU2Nyb2xsOiBudW1iZXIgfCBudWxsID0gbnVsbDtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsIHByaXZhdGUgcm91dGU6QWN0aXZhdGVkUm91dGUsIHByaXZhdGUgY2Q6IENoYW5nZURldGVjdG9yUmVmKSB7IH1cblxuICAgIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgc3dpdGNoKGl0ZW0uZ2V0VHlwZSgpKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnaXRlbSc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXRlbVRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXRlbVRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLnVwZGF0ZUlua0JhcigpO1xuICAgICAgICB0aGlzLmluaXRBdXRvU2Nyb2xsRm9yQWN0aXZlSXRlbSgpO1xuICAgICAgICB0aGlzLmluaXRCdXR0b25TdGF0ZSgpO1xuICAgIH1cblxuICAgIG5nQWZ0ZXJWaWV3Q2hlY2tlZCgpIHtcbiAgICAgICAgaWYgKHRoaXMudGFiQ2hhbmdlZCkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVJbmtCYXIoKTtcbiAgICAgICAgICAgIHRoaXMudGFiQ2hhbmdlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY2xlYXJBdXRvU2Nyb2xsSGFuZGxlcigpO1xuICAgIH1cblxuICAgIGlzQWN0aXZlKGl0ZW06IE1lbnVJdGVtKSB7XG4gICAgICAgIGlmIChpdGVtLnJvdXRlckxpbmspe1xuICAgICAgICAgICAgY29uc3Qgcm91dGVyTGluayA9IEFycmF5LmlzQXJyYXkoaXRlbS5yb3V0ZXJMaW5rKSA/IGl0ZW0ucm91dGVyTGluayA6IFtpdGVtLnJvdXRlckxpbmtdO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yb3V0ZXIuaXNBY3RpdmUodGhpcy5yb3V0ZXIuY3JlYXRlVXJsVHJlZShyb3V0ZXJMaW5rLCB7cmVsYXRpdmVUbzogdGhpcy5yb3V0ZX0pLnRvU3RyaW5nKCksIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgIHJldHVybiBpdGVtID09PSB0aGlzLmFjdGl2ZUl0ZW07XG4gICAgfVxuXG4gICAgaXRlbUNsaWNrKGV2ZW50OiBFdmVudCwgaXRlbTogTWVudUl0ZW0pIHtcbiAgICAgICAgaWYgKGl0ZW0uZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWl0ZW0udXJsICYmICFpdGVtLnJvdXRlckxpbmspIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXRlbS5jb21tYW5kKSB7XG4gICAgICAgICAgICBpdGVtLmNvbW1hbmQoe1xuICAgICAgICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2ZW50LFxuICAgICAgICAgICAgICAgIGl0ZW06IGl0ZW1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5hY3RpdmVJdGVtID0gaXRlbTtcbiAgICAgICAgdGhpcy50YWJDaGFuZ2VkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICB1cGRhdGVJbmtCYXIoKSB7XG4gICAgICAgIGNvbnN0IHRhYkhlYWRlciA9IERvbUhhbmRsZXIuZmluZFNpbmdsZSh0aGlzLm5hdmJhci5uYXRpdmVFbGVtZW50LCAnbGkucC1oaWdobGlnaHQnKTtcbiAgICAgICAgaWYgKHRhYkhlYWRlcikge1xuICAgICAgICAgICAgdGhpcy5pbmtiYXIubmF0aXZlRWxlbWVudC5zdHlsZS53aWR0aCA9IERvbUhhbmRsZXIuZ2V0V2lkdGgodGFiSGVhZGVyKSArICdweCc7XG4gICAgICAgICAgICB0aGlzLmlua2Jhci5uYXRpdmVFbGVtZW50LnN0eWxlLmxlZnQgPSBEb21IYW5kbGVyLmdldE9mZnNldCh0YWJIZWFkZXIpLmxlZnQgLSBEb21IYW5kbGVyLmdldE9mZnNldCh0aGlzLm5hdmJhci5uYXRpdmVFbGVtZW50KS5sZWZ0ICsgJ3B4JztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFZpc2libGVCdXR0b25XaWR0aHMoKSB7XG4gICAgICAgIHJldHVybiBbdGhpcy5wcmV2QnRuPy5uYXRpdmVFbGVtZW50LCB0aGlzLm5leHRCdG4/Lm5hdGl2ZUVsZW1lbnRdLnJlZHVjZSgoYWNjLCBlbCkgPT4gZWwgPyBhY2MgKyBEb21IYW5kbGVyLmdldFdpZHRoKGVsKSA6IGFjYywgMCk7XG4gICAgfVxuXG4gICAgdXBkYXRlQnV0dG9uU3RhdGUoKSB7XG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLmNvbnRlbnQubmF0aXZlRWxlbWVudDtcbiAgICAgICAgY29uc3QgeyBzY3JvbGxMZWZ0LCBzY3JvbGxXaWR0aCB9ID0gY29udGVudDtcbiAgICAgICAgY29uc3Qgd2lkdGggPSBEb21IYW5kbGVyLmdldFdpZHRoKGNvbnRlbnQpO1xuXG4gICAgICAgIHRoaXMuYmFja3dhcmRJc0Rpc2FibGVkID0gc2Nyb2xsTGVmdCA9PT0gMDtcbiAgICAgICAgdGhpcy5mb3J3YXJkSXNEaXNhYmxlZCA9IHBhcnNlSW50KHNjcm9sbExlZnQpID09PSBzY3JvbGxXaWR0aCAtIHdpZHRoO1xuICAgIH1cblxuXG4gICAgdXBkYXRlU2Nyb2xsQmFyKGluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgdGFiSGVhZGVyID0gdGhpcy5uYXZiYXIubmF0aXZlRWxlbWVudC5jaGlsZHJlbltpbmRleF07XG5cbiAgICAgICAgaWYgKCF0YWJIZWFkZXIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRhYkhlYWRlci5zY3JvbGxJbnRvVmlldyh7IGJsb2NrOiAnbmVhcmVzdCcsIGlubGluZTogJ2NlbnRlcicgfSk7XG4gICAgfVxuXG4gICAgb25TY3JvbGwoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5zY3JvbGxhYmxlICYmIHRoaXMudXBkYXRlQnV0dG9uU3RhdGUoKTtcblxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIG5hdkJhY2t3YXJkKCkge1xuICAgICAgICBjb25zdCBjb250ZW50ID0gdGhpcy5jb250ZW50Lm5hdGl2ZUVsZW1lbnQ7XG4gICAgICAgIGNvbnN0IHdpZHRoID0gRG9tSGFuZGxlci5nZXRXaWR0aChjb250ZW50KSAtIHRoaXMuZ2V0VmlzaWJsZUJ1dHRvbldpZHRocygpO1xuICAgICAgICBjb25zdCBwb3MgPSBjb250ZW50LnNjcm9sbExlZnQgLSB3aWR0aDtcbiAgICAgICAgY29udGVudC5zY3JvbGxMZWZ0ID0gcG9zIDw9IDAgPyAwIDogcG9zO1xuICAgIH1cblxuICAgIG5hdkZvcndhcmQoKSB7XG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLmNvbnRlbnQubmF0aXZlRWxlbWVudDtcbiAgICAgICAgY29uc3Qgd2lkdGggPSBEb21IYW5kbGVyLmdldFdpZHRoKGNvbnRlbnQpIC0gdGhpcy5nZXRWaXNpYmxlQnV0dG9uV2lkdGhzKCk7XG4gICAgICAgIGNvbnN0IHBvcyA9IGNvbnRlbnQuc2Nyb2xsTGVmdCArIHdpZHRoO1xuICAgICAgICBjb25zdCBsYXN0UG9zID0gY29udGVudC5zY3JvbGxXaWR0aCAtIHdpZHRoO1xuICAgICAgICBjb250ZW50LnNjcm9sbExlZnQgPSBwb3MgPj0gbGFzdFBvcyA/IGxhc3RQb3MgOiBwb3M7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpbml0QXV0b1Njcm9sbEZvckFjdGl2ZUl0ZW0oKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5zY3JvbGxhYmxlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNsZWFyQXV0b1Njcm9sbEhhbmRsZXIoKTtcbiAgICAgICAgLy8gV2UgaGF2ZSB0byB3YWl0IGZvciB0aGUgcmVuZGVyaW5nIGFuZCB0aGVuIGNhbiBzY3JvbGwgdG8gZWxlbWVudC5cbiAgICAgICAgdGhpcy50aW1lcklkRm9ySW5pdGlhbEF1dG9TY3JvbGwgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGFjdGl2ZUl0ZW0gPSB0aGlzLm1vZGVsLmZpbmRJbmRleChtZW51SXRlbSA9PiB0aGlzLmlzQWN0aXZlKG1lbnVJdGVtKSk7XG5cbiAgICAgICAgICAgIGlmIChhY3RpdmVJdGVtICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlU2Nyb2xsQmFyKGFjdGl2ZUl0ZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNsZWFyQXV0b1Njcm9sbEhhbmRsZXIoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnRpbWVySWRGb3JJbml0aWFsQXV0b1Njcm9sbCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZXJJZEZvckluaXRpYWxBdXRvU2Nyb2xsKTtcbiAgICAgICAgICAgIHRoaXMudGltZXJJZEZvckluaXRpYWxBdXRvU2Nyb2xsID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgaW5pdEJ1dHRvblN0YXRlKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5zY3JvbGxhYmxlKSB7XG4gICAgICAgICAgICAvLyBXZSBoYXZlIHRvIHdhaXQgZm9yIHRoZSByZW5kZXJpbmcgYW5kIHRoZW4gcmV0cmlldmUgdGhlIGFjdHVhbCBzaXplIGVsZW1lbnQgZnJvbSB0aGUgRE9NLlxuICAgICAgICAgICAgLy8gaW4gZnV0dXJlIGBQcm9taXNlLnJlc29sdmVgIGNhbiBiZSBjaGFuZ2VkIHRvIGBxdWV1ZU1pY3JvdGFza2AgKGlmIGllMTEgc3VwcG9ydCB3aWxsIGJlIGRyb3BwZWQpXG4gICAgICAgICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUJ1dHRvblN0YXRlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsUm91dGVyTW9kdWxlLFNoYXJlZE1vZHVsZSxSaXBwbGVNb2R1bGUsVG9vbHRpcE1vZHVsZV0sXG4gICAgZXhwb3J0czogW1RhYk1lbnUsUm91dGVyTW9kdWxlLFNoYXJlZE1vZHVsZSxUb29sdGlwTW9kdWxlXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtUYWJNZW51XVxufSlcbmV4cG9ydCBjbGFzcyBUYWJNZW51TW9kdWxlIHsgfVxuIl19