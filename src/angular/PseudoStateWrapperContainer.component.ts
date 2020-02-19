import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  Renderer2,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { PseudoState, PseudoStatesParameters } from '../share/types';

@Component({
  selector: 'pseudoe-state-wrapper-container',
  template: `
    <div class="container">
      <div class="header" *ngIf="!addonDisabled">{{ pseudoState }}:</div>
      <div
        class="story"
        [class.addonDisabled]="addonDisabled"
        #origStoryWrapper
      >
        <ng-container [ngTemplateOutlet]="template"></ng-container>
      </div>
    </div>
  `,
  // TODO allow styling from outside
  // encapsulation: ViewEncapsulation.None
  styles: [
    `
      :host {
        display: flex;
      }

      .header {
        margin-bottom: 5px;
      }

      .header::first-letter {
        text-transform: uppercase;
      }

      .story:not(.addonDisabled) {
        padding: 0 0 10px 0;
      }
    `,
  ],
})
export class PseudoStateWrapperContainer implements AfterViewInit {
  @Input() template: TemplateRef<any>;

  @Input() pseudoState: PseudoState;

  @Input() parameters: PseudoStatesParameters;

  @Input() selector: string | Array<string>;

  @Input() componentSelector: string;

  @Input() isAttribute = false;

  @Input() addonDisabled = false;

  @ViewChild('origStoryWrapper', { static: true }) story!: ElementRef;

  constructor(private renderer: Renderer2, private _cdRef: ChangeDetectorRef) {}

  ngAfterViewInit() {
    // TODO find better solution to get component
    // get component ref of template, little bit hacky...
    // @ts-ignore
    let component = this.template?._projectedViews[
      // @ts-ignore
      this.template._projectedViews.length - 1
    ]?.nodes.filter((item: any) => item?.instance);

    if (component.length >= 1) {
      component = component[0]?.instance;
    } else {
      component = null;
    }

    if (!this.selector) {
      this._modifyStateClass(null, component);
    } else if (typeof this.selector === 'string') {
      this._modifyStateClass(this.selector, component);
    } else if (Array.isArray(this.selector)) {
      for (const selectorName of this.selector as Array<string>) {
        this._modifyStateClass(selectorName, component);
      }
    }
  }

  /**
   * add pseudo state/attribute state to host or element found by selector
   *
   * @param selector
   * @param component
   * @private
   */
  private _modifyStateClass(selector: string | null, component: any) {
    if (!selector && !this.componentSelector) {
      return;
    }
    let hostElement = null;
    if (selector) {
      hostElement = this.story.nativeElement.querySelector(selector);
    } else {
      hostElement = this.story.nativeElement.querySelector(
        this.componentSelector
      );
    }

    if (this.isAttribute) {
      // enable attribute on component
      // eslint-disable-next-line no-param-reassign
      component[this.pseudoState] = true;
      this._cdRef.detectChanges();

      this.renderer.setAttribute(hostElement, this.pseudoState, 'true');
      // add also to host element
      if (selector && this.componentSelector) {
        this.renderer.setAttribute(
          this.story.nativeElement.querySelector(this.componentSelector),
          this.pseudoState,
          'true'
        );
      }
    } else {
      this.renderer.addClass(
        hostElement,
        `${this.parameters?.prefix}${this.pseudoState}`
      );
    }
  }
}
