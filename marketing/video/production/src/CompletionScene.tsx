import React from "react";
import {AbsoluteFill,Composition,Easing,Interactive,interpolate,useCurrentFrame,useVideoConfig,type InteractivitySchema} from "remotion";
import {SharedGradient} from "./SharedGradient";
import theme from "./product-theme.json";
import "./product-source.css";

type ContentsProps={readonly text:string;readonly deadline:string;readonly done:boolean;readonly checkStyle?:React.CSSProperties;};
const TaskContents:React.FC<ContentsProps>=({text,deadline,done,checkStyle})=><>
  <button type="button" className="check" style={checkStyle} aria-pressed={done} aria-label={(done?"标记为未完成：":"标记为完成：")+text}>
    <svg viewBox="0 0 24 24"><polyline points="6 12 10 16 18 7"/></svg>
  </button>
  <div className="middle">
    <button type="button" className="text task-title">{text}</button>
    <button type="button" className="deadline">{"⏰ "+deadline}</button>
  </div>
  <button type="button" className="drag-handle" aria-label={"拖动排序："+text}>
    <svg viewBox="0 0 16 20"><circle cx="5" cy="4" r="1.5"/><circle cx="11" cy="4" r="1.5"/><circle cx="5" cy="10" r="1.5"/><circle cx="11" cy="10" r="1.5"/><circle cx="5" cy="16" r="1.5"/><circle cx="11" cy="16" r="1.5"/></svg>
  </button>
  <button type="button" className="del" aria-label={"删除："+text}>×</button>
</>;

