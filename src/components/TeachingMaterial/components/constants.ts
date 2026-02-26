import RhythmTraining from "./RhythmTraining.vue";
import InteractiveComposition from "./InteractiveComposition.vue";
import FreeComposition from "./FreeComposition.vue";
import AiLyrics from "./AiLyrics.vue";
import AiComposition from "./AiComposition.vue";
import MusicScore from "./MusicScore.vue";
import SpectrumRecognition from "./SpectrumRecognition.vue";
import Pitch from "./Pitch.vue";
import CustomRhythm from "./CustomRhythm.vue";
import CustomCompilationAndCreation from "./CustomCompilationAndCreation.vue";
import CustomSpectrumRecognition from "./CustomSpectrumRecognition.vue";

export type Option = {
  label: string;
  id?: number | string;
  children?: Array<Option>;
};

export const MusicalInstrumentTypeSelectOptiopns: Array<Option> = [
  {
    label: "中国乐器",
    children: [
      {
        label: "吹奏乐器",
      },
      {
        label: "拉弦乐器",
      },
      {
        label: "弹拨乐器",
      },
      {
        label: "打击乐器",
      },
    ],
  },
  {
    label: "西洋乐器",
    children: [
      {
        label: "拉弦乐器",
      },
      {
        label: "弹拨乐器",
      },
      {
        label: "铜管乐器",
      },
      {
        label: "木管乐器",
      },
      {
        label: "打击乐器",
      },
      {
        label: "键盘乐器",
      },
    ],
  },
  {
    label: "世界民族乐器",
    children: [
      {
        label: "弹拨乐器",
      },
      {
        label: "吹奏乐器",
      },
      {
        label: "打击乐器",
      },
    ],
  },
];

/**
 * 互动模板
 */
export const interactionTemplate = [
  {
    label: "节奏训练",
    id: 1,
    component: RhythmTraining,
  },
  {
    label: "音高训练",
    id: 2,
    component: Pitch,
  },
  {
    label: "趣味识谱",
    id: 3,
    component: SpectrumRecognition,
  },
  {
    label: "互动编创",
    id: 4,
    component: InteractiveComposition,
  },
  {
    label: "自由编创",
    id: 5,
    component: FreeComposition,
  },
  {
    label: "AI作词",
    id: 6,
    component: AiLyrics,
  },
  {
    label: "诗歌作曲",
    id: 7,
    component: AiComposition,
  },
  // {
  //   label: "曲谱",
  //   id: 8,
  //   component: MusicScore,
  // },
];

/**
 * 我的互动
 */
export const myInteraction = [
  {
    label: "节奏训练",
    id: 1,
    component: CustomRhythm,

  },
  {
    label: "趣味识谱",
    id: 4,
    component: CustomSpectrumRecognition,
  },
  {
    label: "互动编创",
    id: 5,
    component: CustomCompilationAndCreation,
  },
]