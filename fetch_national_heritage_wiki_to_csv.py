"""
fetch_national_heritage_wiki_to_csv.py

方案 B：优先读取本地 HTML 文件 national-heritage-wiki.html。
如果项目根目录没有这个文件，再尝试联网读取维基百科页面。

使用步骤：
  1. 用浏览器打开“国家级非物质文化遗产代表性项目名录”页面。
  2. Ctrl + S 保存网页，保存类型选“网页，仅 HTML”。
  3. 文件命名为 national-heritage-wiki.html，放到项目根目录。
  4. 运行：
       python fetch_national_heritage_wiki_to_csv.py
  5. 成功生成 national-heritage-projects-full.csv 后，再运行：
       python convert_heritage_csv_to_js.py
"""

from __future__ import annotations

import re
import csv
from pathlib import Path

try:
    import pandas as pd
except ImportError as exc:
    raise SystemExit(
        "缺少依赖 pandas。请先运行：python -m pip install pandas lxml"
    ) from exc


LOCAL_HTML = Path("national-heritage-wiki.html")

SOURCE_URL = "https://zh.wikipedia.org/wiki/%E5%9B%BD%E5%AE%B6%E7%BA%A7%E9%9D%9E%E7%89%A9%E8%B4%A8%E6%96%87%E5%8C%96%E9%81%97%E4%BA%A7%E4%BB%A3%E8%A1%A8%E6%80%A7%E9%A1%B9%E7%9B%AE%E5%90%8D%E5%BD%95"

OUTPUT_CSV = Path("national-heritage-projects-full.csv")

CATEGORIES = [
    "民间文学",
    "传统音乐",
    "传统舞蹈",
    "传统戏剧",
    "曲艺",
    "传统体育、游艺与杂技",
    "传统美术",
    "传统技艺",
    "传统医药",
    "民俗",
]

CSV_HEADERS = [
    "id",
    "name",
    "category",
    "region",
    "batch",
    "projectCode",
    "protectUnits",
    "tags",
    "popularity",
    "experienceValue",
    "intro",
    "detailUrl",
    "manualVector",
]

BATCH_MAP = {
    "一": "第一批",
    "二": "第二批",
    "三": "第三批",
    "四": "第四批",
    "五": "第五批",
    "一扩": "第一批扩展项目",
    "二扩": "第二批扩展项目",
    "三扩": "第三批扩展项目",
    "四扩": "第四批扩展项目",
    "五扩": "第五批扩展项目",
}

CATEGORY_EXPERIENCE_VALUE = {
    "民间文学": 58,
    "传统音乐": 70,
    "传统舞蹈": 86,
    "传统戏剧": 75,
    "曲艺": 72,
    "传统体育、游艺与杂技": 84,
    "传统美术": 82,
    "传统技艺": 84,
    "传统医药": 78,
    "民俗": 88,
}

HIGH_POPULARITY_KEYWORDS = [
    "春节", "清明节", "端午节", "中秋节",
    "京剧", "昆曲", "粤剧", "黄梅戏", "豫剧", "越剧",
    "古琴", "剪纸", "太极拳", "少林功夫", "针灸",
    "龙舞", "狮舞", "相声", "皮影戏", "木偶戏",
    "景德镇", "龙泉青瓷", "宣纸", "中医", "蒙古族长调", "侗族大歌",
]

TAG_RULES = [
    (["传说", "故事", "史诗", "神话", "歌", "宝卷", "谚语", "谜语"], ["故事叙事", "地方记忆"]),
    (["歌", "民歌", "鼓", "乐", "琴", "木卡姆", "呼麦"], ["声音艺术", "现场聆听"]),
    (["舞", "秧歌", "龙", "狮", "灯", "鼓"], ["现场表演", "节庆氛围"]),
    (["戏", "剧", "曲", "腔", "调", "皮影", "木偶"], ["舞台表演", "传统审美"]),
    (["相声", "评弹", "大鼓", "快书", "说书"], ["语言艺术", "现场互动"]),
    (["拳", "武术", "杂技", "棋", "龙舟", "空竹"], ["身体体验", "传统游艺"]),
    (["剪纸", "年画", "刺绣", "唐卡", "泥塑", "雕", "画"], ["手工美学", "纹样造型"]),
    (["制", "造", "烧", "织", "绣", "雕", "营造", "酿", "茶", "瓷", "纸"], ["手作技艺", "材料工艺"]),
    (["医", "药", "针灸", "推拿", "正骨", "炮制", "制剂"], ["传统知识", "身体经验"]),
    (["节", "会", "庙会", "祭", "礼俗", "习俗", "灯会"], ["生活传统", "民俗节庆"]),
]


