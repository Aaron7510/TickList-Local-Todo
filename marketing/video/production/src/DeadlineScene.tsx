import React from "react";
import {AbsoluteFill, Composition, Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig, type InteractivitySchema} from "remotion";
import theme from "./product-theme.json";
import {SharedGradient} from "./SharedGradient";
import "./product-source.css";

type Props = {readonly style?: React.CSSProperties; readonly deadlineValue: string; readonly deadlineLabel: string; readonly showBackground: boolean;};
const DeadlineInner: React.FC<Props> = ({style, deadlineValue, deadlineLabel, showBackground}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const at=(seconds:number)=>Math.round(seconds*fps);
  // Local time 0 = film time 10 s. Date input change saves automatically in the real app.
  const entered=frame>=at(3.55);
  const closed=frame>=at(4.5);
  const focus=frame>=at(2.75) && frame<at(4.4);
  return <AbsoluteFill data-scene="deadline" data-local-frame={frame} data-task-count={3}
    data-deadline={entered?deadlineValue:""} data-dialog-closed={closed}
    style={{color:"#1a1d26",fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',...style}}>
    {showBackground ? <SharedGradient/> : null}
    <Interactive.Div name="给重要的事，一个截止时间。" durationInFrames={2*fps} premountFor={fps}
      style={{position:"absolute",left:160,top:460,width:1600,height:160,display:"flex",alignItems:"center",justifyContent:"center",
        fontSize:96,fontWeight:600,lineHeight:1.3,whiteSpace:"nowrap",
        opacity:interpolate(frame,[0,0.25*fps,1.7*fps,2*fps],[0,1,1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"}),
        translate:interpolate(frame,[0,0.25*fps,1.7*fps,2*fps],["0px 8px","0px 0px","0px 0px","0px -8px"],{easing:Easing.bezier(0.22,1,0.36,1),extrapolateLeft:"clamp",extrapolateRight:"clamp"})}}>
      给重要的事，一个截止时间。
    </Interactive.Div>
    <Interactive.Div name="Deadline product region" from={2*fps} durationInFrames={4*fps} premountFor={fps}
      className="product-ui" data-stage="deadline-product"
      style={{...theme,position:"absolute",left:260,top:303.125,width:560,height:189.5,scale:2.5,transformOrigin:"top left",
        opacity:interpolate(frame,[2*fps,2.25*fps],[0,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp"})} as React.CSSProperties}>
      <div className="input-wrap" style={{position:"absolute",left:0,top:0,width:560,height:48,margin:0}}>
        <input id="input" type="text" readOnly value="" placeholder="添加新的待办事项…"
          style={{fontFamily:"Arial",height:48}} />
        <button id="addBtn" style={{fontFamily:"Arial"}}>添加</button>
      </div>
      <div className="filters" style={{position:"absolute",left:0,top:64,margin:0}}>
        <button className="filter active" aria-pressed={true}>全部</button>
        <button className="filter" aria-pressed={false}>未完成</button>
        <button className="filter" aria-pressed={false}>已完成</button>
      </div>
      <ul id="list" style={{position:"absolute",left:0,top:115.5,width:560,height:74}}>
        <li className="item" style={{width:560,height:74}}>
          <button type="button" className="check" aria-pressed={false} aria-label="标记为完成：整理今天的学习笔记">
            <svg viewBox="0 0 24 24"><polyline points="6 12 10 16 18 7"/></svg>
          </button>
          <div className="middle">
            <button className="text task-title">整理今天的学习笔记</button>
            <button className="deadline" data-stage="deadline-trigger"
              style={{color:frame>=at(2.5)&&frame<at(2.75)?theme["--accent"]:theme["--text-muted"],
                scale:interpolate(frame,[2.65*fps,2.7*fps,2.75*fps],[1,0.97,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp"}),
                outline:closed?"2px solid #4f6ef7":"none",outlineOffset:3,borderRadius:3}}>
              {entered?"⏰ "+deadlineLabel:"⏰ 设置截止时间"}
            </button>
          </div>
          <button type="button" className="drag-handle" aria-label="拖动排序：整理今天的学习笔记">
            <svg viewBox="0 0 16 20"><circle cx="5" cy="4" r="1.5"/><circle cx="11" cy="4" r="1.5"/><circle cx="5" cy="10" r="1.5"/><circle cx="11" cy="10" r="1.5"/><circle cx="5" cy="16" r="1.5"/><circle cx="11" cy="16" r="1.5"/></svg>
          </button>
          <button type="button" className="del" aria-label="删除：整理今天的学习笔记">×</button>
        </li>
      </ul>
    </Interactive.Div>
    <Interactive.Div name="Mouse to deadline label" from={2*fps} durationInFrames={0.9*fps} premountFor={fps}
      data-stage="deadline-open-pointer"
      style={{position:"absolute",
        left:interpolate(frame,[2*fps,2.5*fps],[1010,507],{easing:Easing.inOut(Easing.cubic),extrapolateLeft:"clamp",extrapolateRight:"clamp"}),
        top:interpolate(frame,[2*fps,2.5*fps],[700,724.375],{easing:Easing.inOut(Easing.cubic),extrapolateLeft:"clamp",extrapolateRight:"clamp"}),
        width:52.5,height:67.5,pointerEvents:"none",
        opacity:interpolate(frame,[2*fps,2.15*fps,2.75*fps,2.9*fps],[0,1,1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"}),
        scale:interpolate(frame,[2.65*fps,2.7*fps,2.75*fps],[1,0.97,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp"}),transformOrigin:"0 0"}}>
      <svg width="52.5" height="67.5" viewBox="0 0 30 38"><path d="M2 2v28l7-7 6 13 5-2-6-13h11Z" fill="#1a1d26" stroke="#fff" strokeWidth="2" strokeLinejoin="round"/></svg>
    </Interactive.Div>
    <Interactive.Div name="Native dialog backdrop" from={2.75*fps} durationInFrames={1.75*fps} premountFor={fps}
      style={{position:"absolute",inset:0,background:"rgba(12,16,28,.4)",
        opacity:interpolate(frame,[2.75*fps,2.95*fps,4.4*fps,4.5*fps],[0,1,1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"})}} />
    <Interactive.Div name="真实截止时间弹窗" from={2.75*fps} durationInFrames={1.75*fps} premountFor={fps}
      className="product-ui" data-stage="deadline-modal-layer"
      style={{...theme,position:"absolute",left:460,top:243.515625,width:400,height:237.1953125,scale:2.5,transformOrigin:"top left",
        opacity:interpolate(frame,[2.75*fps,2.95*fps,4.4*fps,4.5*fps],[0,1,1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"}),
        translate:interpolate(frame,[2.75*fps,2.95*fps],["0px 8px","0px 0px"],{easing:Easing.bezier(0.22,1,0.36,1),extrapolateLeft:"clamp",extrapolateRight:"clamp"})} as React.CSSProperties}>
      <dialog open id="deadlineDialog" className="settings-dialog deadline-dialog" aria-labelledby="deadlineTitle"
        style={{position:"relative",width:400,maxHeight:"none",margin:0,overflow:"visible"}}>
        <div className="settings-heading">
          <h2 id="deadlineTitle">设置截止时间</h2>
          <button id="deadlineClose" className="settings-close" type="button" aria-label="关闭截止时间设置"
            style={{color:frame>=at(4.25)?theme["--text"]:theme["--text-muted"],
              background:frame>=at(4.25)?theme["--bg"]:"transparent",
              scale:interpolate(frame,[4.4*fps,4.45*fps,4.5*fps],[1,0.97,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp"})}}>
            <svg viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg>
          </button>
        </div>
        <p id="deadlineTask" className="deadline-task">整理今天的学习笔记</p>
        <label className="deadline-label" htmlFor="deadlineInput">截止时间</label>
        <div className="detail-deadline">
          <input id="deadlineInput" className="time-input" type="datetime-local" value={entered?deadlineValue:""} onChange={() => undefined} data-focused={focus}
            style={{borderColor:focus?theme["--accent"]:theme["--border"]}}/>
          <button id="deadlineClear" className="detail-clear" type="button" disabled={!entered}>清除</button>
        </div>
        <p className="settings-description deadline-hint">更改后自动保存。</p>
      </dialog>
    </Interactive.Div>
    <Interactive.Div name="Mouse to dialog close" from={3.75*fps} durationInFrames={1.1*fps} premountFor={fps}
      data-stage="deadline-close-pointer"
      style={{position:"absolute",
        left:interpolate(frame,[3.75*fps,4.25*fps],[1090,1353.75],{easing:Easing.inOut(Easing.cubic),extrapolateLeft:"clamp",extrapolateRight:"clamp"}),
        top:interpolate(frame,[3.75*fps,4.25*fps],[650,348.515625],{easing:Easing.inOut(Easing.cubic),extrapolateLeft:"clamp",extrapolateRight:"clamp"}),
        width:52.5,height:67.5,pointerEvents:"none",
        opacity:interpolate(frame,[3.75*fps,3.9*fps,4.5*fps,4.85*fps],[0,1,1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"}),
        scale:interpolate(frame,[4.4*fps,4.45*fps,4.5*fps],[1,0.97,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp"}),transformOrigin:"0 0"}}>
      <svg width="52.5" height="67.5" viewBox="0 0 30 38"><path d="M2 2v28l7-7 6 13 5-2-6-13h11Z" fill="#1a1d26" stroke="#fff" strokeWidth="2" strokeLinejoin="round"/></svg>
    </Interactive.Div>
  </AbsoluteFill>;
};
export const DeadlineScene=Interactive.withSchema({
  Component:DeadlineInner,componentName:"<DeadlineScene>",wrapInSequence:true,
  schema:{
    showBackground:{type:"boolean",default:true,description:"独立预览渐变背景"},
    deadlineValue:{type:"text-content",default:"2026-10-11T18:00",description:"固定演示截止日期"},
    deadlineLabel:{type:"text-content",default:"10月11日 18:00",description:"任务上的截止时间"},
  } as const satisfies InteractivitySchema,
});
export const DeadlineSceneComposition=()=> <Composition id="TickListDeadlineScene"
  component={DeadlineScene} width={1920} height={1080} fps={60} durationInFrames={360}
  defaultProps={{showBackground:true,deadlineValue:"2026-10-11T18:00",deadlineLabel:"10月11日 18:00"}}/>;
