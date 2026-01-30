import * as React from "react";
import Svg, { Polyline, Rect, Line } from "react-native-svg";
export const Archive = props => (
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
    className="feather feather-archive"
    {...props}
  >
    <Polyline points="21 8 21 21 3 21 3 8" />
    <Rect x={1} y={3} width={22} height={5} />
    <Line x1={10} y1={12} x2={14} y2={12} />
  </Svg>
);