def clean_text(value: object) -> str:
    if value is None:
        return ""

    text = str(value).strip()

    if text.lower() == "nan":
        return ""

    text = re.sub(r"\[[^\]]*\]", "", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def normalize_batch(value: str) -> str:
    value = clean_text(value)
    return BATCH_MAP.get(value, value or "待核对")


def build_tags(category: str, name: str) -> str:
    tags = [category]

    for match in re.findall(r"（([^）]+)）", name):
        parts = re.split(r"[、，,；;]", match)
        tags.extend(part.strip() for part in parts if part.strip())

    for keywords, extra_tags in TAG_RULES:
        if any(keyword in name for keyword in keywords):
            tags.extend(extra_tags)

    unique_tags = []

    for tag in tags:
        tag = clean_text(tag)

        if tag and tag not in unique_tags:
            unique_tags.append(tag)

    return "；".join(unique_tags[:8])


def estimate_popularity(name: str, batch: str) -> int:
    if any(keyword in name for keyword in HIGH_POPULARITY_KEYWORDS):
        return 92

    if "第一批" in batch:
        return 82

    if "第二批" in batch:
        return 78

    if "第三批" in batch:
        return 75

    if "第四批" in batch:
        return 73

    if "第五批" in batch:
        return 72

    if "扩展" in batch:
        return 74

    return 70


def make_intro(name: str, category: str, region: str) -> str:
    if region:
        return f"{name}是{category}类国家级非物质文化遗产代表性项目，申报地区或单位为{region}。"

    return f"{name}是{category}类国家级非物质文化遗产代表性项目，已列入国家级非遗代表性项目名录。"


def read_source_tables() -> list[pd.DataFrame]:
    if LOCAL_HTML.exists():
        print(f"检测到本地 HTML：{LOCAL_HTML}，将从本地文件解析。")

        try:
            return pd.read_html(str(LOCAL_HTML))
        except Exception as exc:
            raise SystemExit(
                "本地 HTML 解析失败。请确认保存的是“网页，仅 HTML”，不是完整网页文件夹里的资源文件。"
            ) from exc

    print("未找到 national-heritage-wiki.html，尝试联网抓取页面。")

    try:
        return pd.read_html(SOURCE_URL)
    except Exception as exc:
        raise SystemExit(
            "联网抓取失败。建议使用方案 B：把网页保存为 national-heritage-wiki.html 后放到项目根目录。"
        ) from exc


def find_project_tables(all_tables: list[pd.DataFrame]) -> list[pd.DataFrame]:
    result = []

    for table in all_tables:
        columns = [clean_text(col) for col in table.columns]
        column_text = "|".join(columns)

        if "项目名称" in column_text and "申报地区或单位" in column_text and "批次" in column_text:
            result.append(table)

    return result


def normalize_table_columns(table: pd.DataFrame) -> pd.DataFrame:
    table = table.copy()
    table.columns = [clean_text(col) for col in table.columns]

    rename_map = {}

    for col in table.columns:
        if "序号" in col:
            rename_map[col] = "序号"
        elif "编号" in col:
            rename_map[col] = "编号"
        elif "项目名称" in col:
            rename_map[col] = "项目名称"
        elif "申报地区" in col or "申报单位" in col or "单位" in col:
            rename_map[col] = "申报地区或单位"
        elif "批次" in col:
            rename_map[col] = "批次"

    table = table.rename(columns=rename_map)

    required = ["项目名称", "申报地区或单位", "批次"]
    missing = [col for col in required if col not in table.columns]

    if missing:
        raise ValueError(f"表格缺少字段：{missing}")

    if "序号" not in table.columns:
        table["序号"] = ""

    if "编号" not in table.columns:
        table["编号"] = ""

    table["序号"] = table["序号"].replace("", pd.NA).ffill().fillna("")
    table["编号"] = table["编号"].replace("", pd.NA).ffill().fillna("")

    return table


def main() -> None:
    all_tables = read_source_tables()
    project_tables = find_project_tables(all_tables)

    if len(project_tables) < 10:
        raise SystemExit(
            f"只找到 {len(project_tables)} 个项目表格，少于预期 10 个。"
            "请确认保存的是“国家级非物质文化遗产代表性项目名录”页面的 HTML。"
        )

    rows = []
    serial = 1

    for category, raw_table in zip(CATEGORIES, project_tables[:10]):
        table = normalize_table_columns(raw_table)

        for _, row in table.iterrows():
            name = clean_text(row.get("项目名称", ""))
            region = clean_text(row.get("申报地区或单位", ""))
            batch = normalize_batch(clean_text(row.get("批次", "")))
            project_code = clean_text(row.get("编号", ""))

            if not name or name == "项目名称":
                continue

            project_id = f"national-{serial:04d}"
            popularity = estimate_popularity(name, batch)
            experience_value = CATEGORY_EXPERIENCE_VALUE.get(category, 70)
            tags = build_tags(category, name)
            intro = make_intro(name, category, region)

            rows.append({
                "id": project_id,
                "name": name,
                "category": category,
                "region": region,
                "batch": batch,
                "projectCode": project_code or "待核对",
                "protectUnits": "",
                "tags": tags,
                "popularity": str(popularity),
                "experienceValue": str(experience_value),
                "intro": intro,
                "detailUrl": "",
                "manualVector": "",
            })

            serial += 1

    with OUTPUT_CSV.open("w", encoding="utf-8-sig", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=CSV_HEADERS)
        writer.writeheader()
        writer.writerows(rows)

    print(f"已生成：{OUTPUT_CSV}")
    print(f"项目条目数：{len(rows)}")
    print("下一步请运行：python convert_heritage_csv_to_js.py")


if __name__ == "__main__":
    main()