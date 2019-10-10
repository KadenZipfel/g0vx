import React from 'react';

function Proposal(props) {
  return (
    <div>
      <p>{props.id}</p>
      <p>{props.name}</p>
    </div>
  )
}

export default Proposal;