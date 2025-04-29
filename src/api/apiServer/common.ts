import request from "@/api/apiConfig";

export function uploadFile(file: any) {
  const formData = new FormData();
  formData.append("file", file);

  return request<{ full_path: string; path: string }>({
    url: "/mgr/textbook/upload_img/",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    method: "POST",
    data: formData,
  });
}

export function getOptions(scope: number) {
  return request<API.classifyOptions[]>({
    url: `/mgr/classify/option/?scope=${scope}`,
  });
}

export function getWikiList(params: { type?: 1 | 2 } & API.ListParams) {
  return request<API.ListRepsonse<API.BaikeItemProps>>({
    url: "/mgr/textbook_courseware/wiki_list/",
    params,
  });
}

export function getTempoList(params: API.ListParams) {
  return request<API.ListRepsonse<API.BeatItemProps>>({
    url: "/mgr/textbook_courseware/tempo_list/",
    params,
  });
}

export function getInteractList(params: API.ListParams) {
  return request<API.ListRepsonse<API.ChuangItemProps>>({
    url: "/mgr/textbook_courseware/interact_list/",
    params,
  });
}

export function getUserComposeList(params: API.ListParams) {
  return request<API.ListRepsonse<API.MusicScoreItemProps>>({
    url: "/mgr/textbook_courseware/user_compose_list/",
    params,
  });
}

export function getLyricList(params: API.ListParams) {
  return request<API.ListRepsonse<API.LyricListItemProps>>({
    url: "/mgr/textbook_courseware/lyric_list/",
    params,
  });
}

export function getPoetryList(params: API.ListParams) {
  return request<API.ListRepsonse<API.PoetryListItemProps>>({
    url: "/mgr/textbook_courseware/poetry_list/",
    params,
  });
}

export function getComposeList(params: API.ListParams) {
  return request<API.ListRepsonse<API.ComposeListItemProps>>({
    url: "/mgr/textbook_courseware/compose_list/",
    params,
  });
}

/**
 * 自定义节奏
 */
export function getRhythmList(params: API.Pagination) {
  return request<API.ListRepsonse<API.CustomList>>({
    url: "/mgr/tempo_stage/custom_tempo_list/",
    params,
  });
}
export function deleteRhythm(id: string | number) {
  return request({
    url: `/mgr/tempo_stage/${id}/custom_tempo_delete/`,
    method: "delete",
  });
}
export function updateRhythm(data: { id: string | number; title: string }) {
  return request({
    url: "/mgr/tempo_stage/custom_tempo_update/",
    data,
    method: "post",
  });
}
/**
 * 自定义编创
 */
export function getCompilationAndCreationList(params: API.Pagination) {
  return request<API.ListRepsonse<API.CustomList>>({
    url: "/mgr/compose_user/custom_compose_list/",
    params,
  });
}
export function deleteCompilationAndCreation(id: string | number) {
  return request({
    url: `/mgr/compose_user/${id}/custom_compose_delete/`,
    method: "delete",
  });
}
export function updateCompilationAndCreation(data: { id: string | number; title: string }) {
  return request({
    url: "/mgr/compose_user/custom_compose_update/",
    data,
    method: "post",
  });
}
/**
 * 自定义识谱
 */
export function getSpectrumRecognitionList(params: API.Pagination) {
  return request<API.ListRepsonse<API.CustomList>>({
    url: "/mgr/basic/custom_notation_list/",
    params,
  });
}

export function deleteSpectrumRecognition(id: string | number) {
  return request({
    url: `/mgr/basic/${id}/custom_notation_delete/`,
    method: "delete",
  });
}

export function updateSpectrumRecognition(data: { id: string | number; title: string }) {
  return request({
    url: "/mgr/basic/custom_notation_update/",
    data,
    method: "post",
  });
}
export function getTextbookTypes() {
  return request({
    url: "/api/textbook_type/",
    params: {
      status: 1,
      check_access: 1
    }
  });
}

export function getSongs(params: API.Pagination & Record<string, any>) {
  return request({
    url: "/api/textbook_song/",
    params,
  });
}

