import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { filter } from 'lodash-es';

import CourseDateUtils from '../../utils/course_date_utils';

const md = require('../../utils/markdown_it.js').default();

const Milestones = createReactClass({
  displayName: I18n.t('blocks.milestones.title'),

  propTypes: {
    timelineStart: PropTypes.string.isRequired,
    weeks: PropTypes.array.isRequired,
    course: PropTypes.object.isRequired
  },

  milestoneBlockType: 2,

  weekIsCompleted(week, currentWeek) {
    return week.order < currentWeek;
  },

  render() {
    const currentWeek = CourseDateUtils.currentWeekOrder(this.props.timelineStart);
    const weekNumberOffset = CourseDateUtils.weeksBeforeTimeline(this.props.course);
    const blocks = [];
    this.props.weeks.map((week) => {
      const milestoneBlocks = filter(week.blocks, block => block.kind === this.milestoneBlockType);
      return milestoneBlocks.map((block) => {
        let classNames = 'module__data';
        if (this.weekIsCompleted(week, currentWeek)) { classNames += ' completed'; }
        const rawHtml = md.render(block.content);
        const completionNote = this.weekIsCompleted(week, currentWeek) ? '- Complete' : undefined;
        return blocks.push(
          <div key={block.id} className="section-header">
            <div className={classNames}>
              <p>Week {week.order + weekNumberOffset} {completionNote}</p>
              <div className="markdown" dangerouslySetInnerHTML={{ __html: rawHtml }} />
              <hr />
            </div>
          </div>
        );
      }
      );
    }
    );

    if (!blocks.length) {
      return null;
    }

    return (
      <div className="module milestones">
        <div className="section-header">
          <h3>{I18n.t('blocks.milestones.title')}</h3>
        </div>
        {blocks}
      </div>
    );
  }
});

export default Milestones;
