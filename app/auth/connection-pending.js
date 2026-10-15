'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
const copy = {
    ko: { title: '로그인은 완료되었습니다.', description: '회원정보 저장소에 일시적으로 연결하지 못했습니다. 로그인 상태는 유지됩니다. 잠시 후 다시 확인해 주세요.', retry: '회원정보 연결 다시 확인', home: '홈페이지로 돌아가기', signout: '로그아웃' },
    'zh-CN': { title: '登录已完成。', description: '暂时无法连接会员信息存储。您的登录状态保持不变，请稍后重试。', retry: '重新连接会员信息', home: '返回首页', signout: '退出登录' },
    'zh-TW': { title: '登入已完成。', description: '暫時無法連線到會員資料儲存空間。登入狀態維持不變，請稍後再試。', retry: '重新連線會員資料', home: '返回首頁', signout: '登出' },
    ja: { title: 'ログインは完了しました。', description: '会員情報の保存先に一時的に接続できません。ログイン状態を保ったまま、しばらくしてから再確認してください。', retry: '会員情報への接続を再確認', home: 'ホームに戻る', signout: 'ログアウト' },
};
/** Only the verified managed-account branch renders this recoverable state.
 * The server still requires a usable DB identity before opening private pages.
 */
export default function AccountConnectionPending({ next }) {
    const [language, setLanguage] = useState('ko');
    useEffect(() => {
        try {
            const saved = localStorage.getItem('street-label-language');
            if (saved && Object.hasOwn(copy, saved))
                setLanguage(saved);
        }
        catch { /* Optional display preference; never identity storage. */ }
    }, []);
    useEffect(() => { document.documentElement.lang = language; }, [language]);
    function selectLanguage(value) {
        if (!Object.hasOwn(copy, value))
            return;
        setLanguage(value);
        try {
            localStorage.setItem('street-label-language', value);
        }
        catch { /* Preference only. */ }
    }
    const text = copy[language];
    const retry = `/auth/sign-in?next=${encodeURIComponent(next)}`;
    const signout = `/auth/sign-out?next=${encodeURIComponent(next)}`;
    return _jsxs("main", { style: { maxWidth: 560, margin: '64px auto', padding: 24 }, children: [_jsxs("select", { "aria-label": "Language", value: language, onChange: event => selectLanguage(event.target.value), style: { padding: 8, marginBottom: 24, border: '1px solid #bbb', borderRadius: 0 }, children: [_jsx("option", { value: "ko", children: "\uD55C\uAD6D\uC5B4" }), _jsx("option", { value: "zh-CN", children: "\u7B80\u4F53\u4E2D\u6587" }), _jsx("option", { value: "zh-TW", children: "\u7E41\u9AD4\u4E2D\u6587" }), _jsx("option", { value: "ja", children: "\u65E5\u672C\u8A9E" })] }), _jsx("h1", { style: { fontSize: 24, fontWeight: 500 }, children: text.title }), _jsx("p", { role: "status", style: { lineHeight: 1.8 }, children: text.description }), _jsx("p", { children: _jsx("a", { href: retry, style: { display: 'inline-block', padding: '12px 16px', background: '#111', color: '#fff', textDecoration: 'none' }, children: text.retry }) }), _jsxs("p", { style: { display: 'flex', gap: 24, flexWrap: 'wrap', lineHeight: 1.8 }, children: [_jsx("a", { href: "/", style: { color: '#111' }, children: text.home }), _jsx("a", { href: signout, style: { color: '#111' }, children: text.signout })] })] });
}
