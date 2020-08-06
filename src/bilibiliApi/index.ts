import { LinkDrawService } from './apis/linkDrawApi';
import { ReplyService } from './apis/replyApi';
import { buildApi } from './extensions';

export const LinkDrawApi = buildApi(LinkDrawService);
export const ReplyApi = buildApi(ReplyService);
