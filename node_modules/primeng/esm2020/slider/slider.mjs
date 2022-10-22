import { NgModule, Component, Input, Output, EventEmitter, forwardRef, ViewChild, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomHandler } from 'primeng/dom';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export const SLIDER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Slider),
    multi: true
};
export class Slider {
    constructor(el, renderer, ngZone, cd) {
        this.el = el;
        this.renderer = renderer;
        this.ngZone = ngZone;
        this.cd = cd;
        this.min = 0;
        this.max = 100;
        this.orientation = 'horizontal';
        this.tabindex = 0;
        this.onChange = new EventEmitter();
        this.onSlideEnd = new EventEmitter();
        this.handleValues = [];
        this.onModelChange = () => { };
        this.onModelTouched = () => { };
        this.handleIndex = 0;
    }
    onMouseDown(event, index) {
        if (this.disabled) {
            return;
        }
        this.dragging = true;
        this.updateDomData();
        this.sliderHandleClick = true;
        if (this.range && this.handleValues && this.handleValues[0] === this.max) {
            this.handleIndex = 0;
        }
        else {
            this.handleIndex = index;
        }
        this.bindDragListeners();
        event.target.focus();
        event.preventDefault();
        if (this.animate) {
            DomHandler.removeClass(this.el.nativeElement.children[0], 'p-slider-animate');
        }
    }
    onTouchStart(event, index) {
        if (this.disabled) {
            return;
        }
        var touchobj = event.changedTouches[0];
        this.startHandleValue = (this.range) ? this.handleValues[index] : this.handleValue;
        this.dragging = true;
        if (this.range && this.handleValues && this.handleValues[0] === this.max) {
            this.handleIndex = 0;
        }
        else {
            this.handleIndex = index;
        }
        if (this.orientation === 'horizontal') {
            this.startx = parseInt(touchobj.clientX, 10);
            this.barWidth = this.el.nativeElement.children[0].offsetWidth;
        }
        else {
            this.starty = parseInt(touchobj.clientY, 10);
            this.barHeight = this.el.nativeElement.children[0].offsetHeight;
        }
        if (this.animate) {
            DomHandler.removeClass(this.el.nativeElement.children[0], 'p-slider-animate');
        }
        event.preventDefault();
    }
    onTouchMove(event, index) {
        if (this.disabled) {
            return;
        }
        var touchobj = event.changedTouches[0], handleValue = 0;
        if (this.orientation === 'horizontal') {
            handleValue = Math.floor(((parseInt(touchobj.clientX, 10) - this.startx) * 100) / (this.barWidth)) + this.startHandleValue;
        }
        else {
            handleValue = Math.floor(((this.starty - parseInt(touchobj.clientY, 10)) * 100) / (this.barHeight)) + this.startHandleValue;
        }
        this.setValueFromHandle(event, handleValue);
        event.preventDefault();
    }
    onTouchEnd(event, index) {
        if (this.disabled) {
            return;
        }
        this.dragging = false;
        if (this.range)
            this.onSlideEnd.emit({ originalEvent: event, values: this.values });
        else
            this.onSlideEnd.emit({ originalEvent: event, value: this.value });
        if (this.animate) {
            DomHandler.addClass(this.el.nativeElement.children[0], 'p-slider-animate');
        }
        event.preventDefault();
    }
    onBarClick(event) {
        if (this.disabled) {
            return;
        }
        if (!this.sliderHandleClick) {
            this.updateDomData();
            this.handleChange(event);
        }
        this.sliderHandleClick = false;
    }
    onHandleKeydown(event, handleIndex) {
        if (this.disabled) {
            return;
        }
        if (event.which == 38 || event.which == 39) {
            this.spin(event, 1, handleIndex);
        }
        else if (event.which == 37 || event.which == 40) {
            this.spin(event, -1, handleIndex);
        }
    }
    spin(event, dir, handleIndex) {
        let step = (this.step || 1) * dir;
        if (this.range) {
            this.handleIndex = handleIndex;
            this.updateValue(this.values[this.handleIndex] + step);
            this.updateHandleValue();
        }
        else {
            this.updateValue(this.value + step);
            this.updateHandleValue();
        }
        event.preventDefault();
    }
    handleChange(event) {
        let handleValue = this.calculateHandleValue(event);
        this.setValueFromHandle(event, handleValue);
    }
    bindDragListeners() {
        this.ngZone.runOutsideAngular(() => {
            const documentTarget = this.el ? this.el.nativeElement.ownerDocument : 'document';
            if (!this.dragListener) {
                this.dragListener = this.renderer.listen(documentTarget, 'mousemove', (event) => {
                    if (this.dragging) {
                        this.ngZone.run(() => {
                            this.handleChange(event);
                        });
                    }
                });
            }
            if (!this.mouseupListener) {
                this.mouseupListener = this.renderer.listen(documentTarget, 'mouseup', (event) => {
                    if (this.dragging) {
                        this.dragging = false;
                        this.ngZone.run(() => {
                            if (this.range)
                                this.onSlideEnd.emit({ originalEvent: event, values: this.values });
                            else
                                this.onSlideEnd.emit({ originalEvent: event, value: this.value });
                            if (this.animate) {
                                DomHandler.addClass(this.el.nativeElement.children[0], 'p-slider-animate');
                            }
                        });
                    }
                });
            }
        });
    }
    unbindDragListeners() {
        if (this.dragListener) {
            this.dragListener();
        }
        if (this.mouseupListener) {
            this.mouseupListener();
        }
    }
    setValueFromHandle(event, handleValue) {
        this.sliderHandleClick = false;
        let newValue = this.getValueFromHandle(handleValue);
        if (this.range) {
            if (this.step) {
                this.handleStepChange(newValue, this.values[this.handleIndex]);
            }
            else {
                this.handleValues[this.handleIndex] = handleValue;
                this.updateValue(newValue, event);
            }
        }
        else {
            if (this.step) {
                this.handleStepChange(newValue, this.value);
            }
            else {
                this.handleValue = handleValue;
                this.updateValue(newValue, event);
            }
        }
        this.cd.markForCheck();
    }
    handleStepChange(newValue, oldValue) {
        let diff = (newValue - oldValue);
        let val = oldValue;
        if (diff < 0) {
            val = oldValue + Math.ceil(newValue / this.step - oldValue / this.step) * this.step;
        }
        else if (diff > 0) {
            val = oldValue + Math.floor(newValue / this.step - oldValue / this.step) * this.step;
        }
        this.updateValue(val);
        this.updateHandleValue();
    }
    writeValue(value) {
        if (this.range)
            this.values = value || [0, 0];
        else
            this.value = value || 0;
        this.updateHandleValue();
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
    get rangeStartLeft() {
        return this.isVertical() ? null : this.handleValues[0] + '%';
    }
    get rangeStartBottom() {
        return this.isVertical() ? this.handleValues[0] + '%' : 'auto';
    }
    get rangeEndLeft() {
        return this.isVertical() ? null : this.handleValues[1] + '%';
    }
    get rangeEndBottom() {
        return this.isVertical() ? this.handleValues[1] + '%' : 'auto';
    }
    isVertical() {
        return this.orientation === 'vertical';
    }
    updateDomData() {
        let rect = this.el.nativeElement.children[0].getBoundingClientRect();
        this.initX = rect.left + DomHandler.getWindowScrollLeft();
        this.initY = rect.top + DomHandler.getWindowScrollTop();
        this.barWidth = this.el.nativeElement.children[0].offsetWidth;
        this.barHeight = this.el.nativeElement.children[0].offsetHeight;
    }
    calculateHandleValue(event) {
        if (this.orientation === 'horizontal')
            return ((event.pageX - this.initX) * 100) / (this.barWidth);
        else
            return (((this.initY + this.barHeight) - event.pageY) * 100) / (this.barHeight);
    }
    updateHandleValue() {
        if (this.range) {
            this.handleValues[0] = (this.values[0] < this.min ? 0 : this.values[0] - this.min) * 100 / (this.max - this.min);
            this.handleValues[1] = (this.values[1] > this.max ? 100 : this.values[1] - this.min) * 100 / (this.max - this.min);
        }
        else {
            if (this.value < this.min)
                this.handleValue = 0;
            else if (this.value > this.max)
                this.handleValue = 100;
            else
                this.handleValue = (this.value - this.min) * 100 / (this.max - this.min);
        }
        if (this.step) {
            this.updateDiffAndOffset();
        }
    }
    updateDiffAndOffset() {
        this.diff = this.getDiff();
        this.offset = this.getOffset();
    }
    getDiff() {
        return Math.abs(this.handleValues[0] - this.handleValues[1]);
    }
    getOffset() {
        return Math.min(this.handleValues[0], this.handleValues[1]);
    }
    updateValue(val, event) {
        if (this.range) {
            let value = val;
            if (this.handleIndex == 0) {
                if (value < this.min) {
                    value = this.min;
                    this.handleValues[0] = 0;
                }
                else if (value > this.values[1]) {
                    if (value > this.max) {
                        value = this.max;
                        this.handleValues[0] = 100;
                    }
                    this.handleValues[0] = value;
                }
                this.sliderHandleStart.nativeElement.focus();
            }
            else {
                if (value > this.max) {
                    value = this.max;
                    this.handleValues[1] = 100;
                    this.offset = this.handleValues[1];
                }
                else if (value < this.min) {
                    value = this.min;
                    this.handleValues[1] = value;
                }
                else if (value < this.values[0]) {
                    this.offset = this.handleValues[1];
                }
                this.sliderHandleEnd.nativeElement.focus();
            }
            if (this.step) {
                this.updateHandleValue();
            }
            else {
                this.updateDiffAndOffset();
            }
            this.values[this.handleIndex] = this.getNormalizedValue(value);
            let newValues = [this.minVal, this.maxVal];
            this.onModelChange(newValues);
            this.onChange.emit({ event: event, values: this.values });
        }
        else {
            if (val < this.min) {
                val = this.min;
                this.handleValue = 0;
            }
            else if (val > this.max) {
                val = this.max;
                this.handleValue = 100;
            }
            this.value = this.getNormalizedValue(val);
            this.onModelChange(this.value);
            this.onChange.emit({ event: event, value: this.value });
            this.sliderHandle.nativeElement.focus();
        }
    }
    getValueFromHandle(handleValue) {
        return (this.max - this.min) * (handleValue / 100) + this.min;
    }
    getDecimalsCount(value) {
        if (value && Math.floor(value) !== value)
            return value.toString().split(".")[1].length || 0;
        return 0;
    }
    getNormalizedValue(val) {
        let decimalsCount = this.getDecimalsCount(this.step);
        if (decimalsCount > 0) {
            return +parseFloat(val.toString()).toFixed(decimalsCount);
        }
        else {
            return Math.floor(val);
        }
    }
    ngOnDestroy() {
        this.unbindDragListeners();
    }
    get minVal() {
        return Math.min(this.values[1], this.values[0]);
    }
    get maxVal() {
        return Math.max(this.values[1], this.values[0]);
    }
}
Slider.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Slider, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i0.NgZone }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
Slider.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.7", type: Slider, selector: "p-slider", inputs: { animate: "animate", disabled: "disabled", min: "min", max: "max", orientation: "orientation", step: "step", range: "range", style: "style", styleClass: "styleClass", ariaLabelledBy: "ariaLabelledBy", tabindex: "tabindex" }, outputs: { onChange: "onChange", onSlideEnd: "onSlideEnd" }, host: { classAttribute: "p-element" }, providers: [SLIDER_VALUE_ACCESSOR], viewQueries: [{ propertyName: "sliderHandle", first: true, predicate: ["sliderHandle"], descendants: true }, { propertyName: "sliderHandleStart", first: true, predicate: ["sliderHandleStart"], descendants: true }, { propertyName: "sliderHandleEnd", first: true, predicate: ["sliderHandleEnd"], descendants: true }], ngImport: i0, template: `
        <div [ngStyle]="style" [class]="styleClass" [ngClass]="{'p-slider p-component':true,'p-disabled':disabled,
            'p-slider-horizontal':orientation == 'horizontal','p-slider-vertical':orientation == 'vertical','p-slider-animate':animate}"
            (click)="onBarClick($event)">
            <span *ngIf="range && orientation == 'horizontal'" class="p-slider-range" [ngStyle]="{'left':offset !== null && offset !== undefined ? offset + '%' : handleValues[0] + '%',width: diff ? diff + '%' : handleValues[1] - handleValues[0] + '%'}"></span>
            <span *ngIf="range && orientation == 'vertical'" class="p-slider-range" [ngStyle]="{'bottom':offset !== null && offset !== undefined ? offset + '%' : handleValues[0] + '%',height: diff ? diff + '%' : handleValues[1] - handleValues[0] + '%'}"></span>
            <span *ngIf="!range && orientation=='vertical'" class="p-slider-range" [ngStyle]="{'height': handleValue + '%'}"></span>
            <span *ngIf="!range && orientation=='horizontal'" class="p-slider-range" [ngStyle]="{'width': handleValue + '%'}"></span>
            <span #sliderHandle *ngIf="!range" [attr.tabindex]="disabled ? null : tabindex" (keydown)="onHandleKeydown($event)" class="p-slider-handle" (mousedown)="onMouseDown($event)" (touchstart)="onTouchStart($event)" (touchmove)="onTouchMove($event)" (touchend)="onTouchEnd($event)"
                [style.transition]="dragging ? 'none': null" [ngStyle]="{'left': orientation == 'horizontal' ? handleValue + '%' : null,'bottom': orientation == 'vertical' ? handleValue + '%' : null}"
                [attr.aria-valuemin]="min" [attr.aria-valuenow]="value" [attr.aria-valuemax]="max" [attr.aria-labelledby]="ariaLabelledBy"></span>
            <span #sliderHandleStart *ngIf="range" [attr.tabindex]="disabled ? null : tabindex" (keydown)="onHandleKeydown($event,0)" (mousedown)="onMouseDown($event,0)" (touchstart)="onTouchStart($event,0)" (touchmove)="onTouchMove($event,0)" (touchend)="onTouchEnd($event)" [style.transition]="dragging ? 'none': null" class="p-slider-handle"
                [ngStyle]="{'left': rangeStartLeft, 'bottom': rangeStartBottom}" [ngClass]="{'p-slider-handle-active':handleIndex==0}"
                [attr.aria-valuemin]="min" [attr.aria-valuenow]="value ? value[0] : null" [attr.aria-valuemax]="max" [attr.aria-labelledby]="ariaLabelledBy"></span>
            <span #sliderHandleEnd *ngIf="range" [attr.tabindex]="disabled ? null : tabindex" (keydown)="onHandleKeydown($event,1)" (mousedown)="onMouseDown($event,1)" (touchstart)="onTouchStart($event,1)" (touchmove)="onTouchMove($event,1)" (touchend)="onTouchEnd($event)" [style.transition]="dragging ? 'none': null" class="p-slider-handle"
                [ngStyle]="{'left': rangeEndLeft, 'bottom': rangeEndBottom}" [ngClass]="{'p-slider-handle-active':handleIndex==1}"
                [attr.aria-valuemin]="min" [attr.aria-valuenow]="value ? value[1] : null" [attr.aria-valuemax]="max" [attr.aria-labelledby]="ariaLabelledBy"></span>
        </div>
    `, isInline: true, styles: [".p-slider{position:relative}.p-slider .p-slider-handle{position:absolute;cursor:grab;touch-action:none;display:block}.p-slider-range{position:absolute;display:block}.p-slider-horizontal .p-slider-range{top:0;left:0;height:100%}.p-slider-horizontal .p-slider-handle{top:50%}.p-slider-vertical{height:100px}.p-slider-vertical .p-slider-handle{left:50%}.p-slider-vertical .p-slider-range{bottom:0;left:0;width:100%}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Slider, decorators: [{
            type: Component,
            args: [{ selector: 'p-slider', template: `
        <div [ngStyle]="style" [class]="styleClass" [ngClass]="{'p-slider p-component':true,'p-disabled':disabled,
            'p-slider-horizontal':orientation == 'horizontal','p-slider-vertical':orientation == 'vertical','p-slider-animate':animate}"
            (click)="onBarClick($event)">
            <span *ngIf="range && orientation == 'horizontal'" class="p-slider-range" [ngStyle]="{'left':offset !== null && offset !== undefined ? offset + '%' : handleValues[0] + '%',width: diff ? diff + '%' : handleValues[1] - handleValues[0] + '%'}"></span>
            <span *ngIf="range && orientation == 'vertical'" class="p-slider-range" [ngStyle]="{'bottom':offset !== null && offset !== undefined ? offset + '%' : handleValues[0] + '%',height: diff ? diff + '%' : handleValues[1] - handleValues[0] + '%'}"></span>
            <span *ngIf="!range && orientation=='vertical'" class="p-slider-range" [ngStyle]="{'height': handleValue + '%'}"></span>
            <span *ngIf="!range && orientation=='horizontal'" class="p-slider-range" [ngStyle]="{'width': handleValue + '%'}"></span>
            <span #sliderHandle *ngIf="!range" [attr.tabindex]="disabled ? null : tabindex" (keydown)="onHandleKeydown($event)" class="p-slider-handle" (mousedown)="onMouseDown($event)" (touchstart)="onTouchStart($event)" (touchmove)="onTouchMove($event)" (touchend)="onTouchEnd($event)"
                [style.transition]="dragging ? 'none': null" [ngStyle]="{'left': orientation == 'horizontal' ? handleValue + '%' : null,'bottom': orientation == 'vertical' ? handleValue + '%' : null}"
                [attr.aria-valuemin]="min" [attr.aria-valuenow]="value" [attr.aria-valuemax]="max" [attr.aria-labelledby]="ariaLabelledBy"></span>
            <span #sliderHandleStart *ngIf="range" [attr.tabindex]="disabled ? null : tabindex" (keydown)="onHandleKeydown($event,0)" (mousedown)="onMouseDown($event,0)" (touchstart)="onTouchStart($event,0)" (touchmove)="onTouchMove($event,0)" (touchend)="onTouchEnd($event)" [style.transition]="dragging ? 'none': null" class="p-slider-handle"
                [ngStyle]="{'left': rangeStartLeft, 'bottom': rangeStartBottom}" [ngClass]="{'p-slider-handle-active':handleIndex==0}"
                [attr.aria-valuemin]="min" [attr.aria-valuenow]="value ? value[0] : null" [attr.aria-valuemax]="max" [attr.aria-labelledby]="ariaLabelledBy"></span>
            <span #sliderHandleEnd *ngIf="range" [attr.tabindex]="disabled ? null : tabindex" (keydown)="onHandleKeydown($event,1)" (mousedown)="onMouseDown($event,1)" (touchstart)="onTouchStart($event,1)" (touchmove)="onTouchMove($event,1)" (touchend)="onTouchEnd($event)" [style.transition]="dragging ? 'none': null" class="p-slider-handle"
                [ngStyle]="{'left': rangeEndLeft, 'bottom': rangeEndBottom}" [ngClass]="{'p-slider-handle-active':handleIndex==1}"
                [attr.aria-valuemin]="min" [attr.aria-valuenow]="value ? value[1] : null" [attr.aria-valuemax]="max" [attr.aria-labelledby]="ariaLabelledBy"></span>
        </div>
    `, providers: [SLIDER_VALUE_ACCESSOR], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        'class': 'p-element'
                    }, styles: [".p-slider{position:relative}.p-slider .p-slider-handle{position:absolute;cursor:grab;touch-action:none;display:block}.p-slider-range{position:absolute;display:block}.p-slider-horizontal .p-slider-range{top:0;left:0;height:100%}.p-slider-horizontal .p-slider-handle{top:50%}.p-slider-vertical{height:100px}.p-slider-vertical .p-slider-handle{left:50%}.p-slider-vertical .p-slider-range{bottom:0;left:0;width:100%}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i0.NgZone }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { animate: [{
                type: Input
            }], disabled: [{
                type: Input
            }], min: [{
                type: Input
            }], max: [{
                type: Input
            }], orientation: [{
                type: Input
            }], step: [{
                type: Input
            }], range: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], ariaLabelledBy: [{
                type: Input
            }], tabindex: [{
                type: Input
            }], onChange: [{
                type: Output
            }], onSlideEnd: [{
                type: Output
            }], sliderHandle: [{
                type: ViewChild,
                args: ["sliderHandle"]
            }], sliderHandleStart: [{
                type: ViewChild,
                args: ["sliderHandleStart"]
            }], sliderHandleEnd: [{
                type: ViewChild,
                args: ["sliderHandleEnd"]
            }] } });
export class SliderModule {
}
SliderModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: SliderModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
SliderModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.7", ngImport: i0, type: SliderModule, declarations: [Slider], imports: [CommonModule], exports: [Slider] });
SliderModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: SliderModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: SliderModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [Slider],
                    declarations: [Slider]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9jb21wb25lbnRzL3NsaWRlci9zbGlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFFBQVEsRUFBRSxTQUFTLEVBQXlCLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBc0MsU0FBUyxFQUFFLHVCQUF1QixFQUFFLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzdNLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxpQkFBaUIsRUFBdUIsTUFBTSxnQkFBZ0IsQ0FBQzs7O0FBRXZFLE1BQU0sQ0FBQyxNQUFNLHFCQUFxQixHQUFRO0lBQ3hDLE9BQU8sRUFBRSxpQkFBaUI7SUFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUM7SUFDckMsS0FBSyxFQUFFLElBQUk7Q0FDWixDQUFDO0FBK0JGLE1BQU0sT0FBTyxNQUFNO0lBNEVmLFlBQW1CLEVBQWMsRUFBUyxRQUFtQixFQUFVLE1BQWMsRUFBUyxFQUFxQjtRQUFoRyxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQVMsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUFVLFdBQU0sR0FBTixNQUFNLENBQVE7UUFBUyxPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQXRFMUcsUUFBRyxHQUFXLENBQUMsQ0FBQztRQUVoQixRQUFHLEdBQVcsR0FBRyxDQUFDO1FBRWxCLGdCQUFXLEdBQVcsWUFBWSxDQUFDO1FBWW5DLGFBQVEsR0FBVyxDQUFDLENBQUM7UUFFcEIsYUFBUSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBRWpELGVBQVUsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQWN0RCxpQkFBWSxHQUFhLEVBQUUs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QkFFQSxlQUFlO3NCQUE1QyxTQUFTO3VCQUFDLGlCQUFpQjs7QUE4Y2hDLE1BQU0sT0FBTyxZQUFZOzt5R0FBWixZQUFZOzBHQUFaLFlBQVksaUJBOWVaLE1BQU0sYUEwZUwsWUFBWSxhQTFlYixNQUFNOzBHQThlTixZQUFZLFlBSlgsWUFBWTsyRkFJYixZQUFZO2tCQUx4QixRQUFRO21CQUFDO29CQUNOLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztvQkFDdkIsT0FBTyxFQUFFLENBQUMsTUFBTSxDQUFDO29CQUNqQixZQUFZLEVBQUUsQ0FBQyxNQUFNLENBQUM7aUJBQ3pCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtOZ01vZHVsZSwgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBPbkRlc3Ryb3ksIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgZm9yd2FyZFJlZiwgUmVuZGVyZXIyLE5nWm9uZSxDaGFuZ2VEZXRlY3RvclJlZiwgVmlld0NoaWxkLCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgVmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0RvbUhhbmRsZXJ9IGZyb20gJ3ByaW1lbmcvZG9tJztcbmltcG9ydCB7TkdfVkFMVUVfQUNDRVNTT1IsIENvbnRyb2xWYWx1ZUFjY2Vzc29yfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmV4cG9ydCBjb25zdCBTTElERVJfVkFMVUVfQUNDRVNTT1I6IGFueSA9IHtcbiAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IFNsaWRlciksXG4gIG11bHRpOiB0cnVlXG59O1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3Atc2xpZGVyJyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8ZGl2IFtuZ1N0eWxlXT1cInN0eWxlXCIgW2NsYXNzXT1cInN0eWxlQ2xhc3NcIiBbbmdDbGFzc109XCJ7J3Atc2xpZGVyIHAtY29tcG9uZW50Jzp0cnVlLCdwLWRpc2FibGVkJzpkaXNhYmxlZCxcbiAgICAgICAgICAgICdwLXNsaWRlci1ob3Jpem9udGFsJzpvcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcsJ3Atc2xpZGVyLXZlcnRpY2FsJzpvcmllbnRhdGlvbiA9PSAndmVydGljYWwnLCdwLXNsaWRlci1hbmltYXRlJzphbmltYXRlfVwiXG4gICAgICAgICAgICAoY2xpY2spPVwib25CYXJDbGljaygkZXZlbnQpXCI+XG4gICAgICAgICAgICA8c3BhbiAqbmdJZj1cInJhbmdlICYmIG9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJ1wiIGNsYXNzPVwicC1zbGlkZXItcmFuZ2VcIiBbbmdTdHlsZV09XCJ7J2xlZnQnOm9mZnNldCAhPT0gbnVsbCAmJiBvZmZzZXQgIT09IHVuZGVmaW5lZCA/IG9mZnNldCArICclJyA6IGhhbmRsZVZhbHVlc1swXSArICclJyx3aWR0aDogZGlmZiA/IGRpZmYgKyAnJScgOiBoYW5kbGVWYWx1ZXNbMV0gLSBoYW5kbGVWYWx1ZXNbMF0gKyAnJSd9XCI+PC9zcGFuPlxuICAgICAgICAgICAgPHNwYW4gKm5nSWY9XCJyYW5nZSAmJiBvcmllbnRhdGlvbiA9PSAndmVydGljYWwnXCIgY2xhc3M9XCJwLXNsaWRlci1yYW5nZVwiIFtuZ1N0eWxlXT1cInsnYm90dG9tJzpvZmZzZXQgIT09IG51bGwgJiYgb2Zmc2V0ICE9PSB1bmRlZmluZWQgPyBvZmZzZXQgKyAnJScgOiBoYW5kbGVWYWx1ZXNbMF0gKyAnJScsaGVpZ2h0OiBkaWZmID8gZGlmZiArICclJyA6IGhhbmRsZVZhbHVlc1sxXSAtIGhhbmRsZVZhbHVlc1swXSArICclJ31cIj48L3NwYW4+XG4gICAgICAgICAgICA8c3BhbiAqbmdJZj1cIiFyYW5nZSAmJiBvcmllbnRhdGlvbj09J3ZlcnRpY2FsJ1wiIGNsYXNzPVwicC1zbGlkZXItcmFuZ2VcIiBbbmdTdHlsZV09XCJ7J2hlaWdodCc6IGhhbmRsZVZhbHVlICsgJyUnfVwiPjwvc3Bhbj5cbiAgICAgICAgICAgIDxzcGFuICpuZ0lmPVwiIXJhbmdlICYmIG9yaWVudGF0aW9uPT0naG9yaXpvbnRhbCdcIiBjbGFzcz1cInAtc2xpZGVyLXJhbmdlXCIgW25nU3R5bGVdPVwieyd3aWR0aCc6IGhhbmRsZVZhbHVlICsgJyUnfVwiPjwvc3Bhbj5cbiAgICAgICAgICAgIDxzcGFuICNzbGlkZXJIYW5kbGUgKm5nSWY9XCIhcmFuZ2VcIiBbYXR0ci50YWJpbmRleF09XCJkaXNhYmxlZCA/IG51bGwgOiB0YWJpbmRleFwiIChrZXlkb3duKT1cIm9uSGFuZGxlS2V5ZG93bigkZXZlbnQpXCIgY2xhc3M9XCJwLXNsaWRlci1oYW5kbGVcIiAobW91c2Vkb3duKT1cIm9uTW91c2VEb3duKCRldmVudClcIiAodG91Y2hzdGFydCk9XCJvblRvdWNoU3RhcnQoJGV2ZW50KVwiICh0b3VjaG1vdmUpPVwib25Ub3VjaE1vdmUoJGV2ZW50KVwiICh0b3VjaGVuZCk9XCJvblRvdWNoRW5kKCRldmVudClcIlxuICAgICAgICAgICAgICAgIFtzdHlsZS50cmFuc2l0aW9uXT1cImRyYWdnaW5nID8gJ25vbmUnOiBudWxsXCIgW25nU3R5bGVdPVwieydsZWZ0Jzogb3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnID8gaGFuZGxlVmFsdWUgKyAnJScgOiBudWxsLCdib3R0b20nOiBvcmllbnRhdGlvbiA9PSAndmVydGljYWwnID8gaGFuZGxlVmFsdWUgKyAnJScgOiBudWxsfVwiXG4gICAgICAgICAgICAgICAgW2F0dHIuYXJpYS12YWx1ZW1pbl09XCJtaW5cIiBbYXR0ci5hcmlhLXZhbHVlbm93XT1cInZhbHVlXCIgW2F0dHIuYXJpYS12YWx1ZW1heF09XCJtYXhcIiBbYXR0ci5hcmlhLWxhYmVsbGVkYnldPVwiYXJpYUxhYmVsbGVkQnlcIj48L3NwYW4+XG4gICAgICAgICAgICA8c3BhbiAjc2xpZGVySGFuZGxlU3RhcnQgKm5nSWY9XCJyYW5nZVwiIFthdHRyLnRhYmluZGV4XT1cImRpc2FibGVkID8gbnVsbCA6IHRhYmluZGV4XCIgKGtleWRvd24pPVwib25IYW5kbGVLZXlkb3duKCRldmVudCwwKVwiIChtb3VzZWRvd24pPVwib25Nb3VzZURvd24oJGV2ZW50LDApXCIgKHRvdWNoc3RhcnQpPVwib25Ub3VjaFN0YXJ0KCRldmVudCwwKVwiICh0b3VjaG1vdmUpPVwib25Ub3VjaE1vdmUoJGV2ZW50LDApXCIgKHRvdWNoZW5kKT1cIm9uVG91Y2hFbmQoJGV2ZW50KVwiIFtzdHlsZS50cmFuc2l0aW9uXT1cImRyYWdnaW5nID8gJ25vbmUnOiBudWxsXCIgY2xhc3M9XCJwLXNsaWRlci1oYW5kbGVcIlxuICAgICAgICAgICAgICAgIFtuZ1N0eWxlXT1cInsnbGVmdCc6IHJhbmdlU3RhcnRMZWZ0LCAnYm90dG9tJzogcmFuZ2VTdGFydEJvdHRvbX1cIiBbbmdDbGFzc109XCJ7J3Atc2xpZGVyLWhhbmRsZS1hY3RpdmUnOmhhbmRsZUluZGV4PT0wfVwiXG4gICAgICAgICAgICAgICAgW2F0dHIuYXJpYS12YWx1ZW1pbl09XCJtaW5cIiBbYXR0ci5hcmlhLXZhbHVlbm93XT1cInZhbHVlID8gdmFsdWVbMF0gOiBudWxsXCIgW2F0dHIuYXJpYS12YWx1ZW1heF09XCJtYXhcIiBbYXR0ci5hcmlhLWxhYmVsbGVkYnldPVwiYXJpYUxhYmVsbGVkQnlcIj48L3NwYW4+XG4gICAgICAgICAgICA8c3BhbiAjc2xpZGVySGFuZGxlRW5kICpuZ0lmPVwicmFuZ2VcIiBbYXR0ci50YWJpbmRleF09XCJkaXNhYmxlZCA/IG51bGwgOiB0YWJpbmRleFwiIChrZXlkb3duKT1cIm9uSGFuZGxlS2V5ZG93bigkZXZlbnQsMSlcIiAobW91c2Vkb3duKT1cIm9uTW91c2VEb3duKCRldmVudCwxKVwiICh0b3VjaHN0YXJ0KT1cIm9uVG91Y2hTdGFydCgkZXZlbnQsMSlcIiAodG91Y2htb3ZlKT1cIm9uVG91Y2hNb3ZlKCRldmVudCwxKVwiICh0b3VjaGVuZCk9XCJvblRvdWNoRW5kKCRldmVudClcIiBbc3R5bGUudHJhbnNpdGlvbl09XCJkcmFnZ2luZyA/ICdub25lJzogbnVsbFwiIGNsYXNzPVwicC1zbGlkZXItaGFuZGxlXCJcbiAgICAgICAgICAgICAgICBbbmdTdHlsZV09XCJ7J2xlZnQnOiByYW5nZUVuZExlZnQsICdib3R0b20nOiByYW5nZUVuZEJvdHRvbX1cIiBbbmdDbGFzc109XCJ7J3Atc2xpZGVyLWhhbmRsZS1hY3RpdmUnOmhhbmRsZUluZGV4PT0xfVwiXG4gICAgICAgICAgICAgICAgW2F0dHIuYXJpYS12YWx1ZW1pbl09XCJtaW5cIiBbYXR0ci5hcmlhLXZhbHVlbm93XT1cInZhbHVlID8gdmFsdWVbMV0gOiBudWxsXCIgW2F0dHIuYXJpYS12YWx1ZW1heF09XCJtYXhcIiBbYXR0ci5hcmlhLWxhYmVsbGVkYnldPVwiYXJpYUxhYmVsbGVkQnlcIj48L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuICAgIGAsXG4gICAgcHJvdmlkZXJzOiBbU0xJREVSX1ZBTFVFX0FDQ0VTU09SXSxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAgIHN0eWxlVXJsczogWycuL3NsaWRlci5jc3MnXSxcbiAgICBob3N0OiB7XG4gICAgICAgICdjbGFzcyc6ICdwLWVsZW1lbnQnXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBTbGlkZXIgaW1wbGVtZW50cyBPbkRlc3Ryb3ksQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuXG4gICAgQElucHV0KCkgYW5pbWF0ZTogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIGRpc2FibGVkOiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgbWluOiBudW1iZXIgPSAwO1xuXG4gICAgQElucHV0KCkgbWF4OiBudW1iZXIgPSAxMDA7XG5cbiAgICBASW5wdXQoKSBvcmllbnRhdGlvbjogc3RyaW5nID0gJ2hvcml6b250YWwnO1xuXG4gICAgQElucHV0KCkgc3RlcDogbnVtYmVyO1xuXG4gICAgQElucHV0KCkgcmFuZ2U6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSBzdHlsZTogYW55O1xuXG4gICAgQElucHV0KCkgc3R5bGVDbGFzczogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgYXJpYUxhYmVsbGVkQnk6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHRhYmluZGV4OiBudW1iZXIgPSAwO1xuXG4gICAgQE91dHB1dCgpIG9uQ2hhbmdlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvblNsaWRlRW5kOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBWaWV3Q2hpbGQoXCJzbGlkZXJIYW5kbGVcIikgc2xpZGVySGFuZGxlOiBFbGVtZW50UmVmO1xuXG4gICAgQFZpZXdDaGlsZChcInNsaWRlckhhbmRsZVN0YXJ0XCIpIHNsaWRlckhhbmRsZVN0YXJ0OiBFbGVtZW50UmVmO1xuXG4gICAgQFZpZXdDaGlsZChcInNsaWRlckhhbmRsZUVuZFwiKSBzbGlkZXJIYW5kbGVFbmQ6IEVsZW1lbnRSZWY7XG5cbiAgICBwdWJsaWMgdmFsdWU6IG51bWJlcjtcblxuICAgIHB1YmxpYyB2YWx1ZXM6IG51bWJlcltdO1xuXG4gICAgcHVibGljIGhhbmRsZVZhbHVlOiBudW1iZXI7XG5cbiAgICBwdWJsaWMgaGFuZGxlVmFsdWVzOiBudW1iZXJbXSA9IFtdO1xuXG4gICAgZGlmZjogbnVtYmVyO1xuXG4gICAgb2Zmc2V0OiBudW1iZXI7XG5cbiAgICBib3R0b206IG51bWJlcjtcblxuICAgIHB1YmxpYyBvbk1vZGVsQ2hhbmdlOiBGdW5jdGlvbiA9ICgpID0+IHt9O1xuXG4gICAgcHVibGljIG9uTW9kZWxUb3VjaGVkOiBGdW5jdGlvbiA9ICgpID0+IHt9O1xuXG4gICAgcHVibGljIGRyYWdnaW5nOiBib29sZWFuO1xuXG4gICAgcHVibGljIGRyYWdMaXN0ZW5lcjogYW55O1xuXG4gICAgcHVibGljIG1vdXNldXBMaXN0ZW5lcjogYW55O1xuXG4gICAgcHVibGljIGluaXRYOiBudW1iZXI7XG5cbiAgICBwdWJsaWMgaW5pdFk6IG51bWJlcjtcblxuICAgIHB1YmxpYyBiYXJXaWR0aDogbnVtYmVyO1xuXG4gICAgcHVibGljIGJhckhlaWdodDogbnVtYmVyO1xuXG4gICAgcHVibGljIHNsaWRlckhhbmRsZUNsaWNrOiBib29sZWFuO1xuXG4gICAgcHVibGljIGhhbmRsZUluZGV4OiBudW1iZXIgPSAwO1xuXG4gICAgcHVibGljIHN0YXJ0SGFuZGxlVmFsdWU6IGFueTtcblxuICAgIHB1YmxpYyBzdGFydHg6IG51bWJlcjtcblxuICAgIHB1YmxpYyBzdGFydHk6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBlbDogRWxlbWVudFJlZiwgcHVibGljIHJlbmRlcmVyOiBSZW5kZXJlcjIsIHByaXZhdGUgbmdab25lOiBOZ1pvbmUsIHB1YmxpYyBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYpIHt9XG5cbiAgICBvbk1vdXNlRG93bihldmVudCwgaW5kZXg/Om51bWJlcikge1xuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kcmFnZ2luZyA9IHRydWU7XG4gICAgICAgIHRoaXMudXBkYXRlRG9tRGF0YSgpO1xuICAgICAgICB0aGlzLnNsaWRlckhhbmRsZUNsaWNrID0gdHJ1ZTtcbiAgICAgICAgaWYgKHRoaXMucmFuZ2UgJiYgdGhpcy5oYW5kbGVWYWx1ZXMgJiYgdGhpcy5oYW5kbGVWYWx1ZXNbMF0gPT09IHRoaXMubWF4KSB7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZUluZGV4ID0gMDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlSW5kZXggPSBpbmRleDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYmluZERyYWdMaXN0ZW5lcnMoKTtcbiAgICAgICAgZXZlbnQudGFyZ2V0LmZvY3VzKCk7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgaWYgKHRoaXMuYW5pbWF0ZSkge1xuICAgICAgICAgICAgRG9tSGFuZGxlci5yZW1vdmVDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW5bMF0sICdwLXNsaWRlci1hbmltYXRlJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvblRvdWNoU3RhcnQoZXZlbnQsIGluZGV4PzpudW1iZXIpIHtcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB0b3VjaG9iaiA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdO1xuICAgICAgICB0aGlzLnN0YXJ0SGFuZGxlVmFsdWUgPSAodGhpcy5yYW5nZSkgPyB0aGlzLmhhbmRsZVZhbHVlc1tpbmRleF0gOiB0aGlzLmhhbmRsZVZhbHVlO1xuICAgICAgICB0aGlzLmRyYWdnaW5nID0gdHJ1ZTtcbiAgICAgICAgaWYgKHRoaXMucmFuZ2UgJiYgdGhpcy5oYW5kbGVWYWx1ZXMgJiYgdGhpcy5oYW5kbGVWYWx1ZXNbMF0gPT09IHRoaXMubWF4KSB7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZUluZGV4ID0gMDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlSW5kZXggPSBpbmRleDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnR4ID0gcGFyc2VJbnQodG91Y2hvYmouY2xpZW50WCwgMTApO1xuICAgICAgICAgICAgdGhpcy5iYXJXaWR0aCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5jaGlsZHJlblswXS5vZmZzZXRXaWR0aDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnR5ID0gcGFyc2VJbnQodG91Y2hvYmouY2xpZW50WSwgMTApO1xuICAgICAgICAgICAgdGhpcy5iYXJIZWlnaHQgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW5bMF0ub2Zmc2V0SGVpZ2h0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuYW5pbWF0ZSkge1xuICAgICAgICAgICAgRG9tSGFuZGxlci5yZW1vdmVDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW5bMF0sICdwLXNsaWRlci1hbmltYXRlJyk7XG4gICAgICAgIH1cblxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIG9uVG91Y2hNb3ZlKGV2ZW50LCBpbmRleD86bnVtYmVyKSB7XG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdG91Y2hvYmogPSBldmVudC5jaGFuZ2VkVG91Y2hlc1swXSxcbiAgICAgICAgaGFuZGxlVmFsdWUgPSAwO1xuXG4gICAgICAgIGlmICh0aGlzLm9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgICAgICAgIGhhbmRsZVZhbHVlID0gTWF0aC5mbG9vcigoKHBhcnNlSW50KHRvdWNob2JqLmNsaWVudFgsIDEwKSAtIHRoaXMuc3RhcnR4KSAqIDEwMCkgLyAodGhpcy5iYXJXaWR0aCkpICsgdGhpcy5zdGFydEhhbmRsZVZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaGFuZGxlVmFsdWUgPSBNYXRoLmZsb29yKCgodGhpcy5zdGFydHkgLSBwYXJzZUludCh0b3VjaG9iai5jbGllbnRZLCAxMCkpICogMTAwKSAvICh0aGlzLmJhckhlaWdodCkpICArIHRoaXMuc3RhcnRIYW5kbGVWYWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0VmFsdWVGcm9tSGFuZGxlKGV2ZW50LCBoYW5kbGVWYWx1ZSk7XG5cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICBvblRvdWNoRW5kKGV2ZW50LCBpbmRleD86bnVtYmVyKSB7XG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKHRoaXMucmFuZ2UpXG4gICAgICAgICAgICB0aGlzLm9uU2xpZGVFbmQuZW1pdCh7b3JpZ2luYWxFdmVudDogZXZlbnQsIHZhbHVlczogdGhpcy52YWx1ZXN9KTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhpcy5vblNsaWRlRW5kLmVtaXQoe29yaWdpbmFsRXZlbnQ6IGV2ZW50LCB2YWx1ZTogdGhpcy52YWx1ZX0pO1xuXG4gICAgICAgIGlmICh0aGlzLmFuaW1hdGUpIHtcbiAgICAgICAgICAgIERvbUhhbmRsZXIuYWRkQ2xhc3ModGhpcy5lbC5uYXRpdmVFbGVtZW50LmNoaWxkcmVuWzBdLCAncC1zbGlkZXItYW5pbWF0ZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICBvbkJhckNsaWNrKGV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuc2xpZGVySGFuZGxlQ2xpY2spIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlRG9tRGF0YSgpO1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVDaGFuZ2UoZXZlbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zbGlkZXJIYW5kbGVDbGljayA9IGZhbHNlO1xuICAgIH1cblxuICAgIG9uSGFuZGxlS2V5ZG93bihldmVudCwgaGFuZGxlSW5kZXg/Om51bWJlcikge1xuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChldmVudC53aGljaCA9PSAzOCB8fCBldmVudC53aGljaCA9PSAzOSkge1xuICAgICAgICAgICAgdGhpcy5zcGluKGV2ZW50LCAxLCBoYW5kbGVJbmRleCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZXZlbnQud2hpY2ggPT0gMzcgfHwgZXZlbnQud2hpY2ggPT0gNDApIHtcbiAgICAgICAgICAgIHRoaXMuc3BpbihldmVudCwgLTEsIGhhbmRsZUluZGV4KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNwaW4oZXZlbnQsIGRpcjogbnVtYmVyLCBoYW5kbGVJbmRleD86bnVtYmVyKSB7XG4gICAgICAgIGxldCBzdGVwID0gKHRoaXMuc3RlcCB8fCAxKSAqIGRpcjtcblxuICAgICAgICBpZiAodGhpcy5yYW5nZSkge1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVJbmRleCA9IGhhbmRsZUluZGV4O1xuICAgICAgICAgICAgdGhpcy51cGRhdGVWYWx1ZSh0aGlzLnZhbHVlc1t0aGlzLmhhbmRsZUluZGV4XSArIHN0ZXApO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVIYW5kbGVWYWx1ZSgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVWYWx1ZSh0aGlzLnZhbHVlICsgc3RlcCk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUhhbmRsZVZhbHVlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIGhhbmRsZUNoYW5nZShldmVudDogRXZlbnQpIHtcbiAgICAgICAgbGV0IGhhbmRsZVZhbHVlID0gdGhpcy5jYWxjdWxhdGVIYW5kbGVWYWx1ZShldmVudCk7XG4gICAgICAgIHRoaXMuc2V0VmFsdWVGcm9tSGFuZGxlKGV2ZW50LCBoYW5kbGVWYWx1ZSk7XG4gICAgfVxuXG4gICAgYmluZERyYWdMaXN0ZW5lcnMoKSB7XG4gICAgICAgIHRoaXMubmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGRvY3VtZW50VGFyZ2V0OiBhbnkgPSB0aGlzLmVsID8gdGhpcy5lbC5uYXRpdmVFbGVtZW50Lm93bmVyRG9jdW1lbnQgOiAnZG9jdW1lbnQnO1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMuZHJhZ0xpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnTGlzdGVuZXIgPSB0aGlzLnJlbmRlcmVyLmxpc3Rlbihkb2N1bWVudFRhcmdldCwgJ21vdXNlbW92ZScsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kcmFnZ2luZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZ1pvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZUNoYW5nZShldmVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXRoaXMubW91c2V1cExpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tb3VzZXVwTGlzdGVuZXIgPSB0aGlzLnJlbmRlcmVyLmxpc3Rlbihkb2N1bWVudFRhcmdldCwgJ21vdXNldXAnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZHJhZ2dpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmdab25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucmFuZ2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25TbGlkZUVuZC5lbWl0KHtvcmlnaW5hbEV2ZW50OiBldmVudCwgdmFsdWVzOiB0aGlzLnZhbHVlc30pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vblNsaWRlRW5kLmVtaXQoe29yaWdpbmFsRXZlbnQ6IGV2ZW50LCB2YWx1ZTogdGhpcy52YWx1ZX0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuYW5pbWF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEb21IYW5kbGVyLmFkZENsYXNzKHRoaXMuZWwubmF0aXZlRWxlbWVudC5jaGlsZHJlblswXSwgJ3Atc2xpZGVyLWFuaW1hdGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB1bmJpbmREcmFnTGlzdGVuZXJzKCkge1xuICAgICAgICBpZiAodGhpcy5kcmFnTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZHJhZ0xpc3RlbmVyKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5tb3VzZXVwTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMubW91c2V1cExpc3RlbmVyKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRWYWx1ZUZyb21IYW5kbGUoZXZlbnQ6IEV2ZW50LCBoYW5kbGVWYWx1ZTogYW55KSB7XG4gICAgICAgIHRoaXMuc2xpZGVySGFuZGxlQ2xpY2sgPSBmYWxzZTtcbiAgICAgICAgbGV0IG5ld1ZhbHVlID0gdGhpcy5nZXRWYWx1ZUZyb21IYW5kbGUoaGFuZGxlVmFsdWUpO1xuXG4gICAgICAgIGlmICh0aGlzLnJhbmdlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zdGVwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVTdGVwQ2hhbmdlKG5ld1ZhbHVlLCB0aGlzLnZhbHVlc1t0aGlzLmhhbmRsZUluZGV4XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVZhbHVlc1t0aGlzLmhhbmRsZUluZGV4XSA9IGhhbmRsZVZhbHVlO1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlVmFsdWUobmV3VmFsdWUsIGV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnN0ZXApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVN0ZXBDaGFuZ2UobmV3VmFsdWUsIHRoaXMudmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVWYWx1ZSA9IGhhbmRsZVZhbHVlO1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlVmFsdWUobmV3VmFsdWUsIGV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuXG4gICAgaGFuZGxlU3RlcENoYW5nZShuZXdWYWx1ZTogbnVtYmVyLCBvbGRWYWx1ZTogbnVtYmVyKSB7XG4gICAgICAgIGxldCBkaWZmID0gKG5ld1ZhbHVlIC0gb2xkVmFsdWUpO1xuICAgICAgICBsZXQgdmFsID0gb2xkVmFsdWU7XG5cbiAgICAgICAgaWYgKGRpZmYgPCAwKSB7XG4gICAgICAgICAgICB2YWwgPSBvbGRWYWx1ZSArIE1hdGguY2VpbChuZXdWYWx1ZSAvIHRoaXMuc3RlcCAtIG9sZFZhbHVlIC8gdGhpcy5zdGVwKSAqIHRoaXMuc3RlcDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkaWZmID4gMCkge1xuICAgICAgICAgICAgdmFsID0gb2xkVmFsdWUgKyBNYXRoLmZsb29yKG5ld1ZhbHVlIC8gdGhpcy5zdGVwIC0gb2xkVmFsdWUgLyB0aGlzLnN0ZXApICogdGhpcy5zdGVwO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy51cGRhdGVWYWx1ZSh2YWwpO1xuICAgICAgICB0aGlzLnVwZGF0ZUhhbmRsZVZhbHVlKCk7XG4gICAgfVxuXG4gICAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KSA6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5yYW5nZSlcbiAgICAgICAgICAgIHRoaXMudmFsdWVzID0gdmFsdWV8fFswLDBdO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWV8fDA7XG5cbiAgICAgICAgdGhpcy51cGRhdGVIYW5kbGVWYWx1ZSgpO1xuICAgICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cblxuICAgIHJlZ2lzdGVyT25DaGFuZ2UoZm46IEZ1bmN0aW9uKTogdm9pZCB7XG4gICAgICAgIHRoaXMub25Nb2RlbENoYW5nZSA9IGZuO1xuICAgIH1cblxuICAgIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBGdW5jdGlvbik6IHZvaWQge1xuICAgICAgICB0aGlzLm9uTW9kZWxUb3VjaGVkID0gZm47XG4gICAgfVxuXG4gICAgc2V0RGlzYWJsZWRTdGF0ZSh2YWw6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlZCA9IHZhbDtcbiAgICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG5cbiAgICBnZXQgcmFuZ2VTdGFydExlZnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzVmVydGljYWwoKSA/IG51bGwgOiB0aGlzLmhhbmRsZVZhbHVlc1swXSArICclJztcbiAgICB9XG5cbiAgICBnZXQgcmFuZ2VTdGFydEJvdHRvbSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNWZXJ0aWNhbCgpID8gdGhpcy5oYW5kbGVWYWx1ZXNbMF0gKyAnJScgOiAnYXV0byc7XG4gICAgfVxuXG4gICAgZ2V0IHJhbmdlRW5kTGVmdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNWZXJ0aWNhbCgpID8gbnVsbCA6IHRoaXMuaGFuZGxlVmFsdWVzWzFdICsgJyUnO1xuICAgIH1cblxuICAgIGdldCByYW5nZUVuZEJvdHRvbSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNWZXJ0aWNhbCgpID8gdGhpcy5oYW5kbGVWYWx1ZXNbMV0gKyAnJScgOiAnYXV0byc7XG4gICAgfVxuXG4gICAgaXNWZXJ0aWNhbCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCc7XG4gICAgfVxuXG4gICAgdXBkYXRlRG9tRGF0YSgpOiB2b2lkIHtcbiAgICAgICAgbGV0IHJlY3QgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW5bMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHRoaXMuaW5pdFggPSByZWN0LmxlZnQgKyBEb21IYW5kbGVyLmdldFdpbmRvd1Njcm9sbExlZnQoKTtcbiAgICAgICAgdGhpcy5pbml0WSA9IHJlY3QudG9wICsgRG9tSGFuZGxlci5nZXRXaW5kb3dTY3JvbGxUb3AoKTtcbiAgICAgICAgdGhpcy5iYXJXaWR0aCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5jaGlsZHJlblswXS5vZmZzZXRXaWR0aDtcbiAgICAgICAgdGhpcy5iYXJIZWlnaHQgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW5bMF0ub2Zmc2V0SGVpZ2h0O1xuICAgIH1cblxuICAgIGNhbGN1bGF0ZUhhbmRsZVZhbHVlKGV2ZW50KTogbnVtYmVyIHtcbiAgICAgICAgaWYgKHRoaXMub3JpZW50YXRpb24gPT09ICdob3Jpem9udGFsJylcbiAgICAgICAgICAgIHJldHVybiAoKGV2ZW50LnBhZ2VYIC0gdGhpcy5pbml0WCkgKiAxMDApIC8gKHRoaXMuYmFyV2lkdGgpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4oKCh0aGlzLmluaXRZICsgdGhpcy5iYXJIZWlnaHQpIC0gZXZlbnQucGFnZVkpICogMTAwKSAvICh0aGlzLmJhckhlaWdodCk7XG4gICAgfVxuXG4gICAgdXBkYXRlSGFuZGxlVmFsdWUoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnJhbmdlKSB7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZVZhbHVlc1swXSA9ICh0aGlzLnZhbHVlc1swXSA8IHRoaXMubWluID8gMCA6IHRoaXMudmFsdWVzWzBdIC0gdGhpcy5taW4pICogMTAwIC8gKHRoaXMubWF4IC0gdGhpcy5taW4pO1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVWYWx1ZXNbMV0gPSAodGhpcy52YWx1ZXNbMV0gPiB0aGlzLm1heCA/IDEwMCA6IHRoaXMudmFsdWVzWzFdIC0gdGhpcy5taW4pICogMTAwIC8gKHRoaXMubWF4IC0gdGhpcy5taW4pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMudmFsdWUgPCB0aGlzLm1pbilcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVZhbHVlID0gMDtcbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMudmFsdWUgPiB0aGlzLm1heClcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVZhbHVlID0gMTAwO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlVmFsdWUgPSAodGhpcy52YWx1ZSAtIHRoaXMubWluKSAqIDEwMCAvICh0aGlzLm1heCAtIHRoaXMubWluKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHRoaXMuc3RlcCkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVEaWZmQW5kT2Zmc2V0KClcbiAgICAgICAgfSAgXG4gICAgfVxuXG4gICAgdXBkYXRlRGlmZkFuZE9mZnNldCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5kaWZmID0gdGhpcy5nZXREaWZmKClcbiAgICAgICAgdGhpcy5vZmZzZXQgPSB0aGlzLmdldE9mZnNldCgpXG4gICAgfVxuXG4gICAgZ2V0RGlmZigpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gTWF0aC5hYnModGhpcy5oYW5kbGVWYWx1ZXNbMF0gLSB0aGlzLmhhbmRsZVZhbHVlc1sxXSk7XG4gICAgfVxuXG4gICAgZ2V0T2Zmc2V0KCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBNYXRoLm1pbih0aGlzLmhhbmRsZVZhbHVlc1swXSwgdGhpcy5oYW5kbGVWYWx1ZXNbMV0pO1xuICAgIH1cblxuICAgIHVwZGF0ZVZhbHVlKHZhbDogbnVtYmVyLCBldmVudD86IEV2ZW50KTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnJhbmdlKSB7XG4gICAgICAgICAgICBsZXQgdmFsdWUgPSB2YWw7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmhhbmRsZUluZGV4ID09IDApIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPCB0aGlzLm1pbikge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMubWluO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVZhbHVlc1swXSA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHZhbHVlID4gdGhpcy52YWx1ZXNbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmKHZhbHVlID4gdGhpcy5tYXgpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB0aGlzLm1heDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlVmFsdWVzWzBdID0gMTAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlVmFsdWVzWzBdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVySGFuZGxlU3RhcnQubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlID4gdGhpcy5tYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB0aGlzLm1heDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVWYWx1ZXNbMV0gPSAxMDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub2Zmc2V0ID0gdGhpcy5oYW5kbGVWYWx1ZXNbMV07XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlIDwgdGhpcy5taW4pIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB0aGlzLm1pbjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVWYWx1ZXNbMV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodmFsdWUgPCB0aGlzLnZhbHVlc1swXSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9mZnNldCA9IHRoaXMuaGFuZGxlVmFsdWVzWzFdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnNsaWRlckhhbmRsZUVuZC5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKHRoaXMuc3RlcCkge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlSGFuZGxlVmFsdWUoKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZURpZmZBbmRPZmZzZXQoKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnZhbHVlc1t0aGlzLmhhbmRsZUluZGV4XSA9IHRoaXMuZ2V0Tm9ybWFsaXplZFZhbHVlKHZhbHVlKTtcbiAgICAgICAgICAgIGxldCBuZXdWYWx1ZXMgPSBbdGhpcy5taW5WYWwsIHRoaXMubWF4VmFsXTtcbiAgICAgICAgICAgIHRoaXMub25Nb2RlbENoYW5nZShuZXdWYWx1ZXMpO1xuICAgICAgICAgICAgdGhpcy5vbkNoYW5nZS5lbWl0KHtldmVudDogZXZlbnQsIHZhbHVlczogdGhpcy52YWx1ZXN9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmICh2YWwgPCB0aGlzLm1pbikge1xuICAgICAgICAgICAgICAgIHZhbCA9IHRoaXMubWluO1xuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlVmFsdWUgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodmFsID4gdGhpcy5tYXgpIHtcbiAgICAgICAgICAgICAgICB2YWwgPSB0aGlzLm1heDtcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVZhbHVlID0gMTAwO1xuICAgICAgICAgICAgfVxuXG5cdFx0XHR0aGlzLnZhbHVlID0gdGhpcy5nZXROb3JtYWxpemVkVmFsdWUodmFsKTtcblxuICAgICAgICAgICAgdGhpcy5vbk1vZGVsQ2hhbmdlKHRoaXMudmFsdWUpO1xuICAgICAgICAgICAgdGhpcy5vbkNoYW5nZS5lbWl0KHtldmVudDogZXZlbnQsIHZhbHVlOiB0aGlzLnZhbHVlfSk7XG4gICAgICAgICAgICB0aGlzLnNsaWRlckhhbmRsZS5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRWYWx1ZUZyb21IYW5kbGUoaGFuZGxlVmFsdWU6IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgIHJldHVybiAodGhpcy5tYXggLSB0aGlzLm1pbikgKiAoaGFuZGxlVmFsdWUgLyAxMDApICsgdGhpcy5taW47XG4gICAgfVxuXG5cdGdldERlY2ltYWxzQ291bnQodmFsdWU6IG51bWJlcik6IG51bWJlciB7XG5cdFx0aWYgKHZhbHVlICYmIE1hdGguZmxvb3IodmFsdWUpICE9PSB2YWx1ZSlcblx0XHRcdHJldHVybiB2YWx1ZS50b1N0cmluZygpLnNwbGl0KFwiLlwiKVsxXS5sZW5ndGggfHwgMDtcblx0XHRyZXR1cm4gMDtcblx0fVxuXG5cdGdldE5vcm1hbGl6ZWRWYWx1ZSh2YWw6IG51bWJlcik6IG51bWJlciB7XG5cdFx0bGV0IGRlY2ltYWxzQ291bnQgPSB0aGlzLmdldERlY2ltYWxzQ291bnQodGhpcy5zdGVwKTtcblx0XHRpZiAoZGVjaW1hbHNDb3VudCA+IDApIHtcblx0XHRcdHJldHVybiArcGFyc2VGbG9hdCh2YWwudG9TdHJpbmcoKSkudG9GaXhlZChkZWNpbWFsc0NvdW50KTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRyZXR1cm4gTWF0aC5mbG9vcih2YWwpO1xuXHRcdH1cblx0fVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMudW5iaW5kRHJhZ0xpc3RlbmVycygpO1xuICAgIH1cblxuICAgIGdldCBtaW5WYWwgKCkge1xuICAgICAgICByZXR1cm4gTWF0aC5taW4odGhpcy52YWx1ZXNbMV0sIHRoaXMudmFsdWVzWzBdKTtcbiAgICB9XG4gICAgZ2V0IG1heFZhbCAoKSB7XG4gICAgICAgIHJldHVybiBNYXRoLm1heCh0aGlzLnZhbHVlc1sxXSwgdGhpcy52YWx1ZXNbMF0pO1xuICAgIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbU2xpZGVyXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtTbGlkZXJdXG59KVxuZXhwb3J0IGNsYXNzIFNsaWRlck1vZHVsZSB7IH1cbiJdfQ==