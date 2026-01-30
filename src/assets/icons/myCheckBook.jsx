import * as React from 'react';
import Svg, {Rect, Path} from 'react-native-svg';
export const MyCheckBook = props => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size}
    height={props.size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="feather feather-briefcase"
    {...props}>
    <Rect x={2} y={7} width={20} height={14} rx={2} ry={2} />
    <Path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </Svg>
);
