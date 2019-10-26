import { AfterViewInit, Component, ContentChild, ElementRef, Input, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { PseudoState, PseudoStatesParameters } from '../share/types';


@Component({
  selector: 'pseudoe-state-wrapper-container',
  template: `
      <div>
          <div class="header">{{pseudoState}}:</div>
          <div class="story"
               #origStoryWrapper>
              <ng-container [ngTemplateOutlet]="template"></ng-container>
          </div>
      </div>
  `,
  styles: [
      `
		  :host {
			  display: flex;
			  padding: 10px;
		  }

		  .header {
			  margin-bottom: 5px;
		  }

		  .header::first-letter {
			  text-transform: uppercase;
		  }

		  .story {
			  padding: 10px;
		  }
      `
  ]
})
export class PseudoStateWrapperContainer implements OnInit, AfterViewInit {

  @Input() template: TemplateRef<any>;

  @Input() pseudoState: PseudoState;

  @Input() parameters: PseudoStatesParameters;

  @Input() selector: string | Array<string>;

  @Input() componentSelector: string;

  @Input() isAttribute = false;

  @ViewChild('origStoryWrapper', {static: true}) story!: ElementRef;

  constructor(private renderer: Renderer2) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (!this.selector) {
      this._modifyStateClass(null);
    } else if (typeof this.selector === 'string') {
      this._modifyStateClass(this.selector);
    } else if (Array.isArray(this.selector)) {
      for (const selectorName of (this.selector as Array<string>)) {
        this._modifyStateClass(selectorName);
      }
    }
  }

  private _modifyStateClass(selector: string | null) {

    if (!selector && !this.componentSelector) {
      return;
    }
    let hostElement = null;
    if (selector) {
      hostElement = this.story.nativeElement.querySelector(selector);
    } else {
      hostElement = this.story.nativeElement.querySelector(this.componentSelector);
    }
    console.log('hostElement', hostElement);

    if (this.isAttribute) {
      this.renderer.setAttribute(hostElement, this.pseudoState, 'true');
      // add also to host element
      if (selector && this.componentSelector) {
        this.renderer.setAttribute(this.story.nativeElement.querySelector(this.componentSelector),
          this.pseudoState, 'true');
      }
    } else {
      console.log('addClass', this.pseudoState, this.parameters?.prefix, `${this.parameters?.prefix}${this.pseudoState}`);
      this.renderer.addClass(hostElement, `${this.parameters?.prefix}${this.pseudoState}`);
    }
  }

}

@Component({
  selector: 'pseudo-state-wrapper',
  template: `
      <div class="pseudo-state-wrapper">

          <pseudoe-state-wrapper-container [template]="storyTempl"
                                           [parameters]="storyParams"
                                           [pseudoState]="'Normal'">
          </pseudoe-state-wrapper-container>
          <ng-container *ngFor="let state of pseudoStates">
              <pseudoe-state-wrapper-container [template]="storyTempl"
                                               [selector]="selector"
                                               [componentSelector]="componentSelector"
                                               [parameters]="storyParams"
                                               [pseudoState]="state">
              </pseudoe-state-wrapper-container>
          </ng-container>
          <ng-container *ngFor="let attrState of attributeStates">
              <pseudoe-state-wrapper-container [template]="storyTempl"
                                               [selector]="selector"
                                               [componentSelector]="componentSelector"
                                               [parameters]="storyParams"
                                               [isAttribute]="true"
                                               [pseudoState]="attrState">
              </pseudoe-state-wrapper-container>
          </ng-container>
      </div>`,
  styles: []
})
export class PseudoStateWrapperComponent {


  @Input()
  get parameters(): string {
    return this._parameters;
  }

  set parameters(value: string) {
    this._parameters = value;
    if (value) {
      this.storyParams = JSON.parse(unescape(value)) as PseudoStatesParameters;
      this.pseudoStates = this.storyParams?.stateComposition?.pseudo as Array<PseudoState>;
      this.attributeStates = this.storyParams?.stateComposition?.attributes as Array<PseudoState>;
      this.selector = this.storyParams?.selector || null;
    }
  }

  private _parameters: string;


  @Input()
  get storyComponent(): string {
    return this._storyComponent;
  }

  set storyComponent(value: string) {
    this._storyComponent = value;
    if (value) {
      const tmpStoryComponent = JSON.parse(unescape(value));
      this.componentSelector = tmpStoryComponent?.selector;
    }
  }

  private _storyComponent: string;

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
  selector: string | Array<string> | null;

  /**
   * selector of original story component
   */
  componentSelector: string;

  @ContentChild('storyTmpl', {static: true}) storyTempl: TemplateRef<any>;

}
