'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
const copy = {
    ko: { title: '로그아웃', question: '이 기기의 쇼핑몰 로그인 세션을 종료하시겠습니까?', cancel: '취소' },
    'zh-CN': { title: '退出登录', question: '要结束此设备上的商城登录会话吗？', cancel: '取消' },
    'zh-TW': { title: '登出', question: '要結束此裝置上的商城登入工作階段嗎？', cancel: '取消' },
    ja: { title: 'ログアウト', question: 'この端末のショップログインを終了しますか？', cancel: 'キャンセル' },
};
export default function SignOutUI({ next }) {
    const [language, setLanguage] = useState('ko');
    useEffect(() => {
        try {
            const saved = localStorage.getItem('street-label-language');
            if (saved && Object.hasOwn(copy, saved))
                setLanguage(saved);
        }
        catch { /* Optional display preference only. */ }
    }, []);
    useEffect(() => { document.documentElement.lang = language; }, [language]);
    const text = copy[language];
    return _jsxs("main", { style: { maxWidth: 480, margin: '64px auto', padding: 24 }, children: [_jsx("h1", { style: { fontSize: 24, fontWeight: 500 }, children: text.title }), _jsx("p", { style: { lineHeight: 1.7 }, children: text.question }), _jsxs("form", { action: "/auth/sign-out/confirm", method: "post", children: [_jsx("input", { type: "hidden", name: "next", value: next }), _jsx("button", { type: "submit", style: { background: '#111', color: '#fff', border: 0, padding: '12px 20px', cursor: 'pointer' }, children: text.title }), ' ', _jsx("a", { href: next, style: { color: '#111', marginLeft: 16 }, children: text.cancel })] })] });
}
