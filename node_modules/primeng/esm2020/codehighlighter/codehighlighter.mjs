import { NgModule, Directive } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as i0 from "@angular/core";
export class CodeHighlighter {
    constructor(el) {
        this.el = el;
    }
    ngAfterViewInit() {
        if (window['Prism']) {
            window['Prism'].highlightElement(this.el.nativeElement);
        }
    }
}
CodeHighlighter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: CodeHighlighter, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
CodeHighlighter.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.0.7", type: CodeHighlighter, selector: "[pCode]", host: { classAttribute: "p-element" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: CodeHighlighter, decorators: [{
            type: Directive,
            args: [{
                    selector: '[pCode]',
                    host: {
                        'class': 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; } });
export class CodeHighlighterModule {
}
CodeHighlighterModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: CodeHighlighterModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
CodeHighlighterModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.7", ngImport: i0, type: CodeHighlighterModule, declarations: [CodeHighlighter], imports: [CommonModule], exports: [CodeHighlighter] });
CodeHighlighterModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: CodeHighlighterModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: CodeHighlighterModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [CodeHighlighter],
                    declarations: [CodeHighlighter]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZWhpZ2hsaWdodGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9jb21wb25lbnRzL2NvZGVoaWdobGlnaHRlci9jb2RlaGlnaGxpZ2h0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQTZCLE1BQU0sZUFBZSxDQUFDO0FBQy9FLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7QUFRL0MsTUFBTSxPQUFPLGVBQWU7SUFFeEIsWUFBbUIsRUFBYztRQUFkLE9BQUUsR0FBRixFQUFFLENBQVk7SUFBSSxDQUFDO0lBRXRDLGVBQWU7UUFDWCxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUNqQixNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUMzRDtJQUNMLENBQUM7OzRHQVJRLGVBQWU7Z0dBQWYsZUFBZTsyRkFBZixlQUFlO2tCQU4zQixTQUFTO21CQUFDO29CQUNQLFFBQVEsRUFBRSxTQUFTO29CQUNuQixJQUFJLEVBQUU7d0JBQ0YsT0FBTyxFQUFFLFdBQVc7cUJBQ3ZCO2lCQUNKOztBQWlCRCxNQUFNLE9BQU8scUJBQXFCOztrSEFBckIscUJBQXFCO21IQUFyQixxQkFBcUIsaUJBaEJyQixlQUFlLGFBWWQsWUFBWSxhQVpiLGVBQWU7bUhBZ0JmLHFCQUFxQixZQUpwQixZQUFZOzJGQUliLHFCQUFxQjtrQkFMakMsUUFBUTttQkFBQztvQkFDTixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7b0JBQ3ZCLE9BQU8sRUFBRSxDQUFDLGVBQWUsQ0FBQztvQkFDMUIsWUFBWSxFQUFFLENBQUMsZUFBZSxDQUFDO2lCQUNsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlLCBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEFmdGVyVmlld0luaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnW3BDb2RlXScsXG4gICAgaG9zdDoge1xuICAgICAgICAnY2xhc3MnOiAncC1lbGVtZW50J1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgQ29kZUhpZ2hsaWdodGVyIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCB7XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZWw6IEVsZW1lbnRSZWYpIHsgfVxuXG4gICAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgICAgICBpZiAod2luZG93WydQcmlzbSddKSB7XG4gICAgICAgICAgICB3aW5kb3dbJ1ByaXNtJ10uaGlnaGxpZ2h0RWxlbWVudCh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdLFxuICAgIGV4cG9ydHM6IFtDb2RlSGlnaGxpZ2h0ZXJdLFxuICAgIGRlY2xhcmF0aW9uczogW0NvZGVIaWdobGlnaHRlcl1cbn0pXG5leHBvcnQgY2xhc3MgQ29kZUhpZ2hsaWdodGVyTW9kdWxlIHsgfVxuXG5cbiJdfQ==