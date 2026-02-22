# Julia Studio — Content Contracts

> **Purpose:** Complete JSON schemas for every page, section, and collection.
> **Rule:** Cursor must consume these contracts exactly. No inventing fields. No guessing shapes.
> **Usage:** Reference this file as `@JULIA_STUDIO_CONTENT_CONTRACTS.md` in every Cursor prompt.

---

## Table of Contents

- [Global Settings](#global-settings)
- [Page Contracts](#page-contracts)
  - [Home](#home)
  - [Portfolio Hub](#portfolio-hub)
  - [Services](#services)
  - [Shop Hub](#shop-hub)
  - [About](#about)
  - [Journal Hub](#journal-hub)
  - [Contact](#contact)
  - [Collections Hub](#collections-hub)
  - [Press](#press)
  - [FAQ](#faq)
  - [Testimonials Hub](#testimonials-hub)
- [Collection Contracts](#collection-contracts)
  - [Portfolio Project](#portfolio-project)
  - [Shop Product](#shop-product)
  - [Journal Post](#journal-post)
  - [Design Collection](#design-collection)
  - [Testimonial](#testimonial)
- [Layout Contract Pattern](#layout-contract-pattern)
- [Variant Registry](#variant-registry)

---

## Global Settings

### site.json

```json
{
  "name": "Julia Studio",
  "tagline": "25 Years of Timeless Design",
  "taglineCn": "25年匠心设计",
  "description": "Julia Studio is a premier interior design house creating timeless spaces for homes, offices, and exhibitions.",
  "descriptionCn": "Julia Studio 是一家高端室内设计工作室，为住宅、办公空间及展览打造永恒的设计。",
  "phone": "(XXX) XXX-XXXX",
  "email": "hello@studio-julia.com",
  "address": {
    "street": "XXX Main Street",
    "suite": "Suite XXX",
    "city": "New York",
    "state": "NY",
    "zip": "XXXXX"
  },
  "social": {
    "instagram": "https://instagram.com/juliastudio",
    "pinterest": "https://pinterest.com/juliastudio",
    "wechatId": "JuliaStudioDesign",
    "xiaohongshu": "https://www.xiaohongshu.com/user/juliastudio"
  },
  "stats": {
    "yearsExperience": 25,
    "projectsCompleted": 1000,
    "happyClients": 500
  }
}
```

**Form fields:** All top-level strings as text fields. `address` as field group. `social` as field group. `stats` as number fields.

### header.json

```json
{
  "logo": {
    "text": "Julia Studio",
    "image": "",
    "showText": true,
    "showImage": false
  },
  "navigation": [
    { "label": "Portfolio", "labelCn": "作品集", "href": "/portfolio" },
    { "label": "Services", "labelCn": "服务", "href": "/services" },
    { "label": "Shop", "labelCn": "商店", "href": "/shop" },
    { "label": "Journal", "labelCn": "日志", "href": "/journal" },
    { "label": "About", "labelCn": "关于", "href": "/about" },
    { "label": "Contact", "labelCn": "联系", "href": "/contact" }
  ],
  "ctaButton": {
    "label": "Book Consultation",
    "labelCn": "预约咨询",
    "href": "/contact",
    "style": "gold"
  },
  "showLanguageSwitcher": true,
  "transparentOnHero": true
}
```

**Form fields:** logo as field group with image picker. navigation as editable array. ctaButton as field group. Booleans as toggles.

### footer.json

```json
{
  "tagline": "Creating timeless spaces since 2001.",
  "taglineCn": "自2001年起，创造永恒空间。",
  "columns": [
    {
      "title": "Explore",
      "titleCn": "探索",
      "links": [
        { "label": "Portfolio", "labelCn": "作品集", "href": "/portfolio" },
        { "label": "Services", "labelCn": "服务", "href": "/services" },
        { "label": "Shop", "labelCn": "商店", "href": "/shop" },
        { "label": "Journal", "labelCn": "日志", "href": "/journal" }
      ]
    },
    {
      "title": "Studio",
      "titleCn": "工作室",
      "links": [
        { "label": "About", "labelCn": "关于", "href": "/about" },
        { "label": "Press", "labelCn": "媒体", "href": "/press" },
        { "label": "FAQ", "labelCn": "常见问题", "href": "/faq" },
        { "label": "Contact", "labelCn": "联系", "href": "/contact" }
      ]
    }
  ],
  "socialLinks": {
    "instagram": "https://instagram.com/juliastudio",
    "pinterest": "https://pinterest.com/juliastudio",
    "wechatQrImage": "/media/wechat-qr.png"
  },
  "legal": {
    "copyright": "© 2026 Julia Studio. All rights reserved.",
    "copyrightCn": "© 2026 Julia Studio 版权所有",
    "privacyLabel": "Privacy Policy",
    "privacyHref": "/privacy",
    "termsLabel": "Terms of Service",
    "termsHref": "/terms"
  },
  "newsletter": {
    "enabled": true,
    "headline": "Design inspiration, delivered weekly.",
    "headlineCn": "每周设计灵感，直达您的邮箱。",
    "placeholder": "Your email address",
    "placeholderCn": "您的邮箱地址",
    "buttonLabel": "Subscribe",
    "buttonLabelCn": "订阅"
  }
}
```

### seo.json

```json
{
  "titleTemplate": "%s | Julia Studio — Interior Design",
  "titleTemplateCn": "%s | Julia Studio 室内设计",
  "defaultTitle": "Julia Studio — 25 Years of Timeless Interior Design",
  "defaultTitleCn": "Julia Studio — 25年匠心室内设计",
  "defaultDescription": "Julia Studio creates timeless interior spaces for homes, offices, and exhibitions. 25 years of design excellence, 1,000+ projects completed.",
  "defaultDescriptionCn": "Julia Studio 为住宅、办公空间及展览打造永恒的室内设计。25年设计经验，完成1,000+项目。",
  "ogImage": "/media/og-default.jpg",
  "twitterHandle": "@juliastudio"
}
```

### theme.json

```json
{
  "colors": {
    "primary": "#2C2C2C",
    "primaryLight": "#4A4A4A",
    "primaryDark": "#1A1A1A",
    "secondary": "#C4A265",
    "secondaryLight": "#D4B87A",
    "secondaryDark": "#A88B50",
    "accent": "#8B9D83",
    "accentLight": "#A3B39B",
    "backdropPrimary": "#FAF8F5",
    "backdropSecondary": "#1A1A1A",
    "textPrimary": "#2C2C2C",
    "textSecondary": "#6B6B6B",
    "textOnDark": "#FAF8F5",
    "textOnGold": "#1A1A1A",
    "border": "#E5E2DD",
    "success": "#8B9D83",
    "error": "#C45B5B"
  },
  "fonts": {
    "heading": "Playfair Display",
    "body": "DM Sans",
    "chinese": "Noto Serif SC"
  },
  "borderRadius": {
    "small": "2px",
    "medium": "4px",
    "large": "8px"
  }
}
```

---

## Page Contracts

### Home

**Path:** `pages/home.json`

```json
{
  "hero": {
    "variant": "slideshow",
    "slides": [
      {
        "image": "/media/hero-1.jpg",
        "alt": "Luxury living room designed by Julia Studio",
        "altCn": "Julia Studio 设计的豪华客厅"
      }
    ],
    "logoOverlay": true,
    "tagline": "25 Years of Timeless Design",
    "taglineCn": "25年匠心设计",
    "scrollIndicator": true
  },
  "introduction": {
    "variant": "text-image",
    "headline": "Spaces That Transcend Trends",
    "headlineCn": "超越潮流的空间设计",
    "body": "Julia Studio creates spaces that transcend trends. For 25 years, we've designed homes, offices, and exhibitions that reflect the unique vision of each client.",
    "bodyCn": "Julia Studio 创造超越潮流的空间。25年来，我们为住宅、办公空间和展览设计了体现每位客户独特愿景的空间。",
    "image": "/media/intro-image.jpg",
    "imageAlt": "Julia Studio design philosophy",
    "ctaLabel": "Our Story",
    "ctaLabelCn": "我们的故事",
    "ctaHref": "/about"
  },
  "portfolioPreview": {
    "variant": "grid-featured",
    "headline": "Selected Work",
    "headlineCn": "精选作品",
    "projectSlugs": ["project-1", "project-2", "project-3", "project-4", "project-5", "project-6"],
    "ctaLabel": "View All Projects",
    "ctaLabelCn": "查看全部项目",
    "ctaHref": "/portfolio"
  },
  "servicesOverview": {
    "variant": "three-cards",
    "headline": "What We Do",
    "headlineCn": "我们的服务",
    "services": [
      {
        "icon": "palette",
        "title": "Interior Design",
        "titleCn": "室内设计",
        "description": "From concept to completion — residential, commercial, and exhibition spaces.",
        "descriptionCn": "从概念到完工——住宅、商业和展览空间。",
        "href": "/services"
      },
      {
        "icon": "hammer",
        "title": "Construction & Installation",
        "titleCn": "施工与安装",
        "description": "Precision craftsmanship from our in-house team.",
        "descriptionCn": "我们内部团队的精湛工艺。",
        "href": "/services"
      },
      {
        "icon": "sofa",
        "title": "Furniture & Décor",
        "titleCn": "家具与装饰",
        "description": "Curated pieces at competitive prices, sourced worldwide.",
        "descriptionCn": "精心挑选的全球家具，价格极具竞争力。",
        "href": "/shop"
      }
    ]
  },
  "featuredCollection": {
    "variant": "hero-card",
    "headline": "Featured Collection",
    "headlineCn": "精选系列",
    "collectionSlug": "modern-minimalist",
    "ctaLabel": "Explore Collection",
    "ctaLabelCn": "探索系列"
  },
  "shopPreview": {
    "variant": "product-row",
    "headline": "Shop Julia Studio",
    "headlineCn": "选购 Julia Studio",
    "productSlugs": ["product-1", "product-2", "product-3", "product-4", "product-5", "product-6"],
    "ctaLabel": "Shop All",
    "ctaLabelCn": "查看全部商品",
    "ctaHref": "/shop"
  },
  "journalPreview": {
    "variant": "three-cards",
    "headline": "From the Journal",
    "headlineCn": "设计日志",
    "postCount": 3,
    "ctaLabel": "Read More",
    "ctaLabelCn": "阅读更多",
    "ctaHref": "/journal"
  },
  "aboutTeaser": {
    "variant": "portrait-text",
    "image": "/media/julia-portrait.jpg",
    "imageAlt": "Julia, Founder & Creative Director",
    "headline": "Meet Julia",
    "headlineCn": "认识 Julia",
    "body": "25 years. 1,000+ projects. One vision: timeless design.",
    "bodyCn": "25年。1,000+项目。一个愿景：永恒的设计。",
    "ctaLabel": "Our Story",
    "ctaLabelCn": "我们的故事",
    "ctaHref": "/about"
  },
  "consultationCta": {
    "variant": "full-width-elegant",
    "headline": "Begin Your Design Journey",
    "headlineCn": "开启您的设计之旅",
    "subline": "Book a complimentary consultation to discuss your project.",
    "sublineCn": "预约免费咨询，讨论您的项目。",
    "ctaLabel": "Book Consultation",
    "ctaLabelCn": "预约咨询",
    "ctaHref": "/contact",
    "backgroundImage": "/media/cta-bg.jpg"
  }
}
```

**Layout:** `pages/home.layout.json`

```json
{
  "sections": [
    "hero",
    "introduction",
    "portfolioPreview",
    "servicesOverview",
    "featuredCollection",
    "shopPreview",
    "journalPreview",
    "aboutTeaser",
    "consultationCta"
  ]
}
```

---

### Portfolio Hub

**Path:** `pages/portfolio.json`

```json
{
  "hero": {
    "variant": "minimal-text",
    "headline": "Our Work",
    "headlineCn": "我们的作品",
    "subline": "25 years. 1,000+ projects. Every space tells a story.",
    "sublineCn": "25年。1,000+项目。每个空间都有故事。",
    "backgroundImage": "/media/portfolio-hero.jpg"
  },
  "filters": {
    "categories": [
      { "value": "all", "label": "All", "labelCn": "全部" },
      { "value": "residential", "label": "Residential", "labelCn": "住宅" },
      { "value": "commercial", "label": "Commercial", "labelCn": "商业" },
      { "value": "exhibition", "label": "Exhibition", "labelCn": "展览" },
      { "value": "art-shows", "label": "Art & Shows", "labelCn": "艺术与展示" }
    ],
    "styles": [
      { "value": "all", "label": "All Styles", "labelCn": "全部风格" },
      { "value": "modern", "label": "Modern", "labelCn": "现代" },
      { "value": "transitional", "label": "Transitional", "labelCn": "过渡" },
      { "value": "contemporary", "label": "Contemporary", "labelCn": "当代" },
      { "value": "minimalist", "label": "Minimalist", "labelCn": "极简" },
      { "value": "east-west", "label": "East-West Fusion", "labelCn": "东西融合" },
      { "value": "classic", "label": "Classic", "labelCn": "经典" }
    ]
  },
  "grid": {
    "variant": "masonry",
    "loadMoreLabel": "Load More Projects",
    "loadMoreLabelCn": "加载更多项目",
    "itemsPerPage": 12
  },
  "cta": {
    "variant": "centered",
    "headline": "Inspired? Let's create something extraordinary.",
    "headlineCn": "心动了？让我们一起创造非凡。",
    "ctaLabel": "Book Consultation",
    "ctaLabelCn": "预约咨询",
    "ctaHref": "/contact"
  }
}
```

---

### Services

**Path:** `pages/services.json`

```json
{
  "hero": {
    "variant": "single-image",
    "headline": "Our Services",
    "headlineCn": "我们的服务",
    "subline": "From concept to completion — a seamless design experience.",
    "sublineCn": "从概念到完工——无缝的设计体验。",
    "backgroundImage": "/media/services-hero.jpg"
  },
  "designServices": {
    "variant": "detailed-list",
    "headline": "Design Services",
    "headlineCn": "设计服务",
    "items": [
      {
        "title": "Full-Service Interior Design",
        "titleCn": "全案室内设计",
        "description": "Comprehensive design from initial concept through installation. Space planning, material selection, custom furnishings, and project management — all handled by our team.",
        "descriptionCn": "从初步概念到安装的全面设计。空间规划、材料选择、定制家具和项目管理——全部由我们的团队负责。",
        "image": "/media/service-full.jpg"
      },
      {
        "title": "Virtual Design",
        "titleCn": "线上设计",
        "description": "Remote design consultations with mood boards, space plans, and curated shopping lists — perfect for clients anywhere in the world.",
        "descriptionCn": "远程设计咨询，提供情绪板、空间规划和精选购物清单——适合世界各地的客户。",
        "image": "/media/service-virtual.jpg"
      },
      {
        "title": "Room Refresh",
        "titleCn": "空间焕新",
        "description": "Targeted updates for a single room — new furniture, accessories, and styling to transform your space quickly.",
        "descriptionCn": "针对单个房间的更新——新家具、配饰和造型，快速改变您的空间。",
        "image": "/media/service-refresh.jpg"
      }
    ]
  },
  "constructionServices": {
    "variant": "text-image",
    "headline": "Construction & Installation",
    "headlineCn": "施工与安装",
    "body": "Our in-house construction team ensures design integrity from plan to reality. Custom millwork, cabinetry, renovation management, and furniture assembly — all executed with precision.",
    "bodyCn": "我们的内部施工团队确保设计从图纸到现实的完整性。定制木工、橱柜、翻新管理和家具组装——全部精准执行。",
    "image": "/media/service-construction.jpg",
    "capabilities": [
      { "label": "Custom Millwork & Cabinetry", "labelCn": "定制木工与橱柜" },
      { "label": "Renovation Management", "labelCn": "翻新管理" },
      { "label": "Furniture Assembly & Installation", "labelCn": "家具组装与安装" },
      { "label": "Lighting & Fixture Installation", "labelCn": "灯具安装" }
    ]
  },
  "furnishingServices": {
    "variant": "text-image",
    "headline": "Furniture & Décor",
    "headlineCn": "家具与装饰",
    "body": "Access trade-only suppliers and competitive pricing through our purchasing program. We source furniture, lighting, textiles, and accessories — or shop our curated collection.",
    "bodyCn": "通过我们的采购计划，享受行业独家供应商和极具竞争力的价格。我们采购家具、灯具、纺织品和配饰——或选购我们的精选系列。",
    "image": "/media/service-furnishing.jpg",
    "ctaLabel": "Shop Our Collection",
    "ctaLabelCn": "选购我们的系列",
    "ctaHref": "/shop"
  },
  "process": {
    "variant": "horizontal",
    "headline": "Our Process",
    "headlineCn": "我们的流程",
    "steps": [
      {
        "number": 1,
        "title": "Consultation",
        "titleCn": "咨询",
        "description": "We listen to your vision, understand your lifestyle, and discuss your budget.",
        "descriptionCn": "我们倾听您的愿景，了解您的生活方式，讨论您的预算。"
      },
      {
        "number": 2,
        "title": "Design Concept",
        "titleCn": "设计概念",
        "description": "Mood boards, space plans, and material palettes bring your vision to life.",
        "descriptionCn": "情绪板、空间规划和材料色板让您的愿景成为现实。"
      },
      {
        "number": 3,
        "title": "Development",
        "titleCn": "深化设计",
        "description": "Detailed drawings, specifications, and selections finalized.",
        "descriptionCn": "详细图纸、规格和选材定稿。"
      },
      {
        "number": 4,
        "title": "Procurement",
        "titleCn": "采购",
        "description": "Furniture, materials, and fixtures ordered at competitive prices.",
        "descriptionCn": "家具、材料和灯具以极具竞争力的价格订购。"
      },
      {
        "number": 5,
        "title": "Installation",
        "titleCn": "施工安装",
        "description": "Our construction team brings the design to life with precision.",
        "descriptionCn": "我们的施工团队精准地将设计变为现实。"
      },
      {
        "number": 6,
        "title": "Reveal",
        "titleCn": "揭幕",
        "description": "Your new space — styled, photographed, and ready to enjoy.",
        "descriptionCn": "您的新空间——造型完成、拍摄记录，等待享受。"
      }
    ]
  },
  "specialties": {
    "variant": "icon-grid",
    "headline": "Specialties",
    "headlineCn": "专业领域",
    "items": [
      { "icon": "home", "label": "Residential", "labelCn": "住宅" },
      { "icon": "building", "label": "Commercial & Office", "labelCn": "商业与办公" },
      { "icon": "frame", "label": "Exhibition & Events", "labelCn": "展览与活动" },
      { "icon": "palette", "label": "Art Installations", "labelCn": "艺术装置" },
      { "icon": "store", "label": "Retail & Hospitality", "labelCn": "零售与酒店" },
      { "icon": "armchair", "label": "Custom Furniture", "labelCn": "定制家具" }
    ]
  },
  "cta": {
    "variant": "full-width-elegant",
    "headline": "Every great space starts with a conversation.",
    "headlineCn": "每一个精彩的空间，始于一次对话。",
    "ctaLabel": "Book Your Free Consultation",
    "ctaLabelCn": "预约免费咨询",
    "ctaHref": "/contact",
    "backgroundImage": "/media/services-cta-bg.jpg"
  }
}
```

---

### Shop Hub

**Path:** `pages/shop.json`

```json
{
  "hero": {
    "variant": "minimal-text",
    "headline": "Shop Julia Studio",
    "headlineCn": "选购 Julia Studio",
    "subline": "Furniture and décor curated by Julia — at competitive prices.",
    "sublineCn": "Julia 精心挑选的家具与装饰——价格极具竞争力。"
  },
  "filters": {
    "categories": [
      { "value": "all", "label": "All", "labelCn": "全部" },
      { "value": "furniture", "label": "Furniture", "labelCn": "家具" },
      { "value": "lighting", "label": "Lighting", "labelCn": "灯具" },
      { "value": "textiles", "label": "Textiles", "labelCn": "纺织品" },
      { "value": "art", "label": "Art & Décor", "labelCn": "艺术与装饰" },
      { "value": "accessories", "label": "Accessories", "labelCn": "配饰" }
    ],
    "rooms": [
      { "value": "all", "label": "All Rooms", "labelCn": "全部空间" },
      { "value": "living", "label": "Living Room", "labelCn": "客厅" },
      { "value": "bedroom", "label": "Bedroom", "labelCn": "卧室" },
      { "value": "dining", "label": "Dining", "labelCn": "餐厅" },
      { "value": "office", "label": "Office", "labelCn": "办公室" },
      { "value": "outdoor", "label": "Outdoor", "labelCn": "户外" }
    ]
  },
  "grid": {
    "variant": "grid-4",
    "itemsPerPage": 16,
    "loadMoreLabel": "Load More",
    "loadMoreLabelCn": "加载更多"
  },
  "tradeProgram": {
    "enabled": true,
    "headline": "Trade Program",
    "headlineCn": "设计师采购计划",
    "body": "Interior designers and trade professionals: access exclusive pricing on our full collection.",
    "bodyCn": "室内设计师和行业专业人士：享受我们全系列产品的独家价格。",
    "ctaLabel": "Apply for Trade Pricing",
    "ctaLabelCn": "申请行业价格",
    "ctaHref": "/contact?subject=trade"
  }
}
```

---

### About

**Path:** `pages/about.json`

```json
{
  "hero": {
    "variant": "single-image",
    "headline": "About Julia Studio",
    "headlineCn": "关于 Julia Studio",
    "backgroundImage": "/media/about-hero.jpg"
  },
  "story": {
    "variant": "text-image-alternating",
    "headline": "Our Story",
    "headlineCn": "我们的故事",
    "blocks": [
      {
        "body": "Founded in 2001, Julia Studio began with a simple belief: great design should feel effortless. Over 25 years, Julia has built a practice renowned for creating spaces that are beautiful, functional, and deeply personal.",
        "bodyCn": "Julia Studio 成立于2001年，源于一个简单的信念：优秀的设计应该感觉毫不费力。25年来，Julia 打造了一个以创造美观、实用且极具个性化空间而闻名的设计工作室。",
        "image": "/media/about-story-1.jpg"
      },
      {
        "body": "With over 1,000 projects completed — spanning luxury homes, corporate offices, art exhibitions, and commercial spaces — our team brings depth of experience that few studios can match.",
        "bodyCn": "完成超过1,000个项目——涵盖豪华住宅、企业办公室、艺术展览和商业空间——我们的团队拥有极少数工作室能比拟的丰富经验。",
        "image": "/media/about-story-2.jpg"
      }
    ]
  },
  "philosophy": {
    "variant": "centered-text",
    "headline": "Design Philosophy",
    "headlineCn": "设计理念",
    "body": "We believe that every space has a story waiting to be told. Our approach begins with listening — understanding how you live, work, and dream. From there, we craft environments that honor your vision while introducing elements of surprise and delight.",
    "bodyCn": "我们相信每个空间都有一个等待被讲述的故事。我们的方法从倾听开始——了解您的生活方式、工作方式和梦想。在此基础上，我们打造尊重您愿景的环境，同时融入惊喜与愉悦的元素。"
  },
  "stats": {
    "variant": "quiet-numbers",
    "items": [
      { "value": "25", "label": "Years of Experience", "labelCn": "年设计经验" },
      { "value": "1,000+", "label": "Projects Completed", "labelCn": "个项目完成" },
      { "value": "500+", "label": "Happy Clients", "labelCn": "位满意客户" },
      { "value": "15+", "label": "Design Awards", "labelCn": "项设计奖项" }
    ]
  },
  "team": {
    "variant": "editorial",
    "headline": "The Team",
    "headlineCn": "团队",
    "members": [
      {
        "name": "Julia",
        "title": "Founder & Creative Director",
        "titleCn": "创始人兼创意总监",
        "bio": "With 25 years of design experience spanning residential, commercial, and exhibition spaces, Julia brings an unparalleled eye for creating timeless interiors.",
        "bioCn": "拥有25年跨越住宅、商业和展览空间的设计经验，Julia 拥有创造永恒室内设计的无与伦比的眼光。",
        "image": "/media/team-julia.jpg"
      },
      {
        "name": "Team Member 2",
        "title": "Design Director",
        "titleCn": "设计总监",
        "bio": "",
        "bioCn": "",
        "image": "/media/team-member-2.jpg"
      },
      {
        "name": "Team Member 3",
        "title": "Construction Manager",
        "titleCn": "施工经理",
        "bio": "",
        "bioCn": "",
        "image": "/media/team-member-3.jpg"
      }
    ]
  },
  "timeline": {
    "variant": "horizontal",
    "headline": "25 Years of Design",
    "headlineCn": "25年设计历程",
    "milestones": [
      { "year": "2001", "event": "Julia Studio founded", "eventCn": "Julia Studio 成立" },
      { "year": "2005", "event": "100th project completed", "eventCn": "完成第100个项目" },
      { "year": "2010", "event": "Expanded to commercial design", "eventCn": "拓展至商业设计" },
      { "year": "2015", "event": "First exhibition design", "eventCn": "首个展览设计" },
      { "year": "2018", "event": "500th project milestone", "eventCn": "第500个项目里程碑" },
      { "year": "2022", "event": "Launched furniture collection", "eventCn": "推出家具系列" },
      { "year": "2026", "event": "1,000+ projects and counting", "eventCn": "1,000+项目，持续增长" }
    ]
  },
  "awards": {
    "variant": "logo-grid",
    "headline": "Awards & Press",
    "headlineCn": "奖项与媒体",
    "items": [
      { "name": "Award Name", "logo": "/media/award-1.png", "year": "2024" }
    ]
  },
  "cta": {
    "variant": "centered",
    "headline": "Let's create something beautiful together.",
    "headlineCn": "让我们一起创造美好。",
    "ctaLabel": "Book Consultation",
    "ctaLabelCn": "预约咨询",
    "ctaHref": "/contact"
  }
}
```

---

### Journal Hub

**Path:** `pages/journal.json`

```json
{
  "hero": {
    "variant": "minimal-text",
    "headline": "Journal",
    "headlineCn": "日志",
    "subline": "Design insights, project stories, and inspiration.",
    "sublineCn": "设计见解、项目故事和灵感。"
  },
  "featured": {
    "enabled": true,
    "postSlug": ""
  },
  "filters": {
    "categories": [
      { "value": "all", "label": "All", "labelCn": "全部" },
      { "value": "design-tips", "label": "Design Tips", "labelCn": "设计技巧" },
      { "value": "project-stories", "label": "Project Stories", "labelCn": "项目故事" },
      { "value": "behind-the-scenes", "label": "Behind the Scenes", "labelCn": "幕后花絮" },
      { "value": "video", "label": "Video", "labelCn": "视频" },
      { "value": "trends", "label": "Trends", "labelCn": "趋势" }
    ]
  },
  "grid": {
    "variant": "featured-hero",
    "itemsPerPage": 9,
    "loadMoreLabel": "Load More",
    "loadMoreLabelCn": "加载更多"
  },
  "newsletter": {
    "variant": "inline",
    "headline": "Design inspiration, delivered weekly.",
    "headlineCn": "每周设计灵感，直达邮箱。",
    "placeholder": "Your email address",
    "placeholderCn": "您的邮箱地址",
    "buttonLabel": "Subscribe",
    "buttonLabelCn": "订阅"
  }
}
```

---

### Contact

**Path:** `pages/contact.json`

```json
{
  "hero": {
    "variant": "minimal-text",
    "headline": "Begin Your Design Journey",
    "headlineCn": "开启您的设计之旅",
    "subline": "We'd love to hear about your project.",
    "sublineCn": "我们期待了解您的项目。"
  },
  "form": {
    "fields": {
      "name": { "label": "Full Name", "labelCn": "姓名", "type": "text", "required": true },
      "email": { "label": "Email", "labelCn": "邮箱", "type": "email", "required": true },
      "phone": { "label": "Phone", "labelCn": "电话", "type": "tel", "required": false },
      "projectType": {
        "label": "Project Type",
        "labelCn": "项目类型",
        "type": "select",
        "required": true,
        "options": [
          { "value": "residential", "label": "Residential", "labelCn": "住宅" },
          { "value": "commercial", "label": "Commercial / Office", "labelCn": "商业/办公" },
          { "value": "exhibition", "label": "Exhibition / Event", "labelCn": "展览/活动" },
          { "value": "furniture", "label": "Furniture Only", "labelCn": "仅家具" },
          { "value": "other", "label": "Other", "labelCn": "其他" }
        ]
      },
      "scope": {
        "label": "Project Scope",
        "labelCn": "项目范围",
        "type": "select",
        "required": true,
        "options": [
          { "value": "full-design", "label": "Full-Service Design", "labelCn": "全案设计" },
          { "value": "room-refresh", "label": "Room Refresh", "labelCn": "空间焕新" },
          { "value": "virtual", "label": "Virtual Design", "labelCn": "线上设计" },
          { "value": "consultation", "label": "Consultation Only", "labelCn": "仅咨询" }
        ]
      },
      "budget": {
        "label": "Budget Range",
        "labelCn": "预算范围",
        "type": "select",
        "required": false,
        "options": [
          { "value": "under-25k", "label": "Under $25,000", "labelCn": "$25,000以下" },
          { "value": "25k-75k", "label": "$25,000 – $75,000", "labelCn": "$25,000 – $75,000" },
          { "value": "75k-200k", "label": "$75,000 – $200,000", "labelCn": "$75,000 – $200,000" },
          { "value": "200k-plus", "label": "$200,000+", "labelCn": "$200,000以上" }
        ]
      },
      "location": { "label": "Project Location", "labelCn": "项目地址", "type": "text", "required": false },
      "referral": {
        "label": "How did you hear about us?",
        "labelCn": "您如何得知我们？",
        "type": "select",
        "required": false,
        "options": [
          { "value": "instagram", "label": "Instagram", "labelCn": "Instagram" },
          { "value": "pinterest", "label": "Pinterest", "labelCn": "Pinterest" },
          { "value": "google", "label": "Google Search", "labelCn": "谷歌搜索" },
          { "value": "wechat", "label": "WeChat", "labelCn": "微信" },
          { "value": "referral", "label": "Friend / Referral", "labelCn": "朋友推荐" },
          { "value": "other", "label": "Other", "labelCn": "其他" }
        ]
      },
      "preferredLanguage": {
        "label": "Preferred Language",
        "labelCn": "首选语言",
        "type": "select",
        "required": false,
        "options": [
          { "value": "en", "label": "English", "labelCn": "English" },
          { "value": "zh", "label": "中文", "labelCn": "中文" }
        ]
      },
      "message": { "label": "Tell us about your vision", "labelCn": "告诉我们您的愿景", "type": "textarea", "required": true }
    },
    "submitLabel": "Request Consultation",
    "submitLabelCn": "提交咨询请求",
    "successMessage": "Thank you! We'll be in touch within 24 hours.",
    "successMessageCn": "感谢您！我们将在24小时内联系您。"
  },
  "directContact": {
    "headline": "Or reach us directly",
    "headlineCn": "或直接联系我们",
    "showPhone": true,
    "showEmail": true,
    "showAddress": true,
    "showHours": true,
    "hours": "Monday – Friday, 9AM – 6PM EST",
    "hoursCn": "周一至周五，上午9点 – 下午6点（东部时间）"
  },
  "socialLinks": {
    "headline": "Follow Along",
    "headlineCn": "关注我们",
    "showInstagram": true,
    "showPinterest": true,
    "showWechatQr": true,
    "showXiaohongshu": true
  }
}
```

---

### Collections Hub

**Path:** `pages/collections.json`

```json
{
  "hero": {
    "variant": "minimal-text",
    "headline": "Design Collections",
    "headlineCn": "设计系列",
    "subline": "Curated collections inspired by our favorite design themes.",
    "sublineCn": "以我们最喜爱的设计主题为灵感的精选系列。"
  },
  "grid": {
    "variant": "large-cards",
    "itemsPerPage": 12
  }
}
```

### Press

**Path:** `pages/press.json`

```json
{
  "hero": {
    "variant": "minimal-text",
    "headline": "Press & Awards",
    "headlineCn": "媒体与奖项",
    "subline": "Julia Studio in the press.",
    "sublineCn": "媒体报道中的 Julia Studio。"
  },
  "awards": {
    "headline": "Awards",
    "headlineCn": "奖项",
    "items": [
      { "name": "Award Name", "organization": "Organization", "year": "2024", "logo": "" }
    ]
  },
  "press": {
    "headline": "Featured In",
    "headlineCn": "媒体报道",
    "items": [
      { "publication": "Publication Name", "title": "Article Title", "titleCn": "", "date": "2024-01", "url": "", "logo": "" }
    ]
  }
}
```

### FAQ

**Path:** `pages/faq.json`

```json
{
  "hero": {
    "variant": "minimal-text",
    "headline": "Frequently Asked Questions",
    "headlineCn": "常见问题",
    "subline": "Everything you need to know about working with Julia Studio.",
    "sublineCn": "关于与 Julia Studio 合作，您需要了解的一切。"
  },
  "categories": [
    {
      "name": "Design Process",
      "nameCn": "设计流程",
      "items": [
        {
          "question": "What is the design process like?",
          "questionCn": "设计流程是怎样的？",
          "answer": "Our design process begins with a complimentary consultation where we discuss your vision, lifestyle, and budget. From there, we develop concepts, refine designs, source materials, and manage the entire installation.",
          "answerCn": "我们的设计流程从免费咨询开始，讨论您的愿景、生活方式和预算。然后，我们制定概念、完善设计、采购材料并管理整个安装过程。"
        }
      ]
    },
    {
      "name": "Pricing & Budget",
      "nameCn": "价格与预算",
      "items": [
        {
          "question": "How does pricing work?",
          "questionCn": "如何收费？",
          "answer": "We offer several service tiers to accommodate different budgets. Full-service design fees are typically 10-15% of the overall project budget. We'll provide a detailed estimate after our initial consultation.",
          "answerCn": "我们提供多种服务层级以适应不同预算。全案设计费用通常为项目总预算的10-15%。初次咨询后，我们将提供详细报价。"
        }
      ]
    },
    {
      "name": "Timeline",
      "nameCn": "时间安排",
      "items": []
    },
    {
      "name": "Shop & Products",
      "nameCn": "商店与产品",
      "items": []
    }
  ],
  "cta": {
    "variant": "centered",
    "headline": "Still have questions?",
    "headlineCn": "还有疑问？",
    "ctaLabel": "Contact Us",
    "ctaLabelCn": "联系我们",
    "ctaHref": "/contact"
  }
}
```

### Testimonials Hub

**Path:** `pages/testimonials.json`

```json
{
  "hero": {
    "variant": "minimal-text",
    "headline": "Client Stories",
    "headlineCn": "客户故事",
    "subline": "What our clients say about working with Julia Studio.",
    "sublineCn": "客户对与 Julia Studio 合作的评价。"
  },
  "display": {
    "variant": "masonry-cards",
    "showFilters": true,
    "filterByCategory": true,
    "categories": [
      { "value": "all", "label": "All", "labelCn": "全部" },
      { "value": "residential", "label": "Residential", "labelCn": "住宅" },
      { "value": "commercial", "label": "Commercial", "labelCn": "商业" },
      { "value": "exhibition", "label": "Exhibition", "labelCn": "展览" }
    ]
  },
  "cta": {
    "variant": "centered",
    "headline": "Ready to join them?",
    "headlineCn": "准备好加入他们了吗？",
    "ctaLabel": "Book Consultation",
    "ctaLabelCn": "预约咨询",
    "ctaHref": "/contact"
  }
}
```

---

## Collection Contracts

### Portfolio Project

**Path pattern:** `portfolio/[slug].json`
**Managed by:** Portfolio Editor (dedicated collection editor)

```json
{
  "slug": "the-greenwich-estate",
  "title": "The Greenwich Estate",
  "titleCn": "格林威治庄园",
  "category": "residential",
  "style": "transitional",
  "location": "Greenwich, CT",
  "year": "2024",
  "featured": true,
  "coverImage": "/media/portfolio/greenwich-cover.jpg",
  "coverImageAlt": "The Greenwich Estate living room",
  "coverImageAltCn": "格林威治庄园客厅",
  "overview": {
    "body": "A complete renovation of a 5,000 sq ft estate, blending traditional architecture with contemporary interiors. The client wanted spaces that felt both timeless and lived-in — a home for a growing family that would age gracefully.",
    "bodyCn": "对一座5,000平方英尺庄园的全面翻新，将传统建筑与当代室内设计融为一体。客户希望空间既永恒又有生活气息——一个能够优雅老去的家庭之家。"
  },
  "details": {
    "scope": "Full Home Redesign",
    "scopeCn": "全屋重新设计",
    "duration": "8 months",
    "durationCn": "8个月",
    "rooms": ["Living Room", "Kitchen", "Master Bedroom", "2 Bathrooms", "Study", "Dining Room"],
    "roomsCn": ["客厅", "厨房", "主卧", "2间浴室", "书房", "餐厅"],
    "keyMaterials": ["White oak flooring", "Italian marble", "Custom millwork", "Brass hardware"],
    "keyMaterialsCn": ["白橡木地板", "意大利大理石", "定制木工", "黄铜五金"]
  },
  "gallery": [
    {
      "image": "/media/portfolio/greenwich-1.jpg",
      "alt": "Living room with custom built-ins",
      "altCn": "带定制内嵌柜的客厅",
      "layout": "full"
    },
    {
      "image": "/media/portfolio/greenwich-2.jpg",
      "alt": "Kitchen detail",
      "altCn": "厨房细节",
      "layout": "half"
    },
    {
      "image": "/media/portfolio/greenwich-3.jpg",
      "alt": "Master bedroom",
      "altCn": "主卧",
      "layout": "half"
    }
  ],
  "shopThisLook": ["product-slug-1", "product-slug-2", "product-slug-3"],
  "testimonial": {
    "quote": "Julia understood our vision from the very first meeting. The result exceeded every expectation.",
    "quoteCn": "Julia 从第一次会面就理解了我们的愿景。结果超出了所有期望。",
    "author": "Client Name",
    "project": "The Greenwich Estate"
  },
  "relatedProjects": ["project-slug-1", "project-slug-2", "project-slug-3"],
  "seo": {
    "title": "The Greenwich Estate — Julia Studio",
    "titleCn": "格林威治庄园 — Julia Studio",
    "description": "Complete renovation of a 5,000 sq ft Connecticut estate. Transitional design blending traditional architecture with contemporary interiors.",
    "descriptionCn": "康涅狄格州5,000平方英尺庄园全面翻新。过渡风格设计，融合传统建筑与当代室内设计。"
  }
}
```

### Shop Product

**Path pattern:** `shop-products/[slug].json`
**Managed by:** Shop Products Editor (dedicated collection editor)

```json
{
  "slug": "marin-console-table",
  "title": "Marin Console Table",
  "titleCn": "马林玄关桌",
  "category": "furniture",
  "room": "living",
  "price": 1200,
  "currency": "USD",
  "status": "in-stock",
  "featured": false,
  "images": [
    { "src": "/media/products/marin-console-1.jpg", "alt": "Marin Console Table front view" },
    { "src": "/media/products/marin-console-2.jpg", "alt": "Marin Console Table detail" },
    { "src": "/media/products/marin-console-3.jpg", "alt": "Marin Console Table in room" }
  ],
  "description": "Clean lines meet warm materials in this solid white oak console table. Perfect for entryways, living rooms, or behind a sofa.",
  "descriptionCn": "这款实心白橡木玄关桌将简洁线条与温暖材料完美融合。适用于玄关、客厅或沙发背后。",
  "specifications": {
    "dimensions": "60\"W × 16\"D × 32\"H",
    "material": "Solid white oak, brass hardware",
    "materialCn": "实心白橡木，黄铜五金",
    "finish": "Natural matte",
    "finishCn": "天然哑光",
    "leadTime": "4-6 weeks",
    "leadTimeCn": "4-6周"
  },
  "seenInProjects": ["project-slug-1", "project-slug-2"],
  "relatedProducts": ["product-slug-1", "product-slug-2"],
  "seo": {
    "title": "Marin Console Table — Julia Studio Shop",
    "description": "Solid white oak console table with brass hardware. Clean-lined design perfect for entryways and living rooms."
  }
}
```

### Journal Post

**Path pattern:** `journal/[slug].json`
**Managed by:** Journal Editor (dedicated collection editor)

```json
{
  "slug": "5-rules-for-mixing-patterns",
  "title": "5 Rules for Mixing Patterns Like a Designer",
  "titleCn": "设计师混搭图案的5条法则",
  "type": "article",
  "category": "design-tips",
  "date": "2026-02-15",
  "author": "Julia",
  "featured": false,
  "coverImage": "/media/journal/mixing-patterns-cover.jpg",
  "coverImageAlt": "Patterns in interior design",
  "excerpt": "Pattern mixing is one of the most powerful tools in a designer's arsenal. Here's how to do it with confidence.",
  "excerptCn": "图案混搭是设计师最强大的工具之一。以下是如何自信地运用它。",
  "body": "Full article content in markdown...",
  "bodyCn": "完整文章内容（Markdown格式）...",
  "videoUrl": "",
  "videoDuration": "",
  "tags": ["patterns", "styling", "how-to"],
  "relatedPosts": ["post-slug-1", "post-slug-2"],
  "relatedProducts": ["product-slug-1"],
  "seo": {
    "title": "5 Rules for Mixing Patterns Like a Designer — Julia Studio Journal",
    "description": "Learn the designer rules for mixing patterns in interior design. From scale to color coordination.",
    "keywords": "mixing patterns interior design, pattern mixing rules, interior design tips"
  }
}
```

**Video post variant:**
```json
{
  "type": "video",
  "videoUrl": "https://www.youtube.com/embed/XXXXXXXXX",
  "videoDuration": "8:32"
}
```

### Design Collection

**Path pattern:** `collections/[slug].json`
**Managed by:** Collections Editor (dedicated collection editor)

```json
{
  "slug": "modern-minimalist",
  "title": "Modern Minimalist",
  "titleCn": "现代极简",
  "description": "Clean lines, natural materials, and purposeful spaces. Our Modern Minimalist collection celebrates the beauty of restraint.",
  "descriptionCn": "简洁线条、天然材料和有目的的空间。我们的现代极简系列歌颂克制之美。",
  "coverImage": "/media/collections/modern-minimalist-cover.jpg",
  "moodImages": [
    "/media/collections/modern-min-1.jpg",
    "/media/collections/modern-min-2.jpg",
    "/media/collections/modern-min-3.jpg"
  ],
  "portfolioProjects": ["project-slug-1", "project-slug-2"],
  "shopProducts": ["product-slug-1", "product-slug-2", "product-slug-3"],
  "featured": true
}
```

### Testimonial

**Path:** `testimonials.json` (single file, array of items)
**Managed by:** Testimonials Editor

```json
{
  "items": [
    {
      "id": "testimonial-1",
      "quote": "Julia transformed our home beyond anything we imagined. Her attention to detail and understanding of our lifestyle made the process a joy.",
      "quoteCn": "Julia 将我们的家改造成了超出想象的模样。她对细节的关注和对我们生活方式的理解让整个过程成为一种享受。",
      "author": "Client Name",
      "authorCn": "",
      "title": "Homeowner, Greenwich",
      "titleCn": "格林威治业主",
      "category": "residential",
      "projectSlug": "the-greenwich-estate",
      "rating": 5,
      "featured": true,
      "date": "2024-06"
    }
  ]
}
```

---

## Layout Contract Pattern

Every page has a corresponding `.layout.json` that controls section order:

```json
{
  "sections": ["hero", "story", "philosophy", "stats", "team", "timeline", "awards", "cta"]
}
```

The frontend reads this array and renders sections in order. Reordering in admin → save → frontend updates.

**Pages with layout files:**
- pages/home.layout.json
- pages/portfolio.layout.json
- pages/services.layout.json
- pages/shop.layout.json
- pages/about.layout.json
- pages/journal.layout.json
- pages/contact.layout.json
- pages/collections.layout.json
- pages/press.layout.json
- pages/faq.layout.json
- pages/testimonials.layout.json

---

## Variant Registry

| Section Type | Variant ID | Description |
|-------------|-----------|-------------|
| hero | `slideshow` | Full-screen image slideshow with minimal text overlay |
| hero | `single-image` | Single background image with headline/subline |
| hero | `minimal-text` | Text only on light background, no image |
| hero | `video-bg` | Video background with text overlay |
| introduction | `text-image` | Text left, image right |
| introduction | `image-text` | Image left, text right |
| introduction | `centered` | Centered text, no image |
| portfolioPreview | `grid-featured` | 6-item grid with first item large |
| portfolioPreview | `carousel` | Horizontal scroll carousel |
| portfolioPreview | `masonry` | Masonry layout |
| servicesOverview | `three-cards` | 3 equal cards with icons |
| servicesOverview | `stacked` | Full-width stacked sections |
| shopPreview | `product-row` | Horizontal product card row |
| shopPreview | `grid-3` | 3-column product grid |
| journalPreview | `three-cards` | 3 recent post cards |
| journalPreview | `featured-plus-list` | 1 large featured + list of recent |
| aboutTeaser | `portrait-text` | Portrait image + text block |
| aboutTeaser | `stats-bar` | Key numbers in a horizontal bar |
| consultationCta | `full-width-elegant` | Full-width background image + centered text |
| consultationCta | `split` | Image left, CTA right |
| consultationCta | `centered` | No background image, centered text |
| portfolioGrid | `masonry` | Pinterest-style masonry |
| portfolioGrid | `uniform` | Equal-size cards |
| portfolioGrid | `featured-large` | First item 2x size |
| projectGallery | `alternating` | Full-width and 2-col alternating |
| projectGallery | `lightbox` | Grid with lightbox click-to-expand |
| projectGallery | `filmstrip` | Horizontal scroll strip |
| shopGrid | `grid-4` | 4-column product grid |
| shopGrid | `grid-3` | 3-column product grid |
| shopGrid | `list` | List view with larger images |
| journalGrid | `featured-hero` | Large featured post + grid below |
| journalGrid | `grid` | Uniform card grid |
| journalGrid | `list` | Blog list style |
| process | `horizontal` | Horizontal step bar |
| process | `vertical` | Vertical timeline |
| process | `numbered` | Numbered cards |
| stats | `quiet-numbers` | Elegant, understated number display |
| stats | `large-serif` | Large serif numbers |
| team | `editorial` | Large photos with bio text |
| team | `cards` | Card grid with photos |
| team | `compact` | Small photos, names only |
| timeline | `horizontal` | Horizontal scrolling timeline |
| timeline | `vertical` | Vertical timeline |
| awards | `logo-grid` | Grid of award/press logos |
| awards | `list` | List with details |
| testimonialDisplay | `masonry-cards` | Masonry card layout |
| testimonialDisplay | `carousel` | Rotating testimonial carousel |
| testimonialDisplay | `wall` | Dense wall of quotes |
| designServices | `detailed-list` | Items with images and full descriptions |
| designServices | `cards` | Card layout |
| cta | `centered` | Centered text, no background |
| cta | `full-width-elegant` | Background image + centered text |
| cta | `split` | Image + text side by side |
