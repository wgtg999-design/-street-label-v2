import {readHome} from '../../../lib/home-store';
export const dynamic='force-dynamic';
export async function GET(){try{return Response.json(await readHome(),{headers:{'Cache-Control':'no-store'}})}catch{return Response.json({error:'홈페이지 설정을 불러오지 못했습니다.'},{status:503})}}
