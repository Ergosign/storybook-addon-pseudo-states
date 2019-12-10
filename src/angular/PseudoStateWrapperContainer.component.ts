import {
  AfterViewInit,
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

      .container:not(.addonDisabled) {
        padding: 10px;
      }

      .header {
        margin-bottom: 5px;
      }

      .header::first-letter {
        text-transform: uppercase;
      }

      .story:not(.addonDisabled) {
        padding: 10px;
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

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    if (!this.selector) {
      this._modifyStateClass(null);
    } else if (typeof this.selector === 'string') {
      this._modifyStateClass(this.selector);
    } else if (Array.isArray(this.selector)) {
      for (const selectorName of this.selector as Array<string>) {
        this._modifyStateClass(selectorName);
      }
    }
  }

  /**
   * add pseudo state/attribute state to host or element found by selector
   *
   * @param selector
   * @private
   */
  private _modifyStateClass(selector: string | null) {
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
