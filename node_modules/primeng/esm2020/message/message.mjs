import { NgModule, Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class UIMessage {
    constructor() {
        this.escape = true;
    }
    get icon() {
        let icon = null;
        if (this.severity) {
            switch (this.severity) {
                case 'success':
                    icon = 'pi pi-check';
                    break;
                case 'info':
                    icon = 'pi pi-info-circle';
                    break;
                case 'error':
                    icon = 'pi pi-times-circle';
                    break;
                case 'warn':
                    icon = 'pi pi-exclamation-triangle';
                    break;
                default:
                    icon = 'pi pi-info-circle';
                    break;
            }
        }
        return icon;
    }
}
UIMessage.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: UIMessage, deps: [], target: i0.ɵɵFactoryTarget.Component });
UIMessage.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.7", type: UIMessage, selector: "p-message", inputs: { severity: "severity", text: "text", escape: "escape", style: "style", styleClass: "styleClass" }, host: { classAttribute: "p-element" }, ngImport: i0, template: `
        <div aria-live="polite" class="p-inline-message p-component p-inline-message" *ngIf="severity" [ngStyle]="style" [class]="styleClass"
        [ngClass]="{'p-inline-message-info': (severity === 'info'),
                'p-inline-message-warn': (severity === 'warn'),
                'p-inline-message-error': (severity === 'error'),
                'p-inline-message-success': (severity === 'success'),
                'p-inline-message-icon-only': this.text == null}">
            <span class="p-inline-message-icon" [ngClass]="icon"></span>
            <div *ngIf="!escape; else escapeOut">
                <span *ngIf="!escape" class="p-inline-message-text" [innerHTML]="text"></span>
            </div>
            <ng-template #escapeOut>
                <span *ngIf="escape" class="p-inline-message-text">{{text}}</span>
            </ng-template>
        </div>
    `, isInline: true, styles: [".p-inline-message{display:inline-flex;align-items:center;justify-content:center;vertical-align:top}.p-inline-message-icon-only .p-inline-message-text{visibility:hidden;width:0}.p-fluid .p-inline-message{display:flex}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: UIMessage, decorators: [{
            type: Component,
            args: [{ selector: 'p-message', template: `
        <div aria-live="polite" class="p-inline-message p-component p-inline-message" *ngIf="severity" [ngStyle]="style" [class]="styleClass"
        [ngClass]="{'p-inline-message-info': (severity === 'info'),
                'p-inline-message-warn': (severity === 'warn'),
                'p-inline-message-error': (severity === 'error'),
                'p-inline-message-success': (severity === 'success'),
                'p-inline-message-icon-only': this.text == null}">
            <span class="p-inline-message-icon" [ngClass]="icon"></span>
            <div *ngIf="!escape; else escapeOut">
                <span *ngIf="!escape" class="p-inline-message-text" [innerHTML]="text"></span>
            </div>
            <ng-template #escapeOut>
                <span *ngIf="escape" class="p-inline-message-text">{{text}}</span>
            </ng-template>
        </div>
    `, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        'class': 'p-element'
                    }, styles: [".p-inline-message{display:inline-flex;align-items:center;justify-content:center;vertical-align:top}.p-inline-message-icon-only .p-inline-message-text{visibility:hidden;width:0}.p-fluid .p-inline-message{display:flex}\n"] }]
        }], propDecorators: { severity: [{
                type: Input
            }], text: [{
                type: Input
            }], escape: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }] } });
export class MessageModule {
}
MessageModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: MessageModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MessageModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.7", ngImport: i0, type: MessageModule, declarations: [UIMessage], imports: [CommonModule], exports: [UIMessage] });
MessageModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: MessageModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: MessageModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [UIMessage],
                    declarations: [UIMessage]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy9tZXNzYWdlL21lc3NhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsS0FBSyxFQUFDLHVCQUF1QixFQUFFLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ2xHLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQzs7O0FBMkI3QyxNQUFNLE9BQU8sU0FBUztJQXpCdEI7UUErQmEsV0FBTSxHQUFZLElBQUksQ0FBQztLQW1DbkM7SUE3QkcsSUFBSSxJQUFJO1FBQ0osSUFBSSxJQUFJLEdBQVcsSUFBSSxDQUFDO1FBRXhCLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNmLFFBQU8sSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDbEIsS0FBSyxTQUFTO29CQUNWLElBQUksR0FBRyxhQUFhLENBQUM7b0JBQ3pCLE1BQU07Z0JBRU4sS0FBSyxNQUFNO29CQUNQLElBQUksR0FBRyxtQkFBbUIsQ0FBQztvQkFDL0IsTUFBTTtnQkFFTixLQUFLLE9BQU87b0JBQ1IsSUFBSSxHQUFHLG9CQUFvQixDQUFDO29CQUNoQyxNQUFNO2dCQUVOLEtBQUssTUFBTTtvQkFDUCxJQUFJLEdBQUcsNEJBQTRCLENBQUM7b0JBQ3hDLE1BQU07Z0JBRU47b0JBQ0ksSUFBSSxHQUFHLG1CQUFtQixDQUFDO29CQUMvQixNQUFNO2FBQ1Q7U0FDSjtRQUVELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7O3NHQXhDUSxTQUFTOzBGQUFULFNBQVMsb01BdkJSOzs7Ozs7Ozs7Ozs7Ozs7S0FlVDsyRkFRUSxTQUFTO2tCQXpCckIsU0FBUzsrQkFDSSxXQUFXLFlBQ1g7Ozs7Ozs7Ozs7Ozs7OztLQWVULG1CQUNnQix1QkFBdUIsQ0FBQyxNQUFNLGlCQUNoQyxpQkFBaUIsQ0FBQyxJQUFJLFFBRS9CO3dCQUNGLE9BQU8sRUFBRSxXQUFXO3FCQUN2Qjs4QkFJUSxRQUFRO3NCQUFoQixLQUFLO2dCQUVHLElBQUk7c0JBQVosS0FBSztnQkFFRyxNQUFNO3NCQUFkLEtBQUs7Z0JBRUcsS0FBSztzQkFBYixLQUFLO2dCQUVHLFVBQVU7c0JBQWxCLEtBQUs7O0FBc0NWLE1BQU0sT0FBTyxhQUFhOzswR0FBYixhQUFhOzJHQUFiLGFBQWEsaUJBaERiLFNBQVMsYUE0Q1IsWUFBWSxhQTVDYixTQUFTOzJHQWdEVCxhQUFhLFlBSlosWUFBWTsyRkFJYixhQUFhO2tCQUx6QixRQUFRO21CQUFDO29CQUNOLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztvQkFDdkIsT0FBTyxFQUFFLENBQUMsU0FBUyxDQUFDO29CQUNwQixZQUFZLEVBQUUsQ0FBQyxTQUFTLENBQUM7aUJBQzVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtOZ01vZHVsZSxDb21wb25lbnQsSW5wdXQsQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3AtbWVzc2FnZScsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGRpdiBhcmlhLWxpdmU9XCJwb2xpdGVcIiBjbGFzcz1cInAtaW5saW5lLW1lc3NhZ2UgcC1jb21wb25lbnQgcC1pbmxpbmUtbWVzc2FnZVwiICpuZ0lmPVwic2V2ZXJpdHlcIiBbbmdTdHlsZV09XCJzdHlsZVwiIFtjbGFzc109XCJzdHlsZUNsYXNzXCJcbiAgICAgICAgW25nQ2xhc3NdPVwieydwLWlubGluZS1tZXNzYWdlLWluZm8nOiAoc2V2ZXJpdHkgPT09ICdpbmZvJyksXG4gICAgICAgICAgICAgICAgJ3AtaW5saW5lLW1lc3NhZ2Utd2Fybic6IChzZXZlcml0eSA9PT0gJ3dhcm4nKSxcbiAgICAgICAgICAgICAgICAncC1pbmxpbmUtbWVzc2FnZS1lcnJvcic6IChzZXZlcml0eSA9PT0gJ2Vycm9yJyksXG4gICAgICAgICAgICAgICAgJ3AtaW5saW5lLW1lc3NhZ2Utc3VjY2Vzcyc6IChzZXZlcml0eSA9PT0gJ3N1Y2Nlc3MnKSxcbiAgICAgICAgICAgICAgICAncC1pbmxpbmUtbWVzc2FnZS1pY29uLW9ubHknOiB0aGlzLnRleHQgPT0gbnVsbH1cIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC1pbmxpbmUtbWVzc2FnZS1pY29uXCIgW25nQ2xhc3NdPVwiaWNvblwiPjwvc3Bhbj5cbiAgICAgICAgICAgIDxkaXYgKm5nSWY9XCIhZXNjYXBlOyBlbHNlIGVzY2FwZU91dFwiPlxuICAgICAgICAgICAgICAgIDxzcGFuICpuZ0lmPVwiIWVzY2FwZVwiIGNsYXNzPVwicC1pbmxpbmUtbWVzc2FnZS10ZXh0XCIgW2lubmVySFRNTF09XCJ0ZXh0XCI+PC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8bmctdGVtcGxhdGUgI2VzY2FwZU91dD5cbiAgICAgICAgICAgICAgICA8c3BhbiAqbmdJZj1cImVzY2FwZVwiIGNsYXNzPVwicC1pbmxpbmUtbWVzc2FnZS10ZXh0XCI+e3t0ZXh0fX08L3NwYW4+XG4gICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICA8L2Rpdj5cbiAgICBgLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gICAgc3R5bGVVcmxzOiBbJy4vbWVzc2FnZS5jc3MnXSxcbiAgICBob3N0OiB7XG4gICAgICAgICdjbGFzcyc6ICdwLWVsZW1lbnQnXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBVSU1lc3NhZ2Uge1xuXG4gICAgQElucHV0KCkgc2V2ZXJpdHk6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHRleHQ6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGVzY2FwZTogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBASW5wdXQoKSBzdHlsZTogYW55O1xuXG4gICAgQElucHV0KCkgc3R5bGVDbGFzczogc3RyaW5nO1xuXG4gICAgZ2V0IGljb24oKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IGljb246IHN0cmluZyA9IG51bGw7XG5cbiAgICAgICAgaWYgKHRoaXMuc2V2ZXJpdHkpIHtcbiAgICAgICAgICAgIHN3aXRjaCh0aGlzLnNldmVyaXR5KSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnc3VjY2Vzcyc6XG4gICAgICAgICAgICAgICAgICAgIGljb24gPSAncGkgcGktY2hlY2snO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnaW5mbyc6XG4gICAgICAgICAgICAgICAgICAgIGljb24gPSAncGkgcGktaW5mby1jaXJjbGUnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnZXJyb3InOlxuICAgICAgICAgICAgICAgICAgICBpY29uID0gJ3BpIHBpLXRpbWVzLWNpcmNsZSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICd3YXJuJzpcbiAgICAgICAgICAgICAgICAgICAgaWNvbiA9ICdwaSBwaS1leGNsYW1hdGlvbi10cmlhbmdsZSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBpY29uID0gJ3BpIHBpLWluZm8tY2lyY2xlJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpY29uO1xuICAgIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbVUlNZXNzYWdlXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtVSU1lc3NhZ2VdXG59KVxuZXhwb3J0IGNsYXNzIE1lc3NhZ2VNb2R1bGUgeyB9XG4iXX0=