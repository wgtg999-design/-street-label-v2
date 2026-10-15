const pairs={jacket:['/editorial/look-01.webp','v2-washed-work-jacket'],shell:['/editorial/look-02.webp','v2-star-back-jacket'],denim:['/editorial/look-03.webp','v2-washed-zip-hoodie']};
const photographs={'/editorial/campaign.webp':'/editorial/campaign-hd.webp','/editorial/campaign-mobile.webp':'/editorial/campaign-mobile-hd.webp','/editorial/look-01.webp':'/editorial/look-01-hd.webp','/editorial/look-02.webp':'/editorial/look-02-hd.webp','/editorial/look-03.webp':'/editorial/look-03-hd.webp','/editorial/outer.webp':'/editorial/outer-hd.webp','/editorial/t-shirt.webp':'/editorial/t-shirt-hd.webp','/editorial/pants.webp':'/editorial/pants-hd.webp'};
export function upgradeHome(config){
 const featured=config.featured.map(f=>pairs[f.id]?.[0]===f.image?{...f,id:pairs[f.id][1],image:''}:f);
 // The first three old portraits were paired with unrelated shared products.
 const replaced=config.featured.filter(f=>pairs[f.id]?.[0]===f.image).length===3;
 const next=replaced?featured.filter(f=>!(f.id==='trousers'&&f.image==='')):featured;
 if(replaced)for(const id of ['v2-star-tee','v2-cargo-pants','v2-hooded-jacket','v2-ivory-top'])if(next.length<10&&!next.some(f=>f.id===id))next.push({id,enabled:true,image:''});
 return {...config,banners:config.banners.map(b=>{const original=b.desktop==='/editorial/campaign.webp'||b.desktop==='/v2-media/6bd68bfa-4624-4ad9-908f-1eb8e85ace00.webp';return {...b,desktop:original?'/editorial/campaign-hd.webp':b.desktop,mobile:photographs[b.mobile]||b.mobile,embeddedCopy:original?false:b.embeddedCopy}}),featured:next,categories:config.categories.map(c=>({...c,image:photographs[c.image]||c.image}))};
}
