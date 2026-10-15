import {databaseConfigured} from '../../lib/home-store';
import {getAuthConfigurationStatus} from '../../runtime/auth-config';
export const dynamic='force-dynamic';
export async function GET(){const a=getAuthConfigurationStatus();const db=databaseConfigured();const r2=['R2_ACCOUNT_ID','R2_ACCESS_KEY_ID','R2_SECRET_ACCESS_KEY','R2_BUCKET_NAME','UPLOAD_SIGNING_SECRET'].every(key=>Boolean(process.env[key]));return Response.json({site:'street-label-v2',databaseConfigured:db,authConfiguration:a,v2ImageStorageConfigured:db,legacyR2Configured:r2,note:'설정 항목 존재 여부이며 실제 로그인·저장·업로드 성공을 뜻하지 않습니다. 기존 DB를 초기화하지 마세요.'},{headers:{'Cache-Control':'no-store','X-Robots-Tag':'noindex,nofollow'}})}
