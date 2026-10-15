import {readCatalog,ORIGINAL,databaseConfigured} from '../../../lib/home-store';
import {stocks} from '../../../lib/commerce';
export const dynamic='force-dynamic';
export async function GET(){try{const catalog=await readCatalog();let inventory=[];
 if(databaseConfigured()){const visible=new Set(catalog.content.products.filter(p=>p.visible).flatMap(p=>p.sizes.map(s=>p.id+':'+encodeURIComponent(s))));inventory=(await stocks()).filter(r=>visible.has(r.sku)).map(r=>({sku:r.sku,stock:r.stock,maxOrder:r.max_order,enabled:!!r.enabled}));}
 else{const response=await fetch(ORIGINAL+'/api/shop?view=stock',{cache:'no-store',signal:AbortSignal.timeout(8000)});if(!response.ok)throw Error();inventory=(await response.json()).inventory||[];}
 return Response.json({products:catalog.content.products.filter(p=>p.visible),inventory,connected:catalog.shared},{headers:{'Cache-Control':'no-store'}});
 }catch{return Response.json({error:'상품과 재고를 불러오지 못했습니다. 다시 시도해 주세요.'},{status:503,headers:{'Cache-Control':'no-store'}})}}
