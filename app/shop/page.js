import Storefront from '../storefront';
import {storefrontData} from '../../lib/home-store';
export const dynamic='force-dynamic';
export default async function Shop({searchParams}){const params=await searchParams;return <Storefront {...await storefrontData()} mode="shop" initialQuery={typeof params.q==='string'?params.q:''} initialCategory={['OUTER','TOPS','BOTTOMS','ACC'].includes(params.category)?params.category:'ALL'} />}
