<template>
  <template v-if="slides.length">
    <Screen v-if="screening" />
    <Editor v-else-if="_isPC" />
    <Mobile v-else />
  </template>
  <FullscreenSpin tip="数据初始化中，请稍等 ..." v-else loading :mask="false" />
  <iframe
    ref="customIfr"
    :class="['custom-ifr', { open: !!globalStore.customPageUrl }]"
    :src="globalStore.customPageUrl"
    frameborder="0"
  ></iframe>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref, unref, watch } from "vue";
import { storeToRefs } from "pinia";
import {
  useScreenStore,
  useMainStore,
  useSnapshotStore,
  useSlidesStore,
  useGlobalStore,
} from "@/store";
import { LOCALSTORAGE_KEY_DISCARDED_DB } from "@/configs/storage";
import { deleteDiscardedDB } from "@/utils/database";
import { isPC } from "@/utils/common";
import type { Slide } from "@/types/slides";
import message from "./utils/message";
import api from "@/services";
// import api from "@/api";

import Editor from "./views/Editor/index.vue";
import Screen from "./views/Screen/index.vue";
import Mobile from "./views/Mobile/index.vue";
import FullscreenSpin from "@/components/FullscreenSpin.vue";
import useQuery from "@/hooks/useQuery";
import { apiCommon, apiCourse } from "@/api/apiServer";
import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";
import { defaultCover } from "./constants/defaultCover";
import useUploadFirstPpt from "./hooks/useUploadFirstPpt";
import { base64ToFile } from "./utils/helper";
import useDeleteElement from "./hooks/useDeleteElement";
import useSlideHandler from "./hooks/useSlideHandler";
import useExport from "./hooks/useExport";
import useImport from "@/hooks/useImport";
import useCreateElement from "./hooks/useCreateElement";
import { cloneDeep } from "lodash";
const _isPC = isPC();

const mainStore = useMainStore();
const slidesStore = useSlidesStore();
const snapshotStore = useSnapshotStore();
const { databaseId } = storeToRefs(mainStore);
const { slides, slideIndex } = storeToRefs(slidesStore);
const { screening } = storeToRefs(useScreenStore());
const { deleteAllElements } = useDeleteElement();
const courseId = useQuery<string>("id");
const { getFirstPPT } = useUploadFirstPpt();
const { importPPTXFile, exporting: importExporting } = useImport();
const { exportPPTX, exporting: exporting2 } = useExport();
const screenStore = useScreenStore();
const globalStore = useGlobalStore();
const { createSlide } = useSlideHandler();
const { createFrameElement } = useCreateElement();
const customIfr = ref();

if (import.meta.env.MODE !== "development") {
  window.onbeforeunload = () => false;
}

onMounted(async () => {
  // if (location.hostname === "localhost") {
  //   message.error(
  //     "本地开发请访问 http://127.0.0.1:5173，否则不保证数据可靠性",
  //     { duration: 0, closable: true }
  //   );
  //   api.getMockData("slides").then((slides: Slide[]) => {
  //     slidesStore.setSlides(slides);
  //   });
  // } else {
  //   api.getFileData("slides").then((slides: Slide[]) => {
  //     slidesStore.setSlides(slides);
  //   });
  // }

  await deleteDiscardedDB();
  snapshotStore.initSnapshotDatabase();
});

// -- 兼容节奏测评页面切换
watch(slideIndex, () => {
  if (screening.value) {
    const matchingIframes = document.querySelectorAll(
      'iframe[src*="integration"]'
    );
    matchingIframes.forEach((ifr: unknown) => {
      (ifr as HTMLIFrameElement).contentWindow?.postMessage(
        {
          type: "PPTSlideIndexChange",
        },
        "*"
      );
    });
  }
});

const replaceDomain = (url: string, newDomain: string) => {
  const parsedUrl = new URL(url);
  return url.replace(parsedUrl.origin, newDomain);
};

