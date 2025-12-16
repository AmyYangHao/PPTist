/* eslint-disable */
import request from "@/api/apiConfig";

interface UpdateParams {
  id: number;
  content: string;
  /**
   * 封面图片的base64格式
   */
  cover_url: string;
}
export function update(data: UpdateParams) {
  return request({
    url: "/mgr/textbook_courseware/update_content/",
    data,
    method: "POST"
  });
}
export function updateUrl(data: any) {
  return request({
    url: "/mgr/textbook_courseware/update_content_url/",
    data,
    method: "POST"
  });
}

export function getS3Url(data: any) {
  return request({
    url: "/api/presign_url",
    data,
    method: "POST"
  });
}

export function details(id: string) {
  return request<string>({
    url: `/mgr/textbook_courseware/get_content/?id=${id}`,
  });
}
