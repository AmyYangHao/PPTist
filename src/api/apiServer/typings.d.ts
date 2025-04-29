export { };

declare global {
  declare namespace API {
    interface BaseResponse<T = any> {
      code: number;
      data: T;
      msg: string;
    }

    interface Pagination {
      page: number;
      size: number;
    }
    interface ListRepsonse<T = any> {
      items: T[];
      count: number;
    }

    type ListParams = {
      page: number;
      size: number;
      keyword?: string;
      name?: string;
      classify_id?: number;
    };
    type BaikeItemProps = {
      classify_names: string;
      id: number;
      name: string;
      name_en: string;
      type: 1 | 2;
    };

    type classifyOptions = { id: number; label: string };

    type BeatItemProps = {
      id: number;
      name: string;
      signature: string;
    };

    type ChuangItemProps = {
      id: number;
      name: string;
      signature: string;
    };

    type MusicScoreItemProps = {
      id: number;
      name: string;
      status: number;
      status_desc: string;
      create_time: string;
    };

    type LyricListItemProps = {
      id: string;
      name: string;
    };

    type PoetryListItemProps = {
      id: string;
      name: string;
      author: string;
      dynasty: string | null;
      paragraphs: string;
      poet_serial_number: string;
    };

    type ComposeListItemProps = {
      id: number;
      classify_id: number;
      classify_name: string;
      teacher_id: number;
      name: string;
      bar: number;
      signature: string;
      speed: number;
      create_time: string;
      compose_url: string;
      accompany_url: string;
      status: number;
      view_status: number;
      source: string;
    };

    type CustomList = LyricListItemProps & { source_tonics: string }
  }
}
