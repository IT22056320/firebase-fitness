import React from 'react';
import Svg, { Rect } from 'react-native-svg';

const Clothes = ({ clothingColor }) => (
  <Svg height="150" width="100" style={{ position: 'absolute', bottom: 0 }}>
    <Rect x="0" y="0" width="100" height="150" fill={clothingColor} />
  </Svg>
);

export default Clothes;
