import { NgModule, Component, Input, Output, EventEmitter, forwardRef, ViewChild, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export const SPINNER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Spinner),
    multi: true
};
export class Spinner {
    constructor(el, cd) {
        this.el = el;
        this.cd = cd;
        this.onChange = new EventEmitter();
        this.onFocus = new EventEmitter();
        this.onBlur = new EventEmitter();
        this._step = 1;
        this.onModelChange = () => { };
        this.onModelTouched = () => { };
        this.keyPattern = /[0-9\+\-]/;
        this.negativeSeparator = '-';
    }
    get step() {
        return this._step;
    }
    set step(val) {
        this._step = val;
        if (this._step != null) {
            let tokens = this.step.toString().split(/[,]|[.]/);
            this.calculatedPrecision = tokens[1] ? tokens[1].length : undefined;
        }
    }
    ngOnInit() {
        if (this.formatInput) {
            this.localeDecimalSeparator = (1.1).toLocaleString().substring(1, 2);
            this.localeThousandSeparator = (1000).toLocaleString().substring(1, 2);
            this.thousandRegExp = new RegExp(`[${this.thousandSeparator || this.localeThousandSeparator}]`, 'gim');
            if (this.decimalSeparator && this.thousandSeparator && this.decimalSeparator === this.thousandSeparator) {
                console.warn("thousandSeparator and decimalSeparator cannot have the same value.");
            }
        }
    }
    repeat(event, interval, dir) {
        let i = interval || 500;
        this.clearTimer();
        this.timer = setTimeout(() => {
            this.repeat(event, 40, dir);
        }, i);
        this.spin(event, dir);
    }
    spin(event, dir) {
        let step = this.step * dir;
        let currentValue;
        let precision = this.getPrecision();
        if (this.value)
            currentValue = (typeof this.value === 'string') ? this.parseValue(this.value) : this.value;
        else
            currentValue = 0;
        if (precision)
            this.value = parseFloat(this.toFixed(currentValue + step, precision));
        else
            this.value = currentValue + step;
        if (this.maxlength !== undefined && this.value.toString().length > this.maxlength) {
            this.value = currentValue;
        }
        if (this.min !== undefined && this.value < this.min) {
            this.value = this.min;
        }
        if (this.max !== undefined && this.value > this.max) {
            this.value = this.max;
        }
        this.formatValue();
        this.onModelChange(this.value);
        this.onChange.emit(event);
    }
    getPrecision() {
        return this.precision === undefined ? this.calculatedPrecision : this.precision;
    }
    toFixed(value, precision) {
        let power = Math.pow(10, precision || 0);
        return String(Math.round(value * power) / power);
    }
    onUpButtonMousedown(event) {
        if (!this.disabled) {
            this.inputfieldViewChild.nativeElement.focus();
            this.repeat(event, null, 1);
            this.updateFilledState();
            event.preventDefault();
        }
    }
    onUpButtonMouseup(event) {
        if (!this.disabled) {
            this.clearTimer();
        }
    }
    onUpButtonMouseleave(event) {
        if (!this.disabled) {
            this.clearTimer();
        }
    }
    onDownButtonMousedown(event) {
        if (!this.disabled) {
            this.inputfieldViewChild.nativeElement.focus();
            this.repeat(event, null, -1);
            this.updateFilledState();
            event.preventDefault();
        }
    }
    onDownButtonMouseup(event) {
        if (!this.disabled) {
            this.clearTimer();
        }
    }
    onDownButtonMouseleave(event) {
        if (!this.disabled) {
            this.clearTimer();
        }
    }
    onInputKeydown(event) {
        if (event.which == 38) {
            this.spin(event, 1);
            event.preventDefault();
        }
        else if (event.which == 40) {
            this.spin(event, -1);
            event.preventDefault();
        }
    }
    onInputChange(event) {
        this.onChange.emit(event);
    }
    onInput(event) {
        this.value = this.parseValue(event.target.value);
        this.onModelChange(this.value);
        this.updateFilledState();
    }
    onInputBlur(event) {
        this.focus = false;
        this.formatValue();
        this.onModelTouched();
        this.onBlur.emit(event);
    }
    onInputFocus(event) {
        this.focus = true;
        this.onFocus.emit(event);
    }
    parseValue(val) {
        let value;
        let precision = this.getPrecision();
        if (val.trim() === '') {
            value = null;
        }
        else {
            if (this.formatInput) {
                val = val.replace(this.thousandRegExp, '');
            }
            if (precision) {
                val = this.formatInput ? val.replace(this.decimalSeparator || this.localeDecimalSeparator, '.') : val.replace(',', '.');
                value = parseFloat(val);
            }
            else {
                value = parseInt(val, 10);
            }
            if (!isNaN(value)) {
                if (this.max !== null && value > this.max) {
                    value = this.max;
                }
                if (this.min !== null && value < this.min) {
                    value = this.min;
                }
            }
            else {
                value = null;
            }
        }
        return value;
    }
    formatValue() {
        let value = this.value;
        let precision = this.getPrecision();
        if (value != null) {
            if (this.formatInput) {
                value = value.toLocaleString(undefined, { maximumFractionDigits: 20 });
                if (this.decimalSeparator && this.thousandSeparator) {
                    value = value.split(this.localeDecimalSeparator);
                    if (precision && value[1]) {
                        value[1] = (this.decimalSeparator || this.localeDecimalSeparator) + value[1];
                    }
                    if (this.thousandSeparator && value[0].length > 3) {
                        value[0] = value[0].replace(new RegExp(`[${this.localeThousandSeparator}]`, 'gim'), this.thousandSeparator);
                    }
                    value = value.join('');
                }
            }
            this.formattedValue = value.toString();
        }
        else {
            this.formattedValue = null;
        }
        if (this.inputfieldViewChild && this.inputfieldViewChild.nativeElement) {
            this.inputfieldViewChild.nativeElement.value = this.formattedValue;
        }
    }
    clearTimer() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
    writeValue(value) {
        this.value = value;
        this.formatValue();
        this.updateFilledState();
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
    updateFilledState() {
        this.filled = (this.value !== undefined && this.value != null);
    }
}
Spinner.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Spinner, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
Spinner.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.7", type: Spinner, selector: "p-spinner", inputs: { min: "min", max: "max", maxlength: "maxlength", size: "size", placeholder: "placeholder", inputId: "inputId", disabled: "disabled", readonly: "readonly", tabindex: "tabindex", required: "required", name: "name", ariaLabelledBy: "ariaLabelledBy", inputStyle: "inputStyle", inputStyleClass: "inputStyleClass", formatInput: "formatInput", decimalSeparator: "decimalSeparator", thousandSeparator: "thousandSeparator", precision: "precision", step: "step" }, outputs: { onChange: "onChange", onFocus: "onFocus", onBlur: "onBlur" }, host: { properties: { "class.ui-inputwrapper-filled": "filled", "class.ui-inputwrapper-focus": "focus" }, classAttribute: "p-element" }, providers: [SPINNER_VALUE_ACCESSOR], viewQueries: [{ propertyName: "inputfieldViewChild", first: true, predicate: ["inputfield"], descendants: true }], ngImport: i0, template: `
        <span class="ui-spinner ui-widget ui-corner-all">
            <input #inputfield type="text" [attr.id]="inputId" [value]="formattedValue||null" [attr.name]="name" [attr.aria-valumin]="min" [attr.aria-valuemax]="max" [attr.aria-valuenow]="value" [attr.aria-labelledby]="ariaLabelledBy"
            [attr.size]="size" [attr.maxlength]="maxlength" [attr.tabindex]="tabindex" [attr.placeholder]="placeholder" [disabled]="disabled" [readonly]="readonly" [attr.required]="required"
            (keydown)="onInputKeydown($event)" (blur)="onInputBlur($event)" (input)="onInput($event)" (change)="onInputChange($event)" (focus)="onInputFocus($event)"
            [ngStyle]="inputStyle" [class]="inputStyleClass" [ngClass]="'ui-spinner-input ui-inputtext ui-widget ui-state-default ui-corner-all'">
            <button type="button" [ngClass]="{'ui-spinner-button ui-spinner-up ui-corner-tr ui-button ui-widget ui-state-default':true,'ui-state-disabled':disabled}" [disabled]="disabled||readonly" tabindex="-1" [attr.readonly]="readonly"
                (mouseleave)="onUpButtonMouseleave($event)" (mousedown)="onUpButtonMousedown($event)" (mouseup)="onUpButtonMouseup($event)">
                <span class="ui-spinner-button-icon pi pi-caret-up ui-clickable"></span>
            </button>
            <button type="button" [ngClass]="{'ui-spinner-button ui-spinner-down ui-corner-br ui-button ui-widget ui-state-default':true,'ui-state-disabled':disabled}" [disabled]="disabled||readonly" tabindex="-1" [attr.readonly]="readonly"
                (mouseleave)="onDownButtonMouseleave($event)" (mousedown)="onDownButtonMousedown($event)" (mouseup)="onDownButtonMouseup($event)">
                <span class="ui-spinner-button-icon pi pi-caret-down ui-clickable"></span>
            </button>
        </span>
    `, isInline: true, styles: [".ui-spinner{display:inline-block;overflow:visible;padding:0;position:relative;vertical-align:middle}.ui-spinner-input{vertical-align:middle;padding-right:1.5em}.ui-spinner-button{cursor:default;display:block;height:50%;margin:0;overflow:hidden;padding:0;position:absolute;right:0;text-align:center;vertical-align:middle;width:1.5em}.ui-spinner .ui-spinner-button-icon{position:absolute;top:50%;left:50%;margin-top:-.5em;margin-left:-.5em;width:1em}.ui-spinner-up{top:0}.ui-spinner-down{bottom:0}.ui-fluid .ui-spinner{width:100%}.ui-fluid .ui-spinner .ui-spinner-input{padding-right:2em;width:100%}.ui-fluid .ui-spinner .ui-spinner-button{width:1.5em}.ui-fluid .ui-spinner .ui-spinner-button .ui-spinner-button-icon{left:.7em}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Spinner, decorators: [{
            type: Component,
            args: [{ selector: 'p-spinner', template: `
        <span class="ui-spinner ui-widget ui-corner-all">
            <input #inputfield type="text" [attr.id]="inputId" [value]="formattedValue||null" [attr.name]="name" [attr.aria-valumin]="min" [attr.aria-valuemax]="max" [attr.aria-valuenow]="value" [attr.aria-labelledby]="ariaLabelledBy"
            [attr.size]="size" [attr.maxlength]="maxlength" [attr.tabindex]="tabindex" [attr.placeholder]="placeholder" [disabled]="disabled" [readonly]="readonly" [attr.required]="required"
            (keydown)="onInputKeydown($event)" (blur)="onInputBlur($event)" (input)="onInput($event)" (change)="onInputChange($event)" (focus)="onInputFocus($event)"
            [ngStyle]="inputStyle" [class]="inputStyleClass" [ngClass]="'ui-spinner-input ui-inputtext ui-widget ui-state-default ui-corner-all'">
            <button type="button" [ngClass]="{'ui-spinner-button ui-spinner-up ui-corner-tr ui-button ui-widget ui-state-default':true,'ui-state-disabled':disabled}" [disabled]="disabled||readonly" tabindex="-1" [attr.readonly]="readonly"
                (mouseleave)="onUpButtonMouseleave($event)" (mousedown)="onUpButtonMousedown($event)" (mouseup)="onUpButtonMouseup($event)">
                <span class="ui-spinner-button-icon pi pi-caret-up ui-clickable"></span>
            </button>
            <button type="button" [ngClass]="{'ui-spinner-button ui-spinner-down ui-corner-br ui-button ui-widget ui-state-default':true,'ui-state-disabled':disabled}" [disabled]="disabled||readonly" tabindex="-1" [attr.readonly]="readonly"
                (mouseleave)="onDownButtonMouseleave($event)" (mousedown)="onDownButtonMousedown($event)" (mouseup)="onDownButtonMouseup($event)">
                <span class="ui-spinner-button-icon pi pi-caret-down ui-clickable"></span>
            </button>
        </span>
    `, host: {
                        'class': 'p-element',
                        '[class.ui-inputwrapper-filled]': 'filled',
                        '[class.ui-inputwrapper-focus]': 'focus'
                    }, providers: [SPINNER_VALUE_ACCESSOR], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, styles: [".ui-spinner{display:inline-block;overflow:visible;padding:0;position:relative;vertical-align:middle}.ui-spinner-input{vertical-align:middle;padding-right:1.5em}.ui-spinner-button{cursor:default;display:block;height:50%;margin:0;overflow:hidden;padding:0;position:absolute;right:0;text-align:center;vertical-align:middle;width:1.5em}.ui-spinner .ui-spinner-button-icon{position:absolute;top:50%;left:50%;margin-top:-.5em;margin-left:-.5em;width:1em}.ui-spinner-up{top:0}.ui-spinner-down{bottom:0}.ui-fluid .ui-spinner{width:100%}.ui-fluid .ui-spinner .ui-spinner-input{padding-right:2em;width:100%}.ui-fluid .ui-spinner .ui-spinner-button{width:1.5em}.ui-fluid .ui-spinner .ui-spinner-button .ui-spinner-button-icon{left:.7em}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { onChange: [{
                type: Output
            }], onFocus: [{
                type: Output
            }], onBlur: [{
                type: Output
            }], min: [{
                type: Input
            }], max: [{
                type: Input
            }], maxlength: [{
                type: Input
            }], size: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], inputId: [{
                type: Input
            }], disabled: [{
                type: Input
            }], readonly: [{
                type: Input
            }], tabindex: [{
                type: Input
            }], required: [{
                type: Input
            }], name: [{
                type: Input
            }], ariaLabelledBy: [{
                type: Input
            }], inputStyle: [{
                type: Input
            }], inputStyleClass: [{
                type: Input
            }], formatInput: [{
                type: Input
            }], decimalSeparator: [{
                type: Input
            }], thousandSeparator: [{
                type: Input
            }], precision: [{
                type: Input
            }], inputfieldViewChild: [{
                type: ViewChild,
                args: ['inputfield']
            }], step: [{
                type: Input
            }] } });
export class SpinnerModule {
}
SpinnerModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: SpinnerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
SpinnerModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.7", ngImport: i0, type: SpinnerModule, declarations: [Spinner], imports: [CommonModule, InputTextModule], exports: [Spinner] });
SpinnerModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: SpinnerModule, imports: [CommonModule, InputTextModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: SpinnerModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, InputTextModule],
                    exports: [Spinner],
                    declarations: [Spinner]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Bpbm5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy9zcGlubmVyL3NwaW5uZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQW1CLEtBQUssRUFBQyxNQUFNLEVBQUMsWUFBWSxFQUFDLFVBQVUsRUFBQyxTQUFTLEVBQW1CLHVCQUF1QixFQUFFLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQy9LLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDbEQsT0FBTyxFQUFDLGlCQUFpQixFQUF1QixNQUFNLGdCQUFnQixDQUFDOzs7QUFFdkUsTUFBTSxDQUFDLE1BQU0sc0JBQXNCLEdBQVE7SUFDdkMsT0FBTyxFQUFFLGlCQUFpQjtJQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQztJQUN0QyxLQUFLLEVBQUUsSUFBSTtDQUNkLENBQUM7QUE4QkYsTUFBTSxPQUFPLE9BQU87SUFzRmhCLFlBQW1CLEVBQWMsRUFBUyxFQUFxQjtRQUE1QyxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQVMsT0FBRSxHQUFGLEVBQUUsQ0FBbUI7UUFwRnJELGFBQVEsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUVqRCxZQUFPLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFFaEQsV0FBTSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBd0N6RCxVQUFLLEdBQVcsQ0FBQyxDQUFDO1FBSWxCLGtCQUFhLEdBQWEsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDO1FBRW5DLG1CQUFjLEdBQWEsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDO1FBRXBDLGVBQVUsR0FBVyxXQUFXLENBQUM7UUFRMUIsc0JBQWlCLEdBQUcs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QztvQkFDbEIsWUFBWSxFQUFFLENBQUMsT0FBTyxDQUFDO2lCQUMxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TmdNb2R1bGUsQ29tcG9uZW50LEVsZW1lbnRSZWYsT25Jbml0LElucHV0LE91dHB1dCxFdmVudEVtaXR0ZXIsZm9yd2FyZFJlZixWaWV3Q2hpbGQsQ2hhbmdlRGV0ZWN0b3JSZWYsQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtJbnB1dFRleHRNb2R1bGV9IGZyb20gJ3ByaW1lbmcvaW5wdXR0ZXh0JztcbmltcG9ydCB7TkdfVkFMVUVfQUNDRVNTT1IsIENvbnRyb2xWYWx1ZUFjY2Vzc29yfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmV4cG9ydCBjb25zdCBTUElOTkVSX1ZBTFVFX0FDQ0VTU09SOiBhbnkgPSB7XG4gICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gU3Bpbm5lciksXG4gICAgbXVsdGk6IHRydWVcbn07XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC1zcGlubmVyJyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8c3BhbiBjbGFzcz1cInVpLXNwaW5uZXIgdWktd2lkZ2V0IHVpLWNvcm5lci1hbGxcIj5cbiAgICAgICAgICAgIDxpbnB1dCAjaW5wdXRmaWVsZCB0eXBlPVwidGV4dFwiIFthdHRyLmlkXT1cImlucHV0SWRcIiBbdmFsdWVdPVwiZm9ybWF0dGVkVmFsdWV8fG51bGxcIiBbYXR0ci5uYW1lXT1cIm5hbWVcIiBbYXR0ci5hcmlhLXZhbHVtaW5dPVwibWluXCIgW2F0dHIuYXJpYS12YWx1ZW1heF09XCJtYXhcIiBbYXR0ci5hcmlhLXZhbHVlbm93XT1cInZhbHVlXCIgW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XT1cImFyaWFMYWJlbGxlZEJ5XCJcbiAgICAgICAgICAgIFthdHRyLnNpemVdPVwic2l6ZVwiIFthdHRyLm1heGxlbmd0aF09XCJtYXhsZW5ndGhcIiBbYXR0ci50YWJpbmRleF09XCJ0YWJpbmRleFwiIFthdHRyLnBsYWNlaG9sZGVyXT1cInBsYWNlaG9sZGVyXCIgW2Rpc2FibGVkXT1cImRpc2FibGVkXCIgW3JlYWRvbmx5XT1cInJlYWRvbmx5XCIgW2F0dHIucmVxdWlyZWRdPVwicmVxdWlyZWRcIlxuICAgICAgICAgICAgKGtleWRvd24pPVwib25JbnB1dEtleWRvd24oJGV2ZW50KVwiIChibHVyKT1cIm9uSW5wdXRCbHVyKCRldmVudClcIiAoaW5wdXQpPVwib25JbnB1dCgkZXZlbnQpXCIgKGNoYW5nZSk9XCJvbklucHV0Q2hhbmdlKCRldmVudClcIiAoZm9jdXMpPVwib25JbnB1dEZvY3VzKCRldmVudClcIlxuICAgICAgICAgICAgW25nU3R5bGVdPVwiaW5wdXRTdHlsZVwiIFtjbGFzc109XCJpbnB1dFN0eWxlQ2xhc3NcIiBbbmdDbGFzc109XCIndWktc3Bpbm5lci1pbnB1dCB1aS1pbnB1dHRleHQgdWktd2lkZ2V0IHVpLXN0YXRlLWRlZmF1bHQgdWktY29ybmVyLWFsbCdcIj5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIFtuZ0NsYXNzXT1cInsndWktc3Bpbm5lci1idXR0b24gdWktc3Bpbm5lci11cCB1aS1jb3JuZXItdHIgdWktYnV0dG9uIHVpLXdpZGdldCB1aS1zdGF0ZS1kZWZhdWx0Jzp0cnVlLCd1aS1zdGF0ZS1kaXNhYmxlZCc6ZGlzYWJsZWR9XCIgW2Rpc2FibGVkXT1cImRpc2FibGVkfHxyZWFkb25seVwiIHRhYmluZGV4PVwiLTFcIiBbYXR0ci5yZWFkb25seV09XCJyZWFkb25seVwiXG4gICAgICAgICAgICAgICAgKG1vdXNlbGVhdmUpPVwib25VcEJ1dHRvbk1vdXNlbGVhdmUoJGV2ZW50KVwiIChtb3VzZWRvd24pPVwib25VcEJ1dHRvbk1vdXNlZG93bigkZXZlbnQpXCIgKG1vdXNldXApPVwib25VcEJ1dHRvbk1vdXNldXAoJGV2ZW50KVwiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidWktc3Bpbm5lci1idXR0b24taWNvbiBwaSBwaS1jYXJldC11cCB1aS1jbGlja2FibGVcIj48L3NwYW4+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIFtuZ0NsYXNzXT1cInsndWktc3Bpbm5lci1idXR0b24gdWktc3Bpbm5lci1kb3duIHVpLWNvcm5lci1iciB1aS1idXR0b24gdWktd2lkZ2V0IHVpLXN0YXRlLWRlZmF1bHQnOnRydWUsJ3VpLXN0YXRlLWRpc2FibGVkJzpkaXNhYmxlZH1cIiBbZGlzYWJsZWRdPVwiZGlzYWJsZWR8fHJlYWRvbmx5XCIgdGFiaW5kZXg9XCItMVwiIFthdHRyLnJlYWRvbmx5XT1cInJlYWRvbmx5XCJcbiAgICAgICAgICAgICAgICAobW91c2VsZWF2ZSk9XCJvbkRvd25CdXR0b25Nb3VzZWxlYXZlKCRldmVudClcIiAobW91c2Vkb3duKT1cIm9uRG93bkJ1dHRvbk1vdXNlZG93bigkZXZlbnQpXCIgKG1vdXNldXApPVwib25Eb3duQnV0dG9uTW91c2V1cCgkZXZlbnQpXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ1aS1zcGlubmVyLWJ1dHRvbi1pY29uIHBpIHBpLWNhcmV0LWRvd24gdWktY2xpY2thYmxlXCI+PC9zcGFuPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvc3Bhbj5cbiAgICBgLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgJ2NsYXNzJzogJ3AtZWxlbWVudCcsXG4gICAgICAgICdbY2xhc3MudWktaW5wdXR3cmFwcGVyLWZpbGxlZF0nOiAnZmlsbGVkJyxcbiAgICAgICAgJ1tjbGFzcy51aS1pbnB1dHdyYXBwZXItZm9jdXNdJzogJ2ZvY3VzJ1xuICAgIH0sXG4gICAgcHJvdmlkZXJzOiBbU1BJTk5FUl9WQUxVRV9BQ0NFU1NPUl0sXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgICBzdHlsZVVybHM6IFsnLi9zcGlubmVyLmNzcyddXG59KVxuZXhwb3J0IGNsYXNzIFNwaW5uZXIgaW1wbGVtZW50cyBPbkluaXQsQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuXG4gICAgQE91dHB1dCgpIG9uQ2hhbmdlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvbkZvY3VzOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvbkJsdXI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQElucHV0KCkgbWluOiBudW1iZXI7XG5cbiAgICBASW5wdXQoKSBtYXg6IG51bWJlcjtcblxuICAgIEBJbnB1dCgpIG1heGxlbmd0aDogbnVtYmVyO1xuXG4gICAgQElucHV0KCkgc2l6ZTogbnVtYmVyO1xuXG4gICAgQElucHV0KCkgcGxhY2Vob2xkZXI6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGlucHV0SWQ6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGRpc2FibGVkOiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgcmVhZG9ubHk6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSB0YWJpbmRleDogbnVtYmVyO1xuXG4gICAgQElucHV0KCkgcmVxdWlyZWQ6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSBuYW1lOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBhcmlhTGFiZWxsZWRCeTogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgaW5wdXRTdHlsZTogYW55O1xuXG4gICAgQElucHV0KCkgaW5wdXRTdHlsZUNsYXNzOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBmb3JtYXRJbnB1dDogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIGRlY2ltYWxTZXBhcmF0b3I6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHRob3VzYW5kU2VwYXJhdG9yOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBwcmVjaXNpb246IG51bWJlcjtcblxuICAgIHZhbHVlOiBhbnk7XG5cbiAgICBfc3RlcDogbnVtYmVyID0gMTtcblxuICAgIGZvcm1hdHRlZFZhbHVlOiBzdHJpbmc7XG5cbiAgICBvbk1vZGVsQ2hhbmdlOiBGdW5jdGlvbiA9ICgpID0+IHt9O1xuXG4gICAgb25Nb2RlbFRvdWNoZWQ6IEZ1bmN0aW9uID0gKCkgPT4ge307XG5cbiAgICBrZXlQYXR0ZXJuOiBSZWdFeHAgPSAvWzAtOVxcK1xcLV0vO1xuXG4gICAgcHVibGljIHRpbWVyOiBhbnk7XG5cbiAgICBwdWJsaWMgZm9jdXM6IGJvb2xlYW47XG5cbiAgICBwdWJsaWMgZmlsbGVkOiBib29sZWFuO1xuXG4gICAgcHVibGljIG5lZ2F0aXZlU2VwYXJhdG9yID0gJy0nO1xuXG4gICAgbG9jYWxlRGVjaW1hbFNlcGFyYXRvcjogc3RyaW5nO1xuXG4gICAgbG9jYWxlVGhvdXNhbmRTZXBhcmF0b3I6IHN0cmluZztcblxuICAgIHRob3VzYW5kUmVnRXhwOiBSZWdFeHA7XG5cbiAgICBjYWxjdWxhdGVkUHJlY2lzaW9uOiBudW1iZXI7XG5cbiAgICBAVmlld0NoaWxkKCdpbnB1dGZpZWxkJykgaW5wdXRmaWVsZFZpZXdDaGlsZDogRWxlbWVudFJlZjtcblxuICAgIEBJbnB1dCgpIGdldCBzdGVwKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdGVwO1xuICAgIH1cbiAgICBzZXQgc3RlcCh2YWw6bnVtYmVyKSB7XG4gICAgICAgIHRoaXMuX3N0ZXAgPSB2YWw7XG5cbiAgICAgICAgaWYgKHRoaXMuX3N0ZXAgIT0gbnVsbCkge1xuICAgICAgICAgICAgbGV0IHRva2VucyA9IHRoaXMuc3RlcC50b1N0cmluZygpLnNwbGl0KC9bLF18Wy5dLyk7XG4gICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZWRQcmVjaXNpb24gPSB0b2tlbnNbMV0gPyB0b2tlbnNbMV0ubGVuZ3RoIDogdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IocHVibGljIGVsOiBFbGVtZW50UmVmLCBwdWJsaWMgY2Q6IENoYW5nZURldGVjdG9yUmVmKSB7fVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIGlmICh0aGlzLmZvcm1hdElucHV0KSB7XG4gICAgICAgICAgICB0aGlzLmxvY2FsZURlY2ltYWxTZXBhcmF0b3IgPSAoMS4xKS50b0xvY2FsZVN0cmluZygpLnN1YnN0cmluZygxLCAyKTtcbiAgICAgICAgICAgIHRoaXMubG9jYWxlVGhvdXNhbmRTZXBhcmF0b3IgPSAoMTAwMCkudG9Mb2NhbGVTdHJpbmcoKS5zdWJzdHJpbmcoMSwgMik7XG4gICAgICAgICAgICB0aGlzLnRob3VzYW5kUmVnRXhwID0gbmV3IFJlZ0V4cChgWyR7dGhpcy50aG91c2FuZFNlcGFyYXRvciB8fCB0aGlzLmxvY2FsZVRob3VzYW5kU2VwYXJhdG9yfV1gLCAnZ2ltJyk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmRlY2ltYWxTZXBhcmF0b3IgJiYgdGhpcy50aG91c2FuZFNlcGFyYXRvciAmJiB0aGlzLmRlY2ltYWxTZXBhcmF0b3IgPT09IHRoaXMudGhvdXNhbmRTZXBhcmF0b3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJ0aG91c2FuZFNlcGFyYXRvciBhbmQgZGVjaW1hbFNlcGFyYXRvciBjYW5ub3QgaGF2ZSB0aGUgc2FtZSB2YWx1ZS5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXBlYXQoZXZlbnQ6IEV2ZW50LCBpbnRlcnZhbDogbnVtYmVyLCBkaXI6IG51bWJlcikge1xuICAgICAgICBsZXQgaSA9IGludGVydmFsfHw1MDA7XG5cbiAgICAgICAgdGhpcy5jbGVhclRpbWVyKCk7XG4gICAgICAgIHRoaXMudGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMucmVwZWF0KGV2ZW50LCA0MCwgZGlyKTtcbiAgICAgICAgfSwgaSk7XG5cbiAgICAgICAgdGhpcy5zcGluKGV2ZW50LCBkaXIpO1xuICAgIH1cblxuICAgIHNwaW4oZXZlbnQ6IEV2ZW50LCBkaXI6IG51bWJlcikge1xuICAgICAgICBsZXQgc3RlcCA9IHRoaXMuc3RlcCAqIGRpcjtcbiAgICAgICAgbGV0IGN1cnJlbnRWYWx1ZTogbnVtYmVyO1xuICAgICAgICBsZXQgcHJlY2lzaW9uID0gdGhpcy5nZXRQcmVjaXNpb24oKTtcblxuICAgICAgICBpZiAodGhpcy52YWx1ZSlcbiAgICAgICAgICAgIGN1cnJlbnRWYWx1ZSA9ICh0eXBlb2YgdGhpcy52YWx1ZSA9PT0gJ3N0cmluZycpID8gdGhpcy5wYXJzZVZhbHVlKHRoaXMudmFsdWUpIDogdGhpcy52YWx1ZTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgY3VycmVudFZhbHVlID0gMDtcblxuICAgICAgICBpZiAocHJlY2lzaW9uKVxuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHBhcnNlRmxvYXQodGhpcy50b0ZpeGVkKGN1cnJlbnRWYWx1ZSArIHN0ZXAsIHByZWNpc2lvbikpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gY3VycmVudFZhbHVlICsgc3RlcDtcblxuICAgICAgICBpZiAodGhpcy5tYXhsZW5ndGggIT09IHVuZGVmaW5lZCAmJiB0aGlzLnZhbHVlLnRvU3RyaW5nKCkubGVuZ3RoID4gdGhpcy5tYXhsZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSBjdXJyZW50VmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5taW4gIT09IHVuZGVmaW5lZCAmJiB0aGlzLnZhbHVlIDwgdGhpcy5taW4pIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLm1pbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm1heCAhPT0gdW5kZWZpbmVkICYmIHRoaXMudmFsdWUgPiB0aGlzLm1heCkge1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMubWF4O1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5mb3JtYXRWYWx1ZSgpO1xuICAgICAgICB0aGlzLm9uTW9kZWxDaGFuZ2UodGhpcy52YWx1ZSk7XG4gICAgICAgIHRoaXMub25DaGFuZ2UuZW1pdChldmVudCk7XG4gICAgfVxuXG4gICAgZ2V0UHJlY2lzaW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcmVjaXNpb24gPT09IHVuZGVmaW5lZCA/IHRoaXMuY2FsY3VsYXRlZFByZWNpc2lvbiA6IHRoaXMucHJlY2lzaW9uO1xuICAgIH1cblxuICAgIHRvRml4ZWQodmFsdWU6IG51bWJlciwgcHJlY2lzaW9uOiBudW1iZXIpIHtcbiAgICAgICAgbGV0IHBvd2VyID0gTWF0aC5wb3coMTAsIHByZWNpc2lvbnx8MCk7XG4gICAgICAgIHJldHVybiBTdHJpbmcoTWF0aC5yb3VuZCh2YWx1ZSAqIHBvd2VyKSAvIHBvd2VyKTtcbiAgICB9XG5cbiAgICBvblVwQnV0dG9uTW91c2Vkb3duKGV2ZW50OiBFdmVudCkge1xuICAgICAgICBpZiAoIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMuaW5wdXRmaWVsZFZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgICAgICB0aGlzLnJlcGVhdChldmVudCwgbnVsbCwgMSk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUZpbGxlZFN0YXRlKCk7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25VcEJ1dHRvbk1vdXNldXAoZXZlbnQ6IEV2ZW50KSB7XG4gICAgICAgIGlmICghdGhpcy5kaXNhYmxlZCkge1xuICAgICAgICAgICAgdGhpcy5jbGVhclRpbWVyKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvblVwQnV0dG9uTW91c2VsZWF2ZShldmVudDogRXZlbnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgICAgICB0aGlzLmNsZWFyVGltZXIoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uRG93bkJ1dHRvbk1vdXNlZG93bihldmVudDogRXZlbnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgICAgICB0aGlzLmlucHV0ZmllbGRWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgICAgICAgdGhpcy5yZXBlYXQoZXZlbnQsIG51bGwsIC0xKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlRmlsbGVkU3RhdGUoKTtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkRvd25CdXR0b25Nb3VzZXVwKGV2ZW50OiBFdmVudCkge1xuICAgICAgICBpZiAoIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMuY2xlYXJUaW1lcigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25Eb3duQnV0dG9uTW91c2VsZWF2ZShldmVudDogRXZlbnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgICAgICB0aGlzLmNsZWFyVGltZXIoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uSW5wdXRLZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC53aGljaCA9PSAzOCkge1xuICAgICAgICAgICAgdGhpcy5zcGluKGV2ZW50LCAxKTtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZXZlbnQud2hpY2ggPT0gNDApIHtcbiAgICAgICAgICAgIHRoaXMuc3BpbihldmVudCwgLTEpO1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uSW5wdXRDaGFuZ2UoZXZlbnQ6IEV2ZW50KSB7XG4gICAgICAgIHRoaXMub25DaGFuZ2UuZW1pdChldmVudCk7XG4gICAgfVxuXG4gICAgb25JbnB1dChldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgICAgICB0aGlzLnZhbHVlID0gdGhpcy5wYXJzZVZhbHVlKCg8SFRNTElucHV0RWxlbWVudD4gZXZlbnQudGFyZ2V0KS52YWx1ZSk7XG4gICAgICAgIHRoaXMub25Nb2RlbENoYW5nZSh0aGlzLnZhbHVlKTtcbiAgICAgICAgdGhpcy51cGRhdGVGaWxsZWRTdGF0ZSgpO1xuICAgIH1cblxuICAgIG9uSW5wdXRCbHVyKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuZm9jdXMgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5mb3JtYXRWYWx1ZSgpO1xuICAgICAgICB0aGlzLm9uTW9kZWxUb3VjaGVkKCk7XG4gICAgICAgIHRoaXMub25CbHVyLmVtaXQoZXZlbnQpO1xuICAgIH1cblxuICAgIG9uSW5wdXRGb2N1cyhldmVudCkge1xuICAgICAgICB0aGlzLmZvY3VzID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5vbkZvY3VzLmVtaXQoZXZlbnQpO1xuICAgIH1cblxuICAgIHBhcnNlVmFsdWUodmFsOiBzdHJpbmcpOiBudW1iZXIge1xuICAgICAgICBsZXQgdmFsdWU6IG51bWJlcjtcbiAgICAgICAgbGV0IHByZWNpc2lvbiA9IHRoaXMuZ2V0UHJlY2lzaW9uKCk7XG5cbiAgICAgICAgaWYgKHZhbC50cmltKCkgPT09ICcnKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5mb3JtYXRJbnB1dCkge1xuICAgICAgICAgICAgICAgIHZhbCA9IHZhbC5yZXBsYWNlKHRoaXMudGhvdXNhbmRSZWdFeHAsICcnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHByZWNpc2lvbikge1xuICAgICAgICAgICAgICAgIHZhbCA9IHRoaXMuZm9ybWF0SW5wdXQgPyB2YWwucmVwbGFjZSh0aGlzLmRlY2ltYWxTZXBhcmF0b3IgfHwgdGhpcy5sb2NhbGVEZWNpbWFsU2VwYXJhdG9yLCAnLicpIDogdmFsLnJlcGxhY2UoJywnLCAnLicpO1xuICAgICAgICAgICAgICAgIHZhbHVlID0gcGFyc2VGbG9hdCh2YWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBwYXJzZUludCh2YWwsIDEwKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFpc05hTih2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5tYXggIT09IG51bGwgJiYgdmFsdWUgPiB0aGlzLm1heCkge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMubWF4O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm1pbiAhPT0gbnVsbCAmJiB2YWx1ZSA8IHRoaXMubWluKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdGhpcy5taW47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGZvcm1hdFZhbHVlKCkge1xuICAgICAgICBsZXQgdmFsdWUgPSB0aGlzLnZhbHVlO1xuICAgICAgICBsZXQgcHJlY2lzaW9uID0gdGhpcy5nZXRQcmVjaXNpb24oKTtcblxuICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZm9ybWF0SW5wdXQpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnRvTG9jYWxlU3RyaW5nKHVuZGVmaW5lZCwge21heGltdW1GcmFjdGlvbkRpZ2l0czogMjB9KTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRlY2ltYWxTZXBhcmF0b3IgJiYgdGhpcy50aG91c2FuZFNlcGFyYXRvcikge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnNwbGl0KHRoaXMubG9jYWxlRGVjaW1hbFNlcGFyYXRvcik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHByZWNpc2lvbiAmJiB2YWx1ZVsxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVbMV0gPSAodGhpcy5kZWNpbWFsU2VwYXJhdG9yIHx8IHRoaXMubG9jYWxlRGVjaW1hbFNlcGFyYXRvcikgKyB2YWx1ZVsxXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnRob3VzYW5kU2VwYXJhdG9yICYmIHZhbHVlWzBdLmxlbmd0aCA+IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlWzBdID0gdmFsdWVbMF0ucmVwbGFjZShuZXcgUmVnRXhwKGBbJHt0aGlzLmxvY2FsZVRob3VzYW5kU2VwYXJhdG9yfV1gLCAnZ2ltJyksIHRoaXMudGhvdXNhbmRTZXBhcmF0b3IpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5qb2luKCcnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuZm9ybWF0dGVkVmFsdWUgPSB2YWx1ZS50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5mb3JtYXR0ZWRWYWx1ZSA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pbnB1dGZpZWxkVmlld0NoaWxkICYmIHRoaXMuaW5wdXRmaWVsZFZpZXdDaGlsZC5uYXRpdmVFbGVtZW50KSB7XG4gICAgICAgICAgICB0aGlzLmlucHV0ZmllbGRWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC52YWx1ZSA9IHRoaXMuZm9ybWF0dGVkVmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbGVhclRpbWVyKCkge1xuICAgICAgICBpZiAodGhpcy50aW1lcikge1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdyaXRlVmFsdWUodmFsdWU6IGFueSkgOiB2b2lkIHtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmZvcm1hdFZhbHVlKCk7XG4gICAgICAgIHRoaXMudXBkYXRlRmlsbGVkU3RhdGUoKTtcbiAgICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG5cbiAgICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBGdW5jdGlvbik6IHZvaWQge1xuICAgICAgICB0aGlzLm9uTW9kZWxDaGFuZ2UgPSBmbjtcbiAgICB9XG5cbiAgICByZWdpc3Rlck9uVG91Y2hlZChmbjogRnVuY3Rpb24pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vbk1vZGVsVG91Y2hlZCA9IGZuO1xuICAgIH1cblxuICAgIHNldERpc2FibGVkU3RhdGUodmFsOiBib29sZWFuKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGlzYWJsZWQgPSB2YWw7XG4gICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuXG4gICAgdXBkYXRlRmlsbGVkU3RhdGUoKSB7XG4gICAgICAgIHRoaXMuZmlsbGVkID0gKHRoaXMudmFsdWUgIT09IHVuZGVmaW5lZCAmJiB0aGlzLnZhbHVlICE9IG51bGwpO1xuICAgIH1cbn1cblxuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsSW5wdXRUZXh0TW9kdWxlXSxcbiAgICBleHBvcnRzOiBbU3Bpbm5lcl0sXG4gICAgZGVjbGFyYXRpb25zOiBbU3Bpbm5lcl1cbn0pXG5leHBvcnQgY2xhc3MgU3Bpbm5lck1vZHVsZSB7IH1cbiJdfQ==