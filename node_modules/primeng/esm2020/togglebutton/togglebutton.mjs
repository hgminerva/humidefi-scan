import { NgModule, Component, Input, Output, EventEmitter, forwardRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "primeng/ripple";
export const TOGGLEBUTTON_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ToggleButton),
    multi: true
};
export class ToggleButton {
    constructor(cd) {
        this.cd = cd;
        this.iconPos = 'left';
        this.onChange = new EventEmitter();
        this.checked = false;
        this.onModelChange = () => { };
        this.onModelTouched = () => { };
    }
    toggle(event) {
        if (!this.disabled) {
            this.checked = !this.checked;
            this.onModelChange(this.checked);
            this.onModelTouched();
            this.onChange.emit({
                originalEvent: event,
                checked: this.checked
            });
            this.cd.markForCheck();
        }
    }
    onBlur() {
        this.onModelTouched();
    }
    writeValue(value) {
        this.checked = value;
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
    get hasOnLabel() {
        return this.onLabel && this.onLabel.length > 0;
    }
    get hasOffLabel() {
        return this.onLabel && this.onLabel.length > 0;
    }
}
ToggleButton.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ToggleButton, deps: [{ token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
ToggleButton.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.7", type: ToggleButton, selector: "p-toggleButton", inputs: { onLabel: "onLabel", offLabel: "offLabel", onIcon: "onIcon", offIcon: "offIcon", ariaLabelledBy: "ariaLabelledBy", disabled: "disabled", style: "style", styleClass: "styleClass", inputId: "inputId", tabindex: "tabindex", iconPos: "iconPos" }, outputs: { onChange: "onChange" }, host: { classAttribute: "p-element" }, providers: [TOGGLEBUTTON_VALUE_ACCESSOR], ngImport: i0, template: `
        <div [ngClass]="{'p-button p-togglebutton p-component': true, 'p-button-icon-only': (onIcon && offIcon && !hasOnLabel && !hasOffLabel),'p-highlight': checked,'p-disabled':disabled}"
                        [ngStyle]="style" [class]="styleClass" (click)="toggle($event)" (keydown.enter)="toggle($event)"
                        [attr.tabindex]="disabled ? null : '0'" role="checkbox" [attr.aria-checked]="checked" pRipple>
            <span *ngIf="onIcon||offIcon" [class]="checked ? this.onIcon : this.offIcon"
                [ngClass]="{'p-button-icon': true, 'p-button-icon-left': (iconPos === 'left'), 'p-button-icon-right': (iconPos === 'right')}"></span>
            <span class="p-button-label">{{checked ? hasOnLabel ? onLabel : '' : hasOffLabel ? offLabel : ''}}</span>
        </div>
    `, isInline: true, styles: [".p-button{margin:0;display:inline-flex;cursor:pointer;-webkit-user-select:none;user-select:none;align-items:center;vertical-align:bottom;text-align:center;overflow:hidden;position:relative}.p-button-label{flex:1 1 auto}.p-button-icon-right{order:1}.p-button:disabled{cursor:default}.p-button-icon-only{justify-content:center}.p-button-icon-only .p-button-label{visibility:hidden;width:0;flex:0 0 auto}.p-button-vertical{flex-direction:column}.p-button-icon-bottom{order:2}.p-buttonset .p-button{margin:0}.p-buttonset .p-button:not(:last-child){border-right:0 none}.p-buttonset .p-button:not(:first-of-type):not(:last-of-type){border-radius:0}.p-buttonset .p-button:first-of-type{border-top-right-radius:0;border-bottom-right-radius:0}.p-buttonset .p-button:last-of-type{border-top-left-radius:0;border-bottom-left-radius:0}.p-buttonset .p-button:focus{position:relative;z-index:1}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i2.Ripple, selector: "[pRipple]" }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ToggleButton, decorators: [{
            type: Component,
            args: [{ selector: 'p-toggleButton', template: `
        <div [ngClass]="{'p-button p-togglebutton p-component': true, 'p-button-icon-only': (onIcon && offIcon && !hasOnLabel && !hasOffLabel),'p-highlight': checked,'p-disabled':disabled}"
                        [ngStyle]="style" [class]="styleClass" (click)="toggle($event)" (keydown.enter)="toggle($event)"
                        [attr.tabindex]="disabled ? null : '0'" role="checkbox" [attr.aria-checked]="checked" pRipple>
            <span *ngIf="onIcon||offIcon" [class]="checked ? this.onIcon : this.offIcon"
                [ngClass]="{'p-button-icon': true, 'p-button-icon-left': (iconPos === 'left'), 'p-button-icon-right': (iconPos === 'right')}"></span>
            <span class="p-button-label">{{checked ? hasOnLabel ? onLabel : '' : hasOffLabel ? offLabel : ''}}</span>
        </div>
    `, providers: [TOGGLEBUTTON_VALUE_ACCESSOR], changeDetection: ChangeDetectionStrategy.OnPush, host: {
                        'class': 'p-element'
                    }, styles: [".p-button{margin:0;display:inline-flex;cursor:pointer;-webkit-user-select:none;user-select:none;align-items:center;vertical-align:bottom;text-align:center;overflow:hidden;position:relative}.p-button-label{flex:1 1 auto}.p-button-icon-right{order:1}.p-button:disabled{cursor:default}.p-button-icon-only{justify-content:center}.p-button-icon-only .p-button-label{visibility:hidden;width:0;flex:0 0 auto}.p-button-vertical{flex-direction:column}.p-button-icon-bottom{order:2}.p-buttonset .p-button{margin:0}.p-buttonset .p-button:not(:last-child){border-right:0 none}.p-buttonset .p-button:not(:first-of-type):not(:last-of-type){border-radius:0}.p-buttonset .p-button:first-of-type{border-top-right-radius:0;border-bottom-right-radius:0}.p-buttonset .p-button:last-of-type{border-top-left-radius:0;border-bottom-left-radius:0}.p-buttonset .p-button:focus{position:relative;z-index:1}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }]; }, propDecorators: { onLabel: [{
                type: Input
            }], offLabel: [{
                type: Input
            }], onIcon: [{
                type: Input
            }], offIcon: [{
                type: Input
            }], ariaLabelledBy: [{
                type: Input
            }], disabled: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], inputId: [{
                type: Input
            }], tabindex: [{
                type: Input
            }], iconPos: [{
                type: Input
            }], onChange: [{
                type: Output
            }] } });
export class ToggleButtonModule {
}
ToggleButtonModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ToggleButtonModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ToggleButtonModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.7", ngImport: i0, type: ToggleButtonModule, declarations: [ToggleButton], imports: [CommonModule, RippleModule], exports: [ToggleButton] });
ToggleButtonModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ToggleButtonModule, imports: [CommonModule, RippleModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ToggleButtonModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, RippleModule],
                    exports: [ToggleButton],
                    declarations: [ToggleButton]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9nZ2xlYnV0dG9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9jb21wb25lbnRzL3RvZ2dsZWJ1dHRvbi90b2dnbGVidXR0b24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsS0FBSyxFQUFDLE1BQU0sRUFBQyxZQUFZLEVBQUMsVUFBVSxFQUFDLHVCQUF1QixFQUFtQixNQUFNLGVBQWUsQ0FBQztBQUNoSSxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzVDLE9BQU8sRUFBQyxpQkFBaUIsRUFBdUIsTUFBTSxnQkFBZ0IsQ0FBQzs7OztBQUV2RSxNQUFNLENBQUMsTUFBTSwyQkFBMkIsR0FBUTtJQUM5QyxPQUFPLEVBQUUsaUJBQWlCO0lBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDO0lBQzNDLEtBQUssRUFBRSxJQUFJO0NBQ1osQ0FBQztBQW9CRixNQUFNLE9BQU8sWUFBWTtJQWdDckIsWUFBbUIsRUFBcUI7UUFBckIsT0FBRSxHQUFGLEVBQUUsQ0FBbUI7UUFWL0IsWUFBTyxHQUFXLE1BQU0sQ0FBQztRQUV4QixhQUFRLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFFM0QsWUFBTyxHQUFZLEtBQUssQ0FBQztRQUV6QixrQkFBYSxHQUFhLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQztRQUVuQyxtQkFBYyxHQUFhLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQztJQUVRLENBQUM7SUFFN0MsTUFBTSxDQUFDLEtBQVk7UUFDZixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNoQixJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztZQUM3QixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNqQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDdEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7Z0JBQ2YsYUFBYSxFQUFFLEtBQUs7Z0JBQ3BCLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTzthQUN4QixDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDO1NBQzFCO0lBQ0wsQ0FBQztJQUVELE1BQU07UUFDRixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDMUIsQ0FBQztJQUVELFVBQVUsQ0FBQyxLQUFVO1FBQ2pCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUVELGdCQUFnQixDQUFDLEVBQVk7UUFDekIsSUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7SUFDNUIsQ0FBQztJQUVELGlCQUFpQixDQUFDLEVBQVk7UUFDMUIsSUFBSSxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUVELGdCQUFnQixDQUFDLEdBQVk7UUFDekIsSUFBSSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7UUFDcEIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRUQsSUFBSSxVQUFVO1FBQ1YsT0FBTyxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBRUQsSUFBSSxXQUFXO1FBQ1gsT0FBTyxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUNuRCxDQUFDOzt5R0E1RVEsWUFBWTs2RkFBWixZQUFZLCtXQVBWLENBQUMsMkJBQTJCLENBQUMsMEJBVDlCOzs7Ozs7OztLQVFUOzJGQVFRLFlBQVk7a0JBbEJ4QixTQUFTOytCQUNJLGdCQUFnQixZQUNoQjs7Ozs7Ozs7S0FRVCxhQUNVLENBQUMsMkJBQTJCLENBQUMsbUJBQ3ZCLHVCQUF1QixDQUFDLE1BQU0sUUFFekM7d0JBQ0YsT0FBTyxFQUFFLFdBQVc7cUJBQ3ZCO3dHQUlRLE9BQU87c0JBQWYsS0FBSztnQkFFRyxRQUFRO3NCQUFoQixLQUFLO2dCQUVHLE1BQU07c0JBQWQsS0FBSztnQkFFRyxPQUFPO3NCQUFmLEtBQUs7Z0JBRUcsY0FBYztzQkFBdEIsS0FBSztnQkFFRyxRQUFRO3NCQUFoQixLQUFLO2dCQUVHLEtBQUs7c0JBQWIsS0FBSztnQkFFRyxVQUFVO3NCQUFsQixLQUFLO2dCQUVHLE9BQU87c0JBQWYsS0FBSztnQkFFRyxRQUFRO3NCQUFoQixLQUFLO2dCQUVHLE9BQU87c0JBQWYsS0FBSztnQkFFSSxRQUFRO3NCQUFqQixNQUFNOztBQTREWCxNQUFNLE9BQU8sa0JBQWtCOzsrR0FBbEIsa0JBQWtCO2dIQUFsQixrQkFBa0IsaUJBcEZsQixZQUFZLGFBZ0ZYLFlBQVksRUFBQyxZQUFZLGFBaEYxQixZQUFZO2dIQW9GWixrQkFBa0IsWUFKakIsWUFBWSxFQUFDLFlBQVk7MkZBSTFCLGtCQUFrQjtrQkFMOUIsUUFBUTttQkFBQztvQkFDTixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUMsWUFBWSxDQUFDO29CQUNwQyxPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7b0JBQ3ZCLFlBQVksRUFBRSxDQUFDLFlBQVksQ0FBQztpQkFDL0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge05nTW9kdWxlLENvbXBvbmVudCxJbnB1dCxPdXRwdXQsRXZlbnRFbWl0dGVyLGZvcndhcmRSZWYsQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksQ2hhbmdlRGV0ZWN0b3JSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1JpcHBsZU1vZHVsZX0gZnJvbSAncHJpbWVuZy9yaXBwbGUnO1xuaW1wb3J0IHtOR19WQUxVRV9BQ0NFU1NPUiwgQ29udHJvbFZhbHVlQWNjZXNzb3J9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuZXhwb3J0IGNvbnN0IFRPR0dMRUJVVFRPTl9WQUxVRV9BQ0NFU1NPUjogYW55ID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gVG9nZ2xlQnV0dG9uKSxcbiAgbXVsdGk6IHRydWVcbn07XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC10b2dnbGVCdXR0b24nLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxkaXYgW25nQ2xhc3NdPVwieydwLWJ1dHRvbiBwLXRvZ2dsZWJ1dHRvbiBwLWNvbXBvbmVudCc6IHRydWUsICdwLWJ1dHRvbi1pY29uLW9ubHknOiAob25JY29uICYmIG9mZkljb24gJiYgIWhhc09uTGFiZWwgJiYgIWhhc09mZkxhYmVsKSwncC1oaWdobGlnaHQnOiBjaGVja2VkLCdwLWRpc2FibGVkJzpkaXNhYmxlZH1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgW25nU3R5bGVdPVwic3R5bGVcIiBbY2xhc3NdPVwic3R5bGVDbGFzc1wiIChjbGljayk9XCJ0b2dnbGUoJGV2ZW50KVwiIChrZXlkb3duLmVudGVyKT1cInRvZ2dsZSgkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFthdHRyLnRhYmluZGV4XT1cImRpc2FibGVkID8gbnVsbCA6ICcwJ1wiIHJvbGU9XCJjaGVja2JveFwiIFthdHRyLmFyaWEtY2hlY2tlZF09XCJjaGVja2VkXCIgcFJpcHBsZT5cbiAgICAgICAgICAgIDxzcGFuICpuZ0lmPVwib25JY29ufHxvZmZJY29uXCIgW2NsYXNzXT1cImNoZWNrZWQgPyB0aGlzLm9uSWNvbiA6IHRoaXMub2ZmSWNvblwiXG4gICAgICAgICAgICAgICAgW25nQ2xhc3NdPVwieydwLWJ1dHRvbi1pY29uJzogdHJ1ZSwgJ3AtYnV0dG9uLWljb24tbGVmdCc6IChpY29uUG9zID09PSAnbGVmdCcpLCAncC1idXR0b24taWNvbi1yaWdodCc6IChpY29uUG9zID09PSAncmlnaHQnKX1cIj48L3NwYW4+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtYnV0dG9uLWxhYmVsXCI+e3tjaGVja2VkID8gaGFzT25MYWJlbCA/IG9uTGFiZWwgOiAnJyA6IGhhc09mZkxhYmVsID8gb2ZmTGFiZWwgOiAnJ319PC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICBgLFxuICAgIHByb3ZpZGVyczogW1RPR0dMRUJVVFRPTl9WQUxVRV9BQ0NFU1NPUl0sXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gICAgc3R5bGVVcmxzOiBbJy4uL2J1dHRvbi9idXR0b24uY3NzJ10sXG4gICAgaG9zdDoge1xuICAgICAgICAnY2xhc3MnOiAncC1lbGVtZW50J1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgVG9nZ2xlQnV0dG9uIGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuXG4gICAgQElucHV0KCkgb25MYWJlbDogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgb2ZmTGFiZWw6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIG9uSWNvbjogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgb2ZmSWNvbjogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgYXJpYUxhYmVsbGVkQnk6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGRpc2FibGVkOiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgc3R5bGU6IGFueTtcblxuICAgIEBJbnB1dCgpIHN0eWxlQ2xhc3M6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGlucHV0SWQ6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHRhYmluZGV4OiBudW1iZXI7XG5cbiAgICBASW5wdXQoKSBpY29uUG9zOiBzdHJpbmcgPSAnbGVmdCc7XG5cbiAgICBAT3V0cHV0KCkgb25DaGFuZ2U6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgY2hlY2tlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgb25Nb2RlbENoYW5nZTogRnVuY3Rpb24gPSAoKSA9PiB7fTtcblxuICAgIG9uTW9kZWxUb3VjaGVkOiBGdW5jdGlvbiA9ICgpID0+IHt9O1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIGNkOiBDaGFuZ2VEZXRlY3RvclJlZikgeyB9XG5cbiAgICB0b2dnbGUoZXZlbnQ6IEV2ZW50KSB7XG4gICAgICAgIGlmICghdGhpcy5kaXNhYmxlZCkge1xuICAgICAgICAgICAgdGhpcy5jaGVja2VkID0gIXRoaXMuY2hlY2tlZDtcbiAgICAgICAgICAgIHRoaXMub25Nb2RlbENoYW5nZSh0aGlzLmNoZWNrZWQpO1xuICAgICAgICAgICAgdGhpcy5vbk1vZGVsVG91Y2hlZCgpO1xuICAgICAgICAgICAgdGhpcy5vbkNoYW5nZS5lbWl0KHtcbiAgICAgICAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBldmVudCxcbiAgICAgICAgICAgICAgICBjaGVja2VkOiB0aGlzLmNoZWNrZWRcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25CbHVyKCkge1xuICAgICAgICB0aGlzLm9uTW9kZWxUb3VjaGVkKCk7XG4gICAgfVxuXG4gICAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KSA6IHZvaWQge1xuICAgICAgICB0aGlzLmNoZWNrZWQgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG5cbiAgICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBGdW5jdGlvbik6IHZvaWQge1xuICAgICAgICB0aGlzLm9uTW9kZWxDaGFuZ2UgPSBmbjtcbiAgICB9XG5cbiAgICByZWdpc3Rlck9uVG91Y2hlZChmbjogRnVuY3Rpb24pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vbk1vZGVsVG91Y2hlZCA9IGZuO1xuICAgIH1cblxuICAgIHNldERpc2FibGVkU3RhdGUodmFsOiBib29sZWFuKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGlzYWJsZWQgPSB2YWw7XG4gICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuXG4gICAgZ2V0IGhhc09uTGFiZWwoKTpib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub25MYWJlbCAmJiB0aGlzLm9uTGFiZWwubGVuZ3RoID4gMDtcbiAgICB9XG5cbiAgICBnZXQgaGFzT2ZmTGFiZWwoKTpib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub25MYWJlbCAmJiB0aGlzLm9uTGFiZWwubGVuZ3RoID4gMDtcbiAgICB9XG59XG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSxSaXBwbGVNb2R1bGVdLFxuICAgIGV4cG9ydHM6IFtUb2dnbGVCdXR0b25dLFxuICAgIGRlY2xhcmF0aW9uczogW1RvZ2dsZUJ1dHRvbl1cbn0pXG5leHBvcnQgY2xhc3MgVG9nZ2xlQnV0dG9uTW9kdWxlIHsgfVxuIl19