import React from "react";
import {Composition, useVideoConfig, staticFile} from "remotion";
import {Audio} from "@remotion/media";
import {TickListStageFour} from "./StageFour";

type Props={readonly enableAudio:boolean};
export const TickListFinalFilm:React.FC<Props>=({enableAudio})=>{
  const {fps}=useVideoConfig();
  return <>
    <TickListStageFour/>
    {enableAudio?<Audio name="Approved music and natural UI sound effects"
      src={staticFile("audio/final-mix.wav")} durationInFrames={35*fps}
      premountFor={fps} volume={1}/>:null}
  </>;
};
export const FinalFilmComposition=()=> <Composition id="TickListFinalFilm"
  component={TickListFinalFilm} width={1920} height={1080} fps={60}
  durationInFrames={2100} defaultProps={{enableAudio:true}}/>;
