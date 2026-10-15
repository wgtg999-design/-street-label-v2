import {redirect} from 'next/navigation';
import {authConfigured} from '../../runtime/auth-config';
import {getChatGPTUser} from '../chatgpt-auth';
import {isOwner} from '../../lib/admin';
import {databaseConfigured,readHome,readCatalog} from '../../lib/home-store';
import Editor from './editor';
export const dynamic='force-dynamic';
export default async function Studio(){
 if(!databaseConfigured()||!authConfigured())return <main className="studio"><nav><a href="/">← 홈페이지</a><a href="https://street-label-shop.vercel.app/admin">기존 상품·주문 관리</a></nav><h1>홈페이지 관리 연결 준비 중</h1><p>관리자 로그인과 공유 저장소 연결을 확인해야 합니다. 현재 변경 내용을 저장하거나 이미지를 업로드할 수 없습니다.</p><p>두 번째 프로젝트의 Vercel 설정에서 기존 서비스 연결을 완료한 뒤 이용해 주세요.</p><a href="/setup">연결 상태 확인 →</a></main>;
 if(!await getChatGPTUser())redirect('/auth/sign-in?next=%2Fstudio');
 if(!await isOwner())return <main className="studio"><h1>접근 권한이 없습니다.</h1><a href="/">홈페이지로</a></main>;
 try{const [home,catalog]=await Promise.all([readHome(),readCatalog()]);return <Editor initial={home} products={catalog.content.products} />}
 catch{return <main className="studio"><h1>저장소에 연결하지 못했습니다.</h1><p>저장 내용을 확인할 수 없어 편집을 중지했습니다. 잠시 후 다시 시도해 주세요.</p><a href="/studio">다시 확인</a></main>}
}
