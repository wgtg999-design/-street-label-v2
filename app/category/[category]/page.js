import {notFound} from 'next/navigation';
import Storefront from '../../storefront';
import {storefrontData} from '../../../lib/home-store';
export const dynamic='force-dynamic';
export default async function Category({params}){const {category}=await params;const map={outer:'OUTER','t-shirt':'TOPS',pants:'BOTTOMS',acc:'ACC'};if(!map[category])notFound();return <Storefront {...await storefrontData()} mode="shop" initialCategory={map[category]} />}
