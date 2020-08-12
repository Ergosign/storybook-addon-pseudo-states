import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { addons } from '@storybook/addons';
import { FORCE_RE_RENDER } from '@storybook/core-events';
import { PseudoState, PseudoStatesParameters } from '../share/types';
import { getMixedPseudoStates, sanitizePseudoName } from '../share/utils';
import { story, storyHeader } from '../share/styles.css';

@Component({
  selector: 'pseudo-state-wrapper-container',
  template: `
    <div
      class="pseudo-states-addon__story pseudo-states-addon__story--{{
        sanitizePseudoNameFn(pseudoState)
      }}"
      [class.row]="rowOrientation"
    >
      <div class="pseudo-states-addon__story__header" *ngIf="!addonDisabled">
        {{ pseudoState }}:
      </div>
      <div
        class="pseudo-states-addon__story__container"
        [class.addonDisabled]="addonDisabled"
        #origStoryWrapper
      >
        <ng-container [ngTemplateOutlet]="template"></ng-container>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      :host,
      pseudo-state-wrapper-container {
        display: flex;
      }
    `,
    story,
    storyHeader,
  ],
})
export class PseudoStateWrapperContainer implements AfterViewInit, OnDestroy {
  /**
   * storybook channel for communication between tool and component
   */
  private channel = addons.getChannel();

  /**
   * original component of story
   */
  private component: any;

  @Input() template: TemplateRef<any>;

  @Input() pseudoState: PseudoState;

  @Input() parameters: PseudoStatesParameters;

  @Input() selector: string | Array<string>;

  @Input() componentSelector: string;

  @Input() isAttribute = false;

  @Input() addonDisabled = false;

  @Input() rowOrientation = false;

  @ViewChild('origStoryWrapper', { static: true }) story!: ElementRef;

  constructor(private renderer: Renderer2, private _cdRef: ChangeDetectorRef) {}

  ngAfterViewInit() {
    // TODO find better solution to get component
    // get component ref of template, little bit hacky...
    // @ts-ignore
    this.component = this.template?._projectedViews[
      // @ts-ignore
      this.template._projectedViews.length - 1
    ]?.nodes.filter((item: any) => item?.instance);

    if (this.component.length >= 1) {
      this.component = this.component[0]?.instance;
    } else {
      this.component = null;
    }

    this.applyStates();

    // re-apply states when story was forced to rerender
    this.channel.addListener(FORCE_RE_RENDER, this.forceReRenderListener);
  }

  /**
   * Re-apply states whenever story was forced to re-render.
   */
  forceReRenderHandler() {
    this.applyStates();
  }

  forceReRenderListener = this.forceReRenderHandler.bind(this);

  ngOnDestroy() {
    this.channel.removeListener(FORCE_RE_RENDER, this.forceReRenderListener);
  }

  applyStates() {
    if (!this.selector) {
      this._modifyStateClass(null, this.component);
    } else if (typeof this.selector === 'string') {
      this._modifyStateClass(this.selector, this.component);
    } else if (Array.isArray(this.selector)) {
      for (const selectorName of this.selector as Array<string>) {
        this._modifyStateClass(selectorName, this.component);
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
      // get mixed pseudo states
      const subPseudoStates = getMixedPseudoStates(this.pseudoState);
      // apply pseudo states
      for (const s of subPseudoStates) {
        this.renderer.addClass(hostElement, `${this.parameters?.prefix}${s}`);
      }
    }
  }

  /**
   * Wrapper method to use utility method in template.
   * @param pseudoState
   */
  // eslint-disable-next-line class-methods-use-this
  public sanitizePseudoNameFn(pseudoState: PseudoState): string {
    return sanitizePseudoName(pseudoState);
  }
}
