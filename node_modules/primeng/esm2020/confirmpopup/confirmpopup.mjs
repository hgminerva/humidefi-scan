import { NgModule, Component, ChangeDetectionStrategy, ViewEncapsulation, Input, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationKeys } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ZIndexUtils } from 'primeng/utils';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { DomHandler, ConnectedOverlayScrollHandler } from 'primeng/dom';
import * as i0 from "@angular/core";
import * as i1 from "primeng/api";
import * as i2 from "@angular/common";
import * as i3 from "primeng/button";
export class ConfirmPopup {
    constructor(el, confirmationService, renderer, cd, config, overlayService) {
        this.el = el;
        this.confirmationService = confirmationService;
        this.renderer = renderer;
        this.cd = cd;
        this.config = config;
        this.overlayService = overlayService;
        this.defaultFocus = "accept";
        this.showTransitionOptions = '.12s cubic-bezier(0, 0, 0.2, 1)';
        this.hideTransitionOptions = '.1s linear';
        this.autoZIndex = true;
        this.baseZIndex = 0;
        this.subscription = this.confirmationService.requireConfirmation$.subscribe(confirmation => {
            if (!confirmation) {
                this.hide();
                return;
            }
            if (confirmation.key === this.key) {
                this.confirmation = confirmation;
                if (this.confirmation.accept) {
                    this.confirmation.acceptEvent = new EventEmitter();
                    this.confirmation.acceptEvent.subscribe(this.confirmation.accept);
                }
                if (this.confirmation.reject) {
                    this.confirmation.rejectEvent = new EventEmitter();
                    this.confirmation.rejectEvent.subscribe(this.confirmation.reject);
                }
                this.visible = true;
            }
        });
    }
    get visible() {
        return this._visible;
    }
    set visible(value) {
        this._visible = value;
        this.cd.markForCheck();
    }
    onAnimationStart(event) {
        if (event.toState === 'open') {
            this.container = event.element;
            document.body.appendChild(this.container);
            this.align();
            this.bindListeners();
            const element = this.getElementToFocus();
            if (element) {
                element.focus();
            }
        }
    }
    onAnimationEnd(event) {
        switch (event.toState) {
            case 'void':
                this.onContainerDestroy();
                break;
        }
    }
    getElementToFocus() {
        switch (this.defaultFocus) {
            case 'accept':
                return DomHandler.findSingle(this.container, '.p-confirm-popup-accept');
            case 'reject':
                return DomHandler.findSingle(this.container, '.p-confirm-popup-reject');
            case 'none':
                return null;
        }
    }
    align() {
        if (this.autoZIndex) {
            ZIndexUtils.set('overlay', this.container, this.config.zIndex.overlay);
        }
        DomHandler.absolutePosition(this.container, this.confirmation.target);
        const containerOffset = DomHandler.getOffset(this.container);
        const targetOffset = DomHandler.getOffset(this.confirmation.target);
        let arrowLeft = 0;
        if (containerOffset.left < targetOffset.left) {
            arrowLeft = targetOffset.left - containerOffset.left;
        }
        this.container.style.setProperty('--overlayArrowLeft', `${arrowLeft}px`);
        if (containerOffset.top < targetOffset.top) {
            DomHandler.addClass(this.container, 'p-confirm-popup-flipped');
        }
    }
    hide() {
        this.visible = false;
    }
    accept() {
        if (this.confirmation.acceptEvent) {
            this.confirmation.acceptEvent.emit();
        }
        this.hide();
    }
    reject() {
        if (this.confirmation.rejectEvent) {
            this.confirmation.rejectEvent.emit();
        }
        this.hide();
    }
    onOverlayClick(event) {
        this.overlayService.add({
            originalEvent: event,
            target: this.el.nativeElement
        });
    }
    bindListeners() {
        /*
         * Called inside `setTimeout` to avoid listening to the click event that appears when `confirm` is first called(bubbling).
         * Need wait when bubbling event up and hang the handler on the next tick.
         * This is the case when eventTarget and confirmation.target do not match when the `confirm` method is called.
         */
        setTimeout(() => {
            this.bindDocumentClickListener();
            this.bindDocumentResizeListener();
            this.bindScrollListener();
        });
    }
    unbindListeners() {
        this.unbindDocumentClickListener();
        this.unbindDocumentResizeListener();
        this.unbindScrollListener();
    }
    bindDocumentClickListener() {
        if (!this.documentClickListener) {
            let documentEvent = DomHandler.isIOS() ? 'touchstart' : 'click';
            const documentTarget = this.el ? this.el.nativeElement.ownerDocument : document;
            this.documentClickListener = this.renderer.listen(documentTarget, documentEvent, (event) => {
                let targetElement = this.confirmation.target;
                if (this.container !== event.target && !this.container.contains(event.target) &&
                    targetElement !== event.target && !targetElement.contains(event.target)) {
                    this.hide();
                }
            });
        }
    }
    unbindDocumentClickListener() {
        if (this.documentClickListener) {
            this.documentClickListener();
            this.documentClickListener = null;
        }
    }
    onWindowResize() {
        if (this.visible && !DomHandler.isTouchDevice()) {
            this.hide();
        }
    }
    bindDocumentResizeListener() {
        this.documentResizeListener = this.onWindowResize.bind(this);
        window.addEventListener('resize', this.documentResizeListener);
    }
    unbindDocumentResizeListener() {
        if (this.documentResizeListener) {
            window.removeEventListener('resize', this.documentResizeListener);
            this.documentResizeListener = null;
        }
    }
    bindScrollListener() {
        if (!this.scrollHandler) {
            this.scrollHandler = new ConnectedOverlayScrollHandler(this.confirmation.target, () => {
                if (this.visible) {
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
    unsubscribeConfirmationSubscriptions() {
        if (this.confirmation) {
            if (this.confirmation.acceptEvent) {
                this.confirmation.acceptEvent.unsubscribe();
            }
            if (this.confirmation.rejectEvent) {
                this.confirmation.rejectEvent.unsubscribe();
            }
        }
    }
    onContainerDestroy() {
        this.unbindListeners();
        this.unsubscribeConfirmationSubscriptions();
        if (this.autoZIndex) {
            ZIndexUtils.clear(this.container);
        }
        this.confirmation = null;
        this.container = null;
    }
    restoreAppend() {
        if (this.container) {
            document.body.removeChild(this.container);
        }
        this.onContainerDestroy();
    }
    get acceptButtonLabel() {
        return this.confirmation.acceptLabel || this.config.getTranslation(TranslationKeys.ACCEPT);
    }
    get rejectButtonLabel() {
        return this.confirmation.rejectLabel || this.config.getTranslation(TranslationKeys.REJECT);
    }
    ngOnDestroy() {
        this.restoreAppend();
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
ConfirmPopup.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ConfirmPopup, deps: [{ token: i0.ElementRef }, { token: i1.ConfirmationService }, { token: i0.Renderer2 }, { token: i0.ChangeDetectorRef }, { token: i1.PrimeNGConfig }, { token: i1.OverlayService }], target: i0.ɵɵFactoryTarget.Component });
ConfirmPopup.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.7", type: ConfirmPopup, selector: "p-confirmPopup", inputs: { key: "key", defaultFocus: "defaultFocus", showTransitionOptions: "showTransitionOptions", hideTransitionOptions: "hideTransitionOptions", autoZIndex: "autoZIndex", baseZIndex: "baseZIndex", style: "style", styleClass: "styleClass", visible: "visible" }, host: { classAttribute: "p-element" }, ngImport: i0, template: `
        <div *ngIf="visible" [ngClass]="'p-confirm-popup p-component'" [ngStyle]="style" [class]="styleClass" (click)="onOverlayClick($event)"
            [@animation]="{value: 'open', params: {showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions}}"
            (@animation.start)="onAnimationStart($event)" (@animation.done)="onAnimationEnd($event)">
            <div #content class="p-confirm-popup-content">
                <i [ngClass]="'p-confirm-popup-icon'" [class]="confirmation.icon" *ngIf="confirmation.icon"></i>
                <span class="p-confirm-popup-message">{{confirmation.message}}</span>
            </div>
            <div class="p-confirm-popup-footer">
                <button type="button" pButton [icon]="confirmation.rejectIcon" [label]="rejectButtonLabel" (click)="reject()" [ngClass]="'p-confirm-popup-reject p-button-sm'"
                    [class]="confirmation.rejectButtonStyleClass || 'p-button-text'" *ngIf="confirmation.rejectVisible !== false" [attr.aria-label]="rejectButtonLabel"></button>
                <button type="button" pButton [icon]="confirmation.acceptIcon" [label]="acceptButtonLabel" (click)="accept()" [ngClass]="'p-confirm-popup-accept p-button-sm'"
                    [class]="confirmation.acceptButtonStyleClass" *ngIf="confirmation.acceptVisible !== false" [attr.aria-label]="acceptButtonLabel"></button>
            </div>
        </div>
    `, isInline: true, styles: [".p-confirm-popup{position:absolute;margin-top:10px;top:0;left:0}.p-confirm-popup-flipped{margin-top:0;margin-bottom:10px}.p-confirm-popup:after,.p-confirm-popup:before{bottom:100%;left:calc(var(--overlayArrowLeft, 0) + 1.25rem);content:\" \";height:0;width:0;position:absolute;pointer-events:none}.p-confirm-popup:after{border-width:8px;margin-left:-8px}.p-confirm-popup:before{border-width:10px;margin-left:-10px}.p-confirm-popup-flipped:after,.p-confirm-popup-flipped:before{bottom:auto;top:100%}.p-confirm-popup.p-confirm-popup-flipped:after{border-bottom-color:transparent}.p-confirm-popup.p-confirm-popup-flipped:before{border-bottom-color:transparent}.p-confirm-popup .p-confirm-popup-content{display:flex;align-items:center}\n"], dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i3.ButtonDirective, selector: "[pButton]", inputs: ["iconPos", "loadingIcon", "label", "icon", "loading"] }], animations: [
        trigger('animation', [
            state('void', style({
                transform: 'scaleY(0.8)',
                opacity: 0
            })),
            state('open', style({
                transform: 'translateY(0)',
                opacity: 1
            })),
            transition('void => open', animate('{{showTransitionParams}}')),
            transition('open => void', animate('{{hideTransitionParams}}')),
        ])
    ], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ConfirmPopup, decorators: [{
            type: Component,
            args: [{ selector: 'p-confirmPopup', template: `
        <div *ngIf="visible" [ngClass]="'p-confirm-popup p-component'" [ngStyle]="style" [class]="styleClass" (click)="onOverlayClick($event)"
            [@animation]="{value: 'open', params: {showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions}}"
            (@animation.start)="onAnimationStart($event)" (@animation.done)="onAnimationEnd($event)">
            <div #content class="p-confirm-popup-content">
                <i [ngClass]="'p-confirm-popup-icon'" [class]="confirmation.icon" *ngIf="confirmation.icon"></i>
                <span class="p-confirm-popup-message">{{confirmation.message}}</span>
            </div>
            <div class="p-confirm-popup-footer">
                <button type="button" pButton [icon]="confirmation.rejectIcon" [label]="rejectButtonLabel" (click)="reject()" [ngClass]="'p-confirm-popup-reject p-button-sm'"
                    [class]="confirmation.rejectButtonStyleClass || 'p-button-text'" *ngIf="confirmation.rejectVisible !== false" [attr.aria-label]="rejectButtonLabel"></button>
                <button type="button" pButton [icon]="confirmation.acceptIcon" [label]="acceptButtonLabel" (click)="accept()" [ngClass]="'p-confirm-popup-accept p-button-sm'"
                    [class]="confirmation.acceptButtonStyleClass" *ngIf="confirmation.acceptVisible !== false" [attr.aria-label]="acceptButtonLabel"></button>
            </div>
        </div>
    `, animations: [
                        trigger('animation', [
                            state('void', style({
                                transform: 'scaleY(0.8)',
                                opacity: 0
                            })),
                            state('open', style({
                                transform: 'translateY(0)',
                                opacity: 1
                            })),
                            transition('void => open', animate('{{showTransitionParams}}')),
                            transition('open => void', animate('{{hideTransitionParams}}')),
                        ])
                    ], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        'class': 'p-element'
                    }, styles: [".p-confirm-popup{position:absolute;margin-top:10px;top:0;left:0}.p-confirm-popup-flipped{margin-top:0;margin-bottom:10px}.p-confirm-popup:after,.p-confirm-popup:before{bottom:100%;left:calc(var(--overlayArrowLeft, 0) + 1.25rem);content:\" \";height:0;width:0;position:absolute;pointer-events:none}.p-confirm-popup:after{border-width:8px;margin-left:-8px}.p-confirm-popup:before{border-width:10px;margin-left:-10px}.p-confirm-popup-flipped:after,.p-confirm-popup-flipped:before{bottom:auto;top:100%}.p-confirm-popup.p-confirm-popup-flipped:after{border-bottom-color:transparent}.p-confirm-popup.p-confirm-popup-flipped:before{border-bottom-color:transparent}.p-confirm-popup .p-confirm-popup-content{display:flex;align-items:center}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.ConfirmationService }, { type: i0.Renderer2 }, { type: i0.ChangeDetectorRef }, { type: i1.PrimeNGConfig }, { type: i1.OverlayService }]; }, propDecorators: { key: [{
                type: Input
            }], defaultFocus: [{
                type: Input
            }], showTransitionOptions: [{
                type: Input
            }], hideTransitionOptions: [{
                type: Input
            }], autoZIndex: [{
                type: Input
            }], baseZIndex: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], visible: [{
                type: Input
            }] } });
export class ConfirmPopupModule {
}
ConfirmPopupModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ConfirmPopupModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ConfirmPopupModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.7", ngImport: i0, type: ConfirmPopupModule, declarations: [ConfirmPopup], imports: [CommonModule, ButtonModule], exports: [ConfirmPopup] });
ConfirmPopupModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ConfirmPopupModule, imports: [CommonModule, ButtonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ConfirmPopupModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ButtonModule],
                    exports: [ConfirmPopup],
                    declarations: [ConfirmPopup]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlybXBvcHVwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9jb21wb25lbnRzL2NvbmZpcm1wb3B1cC9jb25maXJtcG9wdXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsdUJBQXVCLEVBQUUsaUJBQWlCLEVBQTRDLEtBQUssRUFBRSxZQUFZLEVBQVksTUFBTSxlQUFlLENBQUM7QUFDeEssT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzdDLE9BQU8sRUFBbUUsZUFBZSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBRTlHLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUM1QyxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzFDLE9BQU8sRUFBQyxPQUFPLEVBQUMsS0FBSyxFQUFDLEtBQUssRUFBQyxVQUFVLEVBQUMsT0FBTyxFQUFnQixNQUFNLHFCQUFxQixDQUFDO0FBQzFGLE9BQU8sRUFBQyxVQUFVLEVBQUUsNkJBQTZCLEVBQUMsTUFBTSxhQUFhLENBQUM7Ozs7O0FBeUN0RSxNQUFNLE9BQU8sWUFBWTtJQXdDckIsWUFBbUIsRUFBYyxFQUFVLG1CQUF3QyxFQUFTLFFBQW1CLEVBQVUsRUFBcUIsRUFBUyxNQUFxQixFQUFTLGNBQThCO1FBQWhNLE9BQUUsR0FBRixFQUFFLENBQVk7UUFBVSx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBQVMsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUFVLE9BQUUsR0FBRixFQUFFLENBQW1CO1FBQVMsV0FBTSxHQUFOLE1BQU0sQ0FBZTtRQUFTLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQXBDMU0saUJBQVksR0FBVyxRQUFRLENBQUM7UUFFaEMsMEJBQXFCLEdBQVcsaUNBQWlDLENBQUM7UUFFbEUsMEJBQXFCLEdBQVcsWUFBWSxDQUFDO1FBRTdD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Q29udGVudCI6WyJpbXBvcnQge05nTW9kdWxlICxDb21wb25lbnQsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBWaWV3RW5jYXBzdWxhdGlvbiwgRWxlbWVudFJlZiwgQ2hhbmdlRGV0ZWN0b3JSZWYsIE9uRGVzdHJveSwgSW5wdXQsIEV2ZW50RW1pdHRlciwgUmVuZGVyZXIyfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtDb25maXJtYXRpb24sIENvbmZpcm1hdGlvblNlcnZpY2UsIE92ZXJsYXlTZXJ2aWNlLCBQcmltZU5HQ29uZmlnLCBUcmFuc2xhdGlvbktleXN9IGZyb20gJ3ByaW1lbmcvYXBpJztcbmltcG9ydCB7U3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcbmltcG9ydCB7QnV0dG9uTW9kdWxlfSBmcm9tICdwcmltZW5nL2J1dHRvbic7XG5pbXBvcnQge1pJbmRleFV0aWxzfSBmcm9tICdwcmltZW5nL3V0aWxzJztcbmltcG9ydCB7dHJpZ2dlcixzdGF0ZSxzdHlsZSx0cmFuc2l0aW9uLGFuaW1hdGUsQW5pbWF0aW9uRXZlbnR9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtEb21IYW5kbGVyLCBDb25uZWN0ZWRPdmVybGF5U2Nyb2xsSGFuZGxlcn0gZnJvbSAncHJpbWVuZy9kb20nO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3AtY29uZmlybVBvcHVwJyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8ZGl2ICpuZ0lmPVwidmlzaWJsZVwiIFtuZ0NsYXNzXT1cIidwLWNvbmZpcm0tcG9wdXAgcC1jb21wb25lbnQnXCIgW25nU3R5bGVdPVwic3R5bGVcIiBbY2xhc3NdPVwic3R5bGVDbGFzc1wiIChjbGljayk9XCJvbk92ZXJsYXlDbGljaygkZXZlbnQpXCJcbiAgICAgICAgICAgIFtAYW5pbWF0aW9uXT1cInt2YWx1ZTogJ29wZW4nLCBwYXJhbXM6IHtzaG93VHJhbnNpdGlvblBhcmFtczogc2hvd1RyYW5zaXRpb25PcHRpb25zLCBoaWRlVHJhbnNpdGlvblBhcmFtczogaGlkZVRyYW5zaXRpb25PcHRpb25zfX1cIlxuICAgICAgICAgICAgKEBhbmltYXRpb24uc3RhcnQpPVwib25BbmltYXRpb25TdGFydCgkZXZlbnQpXCIgKEBhbmltYXRpb24uZG9uZSk9XCJvbkFuaW1hdGlvbkVuZCgkZXZlbnQpXCI+XG4gICAgICAgICAgICA8ZGl2ICNjb250ZW50IGNsYXNzPVwicC1jb25maXJtLXBvcHVwLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICA8aSBbbmdDbGFzc109XCIncC1jb25maXJtLXBvcHVwLWljb24nXCIgW2NsYXNzXT1cImNvbmZpcm1hdGlvbi5pY29uXCIgKm5nSWY9XCJjb25maXJtYXRpb24uaWNvblwiPjwvaT5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtY29uZmlybS1wb3B1cC1tZXNzYWdlXCI+e3tjb25maXJtYXRpb24ubWVzc2FnZX19PC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC1jb25maXJtLXBvcHVwLWZvb3RlclwiPlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIHBCdXR0b24gW2ljb25dPVwiY29uZmlybWF0aW9uLnJlamVjdEljb25cIiBbbGFiZWxdPVwicmVqZWN0QnV0dG9uTGFiZWxcIiAoY2xpY2spPVwicmVqZWN0KClcIiBbbmdDbGFzc109XCIncC1jb25maXJtLXBvcHVwLXJlamVjdCBwLWJ1dHRvbi1zbSdcIlxuICAgICAgICAgICAgICAgICAgICBbY2xhc3NdPVwiY29uZmlybWF0aW9uLnJlamVjdEJ1dHRvblN0eWxlQ2xhc3MgfHwgJ3AtYnV0dG9uLXRleHQnXCIgKm5nSWY9XCJjb25maXJtYXRpb24ucmVqZWN0VmlzaWJsZSAhPT0gZmFsc2VcIiBbYXR0ci5hcmlhLWxhYmVsXT1cInJlamVjdEJ1dHRvbkxhYmVsXCI+PC9idXR0b24+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgcEJ1dHRvbiBbaWNvbl09XCJjb25maXJtYXRpb24uYWNjZXB0SWNvblwiIFtsYWJlbF09XCJhY2NlcHRCdXR0b25MYWJlbFwiIChjbGljayk9XCJhY2NlcHQoKVwiIFtuZ0NsYXNzXT1cIidwLWNvbmZpcm0tcG9wdXAtYWNjZXB0IHAtYnV0dG9uLXNtJ1wiXG4gICAgICAgICAgICAgICAgICAgIFtjbGFzc109XCJjb25maXJtYXRpb24uYWNjZXB0QnV0dG9uU3R5bGVDbGFzc1wiICpuZ0lmPVwiY29uZmlybWF0aW9uLmFjY2VwdFZpc2libGUgIT09IGZhbHNlXCIgW2F0dHIuYXJpYS1sYWJlbF09XCJhY2NlcHRCdXR0b25MYWJlbFwiPjwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIGAsXG4gICAgYW5pbWF0aW9uczogW1xuICAgICAgICB0cmlnZ2VyKCdhbmltYXRpb24nLCBbXG4gICAgICAgICAgICBzdGF0ZSgndm9pZCcsIHN0eWxlKHtcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm06ICdzY2FsZVkoMC44KScsXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMFxuICAgICAgICAgICAgfSkpLFxuICAgICAgICAgICAgc3RhdGUoJ29wZW4nLCBzdHlsZSh7XG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSgwKScsXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMVxuICAgICAgICAgICAgfSkpLFxuICAgICAgICAgICAgdHJhbnNpdGlvbigndm9pZCA9PiBvcGVuJywgYW5pbWF0ZSgne3tzaG93VHJhbnNpdGlvblBhcmFtc319JykpLFxuICAgICAgICAgICAgdHJhbnNpdGlvbignb3BlbiA9PiB2b2lkJywgYW5pbWF0ZSgne3toaWRlVHJhbnNpdGlvblBhcmFtc319JykpLFxuICAgICAgICBdKVxuICAgIF0sXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgICBzdHlsZVVybHM6IFsnLi9jb25maXJtcG9wdXAuY3NzJ10sXG4gICAgaG9zdDoge1xuICAgICAgICAnY2xhc3MnOiAncC1lbGVtZW50J1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgQ29uZmlybVBvcHVwIGltcGxlbWVudHMgT25EZXN0cm95IHtcblxuICAgIEBJbnB1dCgpIGtleTogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgZGVmYXVsdEZvY3VzOiBzdHJpbmcgPSBcImFjY2VwdFwiO1xuXG4gICAgQElucHV0KCkgc2hvd1RyYW5zaXRpb25PcHRpb25zOiBzdHJpbmcgPSAnLjEycyBjdWJpYy1iZXppZXIoMCwgMCwgMC4yLCAxKSc7XG5cbiAgICBASW5wdXQoKSBoaWRlVHJhbnNpdGlvbk9wdGlvbnM6IHN0cmluZyA9ICcuMXMgbGluZWFyJztcblxuICAgIEBJbnB1dCgpIGF1dG9aSW5kZXg6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgQElucHV0KCkgYmFzZVpJbmRleDogbnVtYmVyID0gMDtcblxuICAgIEBJbnB1dCgpIHN0eWxlOiBhbnk7XG5cbiAgICBASW5wdXQoKSBzdHlsZUNsYXNzOiBzdHJpbmc7XG5cbiAgICBjb250YWluZXI6IEhUTUxEaXZFbGVtZW50O1xuXG4gICAgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgICBjb25maXJtYXRpb246IENvbmZpcm1hdGlvbjtcblxuICAgIF92aXNpYmxlOiBib29sZWFuO1xuXG4gICAgZG9jdW1lbnRDbGlja0xpc3RlbmVyOiBhbnk7XG5cbiAgICBkb2N1bWVudFJlc2l6ZUxpc3RlbmVyOiBhbnk7XG5cbiAgICBzY3JvbGxIYW5kbGVyOiBhbnk7XG5cbiAgICBASW5wdXQoKSBnZXQgdmlzaWJsZSgpOiBhbnkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdmlzaWJsZTtcbiAgICB9XG4gICAgc2V0IHZpc2libGUodmFsdWU6YW55KSB7XG4gICAgICAgIHRoaXMuX3Zpc2libGUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZWw6IEVsZW1lbnRSZWYsIHByaXZhdGUgY29uZmlybWF0aW9uU2VydmljZTogQ29uZmlybWF0aW9uU2VydmljZSwgcHVibGljIHJlbmRlcmVyOiBSZW5kZXJlcjIsIHByaXZhdGUgY2Q6IENoYW5nZURldGVjdG9yUmVmLCBwdWJsaWMgY29uZmlnOiBQcmltZU5HQ29uZmlnLCBwdWJsaWMgb3ZlcmxheVNlcnZpY2U6IE92ZXJsYXlTZXJ2aWNlKSB7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uID0gdGhpcy5jb25maXJtYXRpb25TZXJ2aWNlLnJlcXVpcmVDb25maXJtYXRpb24kLnN1YnNjcmliZShjb25maXJtYXRpb24gPT4ge1xuICAgICAgICAgICAgaWYgKCFjb25maXJtYXRpb24pIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjb25maXJtYXRpb24ua2V5ID09PSB0aGlzLmtleSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY29uZmlybWF0aW9uID0gY29uZmlybWF0aW9uO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbmZpcm1hdGlvbi5hY2NlcHQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25maXJtYXRpb24uYWNjZXB0RXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29uZmlybWF0aW9uLmFjY2VwdEV2ZW50LnN1YnNjcmliZSh0aGlzLmNvbmZpcm1hdGlvbi5hY2NlcHQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbmZpcm1hdGlvbi5yZWplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25maXJtYXRpb24ucmVqZWN0RXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29uZmlybWF0aW9uLnJlamVjdEV2ZW50LnN1YnNjcmliZSh0aGlzLmNvbmZpcm1hdGlvbi5yZWplY3QpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMudmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG9uQW5pbWF0aW9uU3RhcnQoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC50b1N0YXRlID09PSAnb3BlbicpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyID0gZXZlbnQuZWxlbWVudDtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5jb250YWluZXIpO1xuICAgICAgICAgICAgdGhpcy5hbGlnbigpO1xuICAgICAgICAgICAgdGhpcy5iaW5kTGlzdGVuZXJzKCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmdldEVsZW1lbnRUb0ZvY3VzKCk7XG4gICAgICAgICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uQW5pbWF0aW9uRW5kKGV2ZW50OiBBbmltYXRpb25FdmVudCkge1xuICAgICAgICBzd2l0Y2ggKGV2ZW50LnRvU3RhdGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3ZvaWQnOlxuICAgICAgICAgICAgICAgIHRoaXMub25Db250YWluZXJEZXN0cm95KCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldEVsZW1lbnRUb0ZvY3VzKCkge1xuICAgICAgICBzd2l0Y2godGhpcy5kZWZhdWx0Rm9jdXMpIHtcbiAgICAgICAgICAgIGNhc2UgJ2FjY2VwdCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIERvbUhhbmRsZXIuZmluZFNpbmdsZSh0aGlzLmNvbnRhaW5lciwgJy5wLWNvbmZpcm0tcG9wdXAtYWNjZXB0Jyk7XG5cbiAgICAgICAgICAgIGNhc2UgJ3JlamVjdCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIERvbUhhbmRsZXIuZmluZFNpbmdsZSh0aGlzLmNvbnRhaW5lciwgJy5wLWNvbmZpcm0tcG9wdXAtcmVqZWN0Jyk7XG5cbiAgICAgICAgICAgIGNhc2UgJ25vbmUnOlxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWxpZ24oKSB7XG4gICAgICAgIGlmICh0aGlzLmF1dG9aSW5kZXgpIHtcbiAgICAgICAgICAgIFpJbmRleFV0aWxzLnNldCgnb3ZlcmxheScsIHRoaXMuY29udGFpbmVyLCB0aGlzLmNvbmZpZy56SW5kZXgub3ZlcmxheSk7XG4gICAgICAgIH1cblxuICAgICAgICBEb21IYW5kbGVyLmFic29sdXRlUG9zaXRpb24odGhpcy5jb250YWluZXIsIHRoaXMuY29uZmlybWF0aW9uLnRhcmdldCk7XG5cbiAgICAgICAgY29uc3QgY29udGFpbmVyT2Zmc2V0ID0gRG9tSGFuZGxlci5nZXRPZmZzZXQodGhpcy5jb250YWluZXIpO1xuICAgICAgICBjb25zdCB0YXJnZXRPZmZzZXQgPSBEb21IYW5kbGVyLmdldE9mZnNldCh0aGlzLmNvbmZpcm1hdGlvbi50YXJnZXQpO1xuICAgICAgICBsZXQgYXJyb3dMZWZ0ID0gMDtcblxuICAgICAgICBpZiAoY29udGFpbmVyT2Zmc2V0LmxlZnQgPCB0YXJnZXRPZmZzZXQubGVmdCkge1xuICAgICAgICAgICAgYXJyb3dMZWZ0ID0gdGFyZ2V0T2Zmc2V0LmxlZnQgLSBjb250YWluZXJPZmZzZXQubGVmdDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS5zZXRQcm9wZXJ0eSgnLS1vdmVybGF5QXJyb3dMZWZ0JywgYCR7YXJyb3dMZWZ0fXB4YCk7XG5cbiAgICAgICAgaWYgKGNvbnRhaW5lck9mZnNldC50b3AgPCB0YXJnZXRPZmZzZXQudG9wKSB7XG4gICAgICAgICAgICBEb21IYW5kbGVyLmFkZENsYXNzKHRoaXMuY29udGFpbmVyLCAncC1jb25maXJtLXBvcHVwLWZsaXBwZWQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhpZGUoKSB7XG4gICAgICAgIHRoaXMudmlzaWJsZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIGFjY2VwdCgpIHtcbiAgICAgICAgaWYgKHRoaXMuY29uZmlybWF0aW9uLmFjY2VwdEV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLmNvbmZpcm1hdGlvbi5hY2NlcHRFdmVudC5lbWl0KCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICB9XG5cbiAgICByZWplY3QoKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbmZpcm1hdGlvbi5yZWplY3RFdmVudCkge1xuICAgICAgICAgICAgdGhpcy5jb25maXJtYXRpb24ucmVqZWN0RXZlbnQuZW1pdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgfVxuXG4gICAgb25PdmVybGF5Q2xpY2soZXZlbnQpIHtcbiAgICAgICAgdGhpcy5vdmVybGF5U2VydmljZS5hZGQoe1xuICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZlbnQsXG4gICAgICAgICAgICB0YXJnZXQ6IHRoaXMuZWwubmF0aXZlRWxlbWVudFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBiaW5kTGlzdGVuZXJzKCk6IHZvaWQge1xuICAgICAgICAvKlxuICAgICAgICAgKiBDYWxsZWQgaW5zaWRlIGBzZXRUaW1lb3V0YCB0byBhdm9pZCBsaXN0ZW5pbmcgdG8gdGhlIGNsaWNrIGV2ZW50IHRoYXQgYXBwZWFycyB3aGVuIGBjb25maXJtYCBpcyBmaXJzdCBjYWxsZWQoYnViYmxpbmcpLlxuICAgICAgICAgKiBOZWVkIHdhaXQgd2hlbiBidWJibGluZyBldmVudCB1cCBhbmQgaGFuZyB0aGUgaGFuZGxlciBvbiB0aGUgbmV4dCB0aWNrLlxuICAgICAgICAgKiBUaGlzIGlzIHRoZSBjYXNlIHdoZW4gZXZlbnRUYXJnZXQgYW5kIGNvbmZpcm1hdGlvbi50YXJnZXQgZG8gbm90IG1hdGNoIHdoZW4gdGhlIGBjb25maXJtYCBtZXRob2QgaXMgY2FsbGVkLlxuICAgICAgICAgKi9cbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmJpbmREb2N1bWVudENsaWNrTGlzdGVuZXIoKTtcbiAgICAgICAgICAgIHRoaXMuYmluZERvY3VtZW50UmVzaXplTGlzdGVuZXIoKTtcbiAgICAgICAgICAgIHRoaXMuYmluZFNjcm9sbExpc3RlbmVyKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHVuYmluZExpc3RlbmVycygpIHtcbiAgICAgICAgdGhpcy51bmJpbmREb2N1bWVudENsaWNrTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy51bmJpbmREb2N1bWVudFJlc2l6ZUxpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMudW5iaW5kU2Nyb2xsTGlzdGVuZXIoKTtcbiAgICB9XG5cbiAgICBiaW5kRG9jdW1lbnRDbGlja0xpc3RlbmVyKCkge1xuICAgICAgICBpZiAoIXRoaXMuZG9jdW1lbnRDbGlja0xpc3RlbmVyKSB7XG4gICAgICAgICAgICBsZXQgZG9jdW1lbnRFdmVudCA9IERvbUhhbmRsZXIuaXNJT1MoKSA/ICd0b3VjaHN0YXJ0JyA6ICdjbGljayc7XG4gICAgICAgICAgICBjb25zdCBkb2N1bWVudFRhcmdldDogYW55ID0gdGhpcy5lbCA/IHRoaXMuZWwubmF0aXZlRWxlbWVudC5vd25lckRvY3VtZW50IDogZG9jdW1lbnQ7XG5cbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRDbGlja0xpc3RlbmVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oZG9jdW1lbnRUYXJnZXQsIGRvY3VtZW50RXZlbnQsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCB0YXJnZXRFbGVtZW50ID0gPEhUTUxFbGVtZW50PiB0aGlzLmNvbmZpcm1hdGlvbi50YXJnZXQ7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY29udGFpbmVyICE9PSBldmVudC50YXJnZXQgJiYgIXRoaXMuY29udGFpbmVyLmNvbnRhaW5zKGV2ZW50LnRhcmdldCkgJiZcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0RWxlbWVudCAhPT0gZXZlbnQudGFyZ2V0ICYmICF0YXJnZXRFbGVtZW50LmNvbnRhaW5zKGV2ZW50LnRhcmdldCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1bmJpbmREb2N1bWVudENsaWNrTGlzdGVuZXIoKSB7XG4gICAgICAgIGlmICh0aGlzLmRvY3VtZW50Q2xpY2tMaXN0ZW5lcikge1xuICAgICAgICAgICAgdGhpcy5kb2N1bWVudENsaWNrTGlzdGVuZXIoKTtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRDbGlja0xpc3RlbmVyID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uV2luZG93UmVzaXplKCkge1xuICAgICAgICBpZiAodGhpcy52aXNpYmxlICYmICFEb21IYW5kbGVyLmlzVG91Y2hEZXZpY2UoKSkge1xuICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBiaW5kRG9jdW1lbnRSZXNpemVMaXN0ZW5lcigpIHtcbiAgICAgICAgdGhpcy5kb2N1bWVudFJlc2l6ZUxpc3RlbmVyID0gdGhpcy5vbldpbmRvd1Jlc2l6ZS5iaW5kKHRoaXMpO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5kb2N1bWVudFJlc2l6ZUxpc3RlbmVyKTtcbiAgICB9XG5cbiAgICB1bmJpbmREb2N1bWVudFJlc2l6ZUxpc3RlbmVyKCkge1xuICAgICAgICBpZiAodGhpcy5kb2N1bWVudFJlc2l6ZUxpc3RlbmVyKSB7XG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5kb2N1bWVudFJlc2l6ZUxpc3RlbmVyKTtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRSZXNpemVMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBiaW5kU2Nyb2xsTGlzdGVuZXIoKSB7XG4gICAgICAgIGlmICghdGhpcy5zY3JvbGxIYW5kbGVyKSB7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbEhhbmRsZXIgPSBuZXcgQ29ubmVjdGVkT3ZlcmxheVNjcm9sbEhhbmRsZXIodGhpcy5jb25maXJtYXRpb24udGFyZ2V0LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudmlzaWJsZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2Nyb2xsSGFuZGxlci5iaW5kU2Nyb2xsTGlzdGVuZXIoKTtcbiAgICB9XG5cbiAgICB1bmJpbmRTY3JvbGxMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKHRoaXMuc2Nyb2xsSGFuZGxlcikge1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxIYW5kbGVyLnVuYmluZFNjcm9sbExpc3RlbmVyKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1bnN1YnNjcmliZUNvbmZpcm1hdGlvblN1YnNjcmlwdGlvbnMoKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbmZpcm1hdGlvbikge1xuICAgICAgICAgICAgaWYgKHRoaXMuY29uZmlybWF0aW9uLmFjY2VwdEV2ZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb25maXJtYXRpb24uYWNjZXB0RXZlbnQudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuY29uZmlybWF0aW9uLnJlamVjdEV2ZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb25maXJtYXRpb24ucmVqZWN0RXZlbnQudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uQ29udGFpbmVyRGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy51bmJpbmRMaXN0ZW5lcnMoKTtcbiAgICAgICAgdGhpcy51bnN1YnNjcmliZUNvbmZpcm1hdGlvblN1YnNjcmlwdGlvbnMoKTtcblxuICAgICAgICBpZiAodGhpcy5hdXRvWkluZGV4KSB7XG4gICAgICAgICAgICBaSW5kZXhVdGlscy5jbGVhcih0aGlzLmNvbnRhaW5lcik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbmZpcm1hdGlvbiA9IG51bGw7XG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gbnVsbDtcbiAgICB9XG5cbiAgICByZXN0b3JlQXBwZW5kKCkge1xuICAgICAgICBpZiAodGhpcy5jb250YWluZXIpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQodGhpcy5jb250YWluZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5vbkNvbnRhaW5lckRlc3Ryb3koKTtcbiAgICB9XG5cbiAgICBnZXQgYWNjZXB0QnV0dG9uTGFiZWwoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlybWF0aW9uLmFjY2VwdExhYmVsIHx8IHRoaXMuY29uZmlnLmdldFRyYW5zbGF0aW9uKFRyYW5zbGF0aW9uS2V5cy5BQ0NFUFQpO1xuICAgIH1cblxuICAgIGdldCByZWplY3RCdXR0b25MYWJlbCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25maXJtYXRpb24ucmVqZWN0TGFiZWwgfHwgdGhpcy5jb25maWcuZ2V0VHJhbnNsYXRpb24oVHJhbnNsYXRpb25LZXlzLlJFSkVDVCk7XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMucmVzdG9yZUFwcGVuZCgpO1xuXG4gICAgICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbikge1xuICAgICAgICAgICAgdGhpcy5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLEJ1dHRvbk1vZHVsZV0sXG4gICAgZXhwb3J0czogW0NvbmZpcm1Qb3B1cF0sXG4gICAgZGVjbGFyYXRpb25zOiBbQ29uZmlybVBvcHVwXVxufSlcbmV4cG9ydCBjbGFzcyBDb25maXJtUG9wdXBNb2R1bGUgeyB9XG4iXX0=