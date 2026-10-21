import React from "react";
import {AbsoluteFill,Composition,Easing,Freeze,Interactive,interpolate,useCurrentFrame,useVideoConfig,type InteractivitySchema} from "remotion";
import {CompletionScene} from "./CompletionScene";
import theme from "./product-theme.json";
import "./product-source.css";

type Props={readonly style?:React.CSSProperties;readonly showBackground:boolean;};
const BackupInner:React.FC<Props>=({style,showBackground})=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const at=(seconds:number)=>Math.round(seconds*fps);
  const opened=frame>=at(2.85);
  const requested=frame>=at(3.8);
  return <AbsoluteFill data-scene="backup" data-local-frame={frame} data-task-count={3} data-done-count={1}
    data-settings-open={opened} data-backup-requested={requested} data-export-count={requested?3:0}
    style={{color:"#1a1d26",fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',...style}}>
    {showBackground?<Interactive.Div name="延续同一渐变" premountFor={fps}
      style={{position:"absolute",inset:-40,background:"radial-gradient(ellipse at 83% 22%,rgba(79,110,247,0.19) 0%,transparent 63%),radial-gradient(ellipse at 15% 88%,rgba(132,115,245,0.10) 0%,transparent 54%),linear-gradient(145deg,#ffffff 0%,#f5f6f8 49%,#edf0ff 100%)",
        translate:interpolate(frame,[0,6*fps],["-48px 24px","-60px 30px"],{extrapolateLeft:"clamp",extrapolateRight:"clamp"})}}/>:null}
    <Interactive.Div name="保存在当前浏览器，记得备份。" from={0.25*fps} durationInFrames={1.75*fps} premountFor={fps}
      style={{position:"absolute",left:160,top:380,width:1600,height:320,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,fontSize:96,fontWeight:600,lineHeight:1.3,whiteSpace:"nowrap",
        opacity:interpolate(frame,[0.25*fps,0.5*fps,1.7*fps,2*fps],[0,1,1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"}),
        translate:interpolate(frame,[0.25*fps,0.5*fps,1.7*fps,2*fps],["0px 8px","0px 0px","0px 0px","0px -8px"],{easing:Easing.bezier(0.22,1,0.36,1),extrapolateLeft:"clamp",extrapolateRight:"clamp"})}}>
      <Interactive.Div name="保存位置" premountFor={fps}>保存在当前浏览器</Interactive.Div>
      <Interactive.Div name="备份提醒" premountFor={fps}>记得备份。</Interactive.Div>
    </Interactive.Div>
    {/* Freeze the same two pending rows in a zero-offset layer, preserving nested sequence durations. */}
    <Interactive.Div name="沿用两条未完成事项" premountFor={fps} data-stage="backup-product"
      style={{position:"absolute",inset:0,opacity:interpolate(frame,[2*fps,2.25*fps,4.5*fps,4.75*fps],[0,1,1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"})}}>
      <Freeze frame={5*fps}><CompletionScene showBackground={false}/></Freeze>
    </Interactive.Div>
    <Interactive.Div name="真实设置入口" from={2*fps} durationInFrames={2.75*fps} premountFor={fps}
      className="product-ui" data-stage="backup-settings-trigger"
      style={{...theme,position:"absolute",left:1530,top:100,width:38,height:38,scale:2.4,transformOrigin:"top left",
        opacity:interpolate(frame,[2*fps,2.25*fps,4.5*fps,4.75*fps],[0,1,1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"})} as React.CSSProperties}>
      <button className="settings-btn" type="button" aria-label="设置" aria-expanded={opened} aria-haspopup="dialog"
        style={{color:frame>=at(2.6)?theme["--accent"]:theme["--text-muted"],
          scale:interpolate(frame,[2.75*fps,2.8*fps,2.85*fps],[1,0.97,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp"})}}>
        <svg viewBox="0 0 24 24"><path d="m9.5 3-.6 2.3-2 .9-2.1-.7-2.5 4.3L4 11.4v2.2l-1.7 1.6 2.5 4.3 2.1-.7 2 .9.6 2.3h5l.6-2.3 2-.9 2.1.7 2.5-4.3-1.7-1.6v-2.2l1.7-1.6-2.5-4.3-2.1.7-2-.9L14.5 3z"/><circle cx="12" cy="12" r="3"/></svg>
      </button>
    </Interactive.Div>
    <Interactive.Div name="设置原生遮罩" from={2.85*fps} durationInFrames={1.9*fps} premountFor={fps}
      style={{position:"absolute",inset:0,background:"rgba(12,16,28,.4)",
        opacity:interpolate(frame,[2.85*fps,3.05*fps,4.5*fps,4.75*fps],[0,1,1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"})}}/>
    <Interactive.Div name="真实设置窗口与备份操作" from={2.85*fps} durationInFrames={1.9*fps} premountFor={fps}
      className="product-ui" data-stage="backup-modal" style={{...theme,position:"absolute",left:564,top:104.1328125,width:440,height:484.296875,scale:1.8,transformOrigin:"top left",
        opacity:interpolate(frame,[2.85*fps,3.05*fps,4.5*fps,4.75*fps],[0,1,1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"}),
        translate:interpolate(frame,[2.85*fps,3.05*fps],["0px 8px","0px 0px"],{easing:Easing.bezier(0.22,1,0.36,1),extrapolateLeft:"clamp",extrapolateRight:"clamp"})} as React.CSSProperties}>
      <dialog open className="settings-dialog" aria-labelledby="videoSettingsTitle" aria-describedby="videoSettingsDescription"
        style={{position:"relative",width:440,maxHeight:"none",margin:0,overflow:"visible"}}>
        <div className="settings-heading">
          <h2 id="videoSettingsTitle">设置</h2>
          <button className="settings-close" type="button" aria-label="关闭设置"
            style={{outline:requested?"none":"3px solid #4f6ef7",outlineOffset:2}}>
            <svg viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg>
          </button>
        </div>
        <p id="videoSettingsDescription" className="settings-description">数据保存在当前浏览器，建议定期备份。</p>
        <section className="settings-group" aria-labelledby="videoSettingsDataTitle">
          <h3 id="videoSettingsDataTitle">数据</h3>
          <div className="settings-actions">
            <button type="button" className="settings-action" data-stage="backup-action"
              style={{borderColor:frame>=at(3.55)?theme["--accent"]:theme["--border"],background:frame>=at(3.55)?theme["--accent-light"]:theme["--card"],
                scale:interpolate(frame,[3.7*fps,3.75*fps,3.8*fps],[1,0.97,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp"})}}>
              <svg viewBox="0 0 24 24"><path d="M12 3v12m-4-4 4 4 4-4M4 16v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4"/></svg>
              <span><strong>备份数据</strong><small>保存完整清单，方便日后恢复</small></span>
            </button>
            <button type="button" className="settings-action">
              <svg viewBox="0 0 24 24"><path d="M12 15V3m-4 4 4-4 4 4M4 16v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4"/></svg>
              <span><strong>恢复数据</strong><small>从备份文件恢复清单</small></span>
            </button>
          </div>
        </section>
        <section className="settings-group" aria-labelledby="videoSettingsExportTitle">
          <h3 id="videoSettingsExportTitle">导出</h3>
          <div className="settings-actions">
            <button type="button" className="settings-action">
              <svg viewBox="0 0 24 24"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6M8 13h8M8 17h5"/></svg>
              <span><strong>导出 Markdown</strong><small>将清单保存为可阅读的文档</small></span>
            </button>
          </div>
        </section>
        <p className="settings-credit">TickList · Developed by Soren</p>
      </dialog>
    </Interactive.Div>
    <Interactive.Div name="鼠标打开设置并备份" from={2.1*fps} durationInFrames={2.15*fps} premountFor={fps} data-stage="backup-pointer"
      style={{position:"absolute",width:52.5,height:67.5,pointerEvents:"none",zIndex:3,
        left:interpolate(frame,[2.1*fps,2.6*fps,3.05*fps,3.55*fps],[1240,1572.1,1572.1,956.5],{easing:Easing.bezier(0.22,1,0.36,1),extrapolateLeft:"clamp",extrapolateRight:"clamp"}),
        top:interpolate(frame,[2.1*fps,2.6*fps,3.05*fps,3.55*fps],[430,142.1,142.1,407.6171875],{easing:Easing.bezier(0.22,1,0.36,1),extrapolateLeft:"clamp",extrapolateRight:"clamp"}),
        opacity:interpolate(frame,[2.1*fps,2.25*fps,3.8*fps,4.25*fps],[0,1,1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"}),
        scale:interpolate(frame,[2.75*fps,2.8*fps,2.85*fps,3.7*fps,3.75*fps,3.8*fps],[1,0.97,1,1,0.97,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp"}),transformOrigin:"0 0"}}>
      <svg width="52.5" height="67.5" viewBox="0 0 30 38"><path d="M2 2v28l7-7 6 13 5-2-6-13h11Z" fill="#1a1d26" stroke="#fff" strokeWidth="2" strokeLinejoin="round"/></svg>
    </Interactive.Div>
    <Interactive.Div name="完整清单，存成 JSON。" from={4.75*fps} durationInFrames={1.25*fps} premountFor={fps}
      style={{position:"absolute",left:160,top:380,width:1600,height:320,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:32,
        opacity:interpolate(frame,[4.75*fps,5*fps],[0,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp"}),
        translate:interpolate(frame,[4.75*fps,5*fps],["0px 8px","0px 0px"],{easing:Easing.bezier(0.22,1,0.36,1),extrapolateLeft:"clamp",extrapolateRight:"clamp"})}}>
      <Interactive.Div name="备份结果说明" premountFor={fps} style={{fontSize:96,fontWeight:600,lineHeight:1.3,whiteSpace:"nowrap"}}>完整清单，存成 JSON。</Interactive.Div>
      <Interactive.Div name="验证过的备份文件名" premountFor={fps} style={{fontSize:38,color:"#697184",lineHeight:1.4,whiteSpace:"nowrap"}}>TickList-备份-2026-10-10.json</Interactive.Div>
    </Interactive.Div>
  </AbsoluteFill>;
};
export const BackupScene=Interactive.withSchema({Component:BackupInner,componentName:"<BackupScene>",wrapInSequence:true,
  schema:{showBackground:{type:"boolean",default:true,description:"独立预览背景"}} as const satisfies InteractivitySchema});
export const BackupSceneComposition=()=> <Composition id="TickListBackupScene" component={BackupScene}
  width={1920} height={1080} fps={60} durationInFrames={360} defaultProps={{showBackground:true}}/>;
