#!/usr/bin/env python3
"""src/ 의 CSS·JS 모듈을 index.html 의 자리표시자에 인라인해 단일 HTML 하나를 만든다.
사용: python build.py [출력경로]   (기본: dist/AX교육_교안.html)
순서가 곧 의존 순서다: 네임스페이스 → 유틸 → 사내 정보 → 데모 → 콘텐츠 → 렌더/홈 → 덱(부팅)."""
import base64
import re
import sys
from pathlib import Path

from build_fonts import font_css

SRC = Path(__file__).parent / "src"
CSS = ["base", "home", "layout", "slides", "demos", "ui", "explain", "sim", "learn", "work", "data", "pics"]
JS_CORE_FIRST = ["ns", "util", "ui"]
JS_CORE_LAST = ["theme", "art", "render", "home", "deck"]


def read(p: Path) -> str:
    return p.read_text(encoding="utf-8").rstrip() + "\n"


def bundle_css() -> str:
    return "\n".join(read(SRC / "styles" / f"{n}.css") for n in CSS)


def inline_assets(js: str) -> str:
    """콘텐츠의 'asset:파일명' 을 src/assets/파일명 의 data URI 로 바꾼다 (PNG/JPG/SVG)."""
    def repl(m):
        name = m.group(1)
        p = SRC / "assets" / name
        if not p.exists():
            raise SystemExit(f"asset 없음: {name}")
        mime = {"png": "image/png", "jpg": "image/jpeg", "jpeg": "image/jpeg", "svg": "image/svg+xml", "webp": "image/webp"}[p.suffix[1:].lower()]
        return "data:" + mime + ";base64," + base64.b64encode(p.read_bytes()).decode()
    return re.sub(r"asset:([\w.\-]+)", repl, js)


def bundle_js() -> str:
    parts = [SRC / "core" / f"{n}.js" for n in JS_CORE_FIRST]
    parts += [SRC / "site" / "site.js"]          # 사내 정보: 콘텐츠보다 먼저
    parts += sorted((SRC / "demos").glob("*.js"))
    parts += sorted((SRC / "pics").glob("*.js"))
    parts += sorted((SRC / "content").glob("*.js"))
    parts += [SRC / "core" / f"{n}.js" for n in JS_CORE_LAST]
    out = []
    for p in parts:
        body = read(p)
        if "</script" in body:  # 인라인 스크립트 안전장치
            body = body.replace("</script", "<\\/script")
        out.append(f"// ===== {p.relative_to(SRC)} =====\n{body}")
    return inline_assets("\n".join(out))


def main() -> None:
    out = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).parent / "dist" / "AX교육_교안.html"
    html = read(SRC / "index.html")
    assert "/* @css */" in html and "/* @js */" in html, "index.html 자리표시자가 없습니다"
    html = html.replace("/* @css */", font_css(SRC) + "\n" + bundle_css()).replace("/* @js */", bundle_js())
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(html, encoding="utf-8")
    print(f"{out}  ({out.stat().st_size / 1024:.0f} KB)")


if __name__ == "__main__":
    main()
