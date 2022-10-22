import { NgModule, Component, EventEmitter, Output, Input, ChangeDetectionStrategy, ViewEncapsulation, ContentChildren, forwardRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import { animate, style, transition, trigger } from '@angular/animations';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ConnectedOverlayScrollHandler, DomHandler } from 'primeng/dom';
import { TreeModule } from 'primeng/tree';
import { ObjectUtils, ZIndexUtils } from 'primeng/utils';
import * as i0 from "@angular/core";
import * as i1 from "primeng/api";
import * as i2 from "@angular/common";
import * as i3 from "primeng/tree";
export const TREESELECT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TreeSelect),
    multi: true
};
export class TreeSelect {
    constructor(config, cd, el, overlayService) {
        this.config = config;
        this.cd = cd;
        this.el = el;
        this.overlayService = overlayService;
        this.type = "button";
        this.scrollHeight = "400px";
        this.metaKeySelection = true;
        this.display = "comma";
        this.selectionMode = "single";
        this.emptyMessage = '';
        this.filter = false;
        this.filterBy = 'label';
        this.filterMode = 'lenient';
        this.filterInputAutoFocus = true;
        this.propagateSelectionDown = true;
        this.propagateSelectionUp = true;
        this.showClear = false;
        this.resetFilterOnHide = true;
        this.showTransitionOptions = '.12s cubic-bezier(0, 0, 0.2, 1)';
        this.hideTransitionOptions = '.1s linear';
        this.onNodeExpand = new EventEmitter();
        this.onNodeCollapse = new EventEmitter();
        this.onShow = new EventEmitter();
        this.onHide = new EventEmitter();
        this.onClear = new EventEmitter();
        this.onFilter = new EventEmitter();
        this.onNodeUnselect = new EventEmitter();
        this.onNodeSelect = new EventEmitter();
        this.filterValue = null;
        this.expandedNodes = [];
        this.onModelChange = () => { };
        this.onModelTouched = () => { };
    }
    get options() {
        return this._options;
    }
    ;
    set options(options) {
        this._options = options;
        this.updateTreeState();
    }
    ngOnInit() {
        this.updateTreeState();
    }
    ngAfterContentInit() {
        if (this.templates.length) {
            this.templateMap = {};
        }
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'value':
                    this.valueTemplate = item.template;
                    break;
                case 'header':
                    this.headerTemplate = item.template;
                    break;
                case 'empty':
                    this.emptyTemplate = item.template;
                    break;
                case 'footer':
                    this.footerTemplate = item.template;
                    break;
                default:
                    if (item.name)
                        this.templateMap[item.name] = item.template;
                    else
                        this.valueTemplate = item.template; //TODO: @deprecated Used "value" template instead
                    break;
            }
        });
    }
    onOverlayAnimationStart(event) {
        switch (event.toState) {
            case 'visible':
                this.overlayEl = event.element;
                this.onOverlayEnter();
                break;
        }
    }
    onOverlayAnimationDone(event) {
        switch (event.toState) {
            case 'void':
                this.onOverlayLeave();
                break;
        }
    }
    onSelectionChange(event) {
        this.value = event;
        this.onModelChange(this.value);
        this.cd.markForCheck();
    }
    onClick(event) {
        if (!this.disabled && (!this.overlayEl || !this.overlayEl.contains(event.target)) && !DomHandler.hasClass(event.target, 'p-treeselect-close')) {
            if (this.overlayVisible) {
                this.hide();
            }
            else
                this.show();
            this.focusInput.nativeElement.focus();
        }
    }
    onKeyDown(event) {
        switch (event.which) {
            //down
            case 40:
                if (!this.overlayVisible && event.altKey) {
                    this.show();
                    event.preventDefault();
                }
                else if (this.overlayVisible && this.overlayEl) {
                    let focusableElements = DomHandler.getFocusableElements(this.overlayEl);
                    if (focusableElements && focusableElements.length > 0) {
                        focusableElements[0].focus();
                    }
                    event.preventDefault();
                }
                break;
            //space
            case 32:
                if (!this.overlayVisible) {
                    this.show();
                    event.preventDefault();
                }
                break;
            //enter and escape
            case 13:
            case 27:
                if (this.overlayVisible) {
                    this.hide();
                    event.preventDefault();
                }
                break;
            //tab
            case 9:
                this.hide();
                break;
            default:
                break;
        }
    }
    onFilterInput(event) {
        this.filterValue = event.target.value;
        this.treeViewChild._filter(this.filterValue);
        this.onFilter.emit({
            originalEvent: event,
            filteredValue: this.treeViewChild.filteredNodes
        });
    }
    show() {
        this.overlayVisible = true;
    }
    hide() {
        this.overlayVisible = false;
        this.resetFilter();
        this.cd.markForCheck();
    }
    clear(event) {
        this.value = null;
        this.resetExpandedNodes();
        this.onModelChange(this.value);
        this.onClear.emit();
        event.stopPropagation();
    }
    checkValue() {
        return this.value !== null && ObjectUtils.isNotEmpty(this.value);
    }
    resetFilter() {
        if (this.filter && !this.resetFilterOnHide) {
            this.filteredNodes = this.treeViewChild.filteredNodes;
            this.treeViewChild.resetFilter();
        }
        else {
            this.filterValue = null;
        }
    }
    onOverlayClick(event) {
        this.overlayService.add({
            originalEvent: event,
            target: this.el.nativeElement
        });
    }
    updateTreeState() {
        if (this.value) {
            let selectedNodes = this.selectionMode === "single" ? [this.value] : [...this.value];
            this.resetExpandedNodes();
            if (selectedNodes && this.options) {
                this.updateTreeBranchState(null, null, selectedNodes);
            }
        }
    }
    updateTreeBranchState(node, path, selectedNodes) {
        if (node) {
            if (this.isSelected(node)) {
                this.expandPath(path);
                selectedNodes.splice(selectedNodes.indexOf(node), 1);
            }
            if (selectedNodes.length > 0 && node.children) {
                for (let childNode of node.children) {
                    path.push(node);
                    this.updateTreeBranchState(childNode, path, selectedNodes);
                }
            }
        }
        else {
            for (let childNode of this.options) {
                this.updateTreeBranchState(childNode, [], selectedNodes);
            }
        }
    }
    expandPath(expandedNodes) {
        for (let node of expandedNodes) {
            node.expanded = true;
        }
        this.expandedNodes = [...expandedNodes];
    }
    nodeExpand(event) {
        this.onNodeExpand.emit(event);
        this.expandedNodes.push(event.node);
    }
    nodeCollapse(event) {
        this.onNodeCollapse.emit(event);
        this.expandedNodes.splice(this.expandedNodes.indexOf(event.node), 1);
    }
    resetExpandedNodes() {
        for (let node of this.expandedNodes) {
            node.expanded = false;
        }
        this.expandedNodes = [];
    }
    findSelectedNodes(node, keys, selectedNodes) {
        if (node) {
            if (this.isSelected(node)) {
                selectedNodes.push(node);
                delete keys[node.key];
            }
            if (Object.keys(keys).length && node.children) {
                for (let childNode of node.children) {
                    this.findSelectedNodes(childNode, keys, selectedNodes);
                }
            }
        }
        else {
            for (let childNode of this.options) {
                this.findSelectedNodes(childNode, keys, selectedNodes);
            }
        }
    }
    isSelected(node) {
        return this.findIndexInSelection(node) != -1;
    }
    findIndexInSelection(node) {
        let index = -1;
        if (this.value) {
            if (this.selectionMode === "single") {
                let areNodesEqual = (this.value.key && this.value.key === node.key) || this.value == node;
                index = areNodesEqual ? 0 : -1;
            }
            else {
                for (let i = 0; i < this.value.length; i++) {
                    let selectedNode = this.value[i];
                    let areNodesEqual = (selectedNode.key && selectedNode.key === node.key) || selectedNode == node;
                    if (areNodesEqual) {
                        index = i;
                        break;
                    }
                }
            }
        }
        return index;
    }
    onSelect(node) {
        this.onNodeSelect.emit(node);
        if (this.selectionMode === 'single') {
            this.hide();
        }
    }
    onUnselect(node) {
        this.onNodeUnselect.emit(node);
    }
    onOverlayEnter() {
        ZIndexUtils.set('overlay', this.overlayEl, this.config.zIndex.overlay);
        if (this.filter && this.filterInputAutoFocus) {
            this.filterViewChild.nativeElement.focus();
        }
        this.appendContainer();
        this.alignOverlay();
        this.bindOutsideClickListener();
        this.bindScrollListener();
        this.bindResizeListener();
        this.onShow.emit();
    }
    onOverlayLeave() {
        this.unbindOutsideClickListener();
        this.unbindScrollListener();
        this.unbindResizeListener();
        ZIndexUtils.clear(this.overlayEl);
        this.overlayEl = null;
        this.onHide.emit();
    }
    onFocus() {
        this.focused = true;
    }
    onBlur() {
        this.focused = false;
    }
    writeValue(value) {
        this.value = value;
        this.updateTreeState();
        this.cd.markForCheck();
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
    appendContainer() {
        if (this.appendTo) {
            if (this.appendTo === 'body')
                document.body.appendChild(this.overlayEl);
            else
                document.getElementById(this.appendTo).appendChild(this.overlayEl);
        }
    }
    restoreAppend() {
        if (this.overlayEl && this.appendTo) {
            if (this.appendTo === 'body')
                document.body.removeChild(this.overlayEl);
            else
                document.getElementById(this.appendTo).removeChild(this.overlayEl);
        }
    }
    alignOverlay() {
        if (this.appendTo) {
            DomHandler.absolutePosition(this.overlayEl, this.containerEl.nativeElement);
            this.overlayEl.style.minWidth = DomHandler.getOuterWidth(this.containerEl.nativeElement) + 'px';
        }
        else {
            DomHandler.relativePosition(this.overlayEl, this.containerEl.nativeElement);
        }
    }
    bindOutsideClickListener() {
        if (!this.outsideClickListener) {
            this.outsideClickListener = (event) => {
                if (this.overlayVisible && this.overlayEl && !this.containerEl.nativeElement.contains(event.target) && !this.overlayEl.contains(event.target)) {
                    this.hide();
                }
            };
            document.addEventListener('click', this.outsideClickListener);
        }
    }
    unbindOutsideClickListener() {
        if (this.outsideClickListener) {
            document.removeEventListener('click', this.outsideClickListener);
            this.outsideClickListener = null;
        }
    }
    bindScrollListener() {
        if (!this.scrollHandler) {
            this.scrollHandler = new ConnectedOverlayScrollHandler(this.containerEl.nativeElement, () => {
                if (this.overlayVisible) {
                    this.hide();
                }
            });
        }
        this.scrollHandler.bindScrollListener();
    }
    unbindScrollListener() {
        if (this.scrollHandler) {
            this.scrollHandler.unbindScrollListener();
        }
    }
    bindResizeListener() {
        if (!this.resizeListener) {
            this.resizeListener = () => {
                if (this.overlayVisible && !DomHandler.isTouchDevice()) {
                    this.hide();
                }
            };
            window.addEventListener('resize', this.resizeListener);
        }
    }
    unbindResizeListener() {
        if (this.resizeListener) {
            window.removeEventListener('resize', this.resizeListener);
            this.resizeListener = null;
        }
    }
    ngOnDestroy() {
        this.restoreAppend();
        this.unbindOutsideClickListener();
        this.unbindResizeListener();
        if (this.scrollHandler) {
            this.scrollHandler.destroy();
            this.scrollHandler = null;
        }
        if (this.overlayEl) {
            ZIndexUtils.clear(this.overlayEl);
            this.overlayEl = null;
        }
    }
    containerClass() {
        return {
            'p-treeselect p-component p-inputwrapper': true,
            'p-treeselect-chip': this.display === 'chip',
            'p-disabled': this.disabled,
            'p-focus': this.focused
        };
    }
    labelClass() {
        return {
            'p-treeselect-label': true,
            'p-placeholder': this.label === this.placeholder,
            'p-treeselect-label-empty': !this.placeholder && this.emptyValue
        };
    }
    get emptyValue() {
        return !this.value || Object.keys(this.value).length === 0;
    }
    get emptyOptions() {
        return !this.options || this.options.length === 0;
    }
    get label() {
        let value = this.value || [];
        return value.length ? value.map(node => node.label).join(', ') : (this.selectionMode === "single" && this.value) ? value.label : this.placeholder;
    }
}
TreeSelect.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: TreeSelect, deps: [{ token: i1.PrimeNGConfig }, { token: i0.ChangeDetectorRef }, { token: i0.ElementRef }, { token: i1.OverlayService }], target: i0.ɵɵFactoryTarget.Component });
TreeSelect.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.7", type: TreeSelect, selector: "p-treeSelect", inputs: { type: "type", inputId: "inputId", scrollHeight: "scrollHeight", disabled: "disabled", metaKeySelection: "metaKeySelection", display: "display", selectionMode: "selectionMode", tabindex: "tabindex", ariaLabelledBy: "ariaLabelledBy", placeholder: "placeholder", panelClass: "panelClass", emptyMessage: "emptyMessage", appendTo: "appendTo", filter: "filter", filterBy: "filterBy", filterMode: "filterMode", filterPlaceholder: "filterPlaceholder", filterLocale: "filterLocale", filterInputAutoFocus: "filterInputAutoFocus", propagateSelectionDown: "propagateSelectionDown", propagateSelectionUp: "propagateSelectionUp", showClear: "showClear", resetFilterOnHide: "resetFilterOnHide", options: "options", showTransitionOptions: "showTransitionOptions", hideTransitionOptions: "hideTransitionOptions" }, outputs: { onNodeExpand: "onNodeExpand", onNodeCollapse: "onNodeCollapse", onShow: "onShow", onHide: "onHide", onClear: "onClear", onFilter: "onFilter", onNodeUnselect: "onNodeUnselect", onNodeSelect: "onNodeSelect" }, host: { properties: { "class.p-inputwrapper-filled": "!emptyValue", "class.p-inputwrapper-focus": "focused || overlayVisible", "class.p-treeselect-clearable": "showClear && !disabled" }, classAttribute: "p-element p-inputwrapper" }, providers: [TREESELECT_VALUE_ACCESSOR], queries: [{ propertyName: "templates", predicate: PrimeTemplate }], viewQueries: [{ propertyName: "containerEl", first: true, predicate: ["container"], descendants: true }, { propertyName: "focusInput", first: true, predicate: ["focusInput"], descendants: true }, { propertyName: "filterViewChild", first: true, predicate: ["filter"], descendants: true }, { propertyName: "treeViewChild", first: true, predicate: ["tree"], descendants: true }], ngImport: i0, template: `
    <div #container [ngClass]="containerClass()" (click)="onClick($event)">
        <div class="p-hidden-accessible">
            <input #focusInput type="text" role="listbox" [attr.id]="inputId" readonly [disabled]="disabled" (focus)="onFocus()" (blur)="onBlur()" (keydown)="onKeyDown($event)" [attr.tabindex]="tabindex"
            aria-haspopup="true" [attr.aria-expanded]="overlayVisible" [attr.aria-labelledby]="ariaLabelledBy"/>
        </div>
        <div class="p-treeselect-label-container">
            <div [ngClass]="labelClass()">
                <ng-container *ngIf="valueTemplate;else defaultValueTemplate">
                        <ng-container *ngTemplateOutlet="valueTemplate; context: {$implicit: value, placeholder: placeholder}"></ng-container>
                </ng-container>
                <ng-template #defaultValueTemplate>
                    <ng-container *ngIf="display === 'comma';else chipsValueTemplate">
                        {{label || 'empty'}}
                    </ng-container>
                    <ng-template #chipsValueTemplate>
                        <div *ngFor="let node of value" class="p-treeselect-token">
                            <span class="p-treeselect-token-label">{{node.label}}</span>
                        </div>
                        <ng-container *ngIf="emptyValue">{{placeholder || 'empty'}}</ng-container>
                    </ng-template>
                </ng-template>
            </div>
            <i *ngIf="checkValue() && !disabled && showClear" class="p-treeselect-clear-icon pi pi-times" (click)="clear($event)"></i>

        </div>
        <div class="p-treeselect-trigger">
            <span class="p-treeselect-trigger-icon pi pi-chevron-down"></span>
        </div>
        <div #overlayRef class="p-treeselect-panel p-component" *ngIf="overlayVisible" (click)="onOverlayClick($event)"
            [@overlayAnimation]="{value: 'visible', params: {showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions}}" (@overlayAnimation.start)="onOverlayAnimationStart($event)" (@overlayAnimation.done)="onOverlayAnimationDone($event)">
            <ng-container *ngTemplateOutlet="headerTemplate; context: {$implicit: value, options: options}"></ng-container>
            <div class="p-treeselect-header" *ngIf="filter">
                <div class="p-treeselect-filter-container">
                <input #filter type="text" autocomplete="off" class="p-treeselect-filter p-inputtext p-component" [attr.placeholder]="filterPlaceholder" (keydown.enter)="$event.preventDefault()" (input)="onFilterInput($event)" [value]="filterValue">
                    <span class="p-treeselect-filter-icon pi pi-search"></span>
                </div>
                <button class="p-treeselect-close p-link" (click)="hide()">
                    <span class="p-treeselect-filter-icon pi pi-times"></span>
                </button>
            </div>
            <div class="p-treeselect-items-wrapper" [ngStyle]="{'max-height': scrollHeight}">
                <p-tree #tree [value]="options" [propagateSelectionDown]="propagateSelectionDown" [propagateSelectionUp]="propagateSelectionUp" [selectionMode]="selectionMode" (selectionChange)="onSelectionChange($event)" [selection]="value"
                    [metaKeySelection]="metaKeySelection" (onNodeExpand)="nodeExpand($event)" (onNodeCollapse)="nodeCollapse($event)"
                    (onNodeSelect)="onSelect($event)" [emptyMessage]="emptyMessage" (onNodeUnselect)="onUnselect($event)" [filterBy]="filterBy" [filterMode]="filterMode" [filterPlaceholder]="filterPlaceholder" [filterLocale]="filterLocale" [filterInputAutoFocus]="filterInputAutoFocus" [filteredNodes]="filteredNodes" [_templateMap]="templateMap">
                        <ng-container *ngIf="emptyTemplate">
                            <ng-template pTemplate="empty">
                                <ng-container *ngTemplateOutlet="emptyTemplate;"></ng-container>
                            </ng-template>
                        </ng-container>
                </p-tree>
            </div>
            <ng-container *ngTemplateOutlet="footerTemplate; context: {$implicit: value, options: options}"></ng-container>
        </div>
    </div>
    `, isInline: true, styles: [".p-treeselect{display:inline-flex;cursor:pointer;position:relative;-webkit-user-select:none;user-select:none}.p-treeselect-trigger{display:flex;align-items:center;justify-content:center;flex-shrink:0}.p-treeselect-label-container{overflow:hidden;flex:1 1 auto;cursor:pointer}.p-treeselect-label{display:block;white-space:nowrap;cursor:pointer;overflow:hidden;text-overflow:ellipsis}.p-treeselect-label-empty{overflow:hidden;visibility:hidden}.p-treeselect-token{cursor:default;display:inline-flex;align-items:center;flex:0 0 auto}.p-treeselect .p-treeselect-panel{min-width:100%}.p-treeselect-panel{position:absolute;top:0;left:0}.p-treeselect-items-wrapper{overflow:auto}.p-treeselect-header{display:flex;align-items:center;justify-content:space-between}.p-treeselect-filter-container{position:relative;flex:1 1 auto}.p-treeselect-filter-icon{position:absolute;top:50%;margin-top:-.5rem}.p-treeselect-filter-container .p-inputtext{width:100%}.p-treeselect-close{display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;position:relative;margin-left:auto}.p-treeselect-clear-icon{position:absolute;top:50%;margin-top:-.5rem}.p-fluid .p-treeselect{display:flex}.p-treeselect-clear-icon{position:absolute;top:50%;margin-top:-.5rem;cursor:pointer}.p-treeselect-clearable{position:relative}\n"], dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i2.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i1.PrimeTemplate, selector: "[pTemplate]", inputs: ["type", "pTemplate"] }, { kind: "component", type: i3.Tree, selector: "p-tree", inputs: ["value", "selectionMode", "selection", "style", "styleClass", "contextMenu", "layout", "draggableScope", "droppableScope", "draggableNodes", "droppableNodes", "metaKeySelection", "propagateSelectionUp", "propagateSelectionDown", "loading", "loadingIcon", "emptyMessage", "ariaLabel", "togglerAriaLabel", "ariaLabelledBy", "validateDrop", "filter", "filterBy", "filterMode", "filterPlaceholder", "filteredNodes", "filterLocale", "scrollHeight", "lazy", "virtualScroll", "virtualScrollItemSize", "virtualScrollOptions", "indentation", "_templateMap", "trackBy", "virtualNodeHeight"], outputs: ["selectionChange", "onNodeSelect", "onNodeUnselect", "onNodeExpand", "onNodeCollapse", "onNodeContextMenuSelect", "onNodeDrop", "onLazyLoad", "onScroll", "onScrollIndexChange", "onFilter"] }], animations: [
        trigger('overlayAnimation', [
            transition(':enter', [
                style({ opacity: 0, transform: 'scaleY(0.8)' }),
                animate('{{showTransitionParams}}')
            ]),
            transition(':leave', [
                animate('{{hideTransitionParams}}', style({ opacity: 0 }))
            ])
        ])
    ], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: TreeSelect, decorators: [{
            type: Component,
            args: [{ selector: 'p-treeSelect', template: `
    <div #container [ngClass]="containerClass()" (click)="onClick($event)">
        <div class="p-hidden-accessible">
            <input #focusInput type="text" role="listbox" [attr.id]="inputId" readonly [disabled]="disabled" (focus)="onFocus()" (blur)="onBlur()" (keydown)="onKeyDown($event)" [attr.tabindex]="tabindex"
            aria-haspopup="true" [attr.aria-expanded]="overlayVisible" [attr.aria-labelledby]="ariaLabelledBy"/>
        </div>
        <div class="p-treeselect-label-container">
            <div [ngClass]="labelClass()">
                <ng-container *ngIf="valueTemplate;else defaultValueTemplate">
                        <ng-container *ngTemplateOutlet="valueTemplate; context: {$implicit: value, placeholder: placeholder}"></ng-container>
                </ng-container>
                <ng-template #defaultValueTemplate>
                    <ng-container *ngIf="display === 'comma';else chipsValueTemplate">
                        {{label || 'empty'}}
                    </ng-container>
                    <ng-template #chipsValueTemplate>
                        <div *ngFor="let node of value" class="p-treeselect-token">
                            <span class="p-treeselect-token-label">{{node.label}}</span>
                        </div>
                        <ng-container *ngIf="emptyValue">{{placeholder || 'empty'}}</ng-container>
                    </ng-template>
                </ng-template>
            </div>
            <i *ngIf="checkValue() && !disabled && showClear" class="p-treeselect-clear-icon pi pi-times" (click)="clear($event)"></i>

        </div>
        <div class="p-treeselect-trigger">
            <span class="p-treeselect-trigger-icon pi pi-chevron-down"></span>
        </div>
        <div #overlayRef class="p-treeselect-panel p-component" *ngIf="overlayVisible" (click)="onOverlayClick($event)"
            [@overlayAnimation]="{value: 'visible', params: {showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions}}" (@overlayAnimation.start)="onOverlayAnimationStart($event)" (@overlayAnimation.done)="onOverlayAnimationDone($event)">
            <ng-container *ngTemplateOutlet="headerTemplate; context: {$implicit: value, options: options}"></ng-container>
            <div class="p-treeselect-header" *ngIf="filter">
                <div class="p-treeselect-filter-container">
                <input #filter type="text" autocomplete="off" class="p-treeselect-filter p-inputtext p-component" [attr.placeholder]="filterPlaceholder" (keydown.enter)="$event.preventDefault()" (input)="onFilterInput($event)" [value]="filterValue">
                    <span class="p-treeselect-filter-icon pi pi-search"></span>
                </div>
                <button class="p-treeselect-close p-link" (click)="hide()">
                    <span class="p-treeselect-filter-icon pi pi-times"></span>
                </button>
            </div>
            <div class="p-treeselect-items-wrapper" [ngStyle]="{'max-height': scrollHeight}">
                <p-tree #tree [value]="options" [propagateSelectionDown]="propagateSelectionDown" [propagateSelectionUp]="propagateSelectionUp" [selectionMode]="selectionMode" (selectionChange)="onSelectionChange($event)" [selection]="value"
                    [metaKeySelection]="metaKeySelection" (onNodeExpand)="nodeExpand($event)" (onNodeCollapse)="nodeCollapse($event)"
                    (onNodeSelect)="onSelect($event)" [emptyMessage]="emptyMessage" (onNodeUnselect)="onUnselect($event)" [filterBy]="filterBy" [filterMode]="filterMode" [filterPlaceholder]="filterPlaceholder" [filterLocale]="filterLocale" [filterInputAutoFocus]="filterInputAutoFocus" [filteredNodes]="filteredNodes" [_templateMap]="templateMap">
                        <ng-container *ngIf="emptyTemplate">
                            <ng-template pTemplate="empty">
                                <ng-container *ngTemplateOutlet="emptyTemplate;"></ng-container>
                            </ng-template>
                        </ng-container>
                </p-tree>
            </div>
            <ng-container *ngTemplateOutlet="footerTemplate; context: {$implicit: value, options: options}"></ng-container>
        </div>
    </div>
    `, animations: [
                        trigger('overlayAnimation', [
                            transition(':enter', [
                                style({ opacity: 0, transform: 'scaleY(0.8)' }),
                                animate('{{showTransitionParams}}')
                            ]),
                            transition(':leave', [
                                animate('{{hideTransitionParams}}', style({ opacity: 0 }))
                            ])
                        ])
                    ], host: {
                        'class': 'p-element p-inputwrapper',
                        '[class.p-inputwrapper-filled]': '!emptyValue',
                        '[class.p-inputwrapper-focus]': 'focused || overlayVisible',
                        '[class.p-treeselect-clearable]': 'showClear && !disabled'
                    }, changeDetection: ChangeDetectionStrategy.OnPush, providers: [TREESELECT_VALUE_ACCESSOR], encapsulation: ViewEncapsulation.None, styles: [".p-treeselect{display:inline-flex;cursor:pointer;position:relative;-webkit-user-select:none;user-select:none}.p-treeselect-trigger{display:flex;align-items:center;justify-content:center;flex-shrink:0}.p-treeselect-label-container{overflow:hidden;flex:1 1 auto;cursor:pointer}.p-treeselect-label{display:block;white-space:nowrap;cursor:pointer;overflow:hidden;text-overflow:ellipsis}.p-treeselect-label-empty{overflow:hidden;visibility:hidden}.p-treeselect-token{cursor:default;display:inline-flex;align-items:center;flex:0 0 auto}.p-treeselect .p-treeselect-panel{min-width:100%}.p-treeselect-panel{position:absolute;top:0;left:0}.p-treeselect-items-wrapper{overflow:auto}.p-treeselect-header{display:flex;align-items:center;justify-content:space-between}.p-treeselect-filter-container{position:relative;flex:1 1 auto}.p-treeselect-filter-icon{position:absolute;top:50%;margin-top:-.5rem}.p-treeselect-filter-container .p-inputtext{width:100%}.p-treeselect-close{display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;position:relative;margin-left:auto}.p-treeselect-clear-icon{position:absolute;top:50%;margin-top:-.5rem}.p-fluid .p-treeselect{display:flex}.p-treeselect-clear-icon{position:absolute;top:50%;margin-top:-.5rem;cursor:pointer}.p-treeselect-clearable{position:relative}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.PrimeNGConfig }, { type: i0.ChangeDetectorRef }, { type: i0.ElementRef }, { type: i1.OverlayService }]; }, propDecorators: { type: [{
                type: Input
            }], inputId: [{
                type: Input
            }], scrollHeight: [{
                type: Input
            }], disabled: [{
                type: Input
            }], metaKeySelection: [{
                type: Input
            }], display: [{
                type: Input
            }], selectionMode: [{
                type: Input
            }], tabindex: [{
                type: Input
            }], ariaLabelledBy: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], panelClass: [{
                type: Input
            }], emptyMessage: [{
                type: Input
            }], appendTo: [{
                type: Input
            }], filter: [{
                type: Input
            }], filterBy: [{
                type: Input
            }], filterMode: [{
                type: Input
            }], filterPlaceholder: [{
                type: Input
            }], filterLocale: [{
                type: Input
            }], filterInputAutoFocus: [{
                type: Input
            }], propagateSelectionDown: [{
                type: Input
            }], propagateSelectionUp: [{
                type: Input
            }], showClear: [{
                type: Input
            }], resetFilterOnHide: [{
                type: Input
            }], options: [{
                type: Input
            }], showTransitionOptions: [{
                type: Input
            }], hideTransitionOptions: [{
                type: Input
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }], containerEl: [{
                type: ViewChild,
                args: ['container']
            }], focusInput: [{
                type: ViewChild,
                args: ['focusInput']
            }], filterViewChild: [{
                type: ViewChild,
                args: ['filter']
            }], treeViewChild: [{
                type: ViewChild,
                args: ['tree']
            }], onNodeExpand: [{
                type: Output
            }], onNodeCollapse: [{
                type: Output
            }], onShow: [{
                type: Output
            }], onHide: [{
                type: Output
            }], onClear: [{
                type: Output
            }], onFilter: [{
                type: Output
            }], onNodeUnselect: [{
                type: Output
            }], onNodeSelect: [{
                type: Output
            }] } });
export class TreeSelectModule {
}
TreeSelectModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: TreeSelectModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
TreeSelectModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.7", ngImport: i0, type: TreeSelectModule, declarations: [TreeSelect], imports: [CommonModule, RippleModule, SharedModule, TreeModule], exports: [TreeSelect, SharedModule, TreeModule] });
TreeSelectModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: TreeSelectModule, imports: [CommonModule, RippleModule, SharedModule, TreeModule, SharedModule, TreeModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: TreeSelectModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, RippleModule, SharedModule, TreeModule],
                    exports: [TreeSelect, SharedModule, TreeModule],
                    declarations: [TreeSelect]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZXNlbGVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy90cmVlc2VsZWN0L3RyZWVzZWxlY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsWUFBWSxFQUFDLE1BQU0sRUFBQyxLQUFLLEVBQUMsdUJBQXVCLEVBQUUsaUJBQWlCLEVBQUUsZUFBZSxFQUE0QyxVQUFVLEVBQXFCLFNBQVMsRUFBYSxNQUFNLGVBQWUsQ0FBQztBQUN2TyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzVDLE9BQU8sRUFBZ0MsYUFBYSxFQUFFLFlBQVksRUFBNEIsTUFBTSxhQUFhLENBQUM7QUFDbEgsT0FBTyxFQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBaUIsTUFBTSxxQkFBcUIsQ0FBQztBQUN4RixPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNqRCxPQUFPLEVBQUMsNkJBQTZCLEVBQUUsVUFBVSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQ3RFLE9BQU8sRUFBTyxVQUFVLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDOUMsT0FBTyxFQUFDLFdBQVcsRUFBRSxXQUFXLEVBQUMsTUFBTSxlQUFlLENBQUM7Ozs7O0FBR3ZELE1BQU0sQ0FBQyxNQUFNLHlCQUF5QixHQUFRO0lBQzFDLE9BQU8sRUFBRSxpQkFBaUI7SUFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUM7SUFDekMsS0FBSyxFQUFFLElBQUk7Q0FDZCxDQUFDO0FBa0ZGLE1BQU0sT0FBTyxVQUFVO0lBK0huQixZQUFtQixNQUFxQixFQUFTLEVBQXFCLEVBQVMsRUFBYyxFQUFTLGNBQThCO1FBQWpI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c0JBQXJCLE1BQU07Z0JBRUcsY0FBYztzQkFBdkIsTUFBTTtnQkFFRyxNQUFNO3NCQUFmLE1BQU07Z0JBRUcsTUFBTTtzQkFBZixNQUFNO2dCQUVHLE9BQU87c0JBQWhCLE1BQU07Z0JBRUcsUUFBUTtzQkFBakIsTUFBTTtnQkFFRyxjQUFjO3NCQUF2QixNQUFNO2dCQUVHLFlBQVk7c0JBQXJCLE1BQU07O0FBK2ZYLE1BQU0sT0FBTyxnQkFBZ0I7OzZHQUFoQixnQkFBZ0I7OEdBQWhCLGdCQUFnQixpQkFwbEJoQixVQUFVLGFBZ2xCVCxZQUFZLEVBQUMsWUFBWSxFQUFDLFlBQVksRUFBQyxVQUFVLGFBaGxCbEQsVUFBVSxFQWlsQkUsWUFBWSxFQUFDLFVBQVU7OEdBR25DLGdCQUFnQixZQUpmLFlBQVksRUFBQyxZQUFZLEVBQUMsWUFBWSxFQUFDLFVBQVUsRUFDdEMsWUFBWSxFQUFDLFVBQVU7MkZBR25DLGdCQUFnQjtrQkFMNUIsUUFBUTttQkFBQztvQkFDTixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUMsWUFBWSxFQUFDLFlBQVksRUFBQyxVQUFVLENBQUM7b0JBQzVELE9BQU8sRUFBRSxDQUFDLFVBQVUsRUFBQyxZQUFZLEVBQUMsVUFBVSxDQUFDO29CQUM3QyxZQUFZLEVBQUUsQ0FBQyxVQUFVLENBQUM7aUJBQzdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtOZ01vZHVsZSxDb21wb25lbnQsRXZlbnRFbWl0dGVyLE91dHB1dCxJbnB1dCxDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgVmlld0VuY2Fwc3VsYXRpb24sIENvbnRlbnRDaGlsZHJlbiwgQWZ0ZXJDb250ZW50SW5pdCwgVGVtcGxhdGVSZWYsIFF1ZXJ5TGlzdCwgZm9yd2FyZFJlZiwgQ2hhbmdlRGV0ZWN0b3JSZWYsIFZpZXdDaGlsZCwgRWxlbWVudFJlZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7UmlwcGxlTW9kdWxlfSBmcm9tICdwcmltZW5nL3JpcHBsZSc7XG5pbXBvcnQge092ZXJsYXlTZXJ2aWNlLCBQcmltZU5HQ29uZmlnLCBQcmltZVRlbXBsYXRlLCBTaGFyZWRNb2R1bGUsIFRyYW5zbGF0aW9uS2V5cywgVHJlZU5vZGV9IGZyb20gJ3ByaW1lbmcvYXBpJztcbmltcG9ydCB7YW5pbWF0ZSwgc3R5bGUsIHRyYW5zaXRpb24sIHRyaWdnZXIsIEFuaW1hdGlvbkV2ZW50fSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7TkdfVkFMVUVfQUNDRVNTT1J9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7Q29ubmVjdGVkT3ZlcmxheVNjcm9sbEhhbmRsZXIsIERvbUhhbmRsZXJ9IGZyb20gJ3ByaW1lbmcvZG9tJztcbmltcG9ydCB7VHJlZSwgVHJlZU1vZHVsZX0gZnJvbSAncHJpbWVuZy90cmVlJztcbmltcG9ydCB7T2JqZWN0VXRpbHMsIFpJbmRleFV0aWxzfSBmcm9tICdwcmltZW5nL3V0aWxzJztcblxuXG5leHBvcnQgY29uc3QgVFJFRVNFTEVDVF9WQUxVRV9BQ0NFU1NPUjogYW55ID0ge1xuICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IFRyZWVTZWxlY3QpLFxuICAgIG11bHRpOiB0cnVlXG59O1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3AtdHJlZVNlbGVjdCcsXG4gICAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2ICNjb250YWluZXIgW25nQ2xhc3NdPVwiY29udGFpbmVyQ2xhc3MoKVwiIChjbGljayk9XCJvbkNsaWNrKCRldmVudClcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInAtaGlkZGVuLWFjY2Vzc2libGVcIj5cbiAgICAgICAgICAgIDxpbnB1dCAjZm9jdXNJbnB1dCB0eXBlPVwidGV4dFwiIHJvbGU9XCJsaXN0Ym94XCIgW2F0dHIuaWRdPVwiaW5wdXRJZFwiIHJlYWRvbmx5IFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiIChmb2N1cyk9XCJvbkZvY3VzKClcIiAoYmx1cik9XCJvbkJsdXIoKVwiIChrZXlkb3duKT1cIm9uS2V5RG93bigkZXZlbnQpXCIgW2F0dHIudGFiaW5kZXhdPVwidGFiaW5kZXhcIlxuICAgICAgICAgICAgYXJpYS1oYXNwb3B1cD1cInRydWVcIiBbYXR0ci5hcmlhLWV4cGFuZGVkXT1cIm92ZXJsYXlWaXNpYmxlXCIgW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XT1cImFyaWFMYWJlbGxlZEJ5XCIvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInAtdHJlZXNlbGVjdC1sYWJlbC1jb250YWluZXJcIj5cbiAgICAgICAgICAgIDxkaXYgW25nQ2xhc3NdPVwibGFiZWxDbGFzcygpXCI+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cInZhbHVlVGVtcGxhdGU7ZWxzZSBkZWZhdWx0VmFsdWVUZW1wbGF0ZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cInZhbHVlVGVtcGxhdGU7IGNvbnRleHQ6IHskaW1wbGljaXQ6IHZhbHVlLCBwbGFjZWhvbGRlcjogcGxhY2Vob2xkZXJ9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlICNkZWZhdWx0VmFsdWVUZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImRpc3BsYXkgPT09ICdjb21tYSc7ZWxzZSBjaGlwc1ZhbHVlVGVtcGxhdGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHt7bGFiZWwgfHwgJ2VtcHR5J319XG4gICAgICAgICAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgI2NoaXBzVmFsdWVUZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgKm5nRm9yPVwibGV0IG5vZGUgb2YgdmFsdWVcIiBjbGFzcz1cInAtdHJlZXNlbGVjdC10b2tlblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC10cmVlc2VsZWN0LXRva2VuLWxhYmVsXCI+e3tub2RlLmxhYmVsfX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJlbXB0eVZhbHVlXCI+e3twbGFjZWhvbGRlciB8fCAnZW1wdHknfX08L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8aSAqbmdJZj1cImNoZWNrVmFsdWUoKSAmJiAhZGlzYWJsZWQgJiYgc2hvd0NsZWFyXCIgY2xhc3M9XCJwLXRyZWVzZWxlY3QtY2xlYXItaWNvbiBwaSBwaS10aW1lc1wiIChjbGljayk9XCJjbGVhcigkZXZlbnQpXCI+PC9pPlxuXG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwicC10cmVlc2VsZWN0LXRyaWdnZXJcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC10cmVlc2VsZWN0LXRyaWdnZXItaWNvbiBwaSBwaS1jaGV2cm9uLWRvd25cIj48L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2ICNvdmVybGF5UmVmIGNsYXNzPVwicC10cmVlc2VsZWN0LXBhbmVsIHAtY29tcG9uZW50XCIgKm5nSWY9XCJvdmVybGF5VmlzaWJsZVwiIChjbGljayk9XCJvbk92ZXJsYXlDbGljaygkZXZlbnQpXCJcbiAgICAgICAgICAgIFtAb3ZlcmxheUFuaW1hdGlvbl09XCJ7dmFsdWU6ICd2aXNpYmxlJywgcGFyYW1zOiB7c2hvd1RyYW5zaXRpb25QYXJhbXM6IHNob3dUcmFuc2l0aW9uT3B0aW9ucywgaGlkZVRyYW5zaXRpb25QYXJhbXM6IGhpZGVUcmFuc2l0aW9uT3B0aW9uc319XCIgKEBvdmVybGF5QW5pbWF0aW9uLnN0YXJ0KT1cIm9uT3ZlcmxheUFuaW1hdGlvblN0YXJ0KCRldmVudClcIiAoQG92ZXJsYXlBbmltYXRpb24uZG9uZSk9XCJvbk92ZXJsYXlBbmltYXRpb25Eb25lKCRldmVudClcIj5cbiAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJoZWFkZXJUZW1wbGF0ZTsgY29udGV4dDogeyRpbXBsaWNpdDogdmFsdWUsIG9wdGlvbnM6IG9wdGlvbnN9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC10cmVlc2VsZWN0LWhlYWRlclwiICpuZ0lmPVwiZmlsdGVyXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtdHJlZXNlbGVjdC1maWx0ZXItY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgPGlucHV0ICNmaWx0ZXIgdHlwZT1cInRleHRcIiBhdXRvY29tcGxldGU9XCJvZmZcIiBjbGFzcz1cInAtdHJlZXNlbGVjdC1maWx0ZXIgcC1pbnB1dHRleHQgcC1jb21wb25lbnRcIiBbYXR0ci5wbGFjZWhvbGRlcl09XCJmaWx0ZXJQbGFjZWhvbGRlclwiIChrZXlkb3duLmVudGVyKT1cIiRldmVudC5wcmV2ZW50RGVmYXVsdCgpXCIgKGlucHV0KT1cIm9uRmlsdGVySW5wdXQoJGV2ZW50KVwiIFt2YWx1ZV09XCJmaWx0ZXJWYWx1ZVwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtdHJlZXNlbGVjdC1maWx0ZXItaWNvbiBwaSBwaS1zZWFyY2hcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInAtdHJlZXNlbGVjdC1jbG9zZSBwLWxpbmtcIiAoY2xpY2spPVwiaGlkZSgpXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC10cmVlc2VsZWN0LWZpbHRlci1pY29uIHBpIHBpLXRpbWVzXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC10cmVlc2VsZWN0LWl0ZW1zLXdyYXBwZXJcIiBbbmdTdHlsZV09XCJ7J21heC1oZWlnaHQnOiBzY3JvbGxIZWlnaHR9XCI+XG4gICAgICAgICAgICAgICAgPHAtdHJlZSAjdHJlZSBbdmFsdWVdPVwib3B0aW9uc1wiIFtwcm9wYWdhdGVTZWxlY3Rpb25Eb3duXT1cInByb3BhZ2F0ZVNlbGVjdGlvbkRvd25cIiBbcHJvcGFnYXRlU2VsZWN0aW9uVXBdPVwicHJvcGFnYXRlU2VsZWN0aW9uVXBcIiBbc2VsZWN0aW9uTW9kZV09XCJzZWxlY3Rpb25Nb2RlXCIgKHNlbGVjdGlvbkNoYW5nZSk9XCJvblNlbGVjdGlvbkNoYW5nZSgkZXZlbnQpXCIgW3NlbGVjdGlvbl09XCJ2YWx1ZVwiXG4gICAgICAgICAgICAgICAgICAgIFttZXRhS2V5U2VsZWN0aW9uXT1cIm1ldGFLZXlTZWxlY3Rpb25cIiAob25Ob2RlRXhwYW5kKT1cIm5vZGVFeHBhbmQoJGV2ZW50KVwiIChvbk5vZGVDb2xsYXBzZSk9XCJub2RlQ29sbGFwc2UoJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgICAgIChvbk5vZGVTZWxlY3QpPVwib25TZWxlY3QoJGV2ZW50KVwiIFtlbXB0eU1lc3NhZ2VdPVwiZW1wdHlNZXNzYWdlXCIgKG9uTm9kZVVuc2VsZWN0KT1cIm9uVW5zZWxlY3QoJGV2ZW50KVwiIFtmaWx0ZXJCeV09XCJmaWx0ZXJCeVwiIFtmaWx0ZXJNb2RlXT1cImZpbHRlck1vZGVcIiBbZmlsdGVyUGxhY2Vob2xkZXJdPVwiZmlsdGVyUGxhY2Vob2xkZXJcIiBbZmlsdGVyTG9jYWxlXT1cImZpbHRlckxvY2FsZVwiIFtmaWx0ZXJJbnB1dEF1dG9Gb2N1c109XCJmaWx0ZXJJbnB1dEF1dG9Gb2N1c1wiIFtmaWx0ZXJlZE5vZGVzXT1cImZpbHRlcmVkTm9kZXNcIiBbX3RlbXBsYXRlTWFwXT1cInRlbXBsYXRlTWFwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiZW1wdHlUZW1wbGF0ZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSBwVGVtcGxhdGU9XCJlbXB0eVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiZW1wdHlUZW1wbGF0ZTtcIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgPC9wLXRyZWU+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJmb290ZXJUZW1wbGF0ZTsgY29udGV4dDogeyRpbXBsaWNpdDogdmFsdWUsIG9wdGlvbnM6IG9wdGlvbnN9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIGAsXG4gICAgc3R5bGVVcmxzOiBbJy4vdHJlZXNlbGVjdC5jc3MnXSxcbiAgICBhbmltYXRpb25zOiBbXG4gICAgICAgIHRyaWdnZXIoJ292ZXJsYXlBbmltYXRpb24nLCBbXG4gICAgICAgICAgICB0cmFuc2l0aW9uKCc6ZW50ZXInLCBbXG4gICAgICAgICAgICAgICAgc3R5bGUoe29wYWNpdHk6IDAsIHRyYW5zZm9ybTogJ3NjYWxlWSgwLjgpJ30pLFxuICAgICAgICAgICAgICAgIGFuaW1hdGUoJ3t7c2hvd1RyYW5zaXRpb25QYXJhbXN9fScpXG4gICAgICAgICAgICAgIF0pLFxuICAgICAgICAgICAgICB0cmFuc2l0aW9uKCc6bGVhdmUnLCBbXG4gICAgICAgICAgICAgICAgYW5pbWF0ZSgne3toaWRlVHJhbnNpdGlvblBhcmFtc319Jywgc3R5bGUoeyBvcGFjaXR5OiAwIH0pKVxuICAgICAgICAgICAgICBdKVxuICAgICAgICBdKVxuICAgIF0sXG4gICAgaG9zdDoge1xuICAgICAgICAnY2xhc3MnOiAncC1lbGVtZW50IHAtaW5wdXR3cmFwcGVyJyxcbiAgICAgICAgJ1tjbGFzcy5wLWlucHV0d3JhcHBlci1maWxsZWRdJzogJyFlbXB0eVZhbHVlJyxcbiAgICAgICAgJ1tjbGFzcy5wLWlucHV0d3JhcHBlci1mb2N1c10nOiAnZm9jdXNlZCB8fCBvdmVybGF5VmlzaWJsZScsXG4gICAgICAgICdbY2xhc3MucC10cmVlc2VsZWN0LWNsZWFyYWJsZV0nOiAnc2hvd0NsZWFyICYmICFkaXNhYmxlZCdcbiAgICB9LFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICAgIHByb3ZpZGVyczogW1RSRUVTRUxFQ1RfVkFMVUVfQUNDRVNTT1JdLFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5leHBvcnQgY2xhc3MgVHJlZVNlbGVjdCBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQge1xuXG4gICAgQElucHV0KCkgdHlwZTogc3RyaW5nID0gXCJidXR0b25cIjtcblxuICAgIEBJbnB1dCgpIGlucHV0SWQ6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHNjcm9sbEhlaWdodDogc3RyaW5nID0gXCI0MDBweFwiO1xuXG4gICAgQElucHV0KCkgZGlzYWJsZWQ6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSBtZXRhS2V5U2VsZWN0aW9uOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIEBJbnB1dCgpIGRpc3BsYXk6IHN0cmluZyA9IFwiY29tbWFcIjtcblxuICAgIEBJbnB1dCgpIHNlbGVjdGlvbk1vZGU6IHN0cmluZyA9IFwic2luZ2xlXCI7XG5cbiAgICBASW5wdXQoKSB0YWJpbmRleDogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgYXJpYUxhYmVsbGVkQnk6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHBsYWNlaG9sZGVyOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBwYW5lbENsYXNzOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBlbXB0eU1lc3NhZ2U6IHN0cmluZyA9ICcnO1xuXG4gICAgQElucHV0KCkgYXBwZW5kVG86IGFueTtcblxuICAgIEBJbnB1dCgpIGZpbHRlcjogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgQElucHV0KCkgZmlsdGVyQnk6IHN0cmluZyA9ICdsYWJlbCc7XG5cbiAgICBASW5wdXQoKSBmaWx0ZXJNb2RlOiBzdHJpbmcgPSAnbGVuaWVudCc7XG5cbiAgICBASW5wdXQoKSBmaWx0ZXJQbGFjZWhvbGRlcjogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgZmlsdGVyTG9jYWxlOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBmaWx0ZXJJbnB1dEF1dG9Gb2N1czogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBASW5wdXQoKSBwcm9wYWdhdGVTZWxlY3Rpb25Eb3duOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIEBJbnB1dCgpIHByb3BhZ2F0ZVNlbGVjdGlvblVwOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIEBJbnB1dCgpIHNob3dDbGVhcjogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgQElucHV0KCkgcmVzZXRGaWx0ZXJPbkhpZGU6IGJvb2xlYW4gPSB0cnVlO1xuXG5cbiAgICBASW5wdXQoKSBnZXQgb3B0aW9ucygpOiBhbnlbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9vcHRpb25zO1xuICAgIH07XG4gICAgc2V0IG9wdGlvbnMob3B0aW9ucykge1xuICAgICAgICB0aGlzLl9vcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgdGhpcy51cGRhdGVUcmVlU3RhdGUoKTtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBzaG93VHJhbnNpdGlvbk9wdGlvbnM6IHN0cmluZyA9ICcuMTJzIGN1YmljLWJlemllcigwLCAwLCAwLjIsIDEpJztcblxuICAgIEBJbnB1dCgpIGhpZGVUcmFuc2l0aW9uT3B0aW9uczogc3RyaW5nID0gJy4xcyBsaW5lYXInO1xuXG4gICAgQENvbnRlbnRDaGlsZHJlbihQcmltZVRlbXBsYXRlKSB0ZW1wbGF0ZXM6IFF1ZXJ5TGlzdDxhbnk+O1xuXG4gICAgQFZpZXdDaGlsZCgnY29udGFpbmVyJykgY29udGFpbmVyRWw6IEVsZW1lbnRSZWY7XG5cbiAgICBAVmlld0NoaWxkKCdmb2N1c0lucHV0JykgZm9jdXNJbnB1dDogRWxlbWVudFJlZjtcblxuICAgIEBWaWV3Q2hpbGQoJ2ZpbHRlcicpIGZpbHRlclZpZXdDaGlsZDogRWxlbWVudFJlZjtcblxuICAgIEBWaWV3Q2hpbGQoJ3RyZWUnKSB0cmVlVmlld0NoaWxkOiBUcmVlO1xuXG4gICAgQE91dHB1dCgpIG9uTm9kZUV4cGFuZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25Ob2RlQ29sbGFwc2U6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uU2hvdzogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25IaWRlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvbkNsZWFyOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvbkZpbHRlcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25Ob2RlVW5zZWxlY3Q6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uTm9kZVNlbGVjdDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBwdWJsaWMgZmlsdGVyZWROb2RlczogVHJlZU5vZGVbXTtcblxuICAgIGZpbHRlclZhbHVlOiBzdHJpbmcgPSBudWxsO1xuXG4gICAgc2VyaWFsaXplZFZhbHVlOiBhbnlbXTtcblxuICAgIHZhbHVlVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBoZWFkZXJUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIGVtcHR5VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBmb290ZXJUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIGZvY3VzZWQ6IGJvb2xlYW47XG5cbiAgICBvdmVybGF5VmlzaWJsZTogYm9vbGVhbjtcblxuICAgIHNlbGZDaGFuZ2U6IGJvb2xlYW47XG5cbiAgICB2YWx1ZTtcblxuICAgIGV4cGFuZGVkTm9kZXM6IGFueVtdID0gW107XG5cbiAgICBfb3B0aW9uczogYW55W107XG5cbiAgICBvdXRzaWRlQ2xpY2tMaXN0ZW5lcjogYW55O1xuXG4gICAgcHVibGljIHRlbXBsYXRlTWFwOiBhbnk7XG5cbiAgICBzY3JvbGxIYW5kbGVyOiBhbnk7XG5cbiAgICByZXNpemVMaXN0ZW5lcjogYW55O1xuXG4gICAgb3ZlcmxheUVsOiBhbnk7XG5cbiAgICBvbk1vZGVsQ2hhbmdlOiBGdW5jdGlvbiA9ICgpID0+IHt9O1xuXG4gICAgb25Nb2RlbFRvdWNoZWQ6IEZ1bmN0aW9uID0gKCkgPT4ge307XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgY29uZmlnOiBQcmltZU5HQ29uZmlnLCBwdWJsaWMgY2Q6IENoYW5nZURldGVjdG9yUmVmLCBwdWJsaWMgZWw6IEVsZW1lbnRSZWYsIHB1YmxpYyBvdmVybGF5U2VydmljZTogT3ZlcmxheVNlcnZpY2UpIHsgfVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMudXBkYXRlVHJlZVN0YXRlKCk7XG4gICAgfVxuXG4gICAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgICAgICBpZiAodGhpcy50ZW1wbGF0ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLnRlbXBsYXRlTWFwID0ge307XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRlbXBsYXRlcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2goaXRlbS5nZXRUeXBlKCkpIHtcbiAgICAgICAgICAgICAgICBjYXNlICd2YWx1ZSc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmFsdWVUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdoZWFkZXInOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhlYWRlclRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2VtcHR5JzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbXB0eVRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2Zvb3Rlcic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZm9vdGVyVGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgaWYoaXRlbS5uYW1lKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZU1hcFtpdGVtLm5hbWVdID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52YWx1ZVRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTsgLy9UT0RPOiBAZGVwcmVjYXRlZCBVc2VkIFwidmFsdWVcIiB0ZW1wbGF0ZSBpbnN0ZWFkXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvbk92ZXJsYXlBbmltYXRpb25TdGFydChldmVudDogQW5pbWF0aW9uRXZlbnQpIHtcbiAgICAgICAgc3dpdGNoIChldmVudC50b1N0YXRlKSB7XG4gICAgICAgICAgICBjYXNlICd2aXNpYmxlJzpcbiAgICAgICAgICAgICAgICB0aGlzLm92ZXJsYXlFbCA9IGV2ZW50LmVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5vbk92ZXJsYXlFbnRlcigpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbk92ZXJsYXlBbmltYXRpb25Eb25lKGV2ZW50OiBBbmltYXRpb25FdmVudCkge1xuICAgICAgICBzd2l0Y2ggKGV2ZW50LnRvU3RhdGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3ZvaWQnOlxuICAgICAgICAgICAgICAgIHRoaXMub25PdmVybGF5TGVhdmUoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25TZWxlY3Rpb25DaGFuZ2UoZXZlbnQpIHtcbiAgICAgICAgdGhpcy52YWx1ZSA9IGV2ZW50O1xuICAgICAgICB0aGlzLm9uTW9kZWxDaGFuZ2UodGhpcy52YWx1ZSk7XG4gICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuXG4gICAgb25DbGljayhldmVudCkge1xuICAgICAgICBpZiAoIXRoaXMuZGlzYWJsZWQgJiYgKCF0aGlzLm92ZXJsYXlFbCB8fCAhdGhpcy5vdmVybGF5RWwuY29udGFpbnMoZXZlbnQudGFyZ2V0KSkgJiYgIURvbUhhbmRsZXIuaGFzQ2xhc3MoZXZlbnQudGFyZ2V0LCAncC10cmVlc2VsZWN0LWNsb3NlJykpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm92ZXJsYXlWaXNpYmxlKXtcbiAgICAgICAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB0aGlzLnNob3coKTtcblxuICAgICAgICAgICAgdGhpcy5mb2N1c0lucHV0Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uS2V5RG93bihldmVudCkge1xuICAgICAgICBzd2l0Y2goZXZlbnQud2hpY2gpIHtcbiAgICAgICAgICAgIC8vZG93blxuICAgICAgICAgICAgY2FzZSA0MDpcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMub3ZlcmxheVZpc2libGUgJiYgZXZlbnQuYWx0S2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLm92ZXJsYXlWaXNpYmxlICYmIHRoaXMub3ZlcmxheUVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBmb2N1c2FibGVFbGVtZW50cyA9IERvbUhhbmRsZXIuZ2V0Rm9jdXNhYmxlRWxlbWVudHModGhpcy5vdmVybGF5RWwpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChmb2N1c2FibGVFbGVtZW50cyAmJiBmb2N1c2FibGVFbGVtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb2N1c2FibGVFbGVtZW50c1swXS5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgLy9zcGFjZVxuICAgICAgICAgICAgY2FzZSAzMjpcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMub3ZlcmxheVZpc2libGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIC8vZW50ZXIgYW5kIGVzY2FwZVxuICAgICAgICAgICAgY2FzZSAxMzpcbiAgICAgICAgICAgIGNhc2UgMjc6XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3ZlcmxheVZpc2libGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIC8vdGFiXG4gICAgICAgICAgICBjYXNlIDk6XG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25GaWx0ZXJJbnB1dChldmVudCkge1xuICAgICAgICB0aGlzLmZpbHRlclZhbHVlID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgICAgICB0aGlzLnRyZWVWaWV3Q2hpbGQuX2ZpbHRlcih0aGlzLmZpbHRlclZhbHVlKTtcbiAgICAgICAgdGhpcy5vbkZpbHRlci5lbWl0KHtcbiAgICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2ZW50LFxuICAgICAgICAgICAgZmlsdGVyZWRWYWx1ZTogdGhpcy50cmVlVmlld0NoaWxkLmZpbHRlcmVkTm9kZXNcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc2hvdygpIHtcbiAgICAgICAgdGhpcy5vdmVybGF5VmlzaWJsZSA9IHRydWU7XG4gICAgfVxuXG4gICAgaGlkZSgpIHtcbiAgICAgICAgdGhpcy5vdmVybGF5VmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLnJlc2V0RmlsdGVyKCk7XG4gICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuXG4gICAgY2xlYXIoZXZlbnQpIHtcbiAgICAgICAgdGhpcy52YWx1ZSA9IG51bGw7XG4gICAgICAgIHRoaXMucmVzZXRFeHBhbmRlZE5vZGVzKCk7XG4gICAgICAgIHRoaXMub25Nb2RlbENoYW5nZSh0aGlzLnZhbHVlKTtcbiAgICAgICAgdGhpcy5vbkNsZWFyLmVtaXQoKTtcblxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgIH1cblxuICAgIGNoZWNrVmFsdWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlICE9PSBudWxsICYmIE9iamVjdFV0aWxzLmlzTm90RW1wdHkodGhpcy52YWx1ZSlcbiAgICB9XG5cbiAgICByZXNldEZpbHRlcigpIHtcbiAgICAgICAgaWYgKHRoaXMuZmlsdGVyICYmICF0aGlzLnJlc2V0RmlsdGVyT25IaWRlKSB7XG4gICAgICAgICAgICB0aGlzLmZpbHRlcmVkTm9kZXMgPSB0aGlzLnRyZWVWaWV3Q2hpbGQuZmlsdGVyZWROb2RlcztcbiAgICAgICAgICAgIHRoaXMudHJlZVZpZXdDaGlsZC5yZXNldEZpbHRlcigpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5maWx0ZXJWYWx1ZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbk92ZXJsYXlDbGljayhldmVudCkge1xuICAgICAgICB0aGlzLm92ZXJsYXlTZXJ2aWNlLmFkZCh7XG4gICAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBldmVudCxcbiAgICAgICAgICAgIHRhcmdldDogdGhpcy5lbC5uYXRpdmVFbGVtZW50XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHVwZGF0ZVRyZWVTdGF0ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMudmFsdWUpIHtcbiAgICAgICAgICAgIGxldCBzZWxlY3RlZE5vZGVzID0gdGhpcy5zZWxlY3Rpb25Nb2RlID09PSBcInNpbmdsZVwiID8gW3RoaXMudmFsdWVdIDogWy4uLnRoaXMudmFsdWVdO1xuICAgICAgICAgICAgdGhpcy5yZXNldEV4cGFuZGVkTm9kZXMoKTtcbiAgICAgICAgICAgIGlmIChzZWxlY3RlZE5vZGVzICYmIHRoaXMub3B0aW9ucykge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlVHJlZUJyYW5jaFN0YXRlKG51bGwsIG51bGwsIHNlbGVjdGVkTm9kZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlVHJlZUJyYW5jaFN0YXRlKG5vZGUsIHBhdGgsIHNlbGVjdGVkTm9kZXMpIHtcbiAgICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzU2VsZWN0ZWQobm9kZSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmV4cGFuZFBhdGgocGF0aCk7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWROb2Rlcy5zcGxpY2Uoc2VsZWN0ZWROb2Rlcy5pbmRleE9mKG5vZGUpLCAxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHNlbGVjdGVkTm9kZXMubGVuZ3RoID4gMCAmJiBub2RlLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgY2hpbGROb2RlIG9mIG5vZGUuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgcGF0aC5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVRyZWVCcmFuY2hTdGF0ZShjaGlsZE5vZGUsIHBhdGgsIHNlbGVjdGVkTm9kZXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGZvciAobGV0IGNoaWxkTm9kZSBvZiB0aGlzLm9wdGlvbnMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVRyZWVCcmFuY2hTdGF0ZShjaGlsZE5vZGUsIFtdLCBzZWxlY3RlZE5vZGVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGV4cGFuZFBhdGgoZXhwYW5kZWROb2Rlcykge1xuICAgICAgICBmb3IgKGxldCBub2RlIG9mIGV4cGFuZGVkTm9kZXMpIHtcbiAgICAgICAgICAgIG5vZGUuZXhwYW5kZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5leHBhbmRlZE5vZGVzID0gWy4uLmV4cGFuZGVkTm9kZXNdO1xuICAgIH1cblxuICAgIG5vZGVFeHBhbmQoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5vbk5vZGVFeHBhbmQuZW1pdChldmVudCk7XG4gICAgICAgIHRoaXMuZXhwYW5kZWROb2Rlcy5wdXNoKGV2ZW50Lm5vZGUpO1xuICAgIH1cblxuICAgIG5vZGVDb2xsYXBzZShldmVudCkge1xuICAgICAgICB0aGlzLm9uTm9kZUNvbGxhcHNlLmVtaXQoZXZlbnQpO1xuICAgICAgICB0aGlzLmV4cGFuZGVkTm9kZXMuc3BsaWNlKHRoaXMuZXhwYW5kZWROb2Rlcy5pbmRleE9mKGV2ZW50Lm5vZGUpLCAxKTtcbiAgICB9XG5cbiAgICByZXNldEV4cGFuZGVkTm9kZXMoKSB7XG4gICAgICAgIGZvciAobGV0IG5vZGUgb2YgdGhpcy5leHBhbmRlZE5vZGVzKSB7XG4gICAgICAgICAgICBub2RlLmV4cGFuZGVkID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmV4cGFuZGVkTm9kZXMgPSBbXTtcbiAgICB9XG5cbiAgICBmaW5kU2VsZWN0ZWROb2Rlcyhub2RlLCBrZXlzLCBzZWxlY3RlZE5vZGVzKSB7XG4gICAgICAgIGlmIChub2RlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc1NlbGVjdGVkKG5vZGUpKSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWROb2Rlcy5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBrZXlzW25vZGUua2V5XTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKGtleXMpLmxlbmd0aCAmJiBub2RlLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgY2hpbGROb2RlIG9mIG5vZGUuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maW5kU2VsZWN0ZWROb2RlcyhjaGlsZE5vZGUsIGtleXMsIHNlbGVjdGVkTm9kZXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGZvciAobGV0IGNoaWxkTm9kZSBvZiB0aGlzLm9wdGlvbnMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZpbmRTZWxlY3RlZE5vZGVzKGNoaWxkTm9kZSwga2V5cywgc2VsZWN0ZWROb2Rlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpc1NlbGVjdGVkKG5vZGU6IFRyZWVOb2RlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZpbmRJbmRleEluU2VsZWN0aW9uKG5vZGUpICE9IC0xO1xuICAgIH1cblxuICAgIGZpbmRJbmRleEluU2VsZWN0aW9uKG5vZGU6IFRyZWVOb2RlKSB7XG4gICAgICAgIGxldCBpbmRleDogbnVtYmVyID0gLTE7XG5cbiAgICAgICAgaWYgKHRoaXMudmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGlvbk1vZGUgPT09IFwic2luZ2xlXCIpIHtcbiAgICAgICAgICAgICAgICBsZXQgYXJlTm9kZXNFcXVhbCA9ICh0aGlzLnZhbHVlLmtleSAmJiB0aGlzLnZhbHVlLmtleSA9PT0gbm9kZS5rZXkpIHx8IHRoaXMudmFsdWUgPT0gbm9kZTtcbiAgICAgICAgICAgICAgICBpbmRleCA9IGFyZU5vZGVzRXF1YWwgPyAwIDogLSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yKGxldCBpID0gMDsgaSAgPCB0aGlzLnZhbHVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZE5vZGUgPSB0aGlzLnZhbHVlW2ldO1xuICAgICAgICAgICAgICAgICAgICBsZXQgYXJlTm9kZXNFcXVhbCA9IChzZWxlY3RlZE5vZGUua2V5ICYmIHNlbGVjdGVkTm9kZS5rZXkgPT09IG5vZGUua2V5KSB8fCBzZWxlY3RlZE5vZGUgPT0gbm9kZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFyZU5vZGVzRXF1YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgIH1cblxuICAgIG9uU2VsZWN0KG5vZGUpIHtcbiAgICAgICAgdGhpcy5vbk5vZGVTZWxlY3QuZW1pdChub2RlKTtcblxuICAgICAgICBpZiAodGhpcy5zZWxlY3Rpb25Nb2RlID09PSAnc2luZ2xlJykge1xuICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvblVuc2VsZWN0KG5vZGUpIHtcbiAgICAgICAgdGhpcy5vbk5vZGVVbnNlbGVjdC5lbWl0KG5vZGUpO1xuICAgIH1cblxuICAgIG9uT3ZlcmxheUVudGVyKCkge1xuICAgICAgICBaSW5kZXhVdGlscy5zZXQoJ292ZXJsYXknLCB0aGlzLm92ZXJsYXlFbCwgdGhpcy5jb25maWcuekluZGV4Lm92ZXJsYXkpO1xuXG4gICAgICAgIGlmKHRoaXMuZmlsdGVyICYmIHRoaXMuZmlsdGVySW5wdXRBdXRvRm9jdXMpIHtcbiAgICAgICAgICAgIHRoaXMuZmlsdGVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYXBwZW5kQ29udGFpbmVyKCk7XG4gICAgICAgIHRoaXMuYWxpZ25PdmVybGF5KCk7XG4gICAgICAgIHRoaXMuYmluZE91dHNpZGVDbGlja0xpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMuYmluZFNjcm9sbExpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMuYmluZFJlc2l6ZUxpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMub25TaG93LmVtaXQoKTtcbiAgICB9XG5cbiAgICBvbk92ZXJsYXlMZWF2ZSgpIHtcbiAgICAgICAgdGhpcy51bmJpbmRPdXRzaWRlQ2xpY2tMaXN0ZW5lcigpO1xuICAgICAgICB0aGlzLnVuYmluZFNjcm9sbExpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMudW5iaW5kUmVzaXplTGlzdGVuZXIoKTtcbiAgICAgICAgWkluZGV4VXRpbHMuY2xlYXIodGhpcy5vdmVybGF5RWwpO1xuICAgICAgICB0aGlzLm92ZXJsYXlFbCA9IG51bGw7XG4gICAgICAgIHRoaXMub25IaWRlLmVtaXQoKTtcbiAgICB9XG5cbiAgICBvbkZvY3VzKCkge1xuICAgICAgICB0aGlzLmZvY3VzZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIG9uQmx1cigpIHtcbiAgICAgICAgdGhpcy5mb2N1c2VkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KSA6IHZvaWQge1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMudXBkYXRlVHJlZVN0YXRlKCk7XG4gICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJPbkNoYW5nZShmbjogRnVuY3Rpb24pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vbk1vZGVsQ2hhbmdlID0gZm47XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IEZ1bmN0aW9uKTogdm9pZCB7XG4gICAgICAgIHRoaXMub25Nb2RlbFRvdWNoZWQgPSBmbjtcbiAgICB9XG5cbiAgICBzZXREaXNhYmxlZFN0YXRlKHZhbDogYm9vbGVhbik6IHZvaWQge1xuICAgICAgICB0aGlzLmRpc2FibGVkID0gdmFsO1xuICAgICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cblxuICAgIGFwcGVuZENvbnRhaW5lcigpIHtcbiAgICAgICAgaWYgKHRoaXMuYXBwZW5kVG8pIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmFwcGVuZFRvID09PSAnYm9keScpXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLm92ZXJsYXlFbCk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5hcHBlbmRUbykuYXBwZW5kQ2hpbGQodGhpcy5vdmVybGF5RWwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVzdG9yZUFwcGVuZCgpIHtcbiAgICAgICAgaWYgKHRoaXMub3ZlcmxheUVsICYmIHRoaXMuYXBwZW5kVG8pIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmFwcGVuZFRvID09PSAnYm9keScpXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCh0aGlzLm92ZXJsYXlFbCk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5hcHBlbmRUbykucmVtb3ZlQ2hpbGQodGhpcy5vdmVybGF5RWwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWxpZ25PdmVybGF5KCkge1xuICAgICAgICBpZiAodGhpcy5hcHBlbmRUbykge1xuICAgICAgICAgICAgRG9tSGFuZGxlci5hYnNvbHV0ZVBvc2l0aW9uKHRoaXMub3ZlcmxheUVsLCB0aGlzLmNvbnRhaW5lckVsLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICAgICAgdGhpcy5vdmVybGF5RWwuc3R5bGUubWluV2lkdGggPSBEb21IYW5kbGVyLmdldE91dGVyV2lkdGgodGhpcy5jb250YWluZXJFbC5uYXRpdmVFbGVtZW50KSArICdweCc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBEb21IYW5kbGVyLnJlbGF0aXZlUG9zaXRpb24odGhpcy5vdmVybGF5RWwsIHRoaXMuY29udGFpbmVyRWwubmF0aXZlRWxlbWVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBiaW5kT3V0c2lkZUNsaWNrTGlzdGVuZXIoKSB7XG4gICAgICAgIGlmICghdGhpcy5vdXRzaWRlQ2xpY2tMaXN0ZW5lcikge1xuICAgICAgICAgICAgdGhpcy5vdXRzaWRlQ2xpY2tMaXN0ZW5lciA9IChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm92ZXJsYXlWaXNpYmxlICYmIHRoaXMub3ZlcmxheUVsICYmICF0aGlzLmNvbnRhaW5lckVsLm5hdGl2ZUVsZW1lbnQuY29udGFpbnMoZXZlbnQudGFyZ2V0KSAmJiAhdGhpcy5vdmVybGF5RWwuY29udGFpbnMoZXZlbnQudGFyZ2V0KSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm91dHNpZGVDbGlja0xpc3RlbmVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVuYmluZE91dHNpZGVDbGlja0xpc3RlbmVyKCkge1xuICAgICAgICBpZiAodGhpcy5vdXRzaWRlQ2xpY2tMaXN0ZW5lcikge1xuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm91dHNpZGVDbGlja0xpc3RlbmVyKTtcbiAgICAgICAgICAgIHRoaXMub3V0c2lkZUNsaWNrTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYmluZFNjcm9sbExpc3RlbmVyKCkge1xuICAgICAgICBpZiAoIXRoaXMuc2Nyb2xsSGFuZGxlcikge1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxIYW5kbGVyID0gbmV3IENvbm5lY3RlZE92ZXJsYXlTY3JvbGxIYW5kbGVyKHRoaXMuY29udGFpbmVyRWwubmF0aXZlRWxlbWVudCwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm92ZXJsYXlWaXNpYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zY3JvbGxIYW5kbGVyLmJpbmRTY3JvbGxMaXN0ZW5lcigpO1xuICAgIH1cblxuICAgIHVuYmluZFNjcm9sbExpc3RlbmVyKCkge1xuICAgICAgICBpZiAodGhpcy5zY3JvbGxIYW5kbGVyKSB7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbEhhbmRsZXIudW5iaW5kU2Nyb2xsTGlzdGVuZXIoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGJpbmRSZXNpemVMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKCF0aGlzLnJlc2l6ZUxpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLnJlc2l6ZUxpc3RlbmVyID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm92ZXJsYXlWaXNpYmxlICYmICFEb21IYW5kbGVyLmlzVG91Y2hEZXZpY2UoKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMucmVzaXplTGlzdGVuZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdW5iaW5kUmVzaXplTGlzdGVuZXIoKSB7XG4gICAgICAgIGlmICh0aGlzLnJlc2l6ZUxpc3RlbmVyKSB7XG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5yZXNpemVMaXN0ZW5lcik7XG4gICAgICAgICAgICB0aGlzLnJlc2l6ZUxpc3RlbmVyID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICB0aGlzLnJlc3RvcmVBcHBlbmQoKTtcbiAgICAgICAgdGhpcy51bmJpbmRPdXRzaWRlQ2xpY2tMaXN0ZW5lcigpO1xuICAgICAgICB0aGlzLnVuYmluZFJlc2l6ZUxpc3RlbmVyKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuc2Nyb2xsSGFuZGxlcikge1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxIYW5kbGVyLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsSGFuZGxlciA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5vdmVybGF5RWwpIHtcbiAgICAgICAgICAgIFpJbmRleFV0aWxzLmNsZWFyKHRoaXMub3ZlcmxheUVsKTtcbiAgICAgICAgICAgIHRoaXMub3ZlcmxheUVsID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnRhaW5lckNsYXNzKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJ3AtdHJlZXNlbGVjdCBwLWNvbXBvbmVudCBwLWlucHV0d3JhcHBlcic6IHRydWUsXG4gICAgICAgICAgICAncC10cmVlc2VsZWN0LWNoaXAnOiB0aGlzLmRpc3BsYXkgPT09ICdjaGlwJyxcbiAgICAgICAgICAgICdwLWRpc2FibGVkJzogdGhpcy5kaXNhYmxlZCxcbiAgICAgICAgICAgICdwLWZvY3VzJzogdGhpcy5mb2N1c2VkXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsYWJlbENsYXNzKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJ3AtdHJlZXNlbGVjdC1sYWJlbCc6IHRydWUsXG4gICAgICAgICAgICAncC1wbGFjZWhvbGRlcic6IHRoaXMubGFiZWwgPT09IHRoaXMucGxhY2Vob2xkZXIsXG4gICAgICAgICAgICAncC10cmVlc2VsZWN0LWxhYmVsLWVtcHR5JzogIXRoaXMucGxhY2Vob2xkZXIgJiYgdGhpcy5lbXB0eVZhbHVlXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgZW1wdHlWYWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLnZhbHVlIHx8IE9iamVjdC5rZXlzKHRoaXMudmFsdWUpLmxlbmd0aCA9PT0gMDtcbiAgICB9XG5cbiAgICBnZXQgZW1wdHlPcHRpb25zKCkge1xuICAgICAgICByZXR1cm4gIXRoaXMub3B0aW9ucyB8fCB0aGlzLm9wdGlvbnMubGVuZ3RoID09PSAwO1xuICAgIH1cblxuICAgIGdldCBsYWJlbCgpIHtcbiAgICAgICAgbGV0IHZhbHVlID0gdGhpcy52YWx1ZXx8W107XG4gICAgICAgIHJldHVybiB2YWx1ZS5sZW5ndGggPyB2YWx1ZS5tYXAobm9kZSA9PiBub2RlLmxhYmVsKS5qb2luKCcsICcpIDogKHRoaXMuc2VsZWN0aW9uTW9kZSA9PT0gXCJzaW5nbGVcIiAmJiB0aGlzLnZhbHVlKSA/IHZhbHVlLmxhYmVsIDogdGhpcy5wbGFjZWhvbGRlcjtcbiAgICB9XG59XG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSxSaXBwbGVNb2R1bGUsU2hhcmVkTW9kdWxlLFRyZWVNb2R1bGVdLFxuICAgIGV4cG9ydHM6IFtUcmVlU2VsZWN0LFNoYXJlZE1vZHVsZSxUcmVlTW9kdWxlXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtUcmVlU2VsZWN0XVxufSlcbmV4cG9ydCBjbGFzcyBUcmVlU2VsZWN0TW9kdWxlIHsgfVxuIl19