import React, {Component} from 'react';

class Result extends Component {
  constructor(props) {
    super(props);

    this.getResult = this.getResult.bind(this);
  }

  getResult() {
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
          {this.getResult()}
        </p>
      </div>
    );
  }
}

export default Result;