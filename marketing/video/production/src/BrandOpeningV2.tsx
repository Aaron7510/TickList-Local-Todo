import React from "react";
import {
  AbsoluteFill,
  Composition,
  Easing,
  Img,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {brandLogoDataUri} from "./brand-logo-data";
import theme from "./product-theme.json";
import "./product-source.css";

const sentence = "整理今天的学习笔记";
const seedTasks = ["为重要的事留出时间", "完成一件小事"];

export const TickListBrandOpeningV2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (seconds: number) => Math.round(seconds * fps);
  // The same event boundaries drive text, focus, hover, and the task model.
  const events = {
    typingStart: at(4.35),
    typingEnd: at(5.35),
    mouseStart: at(5.45),
    mouseEnd: at(5.95),
    click: at(6.1),
    added: at(6.2),
    settled: at(6.45),
  };
  const isAdded = frame >= events.added;
  const tasks = isAdded ? [sentence, ...seedTasks] : seedTasks;
  // This isolated shot shows the newly prepended row; the other rows are outside the shot.
  const firstTask = isAdded ? tasks[0] : null;
  const typedLength = Math.floor(
    interpolate(
      frame,
      [events.typingStart, events.typingEnd],
      [0, sentence.length],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      },
    ),
  );
  const value = isAdded ? "" : sentence.slice(0, typedLength);
  const focused = frame < events.click || isAdded;
  const hover = frame >= events.mouseEnd && frame < events.added;
  const caretVisible = focused && Math.floor(frame / at(0.5)) % 2 === 0;

  return (
    <AbsoluteFill
      className="brand-opening-v2"
      data-frame={frame}
      data-task-count={tasks.length}
      style={{
        background: "#f5f6f8",
        fontFamily:
          '-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
        color: "#1a1d26",
        overflow: "hidden",
      }}
    >
      <Interactive.Div
        name="Shared gradient background"
        premountFor={fps}
        style={{
          position: "absolute",
          inset: -40,
          background:
            "radial-gradient(ellipse at 83% 22%,rgba(79,110,247,0.19) 0%,transparent 63%),radial-gradient(ellipse at 15% 88%,rgba(132,115,245,0.10) 0%,transparent 54%),linear-gradient(145deg,#ffffff 0%,#f5f6f8 49%,#edf0ff 100%)",
          translate: interpolate(
            frame,
            [0, 8 * fps],
            ["0px 0px", "-16px 8px"],
            {
              extrapolateRight: "clamp",
            },
          ),
        }}
      />
      <Interactive.Div
        name="Opening hook"
        durationInFrames={2 * fps}
        premountFor={fps}
        data-stage="hook"
        style={{
          position: "absolute",
          left: 200,
          top: 460,
          width: 1520,
          height: 160,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 112,
          fontWeight: 600,
          lineHeight: 1.3,
          letterSpacing: 1,
          whiteSpace: "nowrap",
          opacity: interpolate(
            frame,
            [0, 0.15 * fps, 1.75 * fps, 2 * fps],
            [0.85, 1, 1, 0.12],
            {
              extrapolateRight: "clamp",
            },
          ),
          translate: interpolate(
            frame,
            [0, 0.25 * fps],
            ["0px 8px", "0px 0px"],
            {
              easing: Easing.bezier(0.22, 1, 0.36, 1),
              extrapolateRight: "clamp",
            },
          ),
        }}
      >
        又怕漏掉一件事？
      </Interactive.Div>
      <Interactive.Div
        name="Centered logo and brand phrase"
        from={2 * fps}
        durationInFrames={2 * fps}
        premountFor={fps}
        data-stage="brand"
        style={{
          position: "absolute",
          left: 200,
          top: 395,
          width: 1520,
          height: 285,
          opacity: interpolate(
            frame,
            [2 * fps, 2.25 * fps, 3.75 * fps, 4 * fps],
            [0.45, 1, 1, 0.12],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          ),
          translate: interpolate(
            frame,
            [2 * fps, 2.25 * fps, 3.75 * fps, 4 * fps],
            ["0px 8px", "0px 0px", "0px 0px", "0px -8px"],
            {
              easing: Easing.bezier(0.22, 1, 0.36, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          ),
        }}
      >
        <Img
          name="Formal TickList logo"
          src={brandLogoDataUri}
          style={{
            position: "absolute",
            left: 580,
            top: 0,
            width: 360,
            height: 83,
            objectFit: "contain",
            translate: "-26px -5px"
          }}
        />
        <Interactive.Div
          name="Brand phrase"
          premountFor={fps}
          style={{
            position: "absolute",
            left: 0,
            top: 145,
            width: 1520,
            height: 140,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 108,
            fontWeight: 600,
            lineHeight: 1.3,
            letterSpacing: 1,
            whiteSpace: "nowrap",
            translate: "38px -22px"
          }}
        >
          想到，就记下。
        </Interactive.Div>
      </Interactive.Div>
      <Interactive.Div
        name="Centered product presentation"
        premountFor={fps}
        className="product-ui"
        data-stage="transparent-product"
        style={
          {
            ...theme,
            position: "absolute",
            left: 260,
            // Native height 48 -> 189.5 at 2.5x; the group center stays at y=540.
            top: interpolate(frame, [6.2 * fps, 6.45 * fps], [480, 303.125], {
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            width: 560,
            height: interpolate(frame, [6.2 * fps, 6.45 * fps], [48, 189.5], {
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            scale: 2.5,
            transformOrigin: "top left",
          } as React.CSSProperties
        }
      >
        <Interactive.Div
          name="Input row after brand phrase"
          from={4 * fps}
          durationInFrames={4 * fps}
          premountFor={fps}
          className="input-wrap"
          data-stage="input"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 560,
            height: 48,
            margin: 0,
            opacity: interpolate(frame, [4 * fps, 4.35 * fps], [0.18, 1], {
              easing: Easing.bezier(0.22, 1, 0.36, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <input
            id="input"
            type="text"
            readOnly
            value={value}
            placeholder="添加新的待办事项…"
            data-focused={focused}
            style={{
              fontFamily: "Arial",
              caretColor: "transparent",
              height: 48,
              borderColor: focused ? theme["--accent"] : theme["--border"],
              boxShadow: focused
                ? "0 0 0 3px " + theme["--accent-light"]
                : "none",
            }}
          />
          <span
            data-stage="caret"
            style={{
              position: "absolute",
              left: 17 + value.length * 15,
              top: 14,
              height: 20,
              width: 1,
              background: theme["--text"],
              opacity: caretVisible ? 1 : 0,
              pointerEvents: "none",
            }}
          />
          <button
            id="addBtn"
            style={{
              fontFamily: "Arial",
              opacity: hover ? 0.9 : 1,
              scale: interpolate(
                frame,
                [6.1 * fps, 6.15 * fps, 6.2 * fps],
                [1, 0.97, 1],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                },
              ),
            }}
          >
            添加
          </button>
        </Interactive.Div>
        <Interactive.Div
          name="Filters revealed after adding"
          from={6.2 * fps}
          durationInFrames={1.8 * fps}
          premountFor={fps}
          className="filters"
          data-stage="filters"
          style={{
            position: "absolute",
            left: 0,
            top: 64,
            margin: 0,
            opacity: interpolate(frame, [6.2 * fps, 6.35 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <button className="filter active" aria-pressed={true}>
            全部
          </button>
          <button className="filter" aria-pressed={false}>
            未完成
          </button>
          <button className="filter" aria-pressed={false}>
            已完成
          </button>
        </Interactive.Div>
        <Interactive.Ul
          name="New task revealed after adding"
          from={6.2 * fps}
          durationInFrames={1.8 * fps}
          premountFor={fps}
          id="list"
          data-stage="task"
          style={{
            position: "absolute",
            left: 0,
            top: 115.5,
            width: 560,
            height: 74,
            opacity: interpolate(frame, [6.2 * fps, 6.45 * fps], [0, 1], {
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {firstTask ? (
            <li className="item" style={{ width: 560, height: 74 }}>
              <button
                type="button"
                className="check"
                aria-pressed={false}
                aria-label={"标记为完成：" + firstTask}
              >
                <svg viewBox="0 0 24 24">
                  <polyline points="6 12 10 16 18 7" />
                </svg>
              </button>
              <div className="middle">
                <button type="button" className="text task-title">
                  {firstTask}
                </button>
                <button type="button" className="deadline">
                  ⏰ 设置截止时间
                </button>
              </div>
              <button
                type="button"
                className="drag-handle"
                aria-label={"拖动排序：" + firstTask}
              >
                <svg viewBox="0 0 16 20" aria-hidden="true">
                  <circle cx="5" cy="4" r="1.5" />
                  <circle cx="11" cy="4" r="1.5" />
                  <circle cx="5" cy="10" r="1.5" />
                  <circle cx="11" cy="10" r="1.5" />
                  <circle cx="5" cy="16" r="1.5" />
                  <circle cx="11" cy="16" r="1.5" />
                </svg>
              </button>
              <button
                type="button"
                className="del"
                aria-label={"删除：" + firstTask}
              >
                ×
              </button>
            </li>
          ) : null}
        </Interactive.Ul>
        <Interactive.Div
          name="Preserved mouse movement and click"
          from={4.35 * fps}
          durationInFrames={3.65 * fps}
          premountFor={fps}
          data-stage="pointer"
          style={{
            position: "absolute",
            left: interpolate(frame, [5.45 * fps, 5.95 * fps], [300, 519.6], {
              easing: Easing.inOut(Easing.cubic),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            top: interpolate(frame, [5.45 * fps, 5.95 * fps], [27, 22.6], {
              easing: Easing.inOut(Easing.cubic),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            width: 21,
            height: 27,
            opacity: interpolate(
              frame,
              [4.35 * fps, 4.5 * fps, 6.2 * fps, 6.5 * fps],
              [0, 1, 1, 0],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            ),
            scale: interpolate(
              frame,
              [6.1 * fps, 6.15 * fps, 6.2 * fps],
              [1, 0.97, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            ),
            transformOrigin: "0 0",
            pointerEvents: "none",
          }}
        >
          <svg width="21" height="27" viewBox="0 0 30 38">
            <path
              d="M2 2v28l7-7 6 13 5-2-6-13h11Z"
              fill="#1a1d26"
              stroke="#fff"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        </Interactive.Div>
      </Interactive.Div>
    </AbsoluteFill>
  );
};

export const BrandOpeningV2Composition = () => (
  <Composition
    id="TickListBrandOpeningV2"
    component={TickListBrandOpeningV2}
    durationInFrames={480}
    fps={60}
    width={1920}
    height={1080}
  />
);
