import {FinalFilmComposition} from "./FinalFilm";
import {StageFourComposition} from "./StageFour";
import {BrandOpeningV2Composition} from "./BrandOpeningV2";
import {DeadlineSceneComposition} from "./DeadlineScene";
import {CompletionSceneComposition} from "./CompletionScene";
import {BackupSceneComposition} from "./BackupScene";
import {EndCardSceneComposition} from "./EndCardScene";

export const RemotionRoot: React.FC = () => (
  <>
    <FinalFilmComposition />
    <StageFourComposition />
    <BrandOpeningV2Composition />
    <DeadlineSceneComposition />
    <CompletionSceneComposition />
    <BackupSceneComposition />
    <EndCardSceneComposition />
  </>
);
