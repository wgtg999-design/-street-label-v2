import {upgradeHome} from './home-upgrade';
import {z} from 'zod';
export const imagePath=z.string().max(220).regex(/^\/(editorial\/[a-z0-9-]+\.webp|assets\/[a-zA-Z0-9._-]+|media\/[a-f0-9-]+\.(png|jpg|webp)|v2-media\/[a-f0-9-]{36}\.webp)$/);
export const destination=z.string().max(500).refine(value=>{
 if(!value.startsWith('/')||value.startsWith('//')||/[\\\x00-\x20]/.test(value))return false;
 try{return new URL(value,'https://store.invalid').origin==='https://store.invalid'&&!decodeURIComponent(value).includes('\\')}catch{return false}
},'사이트 내부 주소를 입력하세요.');
export const homeSchema=z.object({
 banners:z.array(z.object({id:z.string().regex(/^[a-z0-9-]{1,60}$/),desktop:imagePath,mobile:z.union([imagePath,z.literal('')]),href:destination,enabled:z.boolean(),eyebrow:z.string().max(80),title:z.string().max(120),embeddedCopy:z.boolean(),focus:z.number().min(0).max(100)}).strict()).max(6),
 featured:z.array(z.object({id:z.string().max(60),enabled:z.boolean(),image:z.union([imagePath,z.literal('')])}).strict()).max(10),
 journalTitle:z.string().max(80),journalSubtitle:z.string().max(160),
 categories:z.array(z.object({label:z.string().min(1).max(30),category:z.enum(['OUTER','TOPS','BOTTOMS','ACC']),image:imagePath}).strict()).length(3)
}).strict().refine(v=>new Set(v.banners.map(x=>x.id)).size===v.banners.length&&new Set(v.featured.map(x=>x.id)).size===v.featured.length,'중복 항목이 있습니다.');
export const defaultHome=upgradeHome({banners:[{id:'between-shadows',desktop:'/editorial/campaign.webp',mobile:'/editorial/campaign-mobile.webp',href:'/shop',enabled:true,eyebrow:'2025 FALL COLLECTION',title:'BETWEEN\nTHE SHADOWS',embeddedCopy:true,focus:50}],featured:[{id:'jacket',enabled:true,image:'/editorial/look-01.webp'},{id:'shell',enabled:true,image:'/editorial/look-02.webp'},{id:'denim',enabled:true,image:'/editorial/look-03.webp'},{id:'trousers',enabled:true,image:''}],journalTitle:'COLLECTION\nJOURNAL',journalSubtitle:'DIFFERENT PERSPECTIVES\nOF THE SAME SEASON',categories:[{label:'OUTER',category:'OUTER',image:'/editorial/outer.webp'},{label:'T-SHIRT',category:'TOPS',image:'/editorial/t-shirt.webp'},{label:'PANTS',category:'BOTTOMS',image:'/editorial/pants.webp'}]});
