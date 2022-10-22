import { NgModule, Component, Input, Output, Inject, forwardRef, ViewChild, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomHandler } from 'primeng/dom';
import { ContextMenuService } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { ZIndexUtils } from 'primeng/utils';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TooltipModule } from 'primeng/tooltip';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/router";
import * as i3 from "primeng/ripple";
import * as i4 from "primeng/tooltip";
import * as i5 from "primeng/api";
export class ContextMenuSub {
    constructor(contextMenu) {
        this.leafClick = new EventEmitter();
        this.contextMenu = contextMenu;
    }
    ngOnInit() {
        this.activeItemKeyChangeSubscription = this.contextMenu.contextMenuService.activeItemKeyChange$.pipe(takeUntil(this.contextMenu.ngDestroy$)).subscribe((activeItemKey) => {
            this.activeItemKey = activeItemKey;
            if (this.isActive(this.parentItemKey) && DomHandler.hasClass(this.sublistViewChild.nativeElement, 'p-submenu-list-active')) {
                this.contextMenu.positionSubmenu(this.sublistViewChild.nativeElement);
            }
            this.contextMenu.cd.markForCheck();
        });
    }
    onItemMouseEnter(event, item, key) {
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }
        if (item.disabled) {
            this.activeItemKey = null;
            return;
        }
        if (item.items) {
            let childSublist = DomHandler.findSingle(event.currentTarget, '.p-submenu-list');
            DomHandler.addClass(childSublist, 'p-submenu-list-active');
        }
        this.contextMenu.contextMenuService.changeKey(key);
    }
    onItemMouseLeave(event, item) {
        if (item.disabled) {
            return;
        }
        if (this.contextMenu.el.nativeElement.contains(event.toElement)) {
            if (item.items) {
                this.contextMenu.removeActiveFromSubLists(event.currentTarget);
            }
            if (!this.root) {
                this.contextMenu.contextMenuService.changeKey(this.parentItemKey);
            }
        }
    }
    onItemClick(event, item, menuitem, key) {
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
        if (item.items) {
            let childSublist = DomHandler.findSingle(menuitem, '.p-submenu-list');
            if (childSublist) {
                if (this.isActive(key) && DomHandler.hasClass(childSublist, 'p-submenu-list-active')) {
                    this.contextMenu.removeActiveFromSubLists(menuitem);
                }
                else {
                    DomHandler.addClass(childSublist, 'p-submenu-list-active');
                }
                this.contextMenu.contextMenuService.changeKey(key);
            }
        }
        if (!item.items) {
            this.onLeafClick();
        }
    }
    onLeafClick() {
        if (this.root) {
            this.contextMenu.hide();
        }
        this.leafClick.emit();
    }
    getKey(index) {
        return this.root ? String(index) : this.parentItemKey + '_' + index;
    }
    isActive(key) {
        return (this.activeItemKey && (this.activeItemKey.startsWith(key + '_') || this.activeItemKey === key));
    }
}
ContextMenuSub.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ContextMenuSub, deps: [{ token: forwardRef(() => ContextMenu) }], target: i0.ɵɵFactoryTarget.Component });
ContextMenuSub.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.7", type: ContextMenuSub, selector: "p-contextMenuSub", inputs: { item: "item", root: "root", parentItemKey: "parentItemKey" }, outputs: { leafClick: "leafClick" }, host: { classAttribute: "p-element" }, viewQueries: [{ propertyName: "sublistViewChild", first: true, predicate: ["sublist"], descendants: true }, { propertyName: "menuitemViewChild", first: true, predicate: ["menuitem"], descendants: true }], ngImport: i0, template: `
        <ul #sublist [ngClass]="{'p-submenu-list':!root}">
            <ng-template ngFor let-child let-index="index" [ngForOf]="(root ? item : item.items)">
                <li *ngIf="child.separator" #menuitem class="p-menu-separator" [ngClass]="{'p-hidden': child.visible === false}" role="separator">
                <li *ngIf="!child.separator" #menuitem [ngClass]="{'p-menuitem':true,'p-menuitem-active': isActive(getKey(index)),'p-hidden': child.visible === false}" [ngStyle]="child.style" [class]="child.styleClass" pTooltip [tooltipOptions]="child.tooltipOptions"
                    (mouseenter)="onItemMouseEnter($event,child,getKey(index))" (mouseleave)="onItemMouseLeave($event,child)" role="none" [attr.data-ik]="getKey(index)">
                    <a *ngIf="!child.routerLink" [attr.href]="child.url ? child.url : null" [target]="child.target" [attr.title]="child.title" [attr.id]="child.id"
                        [attr.tabindex]="child.disabled ? null : '0'" (click)="onItemClick($event, child, menuitem, getKey(index))" [ngClass]="{'p-menuitem-link':true,'p-disabled':child.disabled}" pRipple
                        [attr.aria-haspopup]="item.items != null" [attr.aria-expanded]="isActive(getKey(index))">
                        <span class="p-menuitem-icon" *ngIf="child.icon" [ngClass]="child.icon" [ngStyle]="child.iconStyle"></span>
                        <span class="p-menuitem-text" *ngIf="child.escape !== false; else htmlLabel">{{child.label}}</span>
                        <ng-template #htmlLabel><span class="p-menuitem-text" [innerHTML]="child.label"></span></ng-template>
                        <span class="p-menuitem-badge" *ngIf="child.badge" [ngClass]="child.badgeStyleClass">{{child.badge}}</span>
                        <span class="p-submenu-icon pi pi-angle-right" *ngIf="child.items"></span>
                    </a>
                    <a *ngIf="child.routerLink" [routerLink]="child.routerLink" [queryParams]="child.queryParams" [routerLinkActive]="'p-menuitem-link-active'" role="menuitem"
                        [routerLinkActiveOptions]="child.routerLinkActiveOptions||{exact:false}" [target]="child.target" [attr.title]="child.title" [attr.id]="child.id" [attr.tabindex]="child.disabled ? null : '0'"
                        (click)="onItemClick($event, child, menuitem, getKey(index))" [ngClass]="{'p-menuitem-link':true,'p-disabled':child.disabled}"
                         pRipple [fragment]="child.fragment" [queryParamsHandling]="child.queryParamsHandling" [preserveFragment]="child.preserveFragment" [skipLocationChange]="child.skipLocationChange" [replaceUrl]="child.replaceUrl" [state]="child.state">
                        <span class="p-menuitem-icon" *ngIf="child.icon" [ngClass]="child.icon" [ngStyle]="child.iconStyle"></span>
                        <span class="p-menuitem-text" *ngIf="child.escape !== false; else htmlRouteLabel">{{child.label}}</span>
                        <ng-template #htmlRouteLabel><span class="p-menuitem-text" [innerHTML]="child.label"></span></ng-template>
                        <span class="p-menuitem-badge" *ngIf="child.badge" [ngClass]="child.badgeStyleClass">{{child.badge}}</span>
                        <span class="p-submenu-icon pi pi-angle-right" *ngIf="child.items"></span>
                    </a>
                    <p-contextMenuSub [parentItemKey]="getKey(index)" [item]="child" *ngIf="child.items" (leafClick)="onLeafClick()"></p-contextMenuSub>
                </li>
            </ng-template>
        </ul>
    `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i2.RouterLinkWithHref, selector: "a[routerLink],area[routerLink]", inputs: ["target", "queryParams", "fragment", "queryParamsHandling", "preserveFragment", "skipLocationChange", "replaceUrl", "state", "relativeTo", "routerLink"] }, { kind: "directive", type: i2.RouterLinkActive, selector: "[routerLinkActive]", inputs: ["routerLinkActiveOptions", "ariaCurrentWhenActive", "routerLinkActive"], outputs: ["isActiveChange"], exportAs: ["routerLinkActive"] }, { kind: "directive", type: i3.Ripple, selector: "[pRipple]" }, { kind: "directive", type: i4.Tooltip, selector: "[pTooltip]", inputs: ["tooltipPosition", "tooltipEvent", "appendTo", "positionStyle", "tooltipStyleClass", "tooltipZIndex", "escape", "showDelay", "hideDelay", "life", "positionTop", "positionLeft", "fitContent", "pTooltip", "tooltipDisabled", "tooltipOptions"] }, { kind: "component", type: ContextMenuSub, selector: "p-contextMenuSub", inputs: ["item", "root", "parentItemKey"], outputs: ["leafClick"] }], encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ContextMenuSub, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-contextMenuSub',
                    template: `
        <ul #sublist [ngClass]="{'p-submenu-list':!root}">
            <ng-template ngFor let-child let-index="index" [ngForOf]="(root ? item : item.items)">
                <li *ngIf="child.separator" #menuitem class="p-menu-separator" [ngClass]="{'p-hidden': child.visible === false}" role="separator">
                <li *ngIf="!child.separator" #menuitem [ngClass]="{'p-menuitem':true,'p-menuitem-active': isActive(getKey(index)),'p-hidden': child.visible === false}" [ngStyle]="child.style" [class]="child.styleClass" pTooltip [tooltipOptions]="child.tooltipOptions"
                    (mouseenter)="onItemMouseEnter($event,child,getKey(index))" (mouseleave)="onItemMouseLeave($event,child)" role="none" [attr.data-ik]="getKey(index)">
                    <a *ngIf="!child.routerLink" [attr.href]="child.url ? child.url : null" [target]="child.target" [attr.title]="child.title" [attr.id]="child.id"
                        [attr.tabindex]="child.disabled ? null : '0'" (click)="onItemClick($event, child, menuitem, getKey(index))" [ngClass]="{'p-menuitem-link':true,'p-disabled':child.disabled}" pRipple
                        [attr.aria-haspopup]="item.items != null" [attr.aria-expanded]="isActive(getKey(index))">
                        <span class="p-menuitem-icon" *ngIf="child.icon" [ngClass]="child.icon" [ngStyle]="child.iconStyle"></span>
                        <span class="p-menuitem-text" *ngIf="child.escape !== false; else htmlLabel">{{child.label}}</span>
                        <ng-template #htmlLabel><span class="p-menuitem-text" [innerHTML]="child.label"></span></ng-template>
                        <span class="p-menuitem-badge" *ngIf="child.badge" [ngClass]="child.badgeStyleClass">{{child.badge}}</span>
                        <span class="p-submenu-icon pi pi-angle-right" *ngIf="child.items"></span>
                    </a>
                    <a *ngIf="child.routerLink" [routerLink]="child.routerLink" [queryParams]="child.queryParams" [routerLinkActive]="'p-menuitem-link-active'" role="menuitem"
                        [routerLinkActiveOptions]="child.routerLinkActiveOptions||{exact:false}" [target]="child.target" [attr.title]="child.title" [attr.id]="child.id" [attr.tabindex]="child.disabled ? null : '0'"
                        (click)="onItemClick($event, child, menuitem, getKey(index))" [ngClass]="{'p-menuitem-link':true,'p-disabled':child.disabled}"
                         pRipple [fragment]="child.fragment" [queryParamsHandling]="child.queryParamsHandling" [preserveFragment]="child.preserveFragment" [skipLocationChange]="child.skipLocationChange" [replaceUrl]="child.replaceUrl" [state]="child.state">
                        <span class="p-menuitem-icon" *ngIf="child.icon" [ngClass]="child.icon" [ngStyle]="child.iconStyle"></span>
                        <span class="p-menuitem-text" *ngIf="child.escape !== false; else htmlRouteLabel">{{child.label}}</span>
                        <ng-template #htmlRouteLabel><span class="p-menuitem-text" [innerHTML]="child.label"></span></ng-template>
                        <span class="p-menuitem-badge" *ngIf="child.badge" [ngClass]="child.badgeStyleClass">{{child.badge}}</span>
                        <span class="p-submenu-icon pi pi-angle-right" *ngIf="child.items"></span>
                    </a>
                    <p-contextMenuSub [parentItemKey]="getKey(index)" [item]="child" *ngIf="child.items" (leafClick)="onLeafClick()"></p-contextMenuSub>
                </li>
            </ng-template>
        </ul>
    `,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        'class': 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [forwardRef(() => ContextMenu)]
                }] }]; }, propDecorators: { item: [{
                type: Input
            }], root: [{
                type: Input
            }], parentItemKey: [{
                type: Input
            }], leafClick: [{
                type: Output
            }], sublistViewChild: [{
                type: ViewChild,
                args: ['sublist']
            }], menuitemViewChild: [{
                type: ViewChild,
                args: ['menuitem']
            }] } });
export class ContextMenu {
    constructor(el, renderer, cd, zone, contextMenuService, config) {
        this.el = el;
        this.renderer = renderer;
        this.cd = cd;
        this.zone = zone;
        this.contextMenuService = contextMenuService;
        this.config = config;
        this.autoZIndex = true;
        this.baseZIndex = 0;
        this.triggerEvent = 'contextmenu';
        this.onShow = new EventEmitter();
        this.onHide = new EventEmitter();
        this.ngDestroy$ = new Subject();
        this.preventDocumentDefault = false;
    }
    ngAfterViewInit() {
        if (this.global) {
            const documentTarget = this.el ? this.el.nativeElement.ownerDocument : 'document';
            this.triggerEventListener = this.renderer.listen(documentTarget, this.triggerEvent, (event) => {
                this.show(event);
                event.preventDefault();
            });
        }
        else if (this.target) {
            this.triggerEventListener = this.renderer.listen(this.target, this.triggerEvent, (event) => {
                this.show(event);
                event.preventDefault();
            });
        }
        if (this.appendTo) {
            if (this.appendTo === 'body')
                document.body.appendChild(this.containerViewChild.nativeElement);
            else
                DomHandler.appendChild(this.containerViewChild.nativeElement, this.appendTo);
        }
    }
    show(event) {
        this.clearActiveItem();
        this.position(event);
        this.moveOnTop();
        this.containerViewChild.nativeElement.style.display = 'block';
        this.preventDocumentDefault = true;
        DomHandler.fadeIn(this.containerViewChild.nativeElement, 250);
        this.bindGlobalListeners();
        if (event) {
            event.preventDefault();
        }
        this.onShow.emit();
    }
    hide() {
        this.containerViewChild.nativeElement.style.display = 'none';
        if (this.autoZIndex) {
            ZIndexUtils.clear(this.containerViewChild.nativeElement);
        }
        this.clearActiveItem();
        this.unbindGlobalListeners();
        this.onHide.emit();
    }
    moveOnTop() {
        if (this.autoZIndex && this.containerViewChild && this.containerViewChild.nativeElement.style.display !== 'block') {
            ZIndexUtils.set('menu', this.containerViewChild.nativeElement, this.baseZIndex + this.config.zIndex.menu);
        }
    }
    toggle(event) {
        if (this.containerViewChild.nativeElement.offsetParent)
            this.hide();
        else
            this.show(event);
    }
    position(event) {
        if (event) {
            let left = event.pageX + 1;
            let top = event.pageY + 1;
            let width = this.containerViewChild.nativeElement.offsetParent ? this.containerViewChild.nativeElement.offsetWidth : DomHandler.getHiddenElementOuterWidth(this.containerViewChild.nativeElement);
            let height = this.containerViewChild.nativeElement.offsetParent ? this.containerViewChild.nativeElement.offsetHeight : DomHandler.getHiddenElementOuterHeight(this.containerViewChild.nativeElement);
            let viewport = DomHandler.getViewport();
            //flip
            if (left + width - document.body.scrollLeft > viewport.width) {
                left -= width;
            }
            //flip
            if (top + height - document.body.scrollTop > viewport.height) {
                top -= height;
            }
            //fit
            if (left < document.body.scrollLeft) {
                left = document.body.scrollLeft;
            }
            //fit
            if (top < document.body.scrollTop) {
                top = document.body.scrollTop;
            }
            this.containerViewChild.nativeElement.style.left = left + 'px';
            this.containerViewChild.nativeElement.style.top = top + 'px';
        }
    }
    positionSubmenu(sublist) {
        let parentMenuItem = sublist.parentElement.parentElement;
        let viewport = DomHandler.getViewport();
        let sublistWidth = sublist.offsetParent ? sublist.offsetWidth : DomHandler.getHiddenElementOuterWidth(sublist);
        let sublistHeight = sublist.offsetHeight ? sublist.offsetHeight : DomHandler.getHiddenElementOuterHeight(sublist);
        let itemOuterWidth = DomHandler.getOuterWidth(parentMenuItem.children[0]);
        let itemOuterHeight = DomHandler.getOuterHeight(parentMenuItem.children[0]);
        let containerOffset = DomHandler.getOffset(parentMenuItem.parentElement);
        sublist.style.zIndex = ++DomHandler.zindex;
        if ((parseInt(containerOffset.top) + itemOuterHeight + sublistHeight) > (viewport.height - DomHandler.calculateScrollbarHeight())) {
            sublist.style.removeProperty('top');
            sublist.style.bottom = '0px';
        }
        else {
            sublist.style.removeProperty('bottom');
            sublist.style.top = '0px';
        }
        if ((parseInt(containerOffset.left) + itemOuterWidth + sublistWidth) > (viewport.width - DomHandler.calculateScrollbarWidth())) {
            sublist.style.left = -sublistWidth + 'px';
        }
        else {
            sublist.style.left = itemOuterWidth + 'px';
        }
    }
    isItemMatched(menuitem) {
        return DomHandler.hasClass(menuitem, 'p-menuitem') && !DomHandler.hasClass(menuitem.children[0], 'p-disabled');
    }
    findNextItem(menuitem, isRepeated) {
        let nextMenuitem = menuitem.nextElementSibling;
        if (nextMenuitem) {
            return this.isItemMatched(nextMenuitem) ? nextMenuitem : this.findNextItem(nextMenuitem, isRepeated);
        }
        else {
            let firstItem = menuitem.parentElement.children[0];
            return this.isItemMatched(firstItem) ? firstItem : (!isRepeated ? this.findNextItem(firstItem, true) : null);
        }
    }
    findPrevItem(menuitem, isRepeated) {
        let prevMenuitem = menuitem.previousElementSibling;
        if (prevMenuitem) {
            return this.isItemMatched(prevMenuitem) ? prevMenuitem : this.findPrevItem(prevMenuitem, isRepeated);
        }
        else {
            let lastItem = menuitem.parentElement.children[menuitem.parentElement.children.length - 1];
            return this.isItemMatched(lastItem) ? lastItem : (!isRepeated ? this.findPrevItem(lastItem, true) : null);
        }
    }
    getActiveItem() {
        let activeItemKey = this.contextMenuService.activeItemKey;
        return activeItemKey == null ? null : DomHandler.findSingle(this.containerViewChild.nativeElement, '.p-menuitem[data-ik="' + activeItemKey + '"]');
    }
    clearActiveItem() {
        if (this.contextMenuService.activeItemKey) {
            this.removeActiveFromSubLists(this.containerViewChild.nativeElement);
            this.contextMenuService.reset();
        }
    }
    removeActiveFromSubLists(el) {
        let sublists = DomHandler.find(el, '.p-submenu-list-active');
        for (let sublist of sublists) {
            DomHandler.removeClass(sublist, 'p-submenu-list-active');
        }
    }
    removeActiveFromSublist(menuitem) {
        if (menuitem) {
            let sublist = DomHandler.findSingle(menuitem, '.p-submenu-list');
            if (sublist && DomHandler.hasClass(menuitem, 'p-submenu-list-active')) {
                DomHandler.removeClass(menuitem, 'p-submenu-list-active');
            }
        }
    }
    bindGlobalListeners() {
        if (!this.documentClickListener) {
            const documentTarget = this.el ? this.el.nativeElement.ownerDocument : 'document';
            this.documentClickListener = this.renderer.listen(documentTarget, 'click', (event) => {
                if (this.containerViewChild.nativeElement.offsetParent && this.isOutsideClicked(event) && !event.ctrlKey && event.button !== 2) {
                    this.hide();
                }
            });
            this.documentTriggerListener = this.renderer.listen(documentTarget, this.triggerEvent, (event) => {
                if (this.containerViewChild.nativeElement.offsetParent && this.isOutsideClicked(event) && !this.preventDocumentDefault) {
                    this.hide();
                }
                this.preventDocumentDefault = false;
            });
        }
        this.zone.runOutsideAngular(() => {
            if (!this.windowResizeListener) {
                this.windowResizeListener = this.onWindowResize.bind(this);
                window.addEventListener('resize', this.windowResizeListener);
            }
        });
        if (!this.documentKeydownListener) {
            const documentTarget = this.el ? this.el.nativeElement.ownerDocument : 'document';
            this.documentKeydownListener = this.renderer.listen(documentTarget, 'keydown', (event) => {
                let activeItem = this.getActiveItem();
                switch (event.key) {
                    case 'ArrowDown':
                        if (activeItem) {
                            this.removeActiveFromSublist(activeItem);
                            activeItem = this.findNextItem(activeItem);
                        }
                        else {
                            let firstItem = DomHandler.findSingle(this.containerViewChild.nativeElement, '.p-menuitem-link').parentElement;
                            activeItem = this.isItemMatched(firstItem) ? firstItem : this.findNextItem(firstItem);
                        }
                        if (activeItem) {
                            this.contextMenuService.changeKey(activeItem.getAttribute('data-ik'));
                        }
                        event.preventDefault();
                        break;
                    case 'ArrowUp':
                        if (activeItem) {
                            this.removeActiveFromSublist(activeItem);
                            activeItem = this.findPrevItem(activeItem);
                        }
                        else {
                            let sublist = DomHandler.findSingle(this.containerViewChild.nativeElement, 'ul');
                            let lastItem = sublist.children[sublist.children.length - 1];
                            activeItem = this.isItemMatched(lastItem) ? lastItem : this.findPrevItem(lastItem);
                        }
                        if (activeItem) {
                            this.contextMenuService.changeKey(activeItem.getAttribute('data-ik'));
                        }
                        event.preventDefault();
                        break;
                    case 'ArrowRight':
                        if (activeItem) {
                            let sublist = DomHandler.findSingle(activeItem, '.p-submenu-list');
                            if (sublist) {
                                DomHandler.addClass(sublist, 'p-submenu-list-active');
                                activeItem = DomHandler.findSingle(sublist, '.p-menuitem-link:not(.p-disabled)').parentElement;
                                if (activeItem) {
                                    this.contextMenuService.changeKey(activeItem.getAttribute('data-ik'));
                                }
                            }
                        }
                        event.preventDefault();
                        break;
                    case 'ArrowLeft':
                        if (activeItem) {
                            let sublist = activeItem.parentElement;
                            if (sublist && DomHandler.hasClass(sublist, 'p-submenu-list-active')) {
                                DomHandler.removeClass(sublist, 'p-submenu-list-active');
                                activeItem = sublist.parentElement.parentElement;
                                if (activeItem) {
                                    this.contextMenuService.changeKey(activeItem.getAttribute('data-ik'));
                                }
                            }
                        }
                        event.preventDefault();
                        break;
                    case 'Escape':
                        this.hide();
                        event.preventDefault();
                        break;
                    case 'Enter':
                        if (activeItem) {
                            this.handleItemClick(event, this.findModelItemFromKey(this.contextMenuService.activeItemKey), activeItem);
                        }
                        event.preventDefault();
                        break;
                    default:
                        break;
                }
            });
        }
    }
    findModelItemFromKey(key) {
        if (key == null || !this.model) {
            return null;
        }
        let indexes = key.split('_');
        return indexes.reduce((item, currentIndex) => {
            return item ? item.items[currentIndex] : this.model[currentIndex];
        }, null);
    }
    handleItemClick(event, item, menuitem) {
        if (!item || item.disabled) {
            return;
        }
        if (item.command) {
            item.command({
                originalEvent: event,
                item: item
            });
        }
        if (item.items) {
            let childSublist = DomHandler.findSingle(menuitem, '.p-submenu-list');
            if (childSublist) {
                if (DomHandler.hasClass(childSublist, 'p-submenu-list-active')) {
                    this.removeActiveFromSubLists(menuitem);
                }
                else {
                    DomHandler.addClass(childSublist, 'p-submenu-list-active');
                    this.positionSubmenu(childSublist);
                }
            }
        }
        if (!item.items) {
            this.hide();
        }
    }
    unbindGlobalListeners() {
        if (this.documentClickListener) {
            this.documentClickListener();
            this.documentClickListener = null;
        }
        if (this.documentTriggerListener) {
            this.documentTriggerListener();
            this.documentTriggerListener = null;
        }
        if (this.windowResizeListener) {
            window.removeEventListener('resize', this.windowResizeListener);
            this.windowResizeListener = null;
        }
        if (this.documentKeydownListener) {
            this.documentKeydownListener();
            this.documentKeydownListener = null;
        }
    }
    onWindowResize(event) {
        if (this.containerViewChild.nativeElement.offsetParent) {
            this.hide();
        }
    }
    isOutsideClicked(event) {
        return !(this.containerViewChild.nativeElement.isSameNode(event.target) || this.containerViewChild.nativeElement.contains(event.target));
    }
    ngOnDestroy() {
        this.unbindGlobalListeners();
        if (this.triggerEventListener) {
            this.triggerEventListener();
        }
        if (this.containerViewChild && this.autoZIndex) {
            ZIndexUtils.clear(this.containerViewChild.nativeElement);
        }
        if (this.appendTo) {
            this.el.nativeElement.appendChild(this.containerViewChild.nativeElement);
        }
        this.ngDestroy$.next(true);
        this.ngDestroy$.complete();
    }
}
ContextMenu.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ContextMenu, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i0.ChangeDetectorRef }, { token: i0.NgZone }, { token: i5.ContextMenuService }, { token: i5.PrimeNGConfig }], target: i0.ɵɵFactoryTarget.Component });
ContextMenu.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.7", type: ContextMenu, selector: "p-contextMenu", inputs: { model: "model", global: "global", target: "target", style: "style", styleClass: "styleClass", appendTo: "appendTo", autoZIndex: "autoZIndex", baseZIndex: "baseZIndex", triggerEvent: "triggerEvent" }, outputs: { onShow: "onShow", onHide: "onHide" }, host: { classAttribute: "p-element" }, viewQueries: [{ propertyName: "containerViewChild", first: true, predicate: ["container"], descendants: true }], ngImport: i0, template: `
        <div #container [ngClass]="'p-contextmenu p-component'" [class]="styleClass" [ngStyle]="style">
            <p-contextMenuSub [item]="model" [root]="true"></p-contextMenuSub>
        </div>
    `, isInline: true, styles: [".p-contextmenu{position:absolute;display:none}.p-contextmenu ul{margin:0;padding:0;list-style:none}.p-contextmenu .p-submenu-list{position:absolute;min-width:100%;z-index:1;display:none}.p-contextmenu .p-menuitem-link{cursor:pointer;display:flex;align-items:center;text-decoration:none;overflow:hidden;position:relative}.p-contextmenu .p-menuitem-text{line-height:1}.p-contextmenu .p-menuitem{position:relative}.p-contextmenu .p-menuitem-link .p-submenu-icon{margin-left:auto}.p-contextmenu .p-menuitem-active>p-contextmenusub>.p-submenu-list.p-submenu-list-active{display:block!important}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "component", type: ContextMenuSub, selector: "p-contextMenuSub", inputs: ["item", "root", "parentItemKey"], outputs: ["leafClick"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ContextMenu, decorators: [{
            type: Component,
            args: [{ selector: 'p-contextMenu', template: `
        <div #container [ngClass]="'p-contextmenu p-component'" [class]="styleClass" [ngStyle]="style">
            <p-contextMenuSub [item]="model" [root]="true"></p-contextMenuSub>
        </div>
    `, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        'class': 'p-element'
                    }, styles: [".p-contextmenu{position:absolute;display:none}.p-contextmenu ul{margin:0;padding:0;list-style:none}.p-contextmenu .p-submenu-list{position:absolute;min-width:100%;z-index:1;display:none}.p-contextmenu .p-menuitem-link{cursor:pointer;display:flex;align-items:center;text-decoration:none;overflow:hidden;position:relative}.p-contextmenu .p-menuitem-text{line-height:1}.p-contextmenu .p-menuitem{position:relative}.p-contextmenu .p-menuitem-link .p-submenu-icon{margin-left:auto}.p-contextmenu .p-menuitem-active>p-contextmenusub>.p-submenu-list.p-submenu-list-active{display:block!important}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i0.ChangeDetectorRef }, { type: i0.NgZone }, { type: i5.ContextMenuService }, { type: i5.PrimeNGConfig }]; }, propDecorators: { model: [{
                type: Input
            }], global: [{
                type: Input
            }], target: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], appendTo: [{
                type: Input
            }], autoZIndex: [{
                type: Input
            }], baseZIndex: [{
                type: Input
            }], triggerEvent: [{
                type: Input
            }], onShow: [{
                type: Output
            }], onHide: [{
                type: Output
            }], containerViewChild: [{
                type: ViewChild,
                args: ['container']
            }] } });
export class ContextMenuModule {
}
ContextMenuModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ContextMenuModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ContextMenuModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.7", ngImport: i0, type: ContextMenuModule, declarations: [ContextMenu, ContextMenuSub], imports: [CommonModule, RouterModule, RippleModule, TooltipModule], exports: [ContextMenu, RouterModule, TooltipModule] });
ContextMenuModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ContextMenuModule, providers: [ContextMenuService], imports: [CommonModule, RouterModule, RippleModule, TooltipModule, RouterModule, TooltipModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ContextMenuModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, RouterModule, RippleModule, TooltipModule],
                    exports: [ContextMenu, RouterModule, TooltipModule],
                    declarations: [ContextMenu, ContextMenuSub],
                    providers: [ContextMenuService]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dG1lbnUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvY29udGV4dG1lbnUvY29udGV4dG1lbnUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBQyxTQUFTLEVBQW9DLEtBQUssRUFBQyxNQUFNLEVBQVcsTUFBTSxFQUFDLFVBQVUsRUFBQyxTQUFTLEVBQVEsWUFBWSxFQUFDLHVCQUF1QixFQUFFLGlCQUFpQixFQUFxQixNQUFNLGVBQWUsQ0FBQztBQUMzTixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUN6QyxPQUFPLEVBQVksa0JBQWtCLEVBQWlCLE1BQU0sYUFBYSxDQUFDO0FBQzFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzVDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsT0FBTyxFQUFnQixNQUFNLE1BQU0sQ0FBQztBQUM3QyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDM0MsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGlCQUFpQixDQUFDOzs7Ozs7O0FBdUNoRCxNQUFNLE9BQU8sY0FBYztJQXNCdkIsWUFBbUQsV0FBVztRQWRwRCxjQUFTLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFleEQsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUEwQixDQUFDO0lBQ2xELENBQUM7SUFFRCxRQUFRO1FBQ0osSUFBSSxDQUFDLCtCQUErQixHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJ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SztnQkFFRyxLQUFLO3NCQUFiLEtBQUs7Z0JBRUcsVUFBVTtzQkFBbEIsS0FBSztnQkFFRyxRQUFRO3NCQUFoQixLQUFLO2dCQUVHLFVBQVU7c0JBQWxCLEtBQUs7Z0JBRUcsVUFBVTtzQkFBbEIsS0FBSztnQkFFRyxZQUFZO3NCQUFwQixLQUFLO2dCQUVJLE1BQU07c0JBQWYsTUFBTTtnQkFFRyxNQUFNO3NCQUFmLE1BQU07Z0JBRWlCLGtCQUFrQjtzQkFBekMsU0FBUzt1QkFBQyxXQUFXOztBQThhMUIsTUFBTSxPQUFPLGlCQUFpQjs7OEdBQWpCLGlCQUFpQjsrR0FBakIsaUJBQWlCLGlCQXRjakIsV0FBVyxFQTdJWCxjQUFjLGFBOGtCYixZQUFZLEVBQUMsWUFBWSxFQUFDLFlBQVksRUFBQyxhQUFhLGFBamNyRCxXQUFXLEVBa2NFLFlBQVksRUFBQyxhQUFhOytHQUl2QyxpQkFBaUIsYUFGZixDQUFDLGtCQUFrQixDQUFDLFlBSHJCLFlBQVksRUFBQyxZQUFZLEVBQUMsWUFBWSxFQUFDLGFBQWEsRUFDeEMsWUFBWSxFQUFDLGFBQWE7MkZBSXZDLGlCQUFpQjtrQkFON0IsUUFBUTttQkFBQztvQkFDTixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUMsWUFBWSxFQUFDLFlBQVksRUFBQyxhQUFhLENBQUM7b0JBQy9ELE9BQU8sRUFBRSxDQUFDLFdBQVcsRUFBQyxZQUFZLEVBQUMsYUFBYSxDQUFDO29CQUNqRCxZQUFZLEVBQUUsQ0FBQyxXQUFXLEVBQUMsY0FBYyxDQUFDO29CQUMxQyxTQUFTLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQztpQkFDbEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSxDb21wb25lbnQsRWxlbWVudFJlZixBZnRlclZpZXdJbml0LE9uRGVzdHJveSxJbnB1dCxPdXRwdXQsUmVuZGVyZXIyLEluamVjdCxmb3J3YXJkUmVmLFZpZXdDaGlsZCxOZ1pvbmUsRXZlbnRFbWl0dGVyLENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBWaWV3RW5jYXBzdWxhdGlvbiwgQ2hhbmdlRGV0ZWN0b3JSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBEb21IYW5kbGVyIH0gZnJvbSAncHJpbWVuZy9kb20nO1xuaW1wb3J0IHsgTWVudUl0ZW0sIENvbnRleHRNZW51U2VydmljZSwgUHJpbWVOR0NvbmZpZyB9IGZyb20gJ3ByaW1lbmcvYXBpJztcbmltcG9ydCB7IFJpcHBsZU1vZHVsZSB9IGZyb20gJ3ByaW1lbmcvcmlwcGxlJztcbmltcG9ydCB7IFpJbmRleFV0aWxzIH0gZnJvbSAncHJpbWVuZy91dGlscyc7XG5pbXBvcnQgeyBSb3V0ZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgU3ViamVjdCwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBUb29sdGlwTW9kdWxlIH0gZnJvbSAncHJpbWVuZy90b29sdGlwJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdwLWNvbnRleHRNZW51U3ViJyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8dWwgI3N1Ymxpc3QgW25nQ2xhc3NdPVwieydwLXN1Ym1lbnUtbGlzdCc6IXJvb3R9XCI+XG4gICAgICAgICAgICA8bmctdGVtcGxhdGUgbmdGb3IgbGV0LWNoaWxkIGxldC1pbmRleD1cImluZGV4XCIgW25nRm9yT2ZdPVwiKHJvb3QgPyBpdGVtIDogaXRlbS5pdGVtcylcIj5cbiAgICAgICAgICAgICAgICA8bGkgKm5nSWY9XCJjaGlsZC5zZXBhcmF0b3JcIiAjbWVudWl0ZW0gY2xhc3M9XCJwLW1lbnUtc2VwYXJhdG9yXCIgW25nQ2xhc3NdPVwieydwLWhpZGRlbic6IGNoaWxkLnZpc2libGUgPT09IGZhbHNlfVwiIHJvbGU9XCJzZXBhcmF0b3JcIj5cbiAgICAgICAgICAgICAgICA8bGkgKm5nSWY9XCIhY2hpbGQuc2VwYXJhdG9yXCIgI21lbnVpdGVtIFtuZ0NsYXNzXT1cInsncC1tZW51aXRlbSc6dHJ1ZSwncC1tZW51aXRlbS1hY3RpdmUnOiBpc0FjdGl2ZShnZXRLZXkoaW5kZXgpKSwncC1oaWRkZW4nOiBjaGlsZC52aXNpYmxlID09PSBmYWxzZX1cIiBbbmdTdHlsZV09XCJjaGlsZC5zdHlsZVwiIFtjbGFzc109XCJjaGlsZC5zdHlsZUNsYXNzXCIgcFRvb2x0aXAgW3Rvb2x0aXBPcHRpb25zXT1cImNoaWxkLnRvb2x0aXBPcHRpb25zXCJcbiAgICAgICAgICAgICAgICAgICAgKG1vdXNlZW50ZXIpPVwib25JdGVtTW91c2VFbnRlcigkZXZlbnQsY2hpbGQsZ2V0S2V5KGluZGV4KSlcIiAobW91c2VsZWF2ZSk9XCJvbkl0ZW1Nb3VzZUxlYXZlKCRldmVudCxjaGlsZClcIiByb2xlPVwibm9uZVwiIFthdHRyLmRhdGEtaWtdPVwiZ2V0S2V5KGluZGV4KVwiPlxuICAgICAgICAgICAgICAgICAgICA8YSAqbmdJZj1cIiFjaGlsZC5yb3V0ZXJMaW5rXCIgW2F0dHIuaHJlZl09XCJjaGlsZC51cmwgPyBjaGlsZC51cmwgOiBudWxsXCIgW3RhcmdldF09XCJjaGlsZC50YXJnZXRcIiBbYXR0ci50aXRsZV09XCJjaGlsZC50aXRsZVwiIFthdHRyLmlkXT1cImNoaWxkLmlkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFthdHRyLnRhYmluZGV4XT1cImNoaWxkLmRpc2FibGVkID8gbnVsbCA6ICcwJ1wiIChjbGljayk9XCJvbkl0ZW1DbGljaygkZXZlbnQsIGNoaWxkLCBtZW51aXRlbSwgZ2V0S2V5KGluZGV4KSlcIiBbbmdDbGFzc109XCJ7J3AtbWVudWl0ZW0tbGluayc6dHJ1ZSwncC1kaXNhYmxlZCc6Y2hpbGQuZGlzYWJsZWR9XCIgcFJpcHBsZVxuICAgICAgICAgICAgICAgICAgICAgICAgW2F0dHIuYXJpYS1oYXNwb3B1cF09XCJpdGVtLml0ZW1zICE9IG51bGxcIiBbYXR0ci5hcmlhLWV4cGFuZGVkXT1cImlzQWN0aXZlKGdldEtleShpbmRleCkpXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtbWVudWl0ZW0taWNvblwiICpuZ0lmPVwiY2hpbGQuaWNvblwiIFtuZ0NsYXNzXT1cImNoaWxkLmljb25cIiBbbmdTdHlsZV09XCJjaGlsZC5pY29uU3R5bGVcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtbWVudWl0ZW0tdGV4dFwiICpuZ0lmPVwiY2hpbGQuZXNjYXBlICE9PSBmYWxzZTsgZWxzZSBodG1sTGFiZWxcIj57e2NoaWxkLmxhYmVsfX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgI2h0bWxMYWJlbD48c3BhbiBjbGFzcz1cInAtbWVudWl0ZW0tdGV4dFwiIFtpbm5lckhUTUxdPVwiY2hpbGQubGFiZWxcIj48L3NwYW4+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC1tZW51aXRlbS1iYWRnZVwiICpuZ0lmPVwiY2hpbGQuYmFkZ2VcIiBbbmdDbGFzc109XCJjaGlsZC5iYWRnZVN0eWxlQ2xhc3NcIj57e2NoaWxkLmJhZGdlfX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtc3VibWVudS1pY29uIHBpIHBpLWFuZ2xlLXJpZ2h0XCIgKm5nSWY9XCJjaGlsZC5pdGVtc1wiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICA8YSAqbmdJZj1cImNoaWxkLnJvdXRlckxpbmtcIiBbcm91dGVyTGlua109XCJjaGlsZC5yb3V0ZXJMaW5rXCIgW3F1ZXJ5UGFyYW1zXT1cImNoaWxkLnF1ZXJ5UGFyYW1zXCIgW3JvdXRlckxpbmtBY3RpdmVdPVwiJ3AtbWVudWl0ZW0tbGluay1hY3RpdmUnXCIgcm9sZT1cIm1lbnVpdGVtXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtyb3V0ZXJMaW5rQWN0aXZlT3B0aW9uc109XCJjaGlsZC5yb3V0ZXJMaW5rQWN0aXZlT3B0aW9uc3x8e2V4YWN0OmZhbHNlfVwiIFt0YXJnZXRdPVwiY2hpbGQudGFyZ2V0XCIgW2F0dHIudGl0bGVdPVwiY2hpbGQudGl0bGVcIiBbYXR0ci5pZF09XCJjaGlsZC5pZFwiIFthdHRyLnRhYmluZGV4XT1cImNoaWxkLmRpc2FibGVkID8gbnVsbCA6ICcwJ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAoY2xpY2spPVwib25JdGVtQ2xpY2soJGV2ZW50LCBjaGlsZCwgbWVudWl0ZW0sIGdldEtleShpbmRleCkpXCIgW25nQ2xhc3NdPVwieydwLW1lbnVpdGVtLWxpbmsnOnRydWUsJ3AtZGlzYWJsZWQnOmNoaWxkLmRpc2FibGVkfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgcFJpcHBsZSBbZnJhZ21lbnRdPVwiY2hpbGQuZnJhZ21lbnRcIiBbcXVlcnlQYXJhbXNIYW5kbGluZ109XCJjaGlsZC5xdWVyeVBhcmFtc0hhbmRsaW5nXCIgW3ByZXNlcnZlRnJhZ21lbnRdPVwiY2hpbGQucHJlc2VydmVGcmFnbWVudFwiIFtza2lwTG9jYXRpb25DaGFuZ2VdPVwiY2hpbGQuc2tpcExvY2F0aW9uQ2hhbmdlXCIgW3JlcGxhY2VVcmxdPVwiY2hpbGQucmVwbGFjZVVybFwiIFtzdGF0ZV09XCJjaGlsZC5zdGF0ZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwLW1lbnVpdGVtLWljb25cIiAqbmdJZj1cImNoaWxkLmljb25cIiBbbmdDbGFzc109XCJjaGlsZC5pY29uXCIgW25nU3R5bGVdPVwiY2hpbGQuaWNvblN0eWxlXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwLW1lbnVpdGVtLXRleHRcIiAqbmdJZj1cImNoaWxkLmVzY2FwZSAhPT0gZmFsc2U7IGVsc2UgaHRtbFJvdXRlTGFiZWxcIj57e2NoaWxkLmxhYmVsfX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgI2h0bWxSb3V0ZUxhYmVsPjxzcGFuIGNsYXNzPVwicC1tZW51aXRlbS10ZXh0XCIgW2lubmVySFRNTF09XCJjaGlsZC5sYWJlbFwiPjwvc3Bhbj48L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwLW1lbnVpdGVtLWJhZGdlXCIgKm5nSWY9XCJjaGlsZC5iYWRnZVwiIFtuZ0NsYXNzXT1cImNoaWxkLmJhZGdlU3R5bGVDbGFzc1wiPnt7Y2hpbGQuYmFkZ2V9fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC1zdWJtZW51LWljb24gcGkgcGktYW5nbGUtcmlnaHRcIiAqbmdJZj1cImNoaWxkLml0ZW1zXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICAgIDxwLWNvbnRleHRNZW51U3ViIFtwYXJlbnRJdGVtS2V5XT1cImdldEtleShpbmRleClcIiBbaXRlbV09XCJjaGlsZFwiICpuZ0lmPVwiY2hpbGQuaXRlbXNcIiAobGVhZkNsaWNrKT1cIm9uTGVhZkNsaWNrKClcIj48L3AtY29udGV4dE1lbnVTdWI+XG4gICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgIDwvdWw+XG4gICAgYCxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgJ2NsYXNzJzogJ3AtZWxlbWVudCdcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIENvbnRleHRNZW51U3ViIHtcblxuICAgIEBJbnB1dCgpIGl0ZW06IE1lbnVJdGVtO1xuXG4gICAgQElucHV0KCkgcm9vdDogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIHBhcmVudEl0ZW1LZXk6IGFueTtcblxuICAgIEBPdXRwdXQoKSBsZWFmQ2xpY2s6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQFZpZXdDaGlsZCgnc3VibGlzdCcpIHN1Ymxpc3RWaWV3Q2hpbGQ6IEVsZW1lbnRSZWY7XG5cbiAgICBAVmlld0NoaWxkKCdtZW51aXRlbScpIG1lbnVpdGVtVmlld0NoaWxkOiBFbGVtZW50UmVmO1xuXG4gICAgY29udGV4dE1lbnU6IENvbnRleHRNZW51O1xuXG4gICAgYWN0aXZlSXRlbUtleTogc3RyaW5nO1xuXG4gICAgaGlkZVRpbWVvdXQ6IGFueTtcblxuICAgIGFjdGl2ZUl0ZW1LZXlDaGFuZ2VTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBDb250ZXh0TWVudSkpIGNvbnRleHRNZW51KSB7XG4gICAgICAgIHRoaXMuY29udGV4dE1lbnUgPSBjb250ZXh0TWVudSBhcyBDb250ZXh0TWVudTtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5hY3RpdmVJdGVtS2V5Q2hhbmdlU3Vic2NyaXB0aW9uID0gdGhpcy5jb250ZXh0TWVudS5jb250ZXh0TWVudVNlcnZpY2UuYWN0aXZlSXRlbUtleUNoYW5nZSQucGlwZSh0YWtlVW50aWwodGhpcy5jb250ZXh0TWVudS5uZ0Rlc3Ryb3kkKSkuc3Vic2NyaWJlKChhY3RpdmVJdGVtS2V5KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZUl0ZW1LZXkgPSBhY3RpdmVJdGVtS2V5O1xuXG4gICAgICAgICAgICBpZiAodGhpcy5pc0FjdGl2ZSh0aGlzLnBhcmVudEl0ZW1LZXkpICYmIERvbUhhbmRsZXIuaGFzQ2xhc3ModGhpcy5zdWJsaXN0Vmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQsICdwLXN1Ym1lbnUtbGlzdC1hY3RpdmUnKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dE1lbnUucG9zaXRpb25TdWJtZW51KHRoaXMuc3VibGlzdFZpZXdDaGlsZC5uYXRpdmVFbGVtZW50KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5jb250ZXh0TWVudS5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgb25JdGVtTW91c2VFbnRlcihldmVudCwgaXRlbSwga2V5KSB7XG4gICAgICAgIGlmICh0aGlzLmhpZGVUaW1lb3V0KSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5oaWRlVGltZW91dCk7XG4gICAgICAgICAgICB0aGlzLmhpZGVUaW1lb3V0ID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpdGVtLmRpc2FibGVkKSB7XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZUl0ZW1LZXkgPSBudWxsO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGl0ZW0uaXRlbXMpIHtcbiAgICAgICAgICAgIGxldCBjaGlsZFN1Ymxpc3QgPSBEb21IYW5kbGVyLmZpbmRTaW5nbGUoZXZlbnQuY3VycmVudFRhcmdldCwgJy5wLXN1Ym1lbnUtbGlzdCcpO1xuICAgICAgICAgICAgRG9tSGFuZGxlci5hZGRDbGFzcyhjaGlsZFN1Ymxpc3QsICdwLXN1Ym1lbnUtbGlzdC1hY3RpdmUnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29udGV4dE1lbnUuY29udGV4dE1lbnVTZXJ2aWNlLmNoYW5nZUtleShrZXkpO1xuICAgIH1cblxuICAgIG9uSXRlbU1vdXNlTGVhdmUoZXZlbnQsIGl0ZW0pIHtcbiAgICAgICAgaWYgKGl0ZW0uZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmNvbnRleHRNZW51LmVsLm5hdGl2ZUVsZW1lbnQuY29udGFpbnMoPE5vZGU+IGV2ZW50LnRvRWxlbWVudCkpIHtcbiAgICAgICAgICAgIGlmIChpdGVtLml0ZW1zKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0TWVudS5yZW1vdmVBY3RpdmVGcm9tU3ViTGlzdHMoZXZlbnQuY3VycmVudFRhcmdldCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5yb290KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0TWVudS5jb250ZXh0TWVudVNlcnZpY2UuY2hhbmdlS2V5KHRoaXMucGFyZW50SXRlbUtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkl0ZW1DbGljayhldmVudCwgaXRlbSwgbWVudWl0ZW0sIGtleSkge1xuICAgICAgICBpZiAoaXRlbS5kaXNhYmxlZCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaXRlbS51cmwgJiYgIWl0ZW0ucm91dGVyTGluaykge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpdGVtLmNvbW1hbmQpIHtcbiAgICAgICAgICAgIGl0ZW0uY29tbWFuZCh7XG4gICAgICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZlbnQsXG4gICAgICAgICAgICAgICAgaXRlbTogaXRlbVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXRlbS5pdGVtcykge1xuICAgICAgICAgICAgbGV0IGNoaWxkU3VibGlzdCA9IERvbUhhbmRsZXIuZmluZFNpbmdsZShtZW51aXRlbSwgJy5wLXN1Ym1lbnUtbGlzdCcpO1xuXG4gICAgICAgICAgICBpZiAoY2hpbGRTdWJsaXN0KSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNBY3RpdmUoa2V5KSAmJiBEb21IYW5kbGVyLmhhc0NsYXNzKGNoaWxkU3VibGlzdCwgJ3Atc3VibWVudS1saXN0LWFjdGl2ZScpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dE1lbnUucmVtb3ZlQWN0aXZlRnJvbVN1Ykxpc3RzKG1lbnVpdGVtKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIERvbUhhbmRsZXIuYWRkQ2xhc3MoY2hpbGRTdWJsaXN0LCAncC1zdWJtZW51LWxpc3QtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0TWVudS5jb250ZXh0TWVudVNlcnZpY2UuY2hhbmdlS2V5KGtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWl0ZW0uaXRlbXMpIHtcbiAgICAgICAgICAgIHRoaXMub25MZWFmQ2xpY2soKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uTGVhZkNsaWNrKCkge1xuICAgICAgICBpZiAodGhpcy5yb290KSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHRNZW51LmhpZGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubGVhZkNsaWNrLmVtaXQoKTtcbiAgICB9XG5cbiAgICBnZXRLZXkoaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucm9vdCA/IFN0cmluZyhpbmRleCkgOiB0aGlzLnBhcmVudEl0ZW1LZXkgKyAnXycgKyBpbmRleDtcbiAgICB9XG5cbiAgICBpc0FjdGl2ZShrZXkpIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLmFjdGl2ZUl0ZW1LZXkgJiYodGhpcy5hY3RpdmVJdGVtS2V5LnN0YXJ0c1dpdGgoa2V5ICsgJ18nKSB8fCB0aGlzLmFjdGl2ZUl0ZW1LZXkgPT09IGtleSkpO1xuICAgIH1cbn1cblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdwLWNvbnRleHRNZW51JyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8ZGl2ICNjb250YWluZXIgW25nQ2xhc3NdPVwiJ3AtY29udGV4dG1lbnUgcC1jb21wb25lbnQnXCIgW2NsYXNzXT1cInN0eWxlQ2xhc3NcIiBbbmdTdHlsZV09XCJzdHlsZVwiPlxuICAgICAgICAgICAgPHAtY29udGV4dE1lbnVTdWIgW2l0ZW1dPVwibW9kZWxcIiBbcm9vdF09XCJ0cnVlXCI+PC9wLWNvbnRleHRNZW51U3ViPlxuICAgICAgICA8L2Rpdj5cbiAgICBgLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gICAgc3R5bGVVcmxzOiBbJy4vY29udGV4dG1lbnUuY3NzJ10sXG4gICAgaG9zdDoge1xuICAgICAgICAnY2xhc3MnOiAncC1lbGVtZW50J1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgQ29udGV4dE1lbnUgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuXG4gICAgQElucHV0KCkgbW9kZWw6IE1lbnVJdGVtW107XG5cbiAgICBASW5wdXQoKSBnbG9iYWw6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSB0YXJnZXQ6IGFueTtcblxuICAgIEBJbnB1dCgpIHN0eWxlOiBhbnk7XG5cbiAgICBASW5wdXQoKSBzdHlsZUNsYXNzOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBhcHBlbmRUbzogYW55O1xuXG4gICAgQElucHV0KCkgYXV0b1pJbmRleDogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBASW5wdXQoKSBiYXNlWkluZGV4OiBudW1iZXIgPSAwO1xuXG4gICAgQElucHV0KCkgdHJpZ2dlckV2ZW50OiBzdHJpbmcgPSAnY29udGV4dG1lbnUnO1xuXG4gICAgQE91dHB1dCgpIG9uU2hvdzogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25IaWRlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBWaWV3Q2hpbGQoJ2NvbnRhaW5lcicpIGNvbnRhaW5lclZpZXdDaGlsZDogRWxlbWVudFJlZjtcblxuICAgIGRvY3VtZW50Q2xpY2tMaXN0ZW5lcjogYW55O1xuXG4gICAgZG9jdW1lbnRUcmlnZ2VyTGlzdGVuZXI6IGFueTtcblxuICAgIGRvY3VtZW50S2V5ZG93bkxpc3RlbmVyOiBhbnk7XG5cbiAgICB3aW5kb3dSZXNpemVMaXN0ZW5lcjogYW55O1xuXG4gICAgdHJpZ2dlckV2ZW50TGlzdGVuZXI6IGFueTtcblxuICAgIG5nRGVzdHJveSQgPSBuZXcgU3ViamVjdCgpO1xuXG4gICAgcHJldmVudERvY3VtZW50RGVmYXVsdDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIGVsOiBFbGVtZW50UmVmLCBwdWJsaWMgcmVuZGVyZXI6IFJlbmRlcmVyMiwgcHVibGljIGNkOiBDaGFuZ2VEZXRlY3RvclJlZiwgcHVibGljIHpvbmU6IE5nWm9uZSwgcHVibGljIGNvbnRleHRNZW51U2VydmljZTogQ29udGV4dE1lbnVTZXJ2aWNlLCBwcml2YXRlIGNvbmZpZzogUHJpbWVOR0NvbmZpZykgeyB9XG5cbiAgICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgICAgIGlmICh0aGlzLmdsb2JhbCkge1xuICAgICAgICAgICAgY29uc3QgZG9jdW1lbnRUYXJnZXQ6IGFueSA9IHRoaXMuZWwgPyB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQub3duZXJEb2N1bWVudCA6ICdkb2N1bWVudCc7XG5cbiAgICAgICAgICAgIHRoaXMudHJpZ2dlckV2ZW50TGlzdGVuZXIgPSB0aGlzLnJlbmRlcmVyLmxpc3Rlbihkb2N1bWVudFRhcmdldCwgdGhpcy50cmlnZ2VyRXZlbnQsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvdyhldmVudCk7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMudGFyZ2V0KSB7XG4gICAgICAgICAgICB0aGlzLnRyaWdnZXJFdmVudExpc3RlbmVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy50YXJnZXQsIHRoaXMudHJpZ2dlckV2ZW50LCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNob3coZXZlbnQpO1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmFwcGVuZFRvKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5hcHBlbmRUbyA9PT0gJ2JvZHknKVxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5jb250YWluZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudCk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgRG9tSGFuZGxlci5hcHBlbmRDaGlsZCh0aGlzLmNvbnRhaW5lclZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LCB0aGlzLmFwcGVuZFRvKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNob3coZXZlbnQ/OiBNb3VzZUV2ZW50KSB7XG4gICAgICAgIHRoaXMuY2xlYXJBY3RpdmVJdGVtKCk7XG4gICAgICAgIHRoaXMucG9zaXRpb24oZXZlbnQpO1xuICAgICAgICB0aGlzLm1vdmVPblRvcCgpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lclZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICB0aGlzLnByZXZlbnREb2N1bWVudERlZmF1bHQgPSB0cnVlO1xuICAgICAgICBEb21IYW5kbGVyLmZhZGVJbih0aGlzLmNvbnRhaW5lclZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LCAyNTApO1xuICAgICAgICB0aGlzLmJpbmRHbG9iYWxMaXN0ZW5lcnMoKTtcblxuICAgICAgICBpZiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm9uU2hvdy5lbWl0KCk7XG4gICAgfVxuXG4gICAgaGlkZSgpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXG4gICAgICAgIGlmICh0aGlzLmF1dG9aSW5kZXgpIHtcbiAgICAgICAgICAgIFpJbmRleFV0aWxzLmNsZWFyKHRoaXMuY29udGFpbmVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jbGVhckFjdGl2ZUl0ZW0oKTtcbiAgICAgICAgdGhpcy51bmJpbmRHbG9iYWxMaXN0ZW5lcnMoKTtcbiAgICAgICAgdGhpcy5vbkhpZGUuZW1pdCgpO1xuICAgIH1cblxuICAgIG1vdmVPblRvcCgpIHtcbiAgICAgICAgaWYgKHRoaXMuYXV0b1pJbmRleCAmJiB0aGlzLmNvbnRhaW5lclZpZXdDaGlsZCAmJiB0aGlzLmNvbnRhaW5lclZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LnN0eWxlLmRpc3BsYXkgIT09ICdibG9jaycpIHtcbiAgICAgICAgICAgIFpJbmRleFV0aWxzLnNldCgnbWVudScsIHRoaXMuY29udGFpbmVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQsIHRoaXMuYmFzZVpJbmRleCArIHRoaXMuY29uZmlnLnpJbmRleC5tZW51KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRvZ2dsZShldmVudD86IE1vdXNlRXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuY29udGFpbmVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQub2Zmc2V0UGFyZW50KVxuICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRoaXMuc2hvdyhldmVudCk7XG4gICAgfVxuXG4gICAgcG9zaXRpb24oZXZlbnQ/OiBNb3VzZUV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudCkge1xuICAgICAgICAgICAgbGV0IGxlZnQgPSBldmVudC5wYWdlWCArIDE7XG4gICAgICAgICAgICBsZXQgdG9wID0gZXZlbnQucGFnZVkgKyAxO1xuICAgICAgICAgICAgbGV0IHdpZHRoID0gdGhpcy5jb250YWluZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5vZmZzZXRQYXJlbnQgPyB0aGlzLmNvbnRhaW5lclZpZXdDaGlsZC5uYXRpdmVFbGVtZW50Lm9mZnNldFdpZHRoIDogRG9tSGFuZGxlci5nZXRIaWRkZW5FbGVtZW50T3V0ZXJXaWR0aCh0aGlzLmNvbnRhaW5lclZpZXdDaGlsZC5uYXRpdmVFbGVtZW50KTtcbiAgICAgICAgICAgIGxldCBoZWlnaHQgPSB0aGlzLmNvbnRhaW5lclZpZXdDaGlsZC5uYXRpdmVFbGVtZW50Lm9mZnNldFBhcmVudCA/IHRoaXMuY29udGFpbmVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQub2Zmc2V0SGVpZ2h0IDogRG9tSGFuZGxlci5nZXRIaWRkZW5FbGVtZW50T3V0ZXJIZWlnaHQodGhpcy5jb250YWluZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudCk7XG4gICAgICAgICAgICBsZXQgdmlld3BvcnQgPSBEb21IYW5kbGVyLmdldFZpZXdwb3J0KCk7XG5cbiAgICAgICAgICAgIC8vZmxpcFxuICAgICAgICAgICAgaWYgKGxlZnQgKyB3aWR0aCAtIGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCA+IHZpZXdwb3J0LndpZHRoKSB7XG4gICAgICAgICAgICAgICAgbGVmdCAtPSB3aWR0aDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9mbGlwXG4gICAgICAgICAgICBpZiAodG9wICsgaGVpZ2h0IC0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgPiB2aWV3cG9ydC5oZWlnaHQpIHtcbiAgICAgICAgICAgICAgICB0b3AgLT0gaGVpZ2h0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL2ZpdFxuICAgICAgICAgICAgaWYgKGxlZnQgPCBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQpIHtcbiAgICAgICAgICAgICAgICBsZWZ0ID0gZG9jdW1lbnQuYm9keS5zY3JvbGxMZWZ0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL2ZpdFxuICAgICAgICAgICAgaWYgKHRvcCA8IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wKSB7XG4gICAgICAgICAgICAgICAgdG9wID0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3A7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuc3R5bGUubGVmdCA9IGxlZnQgKyAncHgnO1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zdHlsZS50b3AgPSB0b3AgKyAncHgnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcG9zaXRpb25TdWJtZW51KHN1Ymxpc3QpIHtcbiAgICAgICAgbGV0IHBhcmVudE1lbnVJdGVtID0gc3VibGlzdC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIGxldCB2aWV3cG9ydCA9IERvbUhhbmRsZXIuZ2V0Vmlld3BvcnQoKTtcbiAgICAgICAgbGV0IHN1Ymxpc3RXaWR0aCA9IHN1Ymxpc3Qub2Zmc2V0UGFyZW50ID8gc3VibGlzdC5vZmZzZXRXaWR0aCA6IERvbUhhbmRsZXIuZ2V0SGlkZGVuRWxlbWVudE91dGVyV2lkdGgoc3VibGlzdCk7XG4gICAgICAgIGxldCBzdWJsaXN0SGVpZ2h0ID0gc3VibGlzdC5vZmZzZXRIZWlnaHQgPyBzdWJsaXN0Lm9mZnNldEhlaWdodCA6IERvbUhhbmRsZXIuZ2V0SGlkZGVuRWxlbWVudE91dGVySGVpZ2h0KHN1Ymxpc3QpO1xuICAgICAgICBsZXQgaXRlbU91dGVyV2lkdGggPSBEb21IYW5kbGVyLmdldE91dGVyV2lkdGgocGFyZW50TWVudUl0ZW0uY2hpbGRyZW5bMF0pO1xuICAgICAgICBsZXQgaXRlbU91dGVySGVpZ2h0ID0gRG9tSGFuZGxlci5nZXRPdXRlckhlaWdodChwYXJlbnRNZW51SXRlbS5jaGlsZHJlblswXSk7XG4gICAgICAgIGxldCBjb250YWluZXJPZmZzZXQgPSBEb21IYW5kbGVyLmdldE9mZnNldChwYXJlbnRNZW51SXRlbS5wYXJlbnRFbGVtZW50KTtcblxuICAgICAgICBzdWJsaXN0LnN0eWxlLnpJbmRleCA9ICsrRG9tSGFuZGxlci56aW5kZXg7XG5cbiAgICAgICAgaWYgKChwYXJzZUludChjb250YWluZXJPZmZzZXQudG9wKSArIGl0ZW1PdXRlckhlaWdodCArIHN1Ymxpc3RIZWlnaHQpID4gKHZpZXdwb3J0LmhlaWdodCAtIERvbUhhbmRsZXIuY2FsY3VsYXRlU2Nyb2xsYmFySGVpZ2h0KCkpKSB7XG4gICAgICAgICAgICBzdWJsaXN0LnN0eWxlLnJlbW92ZVByb3BlcnR5KCd0b3AnKTtcbiAgICAgICAgICAgIHN1Ymxpc3Quc3R5bGUuYm90dG9tID0gJzBweCc7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzdWJsaXN0LnN0eWxlLnJlbW92ZVByb3BlcnR5KCdib3R0b20nKTtcbiAgICAgICAgICAgIHN1Ymxpc3Quc3R5bGUudG9wID0gJzBweCc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoKHBhcnNlSW50KGNvbnRhaW5lck9mZnNldC5sZWZ0KSArIGl0ZW1PdXRlcldpZHRoICsgc3VibGlzdFdpZHRoKSA+ICh2aWV3cG9ydC53aWR0aCAtIERvbUhhbmRsZXIuY2FsY3VsYXRlU2Nyb2xsYmFyV2lkdGgoKSkpIHtcbiAgICAgICAgICAgIHN1Ymxpc3Quc3R5bGUubGVmdCA9IC1zdWJsaXN0V2lkdGggKyAncHgnO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc3VibGlzdC5zdHlsZS5sZWZ0ID0gaXRlbU91dGVyV2lkdGggKyAncHgnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaXNJdGVtTWF0Y2hlZChtZW51aXRlbSkge1xuICAgICAgICByZXR1cm4gRG9tSGFuZGxlci5oYXNDbGFzcyhtZW51aXRlbSwgJ3AtbWVudWl0ZW0nKSAmJiAhRG9tSGFuZGxlci5oYXNDbGFzcyhtZW51aXRlbS5jaGlsZHJlblswXSwgJ3AtZGlzYWJsZWQnKTtcbiAgICB9XG5cbiAgICBmaW5kTmV4dEl0ZW0obWVudWl0ZW0sIGlzUmVwZWF0ZWQ/KSB7XG4gICAgICAgIGxldCBuZXh0TWVudWl0ZW0gPSBtZW51aXRlbS5uZXh0RWxlbWVudFNpYmxpbmc7XG5cbiAgICAgICAgaWYgKG5leHRNZW51aXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXNJdGVtTWF0Y2hlZChuZXh0TWVudWl0ZW0pID8gbmV4dE1lbnVpdGVtIDogdGhpcy5maW5kTmV4dEl0ZW0obmV4dE1lbnVpdGVtLCBpc1JlcGVhdGVkKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxldCBmaXJzdEl0ZW0gPSBtZW51aXRlbS5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzBdO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pc0l0ZW1NYXRjaGVkKGZpcnN0SXRlbSkgPyBmaXJzdEl0ZW0gOiAoIWlzUmVwZWF0ZWQgPyB0aGlzLmZpbmROZXh0SXRlbShmaXJzdEl0ZW0sIHRydWUpIDogbnVsbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmaW5kUHJldkl0ZW0obWVudWl0ZW0sIGlzUmVwZWF0ZWQ/KSB7XG4gICAgICAgIGxldCBwcmV2TWVudWl0ZW0gPSBtZW51aXRlbS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuXG4gICAgICAgIGlmIChwcmV2TWVudWl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmlzSXRlbU1hdGNoZWQocHJldk1lbnVpdGVtKSA/IHByZXZNZW51aXRlbSA6IHRoaXMuZmluZFByZXZJdGVtKHByZXZNZW51aXRlbSwgaXNSZXBlYXRlZCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsZXQgbGFzdEl0ZW0gPSBtZW51aXRlbS5wYXJlbnRFbGVtZW50LmNoaWxkcmVuW21lbnVpdGVtLnBhcmVudEVsZW1lbnQuY2hpbGRyZW4ubGVuZ3RoIC0gMV07XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmlzSXRlbU1hdGNoZWQobGFzdEl0ZW0pID8gbGFzdEl0ZW0gOiAoIWlzUmVwZWF0ZWQgPyB0aGlzLmZpbmRQcmV2SXRlbShsYXN0SXRlbSwgdHJ1ZSkgOiBudWxsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldEFjdGl2ZUl0ZW0oKSB7XG4gICAgICAgIGxldCBhY3RpdmVJdGVtS2V5ID0gdGhpcy5jb250ZXh0TWVudVNlcnZpY2UuYWN0aXZlSXRlbUtleTtcblxuICAgICAgICByZXR1cm4gYWN0aXZlSXRlbUtleSA9PSBudWxsID8gbnVsbCA6IERvbUhhbmRsZXIuZmluZFNpbmdsZSh0aGlzLmNvbnRhaW5lclZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LCAnLnAtbWVudWl0ZW1bZGF0YS1paz1cIicgKyBhY3RpdmVJdGVtS2V5ICsgJ1wiXScpO1xuICAgIH1cblxuICAgIGNsZWFyQWN0aXZlSXRlbSgpIHtcbiAgICAgICAgaWYgKHRoaXMuY29udGV4dE1lbnVTZXJ2aWNlLmFjdGl2ZUl0ZW1LZXkpIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlQWN0aXZlRnJvbVN1Ykxpc3RzKHRoaXMuY29udGFpbmVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICAgICAgdGhpcy5jb250ZXh0TWVudVNlcnZpY2UucmVzZXQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlbW92ZUFjdGl2ZUZyb21TdWJMaXN0cyhlbCkge1xuICAgICAgICBsZXQgc3VibGlzdHMgPSBEb21IYW5kbGVyLmZpbmQoZWwsICcucC1zdWJtZW51LWxpc3QtYWN0aXZlJyk7XG5cbiAgICAgICAgZm9yIChsZXQgc3VibGlzdCBvZiBzdWJsaXN0cykge1xuICAgICAgICAgICAgRG9tSGFuZGxlci5yZW1vdmVDbGFzcyhzdWJsaXN0LCAncC1zdWJtZW51LWxpc3QtYWN0aXZlJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW1vdmVBY3RpdmVGcm9tU3VibGlzdChtZW51aXRlbSkge1xuICAgICAgICBpZiAobWVudWl0ZW0pIHtcbiAgICAgICAgICAgIGxldCBzdWJsaXN0ID0gRG9tSGFuZGxlci5maW5kU2luZ2xlKG1lbnVpdGVtLCAnLnAtc3VibWVudS1saXN0Jyk7XG5cbiAgICAgICAgICAgIGlmIChzdWJsaXN0ICYmIERvbUhhbmRsZXIuaGFzQ2xhc3MobWVudWl0ZW0sICdwLXN1Ym1lbnUtbGlzdC1hY3RpdmUnKSkge1xuICAgICAgICAgICAgICAgIERvbUhhbmRsZXIucmVtb3ZlQ2xhc3MobWVudWl0ZW0sICdwLXN1Ym1lbnUtbGlzdC1hY3RpdmUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGJpbmRHbG9iYWxMaXN0ZW5lcnMoKSB7XG4gICAgICAgIGlmICghdGhpcy5kb2N1bWVudENsaWNrTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IGRvY3VtZW50VGFyZ2V0OiBhbnkgPSB0aGlzLmVsID8gdGhpcy5lbC5uYXRpdmVFbGVtZW50Lm93bmVyRG9jdW1lbnQgOiAnZG9jdW1lbnQnO1xuXG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50Q2xpY2tMaXN0ZW5lciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKGRvY3VtZW50VGFyZ2V0LCAnY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jb250YWluZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5vZmZzZXRQYXJlbnQgJiYgdGhpcy5pc091dHNpZGVDbGlja2VkKGV2ZW50KSAmJiAhZXZlbnQuY3RybEtleSAmJiBldmVudC5idXR0b24gIT09IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRUcmlnZ2VyTGlzdGVuZXIgPSB0aGlzLnJlbmRlcmVyLmxpc3Rlbihkb2N1bWVudFRhcmdldCwgdGhpcy50cmlnZ2VyRXZlbnQsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnRhaW5lclZpZXdDaGlsZC5uYXRpdmVFbGVtZW50Lm9mZnNldFBhcmVudCAmJiB0aGlzLmlzT3V0c2lkZUNsaWNrZWQoZXZlbnQpICYmICF0aGlzLnByZXZlbnREb2N1bWVudERlZmF1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucHJldmVudERvY3VtZW50RGVmYXVsdCA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLndpbmRvd1Jlc2l6ZUxpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLndpbmRvd1Jlc2l6ZUxpc3RlbmVyID0gdGhpcy5vbldpbmRvd1Jlc2l6ZS5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLndpbmRvd1Jlc2l6ZUxpc3RlbmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCF0aGlzLmRvY3VtZW50S2V5ZG93bkxpc3RlbmVyKSB7XG4gICAgICAgICAgICBjb25zdCBkb2N1bWVudFRhcmdldDogYW55ID0gdGhpcy5lbCA/IHRoaXMuZWwubmF0aXZlRWxlbWVudC5vd25lckRvY3VtZW50IDogJ2RvY3VtZW50JztcblxuICAgICAgICAgICAgdGhpcy5kb2N1bWVudEtleWRvd25MaXN0ZW5lciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKGRvY3VtZW50VGFyZ2V0LCAna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBhY3RpdmVJdGVtID0gdGhpcy5nZXRBY3RpdmVJdGVtKCk7XG5cbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGV2ZW50LmtleSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdBcnJvd0Rvd24nOlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGl2ZUl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUFjdGl2ZUZyb21TdWJsaXN0KGFjdGl2ZUl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZUl0ZW0gPSB0aGlzLmZpbmROZXh0SXRlbShhY3RpdmVJdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmaXJzdEl0ZW0gPSBEb21IYW5kbGVyLmZpbmRTaW5nbGUodGhpcy5jb250YWluZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudCwgJy5wLW1lbnVpdGVtLWxpbmsnKS5wYXJlbnRFbGVtZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZUl0ZW0gPSB0aGlzLmlzSXRlbU1hdGNoZWQoZmlyc3RJdGVtKSA/IGZpcnN0SXRlbSA6IHRoaXMuZmluZE5leHRJdGVtKGZpcnN0SXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhY3RpdmVJdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0TWVudVNlcnZpY2UuY2hhbmdlS2V5KGFjdGl2ZUl0ZW0uZ2V0QXR0cmlidXRlKCdkYXRhLWlrJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnQXJyb3dVcCc6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aXZlSXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQWN0aXZlRnJvbVN1Ymxpc3QoYWN0aXZlSXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlSXRlbSA9IHRoaXMuZmluZFByZXZJdGVtKGFjdGl2ZUl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHN1Ymxpc3QgPSBEb21IYW5kbGVyLmZpbmRTaW5nbGUodGhpcy5jb250YWluZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudCwgJ3VsJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGxhc3RJdGVtID0gc3VibGlzdC5jaGlsZHJlbltzdWJsaXN0LmNoaWxkcmVuLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZUl0ZW0gPSB0aGlzLmlzSXRlbU1hdGNoZWQobGFzdEl0ZW0pID8gbGFzdEl0ZW0gOiB0aGlzLmZpbmRQcmV2SXRlbShsYXN0SXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhY3RpdmVJdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0TWVudVNlcnZpY2UuY2hhbmdlS2V5KGFjdGl2ZUl0ZW0uZ2V0QXR0cmlidXRlKCdkYXRhLWlrJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnQXJyb3dSaWdodCc6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aXZlSXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzdWJsaXN0ID0gRG9tSGFuZGxlci5maW5kU2luZ2xlKGFjdGl2ZUl0ZW0sICcucC1zdWJtZW51LWxpc3QnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdWJsaXN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIERvbUhhbmRsZXIuYWRkQ2xhc3Moc3VibGlzdCwgJ3Atc3VibWVudS1saXN0LWFjdGl2ZScpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZUl0ZW0gPSBEb21IYW5kbGVyLmZpbmRTaW5nbGUoc3VibGlzdCwgJy5wLW1lbnVpdGVtLWxpbms6bm90KC5wLWRpc2FibGVkKScpLnBhcmVudEVsZW1lbnQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGl2ZUl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dE1lbnVTZXJ2aWNlLmNoYW5nZUtleShhY3RpdmVJdGVtLmdldEF0dHJpYnV0ZSgnZGF0YS1paycpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ0Fycm93TGVmdCc6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aXZlSXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzdWJsaXN0ID0gYWN0aXZlSXRlbS5wYXJlbnRFbGVtZW50O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN1Ymxpc3QgJiYgRG9tSGFuZGxlci5oYXNDbGFzcyhzdWJsaXN0LCAncC1zdWJtZW51LWxpc3QtYWN0aXZlJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRG9tSGFuZGxlci5yZW1vdmVDbGFzcyhzdWJsaXN0LCAncC1zdWJtZW51LWxpc3QtYWN0aXZlJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlSXRlbSA9IHN1Ymxpc3QucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhY3RpdmVJdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHRNZW51U2VydmljZS5jaGFuZ2VLZXkoYWN0aXZlSXRlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWsnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICBjYXNlICdFc2NhcGUnOlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICBjYXNlICdFbnRlcic6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aXZlSXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlSXRlbUNsaWNrKGV2ZW50LCB0aGlzLmZpbmRNb2RlbEl0ZW1Gcm9tS2V5KHRoaXMuY29udGV4dE1lbnVTZXJ2aWNlLmFjdGl2ZUl0ZW1LZXkpLCBhY3RpdmVJdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbmRNb2RlbEl0ZW1Gcm9tS2V5KGtleSkge1xuICAgICAgICBpZiAoa2V5ID09IG51bGwgfHwgIXRoaXMubW9kZWwpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGluZGV4ZXMgPSBrZXkuc3BsaXQoJ18nKTtcbiAgICAgICAgcmV0dXJuIGluZGV4ZXMucmVkdWNlKChpdGVtLCBjdXJyZW50SW5kZXgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtID8gaXRlbS5pdGVtc1tjdXJyZW50SW5kZXhdIDogdGhpcy5tb2RlbFtjdXJyZW50SW5kZXhdO1xuICAgICAgICB9LCBudWxsKTtcbiAgICB9XG5cbiAgICBoYW5kbGVJdGVtQ2xpY2soZXZlbnQsIGl0ZW0sIG1lbnVpdGVtKSB7XG4gICAgICAgIGlmICghaXRlbSB8fCBpdGVtLmRpc2FibGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXRlbS5jb21tYW5kKSB7XG4gICAgICAgICAgICBpdGVtLmNvbW1hbmQoe1xuICAgICAgICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2ZW50LFxuICAgICAgICAgICAgICAgIGl0ZW06IGl0ZW1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGl0ZW0uaXRlbXMpIHtcbiAgICAgICAgICAgIGxldCBjaGlsZFN1Ymxpc3QgPSBEb21IYW5kbGVyLmZpbmRTaW5nbGUobWVudWl0ZW0sICcucC1zdWJtZW51LWxpc3QnKTtcblxuICAgICAgICAgICAgaWYgKGNoaWxkU3VibGlzdCkge1xuICAgICAgICAgICAgICAgIGlmIChEb21IYW5kbGVyLmhhc0NsYXNzKGNoaWxkU3VibGlzdCwgJ3Atc3VibWVudS1saXN0LWFjdGl2ZScpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQWN0aXZlRnJvbVN1Ykxpc3RzKG1lbnVpdGVtKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIERvbUhhbmRsZXIuYWRkQ2xhc3MoY2hpbGRTdWJsaXN0LCAncC1zdWJtZW51LWxpc3QtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG9zaXRpb25TdWJtZW51KGNoaWxkU3VibGlzdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpdGVtLml0ZW1zKSB7XG4gICAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVuYmluZEdsb2JhbExpc3RlbmVycygpIHtcbiAgICAgICAgaWYgKHRoaXMuZG9jdW1lbnRDbGlja0xpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50Q2xpY2tMaXN0ZW5lcigpO1xuICAgICAgICAgICAgdGhpcy5kb2N1bWVudENsaWNrTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZG9jdW1lbnRUcmlnZ2VyTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRUcmlnZ2VyTGlzdGVuZXIoKTtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRUcmlnZ2VyTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMud2luZG93UmVzaXplTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLndpbmRvd1Jlc2l6ZUxpc3RlbmVyKTtcbiAgICAgICAgICAgIHRoaXMud2luZG93UmVzaXplTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZG9jdW1lbnRLZXlkb3duTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRLZXlkb3duTGlzdGVuZXIoKTtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRLZXlkb3duTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25XaW5kb3dSZXNpemUoZXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuY29udGFpbmVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQub2Zmc2V0UGFyZW50KSB7XG4gICAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlzT3V0c2lkZUNsaWNrZWQoZXZlbnQ6IEV2ZW50KSB7XG4gICAgICAgIHJldHVybiAhKHRoaXMuY29udGFpbmVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuaXNTYW1lTm9kZShldmVudC50YXJnZXQpIHx8IHRoaXMuY29udGFpbmVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuY29udGFpbnMoZXZlbnQudGFyZ2V0KSk7XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMudW5iaW5kR2xvYmFsTGlzdGVuZXJzKCk7XG5cbiAgICAgICAgaWYgKHRoaXMudHJpZ2dlckV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlckV2ZW50TGlzdGVuZXIoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmNvbnRhaW5lclZpZXdDaGlsZCAmJiB0aGlzLmF1dG9aSW5kZXgpIHtcbiAgICAgICAgICAgIFpJbmRleFV0aWxzLmNsZWFyKHRoaXMuY29udGFpbmVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuYXBwZW5kVG8pIHtcbiAgICAgICAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmNvbnRhaW5lclZpZXdDaGlsZC5uYXRpdmVFbGVtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubmdEZXN0cm95JC5uZXh0KHRydWUpO1xuICAgICAgICB0aGlzLm5nRGVzdHJveSQuY29tcGxldGUoKTtcbiAgICB9XG5cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLFJvdXRlck1vZHVsZSxSaXBwbGVNb2R1bGUsVG9vbHRpcE1vZHVsZV0sXG4gICAgZXhwb3J0czogW0NvbnRleHRNZW51LFJvdXRlck1vZHVsZSxUb29sdGlwTW9kdWxlXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtDb250ZXh0TWVudSxDb250ZXh0TWVudVN1Yl0sXG4gICAgcHJvdmlkZXJzOiBbQ29udGV4dE1lbnVTZXJ2aWNlXVxufSlcbmV4cG9ydCBjbGFzcyBDb250ZXh0TWVudU1vZHVsZSB7IH1cbiJdfQ==