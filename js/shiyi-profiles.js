const shiyiProfiles = {
  EHLM: {
    code: "EHLM",
    name: "烟火匠心型非遗守护人",
    image: "images/fybi-avatars/base/FYBI_EHLM_v1.png",
    keywords: ["生活感知", "动手体验", "烟火气", "匠心温度"],
    dimensions: {
      EI: "E 外显型",
      HC: "H 亲历型",
      LT: "L 生活型",
      MP: "M 物艺型"
    },
    fitCategories: ["传统技艺", "传统美食", "传统医药", "生活类民俗"],
    recommendedDirections:
      "你适合从饮食、手作、草药、日用器物等贴近日常生活的非遗项目进入非遗世界。",
    participation:
      "适合参与非遗体验活动、制作流程学习、探店式传播、生活化短视频记录和线下体验打卡。",
    report:
      "你是一个容易被真实生活场景打动的人。相比遥远宏大的文化叙事，你更容易在一碗地方小吃、一件手工作品、一味草药或一道传统工序中感受到非遗的温度。你适合用亲身体验的方式理解非遗，也适合把非遗与日常生活连接起来，让更多人发现传统文化并不遥远。"
  },

  EHLP: {
    code: "EHLP",
    name: "民俗热场型非遗守护人",
    image: "images/fybi-avatars/base/FYBI_EHLP_v1.png",
    keywords: ["现场互动", "节庆氛围", "民俗体验", "热情表达"],
    dimensions: {
      EI: "E 外显型",
      HC: "H 亲历型",
      LT: "L 生活型",
      MP: "P 表演型"
    },
    fitCategories: ["民俗", "传统舞蹈", "传统体育游艺", "节庆活动"],
    recommendedDirections:
      "你适合接触节庆民俗、民间活动、传统体育游艺和具有现场互动感的非遗项目。",
    participation:
      "适合参与活动志愿服务、现场讲解、节庆打卡、民俗体验记录和活动氛围传播。",
    report:
      "你天生容易被热闹的现场、人群的互动和地方节庆氛围吸引。对你来说，非遗不是静静躺在展柜里的内容，而是在人们的参与、欢呼、鼓点和仪式中被不断唤醒的生活现场。你适合成为非遗活动中的气氛连接者，让更多人愿意走进现场、参与其中。"
  },

  EHTM: {
    code: "EHTM",
    name: "古法体验型非遗守护人",
    image: "images/fybi-avatars/base/FYBI_EHTM_v1.png",
    keywords: ["古法工艺", "沉浸体验", "传统技艺", "手作探索"],
    dimensions: {
      EI: "E 外显型",
      HC: "H 亲历型",
      LT: "T 传统型",
      MP: "M 物艺型"
    },
    fitCategories: ["传统技艺", "传统美术", "传统医药", "古法制作"],
    recommendedDirections:
      "你适合探索带有历史感、工序感和材料感的传统技艺类非遗项目。",
    participation:
      "适合参与工坊体验、技艺研学、制作流程复原、传统材料观察和实地技艺学习。",
    report:
      "你对古法、材料、工序和传统技艺中的规矩有天然兴趣。你不只是想看成品，更想知道它是怎样一步步被做出来的。你适合通过沉浸式体验进入非遗世界，在亲手尝试中理解传统技艺的难度、耐心和智慧。"
  },

  EHTP: {
    code: "EHTP",
    name: "仪式共鸣型非遗守护人",
    image: "images/fybi-avatars/base/FYBI_EHTP_v1.png",
    keywords: ["仪式感", "现场共鸣", "传统表演", "集体记忆"],
    dimensions: {
      EI: "E 外显型",
      HC: "H 亲历型",
      LT: "T 传统型",
      MP: "P 表演型"
    },
    fitCategories: ["传统戏剧", "传统舞蹈", "民俗仪式", "节庆表演"],
    recommendedDirections:
      "你适合体验具有仪式感、历史感和现场感染力的传统表演类非遗。",
    participation:
      "适合现场观摩、表演体验、节庆活动参与、仪式流程记录和传统演出传播。",
    report:
      "你容易被鼓点、唱腔、队伍、服饰、仪式和集体氛围打动。你对非遗的理解往往来自现场的震撼感和身体参与感。你适合走进传统节庆、戏曲舞台和民俗仪式，在真实场景中感受非遗如何连接地方记忆与共同情感。"
  },

  ECLM: {
    code: "ECLM",
    name: "生活美学型非遗守护人",
    image: "images/fybi-avatars/base/FYBI_ECLM_v1.png",
    keywords: ["生活美学", "内容共创", "手作传播", "视觉表达"],
    dimensions: {
      EI: "E 外显型",
      HC: "C 共创型",
      LT: "L 生活型",
      MP: "M 物艺型"
    },
    fitCategories: ["传统美术", "传统技艺", "非遗文创", "生活类非遗"],
    recommendedDirections:
      "你适合关注能够转化为生活美学、文创设计和视觉内容的非遗项目。",
    participation:
      "适合海报设计、产品拍摄、图文推文、文创策划、生活方式内容传播。",
    report:
      "你擅长发现非遗中好看、好用、好传播的一面。你能把传统手艺和当代审美连接起来，让非遗从旧时光走进年轻人的生活方式。你适合用设计、图文、摄影和内容策划，让非遗变得更亲近、更有美感，也更容易被分享。"
  },

  ECLP: {
    code: "ECLP",
    name: "影像传播型非遗守护人",
    image: "images/fybi-avatars/base/FYBI_ECLP_v1.png",
    keywords: ["短视频", "现场记录", "传播策划", "青年表达"],
    dimensions: {
      EI: "E 外显型",
      HC: "C 共创型",
      LT: "L 生活型",
      MP: "P 表演型"
    },
    fitCategories: ["民俗活动", "节庆表演", "地方生活", "非遗新媒体传播"],
    recommendedDirections:
      "你适合把民俗现场、节庆表演和地方生活类非遗转化为影像传播内容。",
    participation:
      "适合短视频拍摄、活动直播、采访剪辑、社交平台运营和传播栏目策划。",
    report:
      "你对人群、现场、镜头和故事有敏感度。你适合站在传播者的位置，把非遗活动中最有情绪、最有现场感的瞬间记录下来，并转化成年轻人愿意观看和转发的内容。你可能不是台前的表演者，但你能让更多人通过镜头看见非遗。"
  },

  ECTM: {
    code: "ECTM",
    name: "文创策划型非遗守护人",
    image: "images/fybi-avatars/base/FYBI_ECTM_v1.png",
    keywords: ["文创转化", "策展思维", "传统新生", "项目策划"],
    dimensions: {
      EI: "E 外显型",
      HC: "C 共创型",
      LT: "T 传统型",
      MP: "M 物艺型"
    },
    fitCategories: ["传统技艺", "传统美术", "非遗文创", "研学课程"],
    recommendedDirections:
      "你适合关注传统技艺、传统美术和可转化为展览、课程、文创的非遗项目。",
    participation:
      "适合展览策划、文创设计、课程开发、品牌包装、活动方案设计。",
    report:
      "你适合在传统与当代之间搭桥。你关注非遗背后的历史价值，也会思考如何通过策展、文创、课程和活动设计让它重新进入公众视野。你不满足于简单介绍非遗，而是希望为传统文化设计新的表达方式。"
  },

  ECTP: {
    code: "ECTP",
    name: "舞台创意型非遗守护人",
    image: "images/fybi-avatars/base/FYBI_ECTP_v1.png",
    keywords: ["舞台表达", "表演创新", "活动策划", "传统转译"],
    dimensions: {
      EI: "E 外显型",
      HC: "C 共创型",
      LT: "T 传统型",
      MP: "P 表演型"
    },
    fitCategories: ["传统戏剧", "传统舞蹈", "曲艺", "传统音乐", "节庆演出"],
    recommendedDirections:
      "你适合关注可以通过舞台、视频、活动和互动体验重新表达的表演类非遗。",
    participation:
      "适合舞台策划、视频脚本、演出传播、互动活动设计和表演类非遗推广。",
    report:
      "你适合把传统表演类非遗转化成更适合当代传播的形式。你既重视传统的仪式感和审美，也关心它如何通过舞台、镜头、活动和互动体验被重新看见。你是传统表演与青年表达之间的创意转译者。"
  },

  IHLM: {
    code: "IHLM",
    name: "静观手作型非遗守护人",
    image: "images/fybi-avatars/base/FYBI_IHLM_v1.png",
    keywords: ["安静体验", "细节观察", "手作研习", "生活技艺"],
    dimensions: {
      EI: "I 内省型",
      HC: "H 亲历型",
      LT: "L 生活型",
      MP: "M 物艺型"
    },
    fitCategories: ["传统技艺", "传统美术", "传统医药", "生活手作"],
    recommendedDirections:
      "你适合接触需要耐心、细节观察和亲手体验的生活手作类非遗。",
    participation:
      "适合工坊学习、手作体验、步骤记录、材料观察和生活类非遗体验。",
    report:
      "你不一定喜欢热闹表达，但很适合安静地学习一门手艺。你能从一针一线、一器一物、一味一香中感受到非遗的细节。对你来说，非遗的魅力往往藏在手感、材料、过程和日常生活的温度里。"
  },

  IHLP: {
    code: "IHLP",
    name: "民俗观察型非遗守护人",
    image: "images/fybi-avatars/base/FYBI_IHLP_v1.png",
    keywords: ["田野观察", "民俗现场", "地方生活", "细腻记录"],
    dimensions: {
      EI: "I 内省型",
      HC: "H 亲历型",
      LT: "L 生活型",
      MP: "P 表演型"
    },
    fitCategories: ["民俗", "传统舞蹈", "传统体育游艺", "地方节庆"],
    recommendedDirections:
      "你适合进入民俗活动、地方节庆和生活现场，观察非遗如何发生在人群之中。",
    participation:
      "适合民俗采风、田野记录、现场笔记、影像辅助记录和地方生活观察。",
    report:
      "你适合成为民俗现场的观察者。你不一定站在舞台中央，但你会认真观察人们如何参与节庆、仪式和地方生活。你能够在看似热闹的现场中发现秩序、细节与情感，是连接生活现场与文化记录的人。"
  },

  IHTM: {
    code: "IHTM",
    name: "草木寻源型非遗守护人",
    image: "images/fybi-avatars/base/FYBI_IHTM_v1.png",
    keywords: ["草本智慧", "古法寻源", "实地探访", "传统知识"],
    dimensions: {
      EI: "I 内省型",
      HC: "H 亲历型",
      LT: "T 传统型",
      MP: "M 物艺型"
    },
    fitCategories: ["传统医药", "传统技艺", "古法制作", "地方知识"],
    recommendedDirections:
      "你适合探索传统医药、草本文化、古法制作和地方经验类非遗项目。",
    participation:
      "适合实地调研、制作流程记录、草本知识科普、传承人访谈和地方知识整理。",
    report:
      "你适合探索草木、古法、器物和技艺背后的源流。你对自然知识、传统医药、古法制作和地方经验有较强兴趣。你理解非遗的方式不是停留在表面，而是愿意走近材料、流程、传承人和地方环境，追问它们从何而来、如何延续。",
    localRecommendation: "罗浮山百草油"
  },

  IHTP: {
    code: "IHTP",
    name: "礼俗探源型非遗守护人",
    image: "images/fybi-avatars/base/FYBI_IHTP_v1.png",
    keywords: ["仪式研究", "礼俗观察", "传统表演", "文化根脉"],
    dimensions: {
      EI: "I 内省型",
      HC: "H 亲历型",
      LT: "T 传统型",
      MP: "P 表演型"
    },
    fitCategories: ["民俗仪式", "传统戏剧", "传统舞蹈", "民间信仰"],
    recommendedDirections:
      "你适合深入了解仪式、礼俗、传统表演和民间信仰类非遗项目。",
    participation:
      "适合仪式流程记录、传承人口述、地方资料整理、现场调研和礼俗观察。",
    report:
      "你关注仪式和表演背后的文化根源。你适合走进现场，但更在意“为什么这样做”“它从哪里来”“它对当地人意味着什么”。你适合在参与和观察中理解非遗的礼俗结构与精神内核。"
  },

  ICLM: {
    code: "ICLM",
    name: "文脉整理型非遗守护人",
    image: "images/fybi-avatars/base/FYBI_ICLM_v1.png",
    keywords: ["资料整理", "图文写作", "生活档案", "文化梳理"],
    dimensions: {
      EI: "I 内省型",
      HC: "C 共创型",
      LT: "L 生活型",
      MP: "M 物艺型"
    },
    fitCategories: ["传统技艺", "传统美术", "地方生活", "非遗档案"],
    recommendedDirections:
      "你适合整理传统技艺、生活器物、地方饮食和日常非遗背后的文化资料。",
    participation:
      "适合资料整理、推文写作、图文编辑、展板文案、内容归档和项目介绍撰写。",
    report:
      "你适合把分散的非遗材料整理成清晰、有温度、可传播的内容。你能从日常器物和生活技艺中梳理出文化脉络，也能把复杂资料转化为别人读得懂的故事。你是非遗背后的记录者和整理者。"
  },

  ICLP: {
    code: "ICLP",
    name: "声影记录型非遗守护人",
    image: "images/fybi-avatars/base/FYBI_ICLP_v1.png",
    keywords: ["影像记录", "声音采集", "民俗档案", "观察叙事"],
    dimensions: {
      EI: "I 内省型",
      HC: "C 共创型",
      LT: "L 生活型",
      MP: "P 表演型"
    },
    fitCategories: ["民俗活动", "传统音乐", "曲艺", "地方生活记录"],
    recommendedDirections:
      "你适合记录民俗现场、传统音乐、曲艺和地方生活中的声音与影像。",
    participation:
      "适合纪录片拍摄、采访录音、现场摄影、资料归档、短片剪辑和观察叙事。",
    report:
      "你适合成为镜头后面的记录者。你能安静观察现场，并用影像、声音和文字记录非遗在人们生活中的样子。你不急于表达自己，而是擅长让真实的人、声音和场景被留下来。"
  },

  ICTM: {
    code: "ICTM",
    name: "古籍考据型非遗守护人",
    image: "images/fybi-avatars/base/FYBI_ICTM_v1.png",
    keywords: ["文献整理", "历史考据", "古法研究", "知识转译"],
    dimensions: {
      EI: "I 内省型",
      HC: "C 共创型",
      LT: "T 传统型",
      MP: "M 物艺型"
    },
    fitCategories: ["民间文学", "传统医药", "传统技艺", "传统美术"],
    recommendedDirections:
      "你适合研究传统技艺、传统医药、民间文学和器物工艺背后的历史知识。",
    participation:
      "适合文献查找、资料校对、长文写作、知识图谱、研究型内容生产和文化解读。",
    report:
      "你适合做非遗背后的深度研究和知识整理。你更关注传统技艺、医药、器物和文本之间的历史联系。你能够把看似零散的资料组织成系统性的知识，并用更清晰的方式帮助他人理解非遗的来龙去脉。"
  },

  ICTP: {
    code: "ICTP",
    name: "戏韵解码型非遗守护人",
    image: "images/fybi-avatars/base/FYBI_ICTP_v1.png",
    keywords: ["表演研究", "戏曲解读", "传统审美", "文化转译"],
    dimensions: {
      EI: "I 内省型",
      HC: "C 共创型",
      LT: "T 传统型",
      MP: "P 表演型"
    },
    fitCategories: ["传统戏剧", "曲艺", "传统音乐", "传统舞蹈"],
    recommendedDirections:
      "你适合解读戏曲、曲艺、传统音乐和传统舞蹈背后的审美与文化逻辑。",
    participation:
      "适合赏析文案、脚本撰写、影像解说、表演资料整理和传统艺术解读。",
    report:
      "你适合解读传统表演背后的审美、程式和文化逻辑。你可能不一定站上舞台，但你能看见唱腔、身段、节奏、仪式和地方传统之间的关联。你适合成为传统表演类非遗的阐释者和转译者。"
  }
};