import {randomUUID} from 'node:crypto';
import sharp from 'sharp';
import {guard,noCache,limitedBody} from '../../../../lib/admin';
import {getDatabase} from '../../../../runtime/database';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function POST(request){const denied=await guard(request);if(denied)return denied;try{
 const mime=request.headers.get('content-type')?.split(';')[0];if(!['image/jpeg','image/png','image/webp'].includes(mime))return Response.json({error:'JPG, PNG, WebP 이미지만 업로드할 수 있습니다.'},{status:400,headers:noCache});
 const input=Buffer.from(await limitedBody(request,3*1024*1024));
 const metadata=await sharp(input,{limitInputPixels:36000000}).metadata();
 if(!['jpeg','png','webp'].includes(metadata.format)||(metadata.pages||1)>1)throw Error('unsupported');
 let output=await sharp(input,{limitInputPixels:36000000}).rotate().resize({width:2400,height:2400,fit:'inside',withoutEnlargement:true}).webp({quality:88}).toBuffer();
 if(output.length>750000)output=await sharp(input,{limitInputPixels:36000000}).rotate().resize({width:1920,height:1920,fit:'inside',withoutEnlargement:true}).webp({quality:72}).toBuffer();
 if(output.length>750000)return Response.json({error:'이미지가 복잡하거나 너무 큽니다. 작은 이미지로 다시 시도해 주세요.'},{status:413,headers:noCache});
 const id=randomUUID(),now=new Date().toISOString();
 await getDatabase().prepare('INSERT INTO store_content(key,data,revision,updated_at) VALUES(?,?,0,?)').bind('v2-image:'+id,JSON.stringify({mime:'image/webp',data:output.toString('base64')}),now).run();
 return Response.json({url:'/v2-media/'+id+'.webp'},{headers:noCache,status:201});
 }catch{return Response.json({error:'이미지를 저장하지 못했습니다. 3MB 이하의 정상 JPG, PNG, WebP 이미지와 저장소 연결을 확인해 주세요.'},{status:400,headers:noCache})}}
