import {getDatabase} from '../../../runtime/database';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(request,{params}){const {file}=await params;if(!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\.webp$/.test(file))return new Response(null,{status:404});
 try{const row=await getDatabase().prepare('SELECT data FROM store_content WHERE key=?').bind('v2-image:'+file.slice(0,-5)).first();if(!row)return new Response(null,{status:404});const data=JSON.parse(row.data);if(data.mime!=='image/webp'||typeof data.data!=='string')throw Error();return new Response(Buffer.from(data.data,'base64'),{headers:{'Content-Type':'image/webp','Cache-Control':'public, max-age=31536000, immutable','X-Content-Type-Options':'nosniff'}})}catch{return new Response(null,{status:503,headers:{'Cache-Control':'no-store'}})}}
