import {
  Component,
  ContentChild,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { addons } from '@storybook/addons';
import {
  AttributeStates,
  Orientation,
  PseudoState,
  PseudoStates,
  PseudoStatesParameters,
  Selector,
} from '../share/types';
import { ADDON_GLOBAL_DISABLE_STATE } from '../share/constants';
import { container } from '../share/styles.css';
import { AttributeStatesObj } from '../share/AttributeStatesObj';

@Component({
  selector: 'pseudo-state-wrapper',
  template: `
    <div class="pseudo-states-addon__container" [class.row]="rowOrientation">
      <pseudo-state-wrapper-container
        [template]="storyTempl"
        [parameters]="storyParams"
        [addonDisabled]="isDisabled"
        [pseudoState]="'Normal'"
        [rowOrientation]="rowOrientation"
      >
      </pseudo-state-wrapper-container>
      <ng-container *ngIf="!isDisabled">
        <ng-container *ngFor="let state of pseudoStates">
          <pseudo-state-wrapper-container
            [template]="storyTempl"
            [selector]="selector"
            [componentSelector]="componentSelector"
            [parameters]="storyParams"
            [pseudoState]="state"
            [rowOrientation]="rowOrientation"
          >
          </pseudo-state-wrapper-container>
        </ng-container>
        <ng-container *ngFor="let attrState of attributeStates">
          <pseudo-state-wrapper-container
            [template]="storyTempl"
            [selector]="selector"
            [componentSelector]="componentSelector"
            [parameters]="storyParams"
            [attribute]="attrState"
            [pseudoState]="attrState.name"
            [rowOrientation]="rowOrientation"
          >
          </pseudo-state-wrapper-container>
        </ng-container>
      </ng-container>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      :host,
      pseudo-state-wrapper {
        display: flex;
      }
    `,
    container,
  ],
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
      this.rowOrientation =
        this.storyParams?.styles?.orientation === Orientation.ROW;
      this.pseudoStates = this.storyParams?.pseudos as PseudoStates;
      this.attributeStates = (this.storyParams
        ?.attributes as AttributeStates).map((item) =>
        AttributeStatesObj.fromAttributeState(item)
      );
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
   * All pseudo states to be rendered
   */
  pseudoStates: Array<PseudoState> = [];

  /**
   * All attribute states to be rendered
   */
  attributeStates: Array<AttributeStatesObj> = [];

  /**
   * PseudoSTateParameters (holds selector and stateComposition)
   */
  storyParams: PseudoStatesParameters;

  /**
   * Selector to element that have to be modified
   */
  selector: Selector | null;

  /**
   * Selector of original story component
   */
  componentSelector: string;

  /**
   * Whether story is rendered as row.
   */
  rowOrientation: boolean;

  /**
   * TemplateRef of story teamplate
   */
  @ContentChild('storyTmpl', { static: true }) storyTempl: TemplateRef<any>;
}
