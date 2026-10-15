import {z} from 'zod';

// These are our campaign concepts, not the third-party products used for price research.
// Keep them out of the legacy store's strict `main` catalog and checkout inventory.
export const campaignDefinitions=[
 {id:'v2-washed-work-jacket',name:'워시드 블랙 워크 재킷',category:'OUTER',color:'WASHED BLACK',price:119000,photo:'look-01-hd',description:'워시드 블랙 톤과 여유 있는 실루엣, 전면 포켓이 특징인 캠페인 워크 재킷.'},
 {id:'v2-star-back-jacket',name:'스타 백 오버사이즈 재킷',category:'OUTER',color:'BLACK',price:129000,photo:'look-02-hd',description:'등과 소매의 아웃라인 스타 디테일이 돋보이는 블랙 오버사이즈 재킷.'},
 {id:'v2-washed-zip-hoodie',name:'페이드 워시드 크롭 후드 집업',category:'OUTER',color:'FADED CHARCOAL',price:79000,photo:'look-03-hd',description:'바랜 차콜 톤과 짧은 기장, 전면 지퍼가 특징인 후드 집업.'},
 {id:'v2-hooded-jacket',name:'섀도우 후디드 블루종',category:'OUTER',color:'BLACK',price:139000,photo:'outer-hd',description:'깊은 후드와 여유로운 볼륨으로 구성한 블랙 캠페인 블루종.'},
 {id:'v2-star-tee',name:'스타 아웃라인 오버핏 티셔츠',category:'TOPS',color:'BLACK',price:49000,photo:'t-shirt-hd',description:'전면 아웃라인 스타 그래픽과 드롭 숄더 실루엣의 블랙 반팔 티셔츠. 사진 속 안쪽 긴팔과 비니는 코디 상품으로 포함되지 않습니다.'},
 {id:'v2-cargo-pants',name:'볼륨 와이드 멀티 카고 팬츠',category:'BOTTOMS',color:'WASHED BLACK',price:89000,photo:'pants-hd',description:'넓은 밑단과 입체적인 카고 포켓이 특징인 워시드 블랙 팬츠. 신발은 포함되지 않습니다.'},
 {id:'v2-ivory-top',name:'아이보리 패널 롱슬리브',category:'TOPS',color:'IVORY',price:49000,photo:'ivory-hd',description:'차분한 아이보리 컬러와 패널 라인이 특징인 긴팔 톱. 팬츠는 별도 상품입니다.'}
];
export const campaignSchema=z.array(z.object({id:z.enum(campaignDefinitions.map(p=>p.id)),name:z.string().trim().min(1).max(100),price:z.number().int().min(1000).max(10000000),visible:z.boolean()}).strict()).length(campaignDefinitions.length).refine(items=>new Set(items.map(p=>p.id)).size===campaignDefinitions.length,'상품이 중복되었습니다.');
export const defaultCampaign=campaignDefinitions.map(({id,name,price})=>({id,name,price,visible:true}));
export function campaignProducts(settings=defaultCampaign){return campaignSchema.parse(settings).map(setting=>{const p=campaignDefinitions.find(p=>p.id===setting.id);return {...p,...setting,image:`/editorial/${p.photo}.webp`,modelImage:`/editorial/${p.photo}.webp`,modelFocus:'center',sizes:[],status:'preparing',description:p.description+' 캠페인 이미지 기반으로 개발 중인 상품입니다. 상세 소재·실측·옵션·입고 일정은 확정 후 안내합니다.'}})}
