"""교안에 묻는 글꼴. Wanted Sans(한글·본문)는 교안에 실제로 쓰인 글자만 잘라 넣고,
Unbounded(큰 숫자)·JetBrains Mono(코드)는 라틴 파일을 그대로 넣는다.
fontTools 가 없으면 미리 잘라 둔 WantedSans-subset.woff2 를 쓴다."""
import base64
import io
from pathlib import Path

FONTS = Path(__file__).parent / "src" / "fonts"
# 콘텐츠에 없더라도 항상 넣는 글자: ASCII 전부 + 자주 쓰는 기호
ALWAYS = "".join(chr(c) for c in range(32, 127)) + "·…‘’“”°²³μτ→←↔×÷±≥≤≈√∞₂ⁿ∙•※ㆍ–—"


def deck_chars(src: Path) -> str:
    text = "".join(p.read_text(encoding="utf-8") for p in list(src.rglob("*.js")) + [src / "index.html"])
    return "".join(sorted({c for c in text + ALWAYS if ord(c) >= 32}))


def subset_wanted(chars: str) -> bytes:
    """fontTools 로 가변 폰트를 잘라 woff2 로. 실패하면 미리 만든 파일."""
    prebuilt = FONTS / "WantedSans-subset.woff2"
    try:
        from fontTools import subset
        from fontTools.ttLib import TTFont
    except ImportError:
        print("fontTools 없음 → 미리 잘라 둔 글꼴 사용 (새 글자는 시스템 글꼴로 표시)")
        return prebuilt.read_bytes()
    font = TTFont(FONTS / "WantedSansVariable.ttf")
    opts = subset.Options(flavor="woff2", layout_features=["*"], notdef_outline=True)
    sub = subset.Subsetter(opts)
    sub.populate(text=chars)
    sub.subset(font)
    buf = io.BytesIO()
    font.flavor = "woff2"
    font.save(buf)
    data = buf.getvalue()
    prebuilt.write_bytes(data)  # 다음에 fontTools 없이도 쓰도록 갱신
    return data


def face(family: str, data: bytes, weight: str) -> str:
    b64 = base64.b64encode(data).decode()
    return f'@font-face{{font-family:"{family}";font-weight:{weight};font-display:block;src:url(data:font/woff2;base64,{b64}) format("woff2");}}'


def font_css(src: Path) -> str:
    return "\n".join([
        face("Wanted Sans Deck", subset_wanted(deck_chars(src)), "100 900"),
        face("Unbounded Deck", (FONTS / "Unbounded-800.woff2").read_bytes(), "800"),
        face("JetBrains Mono Deck", (FONTS / "JetBrainsMono-400.woff2").read_bytes(), "400"),
        face("JetBrains Mono Deck", (FONTS / "JetBrainsMono-700.woff2").read_bytes(), "700"),
    ])
