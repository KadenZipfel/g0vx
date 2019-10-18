import React from 'react';

function Time(props) {
  let timeLeft;

  // Render only the largest unit
  if(props.timeLeft) {
    if(props.timeLeft.days > 0) {
      timeLeft = `${props.timeLeft.days} Days Remaining`;
      return <p className="time">{timeLeft}</p>;
    }
    if(props.timeLeft.hours > 0) {
      timeLeft = `${props.timeLeft.hours} Hours Remaining`;
      return <p className="time">{timeLeft}</p>;
    }
    if(props.timeLeft.minutes > 0) {
      timeLeft = `${props.timeLeft.minutes} Minutes Remaining`;
      return <p className="time">{timeLeft}</p>;
    }
    if(props.timeLeft.seconds > 0) {
      timeLeft = `${props.timeLeft.seconds} Seconds Remaining`;
      return <p className="time">{timeLeft}</p>;
    }
  }

  return null;
}

export default Time;