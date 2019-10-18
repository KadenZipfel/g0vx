import React, {Component} from 'react';

import '../layout/components/result.sass';

class Result extends Component {
  renderResult() {
    if(this.props.result === true) {
      return 'Passed';
    } else {
      return 'Failed';
    }
  }

  render() {
    return (
      <div className="result">
        <p className="result__name">
          {this.props.name}
        </p>
        <p className="result__result">
          {this.renderResult()}
        </p>
      </div>
    );
  }
}

export default Result;