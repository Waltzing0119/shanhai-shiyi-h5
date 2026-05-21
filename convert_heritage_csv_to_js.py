import csv
import json
from pathlib import Path


CSV_PATH = Path("national-heritage-projects-full.csv")
OUTPUT_PATH = Path("js/national-heritage-projects.js")


def split_semicolon(value):
    if not value:
        return []

    return [
        item.strip()
        for item in str(value).replace("；", ";").split(";")
        if item.strip()
    ]


def parse_number(value, default):
    try:
        return int(float(value))
    except (TypeError, ValueError):
        return default


def parse_manual_vector(value):
    if not value:
        return {}

    result = {}

    parts = str(value).replace("；", ";").replace("，", ",").split(",")

    for part in parts:
        part = part.strip()

        if not part or ":" not in part:
            continue

        key, raw_value = part.split(":", 1)
        key = key.strip().upper()

        try:
            result[key] = int(float(raw_value.strip()))
        except ValueError:
            continue

    return result


def js_string(value):
    return json.dumps(value, ensure_ascii=False)


def make_project_block(row):
    project = {
        "id": row.get("id", "").strip(),
        "name": row.get("name", "").strip(),
        "category": row.get("category", "").strip(),
        "region": row.get("region", "").strip() or "中国",
        "batch": row.get("batch", "").strip() or "待核对",
        "projectCode": row.get("projectCode", "").strip() or "待核对",
        "protectUnits": split_semicolon(row.get("protectUnits", "")),
        "tags": split_semicolon(row.get("tags", "")),
        "popularity": parse_number(row.get("popularity", ""), 70),
        "experienceValue": parse_number(row.get("experienceValue", ""), 60),
        "intro": row.get("intro", "").strip(),
        "detailUrl": row.get("detailUrl", "").strip(),
        "manualVector": parse_manual_vector(row.get("manualVector", "")),
    }

    lines = ["  createNationalHeritageProject({"]

    for key, value in project.items():
        if value in ("", [], {}):
            continue

        lines.append(f"    {key}: {js_string(value)},")

    lines.append("  })")

    return "\n".join(lines)


