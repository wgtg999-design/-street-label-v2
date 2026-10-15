import 'server-only';
import {getDatabase} from '../runtime/database';
import {readStore} from './store';
import {defaultHome,homeSchema} from './home-config';
import {authConfigured} from '../runtime/auth-config';
import {readCampaign} from './campaign-store';
import {upgradeHome} from './home-upgrade';
export const ORIGINAL='https://street-label-shop.vercel.app';
export function databaseConfigured(){return Boolean(process.env.TURSO_DATABASE_URL||process.env.TURSO_URL)}
export async function readHome(){
 if(!databaseConfigured())return {config:defaultHome,revision:0,connected:false};
 const row=await getDatabase().prepare('SELECT data,revision FROM store_content WHERE key=?').bind('v2-home').first();
 const original=row?homeSchema.parse(JSON.parse(row.data)):defaultHome,config=upgradeHome(original);
 return {config,revision:row?.revision??0,connected:true,needsSave:JSON.stringify(config)!==JSON.stringify(original)};
}
export async function readCatalog(){
 const campaign=await readCampaign();
 if(databaseConfigured()){const shared=await readStore();return {...shared,content:{...shared.content,products:[...campaign.products,...shared.content.products]},shared:true};}
 const response=await fetch(ORIGINAL+'/api/content',{cache:'no-store',signal:AbortSignal.timeout(8000)});
 if(!response.ok)throw Error('상품 정보를 불러오지 못했습니다.');
 const data=await response.json();
 // Never turn upstream errors or prototype content into purchasable stock.
 if(!data.content||data.testOnly)throw Error('실제 상품 연결을 확인해 주세요.');
 return {...data,content:{...data.content,products:[...campaign.products,...data.content.products]},shared:false};
}
export async function storefrontData(){
 const results=await Promise.allSettled([readHome(),readCatalog()]);
 const home=results[0].status==='fulfilled'?results[0].value:{config:defaultHome,revision:0,connected:false};
 const catalog=results[1].status==='fulfilled'?results[1].value:null;
 return {home:home.config,brand:catalog?.content.brand||'STREET LABEL',products:(catalog?.content.products||[]).filter(p=>p.visible),catalogError:!catalog,connected:Boolean(catalog?.shared&&home.connected&&authConfigured())};
}
