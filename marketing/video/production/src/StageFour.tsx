import React from "react";
import {AbsoluteFill, Composition, Freeze, Interactive, Sequence, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {TickListStageThree} from "./StageThree";
import {EndCardScene} from "./EndCardScene";

export const TickListStageFour: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill data-stage-preview="0-35-seconds"
      style={{overflow:"hidden",background:"#f5f6f8",color:"#1a1d26",fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif'}}>
      <Interactive.Div name="延续全片渐变背景" premountFor={fps}
        style={{position:"absolute",inset:-80,background:"radial-gradient(ellipse at 83% 22%,rgba(79,110,247,0.19) 0%,transparent 63%),radial-gradient(ellipse at 15% 88%,rgba(132,115,245,0.10) 0%,transparent 54%),linear-gradient(145deg,#ffffff 0%,#f5f6f8 49%,#edf0ff 100%)",
          translate:interpolate(frame,[0,35*fps],["0px 0px","-70px 35px"],{extrapolateLeft:"clamp",extrapolateRight:"clamp"})}}/>
      <Sequence name="已审阅前30秒" durationInFrames={30*fps} premountFor={fps}>
        <TickListStageThree/>
      </Sequence>
      <Interactive.Div name="JSON 备份说明退场" durationInFrames={30.25*fps} premountFor={fps}
        style={{position:"absolute",inset:0,opacity:interpolate(frame,[0,30*fps-1,30*fps,30.25*fps],[0,0,1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"})}}>
        <Freeze frame={30*fps-1}><TickListStageThree/></Freeze>
      </Interactive.Div>
      <EndCardScene name="TickList 品牌片尾" from={30*fps} durationInFrames={5*fps} premountFor={fps}
        showBackground={false} style={{position:"absolute",inset:0}}/>
    </AbsoluteFill>
  );
};
export const StageFourComposition = () => <Composition id="TickListStageFour" component={TickListStageFour}
  width={1920} height={1080} fps={60} durationInFrames={2100}/>;
