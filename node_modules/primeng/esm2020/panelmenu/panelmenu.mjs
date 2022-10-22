import { NgModule, Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { DomHandler } from 'primeng/dom';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/router";
import * as i3 from "primeng/tooltip";
export class BasePanelMenuItem {
    constructor(ref) {
        this.ref = ref;
    }
    handleClick(event, item) {
        if (item.disabled) {
            event.preventDefault();
            return;
        }
        item.expanded = !item.expanded;
        this.ref.detectChanges();
        if (!item.url && !item.routerLink) {
            event.preventDefault();
        }
        if (item.command) {
            item.command({
                originalEvent: event,
                item: item
            });
        }
    }
}
export class PanelMenuSub extends BasePanelMenuItem {
    constructor(ref) {
        super(ref);
    }
    onItemKeyDown(event) {
        let listItem = event.currentTarget;
        switch (event.code) {
            case 'Space':
            case 'Enter':
                if (listItem && !DomHandler.hasClass(listItem, 'p-disabled')) {
                    listItem.click();
                }
                event.preventDefault();
                break;
            default:
                break;
        }
    }
}
PanelMenuSub.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: PanelMenuSub, deps: [{ token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
PanelMenuSub.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.7", type: PanelMenuSub, selector: "p-panelMenuSub", inputs: { item: "item", expanded: "expanded", parentExpanded: "parentExpanded", transitionOptions: "transitionOptions", root: "root" }, host: { classAttribute: "p-element" }, usesInheritance: true, ngImport: i0, template: `
        <ul [ngClass]="{'p-submenu-list': true, 'p-panelmenu-root-submenu': root, 'p-submenu-expanded': expanded}" [@submenu]="expanded ? {value: 'visible', params: {transitionParams: transitionOptions, height: '*'}} : {value: 'hidden', params: {transitionParams: transitionOptions, height: '0'}}" role="tree">
            <ng-template ngFor let-child [ngForOf]="item.items">
                <li *ngIf="child.separator" class="p-menu-separator" role="separator">
                <li *ngIf="!child.separator" class="p-menuitem" [ngClass]="child.styleClass" [class.p-hidden]="child.visible === false" [ngStyle]="child.style" pTooltip [tooltipOptions]="child.tooltipOptions">
                    <a *ngIf="!child.routerLink" (keydown)="onItemKeyDown($event)" [attr.href]="child.url" class="p-menuitem-link" [attr.tabindex]="!item.expanded || !parentExpanded ? null : child.disabled ? null : '0'" [attr.id]="child.id"
                        [ngClass]="{'p-disabled':child.disabled}" role="treeitem" [attr.aria-expanded]="child.expanded"
                        (click)="handleClick($event,child)" [target]="child.target" [attr.title]="child.title">
                        <span class="p-panelmenu-icon pi pi-fw" [ngClass]="{'pi-angle-right':!child.expanded,'pi-angle-down':child.expanded}" *ngIf="child.items" [ngStyle]="child.iconStyle"></span>
                        <span class="p-menuitem-icon" [ngClass]="child.icon" *ngIf="child.icon" [ngStyle]="child.iconStyle"></span>
                        <span class="p-menuitem-text" *ngIf="child.escape !== false; else htmlLabel">{{child.label}}</span>
                        <ng-template #htmlLabel><span class="p-menuitem-text" [innerHTML]="child.label"></span></ng-template>
                        <span class="p-menuitem-badge" *ngIf="child.badge" [ngClass]="child.badgeStyleClass">{{child.badge}}</span>
                    </a>
                    <a *ngIf="child.routerLink" (keydown)="onItemKeyDown($event)"  [routerLink]="child.routerLink" [queryParams]="child.queryParams" [routerLinkActive]="'p-menuitem-link-active'" [routerLinkActiveOptions]="child.routerLinkActiveOptions||{exact:false}" class="p-menuitem-link"
                        [ngClass]="{'p-disabled':child.disabled}" [attr.tabindex]="!item.expanded || !parentExpanded ? null : child.disabled ? null : '0'" [attr.id]="child.id" role="treeitem" [attr.aria-expanded]="child.expanded"
                        (click)="handleClick($event,child)" [target]="child.target" [attr.title]="child.title"
                        [fragment]="child.fragment" [queryParamsHandling]="child.queryParamsHandling" [preserveFragment]="child.preserveFragment" [skipLocationChange]="child.skipLocationChange" [replaceUrl]="child.replaceUrl" [state]="child.state">
                        <span class="p-panelmenu-icon pi pi-fw" [ngClass]="{'pi-angle-right':!child.expanded,'pi-angle-down':child.expanded}" *ngIf="child.items" [ngStyle]="child.iconStyle"></span>
                        <span class="p-menuitem-icon" [ngClass]="child.icon" *ngIf="child.icon" [ngStyle]="child.iconStyle"></span>
                        <span class="p-menuitem-text" *ngIf="child.escape !== false; else htmlRouteLabel">{{child.label}}</span>
                        <ng-template #htmlRouteLabel><span class="p-menuitem-text" [innerHTML]="child.label"></span></ng-template>
                        <span class="p-menuitem-badge" *ngIf="child.badge" [ngClass]="child.badgeStyleClass">{{child.badge}}</span>
                    </a>
                    <p-panelMenuSub [item]="child" [parentExpanded]="expanded && parentExpanded" [expanded]="child.expanded" [transitionOptions]="transitionOptions" *ngIf="child.items"></p-panelMenuSub>
                </li>
            </ng-template>
        </ul>
    `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i2.RouterLinkWithHref, selector: "a[routerLink],area[routerLink]", inputs: ["target", "queryParams", "fragment", "queryParamsHandling", "preserveFragment", "skipLocationChange", "replaceUrl", "state", "relativeTo", "routerLink"] }, { kind: "directive", type: i2.RouterLinkActive, selector: "[routerLinkActive]", inputs: ["routerLinkActiveOptions", "ariaCurrentWhenActive", "routerLinkActive"], outputs: ["isActiveChange"], exportAs: ["routerLinkActive"] }, { kind: "directive", type: i3.Tooltip, selector: "[pTooltip]", inputs: ["tooltipPosition", "tooltipEvent", "appendTo", "positionStyle", "tooltipStyleClass", "tooltipZIndex", "escape", "showDelay", "hideDelay", "life", "positionTop", "positionLeft", "fitContent", "pTooltip", "tooltipDisabled", "tooltipOptions"] }, { kind: "component", type: PanelMenuSub, selector: "p-panelMenuSub", inputs: ["item", "expanded", "parentExpanded", "transitionOptions", "root"] }], animations: [
        trigger('submenu', [
            state('hidden', style({
                height: '0'
            })),
            state('visible', style({
                height: '*'
            })),
            transition('visible <=> hidden', [animate('{{transitionParams}}')]),
            transition('void => *', animate(0))
        ])
    ], encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: PanelMenuSub, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-panelMenuSub',
                    template: `
        <ul [ngClass]="{'p-submenu-list': true, 'p-panelmenu-root-submenu': root, 'p-submenu-expanded': expanded}" [@submenu]="expanded ? {value: 'visible', params: {transitionParams: transitionOptions, height: '*'}} : {value: 'hidden', params: {transitionParams: transitionOptions, height: '0'}}" role="tree">
            <ng-template ngFor let-child [ngForOf]="item.items">
                <li *ngIf="child.separator" class="p-menu-separator" role="separator">
                <li *ngIf="!child.separator" class="p-menuitem" [ngClass]="child.styleClass" [class.p-hidden]="child.visible === false" [ngStyle]="child.style" pTooltip [tooltipOptions]="child.tooltipOptions">
                    <a *ngIf="!child.routerLink" (keydown)="onItemKeyDown($event)" [attr.href]="child.url" class="p-menuitem-link" [attr.tabindex]="!item.expanded || !parentExpanded ? null : child.disabled ? null : '0'" [attr.id]="child.id"
                        [ngClass]="{'p-disabled':child.disabled}" role="treeitem" [attr.aria-expanded]="child.expanded"
                        (click)="handleClick($event,child)" [target]="child.target" [attr.title]="child.title">
                        <span class="p-panelmenu-icon pi pi-fw" [ngClass]="{'pi-angle-right':!child.expanded,'pi-angle-down':child.expanded}" *ngIf="child.items" [ngStyle]="child.iconStyle"></span>
                        <span class="p-menuitem-icon" [ngClass]="child.icon" *ngIf="child.icon" [ngStyle]="child.iconStyle"></span>
                        <span class="p-menuitem-text" *ngIf="child.escape !== false; else htmlLabel">{{child.label}}</span>
                        <ng-template #htmlLabel><span class="p-menuitem-text" [innerHTML]="child.label"></span></ng-template>
                        <span class="p-menuitem-badge" *ngIf="child.badge" [ngClass]="child.badgeStyleClass">{{child.badge}}</span>
                    </a>
                    <a *ngIf="child.routerLink" (keydown)="onItemKeyDown($event)"  [routerLink]="child.routerLink" [queryParams]="child.queryParams" [routerLinkActive]="'p-menuitem-link-active'" [routerLinkActiveOptions]="child.routerLinkActiveOptions||{exact:false}" class="p-menuitem-link"
                        [ngClass]="{'p-disabled':child.disabled}" [attr.tabindex]="!item.expanded || !parentExpanded ? null : child.disabled ? null : '0'" [attr.id]="child.id" role="treeitem" [attr.aria-expanded]="child.expanded"
                        (click)="handleClick($event,child)" [target]="child.target" [attr.title]="child.title"
                        [fragment]="child.fragment" [queryParamsHandling]="child.queryParamsHandling" [preserveFragment]="child.preserveFragment" [skipLocationChange]="child.skipLocationChange" [replaceUrl]="child.replaceUrl" [state]="child.state">
                        <span class="p-panelmenu-icon pi pi-fw" [ngClass]="{'pi-angle-right':!child.expanded,'pi-angle-down':child.expanded}" *ngIf="child.items" [ngStyle]="child.iconStyle"></span>
                        <span class="p-menuitem-icon" [ngClass]="child.icon" *ngIf="child.icon" [ngStyle]="child.iconStyle"></span>
                        <span class="p-menuitem-text" *ngIf="child.escape !== false; else htmlRouteLabel">{{child.label}}</span>
                        <ng-template #htmlRouteLabel><span class="p-menuitem-text" [innerHTML]="child.label"></span></ng-template>
                        <span class="p-menuitem-badge" *ngIf="child.badge" [ngClass]="child.badgeStyleClass">{{child.badge}}</span>
                    </a>
                    <p-panelMenuSub [item]="child" [parentExpanded]="expanded && parentExpanded" [expanded]="child.expanded" [transitionOptions]="transitionOptions" *ngIf="child.items"></p-panelMenuSub>
                </li>
            </ng-template>
        </ul>
    `,
                    animations: [
                        trigger('submenu', [
                            state('hidden', style({
                                height: '0'
                            })),
                            state('visible', style({
                                height: '*'
                            })),
                            transition('visible <=> hidden', [animate('{{transitionParams}}')]),
                            transition('void => *', animate(0))
                        ])
                    ],
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        'class': 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }]; }, propDecorators: { item: [{
                type: Input
            }], expanded: [{
                type: Input
            }], parentExpanded: [{
                type: Input
            }], transitionOptions: [{
                type: Input
            }], root: [{
                type: Input
            }] } });
export class PanelMenu extends BasePanelMenuItem {
    constructor(ref) {
        super(ref);
        this.multiple = true;
        this.transitionOptions = '400ms cubic-bezier(0.86, 0, 0.07, 1)';
    }
    collapseAll() {
        for (let item of this.model) {
            if (item.expanded) {
                item.expanded = false;
            }
        }
    }
    handleClick(event, item) {
        if (!this.multiple) {
            for (let modelItem of this.model) {
                if (item !== modelItem && modelItem.expanded) {
                    modelItem.expanded = false;
                }
            }
        }
        this.animating = true;
        super.handleClick(event, item);
    }
    onToggleDone() {
        this.animating = false;
    }
    onItemKeyDown(event) {
        let listItem = event.currentTarget;
        switch (event.code) {
            case 'Space':
            case 'Enter':
                if (listItem && !DomHandler.hasClass(listItem, 'p-disabled')) {
                    listItem.click();
                }
                event.preventDefault();
                break;
            default:
                break;
        }
    }
    visible(item) {
        return item.visible !== false;
    }
}
PanelMenu.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: PanelMenu, deps: [{ token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
PanelMenu.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.7", type: PanelMenu, selector: "p-panelMenu", inputs: { model: "model", style: "style", styleClass: "styleClass", multiple: "multiple", transitionOptions: "transitionOptions" }, host: { classAttribute: "p-element" }, usesInheritance: true, ngImport: i0, template: `
        <div [class]="styleClass" [ngStyle]="style" [ngClass]="'p-panelmenu p-component'">
            <ng-container *ngFor="let item of model;let f=first;let l=last;">
                <div class="p-panelmenu-panel" *ngIf="visible(item)">
                    <div [ngClass]="{'p-component p-panelmenu-header':true, 'p-highlight':item.expanded,'p-disabled':item.disabled}" [class]="item.styleClass" [ngStyle]="item.style" pTooltip [tooltipOptions]="item.tooltipOptions">
                        <a *ngIf="!item.routerLink" [attr.href]="item.url" (click)="handleClick($event,item)" (keydown)="onItemKeyDown($event)" [attr.tabindex]="item.disabled ? null : '0'" [attr.id]="item.id"
                           [target]="item.target" [attr.title]="item.title" class="p-panelmenu-header-link" [attr.aria-expanded]="item.expanded" [attr.id]="item.id + '_header'" [attr.aria-controls]="item.id +'_content'">
                            <span *ngIf="item.items" class="p-panelmenu-icon pi" [ngClass]="{'pi-chevron-right':!item.expanded,'pi-chevron-down':item.expanded}"></span>
                            <span class="p-menuitem-icon" [ngClass]="item.icon" *ngIf="item.icon" [ngStyle]="item.iconStyle"></span>
                            <span class="p-menuitem-text" *ngIf="item.escape !== false; else htmlLabel">{{item.label}}</span>
                            <ng-template #htmlLabel><span class="p-menuitem-text" [innerHTML]="item.label"></span></ng-template>
                            <span class="p-menuitem-badge" *ngIf="item.badge" [ngClass]="item.badgeStyleClass">{{item.badge}}</span>
                        </a>
                        <a *ngIf="item.routerLink" [routerLink]="item.routerLink" [queryParams]="item.queryParams" [routerLinkActive]="'p-menuitem-link-active'" [routerLinkActiveOptions]="item.routerLinkActiveOptions||{exact:false}"
                           (click)="handleClick($event,item)" (keydown)="onItemKeyDown($event)" [target]="item.target" [attr.title]="item.title" class="p-panelmenu-header-link" [attr.id]="item.id" [attr.tabindex]="item.disabled ? null : '0'"
                           [fragment]="item.fragment" [queryParamsHandling]="item.queryParamsHandling" [preserveFragment]="item.preserveFragment" [skipLocationChange]="item.skipLocationChange" [replaceUrl]="item.replaceUrl" [state]="item.state">
                            <span *ngIf="item.items" class="p-panelmenu-icon pi" [ngClass]="{'pi-chevron-right':!item.expanded,'pi-chevron-down':item.expanded}"></span>
                            <span class="p-menuitem-icon" [ngClass]="item.icon" *ngIf="item.icon" [ngStyle]="item.iconStyle"></span>
                            <span class="p-menuitem-text" *ngIf="item.escape !== false; else htmlRouteLabel">{{item.label}}</span>
                            <ng-template #htmlRouteLabel><span class="p-menuitem-text" [innerHTML]="item.label"></span></ng-template>
                            <span class="p-menuitem-badge" *ngIf="item.badge" [ngClass]="item.badgeStyleClass">{{item.badge}}</span>
                        </a>
                    </div>
                    <div *ngIf="item.items" class="p-toggleable-content" [ngClass]="{'p-panelmenu-expanded': item.expanded}"  [@rootItem]="item.expanded ? {value: 'visible', params: {transitionParams: animating ? transitionOptions : '0ms', height: '*'}} : {value: 'hidden', params: {transitionParams: transitionOptions, height: '0'}}"  (@rootItem.done)="onToggleDone()">
                        <div class="p-panelmenu-content" role="region" [attr.id]="item.id +'_content' " [attr.aria-labelledby]="item.id +'_header'">
                            <p-panelMenuSub [item]="item" [parentExpanded]="item.expanded" [expanded]="true" [transitionOptions]="transitionOptions" [root]="true"></p-panelMenuSub>
                        </div>
                    </div>
                </div>
            </ng-container>
        </div>
    `, isInline: true, styles: [".p-panelmenu .p-panelmenu-header-link{display:flex;align-items:center;-webkit-user-select:none;user-select:none;cursor:pointer;position:relative;text-decoration:none}.p-panelmenu .p-panelmenu-header-link:focus{z-index:1}.p-panelmenu .p-submenu-list{margin:0;padding:0;list-style:none}.p-panelmenu .p-menuitem-link{display:flex;align-items:center;-webkit-user-select:none;user-select:none;cursor:pointer;text-decoration:none}.p-panelmenu .p-menuitem-text{line-height:1}.p-panelmenu-expanded.p-toggleable-content:not(.ng-animating),.p-panelmenu .p-submenu-expanded:not(.ng-animating){overflow:visible}.p-panelmenu .p-toggleable-content,.p-panelmenu .p-submenu-list{overflow:hidden}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i2.RouterLinkWithHref, selector: "a[routerLink],area[routerLink]", inputs: ["target", "queryParams", "fragment", "queryParamsHandling", "preserveFragment", "skipLocationChange", "replaceUrl", "state", "relativeTo", "routerLink"] }, { kind: "directive", type: i2.RouterLinkActive, selector: "[routerLinkActive]", inputs: ["routerLinkActiveOptions", "ariaCurrentWhenActive", "routerLinkActive"], outputs: ["isActiveChange"], exportAs: ["routerLinkActive"] }, { kind: "directive", type: i3.Tooltip, selector: "[pTooltip]", inputs: ["tooltipPosition", "tooltipEvent", "appendTo", "positionStyle", "tooltipStyleClass", "tooltipZIndex", "escape", "showDelay", "hideDelay", "life", "positionTop", "positionLeft", "fitContent", "pTooltip", "tooltipDisabled", "tooltipOptions"] }, { kind: "component", type: PanelMenuSub, selector: "p-panelMenuSub", inputs: ["item", "expanded", "parentExpanded", "transitionOptions", "root"] }], animations: [
        trigger('rootItem', [
            state('hidden', style({
                height: '0'
            })),
            state('visible', style({
                height: '*'
            })),
            transition('visible <=> hidden', [animate('{{transitionParams}}')]),
            transition('void => *', animate(0))
        ])
    ], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: PanelMenu, decorators: [{
            type: Component,
            args: [{ selector: 'p-panelMenu', template: `
        <div [class]="styleClass" [ngStyle]="style" [ngClass]="'p-panelmenu p-component'">
            <ng-container *ngFor="let item of model;let f=first;let l=last;">
                <div class="p-panelmenu-panel" *ngIf="visible(item)">
                    <div [ngClass]="{'p-component p-panelmenu-header':true, 'p-highlight':item.expanded,'p-disabled':item.disabled}" [class]="item.styleClass" [ngStyle]="item.style" pTooltip [tooltipOptions]="item.tooltipOptions">
                        <a *ngIf="!item.routerLink" [attr.href]="item.url" (click)="handleClick($event,item)" (keydown)="onItemKeyDown($event)" [attr.tabindex]="item.disabled ? null : '0'" [attr.id]="item.id"
                           [target]="item.target" [attr.title]="item.title" class="p-panelmenu-header-link" [attr.aria-expanded]="item.expanded" [attr.id]="item.id + '_header'" [attr.aria-controls]="item.id +'_content'">
                            <span *ngIf="item.items" class="p-panelmenu-icon pi" [ngClass]="{'pi-chevron-right':!item.expanded,'pi-chevron-down':item.expanded}"></span>
                            <span class="p-menuitem-icon" [ngClass]="item.icon" *ngIf="item.icon" [ngStyle]="item.iconStyle"></span>
                            <span class="p-menuitem-text" *ngIf="item.escape !== false; else htmlLabel">{{item.label}}</span>
                            <ng-template #htmlLabel><span class="p-menuitem-text" [innerHTML]="item.label"></span></ng-template>
                            <span class="p-menuitem-badge" *ngIf="item.badge" [ngClass]="item.badgeStyleClass">{{item.badge}}</span>
                        </a>
                        <a *ngIf="item.routerLink" [routerLink]="item.routerLink" [queryParams]="item.queryParams" [routerLinkActive]="'p-menuitem-link-active'" [routerLinkActiveOptions]="item.routerLinkActiveOptions||{exact:false}"
                           (click)="handleClick($event,item)" (keydown)="onItemKeyDown($event)" [target]="item.target" [attr.title]="item.title" class="p-panelmenu-header-link" [attr.id]="item.id" [attr.tabindex]="item.disabled ? null : '0'"
                           [fragment]="item.fragment" [queryParamsHandling]="item.queryParamsHandling" [preserveFragment]="item.preserveFragment" [skipLocationChange]="item.skipLocationChange" [replaceUrl]="item.replaceUrl" [state]="item.state">
                            <span *ngIf="item.items" class="p-panelmenu-icon pi" [ngClass]="{'pi-chevron-right':!item.expanded,'pi-chevron-down':item.expanded}"></span>
                            <span class="p-menuitem-icon" [ngClass]="item.icon" *ngIf="item.icon" [ngStyle]="item.iconStyle"></span>
                            <span class="p-menuitem-text" *ngIf="item.escape !== false; else htmlRouteLabel">{{item.label}}</span>
                            <ng-template #htmlRouteLabel><span class="p-menuitem-text" [innerHTML]="item.label"></span></ng-template>
                            <span class="p-menuitem-badge" *ngIf="item.badge" [ngClass]="item.badgeStyleClass">{{item.badge}}</span>
                        </a>
                    </div>
                    <div *ngIf="item.items" class="p-toggleable-content" [ngClass]="{'p-panelmenu-expanded': item.expanded}"  [@rootItem]="item.expanded ? {value: 'visible', params: {transitionParams: animating ? transitionOptions : '0ms', height: '*'}} : {value: 'hidden', params: {transitionParams: transitionOptions, height: '0'}}"  (@rootItem.done)="onToggleDone()">
                        <div class="p-panelmenu-content" role="region" [attr.id]="item.id +'_content' " [attr.aria-labelledby]="item.id +'_header'">
                            <p-panelMenuSub [item]="item" [parentExpanded]="item.expanded" [expanded]="true" [transitionOptions]="transitionOptions" [root]="true"></p-panelMenuSub>
                        </div>
                    </div>
                </div>
            </ng-container>
        </div>
    `, animations: [
                        trigger('rootItem', [
                            state('hidden', style({
                                height: '0'
                            })),
                            state('visible', style({
                                height: '*'
                            })),
                            transition('visible <=> hidden', [animate('{{transitionParams}}')]),
                            transition('void => *', animate(0))
                        ])
                    ], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        'class': 'p-element'
                    }, styles: [".p-panelmenu .p-panelmenu-header-link{display:flex;align-items:center;-webkit-user-select:none;user-select:none;cursor:pointer;position:relative;text-decoration:none}.p-panelmenu .p-panelmenu-header-link:focus{z-index:1}.p-panelmenu .p-submenu-list{margin:0;padding:0;list-style:none}.p-panelmenu .p-menuitem-link{display:flex;align-items:center;-webkit-user-select:none;user-select:none;cursor:pointer;text-decoration:none}.p-panelmenu .p-menuitem-text{line-height:1}.p-panelmenu-expanded.p-toggleable-content:not(.ng-animating),.p-panelmenu .p-submenu-expanded:not(.ng-animating){overflow:visible}.p-panelmenu .p-toggleable-content,.p-panelmenu .p-submenu-list{overflow:hidden}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }]; }, propDecorators: { model: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], multiple: [{
                type: Input
            }], transitionOptions: [{
                type: Input
            }] } });
export class PanelMenuModule {
}
PanelMenuModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: PanelMenuModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
PanelMenuModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.7", ngImport: i0, type: PanelMenuModule, declarations: [PanelMenu, PanelMenuSub], imports: [CommonModule, RouterModule, TooltipModule], exports: [PanelMenu, RouterModule, TooltipModule] });
PanelMenuModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: PanelMenuModule, imports: [CommonModule, RouterModule, TooltipModule, RouterModule, TooltipModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: PanelMenuModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, RouterModule, TooltipModule],
                    exports: [PanelMenu, RouterModule, TooltipModule],
                    declarations: [PanelMenu, PanelMenuSub]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFuZWxtZW51LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9jb21wb25lbnRzL3BhbmVsbWVudS9wYW5lbG1lbnUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsS0FBSyxFQUFtQix1QkFBdUIsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNwSCxPQUFPLEVBQUMsT0FBTyxFQUFDLEtBQUssRUFBQyxLQUFLLEVBQUMsVUFBVSxFQUFDLE9BQU8sRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQzNFLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUU3QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzlDLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxhQUFhLENBQUM7Ozs7O0FBRXZDLE1BQU0sT0FBTyxpQkFBaUI7SUFFMUIsWUFBb0IsR0FBc0I7UUFBdEIsUUFBRyxHQUFILEdBQUcsQ0FBbUI7SUFBRyxDQUFDO0lBRTlDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsSUFBSTtRQUNuQixJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDZixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDdkIsT0FBTztTQUNWO1FBRUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDL0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUV6QixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDL0IsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1NBQzFCO1FBRUQsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2QsSUFBSSxDQUFD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LEVBQUMsWUFBWSxFQUFDLGFBQWEsYUFwRXhDLFNBQVMsRUFxRUUsWUFBWSxFQUFDLGFBQWE7NkdBR3JDLGVBQWUsWUFKZCxZQUFZLEVBQUMsWUFBWSxFQUFDLGFBQWEsRUFDN0IsWUFBWSxFQUFDLGFBQWE7MkZBR3JDLGVBQWU7a0JBTDNCLFFBQVE7bUJBQUM7b0JBQ04sT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFDLFlBQVksRUFBQyxhQUFhLENBQUM7b0JBQ2xELE9BQU8sRUFBRSxDQUFDLFNBQVMsRUFBQyxZQUFZLEVBQUMsYUFBYSxDQUFDO29CQUMvQyxZQUFZLEVBQUUsQ0FBQyxTQUFTLEVBQUMsWUFBWSxDQUFDO2lCQUN6QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TmdNb2R1bGUsQ29tcG9uZW50LElucHV0LENoYW5nZURldGVjdG9yUmVmLENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge3RyaWdnZXIsc3RhdGUsc3R5bGUsdHJhbnNpdGlvbixhbmltYXRlfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtNZW51SXRlbX0gZnJvbSAncHJpbWVuZy9hcGknO1xuaW1wb3J0IHtSb3V0ZXJNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQge1Rvb2x0aXBNb2R1bGV9IGZyb20gJ3ByaW1lbmcvdG9vbHRpcCc7XG5pbXBvcnQge0RvbUhhbmRsZXJ9IGZyb20gJ3ByaW1lbmcvZG9tJztcblxuZXhwb3J0IGNsYXNzIEJhc2VQYW5lbE1lbnVJdGVtIHtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVmOiBDaGFuZ2VEZXRlY3RvclJlZikge31cblxuICAgIGhhbmRsZUNsaWNrKGV2ZW50LCBpdGVtKSB7XG4gICAgICAgIGlmIChpdGVtLmRpc2FibGVkKSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaXRlbS5leHBhbmRlZCA9ICFpdGVtLmV4cGFuZGVkO1xuICAgICAgICB0aGlzLnJlZi5kZXRlY3RDaGFuZ2VzKCk7XG5cbiAgICAgICAgaWYgKCFpdGVtLnVybCAmJiAhaXRlbS5yb3V0ZXJMaW5rKSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGl0ZW0uY29tbWFuZCkge1xuICAgICAgICAgICAgaXRlbS5jb21tYW5kKHtcbiAgICAgICAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBldmVudCxcbiAgICAgICAgICAgICAgICBpdGVtOiBpdGVtXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdwLXBhbmVsTWVudVN1YicsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPHVsIFtuZ0NsYXNzXT1cInsncC1zdWJtZW51LWxpc3QnOiB0cnVlLCAncC1wYW5lbG1lbnUtcm9vdC1zdWJtZW51Jzogcm9vdCwgJ3Atc3VibWVudS1leHBhbmRlZCc6IGV4cGFuZGVkfVwiIFtAc3VibWVudV09XCJleHBhbmRlZCA/IHt2YWx1ZTogJ3Zpc2libGUnLCBwYXJhbXM6IHt0cmFuc2l0aW9uUGFyYW1zOiB0cmFuc2l0aW9uT3B0aW9ucywgaGVpZ2h0OiAnKid9fSA6IHt2YWx1ZTogJ2hpZGRlbicsIHBhcmFtczoge3RyYW5zaXRpb25QYXJhbXM6IHRyYW5zaXRpb25PcHRpb25zLCBoZWlnaHQ6ICcwJ319XCIgcm9sZT1cInRyZWVcIj5cbiAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSBuZ0ZvciBsZXQtY2hpbGQgW25nRm9yT2ZdPVwiaXRlbS5pdGVtc1wiPlxuICAgICAgICAgICAgICAgIDxsaSAqbmdJZj1cImNoaWxkLnNlcGFyYXRvclwiIGNsYXNzPVwicC1tZW51LXNlcGFyYXRvclwiIHJvbGU9XCJzZXBhcmF0b3JcIj5cbiAgICAgICAgICAgICAgICA8bGkgKm5nSWY9XCIhY2hpbGQuc2VwYXJhdG9yXCIgY2xhc3M9XCJwLW1lbnVpdGVtXCIgW25nQ2xhc3NdPVwiY2hpbGQuc3R5bGVDbGFzc1wiIFtjbGFzcy5wLWhpZGRlbl09XCJjaGlsZC52aXNpYmxlID09PSBmYWxzZVwiIFtuZ1N0eWxlXT1cImNoaWxkLnN0eWxlXCIgcFRvb2x0aXAgW3Rvb2x0aXBPcHRpb25zXT1cImNoaWxkLnRvb2x0aXBPcHRpb25zXCI+XG4gICAgICAgICAgICAgICAgICAgIDxhICpuZ0lmPVwiIWNoaWxkLnJvdXRlckxpbmtcIiAoa2V5ZG93bik9XCJvbkl0ZW1LZXlEb3duKCRldmVudClcIiBbYXR0ci5ocmVmXT1cImNoaWxkLnVybFwiIGNsYXNzPVwicC1tZW51aXRlbS1saW5rXCIgW2F0dHIudGFiaW5kZXhdPVwiIWl0ZW0uZXhwYW5kZWQgfHwgIXBhcmVudEV4cGFuZGVkID8gbnVsbCA6IGNoaWxkLmRpc2FibGVkID8gbnVsbCA6ICcwJ1wiIFthdHRyLmlkXT1cImNoaWxkLmlkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cInsncC1kaXNhYmxlZCc6Y2hpbGQuZGlzYWJsZWR9XCIgcm9sZT1cInRyZWVpdGVtXCIgW2F0dHIuYXJpYS1leHBhbmRlZF09XCJjaGlsZC5leHBhbmRlZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAoY2xpY2spPVwiaGFuZGxlQ2xpY2soJGV2ZW50LGNoaWxkKVwiIFt0YXJnZXRdPVwiY2hpbGQudGFyZ2V0XCIgW2F0dHIudGl0bGVdPVwiY2hpbGQudGl0bGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC1wYW5lbG1lbnUtaWNvbiBwaSBwaS1md1wiIFtuZ0NsYXNzXT1cInsncGktYW5nbGUtcmlnaHQnOiFjaGlsZC5leHBhbmRlZCwncGktYW5nbGUtZG93bic6Y2hpbGQuZXhwYW5kZWR9XCIgKm5nSWY9XCJjaGlsZC5pdGVtc1wiIFtuZ1N0eWxlXT1cImNoaWxkLmljb25TdHlsZVwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC1tZW51aXRlbS1pY29uXCIgW25nQ2xhc3NdPVwiY2hpbGQuaWNvblwiICpuZ0lmPVwiY2hpbGQuaWNvblwiIFtuZ1N0eWxlXT1cImNoaWxkLmljb25TdHlsZVwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC1tZW51aXRlbS10ZXh0XCIgKm5nSWY9XCJjaGlsZC5lc2NhcGUgIT09IGZhbHNlOyBlbHNlIGh0bWxMYWJlbFwiPnt7Y2hpbGQubGFiZWx9fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSAjaHRtbExhYmVsPjxzcGFuIGNsYXNzPVwicC1tZW51aXRlbS10ZXh0XCIgW2lubmVySFRNTF09XCJjaGlsZC5sYWJlbFwiPjwvc3Bhbj48L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwLW1lbnVpdGVtLWJhZGdlXCIgKm5nSWY9XCJjaGlsZC5iYWRnZVwiIFtuZ0NsYXNzXT1cImNoaWxkLmJhZGdlU3R5bGVDbGFzc1wiPnt7Y2hpbGQuYmFkZ2V9fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICA8YSAqbmdJZj1cImNoaWxkLnJvdXRlckxpbmtcIiAoa2V5ZG93bik9XCJvbkl0ZW1LZXlEb3duKCRldmVudClcIiAgW3JvdXRlckxpbmtdPVwiY2hpbGQucm91dGVyTGlua1wiIFtxdWVyeVBhcmFtc109XCJjaGlsZC5xdWVyeVBhcmFtc1wiIFtyb3V0ZXJMaW5rQWN0aXZlXT1cIidwLW1lbnVpdGVtLWxpbmstYWN0aXZlJ1wiIFtyb3V0ZXJMaW5rQWN0aXZlT3B0aW9uc109XCJjaGlsZC5yb3V0ZXJMaW5rQWN0aXZlT3B0aW9uc3x8e2V4YWN0OmZhbHNlfVwiIGNsYXNzPVwicC1tZW51aXRlbS1saW5rXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cInsncC1kaXNhYmxlZCc6Y2hpbGQuZGlzYWJsZWR9XCIgW2F0dHIudGFiaW5kZXhdPVwiIWl0ZW0uZXhwYW5kZWQgfHwgIXBhcmVudEV4cGFuZGVkID8gbnVsbCA6IGNoaWxkLmRpc2FibGVkID8gbnVsbCA6ICcwJ1wiIFthdHRyLmlkXT1cImNoaWxkLmlkXCIgcm9sZT1cInRyZWVpdGVtXCIgW2F0dHIuYXJpYS1leHBhbmRlZF09XCJjaGlsZC5leHBhbmRlZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAoY2xpY2spPVwiaGFuZGxlQ2xpY2soJGV2ZW50LGNoaWxkKVwiIFt0YXJnZXRdPVwiY2hpbGQudGFyZ2V0XCIgW2F0dHIudGl0bGVdPVwiY2hpbGQudGl0bGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgW2ZyYWdtZW50XT1cImNoaWxkLmZyYWdtZW50XCIgW3F1ZXJ5UGFyYW1zSGFuZGxpbmddPVwiY2hpbGQucXVlcnlQYXJhbXNIYW5kbGluZ1wiIFtwcmVzZXJ2ZUZyYWdtZW50XT1cImNoaWxkLnByZXNlcnZlRnJhZ21lbnRcIiBbc2tpcExvY2F0aW9uQ2hhbmdlXT1cImNoaWxkLnNraXBMb2NhdGlvbkNoYW5nZVwiIFtyZXBsYWNlVXJsXT1cImNoaWxkLnJlcGxhY2VVcmxcIiBbc3RhdGVdPVwiY2hpbGQuc3RhdGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC1wYW5lbG1lbnUtaWNvbiBwaSBwaS1md1wiIFtuZ0NsYXNzXT1cInsncGktYW5nbGUtcmlnaHQnOiFjaGlsZC5leHBhbmRlZCwncGktYW5nbGUtZG93bic6Y2hpbGQuZXhwYW5kZWR9XCIgKm5nSWY9XCJjaGlsZC5pdGVtc1wiIFtuZ1N0eWxlXT1cImNoaWxkLmljb25TdHlsZVwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC1tZW51aXRlbS1pY29uXCIgW25nQ2xhc3NdPVwiY2hpbGQuaWNvblwiICpuZ0lmPVwiY2hpbGQuaWNvblwiIFtuZ1N0eWxlXT1cImNoaWxkLmljb25TdHlsZVwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC1tZW51aXRlbS10ZXh0XCIgKm5nSWY9XCJjaGlsZC5lc2NhcGUgIT09IGZhbHNlOyBlbHNlIGh0bWxSb3V0ZUxhYmVsXCI+e3tjaGlsZC5sYWJlbH19PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlICNodG1sUm91dGVMYWJlbD48c3BhbiBjbGFzcz1cInAtbWVudWl0ZW0tdGV4dFwiIFtpbm5lckhUTUxdPVwiY2hpbGQubGFiZWxcIj48L3NwYW4+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC1tZW51aXRlbS1iYWRnZVwiICpuZ0lmPVwiY2hpbGQuYmFkZ2VcIiBbbmdDbGFzc109XCJjaGlsZC5iYWRnZVN0eWxlQ2xhc3NcIj57e2NoaWxkLmJhZGdlfX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICAgICAgPHAtcGFuZWxNZW51U3ViIFtpdGVtXT1cImNoaWxkXCIgW3BhcmVudEV4cGFuZGVkXT1cImV4cGFuZGVkICYmIHBhcmVudEV4cGFuZGVkXCIgW2V4cGFuZGVkXT1cImNoaWxkLmV4cGFuZGVkXCIgW3RyYW5zaXRpb25PcHRpb25zXT1cInRyYW5zaXRpb25PcHRpb25zXCIgKm5nSWY9XCJjaGlsZC5pdGVtc1wiPjwvcC1wYW5lbE1lbnVTdWI+XG4gICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgIDwvdWw+XG4gICAgYCxcbiAgICBhbmltYXRpb25zOiBbXG4gICAgICAgIHRyaWdnZXIoJ3N1Ym1lbnUnLCBbXG4gICAgICAgICAgICBzdGF0ZSgnaGlkZGVuJywgc3R5bGUoe1xuICAgICAgICAgICAgICAgIGhlaWdodDogJzAnXG4gICAgICAgICAgICB9KSksXG4gICAgICAgICAgICBzdGF0ZSgndmlzaWJsZScsIHN0eWxlKHtcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcqJ1xuICAgICAgICAgICAgfSkpLFxuICAgICAgICAgICAgdHJhbnNpdGlvbigndmlzaWJsZSA8PT4gaGlkZGVuJywgW2FuaW1hdGUoJ3t7dHJhbnNpdGlvblBhcmFtc319JyldKSxcbiAgICAgICAgICAgIHRyYW5zaXRpb24oJ3ZvaWQgPT4gKicsIGFuaW1hdGUoMCkpXG4gICAgICAgIF0pXG4gICAgXSxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgJ2NsYXNzJzogJ3AtZWxlbWVudCdcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIFBhbmVsTWVudVN1YiBleHRlbmRzIEJhc2VQYW5lbE1lbnVJdGVtIHtcblxuICAgIEBJbnB1dCgpIGl0ZW06IE1lbnVJdGVtO1xuXG4gICAgQElucHV0KCkgZXhwYW5kZWQ6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSBwYXJlbnRFeHBhbmRlZDogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIHRyYW5zaXRpb25PcHRpb25zOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSByb290OiBib29sZWFuO1xuXG4gICAgY29uc3RydWN0b3IocmVmOiBDaGFuZ2VEZXRlY3RvclJlZikge1xuICAgICAgICBzdXBlcihyZWYpO1xuICAgIH1cblxuXG5cbiAgICBvbkl0ZW1LZXlEb3duKGV2ZW50KSB7XG4gICAgICAgIGxldCBsaXN0SXRlbSA9IGV2ZW50LmN1cnJlbnRUYXJnZXQ7XG5cbiAgICAgICAgc3dpdGNoIChldmVudC5jb2RlKSB7XG4gICAgICAgICAgICBjYXNlICdTcGFjZSc6XG4gICAgICAgICAgICBjYXNlICdFbnRlcic6XG4gICAgICAgICAgICAgICAgaWYgKGxpc3RJdGVtICYmICFEb21IYW5kbGVyLmhhc0NsYXNzKGxpc3RJdGVtLCAncC1kaXNhYmxlZCcpKSB7XG4gICAgICAgICAgICAgICAgICAgIGxpc3RJdGVtLmNsaWNrKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC1wYW5lbE1lbnUnLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxkaXYgW2NsYXNzXT1cInN0eWxlQ2xhc3NcIiBbbmdTdHlsZV09XCJzdHlsZVwiIFtuZ0NsYXNzXT1cIidwLXBhbmVsbWVudSBwLWNvbXBvbmVudCdcIj5cbiAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nRm9yPVwibGV0IGl0ZW0gb2YgbW9kZWw7bGV0IGY9Zmlyc3Q7bGV0IGw9bGFzdDtcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC1wYW5lbG1lbnUtcGFuZWxcIiAqbmdJZj1cInZpc2libGUoaXRlbSlcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBbbmdDbGFzc109XCJ7J3AtY29tcG9uZW50IHAtcGFuZWxtZW51LWhlYWRlcic6dHJ1ZSwgJ3AtaGlnaGxpZ2h0JzppdGVtLmV4cGFuZGVkLCdwLWRpc2FibGVkJzppdGVtLmRpc2FibGVkfVwiIFtjbGFzc109XCJpdGVtLnN0eWxlQ2xhc3NcIiBbbmdTdHlsZV09XCJpdGVtLnN0eWxlXCIgcFRvb2x0aXAgW3Rvb2x0aXBPcHRpb25zXT1cIml0ZW0udG9vbHRpcE9wdGlvbnNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxhICpuZ0lmPVwiIWl0ZW0ucm91dGVyTGlua1wiIFthdHRyLmhyZWZdPVwiaXRlbS51cmxcIiAoY2xpY2spPVwiaGFuZGxlQ2xpY2soJGV2ZW50LGl0ZW0pXCIgKGtleWRvd24pPVwib25JdGVtS2V5RG93bigkZXZlbnQpXCIgW2F0dHIudGFiaW5kZXhdPVwiaXRlbS5kaXNhYmxlZCA/IG51bGwgOiAnMCdcIiBbYXR0ci5pZF09XCJpdGVtLmlkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFt0YXJnZXRdPVwiaXRlbS50YXJnZXRcIiBbYXR0ci50aXRsZV09XCJpdGVtLnRpdGxlXCIgY2xhc3M9XCJwLXBhbmVsbWVudS1oZWFkZXItbGlua1wiIFthdHRyLmFyaWEtZXhwYW5kZWRdPVwiaXRlbS5leHBhbmRlZFwiIFthdHRyLmlkXT1cIml0ZW0uaWQgKyAnX2hlYWRlcidcIiBbYXR0ci5hcmlhLWNvbnRyb2xzXT1cIml0ZW0uaWQgKydfY29udGVudCdcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiAqbmdJZj1cIml0ZW0uaXRlbXNcIiBjbGFzcz1cInAtcGFuZWxtZW51LWljb24gcGlcIiBbbmdDbGFzc109XCJ7J3BpLWNoZXZyb24tcmlnaHQnOiFpdGVtLmV4cGFuZGVkLCdwaS1jaGV2cm9uLWRvd24nOml0ZW0uZXhwYW5kZWR9XCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC1tZW51aXRlbS1pY29uXCIgW25nQ2xhc3NdPVwiaXRlbS5pY29uXCIgKm5nSWY9XCJpdGVtLmljb25cIiBbbmdTdHlsZV09XCJpdGVtLmljb25TdHlsZVwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtbWVudWl0ZW0tdGV4dFwiICpuZ0lmPVwiaXRlbS5lc2NhcGUgIT09IGZhbHNlOyBlbHNlIGh0bWxMYWJlbFwiPnt7aXRlbS5sYWJlbH19PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSAjaHRtbExhYmVsPjxzcGFuIGNsYXNzPVwicC1tZW51aXRlbS10ZXh0XCIgW2lubmVySFRNTF09XCJpdGVtLmxhYmVsXCI+PC9zcGFuPjwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwLW1lbnVpdGVtLWJhZGdlXCIgKm5nSWY9XCJpdGVtLmJhZGdlXCIgW25nQ2xhc3NdPVwiaXRlbS5iYWRnZVN0eWxlQ2xhc3NcIj57e2l0ZW0uYmFkZ2V9fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxhICpuZ0lmPVwiaXRlbS5yb3V0ZXJMaW5rXCIgW3JvdXRlckxpbmtdPVwiaXRlbS5yb3V0ZXJMaW5rXCIgW3F1ZXJ5UGFyYW1zXT1cIml0ZW0ucXVlcnlQYXJhbXNcIiBbcm91dGVyTGlua0FjdGl2ZV09XCIncC1tZW51aXRlbS1saW5rLWFjdGl2ZSdcIiBbcm91dGVyTGlua0FjdGl2ZU9wdGlvbnNdPVwiaXRlbS5yb3V0ZXJMaW5rQWN0aXZlT3B0aW9uc3x8e2V4YWN0OmZhbHNlfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAoY2xpY2spPVwiaGFuZGxlQ2xpY2soJGV2ZW50LGl0ZW0pXCIgKGtleWRvd24pPVwib25JdGVtS2V5RG93bigkZXZlbnQpXCIgW3RhcmdldF09XCJpdGVtLnRhcmdldFwiIFthdHRyLnRpdGxlXT1cIml0ZW0udGl0bGVcIiBjbGFzcz1cInAtcGFuZWxtZW51LWhlYWRlci1saW5rXCIgW2F0dHIuaWRdPVwiaXRlbS5pZFwiIFthdHRyLnRhYmluZGV4XT1cIml0ZW0uZGlzYWJsZWQgPyBudWxsIDogJzAnXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFtmcmFnbWVudF09XCJpdGVtLmZyYWdtZW50XCIgW3F1ZXJ5UGFyYW1zSGFuZGxpbmddPVwiaXRlbS5xdWVyeVBhcmFtc0hhbmRsaW5nXCIgW3ByZXNlcnZlRnJhZ21lbnRdPVwiaXRlbS5wcmVzZXJ2ZUZyYWdtZW50XCIgW3NraXBMb2NhdGlvbkNoYW5nZV09XCJpdGVtLnNraXBMb2NhdGlvbkNoYW5nZVwiIFtyZXBsYWNlVXJsXT1cIml0ZW0ucmVwbGFjZVVybFwiIFtzdGF0ZV09XCJpdGVtLnN0YXRlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gKm5nSWY9XCJpdGVtLml0ZW1zXCIgY2xhc3M9XCJwLXBhbmVsbWVudS1pY29uIHBpXCIgW25nQ2xhc3NdPVwieydwaS1jaGV2cm9uLXJpZ2h0JzohaXRlbS5leHBhbmRlZCwncGktY2hldnJvbi1kb3duJzppdGVtLmV4cGFuZGVkfVwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtbWVudWl0ZW0taWNvblwiIFtuZ0NsYXNzXT1cIml0ZW0uaWNvblwiICpuZ0lmPVwiaXRlbS5pY29uXCIgW25nU3R5bGVdPVwiaXRlbS5pY29uU3R5bGVcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwLW1lbnVpdGVtLXRleHRcIiAqbmdJZj1cIml0ZW0uZXNjYXBlICE9PSBmYWxzZTsgZWxzZSBodG1sUm91dGVMYWJlbFwiPnt7aXRlbS5sYWJlbH19PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSAjaHRtbFJvdXRlTGFiZWw+PHNwYW4gY2xhc3M9XCJwLW1lbnVpdGVtLXRleHRcIiBbaW5uZXJIVE1MXT1cIml0ZW0ubGFiZWxcIj48L3NwYW4+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtbWVudWl0ZW0tYmFkZ2VcIiAqbmdJZj1cIml0ZW0uYmFkZ2VcIiBbbmdDbGFzc109XCJpdGVtLmJhZGdlU3R5bGVDbGFzc1wiPnt7aXRlbS5iYWRnZX19PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiAqbmdJZj1cIml0ZW0uaXRlbXNcIiBjbGFzcz1cInAtdG9nZ2xlYWJsZS1jb250ZW50XCIgW25nQ2xhc3NdPVwieydwLXBhbmVsbWVudS1leHBhbmRlZCc6IGl0ZW0uZXhwYW5kZWR9XCIgIFtAcm9vdEl0ZW1dPVwiaXRlbS5leHBhbmRlZCA/IHt2YWx1ZTogJ3Zpc2libGUnLCBwYXJhbXM6IHt0cmFuc2l0aW9uUGFyYW1zOiBhbmltYXRpbmcgPyB0cmFuc2l0aW9uT3B0aW9ucyA6ICcwbXMnLCBoZWlnaHQ6ICcqJ319IDoge3ZhbHVlOiAnaGlkZGVuJywgcGFyYW1zOiB7dHJhbnNpdGlvblBhcmFtczogdHJhbnNpdGlvbk9wdGlvbnMsIGhlaWdodDogJzAnfX1cIiAgKEByb290SXRlbS5kb25lKT1cIm9uVG9nZ2xlRG9uZSgpXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC1wYW5lbG1lbnUtY29udGVudFwiIHJvbGU9XCJyZWdpb25cIiBbYXR0ci5pZF09XCJpdGVtLmlkICsnX2NvbnRlbnQnIFwiIFthdHRyLmFyaWEtbGFiZWxsZWRieV09XCJpdGVtLmlkICsnX2hlYWRlcidcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cC1wYW5lbE1lbnVTdWIgW2l0ZW1dPVwiaXRlbVwiIFtwYXJlbnRFeHBhbmRlZF09XCJpdGVtLmV4cGFuZGVkXCIgW2V4cGFuZGVkXT1cInRydWVcIiBbdHJhbnNpdGlvbk9wdGlvbnNdPVwidHJhbnNpdGlvbk9wdGlvbnNcIiBbcm9vdF09XCJ0cnVlXCI+PC9wLXBhbmVsTWVudVN1Yj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICA8L2Rpdj5cbiAgICBgLFxuICAgIGFuaW1hdGlvbnM6IFtcbiAgICAgICAgdHJpZ2dlcigncm9vdEl0ZW0nLCBbXG4gICAgICAgICAgICBzdGF0ZSgnaGlkZGVuJywgc3R5bGUoe1xuICAgICAgICAgICAgICAgIGhlaWdodDogJzAnXG4gICAgICAgICAgICB9KSksXG4gICAgICAgICAgICBzdGF0ZSgndmlzaWJsZScsIHN0eWxlKHtcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcqJ1xuICAgICAgICAgICAgfSkpLFxuICAgICAgICAgICAgdHJhbnNpdGlvbigndmlzaWJsZSA8PT4gaGlkZGVuJywgW2FuaW1hdGUoJ3t7dHJhbnNpdGlvblBhcmFtc319JyldKSxcbiAgICAgICAgICAgIHRyYW5zaXRpb24oJ3ZvaWQgPT4gKicsIGFuaW1hdGUoMCkpXG4gICAgICAgIF0pXG4gICAgXSxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAgIHN0eWxlVXJsczogWycuL3BhbmVsbWVudS5jc3MnXSxcbiAgICBob3N0OiB7XG4gICAgICAgICdjbGFzcyc6ICdwLWVsZW1lbnQnXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBQYW5lbE1lbnUgZXh0ZW5kcyBCYXNlUGFuZWxNZW51SXRlbSB7XG5cbiAgICBASW5wdXQoKSBtb2RlbDogTWVudUl0ZW1bXTtcblxuICAgIEBJbnB1dCgpIHN0eWxlOiBhbnk7XG5cbiAgICBASW5wdXQoKSBzdHlsZUNsYXNzOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBtdWx0aXBsZTogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBASW5wdXQoKSB0cmFuc2l0aW9uT3B0aW9uczogc3RyaW5nID0gJzQwMG1zIGN1YmljLWJlemllcigwLjg2LCAwLCAwLjA3LCAxKSc7XG5cbiAgICBwdWJsaWMgYW5pbWF0aW5nOiBib29sZWFuO1xuXG4gICAgY29uc3RydWN0b3IocmVmOiBDaGFuZ2VEZXRlY3RvclJlZikge1xuICAgICAgICBzdXBlcihyZWYpO1xuICAgIH1cblxuICAgIGNvbGxhcHNlQWxsKCkge1xuICAgIFx0Zm9yKGxldCBpdGVtIG9mIHRoaXMubW9kZWwpIHtcbiAgICBcdFx0aWYgKGl0ZW0uZXhwYW5kZWQpIHtcbiAgICBcdFx0XHRpdGVtLmV4cGFuZGVkID0gZmFsc2U7XG4gICAgXHRcdH1cbiAgICBcdH1cbiAgICB9XG5cbiAgICBoYW5kbGVDbGljayhldmVudCwgaXRlbSkge1xuICAgIFx0aWYgKCF0aGlzLm11bHRpcGxlKSB7XG4gICAgICAgICAgICBmb3IobGV0IG1vZGVsSXRlbSBvZiB0aGlzLm1vZGVsKSB7XG4gICAgICAgIFx0XHRpZiAoaXRlbSAhPT0gbW9kZWxJdGVtICYmIG1vZGVsSXRlbS5leHBhbmRlZCkge1xuICAgICAgICBcdFx0XHRtb2RlbEl0ZW0uZXhwYW5kZWQgPSBmYWxzZTtcbiAgICAgICAgXHRcdH1cbiAgICAgICAgXHR9XG4gICAgXHR9XG5cbiAgICAgICAgdGhpcy5hbmltYXRpbmcgPSB0cnVlO1xuICAgICAgICBzdXBlci5oYW5kbGVDbGljayhldmVudCwgaXRlbSk7XG4gICAgfVxuXG4gICAgb25Ub2dnbGVEb25lKCkge1xuICAgICAgICB0aGlzLmFuaW1hdGluZyA9IGZhbHNlO1xuICAgIH1cblxuICAgIG9uSXRlbUtleURvd24oZXZlbnQpIHtcbiAgICAgICAgbGV0IGxpc3RJdGVtID0gZXZlbnQuY3VycmVudFRhcmdldDtcblxuICAgICAgICBzd2l0Y2ggKGV2ZW50LmNvZGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ1NwYWNlJzpcbiAgICAgICAgICAgIGNhc2UgJ0VudGVyJzpcbiAgICAgICAgICAgICAgICBpZiAobGlzdEl0ZW0gJiYgIURvbUhhbmRsZXIuaGFzQ2xhc3MobGlzdEl0ZW0sICdwLWRpc2FibGVkJykpIHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdEl0ZW0uY2xpY2soKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZpc2libGUoaXRlbSkge1xuICAgICAgICByZXR1cm4gaXRlbS52aXNpYmxlICE9PSBmYWxzZTtcbiAgICB9XG5cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLFJvdXRlck1vZHVsZSxUb29sdGlwTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbUGFuZWxNZW51LFJvdXRlck1vZHVsZSxUb29sdGlwTW9kdWxlXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtQYW5lbE1lbnUsUGFuZWxNZW51U3ViXVxufSlcbmV4cG9ydCBjbGFzcyBQYW5lbE1lbnVNb2R1bGUgeyB9XG4iXX0=