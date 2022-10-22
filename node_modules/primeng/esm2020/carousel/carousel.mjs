import { Component, Input, ViewChild, ContentChildren, NgModule, EventEmitter, Output, ContentChild, ChangeDetectionStrategy, ViewEncapsulation, Inject } from '@angular/core';
import { PrimeTemplate, SharedModule, Header, Footer } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { CommonModule, DOCUMENT } from '@angular/common';
import { UniqueComponentId } from 'primeng/utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "primeng/ripple";
export class Carousel {
    constructor(el, zone, cd, renderer, document) {
        this.el = el;
        this.zone = zone;
        this.cd = cd;
        this.renderer = renderer;
        this.document = document;
        this.orientation = "horizontal";
        this.verticalViewPortHeight = "300px";
        this.contentClass = "";
        this.indicatorsContentClass = "";
        this.indicatorStyleClass = "";
        this.circular = false;
        this.showIndicators = true;
        this.showNavigators = true;
        this.autoplayInterval = 0;
        this.onPage = new EventEmitter();
        this._numVisible = 1;
        this._numScroll = 1;
        this._oldNumScroll = 0;
        this.prevState = {
            numScroll: 0,
            numVisible: 0,
            value: []
        };
        this.defaultNumScroll = 1;
        this.defaultNumVisible = 1;
        this._page = 0;
        this.isRemainingItemsAdded = false;
        this.remainingItems = 0;
        this.swipeThreshold = 20;
        this.totalShiftedItems = this.page * this.numScroll * -1;
    }
    get page() {
        return this._page;
    }
    set page(val) {
        if (this.isCreated && val !== this._page) {
            if (this.autoplayInterval) {
                this.stopAutoplay();
                this.allowAutoplay = false;
            }
            if (val > this._page && val <= (this.totalDots() - 1)) {
                this.step(-1, val);
            }
            else if (val < this._page) {
                this.step(1, val);
            }
        }
        this._page = val;
    }
    get numVisible() {
        return this._numVisible;
    }
    set numVisible(val) {
        this._numVisible = val;
    }
    get numScroll() {
        return this._numVisible;
    }
    set numScroll(val) {
        this._numScroll = val;
    }
    get value() {
        return this._value;
    }
    ;
    set value(val) {
        this._value = val;
    }
    ngOnChanges(simpleChange) {
        if (simpleChange.value) {
            if (this.circular && this._value) {
                this.setCloneItems();
            }
        }
        if (this.isCreated) {
            if (simpleChange.numVisible) {
                if (this.responsiveOptions) {
                    this.defaultNumVisible = this.numVisible;
                }
                if (this.isCircular()) {
                    this.setCloneItems();
                }
                this.createStyle();
                this.calculatePosition();
            }
            if (simpleChange.numScroll) {
                if (this.responsiveOptions) {
                    this.defaultNumScroll = this.numScroll;
                }
            }
        }
    }
    ngAfterContentInit() {
        this.id = UniqueComponentId();
        this.allowAutoplay = !!this.autoplayInterval;
        if (this.circular) {
            this.setCloneItems();
        }
        if (this.responsiveOptions) {
            this.defaultNumScroll = this._numScroll;
            this.defaultNumVisible = this._numVisible;
        }
        this.createStyle();
        this.calculatePosition();
        if (this.responsiveOptions) {
            this.bindDocumentListeners();
        }
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'item':
                    this.itemTemplate = item.template;
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
    ngAfterContentChecked() {
        const isCircular = this.isCircular();
        let totalShiftedItems = this.totalShiftedItems;
        if (this.value && this.itemsContainer && (this.prevState.numScroll !== this._numScroll || this.prevState.numVisible !== this._numVisible || this.prevState.value.length !== this.value.length)) {
            if (this.autoplayInterval) {
                this.stopAutoplay();
            }
            this.remainingItems = (this.value.length - this._numVisible) % this._numScroll;
            let page = this._page;
            if (this.totalDots() !== 0 && page >= this.totalDots()) {
                page = this.totalDots() - 1;
                this._page = page;
                this.onPage.emit({
                    page: this.page
                });
            }
            totalShiftedItems = (page * this._numScroll) * -1;
            if (isCircular) {
                totalShiftedItems -= this._numVisible;
            }
            if (page === (this.totalDots() - 1) && this.remainingItems > 0) {
                totalShiftedItems += (-1 * this.remainingItems) + this._numScroll;
                this.isRemainingItemsAdded = true;
            }
            else {
                this.isRemainingItemsAdded = false;
            }
            if (totalShiftedItems !== this.totalShiftedItems) {
                this.totalShiftedItems = totalShiftedItems;
            }
            this._oldNumScroll = this._numScroll;
            this.prevState.numScroll = this._numScroll;
            this.prevState.numVisible = this._numVisible;
            this.prevState.value = [...this._value];
            if (this.totalDots() > 0 && this.itemsContainer.nativeElement) {
                this.itemsContainer.nativeElement.style.transform = this.isVertical() ? `translate3d(0, ${totalShiftedItems * (100 / this._numVisible)}%, 0)` : `translate3d(${totalShiftedItems * (100 / this._numVisible)}%, 0, 0)`;
            }
            this.isCreated = true;
            if (this.autoplayInterval && this.isAutoplay()) {
                this.startAutoplay();
            }
        }
        if (isCircular) {
            if (this.page === 0) {
                totalShiftedItems = -1 * this._numVisible;
            }
            else if (totalShiftedItems === 0) {
                totalShiftedItems = -1 * this.value.length;
                if (this.remainingItems > 0) {
                    this.isRemainingItemsAdded = true;
                }
            }
            if (totalShiftedItems !== this.totalShiftedItems) {
                this.totalShiftedItems = totalShiftedItems;
            }
        }
    }
    createStyle() {
        if (!this.carouselStyle) {
            this.carouselStyle = this.renderer.createElement('style');
            this.carouselStyle.type = 'text/css';
            this.renderer.appendChild(this.document.head, this.carouselStyle);
        }
        let innerHTML = `
            #${this.id} .p-carousel-item {
				flex: 1 0 ${(100 / this.numVisible)}%
			}
        `;
        if (this.responsiveOptions) {
            this.responsiveOptions.sort((data1, data2) => {
                const value1 = data1.breakpoint;
                const value2 = data2.breakpoint;
                let result = null;
                if (value1 == null && value2 != null)
                    result = -1;
                else if (value1 != null && value2 == null)
                    result = 1;
                else if (value1 == null && value2 == null)
                    result = 0;
                else if (typeof value1 === 'string' && typeof value2 === 'string')
                    result = value1.localeCompare(value2, undefined, { numeric: true });
                else
                    result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
                return -1 * result;
            });
            for (let i = 0; i < this.responsiveOptions.length; i++) {
                let res = this.responsiveOptions[i];
                innerHTML += `
                    @media screen and (max-width: ${res.breakpoint}) {
                        #${this.id} .p-carousel-item {
                            flex: 1 0 ${(100 / res.numVisible)}%
                        }
                    }
                `;
            }
        }
        this.carouselStyle.innerHTML = innerHTML;
    }
    calculatePosition() {
        if (this.responsiveOptions) {
            let matchedResponsiveData = {
                numVisible: this.defaultNumVisible,
                numScroll: this.defaultNumScroll
            };
            if (typeof window !== "undefined") {
                let windowWidth = window.innerWidth;
                for (let i = 0; i < this.responsiveOptions.length; i++) {
                    let res = this.responsiveOptions[i];
                    if (parseInt(res.breakpoint, 10) >= windowWidth) {
                        matchedResponsiveData = res;
                    }
                }
            }
            if (this._numScroll !== matchedResponsiveData.numScroll) {
                let page = this._page;
                page = Math.floor((page * this._numScroll) / matchedResponsiveData.numScroll);
                let totalShiftedItems = (matchedResponsiveData.numScroll * this.page) * -1;
                if (this.isCircular()) {
                    totalShiftedItems -= matchedResponsiveData.numVisible;
                }
                this.totalShiftedItems = totalShiftedItems;
                this._numScroll = matchedResponsiveData.numScroll;
                this._page = page;
                this.onPage.emit({
                    page: this.page
                });
            }
            if (this._numVisible !== matchedResponsiveData.numVisible) {
                this._numVisible = matchedResponsiveData.numVisible;
                this.setCloneItems();
            }
            this.cd.markForCheck();
        }
    }
    setCloneItems() {
        this.clonedItemsForStarting = [];
        this.clonedItemsForFinishing = [];
        if (this.isCircular()) {
            this.clonedItemsForStarting.push(...this.value.slice(-1 * this._numVisible));
            this.clonedItemsForFinishing.push(...this.value.slice(0, this._numVisible));
        }
    }
    firstIndex() {
        return this.isCircular() ? (-1 * (this.totalShiftedItems + this.numVisible)) : (this.totalShiftedItems * -1);
    }
    lastIndex() {
        return this.firstIndex() + this.numVisible - 1;
    }
    totalDots() {
        return this.value ? Math.ceil((this.value.length - this._numVisible) / this._numScroll) + 1 : 0;
    }
    totalDotsArray() {
        const totalDots = this.totalDots();
        return totalDots <= 0 ? [] : Array(totalDots).fill(0);
    }
    isVertical() {
        return this.orientation === 'vertical';
    }
    isCircular() {
        return this.circular && this.value && this.value.length >= this.numVisible;
    }
    isAutoplay() {
        return this.autoplayInterval && this.allowAutoplay;
    }
    isForwardNavDisabled() {
        return this.isEmpty() || (this._page >= (this.totalDots() - 1) && !this.isCircular());
    }
    isBackwardNavDisabled() {
        return this.isEmpty() || (this._page <= 0 && !this.isCircular());
    }
    isEmpty() {
        return !this.value || this.value.length === 0;
    }
    navForward(e, index) {
        if (this.isCircular() || this._page < (this.totalDots() - 1)) {
            this.step(-1, index);
        }
        if (this.autoplayInterval) {
            this.stopAutoplay();
            this.allowAutoplay = false;
        }
        if (e && e.cancelable) {
            e.preventDefault();
        }
    }
    navBackward(e, index) {
        if (this.isCircular() || this._page !== 0) {
            this.step(1, index);
        }
        if (this.autoplayInterval) {
            this.stopAutoplay();
            this.allowAutoplay = false;
        }
        if (e && e.cancelable) {
            e.preventDefault();
        }
    }
    onDotClick(e, index) {
        let page = this._page;
        if (this.autoplayInterval) {
            this.stopAutoplay();
            this.allowAutoplay = false;
        }
        if (index > page) {
            this.navForward(e, index);
        }
        else if (index < page) {
            this.navBackward(e, index);
        }
    }
    step(dir, page) {
        let totalShiftedItems = this.totalShiftedItems;
        const isCircular = this.isCircular();
        if (page != null) {
            totalShiftedItems = (this._numScroll * page) * -1;
            if (isCircular) {
                totalShiftedItems -= this._numVisible;
            }
            this.isRemainingItemsAdded = false;
        }
        else {
            totalShiftedItems += (this._numScroll * dir);
            if (this.isRemainingItemsAdded) {
                totalShiftedItems += this.remainingItems - (this._numScroll * dir);
                this.isRemainingItemsAdded = false;
            }
            let originalShiftedItems = isCircular ? (totalShiftedItems + this._numVisible) : totalShiftedItems;
            page = Math.abs(Math.floor((originalShiftedItems / this._numScroll)));
        }
        if (isCircular && this.page === (this.totalDots() - 1) && dir === -1) {
            totalShiftedItems = -1 * (this.value.length + this._numVisible);
            page = 0;
        }
        else if (isCircular && this.page === 0 && dir === 1) {
            totalShiftedItems = 0;
            page = (this.totalDots() - 1);
        }
        else if (page === (this.totalDots() - 1) && this.remainingItems > 0) {
            totalShiftedItems += ((this.remainingItems * -1) - (this._numScroll * dir));
            this.isRemainingItemsAdded = true;
        }
        if (this.itemsContainer) {
            this.itemsContainer.nativeElement.style.transform = this.isVertical() ? `translate3d(0, ${totalShiftedItems * (100 / this._numVisible)}%, 0)` : `translate3d(${totalShiftedItems * (100 / this._numVisible)}%, 0, 0)`;
            this.itemsContainer.nativeElement.style.transition = 'transform 500ms ease 0s';
        }
        this.totalShiftedItems = totalShiftedItems;
        this._page = page;
        this.onPage.emit({
            page: this.page
        });
    }
    startAutoplay() {
        this.interval = setInterval(() => {
            if (this.totalDots() > 0) {
                if (this.page === (this.totalDots() - 1)) {
                    this.step(-1, 0);
                }
                else {
                    this.step(-1, this.page + 1);
                }
            }
        }, this.autoplayInterval);
    }
    stopAutoplay() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
    onTransitionEnd() {
        if (this.itemsContainer) {
            this.itemsContainer.nativeElement.style.transition = '';
            if ((this.page === 0 || this.page === (this.totalDots() - 1)) && this.isCircular()) {
                this.itemsContainer.nativeElement.style.transform = this.isVertical() ? `translate3d(0, ${this.totalShiftedItems * (100 / this._numVisible)}%, 0)` : `translate3d(${this.totalShiftedItems * (100 / this._numVisible)}%, 0, 0)`;
            }
        }
    }
    onTouchStart(e) {
        let touchobj = e.changedTouches[0];
        this.startPos = {
            x: touchobj.pageX,
            y: touchobj.pageY
        };
    }
    onTouchMove(e) {
        if (e.cancelable) {
            e.preventDefault();
        }
    }
    onTouchEnd(e) {
        let touchobj = e.changedTouches[0];
        if (this.isVertical()) {
            this.changePageOnTouch(e, (touchobj.pageY - this.startPos.y));
        }
        else {
            this.changePageOnTouch(e, (touchobj.pageX - this.startPos.x));
        }
    }
    changePageOnTouch(e, diff) {
        if (Math.abs(diff) > this.swipeThreshold) {
            if (diff < 0) {
                this.navForward(e);
            }
            else {
                this.navBackward(e);
            }
        }
    }
    bindDocumentListeners() {
        if (!this.documentResizeListener && typeof window !== 'undefined') {
            this.documentResizeListener = (e) => {
                this.calculatePosition();
            };
            window.addEventListener('resize', this.documentResizeListener);
        }
    }
    unbindDocumentListeners() {
        if (this.documentResizeListener && typeof window !== 'undefined') {
            window.removeEventListener('resize', this.documentResizeListener);
            this.documentResizeListener = null;
        }
    }
    ngOnDestroy() {
        if (this.responsiveOptions) {
            this.unbindDocumentListeners();
        }
        if (this.autoplayInterval) {
            this.stopAutoplay();
        }
    }
}
Carousel.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Carousel, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: i0.ChangeDetectorRef }, { token: i0.Renderer2 }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Component });
Carousel.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.7", type: Carousel, selector: "p-carousel", inputs: { page: "page", numVisible: "numVisible", numScroll: "numScroll", responsiveOptions: "responsiveOptions", orientation: "orientation", verticalViewPortHeight: "verticalViewPortHeight", contentClass: "contentClass", indicatorsContentClass: "indicatorsContentClass", indicatorsContentStyle: "indicatorsContentStyle", indicatorStyleClass: "indicatorStyleClass", indicatorStyle: "indicatorStyle", value: "value", circular: "circular", showIndicators: "showIndicators", showNavigators: "showNavigators", autoplayInterval: "autoplayInterval", style: "style", styleClass: "styleClass" }, outputs: { onPage: "onPage" }, host: { classAttribute: "p-element" }, queries: [{ propertyName: "headerFacet", first: true, predicate: Header, descendants: true }, { propertyName: "footerFacet", first: true, predicate: Footer, descendants: true }, { propertyName: "templates", predicate: PrimeTemplate }], viewQueries: [{ propertyName: "itemsContainer", first: true, predicate: ["itemsContainer"], descendants: true }], usesOnChanges: true, ngImport: i0, template: `
		<div [attr.id]="id" [ngClass]="{'p-carousel p-component':true, 'p-carousel-vertical': isVertical(), 'p-carousel-horizontal': !isVertical()}" [ngStyle]="style" [class]="styleClass">
			<div class="p-carousel-header" *ngIf="headerFacet || headerTemplate">
                <ng-content select="p-header"></ng-content>
                <ng-container *ngTemplateOutlet="headerTemplate"></ng-container>
			</div>
			<div [class]="contentClass" [ngClass]="'p-carousel-content'">
				<div class="p-carousel-container">
					<button type="button" *ngIf="showNavigators" [ngClass]="{'p-carousel-prev p-link':true, 'p-disabled': isBackwardNavDisabled()}" [disabled]="isBackwardNavDisabled()" (click)="navBackward($event)" pRipple>
						<span [ngClass]="{'p-carousel-prev-icon pi': true, 'pi-chevron-left': !isVertical(), 'pi-chevron-up': isVertical()}"></span>
					</button>
					<div class="p-carousel-items-content" [ngStyle]="{'height': isVertical() ? verticalViewPortHeight : 'auto'}">
						<div #itemsContainer class="p-carousel-items-container" (transitionend)="onTransitionEnd()" (touchend)="onTouchEnd($event)" (touchstart)="onTouchStart($event)" (touchmove)="onTouchMove($event)">
                            <div *ngFor="let item of clonedItemsForStarting; let index = index" [ngClass]= "{'p-carousel-item p-carousel-item-cloned': true,
                                'p-carousel-item-active': (totalShiftedItems * -1) === (value.length),
							    'p-carousel-item-start': 0 === index,
							    'p-carousel-item-end': (clonedItemsForStarting.length - 1) === index}">
								<ng-container *ngTemplateOutlet="itemTemplate; context: {$implicit: item}"></ng-container>
							</div>
                            <div *ngFor="let item of value; let index = index" [ngClass]= "{'p-carousel-item': true,
                                'p-carousel-item-active': (firstIndex() <= index && lastIndex() >= index),
							    'p-carousel-item-start': firstIndex() === index,
							    'p-carousel-item-end': lastIndex() === index}">
								<ng-container *ngTemplateOutlet="itemTemplate; context: {$implicit: item}"></ng-container>
							</div>
                            <div *ngFor="let item of clonedItemsForFinishing; let index = index" [ngClass]= "{'p-carousel-item p-carousel-item-cloned': true,
                                'p-carousel-item-active': ((totalShiftedItems *-1) === numVisible),
							    'p-carousel-item-start': 0 === index,
							    'p-carousel-item-end': (clonedItemsForFinishing.length - 1) === index}">
								<ng-container *ngTemplateOutlet="itemTemplate; context: {$implicit: item}"></ng-container>
							</div>
						</div>
					</div>
					<button type="button" *ngIf="showNavigators" [ngClass]="{'p-carousel-next p-link': true, 'p-disabled': isForwardNavDisabled()}" [disabled]="isForwardNavDisabled()" (click)="navForward($event)" pRipple>
						<span [ngClass]="{'p-carousel-prev-icon pi': true, 'pi-chevron-right': !isVertical(), 'pi-chevron-down': isVertical()}"></span>
					</button>
				</div>
				<ul [ngClass]="'p-carousel-indicators p-reset'" [class]="indicatorsContentClass" [ngStyle]="indicatorsContentStyle" *ngIf="showIndicators">
					<li *ngFor="let totalDot of totalDotsArray(); let i = index" [ngClass]="{'p-carousel-indicator':true,'p-highlight': _page === i}">
						<button type="button" [ngClass]="'p-link'" (click)="onDotClick($event, i)" [class]="indicatorStyleClass" [ngStyle]="indicatorStyle"></button>
					</li>
				</ul>
			</div>
			<div class="p-carousel-footer" *ngIf="footerFacet || footerTemplate">
                <ng-content select="p-footer"></ng-content>
                <ng-container *ngTemplateOutlet="footerTemplate"></ng-container>
			</div>
		</div>
    `, isInline: true, styles: [".p-carousel{display:flex;flex-direction:column}.p-carousel-content{display:flex;flex-direction:column;overflow:auto}.p-carousel-prev,.p-carousel-next{align-self:center;flex-grow:0;flex-shrink:0;display:flex;justify-content:center;align-items:center;overflow:hidden;position:relative}.p-carousel-container{display:flex;flex-direction:row}.p-carousel-items-content{overflow:hidden;width:100%}.p-carousel-items-container{display:flex;flex-direction:row}.p-carousel-indicators{display:flex;flex-direction:row;justify-content:center;flex-wrap:wrap}.p-carousel-indicator>button{display:flex;align-items:center;justify-content:center}.p-carousel-vertical .p-carousel-container{flex-direction:column}.p-carousel-vertical .p-carousel-items-container{flex-direction:column;height:100%}.p-items-hidden .p-carousel-item{visibility:hidden}.p-items-hidden .p-carousel-item.p-carousel-item-active{visibility:visible}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i2.Ripple, selector: "[pRipple]" }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Carousel, decorators: [{
            type: Component,
            args: [{ selector: 'p-carousel', template: `
		<div [attr.id]="id" [ngClass]="{'p-carousel p-component':true, 'p-carousel-vertical': isVertical(), 'p-carousel-horizontal': !isVertical()}" [ngStyle]="style" [class]="styleClass">
			<div class="p-carousel-header" *ngIf="headerFacet || headerTemplate">
                <ng-content select="p-header"></ng-content>
                <ng-container *ngTemplateOutlet="headerTemplate"></ng-container>
			</div>
			<div [class]="contentClass" [ngClass]="'p-carousel-content'">
				<div class="p-carousel-container">
					<button type="button" *ngIf="showNavigators" [ngClass]="{'p-carousel-prev p-link':true, 'p-disabled': isBackwardNavDisabled()}" [disabled]="isBackwardNavDisabled()" (click)="navBackward($event)" pRipple>
						<span [ngClass]="{'p-carousel-prev-icon pi': true, 'pi-chevron-left': !isVertical(), 'pi-chevron-up': isVertical()}"></span>
					</button>
					<div class="p-carousel-items-content" [ngStyle]="{'height': isVertical() ? verticalViewPortHeight : 'auto'}">
						<div #itemsContainer class="p-carousel-items-container" (transitionend)="onTransitionEnd()" (touchend)="onTouchEnd($event)" (touchstart)="onTouchStart($event)" (touchmove)="onTouchMove($event)">
                            <div *ngFor="let item of clonedItemsForStarting; let index = index" [ngClass]= "{'p-carousel-item p-carousel-item-cloned': true,
                                'p-carousel-item-active': (totalShiftedItems * -1) === (value.length),
							    'p-carousel-item-start': 0 === index,
							    'p-carousel-item-end': (clonedItemsForStarting.length - 1) === index}">
								<ng-container *ngTemplateOutlet="itemTemplate; context: {$implicit: item}"></ng-container>
							</div>
                            <div *ngFor="let item of value; let index = index" [ngClass]= "{'p-carousel-item': true,
                                'p-carousel-item-active': (firstIndex() <= index && lastIndex() >= index),
							    'p-carousel-item-start': firstIndex() === index,
							    'p-carousel-item-end': lastIndex() === index}">
								<ng-container *ngTemplateOutlet="itemTemplate; context: {$implicit: item}"></ng-container>
							</div>
                            <div *ngFor="let item of clonedItemsForFinishing; let index = index" [ngClass]= "{'p-carousel-item p-carousel-item-cloned': true,
                                'p-carousel-item-active': ((totalShiftedItems *-1) === numVisible),
							    'p-carousel-item-start': 0 === index,
							    'p-carousel-item-end': (clonedItemsForFinishing.length - 1) === index}">
								<ng-container *ngTemplateOutlet="itemTemplate; context: {$implicit: item}"></ng-container>
							</div>
						</div>
					</div>
					<button type="button" *ngIf="showNavigators" [ngClass]="{'p-carousel-next p-link': true, 'p-disabled': isForwardNavDisabled()}" [disabled]="isForwardNavDisabled()" (click)="navForward($event)" pRipple>
						<span [ngClass]="{'p-carousel-prev-icon pi': true, 'pi-chevron-right': !isVertical(), 'pi-chevron-down': isVertical()}"></span>
					</button>
				</div>
				<ul [ngClass]="'p-carousel-indicators p-reset'" [class]="indicatorsContentClass" [ngStyle]="indicatorsContentStyle" *ngIf="showIndicators">
					<li *ngFor="let totalDot of totalDotsArray(); let i = index" [ngClass]="{'p-carousel-indicator':true,'p-highlight': _page === i}">
						<button type="button" [ngClass]="'p-link'" (click)="onDotClick($event, i)" [class]="indicatorStyleClass" [ngStyle]="indicatorStyle"></button>
					</li>
				</ul>
			</div>
			<div class="p-carousel-footer" *ngIf="footerFacet || footerTemplate">
                <ng-content select="p-footer"></ng-content>
                <ng-container *ngTemplateOutlet="footerTemplate"></ng-container>
			</div>
		</div>
    `, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        'class': 'p-element'
                    }, styles: [".p-carousel{display:flex;flex-direction:column}.p-carousel-content{display:flex;flex-direction:column;overflow:auto}.p-carousel-prev,.p-carousel-next{align-self:center;flex-grow:0;flex-shrink:0;display:flex;justify-content:center;align-items:center;overflow:hidden;position:relative}.p-carousel-container{display:flex;flex-direction:row}.p-carousel-items-content{overflow:hidden;width:100%}.p-carousel-items-container{display:flex;flex-direction:row}.p-carousel-indicators{display:flex;flex-direction:row;justify-content:center;flex-wrap:wrap}.p-carousel-indicator>button{display:flex;align-items:center;justify-content:center}.p-carousel-vertical .p-carousel-container{flex-direction:column}.p-carousel-vertical .p-carousel-items-container{flex-direction:column;height:100%}.p-items-hidden .p-carousel-item{visibility:hidden}.p-items-hidden .p-carousel-item.p-carousel-item-active{visibility:visible}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: i0.ChangeDetectorRef }, { type: i0.Renderer2 }, { type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; }, propDecorators: { page: [{
                type: Input
            }], numVisible: [{
                type: Input
            }], numScroll: [{
                type: Input
            }], responsiveOptions: [{
                type: Input
            }], orientation: [{
                type: Input
            }], verticalViewPortHeight: [{
                type: Input
            }], contentClass: [{
                type: Input
            }], indicatorsContentClass: [{
                type: Input
            }], indicatorsContentStyle: [{
                type: Input
            }], indicatorStyleClass: [{
                type: Input
            }], indicatorStyle: [{
                type: Input
            }], value: [{
                type: Input
            }], circular: [{
                type: Input
            }], showIndicators: [{
                type: Input
            }], showNavigators: [{
                type: Input
            }], autoplayInterval: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], onPage: [{
                type: Output
            }], itemsContainer: [{
                type: ViewChild,
                args: ['itemsContainer']
            }], headerFacet: [{
                type: ContentChild,
                args: [Header]
            }], footerFacet: [{
                type: ContentChild,
                args: [Footer]
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }] } });
export class CarouselModule {
}
CarouselModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: CarouselModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
CarouselModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.7", ngImport: i0, type: CarouselModule, declarations: [Carousel], imports: [CommonModule, SharedModule, RippleModule], exports: [CommonModule, Carousel, SharedModule] });
CarouselModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: CarouselModule, imports: [CommonModule, SharedModule, RippleModule, CommonModule, SharedModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: CarouselModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, SharedModule, RippleModule],
                    exports: [CommonModule, Carousel, SharedModule],
                    declarations: [Carousel]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2Fyb3VzZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvY2Fyb3VzZWwvY2Fyb3VzZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQWMsU0FBUyxFQUFpQyxlQUFlLEVBQWEsUUFBUSxFQUFVLFlBQVksRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLHVCQUF1QixFQUFFLGlCQUFpQixFQUErQyxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDMVIsT0FBTyxFQUFFLGFBQWEsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUMxRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDOUMsT0FBTyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN6RCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7QUE0RGxELE1BQU0sT0FBTyxRQUFRO0lBNElwQixZQUFtQixFQUFjLEVBQVMsSUFBWSxFQUFTLEVBQXFCLEVBQVUsUUFBbUIsRUFBNEIsUUFBa0I7UUFBNUksT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUFTLFNBQUksR0FBSixJQUFJLENBQVE7UUFBUyxPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQUFVLGFBQVEsR0FBUixRQUFRLENBQVc7UUFBNEIsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQXJHdEosZ0JBQVcsR0FBRyxZQUFZLENBQUM7UUFFM0IsMkJBQXNCLEdBQUcsT0FBTyxDQUFDO1FBRWpDLGlCQUFZLEdBQVcsRUFBRSxDQUFDO1FBRTFCLDJCQUFzQixHQUFXLEVBQUUsQ0FBQztRQUlwQyx3QkFBbUIsR0FBVyxFQUFFLENBQUM7UUFXakMsYUFBUSxHQUFZLEtBQUssQ0FBQztRQUUxQixtQkFBYyxHQUFZLElBQUksQ0FBQztR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MkdBQWQsY0FBYzs0R0FBZCxjQUFjLGlCQWpuQmQsUUFBUSxhQTZtQlYsWUFBWSxFQUFFLFlBQVksRUFBRSxZQUFZLGFBQ3hDLFlBQVksRUE5bUJWLFFBQVEsRUE4bUJjLFlBQVk7NEdBR2xDLGNBQWMsWUFKaEIsWUFBWSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQ3hDLFlBQVksRUFBWSxZQUFZOzJGQUdsQyxjQUFjO2tCQUwxQixRQUFRO21CQUFDO29CQUNULE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxZQUFZLEVBQUUsWUFBWSxDQUFDO29CQUNuRCxPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsUUFBUSxFQUFFLFlBQVksQ0FBQztvQkFDL0MsWUFBWSxFQUFFLENBQUMsUUFBUSxDQUFDO2lCQUN4QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIEVsZW1lbnRSZWYsIFZpZXdDaGlsZCwgQWZ0ZXJDb250ZW50SW5pdCwgVGVtcGxhdGVSZWYsIENvbnRlbnRDaGlsZHJlbiwgUXVlcnlMaXN0LCBOZ01vZHVsZSwgTmdab25lLCBFdmVudEVtaXR0ZXIsIE91dHB1dCwgQ29udGVudENoaWxkLCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgVmlld0VuY2Fwc3VsYXRpb24sIENoYW5nZURldGVjdG9yUmVmLCBTaW1wbGVDaGFuZ2VzLCBSZW5kZXJlcjIsIEluamVjdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUHJpbWVUZW1wbGF0ZSwgU2hhcmVkTW9kdWxlLCBIZWFkZXIsIEZvb3RlciB9IGZyb20gJ3ByaW1lbmcvYXBpJztcbmltcG9ydCB7IFJpcHBsZU1vZHVsZSB9IGZyb20gJ3ByaW1lbmcvcmlwcGxlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSwgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgVW5pcXVlQ29tcG9uZW50SWQgfSBmcm9tICdwcmltZW5nL3V0aWxzJztcblxuQENvbXBvbmVudCh7XG5cdHNlbGVjdG9yOiAncC1jYXJvdXNlbCcsXG5cdHRlbXBsYXRlOiBgXG5cdFx0PGRpdiBbYXR0ci5pZF09XCJpZFwiIFtuZ0NsYXNzXT1cInsncC1jYXJvdXNlbCBwLWNvbXBvbmVudCc6dHJ1ZSwgJ3AtY2Fyb3VzZWwtdmVydGljYWwnOiBpc1ZlcnRpY2FsKCksICdwLWNhcm91c2VsLWhvcml6b250YWwnOiAhaXNWZXJ0aWNhbCgpfVwiIFtuZ1N0eWxlXT1cInN0eWxlXCIgW2NsYXNzXT1cInN0eWxlQ2xhc3NcIj5cblx0XHRcdDxkaXYgY2xhc3M9XCJwLWNhcm91c2VsLWhlYWRlclwiICpuZ0lmPVwiaGVhZGVyRmFjZXQgfHwgaGVhZGVyVGVtcGxhdGVcIj5cbiAgICAgICAgICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJwLWhlYWRlclwiPjwvbmctY29udGVudD5cbiAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiaGVhZGVyVGVtcGxhdGVcIj48L25nLWNvbnRhaW5lcj5cblx0XHRcdDwvZGl2PlxuXHRcdFx0PGRpdiBbY2xhc3NdPVwiY29udGVudENsYXNzXCIgW25nQ2xhc3NdPVwiJ3AtY2Fyb3VzZWwtY29udGVudCdcIj5cblx0XHRcdFx0PGRpdiBjbGFzcz1cInAtY2Fyb3VzZWwtY29udGFpbmVyXCI+XG5cdFx0XHRcdFx0PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgKm5nSWY9XCJzaG93TmF2aWdhdG9yc1wiIFtuZ0NsYXNzXT1cInsncC1jYXJvdXNlbC1wcmV2IHAtbGluayc6dHJ1ZSwgJ3AtZGlzYWJsZWQnOiBpc0JhY2t3YXJkTmF2RGlzYWJsZWQoKX1cIiBbZGlzYWJsZWRdPVwiaXNCYWNrd2FyZE5hdkRpc2FibGVkKClcIiAoY2xpY2spPVwibmF2QmFja3dhcmQoJGV2ZW50KVwiIHBSaXBwbGU+XG5cdFx0XHRcdFx0XHQ8c3BhbiBbbmdDbGFzc109XCJ7J3AtY2Fyb3VzZWwtcHJldi1pY29uIHBpJzogdHJ1ZSwgJ3BpLWNoZXZyb24tbGVmdCc6ICFpc1ZlcnRpY2FsKCksICdwaS1jaGV2cm9uLXVwJzogaXNWZXJ0aWNhbCgpfVwiPjwvc3Bhbj5cblx0XHRcdFx0XHQ8L2J1dHRvbj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwicC1jYXJvdXNlbC1pdGVtcy1jb250ZW50XCIgW25nU3R5bGVdPVwieydoZWlnaHQnOiBpc1ZlcnRpY2FsKCkgPyB2ZXJ0aWNhbFZpZXdQb3J0SGVpZ2h0IDogJ2F1dG8nfVwiPlxuXHRcdFx0XHRcdFx0PGRpdiAjaXRlbXNDb250YWluZXIgY2xhc3M9XCJwLWNhcm91c2VsLWl0ZW1zLWNvbnRhaW5lclwiICh0cmFuc2l0aW9uZW5kKT1cIm9uVHJhbnNpdGlvbkVuZCgpXCIgKHRvdWNoZW5kKT1cIm9uVG91Y2hFbmQoJGV2ZW50KVwiICh0b3VjaHN0YXJ0KT1cIm9uVG91Y2hTdGFydCgkZXZlbnQpXCIgKHRvdWNobW92ZSk9XCJvblRvdWNoTW92ZSgkZXZlbnQpXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiAqbmdGb3I9XCJsZXQgaXRlbSBvZiBjbG9uZWRJdGVtc0ZvclN0YXJ0aW5nOyBsZXQgaW5kZXggPSBpbmRleFwiIFtuZ0NsYXNzXT0gXCJ7J3AtY2Fyb3VzZWwtaXRlbSBwLWNhcm91c2VsLWl0ZW0tY2xvbmVkJzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3AtY2Fyb3VzZWwtaXRlbS1hY3RpdmUnOiAodG90YWxTaGlmdGVkSXRlbXMgKiAtMSkgPT09ICh2YWx1ZS5sZW5ndGgpLFxuXHRcdFx0XHRcdFx0XHQgICAgJ3AtY2Fyb3VzZWwtaXRlbS1zdGFydCc6IDAgPT09IGluZGV4LFxuXHRcdFx0XHRcdFx0XHQgICAgJ3AtY2Fyb3VzZWwtaXRlbS1lbmQnOiAoY2xvbmVkSXRlbXNGb3JTdGFydGluZy5sZW5ndGggLSAxKSA9PT0gaW5kZXh9XCI+XG5cdFx0XHRcdFx0XHRcdFx0PG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cIml0ZW1UZW1wbGF0ZTsgY29udGV4dDogeyRpbXBsaWNpdDogaXRlbX1cIj48L25nLWNvbnRhaW5lcj5cblx0XHRcdFx0XHRcdFx0PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiAqbmdGb3I9XCJsZXQgaXRlbSBvZiB2YWx1ZTsgbGV0IGluZGV4ID0gaW5kZXhcIiBbbmdDbGFzc109IFwieydwLWNhcm91c2VsLWl0ZW0nOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAncC1jYXJvdXNlbC1pdGVtLWFjdGl2ZSc6IChmaXJzdEluZGV4KCkgPD0gaW5kZXggJiYgbGFzdEluZGV4KCkgPj0gaW5kZXgpLFxuXHRcdFx0XHRcdFx0XHQgICAgJ3AtY2Fyb3VzZWwtaXRlbS1zdGFydCc6IGZpcnN0SW5kZXgoKSA9PT0gaW5kZXgsXG5cdFx0XHRcdFx0XHRcdCAgICAncC1jYXJvdXNlbC1pdGVtLWVuZCc6IGxhc3RJbmRleCgpID09PSBpbmRleH1cIj5cblx0XHRcdFx0XHRcdFx0XHQ8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiaXRlbVRlbXBsYXRlOyBjb250ZXh0OiB7JGltcGxpY2l0OiBpdGVtfVwiPjwvbmctY29udGFpbmVyPlxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2ICpuZ0Zvcj1cImxldCBpdGVtIG9mIGNsb25lZEl0ZW1zRm9yRmluaXNoaW5nOyBsZXQgaW5kZXggPSBpbmRleFwiIFtuZ0NsYXNzXT0gXCJ7J3AtY2Fyb3VzZWwtaXRlbSBwLWNhcm91c2VsLWl0ZW0tY2xvbmVkJzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3AtY2Fyb3VzZWwtaXRlbS1hY3RpdmUnOiAoKHRvdGFsU2hpZnRlZEl0ZW1zICotMSkgPT09IG51bVZpc2libGUpLFxuXHRcdFx0XHRcdFx0XHQgICAgJ3AtY2Fyb3VzZWwtaXRlbS1zdGFydCc6IDAgPT09IGluZGV4LFxuXHRcdFx0XHRcdFx0XHQgICAgJ3AtY2Fyb3VzZWwtaXRlbS1lbmQnOiAoY2xvbmVkSXRlbXNGb3JGaW5pc2hpbmcubGVuZ3RoIC0gMSkgPT09IGluZGV4fVwiPlxuXHRcdFx0XHRcdFx0XHRcdDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJpdGVtVGVtcGxhdGU7IGNvbnRleHQ6IHskaW1wbGljaXQ6IGl0ZW19XCI+PC9uZy1jb250YWluZXI+XG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgKm5nSWY9XCJzaG93TmF2aWdhdG9yc1wiIFtuZ0NsYXNzXT1cInsncC1jYXJvdXNlbC1uZXh0IHAtbGluayc6IHRydWUsICdwLWRpc2FibGVkJzogaXNGb3J3YXJkTmF2RGlzYWJsZWQoKX1cIiBbZGlzYWJsZWRdPVwiaXNGb3J3YXJkTmF2RGlzYWJsZWQoKVwiIChjbGljayk9XCJuYXZGb3J3YXJkKCRldmVudClcIiBwUmlwcGxlPlxuXHRcdFx0XHRcdFx0PHNwYW4gW25nQ2xhc3NdPVwieydwLWNhcm91c2VsLXByZXYtaWNvbiBwaSc6IHRydWUsICdwaS1jaGV2cm9uLXJpZ2h0JzogIWlzVmVydGljYWwoKSwgJ3BpLWNoZXZyb24tZG93bic6IGlzVmVydGljYWwoKX1cIj48L3NwYW4+XG5cdFx0XHRcdFx0PC9idXR0b24+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8dWwgW25nQ2xhc3NdPVwiJ3AtY2Fyb3VzZWwtaW5kaWNhdG9ycyBwLXJlc2V0J1wiIFtjbGFzc109XCJpbmRpY2F0b3JzQ29udGVudENsYXNzXCIgW25nU3R5bGVdPVwiaW5kaWNhdG9yc0NvbnRlbnRTdHlsZVwiICpuZ0lmPVwic2hvd0luZGljYXRvcnNcIj5cblx0XHRcdFx0XHQ8bGkgKm5nRm9yPVwibGV0IHRvdGFsRG90IG9mIHRvdGFsRG90c0FycmF5KCk7IGxldCBpID0gaW5kZXhcIiBbbmdDbGFzc109XCJ7J3AtY2Fyb3VzZWwtaW5kaWNhdG9yJzp0cnVlLCdwLWhpZ2hsaWdodCc6IF9wYWdlID09PSBpfVwiPlxuXHRcdFx0XHRcdFx0PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgW25nQ2xhc3NdPVwiJ3AtbGluaydcIiAoY2xpY2spPVwib25Eb3RDbGljaygkZXZlbnQsIGkpXCIgW2NsYXNzXT1cImluZGljYXRvclN0eWxlQ2xhc3NcIiBbbmdTdHlsZV09XCJpbmRpY2F0b3JTdHlsZVwiPjwvYnV0dG9uPlxuXHRcdFx0XHRcdDwvbGk+XG5cdFx0XHRcdDwvdWw+XG5cdFx0XHQ8L2Rpdj5cblx0XHRcdDxkaXYgY2xhc3M9XCJwLWNhcm91c2VsLWZvb3RlclwiICpuZ0lmPVwiZm9vdGVyRmFjZXQgfHwgZm9vdGVyVGVtcGxhdGVcIj5cbiAgICAgICAgICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJwLWZvb3RlclwiPjwvbmctY29udGVudD5cbiAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiZm9vdGVyVGVtcGxhdGVcIj48L25nLWNvbnRhaW5lcj5cblx0XHRcdDwvZGl2PlxuXHRcdDwvZGl2PlxuICAgIGAsXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgICBzdHlsZVVybHM6IFsnLi9jYXJvdXNlbC5jc3MnXSxcbiAgICBob3N0OiB7XG4gICAgICAgICdjbGFzcyc6ICdwLWVsZW1lbnQnXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBDYXJvdXNlbCBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQge1xuXG5cdEBJbnB1dCgpIGdldCBwYWdlKCk6bnVtYmVyIHtcblx0XHRyZXR1cm4gdGhpcy5fcGFnZTtcblx0fVxuXHRzZXQgcGFnZSh2YWw6bnVtYmVyKSB7XG5cdFx0aWYgKHRoaXMuaXNDcmVhdGVkICYmIHZhbCAhPT0gdGhpcy5fcGFnZSkge1xuXHRcdFx0aWYgKHRoaXMuYXV0b3BsYXlJbnRlcnZhbCkge1xuXHRcdFx0XHR0aGlzLnN0b3BBdXRvcGxheSgpO1xuXHRcdFx0XHR0aGlzLmFsbG93QXV0b3BsYXkgPSBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHZhbCA+IHRoaXMuX3BhZ2UgJiYgdmFsIDw9ICh0aGlzLnRvdGFsRG90cygpIC0gMSkpIHtcblx0XHRcdFx0dGhpcy5zdGVwKC0xLCB2YWwpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAodmFsIDwgdGhpcy5fcGFnZSApIHtcblx0XHRcdFx0dGhpcy5zdGVwKDEsIHZhbCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5fcGFnZSA9IHZhbDtcblx0fVxuXG5cdEBJbnB1dCgpIGdldCBudW1WaXNpYmxlKCk6bnVtYmVyIHtcblx0XHRyZXR1cm4gdGhpcy5fbnVtVmlzaWJsZTtcblx0fVxuXHRzZXQgbnVtVmlzaWJsZSh2YWw6bnVtYmVyKSB7XG5cdFx0dGhpcy5fbnVtVmlzaWJsZSA9IHZhbDtcblx0fVxuXG5cdEBJbnB1dCgpIGdldCBudW1TY3JvbGwoKTpudW1iZXIge1xuXHRcdHJldHVybiB0aGlzLl9udW1WaXNpYmxlO1xuXHR9XG5cdHNldCBudW1TY3JvbGwodmFsOm51bWJlcikge1xuXHRcdHRoaXMuX251bVNjcm9sbCA9IHZhbDtcblx0fVxuXG5cdEBJbnB1dCgpIHJlc3BvbnNpdmVPcHRpb25zOiBhbnlbXTtcblxuXHRASW5wdXQoKSBvcmllbnRhdGlvbiA9IFwiaG9yaXpvbnRhbFwiO1xuXG5cdEBJbnB1dCgpIHZlcnRpY2FsVmlld1BvcnRIZWlnaHQgPSBcIjMwMHB4XCI7XG5cblx0QElucHV0KCkgY29udGVudENsYXNzOiBzdHJpbmcgPSBcIlwiO1xuXG5cdEBJbnB1dCgpIGluZGljYXRvcnNDb250ZW50Q2xhc3M6IHN0cmluZyA9IFwiXCI7XG5cblx0QElucHV0KCkgaW5kaWNhdG9yc0NvbnRlbnRTdHlsZTogYW55O1xuXG5cdEBJbnB1dCgpIGluZGljYXRvclN0eWxlQ2xhc3M6IHN0cmluZyA9IFwiXCI7XG5cblx0QElucHV0KCkgaW5kaWNhdG9yU3R5bGU6IGFueTtcblxuXHRASW5wdXQoKSBnZXQgdmFsdWUoKSA6YW55W10ge1xuXHRcdHJldHVybiB0aGlzLl92YWx1ZTtcblx0fTtcblx0c2V0IHZhbHVlKHZhbCkge1xuXHRcdHRoaXMuX3ZhbHVlID0gdmFsO1xuXHR9XG5cblx0QElucHV0KCkgY2lyY3VsYXI6IGJvb2xlYW4gPSBmYWxzZTtcblxuXHRASW5wdXQoKSBzaG93SW5kaWNhdG9yczogYm9vbGVhbiA9IHRydWU7XG5cblx0QElucHV0KCkgc2hvd05hdmlnYXRvcnM6IGJvb2xlYW4gPSB0cnVlO1xuXG5cdEBJbnB1dCgpIGF1dG9wbGF5SW50ZXJ2YWw6bnVtYmVyID0gMDtcblxuXHRASW5wdXQoKSBzdHlsZTogYW55O1xuXG5cdEBJbnB1dCgpIHN0eWxlQ2xhc3M6IHN0cmluZztcblxuICAgIEBPdXRwdXQoKSBvblBhZ2U6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG5cdEBWaWV3Q2hpbGQoJ2l0ZW1zQ29udGFpbmVyJykgaXRlbXNDb250YWluZXI6IEVsZW1lbnRSZWY7XG5cblx0QENvbnRlbnRDaGlsZChIZWFkZXIpIGhlYWRlckZhY2V0O1xuXG4gICAgQENvbnRlbnRDaGlsZChGb290ZXIpIGZvb3RlckZhY2V0O1xuXG5cdEBDb250ZW50Q2hpbGRyZW4oUHJpbWVUZW1wbGF0ZSkgdGVtcGxhdGVzOiBRdWVyeUxpc3Q8YW55PjtcblxuXHRfbnVtVmlzaWJsZTogbnVtYmVyID0gMTtcblxuXHRfbnVtU2Nyb2xsOiBudW1iZXIgPSAxO1xuXG5cdF9vbGROdW1TY3JvbGw6IG51bWJlciA9IDA7XG5cblx0cHJldlN0YXRlOiBhbnkgPSB7XG5cdFx0bnVtU2Nyb2xsOjAsXG5cdFx0bnVtVmlzaWJsZTowLFxuXHRcdHZhbHVlOiBbXVxuXHR9O1xuXG5cdGRlZmF1bHROdW1TY3JvbGw6bnVtYmVyID0gMTtcblxuXHRkZWZhdWx0TnVtVmlzaWJsZTpudW1iZXIgPSAxO1xuXG5cdF9wYWdlOiBudW1iZXIgPSAwO1xuXG5cdF92YWx1ZTogYW55W107XG5cblx0Y2Fyb3VzZWxTdHlsZTphbnk7XG5cblx0aWQ6c3RyaW5nO1xuXG5cdHRvdGFsU2hpZnRlZEl0ZW1zO1xuXG5cdGlzUmVtYWluaW5nSXRlbXNBZGRlZDpib29sZWFuID0gZmFsc2U7XG5cblx0YW5pbWF0aW9uVGltZW91dDphbnk7XG5cblx0dHJhbnNsYXRlVGltZW91dDphbnk7XG5cblx0cmVtYWluaW5nSXRlbXM6IG51bWJlciA9IDA7XG5cblx0X2l0ZW1zOiBhbnlbXTtcblxuXHRzdGFydFBvczogYW55O1xuXG5cdGRvY3VtZW50UmVzaXplTGlzdGVuZXI6IGFueTtcblxuXHRjbG9uZWRJdGVtc0ZvclN0YXJ0aW5nOiBhbnlbXTtcblxuXHRjbG9uZWRJdGVtc0ZvckZpbmlzaGluZzogYW55W107XG5cblx0YWxsb3dBdXRvcGxheTogYm9vbGVhbjtcblxuXHRpbnRlcnZhbDogYW55O1xuXG5cdGlzQ3JlYXRlZDogYm9vbGVhbjtcblxuXHRzd2lwZVRocmVzaG9sZDogbnVtYmVyID0gMjA7XG5cbiAgICBpdGVtVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBoZWFkZXJUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIGZvb3RlclRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG5cdGNvbnN0cnVjdG9yKHB1YmxpYyBlbDogRWxlbWVudFJlZiwgcHVibGljIHpvbmU6IE5nWm9uZSwgcHVibGljIGNkOiBDaGFuZ2VEZXRlY3RvclJlZiwgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLCBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIGRvY3VtZW50OiBEb2N1bWVudCkge1xuXHRcdHRoaXMudG90YWxTaGlmdGVkSXRlbXMgPSB0aGlzLnBhZ2UgKiB0aGlzLm51bVNjcm9sbCAqIC0xO1xuXHR9XG5cblx0bmdPbkNoYW5nZXMoc2ltcGxlQ2hhbmdlOiBTaW1wbGVDaGFuZ2VzKSB7XG5cdFx0aWYgKHNpbXBsZUNoYW5nZS52YWx1ZSkge1xuXHRcdFx0aWYgKHRoaXMuY2lyY3VsYXIgJiYgdGhpcy5fdmFsdWUpIHtcblx0XHRcdFx0dGhpcy5zZXRDbG9uZUl0ZW1zKCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuaXNDcmVhdGVkKSB7XG5cblx0XHRcdGlmIChzaW1wbGVDaGFuZ2UubnVtVmlzaWJsZSkge1xuXHRcdFx0XHRpZiAodGhpcy5yZXNwb25zaXZlT3B0aW9ucykge1xuXHRcdFx0XHRcdHRoaXMuZGVmYXVsdE51bVZpc2libGUgPSB0aGlzLm51bVZpc2libGU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAodGhpcy5pc0NpcmN1bGFyKCkpIHtcblx0XHRcdFx0XHR0aGlzLnNldENsb25lSXRlbXMoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRoaXMuY3JlYXRlU3R5bGUoKTtcblx0XHRcdFx0dGhpcy5jYWxjdWxhdGVQb3NpdGlvbigpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoc2ltcGxlQ2hhbmdlLm51bVNjcm9sbCkge1xuXHRcdFx0XHRpZiAodGhpcy5yZXNwb25zaXZlT3B0aW9ucykge1xuXHRcdFx0XHRcdHRoaXMuZGVmYXVsdE51bVNjcm9sbCA9IHRoaXMubnVtU2Nyb2xsO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0bmdBZnRlckNvbnRlbnRJbml0KCkge1xuXHRcdHRoaXMuaWQgPSBVbmlxdWVDb21wb25lbnRJZCgpO1xuXHRcdHRoaXMuYWxsb3dBdXRvcGxheSA9ICEhdGhpcy5hdXRvcGxheUludGVydmFsO1xuXG5cdFx0aWYgKHRoaXMuY2lyY3VsYXIpIHtcblx0XHRcdHRoaXMuc2V0Q2xvbmVJdGVtcygpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLnJlc3BvbnNpdmVPcHRpb25zKSB7XG5cdFx0XHR0aGlzLmRlZmF1bHROdW1TY3JvbGwgPSB0aGlzLl9udW1TY3JvbGw7XG5cdFx0XHR0aGlzLmRlZmF1bHROdW1WaXNpYmxlID0gdGhpcy5fbnVtVmlzaWJsZTtcblx0XHR9XG5cblx0XHR0aGlzLmNyZWF0ZVN0eWxlKCk7XG5cdFx0dGhpcy5jYWxjdWxhdGVQb3NpdGlvbigpO1xuXG5cdFx0aWYgKHRoaXMucmVzcG9uc2l2ZU9wdGlvbnMpIHtcblx0XHRcdHRoaXMuYmluZERvY3VtZW50TGlzdGVuZXJzKCk7XG5cdFx0fVxuXG5cdFx0dGhpcy50ZW1wbGF0ZXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuXHRcdFx0c3dpdGNoIChpdGVtLmdldFR5cGUoKSkge1xuXHRcdFx0XHRjYXNlICdpdGVtJzpcblx0XHRcdFx0XHR0aGlzLml0ZW1UZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdoZWFkZXInOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhlYWRlclRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2Zvb3Rlcic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZm9vdGVyVGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0dGhpcy5pdGVtVGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0bmdBZnRlckNvbnRlbnRDaGVja2VkKCkge1xuXHRcdGNvbnN0IGlzQ2lyY3VsYXIgPSB0aGlzLmlzQ2lyY3VsYXIoKTtcblx0XHRsZXQgdG90YWxTaGlmdGVkSXRlbXMgPSB0aGlzLnRvdGFsU2hpZnRlZEl0ZW1zO1xuXG5cdFx0aWYgKHRoaXMudmFsdWUgJiYgdGhpcy5pdGVtc0NvbnRhaW5lciAmJiAodGhpcy5wcmV2U3RhdGUubnVtU2Nyb2xsICE9PSB0aGlzLl9udW1TY3JvbGwgfHwgdGhpcy5wcmV2U3RhdGUubnVtVmlzaWJsZSAhPT0gdGhpcy5fbnVtVmlzaWJsZSB8fCB0aGlzLnByZXZTdGF0ZS52YWx1ZS5sZW5ndGggIT09IHRoaXMudmFsdWUubGVuZ3RoKSkge1xuXHRcdFx0aWYgKHRoaXMuYXV0b3BsYXlJbnRlcnZhbCkge1xuXHRcdFx0XHR0aGlzLnN0b3BBdXRvcGxheSgpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLnJlbWFpbmluZ0l0ZW1zID0gKHRoaXMudmFsdWUubGVuZ3RoIC0gdGhpcy5fbnVtVmlzaWJsZSkgJSB0aGlzLl9udW1TY3JvbGw7XG5cblx0XHRcdGxldCBwYWdlID0gdGhpcy5fcGFnZTtcblx0XHRcdGlmICh0aGlzLnRvdGFsRG90cygpICE9PSAwICYmIHBhZ2UgPj0gdGhpcy50b3RhbERvdHMoKSkge1xuICAgICAgICAgICAgICAgIHBhZ2UgPSB0aGlzLnRvdGFsRG90cygpIC0gMTtcblx0XHRcdFx0dGhpcy5fcGFnZSA9IHBhZ2U7XG5cdFx0XHRcdHRoaXMub25QYWdlLmVtaXQoe1xuXHRcdFx0XHRcdHBhZ2U6IHRoaXMucGFnZVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0dG90YWxTaGlmdGVkSXRlbXMgPSAocGFnZSAqIHRoaXMuX251bVNjcm9sbCkgKiAtMTtcbiAgICAgICAgICAgIGlmIChpc0NpcmN1bGFyKSB7XG4gICAgICAgICAgICAgICAgdG90YWxTaGlmdGVkSXRlbXMgLT0gdGhpcy5fbnVtVmlzaWJsZTtcbiAgICAgICAgICAgIH1cblxuXHRcdFx0aWYgKHBhZ2UgPT09ICh0aGlzLnRvdGFsRG90cygpIC0gMSkgJiYgdGhpcy5yZW1haW5pbmdJdGVtcyA+IDApIHtcblx0XHRcdFx0dG90YWxTaGlmdGVkSXRlbXMgKz0gKC0xICogdGhpcy5yZW1haW5pbmdJdGVtcykgKyB0aGlzLl9udW1TY3JvbGw7XG5cdFx0XHRcdHRoaXMuaXNSZW1haW5pbmdJdGVtc0FkZGVkID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHR0aGlzLmlzUmVtYWluaW5nSXRlbXNBZGRlZCA9IGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodG90YWxTaGlmdGVkSXRlbXMgIT09IHRoaXMudG90YWxTaGlmdGVkSXRlbXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRvdGFsU2hpZnRlZEl0ZW1zID0gdG90YWxTaGlmdGVkSXRlbXM7XG4gICAgICAgICAgICB9XG5cblx0XHRcdHRoaXMuX29sZE51bVNjcm9sbCA9IHRoaXMuX251bVNjcm9sbDtcblx0XHRcdHRoaXMucHJldlN0YXRlLm51bVNjcm9sbCA9IHRoaXMuX251bVNjcm9sbDtcblx0XHRcdHRoaXMucHJldlN0YXRlLm51bVZpc2libGUgPSB0aGlzLl9udW1WaXNpYmxlO1xuXHRcdFx0dGhpcy5wcmV2U3RhdGUudmFsdWUgPSBbLi4udGhpcy5fdmFsdWVdO1xuXG5cdFx0XHRpZiAodGhpcy50b3RhbERvdHMoKSA+IDAgICYmIHRoaXMuaXRlbXNDb250YWluZXIubmF0aXZlRWxlbWVudCkge1xuXHRcdFx0XHR0aGlzLml0ZW1zQ29udGFpbmVyLm5hdGl2ZUVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gdGhpcy5pc1ZlcnRpY2FsKCkgPyBgdHJhbnNsYXRlM2QoMCwgJHt0b3RhbFNoaWZ0ZWRJdGVtcyAqICgxMDAvIHRoaXMuX251bVZpc2libGUpfSUsIDApYCA6IGB0cmFuc2xhdGUzZCgke3RvdGFsU2hpZnRlZEl0ZW1zICogKDEwMC8gdGhpcy5fbnVtVmlzaWJsZSl9JSwgMCwgMClgO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmlzQ3JlYXRlZCA9IHRydWU7XG5cblx0XHRcdGlmICh0aGlzLmF1dG9wbGF5SW50ZXJ2YWwgJiYgdGhpcy5pc0F1dG9wbGF5KCkpIHtcblx0XHRcdFx0dGhpcy5zdGFydEF1dG9wbGF5KCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKGlzQ2lyY3VsYXIpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnBhZ2UgPT09IDApIHtcbiAgICAgICAgICAgICAgICB0b3RhbFNoaWZ0ZWRJdGVtcyA9IC0xICogdGhpcy5fbnVtVmlzaWJsZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHRvdGFsU2hpZnRlZEl0ZW1zID09PSAwKSB7XG4gICAgICAgICAgICAgICAgdG90YWxTaGlmdGVkSXRlbXMgPSAtMSAqIHRoaXMudmFsdWUubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnJlbWFpbmluZ0l0ZW1zID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzUmVtYWluaW5nSXRlbXNBZGRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodG90YWxTaGlmdGVkSXRlbXMgIT09IHRoaXMudG90YWxTaGlmdGVkSXRlbXMpIHtcblx0XHRcdFx0dGhpcy50b3RhbFNoaWZ0ZWRJdGVtcyA9IHRvdGFsU2hpZnRlZEl0ZW1zO1xuICAgICAgICAgICAgfVxuXHRcdH1cblx0fVxuXG5cdGNyZWF0ZVN0eWxlKCkge1xuXHRcdFx0aWYgKCF0aGlzLmNhcm91c2VsU3R5bGUpIHtcblx0XHRcdFx0dGhpcy5jYXJvdXNlbFN0eWxlID0gdGhpcy5yZW5kZXJlci5jcmVhdGVFbGVtZW50KCdzdHlsZScpXG5cdFx0XHRcdHRoaXMuY2Fyb3VzZWxTdHlsZS50eXBlID0gJ3RleHQvY3NzJztcblx0XHRcdFx0dGhpcy5yZW5kZXJlci5hcHBlbmRDaGlsZCh0aGlzLmRvY3VtZW50LmhlYWQsIHRoaXMuY2Fyb3VzZWxTdHlsZSk7XG5cdFx0XHR9XG5cblx0XHRcdGxldCBpbm5lckhUTUwgPSBgXG4gICAgICAgICAgICAjJHt0aGlzLmlkfSAucC1jYXJvdXNlbC1pdGVtIHtcblx0XHRcdFx0ZmxleDogMSAwICR7ICgxMDAvIHRoaXMubnVtVmlzaWJsZSkgfSVcblx0XHRcdH1cbiAgICAgICAgYDtcblxuXHRcdFx0aWYgKHRoaXMucmVzcG9uc2l2ZU9wdGlvbnMpIHtcblx0XHRcdFx0dGhpcy5yZXNwb25zaXZlT3B0aW9ucy5zb3J0KChkYXRhMSwgZGF0YTIpID0+IHtcblx0XHRcdFx0XHRjb25zdCB2YWx1ZTEgPSBkYXRhMS5icmVha3BvaW50O1xuXHRcdFx0XHRcdGNvbnN0IHZhbHVlMiA9IGRhdGEyLmJyZWFrcG9pbnQ7XG5cdFx0XHRcdFx0bGV0IHJlc3VsdCA9IG51bGw7XG5cblx0XHRcdFx0XHRpZiAodmFsdWUxID09IG51bGwgJiYgdmFsdWUyICE9IG51bGwpXG5cdFx0XHRcdFx0XHRyZXN1bHQgPSAtMTtcblx0XHRcdFx0XHRlbHNlIGlmICh2YWx1ZTEgIT0gbnVsbCAmJiB2YWx1ZTIgPT0gbnVsbClcblx0XHRcdFx0XHRcdHJlc3VsdCA9IDE7XG5cdFx0XHRcdFx0ZWxzZSBpZiAodmFsdWUxID09IG51bGwgJiYgdmFsdWUyID09IG51bGwpXG5cdFx0XHRcdFx0XHRyZXN1bHQgPSAwO1xuXHRcdFx0XHRcdGVsc2UgaWYgKHR5cGVvZiB2YWx1ZTEgPT09ICdzdHJpbmcnICYmIHR5cGVvZiB2YWx1ZTIgPT09ICdzdHJpbmcnKVxuXHRcdFx0XHRcdFx0cmVzdWx0ID0gdmFsdWUxLmxvY2FsZUNvbXBhcmUodmFsdWUyLCB1bmRlZmluZWQsIHsgbnVtZXJpYzogdHJ1ZSB9KTtcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRyZXN1bHQgPSAodmFsdWUxIDwgdmFsdWUyKSA/IC0xIDogKHZhbHVlMSA+IHZhbHVlMikgPyAxIDogMDtcblxuXHRcdFx0XHRcdHJldHVybiAtMSAqIHJlc3VsdDtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJlc3BvbnNpdmVPcHRpb25zLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0bGV0IHJlcyA9IHRoaXMucmVzcG9uc2l2ZU9wdGlvbnNbaV07XG5cblx0XHRcdFx0XHRpbm5lckhUTUwgKz0gYFxuICAgICAgICAgICAgICAgICAgICBAbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiAke3Jlcy5icmVha3BvaW50fSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgIyR7dGhpcy5pZH0gLnAtY2Fyb3VzZWwtaXRlbSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxleDogMSAwICR7ICgxMDAvIHJlcy5udW1WaXNpYmxlKSB9JVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYFxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuY2Fyb3VzZWxTdHlsZS5pbm5lckhUTUwgPSBpbm5lckhUTUw7XG5cdFx0fVxuXG5cdGNhbGN1bGF0ZVBvc2l0aW9uKCkge1xuXHRcdGlmICh0aGlzLnJlc3BvbnNpdmVPcHRpb25zKSB7XG5cdFx0XHRsZXQgbWF0Y2hlZFJlc3BvbnNpdmVEYXRhID0ge1xuXHRcdFx0XHRudW1WaXNpYmxlOiB0aGlzLmRlZmF1bHROdW1WaXNpYmxlLFxuXHRcdFx0XHRudW1TY3JvbGw6IHRoaXMuZGVmYXVsdE51bVNjcm9sbFxuXHRcdFx0fTtcblx0XHRcdFxuXHRcdFx0aWYgKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0bGV0IHdpbmRvd1dpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG5cdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yZXNwb25zaXZlT3B0aW9ucy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdGxldCByZXMgPSB0aGlzLnJlc3BvbnNpdmVPcHRpb25zW2ldO1xuXHRcblx0XHRcdFx0XHRpZiAocGFyc2VJbnQocmVzLmJyZWFrcG9pbnQsIDEwKSA+PSB3aW5kb3dXaWR0aCkge1xuXHRcdFx0XHRcdFx0bWF0Y2hlZFJlc3BvbnNpdmVEYXRhID0gcmVzO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAodGhpcy5fbnVtU2Nyb2xsICE9PSBtYXRjaGVkUmVzcG9uc2l2ZURhdGEubnVtU2Nyb2xsKSB7XG5cdFx0XHRcdGxldCBwYWdlID0gdGhpcy5fcGFnZTtcblx0XHRcdFx0cGFnZSA9IE1hdGguZmxvb3IoKHBhZ2UgKiB0aGlzLl9udW1TY3JvbGwpIC8gbWF0Y2hlZFJlc3BvbnNpdmVEYXRhLm51bVNjcm9sbCk7XG5cblx0XHRcdFx0bGV0IHRvdGFsU2hpZnRlZEl0ZW1zID0gKG1hdGNoZWRSZXNwb25zaXZlRGF0YS5udW1TY3JvbGwgKiB0aGlzLnBhZ2UpICogLTE7XG5cblx0XHRcdFx0aWYgKHRoaXMuaXNDaXJjdWxhcigpKSB7XG5cdFx0XHRcdFx0dG90YWxTaGlmdGVkSXRlbXMgLT0gbWF0Y2hlZFJlc3BvbnNpdmVEYXRhLm51bVZpc2libGU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0aGlzLnRvdGFsU2hpZnRlZEl0ZW1zID0gdG90YWxTaGlmdGVkSXRlbXM7XG5cdFx0XHRcdHRoaXMuX251bVNjcm9sbCA9IG1hdGNoZWRSZXNwb25zaXZlRGF0YS5udW1TY3JvbGw7XG5cblx0XHRcdFx0dGhpcy5fcGFnZSA9IHBhZ2U7XG5cdFx0XHRcdHRoaXMub25QYWdlLmVtaXQoe1xuXHRcdFx0XHRcdHBhZ2U6IHRoaXMucGFnZVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHRoaXMuX251bVZpc2libGUgIT09IG1hdGNoZWRSZXNwb25zaXZlRGF0YS5udW1WaXNpYmxlKSB7XG5cdFx0XHRcdHRoaXMuX251bVZpc2libGUgPSBtYXRjaGVkUmVzcG9uc2l2ZURhdGEubnVtVmlzaWJsZTtcblx0XHRcdFx0dGhpcy5zZXRDbG9uZUl0ZW1zKCk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG5cdFx0fVxuXHR9XG5cblx0c2V0Q2xvbmVJdGVtcygpIHtcblx0XHR0aGlzLmNsb25lZEl0ZW1zRm9yU3RhcnRpbmcgPSBbXTtcblx0XHR0aGlzLmNsb25lZEl0ZW1zRm9yRmluaXNoaW5nID0gW107XG5cdFx0aWYgKHRoaXMuaXNDaXJjdWxhcigpKSB7XG5cdFx0XHR0aGlzLmNsb25lZEl0ZW1zRm9yU3RhcnRpbmcucHVzaCguLi50aGlzLnZhbHVlLnNsaWNlKC0xICogdGhpcy5fbnVtVmlzaWJsZSkpO1xuXHRcdFx0dGhpcy5jbG9uZWRJdGVtc0ZvckZpbmlzaGluZy5wdXNoKC4uLnRoaXMudmFsdWUuc2xpY2UoMCwgdGhpcy5fbnVtVmlzaWJsZSkpO1xuXHRcdH1cblx0fVxuXG5cdGZpcnN0SW5kZXgoKSB7XG5cdFx0cmV0dXJuIHRoaXMuaXNDaXJjdWxhcigpID8gKC0xICogKHRoaXMudG90YWxTaGlmdGVkSXRlbXMgKyB0aGlzLm51bVZpc2libGUpKSA6ICh0aGlzLnRvdGFsU2hpZnRlZEl0ZW1zICogLTEpO1xuXHR9XG5cblx0bGFzdEluZGV4KCkge1xuXHRcdHJldHVybiB0aGlzLmZpcnN0SW5kZXgoKSArIHRoaXMubnVtVmlzaWJsZSAtIDE7XG5cdH1cblxuXHR0b3RhbERvdHMoKSB7XG5cdFx0cmV0dXJuIHRoaXMudmFsdWUgPyBNYXRoLmNlaWwoKHRoaXMudmFsdWUubGVuZ3RoIC0gdGhpcy5fbnVtVmlzaWJsZSkgLyB0aGlzLl9udW1TY3JvbGwpICsgMSA6IDA7XG5cdH1cblxuXHR0b3RhbERvdHNBcnJheSgpIHtcblx0XHRjb25zdCB0b3RhbERvdHMgPSB0aGlzLnRvdGFsRG90cygpO1xuXHRcdHJldHVybiB0b3RhbERvdHMgPD0gMCA/IFtdIDogQXJyYXkodG90YWxEb3RzKS5maWxsKDApO1xuXHR9XG5cblx0aXNWZXJ0aWNhbCgpIHtcblx0XHRyZXR1cm4gdGhpcy5vcmllbnRhdGlvbiA9PT0gJ3ZlcnRpY2FsJztcblx0fVxuXG5cdGlzQ2lyY3VsYXIoKSB7XG5cdFx0cmV0dXJuIHRoaXMuY2lyY3VsYXIgJiYgdGhpcy52YWx1ZSAmJiB0aGlzLnZhbHVlLmxlbmd0aCA+PSB0aGlzLm51bVZpc2libGU7XG5cdH1cblxuXHRpc0F1dG9wbGF5KCkge1xuXHRcdHJldHVybiB0aGlzLmF1dG9wbGF5SW50ZXJ2YWwgJiYgdGhpcy5hbGxvd0F1dG9wbGF5O1xuXHR9XG5cblx0aXNGb3J3YXJkTmF2RGlzYWJsZWQoKSB7XG5cdFx0cmV0dXJuIHRoaXMuaXNFbXB0eSgpIHx8ICh0aGlzLl9wYWdlID49ICh0aGlzLnRvdGFsRG90cygpIC0gMSkgJiYgIXRoaXMuaXNDaXJjdWxhcigpKTtcblx0fVxuXG5cdGlzQmFja3dhcmROYXZEaXNhYmxlZCgpIHtcblx0XHRyZXR1cm4gdGhpcy5pc0VtcHR5KCkgfHwgKHRoaXMuX3BhZ2UgPD0gMCAgJiYgIXRoaXMuaXNDaXJjdWxhcigpKTtcblx0fVxuXG5cdGlzRW1wdHkoKSB7XG5cdFx0cmV0dXJuICF0aGlzLnZhbHVlIHx8IHRoaXMudmFsdWUubGVuZ3RoID09PSAwO1xuXHR9XG5cblx0bmF2Rm9yd2FyZChlLGluZGV4Pykge1xuXHRcdGlmICh0aGlzLmlzQ2lyY3VsYXIoKSB8fCB0aGlzLl9wYWdlIDwgKHRoaXMudG90YWxEb3RzKCkgLSAxKSkge1xuXHRcdFx0dGhpcy5zdGVwKC0xLCBpbmRleCk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuYXV0b3BsYXlJbnRlcnZhbCkge1xuXHRcdFx0dGhpcy5zdG9wQXV0b3BsYXkoKTtcblx0XHRcdHRoaXMuYWxsb3dBdXRvcGxheSA9IGZhbHNlO1xuXHRcdH1cblxuXHRcdGlmIChlICYmIGUuY2FuY2VsYWJsZSkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdH1cblx0fVxuXG5cdG5hdkJhY2t3YXJkKGUsaW5kZXg/KSB7XG5cdFx0aWYgKHRoaXMuaXNDaXJjdWxhcigpIHx8IHRoaXMuX3BhZ2UgIT09IDApIHtcblx0XHRcdHRoaXMuc3RlcCgxLCBpbmRleCk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuYXV0b3BsYXlJbnRlcnZhbCkge1xuXHRcdFx0dGhpcy5zdG9wQXV0b3BsYXkoKTtcblx0XHRcdHRoaXMuYWxsb3dBdXRvcGxheSA9IGZhbHNlO1xuXHRcdH1cblxuXHRcdGlmIChlICYmIGUuY2FuY2VsYWJsZSkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdH1cblx0fVxuXG5cdG9uRG90Q2xpY2soZSwgaW5kZXgpIHtcblx0XHRsZXQgcGFnZSA9IHRoaXMuX3BhZ2U7XG5cblx0XHRpZiAodGhpcy5hdXRvcGxheUludGVydmFsKSB7XG5cdFx0XHR0aGlzLnN0b3BBdXRvcGxheSgpO1xuXHRcdFx0dGhpcy5hbGxvd0F1dG9wbGF5ID0gZmFsc2U7XG5cdFx0fVxuXG5cdFx0aWYgKGluZGV4ID4gcGFnZSkge1xuXHRcdFx0dGhpcy5uYXZGb3J3YXJkKGUsIGluZGV4KTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAoaW5kZXggPCBwYWdlKSB7XG5cdFx0XHR0aGlzLm5hdkJhY2t3YXJkKGUsIGluZGV4KTtcblx0XHR9XG5cdH1cblxuXHRzdGVwKGRpciwgcGFnZSkge1xuXHRcdGxldCB0b3RhbFNoaWZ0ZWRJdGVtcyA9IHRoaXMudG90YWxTaGlmdGVkSXRlbXM7XG5cdFx0Y29uc3QgaXNDaXJjdWxhciA9IHRoaXMuaXNDaXJjdWxhcigpO1xuXG5cdFx0aWYgKHBhZ2UgIT0gbnVsbCkge1xuXHRcdFx0dG90YWxTaGlmdGVkSXRlbXMgPSAodGhpcy5fbnVtU2Nyb2xsICogcGFnZSkgKiAtMTtcblxuXHRcdFx0aWYgKGlzQ2lyY3VsYXIpIHtcblx0XHRcdFx0dG90YWxTaGlmdGVkSXRlbXMgLT0gdGhpcy5fbnVtVmlzaWJsZTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5pc1JlbWFpbmluZ0l0ZW1zQWRkZWQgPSBmYWxzZTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHR0b3RhbFNoaWZ0ZWRJdGVtcyArPSAodGhpcy5fbnVtU2Nyb2xsICogZGlyKTtcblx0XHRcdGlmICh0aGlzLmlzUmVtYWluaW5nSXRlbXNBZGRlZCkge1xuXHRcdFx0XHR0b3RhbFNoaWZ0ZWRJdGVtcyArPSB0aGlzLnJlbWFpbmluZ0l0ZW1zIC0gKHRoaXMuX251bVNjcm9sbCAqIGRpcik7XG5cdFx0XHRcdHRoaXMuaXNSZW1haW5pbmdJdGVtc0FkZGVkID0gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdGxldCBvcmlnaW5hbFNoaWZ0ZWRJdGVtcyA9IGlzQ2lyY3VsYXIgPyAodG90YWxTaGlmdGVkSXRlbXMgKyB0aGlzLl9udW1WaXNpYmxlKSA6IHRvdGFsU2hpZnRlZEl0ZW1zO1xuXHRcdFx0cGFnZSA9IE1hdGguYWJzKE1hdGguZmxvb3IoKG9yaWdpbmFsU2hpZnRlZEl0ZW1zIC8gdGhpcy5fbnVtU2Nyb2xsKSkpO1xuXHRcdH1cblxuXHRcdGlmIChpc0NpcmN1bGFyICYmIHRoaXMucGFnZSA9PT0gKHRoaXMudG90YWxEb3RzKCkgLSAxKSAmJiBkaXIgPT09IC0xKSB7XG5cdFx0XHR0b3RhbFNoaWZ0ZWRJdGVtcyA9IC0xICogKHRoaXMudmFsdWUubGVuZ3RoICsgdGhpcy5fbnVtVmlzaWJsZSk7XG5cdFx0XHRwYWdlID0gMDtcblx0XHR9XG5cdFx0ZWxzZSBpZiAoaXNDaXJjdWxhciAmJiB0aGlzLnBhZ2UgPT09IDAgJiYgZGlyID09PSAxKSB7XG5cdFx0XHR0b3RhbFNoaWZ0ZWRJdGVtcyA9IDA7XG5cdFx0XHRwYWdlID0gKHRoaXMudG90YWxEb3RzKCkgLSAxKTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAocGFnZSA9PT0gKHRoaXMudG90YWxEb3RzKCkgLSAxKSAmJiB0aGlzLnJlbWFpbmluZ0l0ZW1zID4gMCkge1xuXHRcdFx0dG90YWxTaGlmdGVkSXRlbXMgKz0gKCh0aGlzLnJlbWFpbmluZ0l0ZW1zICogLTEpIC0gKHRoaXMuX251bVNjcm9sbCAqIGRpcikpO1xuXHRcdFx0dGhpcy5pc1JlbWFpbmluZ0l0ZW1zQWRkZWQgPSB0cnVlO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLml0ZW1zQ29udGFpbmVyKSB7XG5cdFx0XHR0aGlzLml0ZW1zQ29udGFpbmVyLm5hdGl2ZUVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gdGhpcy5pc1ZlcnRpY2FsKCkgPyBgdHJhbnNsYXRlM2QoMCwgJHt0b3RhbFNoaWZ0ZWRJdGVtcyAqICgxMDAvIHRoaXMuX251bVZpc2libGUpfSUsIDApYCA6IGB0cmFuc2xhdGUzZCgke3RvdGFsU2hpZnRlZEl0ZW1zICogKDEwMC8gdGhpcy5fbnVtVmlzaWJsZSl9JSwgMCwgMClgO1xuXHRcdFx0dGhpcy5pdGVtc0NvbnRhaW5lci5uYXRpdmVFbGVtZW50LnN0eWxlLnRyYW5zaXRpb24gPSAndHJhbnNmb3JtIDUwMG1zIGVhc2UgMHMnO1xuXHRcdH1cblxuXHRcdHRoaXMudG90YWxTaGlmdGVkSXRlbXMgPSB0b3RhbFNoaWZ0ZWRJdGVtcztcblx0XHR0aGlzLl9wYWdlID0gcGFnZTtcblx0XHR0aGlzLm9uUGFnZS5lbWl0KHtcblx0XHRcdHBhZ2U6IHRoaXMucGFnZVxuXHRcdH0pO1xuXHR9XG5cblx0c3RhcnRBdXRvcGxheSgpIHtcblx0XHR0aGlzLmludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuXHRcdFx0aWYgKHRoaXMudG90YWxEb3RzKCkgPiAwKSB7XG5cdFx0XHRcdGlmICh0aGlzLnBhZ2UgPT09ICh0aGlzLnRvdGFsRG90cygpIC0gMSkpIHtcblx0XHRcdFx0XHR0aGlzLnN0ZXAoLTEsIDApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMuc3RlcCgtMSwgdGhpcy5wYWdlICsgMSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXHRcdHRoaXMuYXV0b3BsYXlJbnRlcnZhbCk7XG5cdH1cblxuXHRzdG9wQXV0b3BsYXkoKSB7XG5cdFx0aWYgKHRoaXMuaW50ZXJ2YWwpIHtcblx0XHRcdGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XG5cdFx0fVxuXHR9XG5cblx0b25UcmFuc2l0aW9uRW5kKCkge1xuXHRcdGlmICh0aGlzLml0ZW1zQ29udGFpbmVyKSB7XG5cdFx0XHR0aGlzLml0ZW1zQ29udGFpbmVyLm5hdGl2ZUVsZW1lbnQuc3R5bGUudHJhbnNpdGlvbiA9ICcnO1xuXG5cdFx0XHRpZiAoKHRoaXMucGFnZSA9PT0gMCB8fCB0aGlzLnBhZ2UgPT09ICh0aGlzLnRvdGFsRG90cygpIC0gMSkpICYmIHRoaXMuaXNDaXJjdWxhcigpKSB7XG5cdFx0XHRcdHRoaXMuaXRlbXNDb250YWluZXIubmF0aXZlRWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSB0aGlzLmlzVmVydGljYWwoKSA/IGB0cmFuc2xhdGUzZCgwLCAke3RoaXMudG90YWxTaGlmdGVkSXRlbXMgKiAoMTAwLyB0aGlzLl9udW1WaXNpYmxlKX0lLCAwKWAgOiBgdHJhbnNsYXRlM2QoJHt0aGlzLnRvdGFsU2hpZnRlZEl0ZW1zICogKDEwMC8gdGhpcy5fbnVtVmlzaWJsZSl9JSwgMCwgMClgO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdG9uVG91Y2hTdGFydChlKSB7XG5cdFx0bGV0IHRvdWNob2JqID0gZS5jaGFuZ2VkVG91Y2hlc1swXTtcblxuXHRcdHRoaXMuc3RhcnRQb3MgPSB7XG5cdFx0XHR4OiB0b3VjaG9iai5wYWdlWCxcblx0XHRcdHk6IHRvdWNob2JqLnBhZ2VZXG5cdFx0fTtcblx0fVxuXG5cdG9uVG91Y2hNb3ZlKGUpIHtcblx0XHRpZiAoZS5jYW5jZWxhYmxlKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0fVxuXHR9XG5cdG9uVG91Y2hFbmQoZSkge1xuXHRcdGxldCB0b3VjaG9iaiA9IGUuY2hhbmdlZFRvdWNoZXNbMF07XG5cblx0XHRpZiAodGhpcy5pc1ZlcnRpY2FsKCkpIHtcblx0XHRcdHRoaXMuY2hhbmdlUGFnZU9uVG91Y2goZSwgKHRvdWNob2JqLnBhZ2VZIC0gdGhpcy5zdGFydFBvcy55KSk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0dGhpcy5jaGFuZ2VQYWdlT25Ub3VjaChlLCAodG91Y2hvYmoucGFnZVggLSB0aGlzLnN0YXJ0UG9zLngpKTtcblx0XHR9XG5cdH1cblxuXHRjaGFuZ2VQYWdlT25Ub3VjaChlLCBkaWZmKSB7XG5cdFx0aWYgKE1hdGguYWJzKGRpZmYpID4gdGhpcy5zd2lwZVRocmVzaG9sZCkge1xuXHRcdFx0aWYgKGRpZmYgPCAwKSB7XG5cdFx0XHRcdHRoaXMubmF2Rm9yd2FyZChlKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHR0aGlzLm5hdkJhY2t3YXJkKGUpO1xuXG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0YmluZERvY3VtZW50TGlzdGVuZXJzKCkge1xuXHRcdGlmICghdGhpcy5kb2N1bWVudFJlc2l6ZUxpc3RlbmVyICYmIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHR0aGlzLmRvY3VtZW50UmVzaXplTGlzdGVuZXIgPSAoZSkgPT4ge1xuXHRcdFx0XHR0aGlzLmNhbGN1bGF0ZVBvc2l0aW9uKCk7XG5cdFx0XHR9O1xuXG5cdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5kb2N1bWVudFJlc2l6ZUxpc3RlbmVyKTtcblx0XHR9XG5cdH1cblxuXHR1bmJpbmREb2N1bWVudExpc3RlbmVycygpIHtcblx0XHRpZiAodGhpcy5kb2N1bWVudFJlc2l6ZUxpc3RlbmVyICYmIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5kb2N1bWVudFJlc2l6ZUxpc3RlbmVyKTtcblx0XHRcdHRoaXMuZG9jdW1lbnRSZXNpemVMaXN0ZW5lciA9IG51bGw7XG5cdFx0fVxuXHR9XG5cblx0bmdPbkRlc3Ryb3koKSB7XG5cdFx0aWYgKHRoaXMucmVzcG9uc2l2ZU9wdGlvbnMpIHtcblx0XHRcdHRoaXMudW5iaW5kRG9jdW1lbnRMaXN0ZW5lcnMoKTtcblx0XHR9XG5cdFx0aWYgKHRoaXMuYXV0b3BsYXlJbnRlcnZhbCkge1xuXHRcdFx0dGhpcy5zdG9wQXV0b3BsYXkoKTtcblx0XHR9XG4gICAgfVxuXG59XG5cbkBOZ01vZHVsZSh7XG5cdGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIFNoYXJlZE1vZHVsZSwgUmlwcGxlTW9kdWxlXSxcblx0ZXhwb3J0czogW0NvbW1vbk1vZHVsZSwgQ2Fyb3VzZWwsIFNoYXJlZE1vZHVsZV0sXG5cdGRlY2xhcmF0aW9uczogW0Nhcm91c2VsXVxufSlcbmV4cG9ydCBjbGFzcyBDYXJvdXNlbE1vZHVsZSB7IH1cbiJdfQ==