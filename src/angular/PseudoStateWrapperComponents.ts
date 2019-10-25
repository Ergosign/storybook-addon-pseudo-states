import {
  AfterViewInit,
  Component,
  ContentChild, ElementRef,
  Input, Renderer2,
  TemplateRef, ViewChild
} from '@angular/core';
import { PseudoState, PseudoStateEnum, StatesComposition } from "../share/types";


@Component({
  selector: "pseudoe-state-wrapper-container",
  template: `
      <div style="padding: 10px;">
          <div class="header" style="margin-bottom: 5px;">{{pseudoState}}:</div>
          <div #origStoryWrapper style="padding: 10px;">
          <ng-container [ngTemplateOutlet]="template">
                        </ng-container>
          </div>
      </div>
  `
})
export class PseudoStateWrapperContainer implements AfterViewInit {

  @Input() template?: TemplateRef<any>;

  @Input() pseudoState?: PseudoState;

  @ViewChild("origStoryWrapper", { static: true }) story?: ElementRef;

  constructor(private renderer: Renderer2) {
  }

  ngAfterViewInit() {
    console.log("origStory", this.story);

    this.renderer.addClass(this.story?.nativeElement.querySelector('button'), `pseudoclass--${this.pseudoState}`);

    // const test = this.story.nativeElement.querySelector("button");
  }

}

@Component({
  selector: "pseudo-state-wrapper",
  template: `
      <div class="pseudo-state-wrapper">

          <ng-container *ngFor="let state of pseudoStates; let i = index;">
              <pseudoe-state-wrapper-container [template]="storyTempl"
                                               [pseudoState]="state">
              </pseudoe-state-wrapper-container>
          </ng-container>
      </div>`,
  styles: []
})
export class PseudoStateWrapperComponent {

  @Input()
  get statesComposition(): string {
    return this._statesComposition;
  }

  set statesComposition(value: string) {
    this._statesComposition = value;
    const stateCompositionObject = JSON.parse(unescape(value)) as StatesComposition;
    this.pseudoStates = stateCompositionObject.pseudo as Array<PseudoState>;
  }

  private _statesComposition: string = '';

  pseudoStates: Array<PseudoState> = [];

  @ContentChild("storyTmpl", { static: true }) storyTempl?: TemplateRef<any>;

}
