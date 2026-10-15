import Storefront from './storefront';
import {storefrontData} from '../lib/home-store';
export const dynamic='force-dynamic';
export default async function Home(){return <Storefront {...await storefrontData()} />}
