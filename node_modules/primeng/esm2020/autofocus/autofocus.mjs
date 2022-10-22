import { NgModule, Directive, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomHandler } from 'primeng/dom';
import * as i0 from "@angular/core";
export class AutoFocus {
    constructor(host) {
        this.host = host;
        this.focused = false;
    }
    ngAfterContentChecked() {
        if (!this.focused) {
            if (this.autofocus) {
                const focusableElements = DomHandler.getFocusableElements(this.host.nativeElement);
                if (focusableElements.length === 0) {
                    this.host.nativeElement.focus();
                }
                if (focusableElements.length > 0) {
                    focusableElements[0].focus();
                }
                this.focused = true;
            }
        }
    }
}
AutoFocus.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: AutoFocus, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
AutoFocus.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.0.7", type: AutoFocus, selector: "[pAutoFocus]", inputs: { autofocus: ["pAutoFocus", "autofocus"] }, host: { classAttribute: "p-element" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: AutoFocus, decorators: [{
            type: Directive,
            args: [{
                    selector: '[pAutoFocus]',
                    host: {
                        'class': 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { autofocus: [{
                type: Input,
                args: ['pAutoFocus']
            }] } });
export class AutoFocusModule {
}
AutoFocusModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: AutoFocusModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
AutoFocusModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.7", ngImport: i0, type: AutoFocusModule, declarations: [AutoFocus], imports: [CommonModule], exports: [AutoFocus] });
AutoFocusModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: AutoFocusModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: AutoFocusModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [AutoFocus],
                    declarations: [AutoFocus]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2ZvY3VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9jb21wb25lbnRzL2F1dG9mb2N1cy9hdXRvZm9jdXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQVksS0FBSyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ2xFLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sYUFBYSxDQUFDOztBQVN2QyxNQUFNLE9BQU8sU0FBUztJQUVsQixZQUFxQixJQUFnQjtRQUFoQixTQUFJLEdBQUosSUFBSSxDQUFZO1FBSXJDLFlBQU8sR0FBWSxLQUFLLENBQUM7SUFKZSxDQUFDO0lBTXpDLHFCQUFxQjtRQUNqQixJQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNkLElBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRTtnQkFDZixNQUFNLGlCQUFpQixHQUFHLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUVuRixJQUFHLGlCQUFpQixDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7b0JBQy9CLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFDO2lCQUNuQztnQkFDRCxJQUFHLGlCQUFpQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7b0JBQzdCLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO2lCQUNoQztnQkFFRCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQzthQUN2QjtTQUNKO0lBQ0wsQ0FBQzs7c0dBdkJRLFNBQVM7MEZBQVQsU0FBUzsyRkFBVCxTQUFTO2tCQVByQixTQUFTO21CQUFDO29CQUNQLFFBQVEsRUFBRSxjQUFjO29CQUN4QixJQUFJLEVBQUU7d0JBQ0YsT0FBTyxFQUFFLFdBQVc7cUJBQ3ZCO2lCQUNKO2lHQU13QixTQUFTO3NCQUE3QixLQUFLO3VCQUFDLFlBQVk7O0FBMkJ2QixNQUFNLE9BQU8sZUFBZTs7NEdBQWYsZUFBZTs2R0FBZixlQUFlLGlCQS9CZixTQUFTLGFBMkJSLFlBQVksYUEzQmIsU0FBUzs2R0ErQlQsZUFBZSxZQUpkLFlBQVk7MkZBSWIsZUFBZTtrQkFMM0IsUUFBUTttQkFBQztvQkFDTixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7b0JBQ3ZCLE9BQU8sRUFBRSxDQUFDLFNBQVMsQ0FBQztvQkFDcEIsWUFBWSxFQUFFLENBQUMsU0FBUyxDQUFDO2lCQUM1QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TmdNb2R1bGUsRGlyZWN0aXZlLEVsZW1lbnRSZWYsSW5wdXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0RvbUhhbmRsZXJ9IGZyb20gJ3ByaW1lbmcvZG9tJztcblxuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6ICdbcEF1dG9Gb2N1c10nLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgJ2NsYXNzJzogJ3AtZWxlbWVudCdcbiAgICB9XG59KVxuXG5leHBvcnQgY2xhc3MgQXV0b0ZvY3VzIHtcblxuICAgIGNvbnN0cnVjdG9yIChwcml2YXRlIGhvc3Q6IEVsZW1lbnRSZWYpIHt9XG5cbiAgICBASW5wdXQoJ3BBdXRvRm9jdXMnKSBhdXRvZm9jdXM6IGJvb2xlYW47XG5cbiAgICBmb2N1c2VkOiBib29sZWFuID0gZmFsc2U7XG4gICAgXG4gICAgbmdBZnRlckNvbnRlbnRDaGVja2VkICgpIHtcbiAgICAgICAgaWYoIXRoaXMuZm9jdXNlZCkge1xuICAgICAgICAgICAgaWYodGhpcy5hdXRvZm9jdXMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmb2N1c2FibGVFbGVtZW50cyA9IERvbUhhbmRsZXIuZ2V0Rm9jdXNhYmxlRWxlbWVudHModGhpcy5ob3N0Lm5hdGl2ZUVsZW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgaWYoZm9jdXNhYmxlRWxlbWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaG9zdC5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmKGZvY3VzYWJsZUVsZW1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZm9jdXNhYmxlRWxlbWVudHNbMF0uZm9jdXMoKTsgICBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdGhpcy5mb2N1c2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbQXV0b0ZvY3VzXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtBdXRvRm9jdXNdXG59KVxuZXhwb3J0IGNsYXNzIEF1dG9Gb2N1c01vZHVsZSB7IH1cbiJdfQ==