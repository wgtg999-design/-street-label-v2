import 'server-only';
import {getDatabase} from '../runtime/database';
import {defaultCampaign,campaignSchema,campaignProducts} from './campaign-products';
export const CAMPAIGN_KEY='v2-campaign-products';
export async function readCampaign(){
 if(!process.env.TURSO_DATABASE_URL&&!process.env.TURSO_URL)return {settings:defaultCampaign,revision:0,products:campaignProducts()};
 const row=await getDatabase().prepare('SELECT data,revision FROM store_content WHERE key=?').bind(CAMPAIGN_KEY).first();
 const settings=row?campaignSchema.parse(JSON.parse(row.data)):defaultCampaign;
 return {settings,revision:row?.revision??0,products:campaignProducts(settings)};
}
