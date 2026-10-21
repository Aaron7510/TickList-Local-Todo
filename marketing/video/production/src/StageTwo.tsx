import React from "react";
import {AbsoluteFill,Composition,Freeze,Interactive,Sequence,interpolate,useCurrentFrame,useVideoConfig} from "remotion";
import {TickListStageOne} from "./StageOne";
import {CompletionScene} from "./CompletionScene";

export const TickListStageTwo:React.FC=()=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  return <AbsoluteFill data-stage-preview="0-24-seconds"
    style={{overflow:"hidden",background:"#f5f6f8",color:"#1a1d26",fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif'}}>
    <Interactive.Div name="延续相同渐变背景" premountFor={fps}
      style={{position:"absolute",inset:-40,background:"radial-gradient(ellipse at 83% 22%,rgba(79,110,247,0.19) 0%,transparent 63%),radial-gradient(ellipse at 15% 88%,rgba(132,115,245,0.10) 0%,transparent 54%),linear-gradient(145deg,#ffffff 0%,#f5f6f8 49%,#edf0ff 100%)",
        translate:interpolate(frame,[0,24*fps],["0px 0px","-48px 24px"],{extrapolateLeft:"clamp",extrapolateRight:"clamp"})}}/>
    <Sequence name="已通过审查的前16秒" durationInFrames={16*fps} premountFor={fps}>
      <TickListStageOne/>
    </Sequence>
    {/* Keep the frozen composite in a zero-offset layer: its own nested sequences
    // must retain their full duration while only the outer opacity fades for 15 frames. */}
    <Interactive.Div name="截止时间结果退场" durationInFrames={16.25*fps} premountFor={fps}
      style={{position:"absolute",inset:0,opacity:interpolate(frame,[0,16*fps-1,16*fps,16.25*fps],[0,0,1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"})}}>
      <Freeze frame={16*fps-1}><TickListStageOne/></Freeze>
    </Interactive.Div>
    <CompletionScene name="完成一件，筛选下一件" from={16*fps} durationInFrames={8*fps} premountFor={fps}
      showBackground={false} style={{position:"absolute",inset:0}}/>
  </AbsoluteFill>;
};
export const StageTwoComposition=()=> <Composition id="TickListStageTwo" component={TickListStageTwo}
  width={1920} height={1080} fps={60} durationInFrames={1440}/>;
