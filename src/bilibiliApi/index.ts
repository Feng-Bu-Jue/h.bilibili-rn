import { LinkDrawService } from './apis/linkDrawApi';
import { ReplyService } from './apis/replyApi';
import { buildApi } from './extensions';
import { AuthService } from './apis/authApi';

export const LinkDrawApi = buildApi(LinkDrawService);
export const ReplyApi = buildApi(ReplyService);
export const AuthApi = buildApi(AuthService);
