import React from 'react';

function Time(props) {
  let timeLeft;

  // Render only the largest unit
  if(props.timeLeft) {
    if(props.timeLeft.days > 0) {
      timeLeft = `${props.timeLeft.days} Days`;
      return <p className="proposal__time">{timeLeft}</p>;
    }
    if(props.timeLeft.hours > 0) {
      timeLeft = `${props.timeLeft.hours} Hours`;
      return <p className="proposal__time">{timeLeft}</p>;
    }
    if(props.timeLeft.minutes > 0) {
      timeLeft = `${props.timeLeft.minutes} Minutes`;
      return <p className="proposal__time">{timeLeft}</p>;
    }
    if(props.timeLeft.seconds > 0) {
      timeLeft = `${props.timeLeft.seconds} Seconds`;
      return <p className="proposal__time">{timeLeft}</p>;
    }
  }

  return null;
}

export default Time;