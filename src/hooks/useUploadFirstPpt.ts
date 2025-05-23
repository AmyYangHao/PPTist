import { toPng } from "html-to-image";
import ThumbnailSlide from "@/views/components/ThumbnailSlide/index.vue";
import { useSlidesStore } from "@/store";
import { storeToRefs } from "pinia";
import { createApp } from "vue";

export default () => {
  const { slides } = storeToRefs(useSlidesStore());

  const getFirstPPT = () => {
    const div = document.createElement("div");
    div.className = "thumbnails";

    const foreignObjectSpans = div.querySelectorAll('foreignObject [xmlns]')
    foreignObjectSpans.forEach(spanRef => spanRef.removeAttribute('xmlns'))
    console.log(foreignObjectSpans);


    const app = createApp(ThumbnailSlide, {
      class: "thumbnail",
      slide: slides.value?.[0],
      size: 305,
    });
    app.mount(div);
    document.body.appendChild(div);
    console.log(app);

    const config = {
      quality: 1,
      width: 305,
      fontEmbedCSS: "",
    };

    return toPng(div, config).then((res: any) => {
      console.log(res);
      return res
    }).finally(() => {
      app.unmount();
      div.remove();
    });
  };

  return { getFirstPPT };
};
