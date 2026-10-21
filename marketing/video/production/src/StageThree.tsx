import React from "react";
import {AbsoluteFill,Composition,Freeze,Interactive,Sequence,interpolate,useCurrentFrame,useVideoConfig} from "remotion";
import {TickListStageTwo} from "./StageTwo";
import {BackupScene} from "./BackupScene";

export const TickListStageThree:React.FC=()=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  return <AbsoluteFill data-stage-preview="0-30-seconds"
    style={{overflow:"hidden",background:"#f5f6f8",color:"#1a1d26",fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif'}}>
    <Interactive.Div name="延续相同渐变背景" premountFor={fps}
      style={{position:"absolute",inset:-40,background:"radial-gradient(ellipse at 83% 22%,rgba(79,110,247,0.19) 0%,transparent 63%),radial-gradient(ellipse at 15% 88%,rgba(132,115,245,0.10) 0%,transparent 54%),linear-gradient(145deg,#ffffff 0%,#f5f6f8 49%,#edf0ff 100%)",
        translate:interpolate(frame,[0,30*fps],["0px 0px","-60px 30px"],{extrapolateLeft:"clamp",extrapolateRight:"clamp"})}}/>
    <Sequence name="已审阅前24秒（Logo加载已修复）" durationInFrames={24*fps} premountFor={fps}>
      <TickListStageTwo/>
    </Sequence>
    <Interactive.Div name="待办短句退场" durationInFrames={24.25*fps} premountFor={fps}
      style={{position:"absolute",inset:0,opacity:interpolate(frame,[0,24*fps-1,24*fps,24.25*fps],[0,0,1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"})}}>
      <Freeze frame={24*fps-1}><TickListStageTwo/></Freeze>
    </Interactive.Div>
    <BackupScene name="本地保存与真实备份" from={24*fps} durationInFrames={6*fps} premountFor={fps}
      showBackground={false} style={{position:"absolute",inset:0}}/>
  </AbsoluteFill>;
};
export const StageThreeComposition=()=> <Composition id="TickListStageThree" component={TickListStageThree}
  width={1920} height={1080} fps={60} durationInFrames={1800}/>;
