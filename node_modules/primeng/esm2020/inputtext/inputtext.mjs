import { NgModule, Directive, HostListener, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
export class InputText {
    constructor(el, ngModel, cd) {
        this.el = el;
        this.ngModel = ngModel;
        this.cd = cd;
    }
    ngAfterViewInit() {
        this.updateFilledState();
        this.cd.detectChanges();
    }
    ngDoCheck() {
        this.updateFilledState();
    }
    onInput(e) {
        this.updateFilledState();
    }
    updateFilledState() {
        this.filled = (this.el.nativeElement.value && this.el.nativeElement.value.length) ||
            (this.ngModel && this.ngModel.model);
    }
}
InputText.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: InputText, deps: [{ token: i0.ElementRef }, { token: i1.NgModel, optional: true }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Directive });
InputText.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.0.7", type: InputText, selector: "[pInputText]", host: { listeners: { "input": "onInput($event)" }, properties: { "class.p-filled": "filled" }, classAttribute: "p-inputtext p-component p-element" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: InputText, decorators: [{
            type: Directive,
            args: [{
                    selector: '[pInputText]',
                    host: {
                        'class': 'p-inputtext p-component p-element',
                        '[class.p-filled]': 'filled'
                    }
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.NgModel, decorators: [{
                    type: Optional
                }] }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { onInput: [{
                type: HostListener,
                args: ['input', ['$event']]
            }] } });
export class InputTextModule {
}
InputTextModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: InputTextModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
InputTextModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.7", ngImport: i0, type: InputTextModule, declarations: [InputText], imports: [CommonModule], exports: [InputText] });
InputTextModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: InputTextModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: InputTextModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [InputText],
                    declarations: [InputText]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXR0ZXh0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9jb21wb25lbnRzL2lucHV0dGV4dC9pbnB1dHRleHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFFBQVEsRUFBRSxTQUFTLEVBQWMsWUFBWSxFQUFXLFFBQVEsRUFBbUMsTUFBTSxlQUFlLENBQUM7QUFFakksT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDOzs7QUFTN0MsTUFBTSxPQUFPLFNBQVM7SUFJbEIsWUFBbUIsRUFBYyxFQUFxQixPQUFnQixFQUFVLEVBQXFCO1FBQWxGLE9BQUUsR0FBRixFQUFFLENBQVk7UUFBcUIsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUFVLE9BQUUsR0FBRixFQUFFLENBQW1CO0lBQ3JHLENBQUM7SUFFRCxlQUFlO1FBQ1gsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDekIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUM1QixDQUFDO0lBRUQsU0FBUztRQUNMLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFHRCxPQUFPLENBQUMsQ0FBQztRQUNMLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFFRCxpQkFBaUI7UUFDYixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7WUFDN0UsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDN0MsQ0FBQzs7c0dBeEJRLFNBQVM7MEZBQVQsU0FBUzsyRkFBVCxTQUFTO2tCQVByQixTQUFTO21CQUFDO29CQUNQLFFBQVEsRUFBRSxjQUFjO29CQUN4QixJQUFJLEVBQUU7d0JBQ0YsT0FBTyxFQUFFLG1DQUFtQzt3QkFDNUMsa0JBQWtCLEVBQUUsUUFBUTtxQkFDL0I7aUJBQ0o7OzBCQUt1QyxRQUFROzRFQWE1QyxPQUFPO3NCQUROLFlBQVk7dUJBQUMsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDOztBQWdCckMsTUFBTSxPQUFPLGVBQWU7OzRHQUFmLGVBQWU7NkdBQWYsZUFBZSxpQkFoQ2YsU0FBUyxhQTRCUixZQUFZLGFBNUJiLFNBQVM7NkdBZ0NULGVBQWUsWUFKZCxZQUFZOzJGQUliLGVBQWU7a0JBTDNCLFFBQVE7bUJBQUM7b0JBQ04sT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO29CQUN2QixPQUFPLEVBQUUsQ0FBQyxTQUFTLENBQUM7b0JBQ3BCLFlBQVksRUFBRSxDQUFDLFNBQVMsQ0FBQztpQkFDNUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge05nTW9kdWxlLCBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEhvc3RMaXN0ZW5lciwgRG9DaGVjaywgT3B0aW9uYWwsIENoYW5nZURldGVjdG9yUmVmLCBBZnRlclZpZXdJbml0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TmdNb2RlbH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnW3BJbnB1dFRleHRdJyxcbiAgICBob3N0OiB7XG4gICAgICAgICdjbGFzcyc6ICdwLWlucHV0dGV4dCBwLWNvbXBvbmVudCBwLWVsZW1lbnQnLFxuICAgICAgICAnW2NsYXNzLnAtZmlsbGVkXSc6ICdmaWxsZWQnXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBJbnB1dFRleHQgaW1wbGVtZW50cyBEb0NoZWNrLCBBZnRlclZpZXdJbml0IHtcblxuICAgIGZpbGxlZDogYm9vbGVhbjtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBlbDogRWxlbWVudFJlZiwgQE9wdGlvbmFsKCkgcHVibGljIG5nTW9kZWw6IE5nTW9kZWwsIHByaXZhdGUgY2Q6IENoYW5nZURldGVjdG9yUmVmKSB7XG4gICAgfVxuXG4gICAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgICAgICB0aGlzLnVwZGF0ZUZpbGxlZFN0YXRlKCk7XG4gICAgICAgIHRoaXMuY2QuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH1cblxuICAgIG5nRG9DaGVjaygpIHtcbiAgICAgICAgdGhpcy51cGRhdGVGaWxsZWRTdGF0ZSgpO1xuICAgIH1cblxuICAgIEBIb3N0TGlzdGVuZXIoJ2lucHV0JywgWyckZXZlbnQnXSlcbiAgICBvbklucHV0KGUpIHtcbiAgICAgICAgdGhpcy51cGRhdGVGaWxsZWRTdGF0ZSgpO1xuICAgIH1cblxuICAgIHVwZGF0ZUZpbGxlZFN0YXRlKCkge1xuICAgICAgICB0aGlzLmZpbGxlZCA9ICh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQudmFsdWUgJiYgdGhpcy5lbC5uYXRpdmVFbGVtZW50LnZhbHVlLmxlbmd0aCkgfHxcbiAgICAgICAgICAgICh0aGlzLm5nTW9kZWwgJiYgdGhpcy5uZ01vZGVsLm1vZGVsKTtcbiAgICB9XG59XG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG4gICAgZXhwb3J0czogW0lucHV0VGV4dF0sXG4gICAgZGVjbGFyYXRpb25zOiBbSW5wdXRUZXh0XVxufSlcbmV4cG9ydCBjbGFzcyBJbnB1dFRleHRNb2R1bGUge1xufVxuIl19