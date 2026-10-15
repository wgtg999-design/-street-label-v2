import {guard,noCache,limitedBody} from '../../../../lib/admin';
import {readHome,databaseConfigured} from '../../../../lib/home-store';
import {homeSchema,defaultHome} from '../../../../lib/home-config';
import {getDatabase} from '../../../../runtime/database';
export const dynamic='force-dynamic';
export async function GET(){if(!databaseConfigured())return Response.json({error:'공유 DB와 관리자 로그인 연결이 필요합니다.'},{status:503,headers:noCache});const denied=await guard();if(denied)return denied;try{return Response.json(await readHome(),{headers:noCache})}catch{return Response.json({error:'설정을 읽지 못했습니다.'},{status:503,headers:noCache})}}
export async function PUT(req){if(!databaseConfigured())return Response.json({error:'공유 DB 연결이 필요합니다.'},{status:503,headers:noCache});const denied=await guard(req);if(denied)return denied;
 try{const body=JSON.parse(new TextDecoder().decode(await limitedBody(req,80000))),config=homeSchema.parse(body.config);if(!Number.isInteger(body.revision)||body.revision<0)throw Error('잘못된 수정 번호');
 const db=getDatabase();await db.prepare('INSERT OR IGNORE INTO store_content(key,data,revision,updated_at) VALUES(?,?,0,?)').bind('v2-home',JSON.stringify(defaultHome),new Date().toISOString()).run();
 const row=await db.prepare('UPDATE store_content SET data=?,revision=revision+1,updated_at=? WHERE key=? AND revision=? RETURNING revision').bind(JSON.stringify(config),new Date().toISOString(),'v2-home',body.revision).first();
 return row?Response.json({ok:true,revision:row.revision},{headers:noCache}):Response.json({error:'다른 창에서 변경되었습니다. 다시 불러온 뒤 저장하세요.'},{status:409,headers:noCache});
 }catch{return Response.json({error:'입력값을 확인해 주세요. 배너 6장, 상품 10개까지 등록할 수 있습니다.'},{status:400,headers:noCache})}}
