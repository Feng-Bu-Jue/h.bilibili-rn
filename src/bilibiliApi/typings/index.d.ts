export type DrawCategory = 'all' | 'illustration' | 'comic' | 'other';
export type PhotoCategory = 'all' | 'sifu' | 'cos';
export type ListType = 'hot' | 'new';

export interface BiliBiliProtocol<T> {
  public code: number;
  public message: string;
  public msg: string;
  public data: T;
}

export interface Picture {
  public img_height: number;
  public img_size: number;
  public img_width: number;
  public img_src: string;
}

export interface LinkDrawItem {
  public already_liked: number;
  public already_voted: number;
  public category: string;
  public doc_id: number;
  public poster_uid: number;
  public title: string;
  public description: string;
  public upload_time: number;
  public upload_timestamp: number;
  public view_count: number;
  public pictures: Array<Picture>;
}

export interface LinkDrawUesr {
  public head_url: string;
  public name: string;
  public uid: number;
}

export interface LinkDrawResult {
  public item: LinkDrawItem;
  public user: LinkDrawUesr;
}

export interface LinkDrawResultList {
  public total_count: number;
  public items: LinkDrawResult[];
}

/* v1 */
export interface LinkDrawResultV1 {
  public count: number;
  public ctime: number;
  public description: number;
  public doc_id: number;
  public like: number;
  public pictures: number;
  public poster_uid: number;
  public title: number;
  public view: number;
}

export interface LinkDrawResultV1List {
  public items: Array<LinkDrawResultV1>;
}

export interface ReplyResult {
  public blacklist: number;
  public page: ReplyPage;
  public hots: Array<Reply>;
  public replies: Array<Reply>;
}

export interface Reply {
  public floor: string;
  public content: ReplyContent;
  public member: Member;
  public ctime: number;
  public count: number;
  public like: number;
  public mid: number;
  public oid: number;
  rpid: number;
  public replies: Array<Reply>;
}

export interface ReplyPage {
  public acount: number;
  public count: number;
  public num: number;
  public size: number;
}

export interface ReplyContent {
  public device: string;
  public members: Array<string>;
  public message: string;
  public plat: number; //plat 1=web? 2=android
}

export interface AddReplyResult {
  dialog: number;
  dialog_str: number;
  need_captcha: boolean;
  parent: number;
  parent_str: string;
  root: number;
  root_str: string;
  rpid: number;
  rpid_str: string;
  url: string;
}

export interface Member {
  public mid: string;
  public avatar: string;
  public uname: string;
  public sign: string;
  public sex: string;
  public rank: number;
  public level_info: MemberLevel;
  public vip: MemberVip;
}

export class MemberLevel {
  public current_level: number;
}
export class MemberVip {
  public vipStatus: number;
  public type: number;
}
