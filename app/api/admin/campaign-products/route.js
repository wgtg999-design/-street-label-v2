import {guard,noCache,limitedBody} from '../../../../lib/admin';
import {campaignSchema,defaultCampaign} from '../../../../lib/campaign-products';
import {readCampaign,CAMPAIGN_KEY} from '../../../../lib/campaign-store';
import {getDatabase} from '../../../../runtime/database';
export const dynamic='force-dynamic';
export async function GET(){const denied=await guard();if(denied)return denied;try{const {settings,revision}=await readCampaign();return Response.json({settings,revision},{headers:noCache})}catch{return Response.json({error:'상품 설정을 읽지 못했습니다.'},{status:503,headers:noCache})}}
export async function PUT(req){const denied=await guard(req);if(denied)return denied;try{
 const body=JSON.parse(new TextDecoder().decode(await limitedBody(req,20000))),settings=campaignSchema.parse(body.settings);
 if(!Number.isInteger(body.revision)||body.revision<0)throw Error();
 const db=getDatabase();await db.prepare('INSERT OR IGNORE INTO store_content(key,data,revision,updated_at) VALUES(?,?,0,?)').bind(CAMPAIGN_KEY,JSON.stringify(defaultCampaign),new Date().toISOString()).run();
 const row=await db.prepare('UPDATE store_content SET data=?,revision=revision+1,updated_at=? WHERE key=? AND revision=? RETURNING revision').bind(JSON.stringify(settings),new Date().toISOString(),CAMPAIGN_KEY,body.revision).first();
 return row?Response.json({ok:true,revision:row.revision},{headers:noCache}):Response.json({error:'다른 창에서 변경되었습니다. 새로고침 후 다시 저장하세요.'},{status:409,headers:noCache});
 }catch{return Response.json({error:'상품명과 가격을 확인해 주세요.'},{status:400,headers:noCache})}}
