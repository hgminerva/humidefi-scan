import { NgModule, Component, Input, ViewChild, ChangeDetectionStrategy, ViewEncapsulation, ContentChildren, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomHandler } from 'primeng/dom';
import { PrimeTemplate } from 'primeng/api';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class Scroller {
    constructor(cd, zone) {
        this.cd = cd;
        this.zone = zone;
        this.onLazyLoad = new EventEmitter();
        this.onScroll = new EventEmitter();
        this.onScrollIndexChange = new EventEmitter();
        this._tabindex = 0;
        this._itemSize = 0;
        this._orientation = 'vertical';
        this._delay = 0;
        this._resizeDelay = 10;
        this._lazy = false;
        this._disabled = false;
        this._loaderDisabled = false;
        this._showSpacer = true;
        this._showLoader = false;
        this._autoSize = false;
        this.d_loading = false;
        this.first = 0;
        this.last = 0;
        this.numItemsInViewport = 0;
        this.lastScrollPos = 0;
        this.loaderArr = [];
        this.spacerStyle = {};
        this.contentStyle = {};
        this.initialized = false;
        if (!this._disabled) {
            this.zone.runOutsideAngular(() => {
                this.windowResizeListener = this.onWindowResize.bind(this);
                window.addEventListener('resize', this.windowResizeListener);
                window.addEventListener('orientationchange', this.windowResizeListener);
            });
        }
    }
    get id() { return this._id; }
    set id(val) { this._id = val; }
    get style() { return this._style; }
    set style(val) { this._style = val; }
    get styleClass() { return this._styleClass; }
    set styleClass(val) { this._styleClass = val; }
    get tabindex() { return this._tabindex; }
    set tabindex(val) { this._tabindex = val; }
    get items() { return this._items; }
    set items(val) { this._items = val; }
    get itemSize() { return this._itemSize; }
    set itemSize(val) { this._itemSize = val; }
    get scrollHeight() { return this._scrollHeight; }
    set scrollHeight(val) { this._scrollHeight = val; }
    get scrollWidth() { return this._scrollWidth; }
    set scrollWidth(val) { this._scrollWidth = val; }
    get orientation() { return this._orientation; }
    set orientation(val) { this._orientation = val; }
    get delay() { return this._delay; }
    set delay(val) { this._delay = val; }
    get resizeDelay() { return this._resizeDelay; }
    set resizeDelay(val) { this._resizeDelay = val; }
    get lazy() { return this._lazy; }
    set lazy(val) { this._lazy = val; }
    get disabled() { return this._disabled; }
    set disabled(val) { this._disabled = val; }
    get loaderDisabled() { return this._loaderDisabled; }
    set loaderDisabled(val) { this._loaderDisabled = val; }
    get columns() { return this._columns; }
    set columns(val) { this._columns = val; }
    get showSpacer() { return this._showSpacer; }
    set showSpacer(val) { this._showSpacer = val; }
    get showLoader() { return this._showLoader; }
    set showLoader(val) { this._showLoader = val; }
    get numToleratedItems() { return this._numToleratedItems; }
    set numToleratedItems(val) { this._numToleratedItems = val; }
    get loading() { return this._loading; }
    set loading(val) { this._loading = val; }
    get autoSize() { return this._autoSize; }
    set autoSize(val) { this._autoSize = val; }
    get trackBy() { return this._trackBy; }
    set trackBy(val) { this._trackBy = val; }
    get options() { return this._options; }
    set options(val) {
        this._options = val;
        if (val && typeof val === 'object') {
            Object.entries(val).forEach(([k, v]) => this[`_${k}`] !== v && (this[`_${k}`] = v));
        }
    }
    get vertical() {
        return this._orientation === 'vertical';
    }
    get horizontal() {
        return this._orientation === 'horizontal';
    }
    get both() {
        return this._orientation === 'both';
    }
    get loadedItems() {
        if (this._items && !this.d_loading) {
            if (this.both)
                return this._items.slice(this.first.rows, this.last.rows).map(item => this._columns ? item : item.slice(this.first.cols, this.last.cols));
            else if (this.horizontal && this._columns)
                return this._items;
            else
                return this._items.slice(this.first, this.last);
        }
        return [];
    }
    get loadedRows() {
        return this.d_loading ? (this._loaderDisabled ? this.loaderArr : []) : this.loadedItems;
    }
    get loadedColumns() {
        if (this._columns && (this.both || this.horizontal)) {
            return this.d_loading && this._loaderDisabled ?
                (this.both ? this.loaderArr[0] : this.loaderArr) :
                this._columns.slice((this.both ? this.first.cols : this.first), (this.both ? this.last.cols : this.last));
        }
        return this._columns;
    }
    ngOnInit() {
        this.setInitialState();
    }
    ngOnChanges(simpleChanges) {
        let isLoadingChanged = false;
        if (simpleChanges.loading) {
            const { previousValue, currentValue } = simpleChanges.loading;
            if (this.lazy && previousValue !== currentValue && currentValue !== this.d_loading) {
                this.d_loading = currentValue;
                isLoadingChanged = true;
            }
        }
        if (this.initialized) {
            const isChanged = !isLoadingChanged && (simpleChanges.items || simpleChanges.itemSize || simpleChanges.scrollHeight || simpleChanges.scrollWidth);
            isChanged && this.init();
        }
        if (simpleChanges.orientation) {
            this.lastScrollPos = this.both ? { top: 0, left: 0 } : 0;
        }
        if (simpleChanges.numToleratedItems) {
            const { previousValue, currentValue } = simpleChanges.numToleratedItems;
            if (previousValue !== currentValue && currentValue !== this.d_numToleratedItems) {
                this.d_numToleratedItems = currentValue;
            }
        }
        if (simpleChanges.options) {
            const { previousValue, currentValue } = simpleChanges.options;
            if (this.lazy && previousValue?.loading !== currentValue?.loading && currentValue?.loading !== this.d_loading) {
                this.d_loading = currentValue.loading;
            }
            if (previousValue?.numToleratedItems !== currentValue?.numToleratedItems && currentValue?.numToleratedItems !== this.d_numToleratedItems) {
                this.d_numToleratedItems = currentValue.numToleratedItems;
            }
        }
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'content':
                    this.contentTemplate = item.template;
                    break;
                case 'item':
                    this.itemTemplate = item.template;
                    break;
                case 'loader':
                    this.loaderTemplate = item.template;
                    break;
                case 'loadericon':
                    this.loaderIconTemplate = item.template;
                    break;
                default:
                    this.itemTemplate = item.template;
                    break;
            }
        });
    }
    ngAfterViewInit() {
        this.setContentEl(this.contentEl);
        this.init();
        this.defaultWidth = DomHandler.getWidth(this.elementViewChild.nativeElement);
        this.defaultHeight = DomHandler.getHeight(this.elementViewChild.nativeElement);
        this.initialized = true;
    }
    ngAfterViewChecked() {
        this.calculateAutoSize();
    }
    ngOnDestroy() {
        if (this.windowResizeListener) {
            window.removeEventListener('resize', this.windowResizeListener);
            window.removeEventListener('orientationchange', this.windowResizeListener);
            this.windowResizeListener = null;
        }
    }
    init() {
        if (!this._disabled) {
            this.setSize();
            this.calculateOptions();
            this.setSpacerSize();
            this.cd.detectChanges();
        }
    }
    setContentEl(el) {
        this.contentEl = el || this.contentViewChild?.nativeElement || DomHandler.findSingle(this.elementViewChild?.nativeElement, '.p-scroller-content');
    }
    setInitialState() {
        this.first = this.both ? { rows: 0, cols: 0 } : 0;
        this.last = this.both ? { rows: 0, cols: 0 } : 0;
        this.numItemsInViewport = this.both ? { rows: 0, cols: 0 } : 0;
        this.lastScrollPos = this.both ? { top: 0, left: 0 } : 0;
        this.d_loading = this._loading || false;
        this.d_numToleratedItems = this._numToleratedItems;
    }
    getElementRef() {
        return this.elementViewChild;
    }
    scrollTo(options) {
        this.lastScrollPos = this.both ? { top: 0, left: 0 } : 0;
        this.elementViewChild?.nativeElement?.scrollTo(options);
    }
    scrollToIndex(index, behavior = 'auto') {
        const { numToleratedItems } = this.calculateNumItems();
        const contentPos = this.getContentPosition();
        const calculateFirst = (_index = 0, _numT) => (_index <= _numT ? 0 : _index);
        const calculateCoord = (_first, _size, _cpos) => (_first * _size) + _cpos;
        const scrollTo = (left = 0, top = 0) => this.scrollTo({ left, top, behavior });
        if (this.both) {
            const newFirst = { rows: calculateFirst(index[0], numToleratedItems[0]), cols: calculateFirst(index[1], numToleratedItems[1]) };
            if (newFirst.rows !== this.first.rows || newFirst.cols !== this.first.cols) {
                scrollTo(calculateCoord(newFirst.cols, this._itemSize[1], contentPos.left), calculateCoord(newFirst.rows, this._itemSize[0], contentPos.top));
            }
        }
        else {
            const newFirst = calculateFirst(index, numToleratedItems);
            if (newFirst !== this.first) {
                this.horizontal ? scrollTo(calculateCoord(newFirst, this._itemSize, contentPos.left), 0) : scrollTo(0, calculateCoord(newFirst, this._itemSize, contentPos.top));
            }
        }
    }
    scrollInView(index, to, behavior = 'auto') {
        if (to) {
            const { first, viewport } = this.getRenderedRange();
            const scrollTo = (left = 0, top = 0) => this.scrollTo({ left, top, behavior });
            const isToStart = to === 'to-start';
            const isToEnd = to === 'to-end';
            if (isToStart) {
                if (this.both) {
                    if (viewport.first.rows - first.rows > index[0]) {
                        scrollTo(viewport.first.cols * this._itemSize[1], (viewport.first.rows - 1) * this._itemSize[0]);
                    }
                    else if (viewport.first.cols - first.cols > index[1]) {
                        scrollTo((viewport.first.cols - 1) * this._itemSize[1], viewport.first.rows * this._itemSize[0]);
                    }
                }
                else {
                    if (viewport.first - first > index) {
                        const pos = (viewport.first - 1) * this._itemSize;
                        this.horizontal ? scrollTo(pos, 0) : scrollTo(0, pos);
                    }
                }
            }
            else if (isToEnd) {
                if (this.both) {
                    if (viewport.last.rows - first.rows <= index[0] + 1) {
                        scrollTo(viewport.first.cols * this._itemSize[1], (viewport.first.rows + 1) * this._itemSize[0]);
                    }
                    else if (viewport.last.cols - first.cols <= index[1] + 1) {
                        scrollTo((viewport.first.cols + 1) * this._itemSize[1], viewport.first.rows * this._itemSize[0]);
                    }
                }
                else {
                    if (viewport.last - first <= index + 1) {
                        const pos = (viewport.first + 1) * this._itemSize;
                        this.horizontal ? scrollTo(pos, 0) : scrollTo(0, pos);
                    }
                }
            }
        }
        else {
            this.scrollToIndex(index, behavior);
        }
    }
    getRenderedRange() {
        const calculateFirstInViewport = (_pos, _size) => Math.floor(_pos / (_size || _pos));
        let firstInViewport = this.first;
        let lastInViewport = 0;
        if (this.elementViewChild?.nativeElement) {
            const { scrollTop, scrollLeft } = this.elementViewChild.nativeElement;
            if (this.both) {
                firstInViewport = { rows: calculateFirstInViewport(scrollTop, this._itemSize[0]), cols: calculateFirstInViewport(scrollLeft, this._itemSize[1]) };
                lastInViewport = { rows: firstInViewport.rows + this.numItemsInViewport.rows, cols: firstInViewport.cols + this.numItemsInViewport.cols };
            }
            else {
                const scrollPos = this.horizontal ? scrollLeft : scrollTop;
                firstInViewport = calculateFirstInViewport(scrollPos, this._itemSize);
                lastInViewport = firstInViewport + this.numItemsInViewport;
            }
        }
        return {
            first: this.first,
            last: this.last,
            viewport: {
                first: firstInViewport,
                last: lastInViewport
            }
        };
    }
    calculateNumItems() {
        const contentPos = this.getContentPosition();
        const contentWidth = this.elementViewChild?.nativeElement ? this.elementViewChild.nativeElement.offsetWidth - contentPos.left : 0;
        const contentHeight = this.elementViewChild?.nativeElement ? this.elementViewChild.nativeElement.offsetHeight - contentPos.top : 0;
        const calculateNumItemsInViewport = (_contentSize, _itemSize) => Math.ceil(_contentSize / (_itemSize || _contentSize));
        const calculateNumToleratedItems = (_numItems) => Math.ceil(_numItems / 2);
        const numItemsInViewport = this.both ?
            { rows: calculateNumItemsInViewport(contentHeight, this._itemSize[0]), cols: calculateNumItemsInViewport(contentWidth, this._itemSize[1]) } :
            calculateNumItemsInViewport((this.horizontal ? contentWidth : contentHeight), this._itemSize);
        const numToleratedItems = this.d_numToleratedItems || (this.both ?
            [calculateNumToleratedItems(numItemsInViewport.rows), calculateNumToleratedItems(numItemsInViewport.cols)] :
            calculateNumToleratedItems(numItemsInViewport));
        return { numItemsInViewport, numToleratedItems };
    }
    calculateOptions() {
        const { numItemsInViewport, numToleratedItems } = this.calculateNumItems();
        const calculateLast = (_first, _num, _numT, _isCols = false) => this.getLast(_first + _num + ((_first < _numT ? 2 : 3) * _numT), _isCols);
        const first = this.first;
        const last = this.both ?
            { rows: calculateLast(this.first.rows, numItemsInViewport.rows, numToleratedItems[0]), cols: calculateLast(this.first.cols, numItemsInViewport.cols, numToleratedItems[1], true) } :
            calculateLast(this.first, numItemsInViewport, numToleratedItems);
        this.last = last;
        this.numItemsInViewport = numItemsInViewport;
        this.d_numToleratedItems = numToleratedItems;
        if (this.showLoader) {
            this.loaderArr = this.both ?
                Array.from({ length: numItemsInViewport.rows }).map(() => Array.from({ length: numItemsInViewport.cols })) :
                Array.from({ length: numItemsInViewport });
        }
        if (this._lazy) {
            this.handleEvents('onLazyLoad', { first, last });
        }
    }
    calculateAutoSize() {
        if (this._autoSize && !this.d_loading) {
            Promise.resolve().then(() => {
                if (this.contentEl) {
                    this.contentEl.style.minHeight = this.contentEl.style.minWidth = 'auto';
                    const { offsetWidth, offsetHeight } = this.contentEl;
                    (this.both || this.horizontal) && (this.elementViewChild.nativeElement.style.width = (offsetWidth < this.defaultWidth ? offsetWidth : this.defaultWidth) + 'px');
                    (this.both || this.vertical) && (this.elementViewChild.nativeElement.style.height = (offsetHeight < this.defaultHeight ? offsetHeight : this.defaultHeight) + 'px');
                    this.contentEl.style.minHeight = this.contentEl.style.minWidth = '';
                }
            });
        }
    }
    getLast(last = 0, isCols = false) {
        return this._items ? Math.min((isCols ? (this._columns || this._items[0]).length : this._items.length), last) : 0;
    }
    getContentPosition() {
        if (this.contentEl) {
            const style = getComputedStyle(this.contentEl);
            const left = parseFloat(style.paddingLeft) + Math.max((parseFloat(style.left) || 0), 0);
            const right = parseFloat(style.paddingRight) + Math.max((parseFloat(style.right) || 0), 0);
            const top = parseFloat(style.paddingTop) + Math.max((parseFloat(style.top) || 0), 0);
            const bottom = parseFloat(style.paddingBottom) + Math.max((parseFloat(style.bottom) || 0), 0);
            return { left, right, top, bottom, x: left + right, y: top + bottom };
        }
        return { left: 0, right: 0, top: 0, bottom: 0, x: 0, y: 0 };
    }
    setSize() {
        if (this.elementViewChild?.nativeElement) {
            const parentElement = this.elementViewChild.nativeElement.parentElement.parentElement;
            const width = this._scrollWidth || `${(this.elementViewChild.nativeElement.offsetWidth || parentElement.offsetWidth)}px`;
            const height = this._scrollHeight || `${(this.elementViewChild.nativeElement.offsetHeight || parentElement.offsetHeight)}px`;
            const setProp = (_name, _value) => this.elementViewChild.nativeElement.style[_name] = _value;
            if (this.both || this.horizontal) {
                setProp('height', height);
                setProp('width', width);
            }
            else {
                setProp('height', height);
            }
        }
    }
    setSpacerSize() {
        if (this._items) {
            const contentPos = this.getContentPosition();
            const setProp = (_name, _value, _size, _cpos = 0) => this.spacerStyle = { ...this.spacerStyle, ...{ [`${_name}`]: (((_value || []).length * _size) + _cpos) + 'px' } };
            if (this.both) {
                setProp('height', this._items, this._itemSize[0], contentPos.y);
                setProp('width', (this._columns || this._items[1]), this._itemSize[1], contentPos.x);
            }
            else {
                this.horizontal ? setProp('width', (this._columns || this._items), this._itemSize, contentPos.x) : setProp('height', this._items, this._itemSize, contentPos.y);
            }
        }
    }
    setContentPosition(pos) {
        if (this.contentEl) {
            const first = pos ? pos.first : this.first;
            const calculateTranslateVal = (_first, _size) => (_first * _size);
            const setTransform = (_x = 0, _y = 0) => this.contentStyle = { ...this.contentStyle, ...{ transform: `translate3d(${_x}px, ${_y}px, 0)` } };
            if (this.both) {
                setTransform(calculateTranslateVal(first.cols, this._itemSize[1]), calculateTranslateVal(first.rows, this._itemSize[0]));
            }
            else {
                const translateVal = calculateTranslateVal(first, this._itemSize);
                this.horizontal ? setTransform(translateVal, 0) : setTransform(0, translateVal);
            }
        }
    }
    onScrollPositionChange(event) {
        const target = event.target;
        const contentPos = this.getContentPosition();
        const calculateScrollPos = (_pos, _cpos) => _pos ? (_pos > _cpos ? _pos - _cpos : _pos) : 0;
        const calculateCurrentIndex = (_pos, _size) => Math.floor(_pos / (_size || _pos));
        const calculateTriggerIndex = (_currentIndex, _first, _last, _num, _numT, _isScrollDownOrRight) => {
            return (_currentIndex <= _numT ? _numT : (_isScrollDownOrRight ? (_last - _num - _numT) : (_first + _numT - 1)));
        };
        const calculateFirst = (_currentIndex, _triggerIndex, _first, _last, _num, _numT, _isScrollDownOrRight) => {
            if (_currentIndex <= _numT)
                return 0;
            else
                return Math.max(0, _isScrollDownOrRight ?
                    (_currentIndex < _triggerIndex ? _first : _currentIndex - _numT) :
                    (_currentIndex > _triggerIndex ? _first : _currentIndex - (2 * _numT)));
        };
        const calculateLast = (_currentIndex, _first, _last, _num, _numT, _isCols = false) => {
            let lastValue = _first + _num + (2 * _numT);
            if (_currentIndex >= _numT) {
                lastValue += (_numT + 1);
            }
            return this.getLast(lastValue, _isCols);
        };
        const scrollTop = calculateScrollPos(target.scrollTop, contentPos.top);
        const scrollLeft = calculateScrollPos(target.scrollLeft, contentPos.left);
        let newFirst = this.both ? { rows: 0, cols: 0 } : 0;
        let newLast = this.last;
        let isRangeChanged = false;
        let newScrollPos = this.lastScrollPos;
        if (this.both) {
            const isScrollDown = this.lastScrollPos.top <= scrollTop;
            const isScrollRight = this.lastScrollPos.left <= scrollLeft;
            const currentIndex = { rows: calculateCurrentIndex(scrollTop, this._itemSize[0]), cols: calculateCurrentIndex(scrollLeft, this._itemSize[1]) };
            const triggerIndex = {
                rows: calculateTriggerIndex(currentIndex.rows, this.first.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0], isScrollDown),
                cols: calculateTriggerIndex(currentIndex.cols, this.first.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], isScrollRight)
            };
            newFirst = {
                rows: calculateFirst(currentIndex.rows, triggerIndex.rows, this.first.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0], isScrollDown),
                cols: calculateFirst(currentIndex.cols, triggerIndex.cols, this.first.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], isScrollRight)
            };
            newLast = {
                rows: calculateLast(currentIndex.rows, newFirst.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0]),
                cols: calculateLast(currentIndex.cols, newFirst.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], true)
            };
            isRangeChanged = (newFirst.rows !== this.first.rows || newLast.rows !== this.last.rows) || (newFirst.cols !== this.first.cols || newLast.cols !== this.last.cols);
            newScrollPos = { top: scrollTop, left: scrollLeft };
        }
        else {
            const scrollPos = this.horizontal ? scrollLeft : scrollTop;
            const isScrollDownOrRight = this.lastScrollPos <= scrollPos;
            const currentIndex = calculateCurrentIndex(scrollPos, this._itemSize);
            const triggerIndex = calculateTriggerIndex(currentIndex, this.first, this.last, this.numItemsInViewport, this.d_numToleratedItems, isScrollDownOrRight);
            newFirst = calculateFirst(currentIndex, triggerIndex, this.first, this.last, this.numItemsInViewport, this.d_numToleratedItems, isScrollDownOrRight);
            newLast = calculateLast(currentIndex, newFirst, this.last, this.numItemsInViewport, this.d_numToleratedItems);
            isRangeChanged = newFirst !== this.first || newLast !== this.last;
            newScrollPos = scrollPos;
        }
        return {
            first: newFirst,
            last: newLast,
            isRangeChanged,
            scrollPos: newScrollPos
        };
    }
    onScrollChange(event) {
        const { first, last, isRangeChanged, scrollPos } = this.onScrollPositionChange(event);
        if (isRangeChanged) {
            const newState = { first, last };
            this.setContentPosition(newState);
            this.first = first;
            this.last = last;
            this.lastScrollPos = scrollPos;
            this.handleEvents('onScrollIndexChange', newState);
            if (this._lazy) {
                this.handleEvents('onLazyLoad', newState);
            }
        }
    }
    onContainerScroll(event) {
        this.handleEvents('onScroll', { originalEvent: event });
        if (this._delay) {
            if (this.scrollTimeout) {
                clearTimeout(this.scrollTimeout);
            }
            if (!this.d_loading && this.showLoader) {
                const { isRangeChanged: changed } = this.onScrollPositionChange(event);
                if (changed) {
                    this.d_loading = true;
                    this.cd.detectChanges();
                }
            }
            this.scrollTimeout = setTimeout(() => {
                this.onScrollChange(event);
                if (this.d_loading && this.showLoader && (!this._lazy || this._loading === undefined)) {
                    this.d_loading = false;
                    this.cd.detectChanges();
                }
            }, this._delay);
        }
        else {
            this.onScrollChange(event);
        }
    }
    onWindowResize() {
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        this.resizeTimeout = setTimeout(() => {
            if (this.elementViewChild) {
                const [width, height] = [DomHandler.getWidth(this.elementViewChild.nativeElement), DomHandler.getHeight(this.elementViewChild.nativeElement)];
                const [isDiffWidth, isDiffHeight] = [width !== this.defaultWidth, height !== this.defaultHeight];
                const reinit = this.both ? (isDiffWidth || isDiffHeight) : (this.horizontal ? isDiffWidth : (this.vertical ? isDiffHeight : false));
                reinit && this.zone.run(() => {
                    this.d_numToleratedItems = this._numToleratedItems;
                    this.defaultWidth = width;
                    this.defaultHeight = height;
                    this.init();
                });
            }
        }, this._resizeDelay);
    }
    handleEvents(name, params) {
        return this.options && this.options[name] ? this.options[name](params) : this[name].emit(params);
    }
    getContentOptions() {
        return {
            contentStyleClass: `p-scroller-content ${this.d_loading ? 'p-scroller-loading' : ''}`,
            items: this.loadedItems,
            getItemOptions: (index) => this.getOptions(index),
            loading: this.d_loading,
            getLoaderOptions: (index, options) => this.getLoaderOptions(index, options),
            itemSize: this._itemSize,
            rows: this.loadedRows,
            columns: this.loadedColumns,
            spacerStyle: this.spacerStyle,
            contentStyle: this.contentStyle,
            vertical: this.vertical,
            horizontal: this.horizontal,
            both: this.both
        };
    }
    getOptions(renderedIndex) {
        const count = (this._items || []).length;
        const index = this.both ? this.first.rows + renderedIndex : this.first + renderedIndex;
        return {
            index,
            count,
            first: index === 0,
            last: index === (count - 1),
            even: index % 2 === 0,
            odd: index % 2 !== 0
        };
    }
    getLoaderOptions(index, extOptions) {
        const count = this.loaderArr.length;
        return {
            index,
            count,
            first: index === 0,
            last: index === (count - 1),
            even: index % 2 === 0,
            odd: index % 2 !== 0,
            ...extOptions
        };
    }
}
Scroller.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Scroller, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
Scroller.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.7", type: Scroller, selector: "p-scroller", inputs: { id: "id", style: "style", styleClass: "styleClass", tabindex: "tabindex", items: "items", itemSize: "itemSize", scrollHeight: "scrollHeight", scrollWidth: "scrollWidth", orientation: "orientation", delay: "delay", resizeDelay: "resizeDelay", lazy: "lazy", disabled: "disabled", loaderDisabled: "loaderDisabled", columns: "columns", showSpacer: "showSpacer", showLoader: "showLoader", numToleratedItems: "numToleratedItems", loading: "loading", autoSize: "autoSize", trackBy: "trackBy", options: "options" }, outputs: { onLazyLoad: "onLazyLoad", onScroll: "onScroll", onScrollIndexChange: "onScrollIndexChange" }, host: { classAttribute: "p-scroller-viewport p-element" }, queries: [{ propertyName: "templates", predicate: PrimeTemplate }], viewQueries: [{ propertyName: "elementViewChild", first: true, predicate: ["element"], descendants: true }, { propertyName: "contentViewChild", first: true, predicate: ["content"], descendants: true }], usesOnChanges: true, ngImport: i0, template: `
        <ng-container *ngIf="!_disabled; else disabledContainer">
            <div #element [attr.id]="_id" [attr.tabindex]="tabindex" [ngStyle]="_style" [class]="_styleClass"
                [ngClass]="{'p-scroller': true, 'p-both-scroll': both, 'p-horizontal-scroll': horizontal}"
                (scroll)="onContainerScroll($event)">
                <ng-container *ngIf="contentTemplate; else buildInContent">
                    <ng-container *ngTemplateOutlet="contentTemplate; context: {$implicit: loadedItems, options: getContentOptions()}"></ng-container>
                </ng-container>
                <ng-template #buildInContent>
                    <div #content class="p-scroller-content" [ngClass]="{'p-scroller-loading': d_loading}" [ngStyle]="contentStyle">
                        <ng-container *ngFor="let item of loadedItems; let index = index; trackBy: _trackBy || index">
                            <ng-container *ngTemplateOutlet="itemTemplate; context: {$implicit: item, options: getOptions(index)}"></ng-container>
                        </ng-container>
                    </div>
                </ng-template>
                <div *ngIf="_showSpacer" class="p-scroller-spacer" [ngStyle]="spacerStyle"></div>
                <div *ngIf="!loaderDisabled && _showLoader && d_loading" class="p-scroller-loader" [ngClass]="{'p-component-overlay': !loaderTemplate}">
                    <ng-container *ngIf="loaderTemplate; else buildInLoader">
                        <ng-container *ngFor="let item of loaderArr; let index = index">
                            <ng-container *ngTemplateOutlet="loaderTemplate; context: {options: getLoaderOptions(index, both && { numCols: _numItemsInViewport.cols })}"></ng-container>
                        </ng-container>
                    </ng-container>
                    <ng-template #buildInLoader>
                        <ng-container *ngIf="loaderIconTemplate; else buildInLoaderIcon">
                            <ng-container *ngTemplateOutlet="loaderIconTemplate; context: {options: { styleClass: 'p-scroller-loading-icon' }}"></ng-container>
                        </ng-container>
                        <ng-template #buildInLoaderIcon>
                            <i class="p-scroller-loading-icon pi pi-spinner pi-spin"></i>
                        </ng-template>
                    </ng-template>
                </div>
            </div>
        </ng-container>
        <ng-template #disabledContainer>
            <ng-content></ng-content>
            <ng-container *ngIf="contentTemplate">
                <ng-container *ngTemplateOutlet="contentTemplate; context: {$implicit: items, options: {rows: _items, columns: loadedColumns}}"></ng-container>
            </ng-container>
        </ng-template>
    `, isInline: true, styles: ["p-scroller{flex:1;outline:0 none}.p-scroller{position:relative;overflow:auto;contain:strict;transform:translateZ(0);will-change:scroll-position;outline:0 none}.p-scroller-content{position:absolute;top:0;left:0;min-height:100%;min-width:100%;will-change:transform}.p-scroller-spacer{position:absolute;top:0;left:0;height:1px;width:1px;transform-origin:0 0;pointer-events:none}.p-scroller-loader{position:sticky;top:0;left:0;width:100%;height:100%}.p-scroller-loader.p-component-overlay{display:flex;align-items:center;justify-content:center}.p-scroller-loading-icon{font-size:2rem}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Scroller, decorators: [{
            type: Component,
            args: [{ selector: 'p-scroller', template: `
        <ng-container *ngIf="!_disabled; else disabledContainer">
            <div #element [attr.id]="_id" [attr.tabindex]="tabindex" [ngStyle]="_style" [class]="_styleClass"
                [ngClass]="{'p-scroller': true, 'p-both-scroll': both, 'p-horizontal-scroll': horizontal}"
                (scroll)="onContainerScroll($event)">
                <ng-container *ngIf="contentTemplate; else buildInContent">
                    <ng-container *ngTemplateOutlet="contentTemplate; context: {$implicit: loadedItems, options: getContentOptions()}"></ng-container>
                </ng-container>
                <ng-template #buildInContent>
                    <div #content class="p-scroller-content" [ngClass]="{'p-scroller-loading': d_loading}" [ngStyle]="contentStyle">
                        <ng-container *ngFor="let item of loadedItems; let index = index; trackBy: _trackBy || index">
                            <ng-container *ngTemplateOutlet="itemTemplate; context: {$implicit: item, options: getOptions(index)}"></ng-container>
                        </ng-container>
                    </div>
                </ng-template>
                <div *ngIf="_showSpacer" class="p-scroller-spacer" [ngStyle]="spacerStyle"></div>
                <div *ngIf="!loaderDisabled && _showLoader && d_loading" class="p-scroller-loader" [ngClass]="{'p-component-overlay': !loaderTemplate}">
                    <ng-container *ngIf="loaderTemplate; else buildInLoader">
                        <ng-container *ngFor="let item of loaderArr; let index = index">
                            <ng-container *ngTemplateOutlet="loaderTemplate; context: {options: getLoaderOptions(index, both && { numCols: _numItemsInViewport.cols })}"></ng-container>
                        </ng-container>
                    </ng-container>
                    <ng-template #buildInLoader>
                        <ng-container *ngIf="loaderIconTemplate; else buildInLoaderIcon">
                            <ng-container *ngTemplateOutlet="loaderIconTemplate; context: {options: { styleClass: 'p-scroller-loading-icon' }}"></ng-container>
                        </ng-container>
                        <ng-template #buildInLoaderIcon>
                            <i class="p-scroller-loading-icon pi pi-spinner pi-spin"></i>
                        </ng-template>
                    </ng-template>
                </div>
            </div>
        </ng-container>
        <ng-template #disabledContainer>
            <ng-content></ng-content>
            <ng-container *ngIf="contentTemplate">
                <ng-container *ngTemplateOutlet="contentTemplate; context: {$implicit: items, options: {rows: _items, columns: loadedColumns}}"></ng-container>
            </ng-container>
        </ng-template>
    `, changeDetection: ChangeDetectionStrategy.Default, encapsulation: ViewEncapsulation.None, host: {
                        'class': 'p-scroller-viewport p-element'
                    }, styles: ["p-scroller{flex:1;outline:0 none}.p-scroller{position:relative;overflow:auto;contain:strict;transform:translateZ(0);will-change:scroll-position;outline:0 none}.p-scroller-content{position:absolute;top:0;left:0;min-height:100%;min-width:100%;will-change:transform}.p-scroller-spacer{position:absolute;top:0;left:0;height:1px;width:1px;transform-origin:0 0;pointer-events:none}.p-scroller-loader{position:sticky;top:0;left:0;width:100%;height:100%}.p-scroller-loader.p-component-overlay{display:flex;align-items:center;justify-content:center}.p-scroller-loading-icon{font-size:2rem}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i0.NgZone }]; }, propDecorators: { id: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], tabindex: [{
                type: Input
            }], items: [{
                type: Input
            }], itemSize: [{
                type: Input
            }], scrollHeight: [{
                type: Input
            }], scrollWidth: [{
                type: Input
            }], orientation: [{
                type: Input
            }], delay: [{
                type: Input
            }], resizeDelay: [{
                type: Input
            }], lazy: [{
                type: Input
            }], disabled: [{
                type: Input
            }], loaderDisabled: [{
                type: Input
            }], columns: [{
                type: Input
            }], showSpacer: [{
                type: Input
            }], showLoader: [{
                type: Input
            }], numToleratedItems: [{
                type: Input
            }], loading: [{
                type: Input
            }], autoSize: [{
                type: Input
            }], trackBy: [{
                type: Input
            }], options: [{
                type: Input
            }], elementViewChild: [{
                type: ViewChild,
                args: ['element']
            }], contentViewChild: [{
                type: ViewChild,
                args: ['content']
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }], onLazyLoad: [{
                type: Output
            }], onScroll: [{
                type: Output
            }], onScrollIndexChange: [{
                type: Output
            }] } });
export class ScrollerModule {
}
ScrollerModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ScrollerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ScrollerModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.7", ngImport: i0, type: ScrollerModule, declarations: [Scroller], imports: [CommonModule], exports: [Scroller] });
ScrollerModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ScrollerModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ScrollerModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [Scroller],
                    declarations: [Scroller]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvc2Nyb2xsZXIvc2Nyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFjLFNBQVMsRUFBRSx1QkFBdUIsRUFBRSxpQkFBaUIsRUFBdUMsZUFBZSxFQUEwQixNQUFNLEVBQUUsWUFBWSxFQUE4RCxNQUFNLGVBQWUsQ0FBQztBQUM5UixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUN6QyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sYUFBYSxDQUFDOzs7QUFpRjVDLE1BQU0sT0FBTyxRQUFRO0lBaU5qQixZQUFvQixFQUFxQixFQUFVLElBQVk7UUFBM0MsT0FBRSxHQUFGLEVBQUUsQ0FBbUI7UUFBVSxTQUFJLEdBQUosSUFBSSxDQUFRO1FBaklyRCxlQUFVLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFFbkQsYUFBUSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBRWpELHdCQUFtQixHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBUXRFLGNBQVMsR0FBVyxDQUFDLENBQUM7UUFJdEIsY0FBUyxHQUFRLENBQUMsQ0FBQztRQU1uQixpQkFBWSxHQUFXLFVBQVUsQ0FBQztRQUVsQyxXQUFNLEdBQVcsQ0FBQyxDQUFDO1FBRW5CLGlCQUFZLEdBQVcsRUFBRSxDQUFDO1FBRTFCLFVBQUssR0FBWSxLQUFLLENBQUM7UUFFdkIsY0FBUyxHQUFZLEtBQUssQ0FBQztRQUUzQixvQkFBZSxHQUFZLEtBQUssQ0FBQztRQUlqQyxnQkFBVyxHQUFZLElBQUksQ0FBQztRQUU1QixnQkFBVyxHQUFZLEtBQUssQ0FBQztRQU03QixjQUFTLEdBQVksS0FBSyxDQUFDO1FB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QW5CLEtBQUs7Z0JBU2dCLGdCQUFnQjtzQkFBckMsU0FBUzt1QkFBQyxTQUFTO2dCQUVFLGdCQUFnQjtzQkFBckMsU0FBUzt1QkFBQyxTQUFTO2dCQUVZLFNBQVM7c0JBQXhDLGVBQWU7dUJBQUMsYUFBYTtnQkFFcEIsVUFBVTtzQkFBbkIsTUFBTTtnQkFFRyxRQUFRO3NCQUFqQixNQUFNO2dCQUVHLG1CQUFtQjtzQkFBNUIsTUFBTTs7QUE2cUJYLE1BQU0sT0FBTyxjQUFjOzsyR0FBZCxjQUFjOzRHQUFkLGNBQWMsaUJBandCZCxRQUFRLGFBNnZCUCxZQUFZLGFBN3ZCYixRQUFROzRHQWl3QlIsY0FBYyxZQUpiLFlBQVk7MkZBSWIsY0FBYztrQkFMMUIsUUFBUTttQkFBQztvQkFDTixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7b0JBQ3ZCLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQztvQkFDbkIsWUFBWSxFQUFFLENBQUMsUUFBUSxDQUFDO2lCQUMzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlLCBDb21wb25lbnQsIElucHV0LCBFbGVtZW50UmVmLCBWaWV3Q2hpbGQsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBWaWV3RW5jYXBzdWxhdGlvbiwgQ2hhbmdlRGV0ZWN0b3JSZWYsIEFmdGVyQ29udGVudEluaXQsIENvbnRlbnRDaGlsZHJlbiwgUXVlcnlMaXN0LCBUZW1wbGF0ZVJlZiwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIFNpbXBsZUNoYW5nZXMsIE9uSW5pdCwgQWZ0ZXJWaWV3Q2hlY2tlZCwgT25EZXN0cm95LCBOZ1pvbmUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBEb21IYW5kbGVyIH0gZnJvbSAncHJpbWVuZy9kb20nO1xuaW1wb3J0IHsgUHJpbWVUZW1wbGF0ZSB9IGZyb20gJ3ByaW1lbmcvYXBpJztcblxuZXhwb3J0IHR5cGUgU2Nyb2xsZXJUb1R5cGUgPSAndG8tc3RhcnQnIHwgJ3RvLWVuZCcgfCB1bmRlZmluZWQ7XG5cbmV4cG9ydCB0eXBlIFNjcm9sbGVyT3JpZW50YXRpb25UeXBlID0gJ3ZlcnRpY2FsJyB8ICdob3Jpem9udGFsJyB8ICdib3RoJztcblxuZXhwb3J0IGludGVyZmFjZSBTY3JvbGxlck9wdGlvbnMge1xuICAgIGlkPzogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgIHN0eWxlPzogYW55O1xuICAgIHN0eWxlQ2xhc3M/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgdGFiaW5kZXg/OiBudW1iZXIgfCB1bmRlZmluZWQ7XG4gICAgaXRlbXM/OiBhbnlbXTtcbiAgICBpdGVtU2l6ZT86IGFueTtcbiAgICBzY3JvbGxIZWlnaHQ/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgc2Nyb2xsV2lkdGg/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgb3JpZW50YXRpb24/OiBTY3JvbGxlck9yaWVudGF0aW9uVHlwZTtcbiAgICBkZWxheT86IG51bWJlciB8IHVuZGVmaW5lZDtcbiAgICBsYXp5PzogYm9vbGVhbjtcbiAgICBkaXNhYmxlZD86IGJvb2xlYW47XG4gICAgbG9hZGVyRGlzYWJsZWQ/OiBib29sZWFuO1xuICAgIGNvbHVtbnM/OiBhbnlbXSB8IHVuZGVmaW5lZDtcbiAgICBzaG93U3BhY2VyPzogYm9vbGVhbjtcbiAgICBzaG93TG9hZGVyPzogYm9vbGVhbjtcbiAgICBudW1Ub2xlcmF0ZWRJdGVtcz86IGFueTtcbiAgICBsb2FkaW5nPzogYm9vbGVhbjtcbiAgICBhdXRvU2l6ZT86IGJvb2xlYW47XG4gICAgdHJhY2tCeT86IGFueTtcbiAgICBvbkxhenlMb2FkPzogRnVuY3Rpb24gfCB1bmRlZmluZWQ7XG4gICAgb25TY3JvbGw/OiBGdW5jdGlvbiB8IHVuZGVmaW5lZDtcbiAgICBvblNjcm9sbEluZGV4Q2hhbmdlPzogRnVuY3Rpb24gfCB1bmRlZmluZWQ7XG59XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC1zY3JvbGxlcicsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIiFfZGlzYWJsZWQ7IGVsc2UgZGlzYWJsZWRDb250YWluZXJcIj5cbiAgICAgICAgICAgIDxkaXYgI2VsZW1lbnQgW2F0dHIuaWRdPVwiX2lkXCIgW2F0dHIudGFiaW5kZXhdPVwidGFiaW5kZXhcIiBbbmdTdHlsZV09XCJfc3R5bGVcIiBbY2xhc3NdPVwiX3N0eWxlQ2xhc3NcIlxuICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cInsncC1zY3JvbGxlcic6IHRydWUsICdwLWJvdGgtc2Nyb2xsJzogYm90aCwgJ3AtaG9yaXpvbnRhbC1zY3JvbGwnOiBob3Jpem9udGFsfVwiXG4gICAgICAgICAgICAgICAgKHNjcm9sbCk9XCJvbkNvbnRhaW5lclNjcm9sbCgkZXZlbnQpXCI+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImNvbnRlbnRUZW1wbGF0ZTsgZWxzZSBidWlsZEluQ29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiY29udGVudFRlbXBsYXRlOyBjb250ZXh0OiB7JGltcGxpY2l0OiBsb2FkZWRJdGVtcywgb3B0aW9uczogZ2V0Q29udGVudE9wdGlvbnMoKX1cIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgI2J1aWxkSW5Db250ZW50PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2ICNjb250ZW50IGNsYXNzPVwicC1zY3JvbGxlci1jb250ZW50XCIgW25nQ2xhc3NdPVwieydwLXNjcm9sbGVyLWxvYWRpbmcnOiBkX2xvYWRpbmd9XCIgW25nU3R5bGVdPVwiY29udGVudFN0eWxlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0Zvcj1cImxldCBpdGVtIG9mIGxvYWRlZEl0ZW1zOyBsZXQgaW5kZXggPSBpbmRleDsgdHJhY2tCeTogX3RyYWNrQnkgfHwgaW5kZXhcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiaXRlbVRlbXBsYXRlOyBjb250ZXh0OiB7JGltcGxpY2l0OiBpdGVtLCBvcHRpb25zOiBnZXRPcHRpb25zKGluZGV4KX1cIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgIDxkaXYgKm5nSWY9XCJfc2hvd1NwYWNlclwiIGNsYXNzPVwicC1zY3JvbGxlci1zcGFjZXJcIiBbbmdTdHlsZV09XCJzcGFjZXJTdHlsZVwiPjwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgKm5nSWY9XCIhbG9hZGVyRGlzYWJsZWQgJiYgX3Nob3dMb2FkZXIgJiYgZF9sb2FkaW5nXCIgY2xhc3M9XCJwLXNjcm9sbGVyLWxvYWRlclwiIFtuZ0NsYXNzXT1cInsncC1jb21wb25lbnQtb3ZlcmxheSc6ICFsb2FkZXJUZW1wbGF0ZX1cIj5cbiAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImxvYWRlclRlbXBsYXRlOyBlbHNlIGJ1aWxkSW5Mb2FkZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nRm9yPVwibGV0IGl0ZW0gb2YgbG9hZGVyQXJyOyBsZXQgaW5kZXggPSBpbmRleFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJsb2FkZXJUZW1wbGF0ZTsgY29udGV4dDoge29wdGlvbnM6IGdldExvYWRlck9wdGlvbnMoaW5kZXgsIGJvdGggJiYgeyBudW1Db2xzOiBfbnVtSXRlbXNJblZpZXdwb3J0LmNvbHMgfSl9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSAjYnVpbGRJbkxvYWRlcj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJsb2FkZXJJY29uVGVtcGxhdGU7IGVsc2UgYnVpbGRJbkxvYWRlckljb25cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwibG9hZGVySWNvblRlbXBsYXRlOyBjb250ZXh0OiB7b3B0aW9uczogeyBzdHlsZUNsYXNzOiAncC1zY3JvbGxlci1sb2FkaW5nLWljb24nIH19XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSAjYnVpbGRJbkxvYWRlckljb24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJwLXNjcm9sbGVyLWxvYWRpbmctaWNvbiBwaSBwaS1zcGlubmVyIHBpLXNwaW5cIj48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICA8bmctdGVtcGxhdGUgI2Rpc2FibGVkQ29udGFpbmVyPlxuICAgICAgICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImNvbnRlbnRUZW1wbGF0ZVwiPlxuICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJjb250ZW50VGVtcGxhdGU7IGNvbnRleHQ6IHskaW1wbGljaXQ6IGl0ZW1zLCBvcHRpb25zOiB7cm93czogX2l0ZW1zLCBjb2x1bW5zOiBsb2FkZWRDb2x1bW5zfX1cIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgIGAsXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5EZWZhdWx0LFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gICAgc3R5bGVVcmxzOiBbJy4vc2Nyb2xsZXIuY3NzJ10sXG4gICAgaG9zdDoge1xuICAgICAgICAnY2xhc3MnOiAncC1zY3JvbGxlci12aWV3cG9ydCBwLWVsZW1lbnQnXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBTY3JvbGxlciBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJDb250ZW50SW5pdCwgQWZ0ZXJWaWV3Q2hlY2tlZCwgT25EZXN0cm95IHtcblxuICAgIEBJbnB1dCgpIGdldCBpZCgpIHsgcmV0dXJuIHRoaXMuX2lkOyB9XG4gICAgc2V0IGlkKHZhbDogc3RyaW5nKSB7IHRoaXMuX2lkID0gdmFsOyB9XG5cbiAgICBASW5wdXQoKSBnZXQgc3R5bGUoKSB7IHJldHVybiB0aGlzLl9zdHlsZTsgfVxuICAgIHNldCBzdHlsZSh2YWw6IGFueSkgeyB0aGlzLl9zdHlsZSA9IHZhbDsgfVxuXG4gICAgQElucHV0KCkgZ2V0IHN0eWxlQ2xhc3MoKSB7IHJldHVybiB0aGlzLl9zdHlsZUNsYXNzOyB9XG4gICAgc2V0IHN0eWxlQ2xhc3ModmFsOiBzdHJpbmcpIHsgdGhpcy5fc3R5bGVDbGFzcyA9IHZhbDsgfVxuXG4gICAgQElucHV0KCkgZ2V0IHRhYmluZGV4KCkgeyByZXR1cm4gdGhpcy5fdGFiaW5kZXg7IH1cbiAgICBzZXQgdGFiaW5kZXgodmFsOiBudW1iZXIpIHsgdGhpcy5fdGFiaW5kZXggPSB2YWw7IH1cblxuICAgIEBJbnB1dCgpIGdldCBpdGVtcygpIHsgcmV0dXJuIHRoaXMuX2l0ZW1zOyB9XG4gICAgc2V0IGl0ZW1zKHZhbDogYW55W10pIHsgdGhpcy5faXRlbXMgPSB2YWw7IH1cblxuICAgIEBJbnB1dCgpIGdldCBpdGVtU2l6ZSgpIHsgcmV0dXJuIHRoaXMuX2l0ZW1TaXplOyB9XG4gICAgc2V0IGl0ZW1TaXplKHZhbDogYW55KSB7IHRoaXMuX2l0ZW1TaXplID0gdmFsOyB9XG5cbiAgICBASW5wdXQoKSBnZXQgc2Nyb2xsSGVpZ2h0KCkgeyByZXR1cm4gdGhpcy5fc2Nyb2xsSGVpZ2h0OyB9XG4gICAgc2V0IHNjcm9sbEhlaWdodCh2YWw6IHN0cmluZykgeyB0aGlzLl9zY3JvbGxIZWlnaHQgPSB2YWw7IH1cblxuICAgIEBJbnB1dCgpIGdldCBzY3JvbGxXaWR0aCgpIHsgcmV0dXJuIHRoaXMuX3Njcm9sbFdpZHRoOyB9XG4gICAgc2V0IHNjcm9sbFdpZHRoKHZhbDogc3RyaW5nKSB7IHRoaXMuX3Njcm9sbFdpZHRoID0gdmFsOyB9XG5cbiAgICBASW5wdXQoKSBnZXQgb3JpZW50YXRpb24oKSB7IHJldHVybiB0aGlzLl9vcmllbnRhdGlvbjsgfVxuICAgIHNldCBvcmllbnRhdGlvbih2YWw6IHN0cmluZykgeyB0aGlzLl9vcmllbnRhdGlvbiA9IHZhbDsgfVxuXG4gICAgQElucHV0KCkgZ2V0IGRlbGF5KCkgeyByZXR1cm4gdGhpcy5fZGVsYXk7IH1cbiAgICBzZXQgZGVsYXkodmFsOiBudW1iZXIpIHsgdGhpcy5fZGVsYXkgPSB2YWw7IH1cblxuICAgIEBJbnB1dCgpIGdldCByZXNpemVEZWxheSgpIHsgcmV0dXJuIHRoaXMuX3Jlc2l6ZURlbGF5OyB9XG4gICAgc2V0IHJlc2l6ZURlbGF5KHZhbDogbnVtYmVyKSB7IHRoaXMuX3Jlc2l6ZURlbGF5ID0gdmFsOyB9XG5cbiAgICBASW5wdXQoKSBnZXQgbGF6eSgpIHsgcmV0dXJuIHRoaXMuX2xhenk7IH1cbiAgICBzZXQgbGF6eSh2YWw6IGJvb2xlYW4pIHsgdGhpcy5fbGF6eSA9IHZhbDsgfVxuXG4gICAgQElucHV0KCkgZ2V0IGRpc2FibGVkKCkgeyByZXR1cm4gdGhpcy5fZGlzYWJsZWQ7IH1cbiAgICBzZXQgZGlzYWJsZWQodmFsOiBib29sZWFuKSB7IHRoaXMuX2Rpc2FibGVkID0gdmFsOyB9XG5cbiAgICBASW5wdXQoKSBnZXQgbG9hZGVyRGlzYWJsZWQoKSB7IHJldHVybiB0aGlzLl9sb2FkZXJEaXNhYmxlZDsgfVxuICAgIHNldCBsb2FkZXJEaXNhYmxlZCh2YWw6IGJvb2xlYW4pIHsgdGhpcy5fbG9hZGVyRGlzYWJsZWQgPSB2YWw7IH1cblxuICAgIEBJbnB1dCgpIGdldCBjb2x1bW5zKCkgeyByZXR1cm4gdGhpcy5fY29sdW1uczsgfVxuICAgIHNldCBjb2x1bW5zKHZhbDogYW55W10pIHsgdGhpcy5fY29sdW1ucyA9IHZhbDsgfVxuXG4gICAgQElucHV0KCkgZ2V0IHNob3dTcGFjZXIoKSB7IHJldHVybiB0aGlzLl9zaG93U3BhY2VyOyB9XG4gICAgc2V0IHNob3dTcGFjZXIodmFsOiBib29sZWFuKSB7IHRoaXMuX3Nob3dTcGFjZXIgPSB2YWw7IH1cblxuICAgIEBJbnB1dCgpIGdldCBzaG93TG9hZGVyKCkgeyByZXR1cm4gdGhpcy5fc2hvd0xvYWRlcjsgfVxuICAgIHNldCBzaG93TG9hZGVyKHZhbDogYm9vbGVhbikgeyB0aGlzLl9zaG93TG9hZGVyID0gdmFsOyB9XG5cbiAgICBASW5wdXQoKSBnZXQgbnVtVG9sZXJhdGVkSXRlbXMoKSB7IHJldHVybiB0aGlzLl9udW1Ub2xlcmF0ZWRJdGVtczsgfVxuICAgIHNldCBudW1Ub2xlcmF0ZWRJdGVtcyh2YWw6IG51bWJlcikgeyB0aGlzLl9udW1Ub2xlcmF0ZWRJdGVtcyA9IHZhbDsgfVxuXG4gICAgQElucHV0KCkgZ2V0IGxvYWRpbmcoKSB7IHJldHVybiB0aGlzLl9sb2FkaW5nOyB9XG4gICAgc2V0IGxvYWRpbmcodmFsOiBib29sZWFuKSB7IHRoaXMuX2xvYWRpbmcgPSB2YWw7IH1cblxuICAgIEBJbnB1dCgpIGdldCBhdXRvU2l6ZSgpIHsgcmV0dXJuIHRoaXMuX2F1dG9TaXplOyB9XG4gICAgc2V0IGF1dG9TaXplKHZhbDogYm9vbGVhbikgeyB0aGlzLl9hdXRvU2l6ZSA9IHZhbDsgfVxuXG4gICAgQElucHV0KCkgZ2V0IHRyYWNrQnkoKSB7IHJldHVybiB0aGlzLl90cmFja0J5OyB9XG4gICAgc2V0IHRyYWNrQnkodmFsOiBhbnkpIHsgdGhpcy5fdHJhY2tCeSA9IHZhbDsgfVxuXG4gICAgQElucHV0KCkgZ2V0IG9wdGlvbnMoKSB7IHJldHVybiB0aGlzLl9vcHRpb25zOyB9XG4gICAgc2V0IG9wdGlvbnModmFsOiBTY3JvbGxlck9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5fb3B0aW9ucyA9IHZhbDtcblxuICAgICAgICBpZiAodmFsICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBPYmplY3QuZW50cmllcyh2YWwpLmZvckVhY2goKFtrLCB2XSkgPT4gdGhpc1tgXyR7a31gXSAhPT0gdiAmJiAodGhpc1tgXyR7a31gXSA9IHYpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIEBWaWV3Q2hpbGQoJ2VsZW1lbnQnKSBlbGVtZW50Vmlld0NoaWxkOiBFbGVtZW50UmVmO1xuXG4gICAgQFZpZXdDaGlsZCgnY29udGVudCcpIGNvbnRlbnRWaWV3Q2hpbGQ6IEVsZW1lbnRSZWY7XG5cbiAgICBAQ29udGVudENoaWxkcmVuKFByaW1lVGVtcGxhdGUpIHRlbXBsYXRlczogUXVlcnlMaXN0PGFueT47XG5cbiAgICBAT3V0cHV0KCkgb25MYXp5TG9hZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25TY3JvbGw6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uU2Nyb2xsSW5kZXhDaGFuZ2U6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgX2lkOiBzdHJpbmc7XG5cbiAgICBfc3R5bGU6IGFueTtcblxuICAgIF9zdHlsZUNsYXNzOiBzdHJpbmc7XG5cbiAgICBfdGFiaW5kZXg6IG51bWJlciA9IDA7XG5cbiAgICBfaXRlbXM6IGFueVtdO1xuXG4gICAgX2l0ZW1TaXplOiBhbnkgPSAwO1xuXG4gICAgX3Njcm9sbEhlaWdodDogc3RyaW5nO1xuXG4gICAgX3Njcm9sbFdpZHRoOiBzdHJpbmc7XG5cbiAgICBfb3JpZW50YXRpb246IHN0cmluZyA9ICd2ZXJ0aWNhbCc7XG5cbiAgICBfZGVsYXk6IG51bWJlciA9IDA7XG5cbiAgICBfcmVzaXplRGVsYXk6IG51bWJlciA9IDEwO1xuXG4gICAgX2xhenk6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIF9kaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgX2xvYWRlckRpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBfY29sdW1uczogYW55W107XG5cbiAgICBfc2hvd1NwYWNlcjogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBfc2hvd0xvYWRlcjogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgX251bVRvbGVyYXRlZEl0ZW1zOiBhbnk7XG5cbiAgICBfbG9hZGluZzogYm9vbGVhbjtcblxuICAgIF9hdXRvU2l6ZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgX3RyYWNrQnk6IGFueTtcblxuICAgIF9vcHRpb25zOiBTY3JvbGxlck9wdGlvbnM7XG5cbiAgICBkX2xvYWRpbmc6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGRfbnVtVG9sZXJhdGVkSXRlbXM6IGFueTtcblxuICAgIGNvbnRlbnRFbDogYW55O1xuXG4gICAgY29udGVudFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgaXRlbVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgbG9hZGVyVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBsb2FkZXJJY29uVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBmaXJzdDogYW55ID0gMDtcblxuICAgIGxhc3Q6IGFueSA9IDA7XG5cbiAgICBudW1JdGVtc0luVmlld3BvcnQ6IGFueSA9IDA7XG5cbiAgICBsYXN0U2Nyb2xsUG9zOiBhbnkgPSAwO1xuXG4gICAgbG9hZGVyQXJyOiBhbnlbXSA9IFtdO1xuXG4gICAgc3BhY2VyU3R5bGU6IGFueSA9IHt9O1xuXG4gICAgY29udGVudFN0eWxlOiBhbnkgPSB7fTtcblxuICAgIHNjcm9sbFRpbWVvdXQ6IGFueTtcblxuICAgIHJlc2l6ZVRpbWVvdXQ6IGFueTtcblxuICAgIGluaXRpYWxpemVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICB3aW5kb3dSZXNpemVMaXN0ZW5lcjogYW55O1xuXG4gICAgZGVmYXVsdFdpZHRoOiBudW1iZXI7XG5cbiAgICBkZWZhdWx0SGVpZ2h0OiBudW1iZXI7XG5cbiAgICBnZXQgdmVydGljYWwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9vcmllbnRhdGlvbiA9PT0gJ3ZlcnRpY2FsJztcbiAgICB9XG5cbiAgICBnZXQgaG9yaXpvbnRhbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX29yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCc7XG4gICAgfVxuXG4gICAgZ2V0IGJvdGgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9vcmllbnRhdGlvbiA9PT0gJ2JvdGgnO1xuICAgIH1cblxuICAgIGdldCBsb2FkZWRJdGVtcygpIHtcbiAgICAgICAgaWYgKHRoaXMuX2l0ZW1zICYmICF0aGlzLmRfbG9hZGluZykge1xuICAgICAgICAgICAgaWYgKHRoaXMuYm90aClcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5faXRlbXMuc2xpY2UodGhpcy5maXJzdC5yb3dzLCB0aGlzLmxhc3Qucm93cykubWFwKGl0ZW0gPT4gdGhpcy5fY29sdW1ucyA/IGl0ZW0gOiBpdGVtLnNsaWNlKHRoaXMuZmlyc3QuY29scywgdGhpcy5sYXN0LmNvbHMpKTtcbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuaG9yaXpvbnRhbCAmJiB0aGlzLl9jb2x1bW5zKVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9pdGVtcztcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5faXRlbXMuc2xpY2UodGhpcy5maXJzdCwgdGhpcy5sYXN0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBnZXQgbG9hZGVkUm93cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZF9sb2FkaW5nID8gKHRoaXMuX2xvYWRlckRpc2FibGVkID8gdGhpcy5sb2FkZXJBcnIgOiBbXSkgOiB0aGlzLmxvYWRlZEl0ZW1zO1xuICAgIH1cblxuICAgIGdldCBsb2FkZWRDb2x1bW5zKCkge1xuICAgICAgICBpZiAodGhpcy5fY29sdW1ucyAmJiAodGhpcy5ib3RoIHx8IHRoaXMuaG9yaXpvbnRhbCkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRfbG9hZGluZyAmJiB0aGlzLl9sb2FkZXJEaXNhYmxlZCA/XG4gICAgICAgICAgICAgICAgKHRoaXMuYm90aCA/IHRoaXMubG9hZGVyQXJyWzBdIDogdGhpcy5sb2FkZXJBcnIpIDpcbiAgICAgICAgICAgICAgICB0aGlzLl9jb2x1bW5zLnNsaWNlKCh0aGlzLmJvdGggPyB0aGlzLmZpcnN0LmNvbHMgOiB0aGlzLmZpcnN0KSwgKHRoaXMuYm90aCA/IHRoaXMubGFzdC5jb2xzIDogdGhpcy5sYXN0KSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5fY29sdW1ucztcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNkOiBDaGFuZ2VEZXRlY3RvclJlZiwgcHJpdmF0ZSB6b25lOiBOZ1pvbmUpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9kaXNhYmxlZCkge1xuICAgICAgICAgICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLndpbmRvd1Jlc2l6ZUxpc3RlbmVyID0gdGhpcy5vbldpbmRvd1Jlc2l6ZS5iaW5kKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMud2luZG93UmVzaXplTGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvcmllbnRhdGlvbmNoYW5nZScsIHRoaXMud2luZG93UmVzaXplTGlzdGVuZXIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5zZXRJbml0aWFsU3RhdGUoKTtcbiAgICB9XG5cbiAgICBuZ09uQ2hhbmdlcyhzaW1wbGVDaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgICAgIGxldCBpc0xvYWRpbmdDaGFuZ2VkID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKHNpbXBsZUNoYW5nZXMubG9hZGluZykge1xuICAgICAgICAgICAgY29uc3QgeyBwcmV2aW91c1ZhbHVlLCBjdXJyZW50VmFsdWUgfSA9IHNpbXBsZUNoYW5nZXMubG9hZGluZztcblxuICAgICAgICAgICAgaWYgKHRoaXMubGF6eSAmJiBwcmV2aW91c1ZhbHVlICE9PSBjdXJyZW50VmFsdWUgJiYgY3VycmVudFZhbHVlICE9PSB0aGlzLmRfbG9hZGluZykge1xuICAgICAgICAgICAgICAgIHRoaXMuZF9sb2FkaW5nID0gY3VycmVudFZhbHVlO1xuICAgICAgICAgICAgICAgIGlzTG9hZGluZ0NoYW5nZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IGlzQ2hhbmdlZCA9ICFpc0xvYWRpbmdDaGFuZ2VkICYmIChzaW1wbGVDaGFuZ2VzLml0ZW1zIHx8IHNpbXBsZUNoYW5nZXMuaXRlbVNpemUgfHwgc2ltcGxlQ2hhbmdlcy5zY3JvbGxIZWlnaHQgfHwgc2ltcGxlQ2hhbmdlcy5zY3JvbGxXaWR0aCk7XG4gICAgICAgICAgICBpc0NoYW5nZWQgJiYgdGhpcy5pbml0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2ltcGxlQ2hhbmdlcy5vcmllbnRhdGlvbikge1xuICAgICAgICAgICAgdGhpcy5sYXN0U2Nyb2xsUG9zID0gdGhpcy5ib3RoID8geyB0b3A6IDAsIGxlZnQ6IDAgfSA6IDA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2ltcGxlQ2hhbmdlcy5udW1Ub2xlcmF0ZWRJdGVtcykge1xuICAgICAgICAgICAgY29uc3QgeyBwcmV2aW91c1ZhbHVlLCBjdXJyZW50VmFsdWUgfSA9IHNpbXBsZUNoYW5nZXMubnVtVG9sZXJhdGVkSXRlbXM7XG5cbiAgICAgICAgICAgIGlmIChwcmV2aW91c1ZhbHVlICE9PSBjdXJyZW50VmFsdWUgJiYgY3VycmVudFZhbHVlICE9PSB0aGlzLmRfbnVtVG9sZXJhdGVkSXRlbXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRfbnVtVG9sZXJhdGVkSXRlbXMgPSBjdXJyZW50VmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2ltcGxlQ2hhbmdlcy5vcHRpb25zKSB7XG4gICAgICAgICAgICBjb25zdCB7IHByZXZpb3VzVmFsdWUsIGN1cnJlbnRWYWx1ZSB9ID0gc2ltcGxlQ2hhbmdlcy5vcHRpb25zO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5sYXp5ICYmIHByZXZpb3VzVmFsdWU/LmxvYWRpbmcgIT09IGN1cnJlbnRWYWx1ZT8ubG9hZGluZyAmJiBjdXJyZW50VmFsdWU/LmxvYWRpbmcgIT09IHRoaXMuZF9sb2FkaW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kX2xvYWRpbmcgPSBjdXJyZW50VmFsdWUubG9hZGluZztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHByZXZpb3VzVmFsdWU/Lm51bVRvbGVyYXRlZEl0ZW1zICE9PSBjdXJyZW50VmFsdWU/Lm51bVRvbGVyYXRlZEl0ZW1zICYmIGN1cnJlbnRWYWx1ZT8ubnVtVG9sZXJhdGVkSXRlbXMgIT09IHRoaXMuZF9udW1Ub2xlcmF0ZWRJdGVtcykge1xuICAgICAgICAgICAgICAgIHRoaXMuZF9udW1Ub2xlcmF0ZWRJdGVtcyA9IGN1cnJlbnRWYWx1ZS5udW1Ub2xlcmF0ZWRJdGVtcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgc3dpdGNoIChpdGVtLmdldFR5cGUoKSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ2NvbnRlbnQnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnRUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnaXRlbSc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXRlbVRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdsb2FkZXInOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlclRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdsb2FkZXJpY29uJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJJY29uVGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXRlbVRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgdGhpcy5zZXRDb250ZW50RWwodGhpcy5jb250ZW50RWwpO1xuICAgICAgICB0aGlzLmluaXQoKTtcblxuICAgICAgICB0aGlzLmRlZmF1bHRXaWR0aCA9IERvbUhhbmRsZXIuZ2V0V2lkdGgodGhpcy5lbGVtZW50Vmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICB0aGlzLmRlZmF1bHRIZWlnaHQgPSBEb21IYW5kbGVyLmdldEhlaWdodCh0aGlzLmVsZW1lbnRWaWV3Q2hpbGQubmF0aXZlRWxlbWVudCk7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIG5nQWZ0ZXJWaWV3Q2hlY2tlZCgpIHtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVBdXRvU2l6ZSgpO1xuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICBpZiAodGhpcy53aW5kb3dSZXNpemVMaXN0ZW5lcikge1xuICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMud2luZG93UmVzaXplTGlzdGVuZXIpO1xuICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ29yaWVudGF0aW9uY2hhbmdlJywgdGhpcy53aW5kb3dSZXNpemVMaXN0ZW5lcik7XG4gICAgICAgICAgICB0aGlzLndpbmRvd1Jlc2l6ZUxpc3RlbmVyID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICAgIGlmICghdGhpcy5fZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U2l6ZSgpO1xuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVPcHRpb25zKCk7XG4gICAgICAgICAgICB0aGlzLnNldFNwYWNlclNpemUoKTtcblxuICAgICAgICAgICAgdGhpcy5jZC5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRDb250ZW50RWwoZWw/OiBIVE1MRWxlbWVudCkge1xuICAgICAgICB0aGlzLmNvbnRlbnRFbCA9IGVsIHx8IHRoaXMuY29udGVudFZpZXdDaGlsZD8ubmF0aXZlRWxlbWVudCB8fCBEb21IYW5kbGVyLmZpbmRTaW5nbGUodGhpcy5lbGVtZW50Vmlld0NoaWxkPy5uYXRpdmVFbGVtZW50LCAnLnAtc2Nyb2xsZXItY29udGVudCcpO1xuICAgIH1cblxuICAgIHNldEluaXRpYWxTdGF0ZSgpIHtcbiAgICAgICAgdGhpcy5maXJzdCA9IHRoaXMuYm90aCA/IHsgcm93czogMCwgY29sczogMCB9IDogMDtcbiAgICAgICAgdGhpcy5sYXN0ID0gdGhpcy5ib3RoID8geyByb3dzOiAwLCBjb2xzOiAwIH0gOiAwO1xuICAgICAgICB0aGlzLm51bUl0ZW1zSW5WaWV3cG9ydCA9IHRoaXMuYm90aCA/IHsgcm93czogMCwgY29sczogMCB9IDogMDtcbiAgICAgICAgdGhpcy5sYXN0U2Nyb2xsUG9zID0gdGhpcy5ib3RoID8geyB0b3A6IDAsIGxlZnQ6IDAgfSA6IDA7XG4gICAgICAgIHRoaXMuZF9sb2FkaW5nID0gdGhpcy5fbG9hZGluZyB8fCBmYWxzZTtcbiAgICAgICAgdGhpcy5kX251bVRvbGVyYXRlZEl0ZW1zID0gdGhpcy5fbnVtVG9sZXJhdGVkSXRlbXM7XG4gICAgfVxuXG4gICAgZ2V0RWxlbWVudFJlZigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudFZpZXdDaGlsZDtcbiAgICB9XG5cbiAgICBzY3JvbGxUbyhvcHRpb25zOiBTY3JvbGxUb09wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5sYXN0U2Nyb2xsUG9zID0gdGhpcy5ib3RoID8geyB0b3A6IDAsIGxlZnQ6IDAgfSA6IDA7XG4gICAgICAgIHRoaXMuZWxlbWVudFZpZXdDaGlsZD8ubmF0aXZlRWxlbWVudD8uc2Nyb2xsVG8ob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgc2Nyb2xsVG9JbmRleChpbmRleDogbnVtYmVyLCBiZWhhdmlvcjogU2Nyb2xsQmVoYXZpb3IgPSAnYXV0bycpIHtcbiAgICAgICAgY29uc3QgeyBudW1Ub2xlcmF0ZWRJdGVtcyB9ID0gdGhpcy5jYWxjdWxhdGVOdW1JdGVtcygpO1xuICAgICAgICBjb25zdCBjb250ZW50UG9zID0gdGhpcy5nZXRDb250ZW50UG9zaXRpb24oKTtcbiAgICAgICAgY29uc3QgY2FsY3VsYXRlRmlyc3QgPSAoX2luZGV4ID0gMCwgX251bVQpID0+IChfaW5kZXggPD0gX251bVQgPyAwIDogX2luZGV4KTtcbiAgICAgICAgY29uc3QgY2FsY3VsYXRlQ29vcmQgPSAoX2ZpcnN0LCBfc2l6ZSwgX2Nwb3MpID0+IChfZmlyc3QgKiBfc2l6ZSkgKyBfY3BvcztcbiAgICAgICAgY29uc3Qgc2Nyb2xsVG8gPSAobGVmdCA9IDAsIHRvcCA9IDApID0+IHRoaXMuc2Nyb2xsVG8oeyBsZWZ0LCB0b3AsIGJlaGF2aW9yIH0pO1xuXG4gICAgICAgIGlmICh0aGlzLmJvdGgpIHtcbiAgICAgICAgICAgIGNvbnN0IG5ld0ZpcnN0ID0geyByb3dzOiBjYWxjdWxhdGVGaXJzdChpbmRleFswXSwgbnVtVG9sZXJhdGVkSXRlbXNbMF0pLCBjb2xzOiBjYWxjdWxhdGVGaXJzdChpbmRleFsxXSwgbnVtVG9sZXJhdGVkSXRlbXNbMV0pIH07XG4gICAgICAgICAgICBpZiAobmV3Rmlyc3Qucm93cyAhPT0gdGhpcy5maXJzdC5yb3dzIHx8IG5ld0ZpcnN0LmNvbHMgIT09IHRoaXMuZmlyc3QuY29scykge1xuICAgICAgICAgICAgICAgIHNjcm9sbFRvKGNhbGN1bGF0ZUNvb3JkKG5ld0ZpcnN0LmNvbHMsIHRoaXMuX2l0ZW1TaXplWzFdLCBjb250ZW50UG9zLmxlZnQpLCBjYWxjdWxhdGVDb29yZChuZXdGaXJzdC5yb3dzLCB0aGlzLl9pdGVtU2l6ZVswXSwgY29udGVudFBvcy50b3ApKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IG5ld0ZpcnN0ID0gY2FsY3VsYXRlRmlyc3QoaW5kZXgsIG51bVRvbGVyYXRlZEl0ZW1zKTtcblxuICAgICAgICAgICAgaWYgKG5ld0ZpcnN0ICE9PSB0aGlzLmZpcnN0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ob3Jpem9udGFsID8gc2Nyb2xsVG8oY2FsY3VsYXRlQ29vcmQobmV3Rmlyc3QsIHRoaXMuX2l0ZW1TaXplLCBjb250ZW50UG9zLmxlZnQpLCAwKSA6IHNjcm9sbFRvKDAsIGNhbGN1bGF0ZUNvb3JkKG5ld0ZpcnN0LCB0aGlzLl9pdGVtU2l6ZSwgY29udGVudFBvcy50b3ApKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNjcm9sbEluVmlldyhpbmRleDogbnVtYmVyLCB0bzogU2Nyb2xsZXJUb1R5cGUsIGJlaGF2aW9yOiBTY3JvbGxCZWhhdmlvciA9ICdhdXRvJykge1xuICAgICAgICBpZiAodG8pIHtcbiAgICAgICAgICAgIGNvbnN0IHsgZmlyc3QsIHZpZXdwb3J0IH0gPSB0aGlzLmdldFJlbmRlcmVkUmFuZ2UoKTtcbiAgICAgICAgICAgIGNvbnN0IHNjcm9sbFRvID0gKGxlZnQgPSAwLCB0b3AgPSAwKSA9PiB0aGlzLnNjcm9sbFRvKHsgbGVmdCwgdG9wLCBiZWhhdmlvciB9KTtcbiAgICAgICAgICAgIGNvbnN0IGlzVG9TdGFydCA9IHRvID09PSAndG8tc3RhcnQnO1xuICAgICAgICAgICAgY29uc3QgaXNUb0VuZCA9IHRvID09PSAndG8tZW5kJztcblxuICAgICAgICAgICAgaWYgKGlzVG9TdGFydCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmJvdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZpZXdwb3J0LmZpcnN0LnJvd3MgLSBmaXJzdC5yb3dzID4gaW5kZXhbMF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvKHZpZXdwb3J0LmZpcnN0LmNvbHMgKiB0aGlzLl9pdGVtU2l6ZVsxXSwgKHZpZXdwb3J0LmZpcnN0LnJvd3MgLSAxKSAqIHRoaXMuX2l0ZW1TaXplWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh2aWV3cG9ydC5maXJzdC5jb2xzIC0gZmlyc3QuY29scyA+IGluZGV4WzFdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxUbygodmlld3BvcnQuZmlyc3QuY29scyAtIDEpICogdGhpcy5faXRlbVNpemVbMV0sIHZpZXdwb3J0LmZpcnN0LnJvd3MgKiB0aGlzLl9pdGVtU2l6ZVswXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2aWV3cG9ydC5maXJzdCAtIGZpcnN0ID4gaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvcyA9ICh2aWV3cG9ydC5maXJzdCAtIDEpICogdGhpcy5faXRlbVNpemU7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhvcml6b250YWwgPyBzY3JvbGxUbyhwb3MsIDApIDogc2Nyb2xsVG8oMCwgcG9zKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGlzVG9FbmQpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ib3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2aWV3cG9ydC5sYXN0LnJvd3MgLSBmaXJzdC5yb3dzIDw9IGluZGV4WzBdICsgMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG8odmlld3BvcnQuZmlyc3QuY29scyAqIHRoaXMuX2l0ZW1TaXplWzFdLCAodmlld3BvcnQuZmlyc3Qucm93cyArIDEpICogdGhpcy5faXRlbVNpemVbMF0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHZpZXdwb3J0Lmxhc3QuY29scyAtIGZpcnN0LmNvbHMgPD0gaW5kZXhbMV0gKyAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxUbygodmlld3BvcnQuZmlyc3QuY29scyArIDEpICogdGhpcy5faXRlbVNpemVbMV0sIHZpZXdwb3J0LmZpcnN0LnJvd3MgKiB0aGlzLl9pdGVtU2l6ZVswXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2aWV3cG9ydC5sYXN0IC0gZmlyc3QgPD0gaW5kZXggKyAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwb3MgPSAodmlld3BvcnQuZmlyc3QgKyAxKSAqIHRoaXMuX2l0ZW1TaXplO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ob3Jpem9udGFsID8gc2Nyb2xsVG8ocG9zLCAwKSA6IHNjcm9sbFRvKDAsIHBvcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbFRvSW5kZXgoaW5kZXgsIGJlaGF2aW9yKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFJlbmRlcmVkUmFuZ2UoKSB7XG4gICAgICAgIGNvbnN0IGNhbGN1bGF0ZUZpcnN0SW5WaWV3cG9ydCA9IChfcG9zLCBfc2l6ZSkgPT4gTWF0aC5mbG9vcihfcG9zIC8gKF9zaXplIHx8IF9wb3MpKTtcblxuICAgICAgICBsZXQgZmlyc3RJblZpZXdwb3J0ID0gdGhpcy5maXJzdDtcbiAgICAgICAgbGV0IGxhc3RJblZpZXdwb3J0OiBhbnkgPSAwO1xuXG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnRWaWV3Q2hpbGQ/Lm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgICAgIGNvbnN0IHsgc2Nyb2xsVG9wLCBzY3JvbGxMZWZ0IH0gPSB0aGlzLmVsZW1lbnRWaWV3Q2hpbGQubmF0aXZlRWxlbWVudDtcblxuICAgICAgICAgICAgaWYgKHRoaXMuYm90aCkge1xuICAgICAgICAgICAgICAgIGZpcnN0SW5WaWV3cG9ydCA9IHsgcm93czogY2FsY3VsYXRlRmlyc3RJblZpZXdwb3J0KHNjcm9sbFRvcCwgdGhpcy5faXRlbVNpemVbMF0pLCBjb2xzOiBjYWxjdWxhdGVGaXJzdEluVmlld3BvcnQoc2Nyb2xsTGVmdCwgdGhpcy5faXRlbVNpemVbMV0pIH07XG4gICAgICAgICAgICAgICAgbGFzdEluVmlld3BvcnQgPSB7IHJvd3M6IGZpcnN0SW5WaWV3cG9ydC5yb3dzICsgdGhpcy5udW1JdGVtc0luVmlld3BvcnQucm93cywgY29sczogZmlyc3RJblZpZXdwb3J0LmNvbHMgKyB0aGlzLm51bUl0ZW1zSW5WaWV3cG9ydC5jb2xzIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzY3JvbGxQb3MgPSB0aGlzLmhvcml6b250YWwgPyBzY3JvbGxMZWZ0IDogc2Nyb2xsVG9wO1xuICAgICAgICAgICAgICAgIGZpcnN0SW5WaWV3cG9ydCA9IGNhbGN1bGF0ZUZpcnN0SW5WaWV3cG9ydChzY3JvbGxQb3MsIHRoaXMuX2l0ZW1TaXplKTtcbiAgICAgICAgICAgICAgICBsYXN0SW5WaWV3cG9ydCA9IGZpcnN0SW5WaWV3cG9ydCArIHRoaXMubnVtSXRlbXNJblZpZXdwb3J0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGZpcnN0OiB0aGlzLmZpcnN0LFxuICAgICAgICAgICAgbGFzdDogdGhpcy5sYXN0LFxuICAgICAgICAgICAgdmlld3BvcnQ6IHtcbiAgICAgICAgICAgICAgICBmaXJzdDogZmlyc3RJblZpZXdwb3J0LFxuICAgICAgICAgICAgICAgIGxhc3Q6IGxhc3RJblZpZXdwb3J0XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjYWxjdWxhdGVOdW1JdGVtcygpIHtcbiAgICAgICAgY29uc3QgY29udGVudFBvcyA9IHRoaXMuZ2V0Q29udGVudFBvc2l0aW9uKCk7XG4gICAgICAgIGNvbnN0IGNvbnRlbnRXaWR0aCA9IHRoaXMuZWxlbWVudFZpZXdDaGlsZD8ubmF0aXZlRWxlbWVudCA/IHRoaXMuZWxlbWVudFZpZXdDaGlsZC5uYXRpdmVFbGVtZW50Lm9mZnNldFdpZHRoIC0gY29udGVudFBvcy5sZWZ0IDogMDtcbiAgICAgICAgY29uc3QgY29udGVudEhlaWdodCA9IHRoaXMuZWxlbWVudFZpZXdDaGlsZD8ubmF0aXZlRWxlbWVudCA/IHRoaXMuZWxlbWVudFZpZXdDaGlsZC5uYXRpdmVFbGVtZW50Lm9mZnNldEhlaWdodCAtIGNvbnRlbnRQb3MudG9wIDogMDtcbiAgICAgICAgY29uc3QgY2FsY3VsYXRlTnVtSXRlbXNJblZpZXdwb3J0ID0gKF9jb250ZW50U2l6ZSwgX2l0ZW1TaXplKSA9PiBNYXRoLmNlaWwoX2NvbnRlbnRTaXplIC8gKF9pdGVtU2l6ZSB8fCBfY29udGVudFNpemUpKTtcbiAgICAgICAgY29uc3QgY2FsY3VsYXRlTnVtVG9sZXJhdGVkSXRlbXMgPSAoX251bUl0ZW1zKSA9PiBNYXRoLmNlaWwoX251bUl0ZW1zIC8gMik7XG4gICAgICAgIGNvbnN0IG51bUl0ZW1zSW5WaWV3cG9ydDogYW55ID0gdGhpcy5ib3RoID9cbiAgICAgICAgICAgIHsgcm93czogY2FsY3VsYXRlTnVtSXRlbXNJblZpZXdwb3J0KGNvbnRlbnRIZWlnaHQsIHRoaXMuX2l0ZW1TaXplWzBdKSwgY29sczogY2FsY3VsYXRlTnVtSXRlbXNJblZpZXdwb3J0KGNvbnRlbnRXaWR0aCwgdGhpcy5faXRlbVNpemVbMV0pIH0gOlxuICAgICAgICAgICAgY2FsY3VsYXRlTnVtSXRlbXNJblZpZXdwb3J0KCh0aGlzLmhvcml6b250YWwgPyBjb250ZW50V2lkdGggOiBjb250ZW50SGVpZ2h0KSwgdGhpcy5faXRlbVNpemUpO1xuXG4gICAgICAgIGNvbnN0IG51bVRvbGVyYXRlZEl0ZW1zID0gdGhpcy5kX251bVRvbGVyYXRlZEl0ZW1zIHx8ICh0aGlzLmJvdGggP1xuICAgICAgICAgICAgW2NhbGN1bGF0ZU51bVRvbGVyYXRlZEl0ZW1zKG51bUl0ZW1zSW5WaWV3cG9ydC5yb3dzKSwgY2FsY3VsYXRlTnVtVG9sZXJhdGVkSXRlbXMobnVtSXRlbXNJblZpZXdwb3J0LmNvbHMpXSA6XG4gICAgICAgICAgICBjYWxjdWxhdGVOdW1Ub2xlcmF0ZWRJdGVtcyhudW1JdGVtc0luVmlld3BvcnQpKTtcblxuICAgICAgICByZXR1cm4geyBudW1JdGVtc0luVmlld3BvcnQsIG51bVRvbGVyYXRlZEl0ZW1zIH07XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlT3B0aW9ucygpIHtcbiAgICAgICAgY29uc3QgeyBudW1JdGVtc0luVmlld3BvcnQsIG51bVRvbGVyYXRlZEl0ZW1zIH0gPSB0aGlzLmNhbGN1bGF0ZU51bUl0ZW1zKCk7XG4gICAgICAgIGNvbnN0IGNhbGN1bGF0ZUxhc3QgPSAoX2ZpcnN0LCBfbnVtLCBfbnVtVCwgX2lzQ29scyA9IGZhbHNlKSA9PiB0aGlzLmdldExhc3QoX2ZpcnN0ICsgX251bSArICgoX2ZpcnN0IDwgX251bVQgPyAyIDogMykgKiBfbnVtVCksIF9pc0NvbHMpO1xuICAgICAgICBjb25zdCBmaXJzdCA9IHRoaXMuZmlyc3Q7XG4gICAgICAgIGNvbnN0IGxhc3QgPSB0aGlzLmJvdGggP1xuICAgICAgICAgICAgeyByb3dzOiBjYWxjdWxhdGVMYXN0KHRoaXMuZmlyc3Qucm93cywgbnVtSXRlbXNJblZpZXdwb3J0LnJvd3MsIG51bVRvbGVyYXRlZEl0ZW1zWzBdKSwgY29sczogY2FsY3VsYXRlTGFzdCh0aGlzLmZpcnN0LmNvbHMsIG51bUl0ZW1zSW5WaWV3cG9ydC5jb2xzLCBudW1Ub2xlcmF0ZWRJdGVtc1sxXSwgdHJ1ZSkgfSA6XG4gICAgICAgICAgICBjYWxjdWxhdGVMYXN0KHRoaXMuZmlyc3QsIG51bUl0ZW1zSW5WaWV3cG9ydCwgbnVtVG9sZXJhdGVkSXRlbXMpO1xuXG4gICAgICAgIHRoaXMubGFzdCA9IGxhc3Q7XG4gICAgICAgIHRoaXMubnVtSXRlbXNJblZpZXdwb3J0ID0gbnVtSXRlbXNJblZpZXdwb3J0O1xuICAgICAgICB0aGlzLmRfbnVtVG9sZXJhdGVkSXRlbXMgPSBudW1Ub2xlcmF0ZWRJdGVtcztcblxuICAgICAgICBpZiAodGhpcy5zaG93TG9hZGVyKSB7XG4gICAgICAgICAgICB0aGlzLmxvYWRlckFyciA9IHRoaXMuYm90aCA/XG4gICAgICAgICAgICAgICAgQXJyYXkuZnJvbSh7IGxlbmd0aDogbnVtSXRlbXNJblZpZXdwb3J0LnJvd3MgfSkubWFwKCgpID0+IEFycmF5LmZyb20oeyBsZW5ndGg6IG51bUl0ZW1zSW5WaWV3cG9ydC5jb2xzIH0pKSA6XG4gICAgICAgICAgICAgICAgQXJyYXkuZnJvbSh7IGxlbmd0aDogbnVtSXRlbXNJblZpZXdwb3J0IH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX2xhenkpIHtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlRXZlbnRzKCdvbkxhenlMb2FkJywgeyBmaXJzdCwgbGFzdCB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNhbGN1bGF0ZUF1dG9TaXplKCkge1xuICAgICAgICBpZiAodGhpcy5fYXV0b1NpemUgJiYgIXRoaXMuZF9sb2FkaW5nKSB7XG4gICAgICAgICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jb250ZW50RWwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50RWwuc3R5bGUubWluSGVpZ2h0ID0gdGhpcy5jb250ZW50RWwuc3R5bGUubWluV2lkdGggPSAnYXV0byc7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBvZmZzZXRXaWR0aCwgb2Zmc2V0SGVpZ2h0IH0gPSB0aGlzLmNvbnRlbnRFbDtcblxuICAgICAgICAgICAgICAgICAgICAodGhpcy5ib3RoIHx8IHRoaXMuaG9yaXpvbnRhbCkgJiYgKHRoaXMuZWxlbWVudFZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LnN0eWxlLndpZHRoID0gKG9mZnNldFdpZHRoIDwgdGhpcy5kZWZhdWx0V2lkdGggPyBvZmZzZXRXaWR0aCA6IHRoaXMuZGVmYXVsdFdpZHRoKSArICdweCcpO1xuICAgICAgICAgICAgICAgICAgICAodGhpcy5ib3RoIHx8IHRoaXMudmVydGljYWwpICYmICh0aGlzLmVsZW1lbnRWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zdHlsZS5oZWlnaHQgPSAob2Zmc2V0SGVpZ2h0IDwgdGhpcy5kZWZhdWx0SGVpZ2h0ID8gb2Zmc2V0SGVpZ2h0IDogdGhpcy5kZWZhdWx0SGVpZ2h0KSArICdweCcpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnRFbC5zdHlsZS5taW5IZWlnaHQgPSB0aGlzLmNvbnRlbnRFbC5zdHlsZS5taW5XaWR0aCA9ICcnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0TGFzdChsYXN0ID0gMCwgaXNDb2xzID0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2l0ZW1zID8gTWF0aC5taW4oKGlzQ29scyA/ICh0aGlzLl9jb2x1bW5zIHx8IHRoaXMuX2l0ZW1zWzBdKS5sZW5ndGggOiB0aGlzLl9pdGVtcy5sZW5ndGgpLCBsYXN0KSA6IDA7XG4gICAgfVxuXG4gICAgZ2V0Q29udGVudFBvc2l0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5jb250ZW50RWwpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmNvbnRlbnRFbCk7XG4gICAgICAgICAgICBjb25zdCBsZWZ0ID0gcGFyc2VGbG9hdChzdHlsZS5wYWRkaW5nTGVmdCkgKyBNYXRoLm1heCgocGFyc2VGbG9hdChzdHlsZS5sZWZ0KSB8fCAwKSwgMCk7XG4gICAgICAgICAgICBjb25zdCByaWdodCA9IHBhcnNlRmxvYXQoc3R5bGUucGFkZGluZ1JpZ2h0KSArIE1hdGgubWF4KChwYXJzZUZsb2F0KHN0eWxlLnJpZ2h0KSB8fCAwKSwgMCk7XG4gICAgICAgICAgICBjb25zdCB0b3AgPSBwYXJzZUZsb2F0KHN0eWxlLnBhZGRpbmdUb3ApICsgTWF0aC5tYXgoKHBhcnNlRmxvYXQoc3R5bGUudG9wKSB8fCAwKSwgMCk7XG4gICAgICAgICAgICBjb25zdCBib3R0b20gPSBwYXJzZUZsb2F0KHN0eWxlLnBhZGRpbmdCb3R0b20pICsgTWF0aC5tYXgoKHBhcnNlRmxvYXQoc3R5bGUuYm90dG9tKSB8fCAwKSwgMCk7XG5cbiAgICAgICAgICAgIHJldHVybiB7IGxlZnQsIHJpZ2h0LCB0b3AsIGJvdHRvbSwgeDogbGVmdCArIHJpZ2h0LCB5OiB0b3AgKyBib3R0b20gfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7IGxlZnQ6IDAsIHJpZ2h0OiAwLCB0b3A6IDAsIGJvdHRvbTogMCwgeDogMCwgeTogMCB9O1xuICAgIH1cblxuICAgIHNldFNpemUoKSB7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnRWaWV3Q2hpbGQ/Lm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgICAgIGNvbnN0IHBhcmVudEVsZW1lbnQgPSB0aGlzLmVsZW1lbnRWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgICAgICAgICBjb25zdCB3aWR0aCA9IHRoaXMuX3Njcm9sbFdpZHRoIHx8IGAkeyh0aGlzLmVsZW1lbnRWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5vZmZzZXRXaWR0aCB8fCBwYXJlbnRFbGVtZW50Lm9mZnNldFdpZHRoKX1weGA7XG4gICAgICAgICAgICBjb25zdCBoZWlnaHQgPSB0aGlzLl9zY3JvbGxIZWlnaHQgfHwgYCR7KHRoaXMuZWxlbWVudFZpZXdDaGlsZC5uYXRpdmVFbGVtZW50Lm9mZnNldEhlaWdodCB8fCBwYXJlbnRFbGVtZW50Lm9mZnNldEhlaWdodCl9cHhgO1xuICAgICAgICAgICAgY29uc3Qgc2V0UHJvcCA9IChfbmFtZSwgX3ZhbHVlKSA9PiB0aGlzLmVsZW1lbnRWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zdHlsZVtfbmFtZV0gPSBfdmFsdWU7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmJvdGggfHwgdGhpcy5ob3Jpem9udGFsKSB7XG4gICAgICAgICAgICAgICAgc2V0UHJvcCgnaGVpZ2h0JywgaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICBzZXRQcm9wKCd3aWR0aCcsIHdpZHRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHNldFByb3AoJ2hlaWdodCcsIGhlaWdodCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRTcGFjZXJTaXplKCkge1xuICAgICAgICBpZiAodGhpcy5faXRlbXMpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRlbnRQb3MgPSB0aGlzLmdldENvbnRlbnRQb3NpdGlvbigpO1xuICAgICAgICAgICAgY29uc3Qgc2V0UHJvcCA9IChfbmFtZSwgX3ZhbHVlLCBfc2l6ZSwgX2Nwb3MgPSAwKSA9PiB0aGlzLnNwYWNlclN0eWxlID0geyAuLi50aGlzLnNwYWNlclN0eWxlLCAuLi57IFtgJHtfbmFtZX1gXTogKCgoX3ZhbHVlIHx8IFtdKS5sZW5ndGggKiBfc2l6ZSkgKyBfY3BvcykgKyAncHgnIH0gfTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuYm90aCkge1xuICAgICAgICAgICAgICAgIHNldFByb3AoJ2hlaWdodCcsIHRoaXMuX2l0ZW1zLCB0aGlzLl9pdGVtU2l6ZVswXSwgY29udGVudFBvcy55KTtcbiAgICAgICAgICAgICAgICBzZXRQcm9wKCd3aWR0aCcsICh0aGlzLl9jb2x1bW5zIHx8IHRoaXMuX2l0ZW1zWzFdKSwgdGhpcy5faXRlbVNpemVbMV0sIGNvbnRlbnRQb3MueCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhvcml6b250YWwgPyBzZXRQcm9wKCd3aWR0aCcsICh0aGlzLl9jb2x1bW5zIHx8IHRoaXMuX2l0ZW1zKSwgdGhpcy5faXRlbVNpemUsIGNvbnRlbnRQb3MueCkgOiBzZXRQcm9wKCdoZWlnaHQnLCB0aGlzLl9pdGVtcywgdGhpcy5faXRlbVNpemUsIGNvbnRlbnRQb3MueSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRDb250ZW50UG9zaXRpb24ocG9zKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbnRlbnRFbCkge1xuICAgICAgICAgICAgY29uc3QgZmlyc3QgPSBwb3MgPyBwb3MuZmlyc3QgOiB0aGlzLmZpcnN0O1xuICAgICAgICAgICAgY29uc3QgY2FsY3VsYXRlVHJhbnNsYXRlVmFsID0gKF9maXJzdCwgX3NpemUpID0+IChfZmlyc3QgKiBfc2l6ZSk7XG4gICAgICAgICAgICBjb25zdCBzZXRUcmFuc2Zvcm0gPSAoX3ggPSAwLCBfeSA9IDApID0+IHRoaXMuY29udGVudFN0eWxlID0geyAuLi50aGlzLmNvbnRlbnRTdHlsZSwgLi4ueyB0cmFuc2Zvcm06IGB0cmFuc2xhdGUzZCgke194fXB4LCAke195fXB4LCAwKWAgfSB9O1xuXG4gICAgICAgICAgICBpZiAodGhpcy5ib3RoKSB7XG4gICAgICAgICAgICAgICAgc2V0VHJhbnNmb3JtKGNhbGN1bGF0ZVRyYW5zbGF0ZVZhbChmaXJzdC5jb2xzLCB0aGlzLl9pdGVtU2l6ZVsxXSksIGNhbGN1bGF0ZVRyYW5zbGF0ZVZhbChmaXJzdC5yb3dzLCB0aGlzLl9pdGVtU2l6ZVswXSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdHJhbnNsYXRlVmFsID0gY2FsY3VsYXRlVHJhbnNsYXRlVmFsKGZpcnN0LCB0aGlzLl9pdGVtU2l6ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5ob3Jpem9udGFsID8gc2V0VHJhbnNmb3JtKHRyYW5zbGF0ZVZhbCwgMCkgOiBzZXRUcmFuc2Zvcm0oMCwgdHJhbnNsYXRlVmFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uU2Nyb2xsUG9zaXRpb25DaGFuZ2UoZXZlbnQpIHtcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xuICAgICAgICBjb25zdCBjb250ZW50UG9zID0gdGhpcy5nZXRDb250ZW50UG9zaXRpb24oKTtcbiAgICAgICAgY29uc3QgY2FsY3VsYXRlU2Nyb2xsUG9zID0gKF9wb3MsIF9jcG9zKSA9PiBfcG9zID8gKF9wb3MgPiBfY3BvcyA/IF9wb3MgLSBfY3BvcyA6IF9wb3MpIDogMDtcbiAgICAgICAgY29uc3QgY2FsY3VsYXRlQ3VycmVudEluZGV4ID0gKF9wb3MsIF9zaXplKSA9PiBNYXRoLmZsb29yKF9wb3MgLyAoX3NpemUgfHwgX3BvcykpO1xuICAgICAgICBjb25zdCBjYWxjdWxhdGVUcmlnZ2VySW5kZXggPSAoX2N1cnJlbnRJbmRleCwgX2ZpcnN0LCBfbGFzdCwgX251bSwgX251bVQsIF9pc1Njcm9sbERvd25PclJpZ2h0KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKF9jdXJyZW50SW5kZXggPD0gX251bVQgPyBfbnVtVCA6IChfaXNTY3JvbGxEb3duT3JSaWdodCA/IChfbGFzdCAtIF9udW0gLSBfbnVtVCkgOiAoX2ZpcnN0ICsgX251bVQgLSAxKSkpXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGNhbGN1bGF0ZUZpcnN0ID0gKF9jdXJyZW50SW5kZXgsIF90cmlnZ2VySW5kZXgsIF9maXJzdCwgX2xhc3QsIF9udW0sIF9udW1ULCBfaXNTY3JvbGxEb3duT3JSaWdodCkgPT4ge1xuICAgICAgICAgICAgaWYgKF9jdXJyZW50SW5kZXggPD0gX251bVQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGgubWF4KDAsIF9pc1Njcm9sbERvd25PclJpZ2h0ID9cbiAgICAgICAgICAgICAgICAgICAgKF9jdXJyZW50SW5kZXggPCBfdHJpZ2dlckluZGV4ID8gX2ZpcnN0IDogX2N1cnJlbnRJbmRleCAtIF9udW1UKSA6XG4gICAgICAgICAgICAgICAgICAgIChfY3VycmVudEluZGV4ID4gX3RyaWdnZXJJbmRleCA/IF9maXJzdCA6IF9jdXJyZW50SW5kZXggLSAoMiAqIF9udW1UKSkpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBjYWxjdWxhdGVMYXN0ID0gKF9jdXJyZW50SW5kZXgsIF9maXJzdCwgX2xhc3QsIF9udW0sIF9udW1ULCBfaXNDb2xzID0gZmFsc2UpID0+IHtcbiAgICAgICAgICAgIGxldCBsYXN0VmFsdWUgPSBfZmlyc3QgKyBfbnVtICsgKDIgKiBfbnVtVCk7XG5cbiAgICAgICAgICAgIGlmIChfY3VycmVudEluZGV4ID49IF9udW1UKSB7XG4gICAgICAgICAgICAgICAgbGFzdFZhbHVlICs9IChfbnVtVCArIDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRMYXN0KGxhc3RWYWx1ZSwgX2lzQ29scyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgc2Nyb2xsVG9wID0gY2FsY3VsYXRlU2Nyb2xsUG9zKHRhcmdldC5zY3JvbGxUb3AsIGNvbnRlbnRQb3MudG9wKTtcbiAgICAgICAgY29uc3Qgc2Nyb2xsTGVmdCA9IGNhbGN1bGF0ZVNjcm9sbFBvcyh0YXJnZXQuc2Nyb2xsTGVmdCwgY29udGVudFBvcy5sZWZ0KTtcblxuICAgICAgICBsZXQgbmV3Rmlyc3QgPSB0aGlzLmJvdGggPyB7IHJvd3M6IDAsIGNvbHM6IDAgfSA6IDA7XG4gICAgICAgIGxldCBuZXdMYXN0ID0gdGhpcy5sYXN0O1xuICAgICAgICBsZXQgaXNSYW5nZUNoYW5nZWQgPSBmYWxzZTtcbiAgICAgICAgbGV0IG5ld1Njcm9sbFBvcyA9IHRoaXMubGFzdFNjcm9sbFBvcztcblxuICAgICAgICBpZiAodGhpcy5ib3RoKSB7XG4gICAgICAgICAgICBjb25zdCBpc1Njcm9sbERvd24gPSB0aGlzLmxhc3RTY3JvbGxQb3MudG9wIDw9IHNjcm9sbFRvcDtcbiAgICAgICAgICAgIGNvbnN0IGlzU2Nyb2xsUmlnaHQgPSB0aGlzLmxhc3RTY3JvbGxQb3MubGVmdCA8PSBzY3JvbGxMZWZ0O1xuICAgICAgICAgICAgY29uc3QgY3VycmVudEluZGV4ID0geyByb3dzOiBjYWxjdWxhdGVDdXJyZW50SW5kZXgoc2Nyb2xsVG9wLCB0aGlzLl9pdGVtU2l6ZVswXSksIGNvbHM6IGNhbGN1bGF0ZUN1cnJlbnRJbmRleChzY3JvbGxMZWZ0LCB0aGlzLl9pdGVtU2l6ZVsxXSkgfTtcbiAgICAgICAgICAgIGNvbnN0IHRyaWdnZXJJbmRleCA9IHtcbiAgICAgICAgICAgICAgICByb3dzOiBjYWxjdWxhdGVUcmlnZ2VySW5kZXgoY3VycmVudEluZGV4LnJvd3MsIHRoaXMuZmlyc3Qucm93cywgdGhpcy5sYXN0LnJvd3MsIHRoaXMubnVtSXRlbXNJblZpZXdwb3J0LnJvd3MsIHRoaXMuZF9udW1Ub2xlcmF0ZWRJdGVtc1swXSwgaXNTY3JvbGxEb3duKSxcbiAgICAgICAgICAgICAgICBjb2xzOiBjYWxjdWxhdGVUcmlnZ2VySW5kZXgoY3VycmVudEluZGV4LmNvbHMsIHRoaXMuZmlyc3QuY29scywgdGhpcy5sYXN0LmNvbHMsIHRoaXMubnVtSXRlbXNJblZpZXdwb3J0LmNvbHMsIHRoaXMuZF9udW1Ub2xlcmF0ZWRJdGVtc1sxXSwgaXNTY3JvbGxSaWdodClcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIG5ld0ZpcnN0ID0ge1xuICAgICAgICAgICAgICAgIHJvd3M6IGNhbGN1bGF0ZUZpcnN0KGN1cnJlbnRJbmRleC5yb3dzLCB0cmlnZ2VySW5kZXgucm93cywgdGhpcy5maXJzdC5yb3dzLCB0aGlzLmxhc3Qucm93cywgdGhpcy5udW1JdGVtc0luVmlld3BvcnQucm93cywgdGhpcy5kX251bVRvbGVyYXRlZEl0ZW1zWzBdLCBpc1Njcm9sbERvd24pLFxuICAgICAgICAgICAgICAgIGNvbHM6IGNhbGN1bGF0ZUZpcnN0KGN1cnJlbnRJbmRleC5jb2xzLCB0cmlnZ2VySW5kZXguY29scywgdGhpcy5maXJzdC5jb2xzLCB0aGlzLmxhc3QuY29scywgdGhpcy5udW1JdGVtc0luVmlld3BvcnQuY29scywgdGhpcy5kX251bVRvbGVyYXRlZEl0ZW1zWzFdLCBpc1Njcm9sbFJpZ2h0KVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIG5ld0xhc3QgPSB7XG4gICAgICAgICAgICAgICAgcm93czogY2FsY3VsYXRlTGFzdChjdXJyZW50SW5kZXgucm93cywgbmV3Rmlyc3Qucm93cywgdGhpcy5sYXN0LnJvd3MsIHRoaXMubnVtSXRlbXNJblZpZXdwb3J0LnJvd3MsIHRoaXMuZF9udW1Ub2xlcmF0ZWRJdGVtc1swXSksXG4gICAgICAgICAgICAgICAgY29sczogY2FsY3VsYXRlTGFzdChjdXJyZW50SW5kZXguY29scywgbmV3Rmlyc3QuY29scywgdGhpcy5sYXN0LmNvbHMsIHRoaXMubnVtSXRlbXNJblZpZXdwb3J0LmNvbHMsIHRoaXMuZF9udW1Ub2xlcmF0ZWRJdGVtc1sxXSwgdHJ1ZSlcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlzUmFuZ2VDaGFuZ2VkID0gKG5ld0ZpcnN0LnJvd3MgIT09IHRoaXMuZmlyc3Qucm93cyB8fCBuZXdMYXN0LnJvd3MgIT09IHRoaXMubGFzdC5yb3dzKSB8fCAobmV3Rmlyc3QuY29scyAhPT0gdGhpcy5maXJzdC5jb2xzIHx8IG5ld0xhc3QuY29scyAhPT0gdGhpcy5sYXN0LmNvbHMpO1xuICAgICAgICAgICAgbmV3U2Nyb2xsUG9zID0geyB0b3A6IHNjcm9sbFRvcCwgbGVmdDogc2Nyb2xsTGVmdCB9O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3Qgc2Nyb2xsUG9zID0gdGhpcy5ob3Jpem9udGFsID8gc2Nyb2xsTGVmdCA6IHNjcm9sbFRvcDtcbiAgICAgICAgICAgIGNvbnN0IGlzU2Nyb2xsRG93bk9yUmlnaHQgPSB0aGlzLmxhc3RTY3JvbGxQb3MgPD0gc2Nyb2xsUG9zO1xuICAgICAgICAgICAgY29uc3QgY3VycmVudEluZGV4ID0gY2FsY3VsYXRlQ3VycmVudEluZGV4KHNjcm9sbFBvcywgdGhpcy5faXRlbVNpemUpO1xuICAgICAgICAgICAgY29uc3QgdHJpZ2dlckluZGV4ID0gY2FsY3VsYXRlVHJpZ2dlckluZGV4KGN1cnJlbnRJbmRleCwgdGhpcy5maXJzdCwgdGhpcy5sYXN0LCB0aGlzLm51bUl0ZW1zSW5WaWV3cG9ydCwgdGhpcy5kX251bVRvbGVyYXRlZEl0ZW1zLCBpc1Njcm9sbERvd25PclJpZ2h0KTtcblxuICAgICAgICAgICAgbmV3Rmlyc3QgPSBjYWxjdWxhdGVGaXJzdChjdXJyZW50SW5kZXgsIHRyaWdnZXJJbmRleCwgdGhpcy5maXJzdCwgdGhpcy5sYXN0LCB0aGlzLm51bUl0ZW1zSW5WaWV3cG9ydCwgdGhpcy5kX251bVRvbGVyYXRlZEl0ZW1zLCBpc1Njcm9sbERvd25PclJpZ2h0KTtcbiAgICAgICAgICAgIG5ld0xhc3QgPSBjYWxjdWxhdGVMYXN0KGN1cnJlbnRJbmRleCwgbmV3Rmlyc3QsIHRoaXMubGFzdCwgdGhpcy5udW1JdGVtc0luVmlld3BvcnQsIHRoaXMuZF9udW1Ub2xlcmF0ZWRJdGVtcyk7XG4gICAgICAgICAgICBpc1JhbmdlQ2hhbmdlZCA9IG5ld0ZpcnN0ICE9PSB0aGlzLmZpcnN0IHx8IG5ld0xhc3QgIT09IHRoaXMubGFzdDtcbiAgICAgICAgICAgIG5ld1Njcm9sbFBvcyA9IHNjcm9sbFBvcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBmaXJzdDogbmV3Rmlyc3QsXG4gICAgICAgICAgICBsYXN0OiBuZXdMYXN0LFxuICAgICAgICAgICAgaXNSYW5nZUNoYW5nZWQsXG4gICAgICAgICAgICBzY3JvbGxQb3M6IG5ld1Njcm9sbFBvc1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25TY3JvbGxDaGFuZ2UoZXZlbnQpIHtcbiAgICAgICAgY29uc3QgeyBmaXJzdCwgbGFzdCwgaXNSYW5nZUNoYW5nZWQsIHNjcm9sbFBvcyB9ID0gdGhpcy5vblNjcm9sbFBvc2l0aW9uQ2hhbmdlKGV2ZW50KTtcblxuICAgICAgICBpZiAoaXNSYW5nZUNoYW5nZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IG5ld1N0YXRlID0geyBmaXJzdCwgbGFzdCB9O1xuXG4gICAgICAgICAgICB0aGlzLnNldENvbnRlbnRQb3NpdGlvbihuZXdTdGF0ZSk7XG5cbiAgICAgICAgICAgIHRoaXMuZmlyc3QgPSBmaXJzdDtcbiAgICAgICAgICAgIHRoaXMubGFzdCA9IGxhc3Q7XG4gICAgICAgICAgICB0aGlzLmxhc3RTY3JvbGxQb3MgPSBzY3JvbGxQb3M7XG5cbiAgICAgICAgICAgIHRoaXMuaGFuZGxlRXZlbnRzKCdvblNjcm9sbEluZGV4Q2hhbmdlJywgbmV3U3RhdGUpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5fbGF6eSkge1xuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlRXZlbnRzKCdvbkxhenlMb2FkJywgbmV3U3RhdGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25Db250YWluZXJTY3JvbGwoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVFdmVudHMoJ29uU2Nyb2xsJywgeyBvcmlnaW5hbEV2ZW50OiBldmVudCB9KTtcblxuICAgICAgICBpZiAodGhpcy5fZGVsYXkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnNjcm9sbFRpbWVvdXQpIHtcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5zY3JvbGxUaW1lb3V0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCF0aGlzLmRfbG9hZGluZyAmJiB0aGlzLnNob3dMb2FkZXIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGlzUmFuZ2VDaGFuZ2VkOiBjaGFuZ2VkIH0gPSB0aGlzLm9uU2Nyb2xsUG9zaXRpb25DaGFuZ2UoZXZlbnQpO1xuICAgICAgICAgICAgICAgIGlmIChjaGFuZ2VkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZF9sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNkLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMub25TY3JvbGxDaGFuZ2UoZXZlbnQpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZF9sb2FkaW5nICYmIHRoaXMuc2hvd0xvYWRlciAmJiAoIXRoaXMuX2xhenkgfHwgdGhpcy5fbG9hZGluZyA9PT0gdW5kZWZpbmVkKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRfbG9hZGluZyA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2QuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHRoaXMuX2RlbGF5KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMub25TY3JvbGxDaGFuZ2UoZXZlbnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25XaW5kb3dSZXNpemUoKSB7XG4gICAgICAgIGlmICh0aGlzLnJlc2l6ZVRpbWVvdXQpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnJlc2l6ZVRpbWVvdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZXNpemVUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5lbGVtZW50Vmlld0NoaWxkKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgW3dpZHRoLCBoZWlnaHRdID0gW0RvbUhhbmRsZXIuZ2V0V2lkdGgodGhpcy5lbGVtZW50Vmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQpLCBEb21IYW5kbGVyLmdldEhlaWdodCh0aGlzLmVsZW1lbnRWaWV3Q2hpbGQubmF0aXZlRWxlbWVudCldO1xuICAgICAgICAgICAgICAgIGNvbnN0IFtpc0RpZmZXaWR0aCwgaXNEaWZmSGVpZ2h0XSA9IFt3aWR0aCAhPT0gdGhpcy5kZWZhdWx0V2lkdGgsIGhlaWdodCAhPT0gdGhpcy5kZWZhdWx0SGVpZ2h0XTtcbiAgICAgICAgICAgICAgICBjb25zdCByZWluaXQgPSB0aGlzLmJvdGggPyAoaXNEaWZmV2lkdGggfHwgaXNEaWZmSGVpZ2h0KSA6ICh0aGlzLmhvcml6b250YWwgPyBpc0RpZmZXaWR0aCA6ICh0aGlzLnZlcnRpY2FsID8gaXNEaWZmSGVpZ2h0IDogZmFsc2UpKTtcblxuICAgICAgICAgICAgICAgIHJlaW5pdCAmJiB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kX251bVRvbGVyYXRlZEl0ZW1zID0gdGhpcy5fbnVtVG9sZXJhdGVkSXRlbXM7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVmYXVsdFdpZHRoID0gd2lkdGg7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVmYXVsdEhlaWdodCA9IGhlaWdodDtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcy5fcmVzaXplRGVsYXkpO1xuICAgIH1cblxuICAgIGhhbmRsZUV2ZW50cyhuYW1lLCBwYXJhbXMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnNbbmFtZV0gPyB0aGlzLm9wdGlvbnNbbmFtZV0ocGFyYW1zKSA6IHRoaXNbbmFtZV0uZW1pdChwYXJhbXMpO1xuICAgIH1cblxuICAgIGdldENvbnRlbnRPcHRpb25zKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29udGVudFN0eWxlQ2xhc3M6IGBwLXNjcm9sbGVyLWNvbnRlbnQgJHt0aGlzLmRfbG9hZGluZyA/ICdwLXNjcm9sbGVyLWxvYWRpbmcnIDogJyd9YCxcbiAgICAgICAgICAgIGl0ZW1zOiB0aGlzLmxvYWRlZEl0ZW1zLFxuICAgICAgICAgICAgZ2V0SXRlbU9wdGlvbnM6IChpbmRleCkgPT4gdGhpcy5nZXRPcHRpb25zKGluZGV4KSxcbiAgICAgICAgICAgIGxvYWRpbmc6IHRoaXMuZF9sb2FkaW5nLFxuICAgICAgICAgICAgZ2V0TG9hZGVyT3B0aW9uczogKGluZGV4LCBvcHRpb25zPykgPT4gdGhpcy5nZXRMb2FkZXJPcHRpb25zKGluZGV4LCBvcHRpb25zKSxcbiAgICAgICAgICAgIGl0ZW1TaXplOiB0aGlzLl9pdGVtU2l6ZSxcbiAgICAgICAgICAgIHJvd3M6IHRoaXMubG9hZGVkUm93cyxcbiAgICAgICAgICAgIGNvbHVtbnM6IHRoaXMubG9hZGVkQ29sdW1ucyxcbiAgICAgICAgICAgIHNwYWNlclN0eWxlOiB0aGlzLnNwYWNlclN0eWxlLFxuICAgICAgICAgICAgY29udGVudFN0eWxlOiB0aGlzLmNvbnRlbnRTdHlsZSxcbiAgICAgICAgICAgIHZlcnRpY2FsOiB0aGlzLnZlcnRpY2FsLFxuICAgICAgICAgICAgaG9yaXpvbnRhbDogdGhpcy5ob3Jpem9udGFsLFxuICAgICAgICAgICAgYm90aDogdGhpcy5ib3RoXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRPcHRpb25zKHJlbmRlcmVkSW5kZXgpIHtcbiAgICAgICAgY29uc3QgY291bnQgPSAodGhpcy5faXRlbXMgfHwgW10pLmxlbmd0aDtcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmJvdGggPyB0aGlzLmZpcnN0LnJvd3MgKyByZW5kZXJlZEluZGV4IDogdGhpcy5maXJzdCArIHJlbmRlcmVkSW5kZXg7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGluZGV4LFxuICAgICAgICAgICAgY291bnQsXG4gICAgICAgICAgICBmaXJzdDogaW5kZXggPT09IDAsXG4gICAgICAgICAgICBsYXN0OiBpbmRleCA9PT0gKGNvdW50IC0gMSksXG4gICAgICAgICAgICBldmVuOiBpbmRleCAlIDIgPT09IDAsXG4gICAgICAgICAgICBvZGQ6IGluZGV4ICUgMiAhPT0gMFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0TG9hZGVyT3B0aW9ucyhpbmRleCwgZXh0T3B0aW9ucykge1xuICAgICAgICBjb25zdCBjb3VudCA9IHRoaXMubG9hZGVyQXJyLmxlbmd0aDtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICBjb3VudCxcbiAgICAgICAgICAgIGZpcnN0OiBpbmRleCA9PT0gMCxcbiAgICAgICAgICAgIGxhc3Q6IGluZGV4ID09PSAoY291bnQgLSAxKSxcbiAgICAgICAgICAgIGV2ZW46IGluZGV4ICUgMiA9PT0gMCxcbiAgICAgICAgICAgIG9kZDogaW5kZXggJSAyICE9PSAwLFxuICAgICAgICAgICAgLi4uZXh0T3B0aW9uc1xuICAgICAgICB9XG4gICAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdLFxuICAgIGV4cG9ydHM6IFtTY3JvbGxlcl0sXG4gICAgZGVjbGFyYXRpb25zOiBbU2Nyb2xsZXJdXG59KVxuZXhwb3J0IGNsYXNzIFNjcm9sbGVyTW9kdWxlIHsgfVxuIl19