import {notFound} from 'next/navigation';
import Storefront from '../../storefront';
import {storefrontData} from '../../../lib/home-store';
export const dynamic='force-dynamic';
export default async function Product({params}){const {id}=await params,data=await storefrontData();if(!data.products.some(p=>p.id===id))notFound();return <Storefront {...data} mode="shop" initialProductId={id}/>}
