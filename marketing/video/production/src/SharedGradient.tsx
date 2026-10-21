import React from "react";
import {Interactive, interpolate, useCurrentFrame, useVideoConfig} from "remotion";

// The displacement is identical to the approved opening at frames 0..479.
export const SharedGradient: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return <Interactive.Div name="Continuous gradient" premountFor={fps}
    style={{position:"absolute", inset:-40,
      background:"radial-gradient(ellipse at 83% 22%,rgba(79,110,247,0.19) 0%,transparent 63%),radial-gradient(ellipse at 15% 88%,rgba(132,115,245,0.10) 0%,transparent 54%),linear-gradient(145deg,#ffffff 0%,#f5f6f8 49%,#edf0ff 100%)",
      translate:interpolate(frame,[0,16*fps],["0px 0px","-32px 16px"],{extrapolateLeft:"clamp",extrapolateRight:"clamp"})}} />;
};