def main():
    if not CSV_PATH.exists():
        raise FileNotFoundError(f"找不到 CSV 文件：{CSV_PATH}")

    with CSV_PATH.open("r", encoding="utf-8-sig", newline="") as file:
        reader = csv.DictReader(file)
        rows = list(reader)

    valid_rows = [
        row for row in rows
        if row.get("id") and row.get("name") and row.get("category")
    ]

    if not valid_rows:
        raise ValueError("CSV 中没有有效数据。至少需要 id、name、category 三列。")

    project_blocks = ",\n".join(make_project_block(row) for row in valid_rows)

    js_content = f'''const nationalHeritageSourceName = "中国非物质文化遗产网国家级项目名录公开信息整理";

const categoryBaseVector = {{
  "民间文学": {{
    E: 25, I: 75,
    H: 30, C: 70,
    L: 40, T: 60,
    M: 30, P: 70
  }},
  "传统音乐": {{
    E: 65, I: 35,
    H: 45, C: 55,
    L: 45, T: 55,
    M: 10, P: 90
  }},
  "传统舞蹈": {{
    E: 80, I: 20,
    H: 70, C: 30,
    L: 50, T: 50,
    M: 5, P: 95
  }},
  "传统戏剧": {{
    E: 65, I: 35,
    H: 45, C: 55,
    L: 30, T: 70,
    M: 10, P: 90
  }},
  "曲艺": {{
    E: 60, I: 40,
    H: 35, C: 65,
    L: 45, T: 55,
    M: 10, P: 90
  }},
  "传统体育、游艺与杂技": {{
    E: 85, I: 15,
    H: 80, C: 20,
    L: 60, T: 40,
    M: 30, P: 70
  }},
  "传统美术": {{
    E: 35, I: 65,
    H: 45, C: 55,
    L: 55, T: 45,
    M: 90, P: 10
  }},
  "传统技艺": {{
    E: 45, I: 55,
    H: 75, C: 25,
    L: 60, T: 40,
    M: 95, P: 5
  }},
  "传统医药": {{
    E: 25, I: 75,
    H: 60, C: 40,
    L: 35, T: 65,
    M: 95, P: 5
  }},
  "民俗": {{
    E: 75, I: 25,
    H: 65, C: 35,
    L: 70, T: 30,
    M: 35, P: 65
  }}
}};

const keywordAdjustRules = [
  {{
    keywords: ["制", "造", "烧", "织", "绣", "雕", "营造", "制作", "工艺", "技艺"],
    adjust: {{ H: 8, M: 10, P: -6 }}
  }},
  {{
    keywords: ["医", "药", "针灸", "制剂", "炮制", "诊法"],
    adjust: {{ I: 10, T: 8, M: 12, P: -8 }}
  }},
  {{
    keywords: ["歌", "舞", "戏", "曲", "鼓", "音乐", "唱", "弹"],
    adjust: {{ E: 8, P: 12, M: -8 }}
  }},
  {{
    keywords: ["节", "会", "庙会", "灯会", "祭典", "春节", "端午", "清明", "中秋"],
    adjust: {{ E: 10, H: 8, L: 8, P: 6 }}
  }},
  {{
    keywords: ["传说", "史诗", "故事", "古歌", "宝卷"],
    adjust: {{ I: 10, C: 8, T: 8 }}
  }},
  {{
    keywords: ["拳", "武术", "杂技", "棋", "龙舟", "空竹", "摔跤"],
    adjust: {{ E: 10, H: 12, P: 8 }}
  }}
];

const dimensionPairs = [
  ["E", "I"],
  ["H", "C"],
  ["L", "T"],
  ["M", "P"]
];

function clampScore(value) {{
  return Math.max(5, Math.min(95, value));
}}

function normalizePair(vector, left, right) {{
  const total = vector[left] + vector[right];

  if (total <= 0) {{
    vector[left] = 50;
    vector[right] = 50;
    return;
  }}

  const leftScore = Math.round((vector[left] / total) * 100);
  vector[left] = clampScore(leftScore);
  vector[right] = 100 - vector[left];
}}

function normalizeVector(vector) {{
  dimensionPairs.forEach(pair => {{
    normalizePair(vector, pair[0], pair[1]);
  }});

  return vector;
}}

function buildProjectVector(category, name, tags = [], manualVector = {{}}) {{
  const base = categoryBaseVector[category] || {{
    E: 50, I: 50,
    H: 50, C: 50,
    L: 50, T: 50,
    M: 50, P: 50
  }};

  const vector = {{ ...base }};
  const searchText = [name, category, ...tags].join(" ");

  keywordAdjustRules.forEach(rule => {{
    const matched = rule.keywords.some(keyword => searchText.includes(keyword));

    if (!matched) return;

    Object.entries(rule.adjust).forEach(([key, value]) => {{
      vector[key] = clampScore((vector[key] || 50) + value);
    }});
  }});

  Object.entries(manualVector).forEach(([key, value]) => {{
    vector[key] = clampScore(value);
  }});

  return normalizeVector(vector);
}}

function getCodeFromVector(vector) {{
  return [
    vector.E >= vector.I ? "E" : "I",
    vector.H >= vector.C ? "H" : "C",
    vector.L >= vector.T ? "L" : "T",
    vector.M >= vector.P ? "M" : "P"
  ].join("");
}}

function flipCodeChar(code, index) {{
  const pairs = [
    {{ E: "I", I: "E" }},
    {{ H: "C", C: "H" }},
    {{ L: "T", T: "L" }},
    {{ M: "P", P: "M" }}
  ];

  const chars = code.split("");
  chars[index] = pairs[index][chars[index]];
  return chars.join("");
}}

function getFitCodesFromVector(vector) {{
  const primaryCode = getCodeFromVector(vector);
  const closeIndexes = dimensionPairs
    .map((pair, index) => ({{
      index,
      diff: Math.abs(vector[pair[0]] - vector[pair[1]])
    }}))
    .filter(item => item.diff <= 20)
    .sort((a, b) => a.diff - b.diff)
    .slice(0, 2);

  const codes = [primaryCode];

  closeIndexes.forEach(item => {{
    codes.push(flipCodeChar(primaryCode, item.index));
  }});

  return [...new Set(codes)];
}}

function createNationalHeritageProject(config) {{
  const vector = buildProjectVector(
    config.category,
    config.name,
    config.tags || [],
    config.manualVector || {{}}
  );

  return {{
    id: config.id,
    name: config.name,
    level: "国家级",
    category: config.category,
    region: config.region || "中国",
    batch: config.batch || "待核对",
    projectCode: config.projectCode || "待核对",
    protectUnits: config.protectUnits || [],
    vector,
    fitCodes: config.fitCodes || getFitCodesFromVector(vector),
    tags: config.tags || [config.category],
    popularity: config.popularity || 70,
    experienceValue: config.experienceValue || 60,
    intro:
      config.intro ||
      `${{config.name}}是${{config.category}}类国家级非物质文化遗产代表性项目，适合作为拾遗人格测评的推荐项目样本。`,
    detailUrl: config.detailUrl || "",
    source: nationalHeritageSourceName
  }};
}}

const nationalHeritageProjects = [
{project_blocks}
];

const nationalHeritageRecommendConfig = {{
  maxRecommendCount: 3,
  weights: {{
    codeMatch: 0.3,
    vectorSimilarity: 0.4,
    tagMatch: 0.15,
    popularity: 0.1,
    diversity: 0.05
  }},
  diversity: {{
    maxSameCategory: 2,
    preferDifferentRegion: true
  }}
}};
'''

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(js_content, encoding="utf-8")

    print(f"已生成：{OUTPUT_PATH}")
    print(f"有效项目数：{len(valid_rows)}")


if __name__ == "__main__":
    main()