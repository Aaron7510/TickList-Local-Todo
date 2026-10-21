import React from "react";
import {AbsoluteFill,Composition,Easing,Freeze,Interactive,Sequence,interpolate,useCurrentFrame,useVideoConfig} from "remotion";
import {TickListBrandOpeningV2} from "./BrandOpeningV2";
import {DeadlineScene} from "./DeadlineScene";
import {SharedGradient} from "./SharedGradient";

export const TickListStageOne:React.FC=()=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  return <AbsoluteFill data-stage-preview="0-16-seconds"
    style={{overflow:"hidden",background:"#f5f6f8",color:"#1a1d26",fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif'}}>
    <SharedGradient/>
    <Sequence name="已确认开头（含用户调整位置）" durationInFrames={8*fps} premountFor={fps}>
      <TickListBrandOpeningV2/>
    </Sequence>
    <Interactive.Div name="新增任务结果退场" from={8*fps} durationInFrames={0.25*fps} premountFor={fps}
      style={{position:"absolute",inset:0,
        opacity:interpolate(frame,[8*fps,8.25*fps],[1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"})}}>
      <Freeze frame={8*fps-1}><TickListBrandOpeningV2/></Freeze>
    </Interactive.Div>
    <Interactive.Div name="一行记录，无需注册。" from={8.25*fps} durationInFrames={1.75*fps} premountFor={fps}
      style={{position:"absolute",left:160,top:460,width:1600,height:160,display:"flex",alignItems:"center",justifyContent:"center",
        fontSize:108,fontWeight:600,lineHeight:1.3,whiteSpace:"nowrap",
        opacity:interpolate(frame,[8.25*fps,8.5*fps,9.7*fps,10*fps],[0,1,1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"}),
        translate:interpolate(frame,[8.25*fps,8.5*fps,9.7*fps,10*fps],["0px 8px","0px 0px","0px 0px","0px -8px"],{easing:Easing.bezier(0.22,1,0.36,1),extrapolateLeft:"clamp",extrapolateRight:"clamp"})}}>
      一行记录，无需注册。
    </Interactive.Div>
    <DeadlineScene name="截止时间演示" from={10*fps} durationInFrames={6*fps} premountFor={fps}
      showBackground={false} deadlineValue="2026-10-11T18:00" deadlineLabel="10月11日 18:00" style={{position:"absolute",inset:0}}/>
  </AbsoluteFill>;
};
export const StageOneComposition=()=> <Composition id="TickListStageOne" component={TickListStageOne}
  width={1920} height={1080} fps={60} durationInFrames={960}/>;
