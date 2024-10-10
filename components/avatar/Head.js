import React from 'react';
import Svg, { Circle } from 'react-native-svg';

const Head = ({ skinColor }) => (
  <Svg height="100" width="100">
    <Circle cx="50" cy="50" r="50" fill={skinColor} />
  </Svg>
);

export default Head;
