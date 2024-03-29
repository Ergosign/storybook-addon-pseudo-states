import {
  Component,
  ContentChild,
  HostBinding,
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
import { PermutationStatsObj } from '../share/PermutationsStatesObj';

@Component({
  selector: 'pseudo-state-wrapper',
  // TODO wrap permutations into own component
  template: `
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
          [pseudoState]="attrState.attr"
          [rowOrientation]="rowOrientation"
        >
        </pseudo-state-wrapper-container>
      </ng-container>
    </ng-container>
    <ng-container *ngIf="!isDisabled">
      <ng-container *ngFor="let permutation of permutationStates">
        <pseudo-state-wrapper-container
          [template]="storyTempl"
          [parameters]="storyParams"
          [addonDisabled]="isDisabled"
          [pseudoState]="permutation.label || permutation.attr"
          [componentSelector]="componentSelector"
          [permutation]="permutation"
          [rowOrientation]="rowOrientation"
        >
        </pseudo-state-wrapper-container>

        <ng-container *ngFor="let state of pseudoStates">
          <pseudo-state-wrapper-container
            [template]="storyTempl"
            [selector]="selector"
            [componentSelector]="componentSelector"
            [parameters]="storyParams"
            [pseudoState]="state"
            [permutation]="permutation"
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
            [permutation]="permutation"
            [attribute]="attrState"
            [pseudoState]="attrState.attr"
            [rowOrientation]="rowOrientation"
          >
          </pseudo-state-wrapper-container>
        </ng-container>
      </ng-container>
    </ng-container>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      :host,
      pseudo-state-wrapper {
        display: grid;
        grid-auto-flow: column;
        grid-gap: 15px;
      }

      :host(.row),
      pseudo-state-wrapper.row {
        grid-auto-flow: row;
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
      this.inlineGrid = this.storyParams?.styles?.inlineGrid || false;
      this.hostOrientationClass = this.rowOrientation ? 'row' : 'column';
      this.pseudoStates = this.storyParams?.pseudos as PseudoStates;
      this.attributeStates = (
        this.storyParams?.attributes as AttributeStates
      ).map((item) => AttributeStatesObj.fromAttributeState(item));

      if (
        this.storyParams?.permutations &&
        this.storyParams?.permutations.length > 0
      ) {
        this.permutationStates = this.storyParams?.permutations.map((item) =>
          PermutationStatsObj.fromPermutationState(item)
        );
      }
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

  @Input() isDisabled =
    sessionStorage.getItem(ADDON_GLOBAL_DISABLE_STATE) === 'true';

  @HostBinding('class') hostOrientationClass = 'column';

  public get inlineGrid() {
    return this._inlineGrid;
  }

  public set inlineGrid(value) {
    this._inlineGrid = value;
    if (value) {
      this.gridDisplay = 'inline-grid';
    } else {
      this.gridDisplay = 'grid';
    }
  }

  private _inlineGrid = false;

  @HostBinding('style.display')
  public gridDisplay = 'grid';

  @HostBinding('style.grid-template')
  get columnCount(): string {
    if (this.permutationStates.length > 1) {
      if (this.rowOrientation) {
        return `repeat(${
          1 + this.permutationStates.length
        }, minmax(min-content, 1fr)) / repeat(${
          1 + this.pseudoStates.length + this.attributeStates.length
        }, minmax(min-content, 1fr))`;
      }
      return `repeat(${
        1 + this.pseudoStates.length + this.attributeStates.length
      }, minmax(min-content, 1fr)) / repeat(${
        1 + this.permutationStates.length
      }, minmax(min-content, 1fr))`;
    }
    if (this.rowOrientation) {
      return `minmax(min-content, 1fr) / repeat(${
        1 + this.pseudoStates.length + this.attributeStates.length
      }, minmax(min-content, 1fr))`;
    }
    return `repeat(${
      1 + this.pseudoStates.length + this.attributeStates.length
    }, minmax(min-content, 1fr)) / minmax(min-content, 1fr)`;
  }

  constructor(private ngZone: NgZone) {}

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
   * All permutation that should be renderd
   */
  permutationStates: Array<PermutationStatsObj> = [];

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
