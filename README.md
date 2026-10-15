# Street Label V2

기존 두 번째 Next.js 프로젝트를 확장한 모노크롬 스트릿웨어 메인페이지입니다. 기존 쇼핑몰 저장소와 분리되어 있으며, 사용자 승인에 따라 기존 상품·재고·회원·주문 DB를 공유하도록 서버 로직을 JavaScript로 재사용했습니다.

- 공개 사이트: https://street-label-v2.vercel.app
- 홈페이지 관리: `/studio`
- 공유 상품 관리: `/admin`
- 공유 주문·재고 관리: `/admin/orders`
- 연결 설명: [CONNECTIONS.md](CONNECTIONS.md)
- 재사용 출처: [RUNTIME-PROVENANCE.md](RUNTIME-PROVENANCE.md)

## 개발 및 검증

Node.js 22.13 이상 (검증 24.19), pnpm 11.25.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm test
pnpm run build
pnpm start --port 3902
```

화면: `app/storefront.js`, `app/globals.css`. 서버 데이터: `lib/home-store.js`. 배너·진열 스키마: `lib/home-config.js`. 관리자: `app/studio`, `app/api/admin/home`. 공통 제목: `app/layout.js`.

`.next/`, `node_modules/`, `.env*` 실제 비밀값은 원본으로 수정하거나 커밋하지 않습니다. 기존 DB를 초기화하는 API는 포함하지 않습니다. Vercel은 루트 `./`, Next.js, `pnpm install --frozen-lockfile`, `pnpm run build`를 사용합니다.

## 구현

투명·스크롤 대비 헤더, 최대 6개 PC/모바일 배너·자동 전환/화살표/스와이프/정지, 최대 10개 3열 단일 상품 캐러셀, 모바일 터치 UI, 서버 재고 조회 후 옵션별 장바구니 담기, 검색, 카테고리 필터, 컬렉션 저널, 접근 가능한 모달과 키보드 조작. 관리자 설정은 공유 DB의 별도 키에 저장하고 충돌을 방지합니다. 업로드는 기존 관리자 인증과 R2 검증 로직을 사용합니다.

## 운영 상태와 한계

초기 배너는 첨부 원본에서 추출한 캠페인 1장입니다. 6장을 임의 복제하지 않았습니다. 브랜드·상품명·가격은 공유 카탈로그 설정을 따릅니다. 기존 브랜드 설정이 `YOUR LABEL`이면 그대로 표시하며 `BLANK`는 사용하지 않습니다.

기존 사이트는 현재 테스트 상품이며 주문 접수가 중지되어 있습니다. V2의 실제 관리자 저장·업로드·회원·주문 연동 검증에는 Clerk/R2 환경 설정이 필요합니다. 연결되지 않은 상태를 성공으로 표시하지 않습니다. 연결 및 사진 원본의 제약은 CONNECTIONS.md를 확인하세요. 검색엔진 `noindex`는 정식 공개 검토 전까지 유지합니다.
