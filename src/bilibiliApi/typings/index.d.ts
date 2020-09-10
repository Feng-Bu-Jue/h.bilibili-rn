export type DrawCategory = 'all' | 'illustration' | 'comic' | 'draw';
export type PhotoCategory = 'all' | 'sifu' | 'cos';
export type ListType = 'hot' | 'new';

export interface BiliBiliProtocol<T> {
  code: number;
  message: string;
  msg: string;
  data: T;
}

export interface Picture {
  img_height: number;
  img_size: number;
  img_width: number;
  img_src: string;
}

export interface LinkDrawItem {
  already_liked: number;
  already_voted: number;
  category: string;
  doc_id: number;
  poster_uid: number;
  title: string;
  description: string;
  upload_time: number;
  upload_timestamp: number;
  view_count: number;
  pictures: Array<Picture>;
  tags: Tag[];
}

export interface Tag {
  category: string;
  name: string;
  tag: string;
  text: string;
  type: number;
}

export interface LinkDrawUesr {
  head_url: string;
  name: string;
  uid: number;
}

export interface LinkDrawResult {
  item: LinkDrawItem;
  user: LinkDrawUesr;
}

export interface LinkDrawResultList {
  total_count: number;
  items: LinkDrawResult[];
}

/* v1 */
export interface LinkDrawResultV1 {
  count: number;
  ctime: number;
  description: number;
  doc_id: number;
  like: number;
  pictures: number;
  poster_uid: number;
  title: number;
  view: number;
}

export interface LinkDrawResultV1List {
  items: Array<LinkDrawResultV1>;
}

export interface ReplyResult {
  blacklist: number;
  page: ReplyPage;
  hots: Array<Reply>;
  replies: Array<Reply>;
}

export interface Reply {
  floor: string;
  content: ReplyContent;
  member: Member;
  ctime: number;
  count: number;
  like: number;
  mid: number;
  oid: number;
  rpid: number;
  replies: Array<Reply>;
}

export interface ReplyPage {
  acount: number;
  count: number;
  num: number;
  size: number;
}

export interface ReplyContent {
  device: string;
  members: Array<string>;
  message: string;
  plat: number; //plat 1=web? 2=android
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
  mid: string;
  avatar: string;
  uname: string;
  sign: string;
  sex: string;
  rank: number;
  level_info: MemberLevel;
  vip: MemberVip;
}

export interface MemberLevel {
  current_level: number;
}
export interface MemberVip {
  vipStatus: number;
  type: number;
}

export interface RSAPublicKeyResult {
  key: string;
  hash: string;
}

export interface AuthResult {
  status: number;
  token_info: AuthToken;
  cookie_info: CookieInfo;
  sso: Array<string>;
}

export interface AuthToken {
  mid: number;
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface SSOResult {
  cookie: string;
  status: string;
  ts: number;
}

export interface CookieInfo {
  cookies: CookieItem[];
  domains: string[];
}

export interface CookieItem {
  expires: number;
  http_only: number;
  name: string;
  value: string;
}

export interface UserSpaceDetail {
  card: SpaceCard;
  images: { imgUrl: string };
}

export interface SpaceCard {
  name: string;
  face: string;
  fans: number;
  mid: number;
  level_info: MemberLevel;
  sex: string;
  sign: string;
  vip: MemberVip;
}