type Props={readonly style?:React.CSSProperties;readonly showBackground:boolean;};
const CompletionInner:React.FC<Props>=({style,showBackground})=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const at=(seconds:number)=>Math.round(seconds*fps);
  const completed=frame>=at(2.85);
  const pending=frame>=at(4.45);
  // These are the same three tasks used by the approved opening.
  // Real toggle() moves the completed item below all incomplete items.
  const tasks=completed
    ?[{id:"time",text:"为重要的事留出时间",done:false},{id:"small",text:"完成一件小事",done:false},{id:"learn",text:"整理今天的学习笔记",done:true}]
    :[{id:"learn",text:"整理今天的学习笔记",done:false},{id:"time",text:"为重要的事留出时间",done:false},{id:"small",text:"完成一件小事",done:false}];
  const visible=tasks.filter(t=>!pending||!t.done);
  return <AbsoluteFill data-scene="completion" data-local-frame={frame} data-task-count={tasks.length}
    data-done-count={completed?1:0} data-filter={pending?"pending":"all"} data-task-order={tasks.map(t=>t.id).join(",")}
    data-visible-order={visible.map(t=>t.id).join(",")}
    style={{color:"#1a1d26",fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',...style}}>
    {showBackground?<SharedGradient/>:null}
    <Interactive.Div name="做完一件，清楚下一件。" from={0.25*fps} durationInFrames={1.75*fps} premountFor={fps}
      style={{position:"absolute",left:160,top:460,width:1600,height:160,display:"flex",alignItems:"center",justifyContent:"center",fontSize:108,fontWeight:600,lineHeight:1.3,whiteSpace:"nowrap",
        opacity:interpolate(frame,[0.25*fps,0.5*fps,1.7*fps,2*fps],[0,1,1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"}),
        translate:interpolate(frame,[0.25*fps,0.5*fps,1.7*fps,2*fps],["0px 8px","0px 0px","0px 0px","0px -8px"],{easing:Easing.bezier(0.22,1,0.36,1),extrapolateLeft:"clamp",extrapolateRight:"clamp"})}}>
      做完一件，清楚下一件。
    </Interactive.Div>
    <Interactive.Div name="完成与筛选的居中产品区域" from={2*fps} durationInFrames={3.5*fps} premountFor={fps}
      className="product-ui" data-stage="completion-product"
      style={{...theme,position:"absolute",left:288,width:560,scale:2.4,transformOrigin:"top left",
        top:interpolate(frame,[4.45*fps,4.7*fps],[111,211.8],{easing:Easing.bezier(0.25,0.1,0.25,1),extrapolateLeft:"clamp",extrapolateRight:"clamp"}),
        height:interpolate(frame,[4.45*fps,4.7*fps],[357.5,273.5],{easing:Easing.bezier(0.25,0.1,0.25,1),extrapolateLeft:"clamp",extrapolateRight:"clamp"}),
        opacity:interpolate(frame,[2*fps,2.25*fps,5.25*fps,5.5*fps],[0,1,1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"})} as React.CSSProperties}>
      <Interactive.Div name="输入与添加" premountFor={fps} className="input-wrap"
        style={{position:"absolute",left:0,top:0,width:560,height:48,margin:0}}>
        <input id="input" type="text" readOnly value="" placeholder="添加新的待办事项…" style={{fontFamily:"Arial",height:48}}/>
        <button id="addBtn" style={{fontFamily:"Arial"}}>添加</button>
      </Interactive.Div>
      <Interactive.Div name="完成后切换未完成" premountFor={fps} className="filters"
        style={{position:"absolute",left:0,top:64,margin:0}}>
        <button className={"filter"+(!pending?" active":"")} aria-pressed={!pending}>全部</button>
        <button className={"filter"+(pending?" active":"")} aria-pressed={pending} data-stage="pending-filter"
          style={{color:pending?"#fff":frame>=at(4.2)?"#4f6ef7":"#9aa1af",borderColor:pending||frame>=at(4.2)?"#4f6ef7":"#ebecef",
            scale:interpolate(frame,[4.35*fps,4.4*fps,4.45*fps],[1,0.97,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp"})}}>
          未完成
        </button>
        <button className="filter" aria-pressed={false}>已完成</button>
      </Interactive.Div>
      <ul id="list" style={{position:"absolute",left:0,top:115.5,width:560,height:242}}>
        {!pending?<Interactive.Li name="学习笔记：完成后移到末尾" premountFor={fps}
          data-id="learn" className={"item"+(completed?" done":"")}
          style={{position:"absolute",left:0,width:560,height:74,
            top:interpolate(frame,[2.85*fps,3.55*fps],[0,168],{easing:Easing.bezier(0.22,1,0.36,1),extrapolateLeft:"clamp",extrapolateRight:"clamp"}),
            zIndex:completed?2:1}}>
          <TaskContents text="整理今天的学习笔记" deadline="10月11日 18:00" done={completed}
            checkStyle={{scale:interpolate(frame,[2.75*fps,2.8*fps,2.85*fps],[1,0.97,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp"})}}/>
        </Interactive.Li>:null}
        <Interactive.Li name="原有下一件：为重要的事留出时间" premountFor={fps} data-id="time" className="item"
          style={{position:"absolute",left:0,width:560,height:74,
            top:interpolate(frame,[2.85*fps,3.55*fps],[84,0],{easing:Easing.bezier(0.22,1,0.36,1),extrapolateLeft:"clamp",extrapolateRight:"clamp"})}}>
          <TaskContents text="为重要的事留出时间" deadline="设置截止时间" done={false}/>
        </Interactive.Li>
        <Interactive.Li name="原有另一件：完成一件小事" premountFor={fps} data-id="small" className="item"
          style={{position:"absolute",left:0,width:560,height:74,
            top:interpolate(frame,[2.85*fps,3.55*fps],[168,84],{easing:Easing.bezier(0.22,1,0.36,1),extrapolateLeft:"clamp",extrapolateRight:"clamp"})}}>
          <TaskContents text="完成一件小事" deadline="设置截止时间" done={false}/>
        </Interactive.Li>
      </ul>
      <Interactive.Div name="鼠标勾选、等待和筛选" from={0.1*fps} durationInFrames={3.15*fps} premountFor={fps}
        data-stage="completion-pointer"
        style={{position:"absolute",
          left:interpolate(frame,[2.1*fps,2.6*fps,3.7*fps,4.2*fps],[300,26.6,26.6,104.6],{easing:Easing.bezier(0.22,1,0.36,1),extrapolateLeft:"clamp",extrapolateRight:"clamp"}),
          top:interpolate(frame,[2.1*fps,2.6*fps,2.85*fps,3.55*fps,3.7*fps,4.2*fps],[200,151.1,151.1,319.1,319.1,80.35],{easing:Easing.bezier(0.22,1,0.36,1),extrapolateLeft:"clamp",extrapolateRight:"clamp"}),
          width:21,height:27,pointerEvents:"none",zIndex:3,
          opacity:interpolate(frame,[2.1*fps,2.25*fps,4.45*fps,4.8*fps],[0,1,1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"}),
          scale:interpolate(frame,[2.75*fps,2.8*fps,2.85*fps,4.35*fps,4.4*fps,4.45*fps],[1,0.97,1,1,0.97,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp"}),transformOrigin:"0 0"}}>
        <svg width="21" height="27" viewBox="0 0 30 38"><path d="M2 2v28l7-7 6 13 5-2-6-13h11Z" fill="#1a1d26" stroke="#fff" strokeWidth="2" strokeLinejoin="round"/></svg>
      </Interactive.Div>
    </Interactive.Div>
    <Interactive.Div name="待办，一目了然。" from={5.5*fps} durationInFrames={2.5*fps} premountFor={fps}
      style={{position:"absolute",left:160,top:460,width:1600,height:160,display:"flex",alignItems:"center",justifyContent:"center",fontSize:108,fontWeight:600,lineHeight:1.3,whiteSpace:"nowrap",
        opacity:interpolate(frame,[5.5*fps,5.75*fps],[0,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp"}),
        translate:interpolate(frame,[5.5*fps,5.75*fps],["0px 8px","0px 0px"],{easing:Easing.bezier(0.22,1,0.36,1),extrapolateLeft:"clamp",extrapolateRight:"clamp"})}}>
      待办，一目了然。
    </Interactive.Div>
  </AbsoluteFill>;
};
export const CompletionScene=Interactive.withSchema({Component:CompletionInner,componentName:"<CompletionScene>",wrapInSequence:true,
  schema:{showBackground:{type:"boolean",default:true,description:"独立预览渐变背景"}} as const satisfies InteractivitySchema});
export const CompletionSceneComposition=()=> <Composition id="TickListCompletionScene" component={CompletionScene}
  width={1920} height={1080} fps={60} durationInFrames={480} defaultProps={{showBackground:true}}/>;
