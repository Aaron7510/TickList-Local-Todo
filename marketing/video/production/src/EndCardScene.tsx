import React from "react";
import {AbsoluteFill, Composition, Easing, Img, Interactive, interpolate, useCurrentFrame, useVideoConfig, type InteractivitySchema} from "remotion";
import {brandLogoDataUri} from "./brand-logo-data";

type Props = {readonly style?: React.CSSProperties; readonly showBackground: boolean};
const EndCardInner: React.FC<Props> = ({style, showBackground}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill data-scene="brand-endcard" data-local-frame={frame}
      style={{overflow:"hidden", color:"#1a1d26", fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif', ...style}}>
      {showBackground ? <Interactive.Div name="片尾同一渐变背景" premountFor={fps}
        style={{position:"absolute", inset:-80, background:"radial-gradient(ellipse at 83% 22%,rgba(79,110,247,0.19) 0%,transparent 63%),radial-gradient(ellipse at 15% 88%,rgba(132,115,245,0.10) 0%,transparent 54%),linear-gradient(145deg,#ffffff 0%,#f5f6f8 49%,#edf0ff 100%)",
          translate:interpolate(frame,[0,5*fps],["-60px 30px","-70px 35px"],{extrapolateLeft:"clamp",extrapolateRight:"clamp"})}}/> : null}
      <Interactive.Div name="片尾完整品牌组" premountFor={fps}
        style={{position:"absolute", left:160, top:350, width:1600, height:400}}>
        <Interactive.Div
          name="正式 Logo 入场"
          from={0.25*fps}
          durationInFrames={4.75*fps}
          premountFor={fps}
          data-endcard-layer="logo"
          style={{
            position: "absolute",
            left: 566,
            top: 12,
            width: 440,
            height: 101,
            opacity: interpolate(frame, [0.25 * fps, 0.6 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp"
            }),
            translate: interpolate(frame, [0.25 * fps, 0.6 * fps], ["0px 8px", "0px 0px"], {
              easing: Easing.bezier(0.22, 1, 0.36, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp"
            })
          }}
        >
          <Img name="片尾正式 TickList Logo" src={brandLogoDataUri} style={{width:440,height:101,objectFit:"contain"}}/>
        </Interactive.Div>
        <Interactive.Div
          name="把今天，一件件做好。"
          from={0.75*fps}
          durationInFrames={4.25*fps}
          premountFor={fps}
          data-endcard-layer="slogan"
          style={{
            position: "absolute",
            left: 36,
            top: 145,
            width: 1600,
            height: 140,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 96,
            fontWeight: 600,
            lineHeight: 1.3,
            letterSpacing: 1,
            whiteSpace: "nowrap",
            opacity: interpolate(frame, [0.75 * fps, 1.1 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp"
            }),
            translate: interpolate(frame, [0.75 * fps, 1.1 * fps], ["0px 8px", "0px 0px"], {
              easing: Easing.bezier(0.22, 1, 0.36, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp"
            })
          }}
        >
          把今天，一件件做好。
        </Interactive.Div>
        <Interactive.Div
          name="Developed by Soren"
          from={1.25*fps}
          durationInFrames={3.75*fps}
          premountFor={fps}
          data-endcard-layer="credit"
          style={{
            position: "absolute",
            left: 1,
            top: 333,
            width: 1600,
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 40,
            fontWeight: 400,
            lineHeight: 1.3,
            color: "#747c8b",
            whiteSpace: "nowrap",
            opacity: interpolate(frame, [1.25 * fps, 1.6 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp"
            }),
            translate: interpolate(frame, [1.25 * fps, 1.6 * fps], ["0px 8px", "0px 0px"], {
              easing: Easing.bezier(0.22, 1, 0.36, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp"
            })
          }}
        >
          Developed by Soren
        </Interactive.Div>
      </Interactive.Div>
    </AbsoluteFill>
  );
};
const schema = {showBackground:{type:"boolean",default:true,description:"显示与正片一致的渐变背景"}} as const satisfies InteractivitySchema;
export const EndCardScene = Interactive.withSchema({Component:EndCardInner,componentName:"<EndCardScene>",schema,wrapInSequence:true});
export const EndCardSceneComposition = () => <Composition id="TickListEndCardScene" component={EndCardScene}
  width={1920} height={1080} fps={60} durationInFrames={300} defaultProps={{showBackground:true}}/>;
