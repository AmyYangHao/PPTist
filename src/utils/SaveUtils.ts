
/* eslint-disable */
import request from "@/api/apiConfig";
import { apiCourse } from "@/api/apiServer";
import Bus from "@likg/bus";
import { ElMessage } from "element-plus";

export async function savePPTtoS3(id: number, content: string, cover_url: string) {
    let name = `courseware_${id}.txt`
    const response = await apiCourse.getS3Url({
        code: "PPT_JSON",
        name
    });
    if (response && response.code === 200) {
        const { presign_url, full_path } = response.data;
        const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        const file = new File([blob], name, { type: "text/plain" });
        fetch(presign_url, {
            method: "PUT",
            body: file,
            headers: {
                "Content-Type": "text/plain; charset=utf-8"
            }
        })
            .then((uploadRes) => {
                // 将 fetch 返回规范化为原来代码期待的 shape（res.code === 200）
                return {
                    code: uploadRes.ok ? 200 : uploadRes.status,
                    raw: uploadRes
                };
            })
            .then((res: any) => {
                console.log(res);
                if (res && res.code === 200) {
                    return apiCourse.updateUrl({
                        id,
                        content_url: full_path,
                        cover_url,
                    }).then((resp: any) => {
                        console.log(resp);
                        ElMessage.success("保存成功");
                    });
                }
            })
            .finally(async () => {
                Bus.$emit("TOGGLE_LOADING_STATUS", false);
            })
    } else {
        Bus.$emit("TOGGLE_LOADING_STATUS", false);
        ElMessage.error("保存失败，获取上传地址失败");
    }
}
