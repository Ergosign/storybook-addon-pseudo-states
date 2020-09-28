/** *** ADDON HTML STRUCTURE:

 //Wrapper
 <div class="pseudo-states-addon__container">

 //n story containers
 <div className="pseudo-states-addon__story pseudo-states-addon__story--Normal">
 <div className="pseudo-states-addon__story__header">Normal:</div>
 <div className="pseudo-states-addon__story__container">{story}</div>
 </div>

 // closing wrapper
 </div>
 */

export const container = `
  .pseudo-states-addon__container {
      display: flex;
      // flex: 1 1 auto;
      flex-direction: column;
    }
   .pseudo-states-addon__container.row {
        flex-direction: row;
        flex-wrap: wrap;
    }
    .pseudo-states-addon__container--permutation {
      margin: 0 20px;
    }
    .pseudo-states-addon__container--permutation.row {
      margin: 20px 0;
    }
`;

export const story = `
  .pseudo-states-addon__story {
      flex: 1 1 100%;
      /* todo: remove margin */
      margin: 0 0 10px 0;
  }
  .pseudo-states-addon__story.row {
      flex: 1 1 100%;
      /* todo: remove margin */
      margin: 0 15px 15px 0;
  }
`;

export const storyHeader = `
  .pseudo-states-addon__story__header {
      margin-bottom: 5px;
      white-space: nowrap;
   }

   .pseudo-states-addon__story__header::first-letter {
     text-transform: uppercase;
   }
`;

export const storyContainer = `
  .pseudo-states-addon__story__container:not(.addonDisabled) {
      padding: 0 0 0 0;
  }
`;

export const styles = `
  ${container},
  ${story},
  ${storyHeader},
  ${storyContainer}
`;

export default styles;
