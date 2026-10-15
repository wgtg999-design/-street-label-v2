# Street Label V2

새 디자인을 받기 전의 독립된 Next.js 배포 기본 프로젝트입니다. 첫 화면에는 **새 홈페이지 준비 중**만 표시합니다. 기존 쇼핑몰과 별도 저장소이며 기존 사이트의 인증·회원·주문 DB·관리자·업로드 저장소는 연결하지 않았습니다.

## Vercel에서 공개하기

1. https://vercel.com/new 를 엽니다.
2. **wgtg999-design / -street-label-v2** 저장소의 **Import**를 누릅니다. 기존 이름이 `-`인 저장소를 고르지 않습니다.
3. **Project Name**: `street-label-v2`
4. **Framework / Application Preset**: `Next.js` — `vercel.json`으로 자동 설정합니다.
5. **Root Directory**: `./` — 하위 폴더를 선택하지 않습니다.
6. **Build and Output Settings**: 기본값 유지. Output Directory는 직접 입력하지 않습니다.
7. **Environment Variables**: 현재는 필요 없습니다. 기존 쇼핑몰의 비밀값을 복사하지 않습니다.
8. **Deploy**를 누르고 **Ready**가 되면 **Visit**를 누릅니다.

이 저장소에는 Next.js 앱 하나만 있으므로 기존 저장소의 `deploy/vercel` 선택이나 다중 Services 가져오기를 사용하지 않습니다. `street-label-v2`라는 Vercel 프로젝트가 이미 있다면 먼저 그 프로젝트의 Git 연결 저장소를 확인하여 중복 생성을 피합니다.

실제 배포 주소는 Vercel이 생성한 뒤 표시합니다. 이름이 겹치면 다른 주소가 붙을 수 있으므로 배포 전 주소를 확정하지 않습니다.

## 개발

- Node.js 22.13 이상
- pnpm 11.25.0
- `pnpm install --frozen-lockfile`
- `pnpm dev` — 기본 포트 3000
- `pnpm run build`
- `pnpm start --port 3902` — 프로덕션 빌드 실행

화면은 `app/page.js`, 공통 스타일은 `app/globals.css`, 문서 기본 설정은 `app/layout.js`를 수정합니다. `.next/`는 빌드 결과입니다.

디자인은 대표님이 별도로 지정한 뒤 구현합니다. 회원가입·주문·결제·관리자 기능이 준비된 사이트로 표시하지 않습니다.
