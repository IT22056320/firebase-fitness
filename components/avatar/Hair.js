import React from 'react';
import Svg, { Path } from 'react-native-svg';

const Hair = ({ hairColor }) => (
  <Svg height="60" width="120" style={{ position: 'absolute', top: -30 }}>
    <Path
      d="M20,30 Q40,10 60,30 Q80,10 100,30"
      fill={hairColor}
    />
  </Svg>
);

export default Hair;
