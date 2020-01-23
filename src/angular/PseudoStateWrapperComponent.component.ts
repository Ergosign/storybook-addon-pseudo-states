import {
  Component,
  ContentChild,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { addons } from '@storybook/addons';
import { PseudoState, PseudoStatesParameters, Selector } from '../share/types';
import { ADDON_GLOBAL_DISABLE_STATE } from '../share/constants';

@Component({
  selector: 'pseudo-state-wrapper',
  template: `
    <div class="pseudo-state-wrapper">
      <pseudoe-state-wrapper-container
        [template]="storyTempl"
        [parameters]="storyParams"
        [addonDisabled]="isDisabled"
        [pseudoState]="'Normal'"
      >
      </pseudoe-state-wrapper-container>
      <ng-container *ngIf="!isDisabled">
        <ng-container *ngFor="let state of pseudoStates">
          <pseudoe-state-wrapper-container
            [template]="storyTempl"
            [selector]="selector"
            [componentSelector]="componentSelector"
            [parameters]="storyParams"
            [pseudoState]="state"
          >
          </pseudoe-state-wrapper-container>
        </ng-container>
        <ng-container *ngFor="let attrState of attributeStates">
          <pseudoe-state-wrapper-container
            [template]="storyTempl"
            [selector]="selector"
            [componentSelector]="componentSelector"
            [parameters]="storyParams"
            [isAttribute]="true"
            [pseudoState]="attrState"
          >
          </pseudoe-state-wrapper-container>
        </ng-container>
      </ng-container>
    </div>
  `,
  styles: [],
})
export class PseudoStateWrapperComponent implements OnInit, OnDestroy {
  /**
   * storybook channel for communication between tool and component
   */
  private channel = addons.getChannel();

  /**
   * Parameters of story passed to the component
   */
  @Input()
  get parameters(): string {
    return this._parameters;
  }

  set parameters(value: string) {
    this._parameters = value;
    if (value) {
      this.storyParams = JSON.parse(unescape(value)) as PseudoStatesParameters;
      this.pseudoStates = this.storyParams?.stateComposition?.pseudo as Array<
        PseudoState
      >;
      this.attributeStates = this.storyParams?.stateComposition
        ?.attributes as Array<PseudoState>;
      this.selector = this.storyParams?.selector || null;
    }
  }

  private _parameters: string;

  /**
   * Story's component
   */
  @Input()
  get storyComponent(): string {
    return this._storyComponent;
  }

  set storyComponent(value: string) {
    this._storyComponent = value;
    if (value) {
      const tmpStoryComponent = JSON.parse(unescape(value));
      // extract selector
      this.componentSelector = tmpStoryComponent?.selector;
    }
  }

  private _storyComponent: string;

  // TODO replace with shared useAddonState
  @Input() isDisabled =
    sessionStorage.getItem(ADDON_GLOBAL_DISABLE_STATE) === 'true';

  constructor(/* private _cdRef: ChangeDetectorRef */ private ngZone: NgZone) {}

  /**
   * update disabled state when received toolbutton-click event
   * @param value
   * @private
   */
  _onDisabledStateChangedHandler(value: boolean) {
    // TODO is ngZone best solution?
    this.ngZone.run(() => {
      this.isDisabled = value;
    });
    // this._cdRef.markForCheck();
    // this._cdRef.detectChanges();
    // this._cdRef.checkNoChanges();
  }

  boundButtonClickHandler = this._onDisabledStateChangedHandler.bind(this);

  ngOnInit(): void {
    // this._cdRef.detach();
    this.channel.on('saps/toolbutton-click', this.boundButtonClickHandler);
  }

  ngOnDestroy() {
    this.channel.removeListener(
      'saps/toolbutton-click',
      this.boundButtonClickHandler
    );
  }

  /**
   * all pseudo states to be rendered
   */
  pseudoStates: Array<PseudoState> = [];

  /**
   * all attribute states to be rendered
   */
  attributeStates: Array<PseudoState> = [];

  /**
   * PseudoSTateParameters (holds selector and stateComposition)
   */
  storyParams: PseudoStatesParameters;

  /**
   * selector to element that have to be modified
   */
  selector: Selector | null;

  /**
   * selector of original story component
   */
  componentSelector: string;

  /**
   * TemplateRef of story teamplate
   */
  @ContentChild('storyTmpl', { static: true }) storyTempl: TemplateRef<any>;
}