const getCourseDetails = async (
  tk: string,
  id?: string,
  call?: (data: Slide[]) => void
) => {
  try {
    const uriResponse = await apiCourse.details(id || courseId);

    if (uriResponse && uriResponse.code === 200 && uriResponse.data) {
      // const url = import.meta.env.DEV
      //   ? uriResponse.data?.replace(
      //       "https://xingzhe-web-test.s3.cn-northwest-1.amazonaws.com.cn",
      //       ""
      //     )
      //   : uriResponse.data;
      let url = uriResponse.data
      axios
        .get(url, { responseType: "text" })
        .then((ctResponse) => {
          // loading.value = false;
          let ct = ctResponse.data as string;
          console.log("asdasd", ct);

          if (ct) {
            // -- 将 JSON 字符串解析为对象
            const jsonObj = JSON.parse(ct);
            // -- 遍历 JSON 对象并进行替换
            jsonObj.forEach((item: { elements: Array<any> }) => {
              item.elements.forEach(
                (element: { src: string; type: string }) => {
                  if (element.type === "iframe") {
                    console.log("element.src 修改前 >>> ", element.src);
                    // -- 避免token过期，每次重渲染时替换之前嵌入的token
                    element.src = element.src.replace("tk=", "token=");
                    element.src = element.src.replace(
                      /(token=)([^"]+)/g,
                      (_, $2) => `${$2}${tk}`
                    );
                    element.src = element.src.replace("/integration?", "/ppt?");
                    // -- 按插入模块兼容老数据
                    const params = new URLSearchParams(
                      element.src.split("?")[1]
                    );

                    // -- 百科
                    if (element.src.includes("type=baike")) {
                      const kind = params.get("kind");
                      element.src = element.src.replace(
                        "type=baike",
                        kind === "1" ? "q=instrument" : "q=musician"
                      );
                    }
                    // -- 教材欣赏
                    else if (element.src.includes("/song?")) {
                      element.src = element.src.replace(
                        "/song?",
                        "/ppt?q=song&"
                      );
                    }
                    // -- 音基训练·节奏训练
                    else if (element.src.includes("type=beat")) {
                      element.src = element.src.replace(
                        "type=beat",
                        "q=train_rhythm"
                      );
                    }
                    // -- 音基训练·音高训练
                    else if (element.src.includes("type=pitch")) {
                      const id = params.get("id");
                      element.src = element.src.replace(/id=\d&/, "");
                      if (id === "1") {
                        // -- 模唱训练
                        element.src = element.src.replace(
                          "type=pitch",
                          "q=train_pitch_imitation"
                        );
                      } else if (id === "2") {
                        // -- 构唱训练
                        element.src = element.src.replace(
                          "type=pitch",
                          "q=train_pitch_composition"
                        );
                      } else if (id === "3") {
                        // -- 听音训练
                        element.src = element.src.replace(
                          "type=pitch",
                          "q=train_pitch_ear"
                        );
                      }
                    }
                    // -- 音基训练·趣味识谱
                    else if (element.src.includes("type=basic")) {
                      element.src = element.src.replace(
                        "type=basic",
                        "q=train_fun_sheet_music"
                      );
                    }
                    // -- 互动编创
                    else if (element.src.includes("type=chuang")) {
                      element.src = element.src.replace(
                        "type=chuang",
                        "q=interactive_creation"
                      );
                    }
                    // -- 自由编创
                    else if (element.src.includes("type=musicScore")) {
                      element.src = element.src.replace(
                        "type=musicScore",
                        "q=free_creation"
                      );
                    }
                    // -- AI作词
                    else if (element.src.includes("type=lyric")) {
                      element.src = element.src.replace("style=rock&", "");
                      element.src = element.src.replace(
                        "type=lyric",
                        "q=ai_lyrics"
                      );
                    }
                    // -- AI作曲（诗歌作曲）
                    else if (element.src.includes("type=proty")) {
                      element.src = element.src.replace(
                        "type=proty",
                        "q=ai_composition"
                      );
                    }
                    // -- 自定义编创
                    else if (element.src.includes("type=custom-compose")) {
                      element.src = element.src.replace(
                        "type=custom-compose",
                        "q=custom_compose_music"
                      );
                    }

                    console.log("sdfkjherjkglh", element.src);

                    // -- 修改域名
                    element.src = replaceDomain(
                      element.src + "&hide_side_bar=1",
                      import.meta.env.VITE_PLATFORM_HOST
                    );
                    console.log("sdfkjherjkglh", element.src);
                    console.log("element.src 修改后 >>> ", element.src);
                  }
                }
              );
            });
            const jsonStr = JSON.stringify(jsonObj);
            console.log("jsonStr  >>>>> ", jsonStr);
            slides.value = JSON.parse(jsonStr);
            call?.(slides.value);
          } else {
            ElMessage.info("解析失败");
          }
        })
        .catch((error) => {
          console.log(error);
          // loading.value = false;
        });
    } else {
      // loading.value = false;
    }
  } catch (error) {
    // loading.value = false;
    console.log(error);
  }
};

const saveComplete = (complete: boolean) => {
  window.parent.postMessage(
    {
      type: "saveComplete",
      data: complete,
    },
    "*"
  );
};

const onSave = async () => {
  // loading.value = true;
  const content = JSON.stringify(slides.value);
  const hasIfr = slides.value[0].elements.some((ele) => ele.type === "iframe");

  let cover_url = defaultCover;
  if (!hasIfr) {
    const base64String = await getFirstPPT();
    console.log("base64String >>> ", base64String);
    const file = base64ToFile(base64String, "cover_url.png");
    console.log("file >>> ", file);
    const resp = await apiCommon.uploadFile(file);
    if (resp.code === 200) {
      cover_url = resp.data.full_path;
    }
  }

  if (!courseId) {
    return ElMessage.error("课程ID不存在");
  }

  try {
    const resp = await apiCourse.update({
      id: +courseId,
      content,
      cover_url,
    });
    // loading.value = false;
    if (resp && resp.code === 200) {
      saveComplete(true);
    } else {
      saveComplete(false);
    }
  } catch (error) {
    console.log(error);
    // loading.value = false;
    saveComplete(false);
  }
};

// -- 临时代码 start
// const tk =
//   "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ2NjA4NjAzLCJpYXQiOjE3NDU3NDQ2MDMsImp0aSI6IjM2NzAwZmQ3Y2Q2ZDQ3NWRiZmRhYWI1YzIwMTRmZWI4IiwidXNlcl9pZCI6OTc1fQ.7C-GJEqZC9RkPpZK_nqcCzU1A8Aevf1EsSvNqzmmkVk";
// localStorage.setItem("AUTHORIZATION_TOKEN", tk);
// getCourseDetails(tk);
// -- 临时代码 end

// -- 监听发送过来的消息
let isModal = false;
type PostMsgType = { type: string; data: any } | "";
window.addEventListener("message", (event: MessageEvent<PostMsgType>) => {
  // console.log("fckk", event);

  if (event.data) {
    const { type, data } = event.data;
    if (type === "userToken") {
      console.log(`[pptlist] > token = ${data}`);
      localStorage.setItem("AUTHORIZATION_TOKEN", data);
      getCourseDetails(data);
    }

    if (type === "notFound") {
      if (isModal) {
        return;
      }
      isModal = true;
      ElMessageBox.confirm("当前数据不存在，请重新插入对应的模块", "温馨提示", {
        showCancelButton: false,
        confirmButtonText: "知道了",
      }).then(() => {
        isModal = false;
        nextTick(() => {
          deleteAllElements();
        });
      });
    }

    if (type === "uploadCourseware") {
      console.log(data);
      importPPTXFile(data);
    }
    if (type === "downloadCourseware") {
      const tk = localStorage.getItem("AUTHORIZATION_TOKEN") || "";
      slidesStore.setTitle(data?.title);
      getCourseDetails(tk, data?.id, (slide) => {
        exportPPTX(slide, true, false);
      });
    }
    // 这种全屏处理是因为iframe嵌入的页面在父级页面中操作iframe无法让子级页面全屏（必须由子页面产生交互），
    // 所以这里只设置放映状态，具体的全屏操作在父级页面中进行
    if (type === "screening") {
      if (data === "current") {
        // enterScreening();
        // 进入放映状态（从当前页开始）
        screenStore.setScreening(true);
      } else {
        // 进入放映状态（从第一页开始）
        // enterScreeningFromStart();
        slidesStore.updateSlideIndex(0);
        screenStore.setScreening(true);
      }
    }

    if (type === "exitScreening") {
      console.log("ppt 退出全屏 >>>>");
      screenStore.setScreening(false);
    }

    if (type === "save") {
      onSave();
    }

    if (type === "closeCustomIfr") {
      globalStore.customPageUrl = "";
      if (data.isOk) {
        const token = localStorage.getItem("AUTHORIZATION_TOKEN");
        const host = import.meta.env.VITE_PLATFORM_HOST + "/ppt";
        const timestamp = Date.now();
        let query = "";
        switch (data.kind) {
          case "自定义编创":
            query = `?q=custom_compose_music&source=ppt&timestamp=${timestamp}&id=${data.id}&token=${token}&hide_side_bar=1`;
            break;
          case "自定义节奏训练":
            query = `?q=train_rhythm&id=${data.id}&source=ppt&trainType=自定义节奏训练&timestamp=${timestamp}&token=${token}&hide_side_bar=1`;
            break;
          case "自定义趣味识谱":
            query = `?q=train_fun_sheet_music&id=${data.id}&source=ppt&timestamp=${timestamp}&token=${token}&hide_side_bar=1`;
            break;
        }
        const src = host + query;
        createSlide();
        createFrameElement(src);
        message.success("创建成功");
      }
    }
  }
});
// 向父级窗口发送上传状态及解析的数据
watch(importExporting, (newVal) => {
  console.log("sdlgkjkldfg", newVal);

  window.parent.postMessage(
    { type: "uploadCoursewareLoading", data: unref(newVal) },
    "*"
  );
  if (newVal == false) {
    // getFirstPPT().then((res: any) => {
    //   console.log("asd", res);
    // });

    window.parent.postMessage(
      {
        type: "uploadCoursewareData",
        data: {
          content: JSON.stringify(slides.value),
        },
      },
      "*"
    );
  }
});

watch([exporting2], ([newVal1]) => {
  window.parent.postMessage(
    {
      type: "downloadCoursewareComplete",
      data: {
        success: unref(newVal1),
      },
    },
    "*"
  );
});

// 应用注销时向 localStorage 中记录下本次 indexedDB 的数据库ID，用于之后清除数据库
window.addEventListener("unload", () => {
  const discardedDB = localStorage.getItem(LOCALSTORAGE_KEY_DISCARDED_DB);
  const discardedDBList: string[] = discardedDB ? JSON.parse(discardedDB) : [];

  discardedDBList.push(databaseId.value);

  const newDiscardedDB = JSON.stringify(discardedDBList);
  localStorage.setItem(LOCALSTORAGE_KEY_DISCARDED_DB, newDiscardedDB);
});
</script>

<style lang="scss">
#app {
  height: 100%;
}
.custom-ifr {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  &.open {
    z-index: 100;
  }
}

.el-message {
  z-index: 9999 !important;
}
</style>
