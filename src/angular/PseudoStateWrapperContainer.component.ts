import {
  AfterViewInit,
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
import { AttributeStatesObj } from '../share/AttributeStatesObj';
import { PermutationStatsObj } from '../share/PermutationsStatesObj';

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
        <ng-container
          [ngTemplateOutlet]="template"
          [ngTemplateOutletContext]="context"
          #viewRef
        ></ng-container>
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

  // eslint-disable-next-line react/static-property-placement
  public context: any = {};

  @Input() template: TemplateRef<any>;

  @Input() pseudoState: PseudoState;

  @Input() parameters: PseudoStatesParameters;

  @Input() selector: string | Array<string>;

  @Input() componentSelector: string;

  @Input() attribute: AttributeStatesObj;

  @Input() addonDisabled = false;

  @Input() rowOrientation = false;

  @Input() permutation: PermutationStatsObj;

  @ViewChild('origStoryWrapper', { static: true }) story!: ElementRef;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.applyStates();
    });

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

    if (this.permutation) {
      this.context[this.permutation.attr] = this.permutation.value;
    }

    if (this.attribute) {
      this.context[this.attribute.attr] = this.attribute.value;
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
