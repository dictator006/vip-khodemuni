/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Sparkles,
  Search,
  Coffee,
  Edit2,
  Trash2,
  X,
  RotateCcw,
  Clock,
  Instagram,
  Filter,
  Lock,
  LogIn,
  LogOut,
  Eye,
  EyeOff,
  ShieldCheck,
  PlusCircle,
  Check,
  Users,
  Activity,
  BarChart3,
  Flame,
  Maximize2,
  Globe,
  Wifi,
  Smartphone,
  Copy,
  ExternalLink,
  ShieldAlert,
  Server,
  HelpCircle
} from 'lucide-react';

// تصویر بک‌آپ باکیفیت برداری SVG در صورت قطعی اینترنت بین‌الملل یا مسدود بودن هاست‌های عکس
const FALLBACK_MENU_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%2318181b"/><stop offset="50%" stop-color="%2309090b"/><stop offset="100%" stop-color="%2327272a"/></linearGradient></defs><rect width="600" height="400" fill="url(%23g)"/><circle cx="300" cy="170" r="65" fill="%23eab308" opacity="0.15"/><path d="M280 190c0 14 10 25 20 25s20-11 20-25h-40zm44-22h-48v-8h48v8zm-3 28h-42c-3 0-5-2-5-5v-3h52v3c0 3-2 5-5 5z" fill="%23f59e0b"/><text x="300" y="270" font-family="system-ui, sans-serif" font-size="20" font-weight="bold" fill="%23fef08a" text-anchor="middle">کافه خودمونی VIP</text><text x="300" y="300" font-family="system-ui, sans-serif" font-size="13" fill="%23a1a1aa" text-anchor="middle">سرویس باکیفیت و اختصاصی</text></svg>`;

export type CategoryKey = 
  | 'all'
  | 'hookah-service'
  | 'hookah-flavors'
  | 'hot-coffee'
  | 'hot-non-coffee'
  | 'cold-coffee'
  | 'shakes'
  | 'mocktails-smoothies'
  | 'fresh-juice';

export interface MenuItem {
  id: string;
  name: string;
  category: CategoryKey;
  subCategory?: string;
  price: number;
  tag: 'popular' | 'special' | 'vegan' | 'none';
  image: string;
  desc: string;
  available: boolean;
}

interface AnalyticsData {
  totalVisits: number;
  todayVisits: number;
  lastVisitDate: string;
  itemViews: { [itemId: string]: number };
}

// دیتابیس کامل منو برگرفته دقیق از سه برگ منوی کافه خودمونی
export const khodemuniMenuItems: MenuItem[] = [
  // --- سرویس‌های اختصاصی قلیان (برگ اول: سرویس قلیان کافه خودمونی) ---
  {
    id: 'hk-srv-special',
    name: 'سرویس قلیان ویژه VIP خودمونی',
    category: 'hookah-service',
    subCategory: 'سرویس ویژه VIP',
    price: 320000,
    tag: 'special',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80',
    desc: 'محتویات کامل سرویس ویژه: قلیان با طعم انتخابی + چای اعلا، نبات زعفرانی، سینی میوه تازه، کاسه آجیل اعلا، چیپس ترد، آلوچه ملس، شکلات، ماست موسیر، کیک شکلاتی یا باقلوا',
    available: true,
  },
  {
    id: 'hk-srv-simple',
    name: 'سرویس قلیان ساده سنتی',
    category: 'hookah-service',
    subCategory: 'سرویس ساده',
    price: 210000,
    tag: 'popular',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
    desc: 'محتویات سرویس ساده: قلیان با طعم انتخابی + چای تازه‌دم، نبات، شکلات، چیپس، ماست موسیر، کیک شکلاتی یا باقلوا',
    available: true,
  },
  {
    id: 'srv-tea-tray',
    name: 'سرویس چای و نبات قندپهلو',
    category: 'hookah-service',
    subCategory: 'پذیرایی تخت',
    price: 60000,
    tag: 'popular',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
    desc: 'قوری چای دمی هندی و ایرانی تازه‌دم به همراه شاخه نبات زعفرانی و شکلات',
    available: true,
  },
  {
    id: 'srv-fruit-tray',
    name: 'سینی میوه تازه فصل (سرویس ویژه)',
    category: 'hookah-service',
    subCategory: 'پذیرایی تخت',
    price: 110000,
    tag: 'special',
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80',
    desc: 'اسلایس‌های متنوع میوه‌های تازه و آبدار فصل (سیب، پرتقال، خیار، کیوی، توت‌فرنگی یا هندوانه)',
    available: true,
  },
  {
    id: 'srv-nuts-tray',
    name: 'کاسه آجیل ممتاز ۴ مغز (سرویس ویژه)',
    category: 'hookah-service',
    subCategory: 'پذیرایی تخت',
    price: 130000,
    tag: 'special',
    image: 'https://images.unsplash.com/photo-1536591375315-1b8368903277?auto=format&fit=crop&w=600&q=80',
    desc: 'مغز پسته زعفرانی، بادام درختی شور، فندق بوداده و بادام هندی درجه یک',
    available: true,
  },
  {
    id: 'srv-chips-mast',
    name: 'چیپس ترد و ماست موسیر چکیده',
    category: 'hookah-service',
    subCategory: 'پذیرایی تخت',
    price: 55000,
    tag: 'popular',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80',
    desc: 'چیپس نمکی با ماست موسیر چکیده پرچرب و خوش‌عطر سنتی',
    available: true,
  },
  {
    id: 'srv-alouche',
    name: 'کاسه آلوچه و لواشک ملس (سرویس ویژه)',
    category: 'hookah-service',
    subCategory: 'پذیرایی تخت',
    price: 45000,
    tag: 'none',
    image: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=600&q=80',
    desc: 'آلوچه ترش و ملس جنگلی خوش‌طعم و آبدار ویژه تخت‌های کافه',
    available: true,
  },
  {
    id: 'srv-cake-baklava',
    name: 'کیک شکلاتی داغ یا باقلوای استانبولی',
    category: 'hookah-service',
    subCategory: 'پذیرایی تخت',
    price: 65000,
    tag: 'popular',
    image: 'https://images.unsplash.com/photo-1508737027454-e6454ef45afd?auto=format&fit=crop&w=600&q=80',
    desc: 'یک تکه کیک اسفنجی شکلاتی غلیظ با سس داغ یا باقلوای پسته زعفرانی استانبولی',
    available: true,
  },

  // --- ۲. طعم‌های قلیان فانتزی (عکس سوم) ---
  {
    id: 'hk-flv-khodemuni',
    name: 'قلیان شب‌های خودمونی (طعم اختصاصی)',
    category: 'hookah-flavors',
    subCategory: 'طعم های فانتزی',
    price: 180000,
    tag: 'special',
    image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80',
    desc: 'میکس فوق‌العاده معطر، راز سرآشپز با کام‌دهی فوق‌العاده سنگین و دود ابری بسیار مطبوع',
    available: true,
  },
  {
    id: 'hk-flv-istanbul',
    name: 'قلیان شب‌های استانبول',
    category: 'hookah-flavors',
    subCategory: 'طعم های فانتزی',
    price: 170000,
    tag: 'popular',
    image: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=600&q=80',
    desc: 'طعم لوکس و خنک شرقی با ته‌مزه ادویه‌ای و گلی ملایم با ماندگاری بالا',
    available: true,
  },
  {
    id: 'hk-flv-moscow',
    name: 'قلیان شب‌های مسکو',
    category: 'hookah-flavors',
    subCategory: 'طعم های فانتزی',
    price: 170000,
    tag: 'none',
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80',
    desc: 'حس سرمای یخی قطبی همراه با میوه‌های جنگلی و شیرینی خاص و دود بسیار غلیظ',
    available: true,
  },
  {
    id: 'hk-flv-tiramisu',
    name: 'قلیان تیرامیسو فانتزی',
    category: 'hookah-flavors',
    subCategory: 'طعم های فانتزی',
    price: 175000,
    tag: 'none',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80',
    desc: 'طعم نوستالژیک دسر محبوب ایتالیایی، عطر قهوه، بیسکوییت لیدی فینگر و خامه',
    available: true,
  },
  {
    id: 'hk-flv-ladyclear',
    name: 'قلیان لیدی کلیر',
    category: 'hookah-flavors',
    subCategory: 'طعم های فانتزی',
    price: 170000,
    tag: 'popular',
    image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=600&q=80',
    desc: 'ملایم و زنانه، با عطر میوه‌های استوایی شیرین، یاس سفید و طراوت تمشک تازه',
    available: true,
  },
  {
    id: 'hk-flv-iceberry',
    name: 'قلیان تمشک بستنی یخ',
    category: 'hookah-flavors',
    subCategory: 'طعم های فانتزی',
    price: 165000,
    tag: 'none',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
    desc: 'خنک، تابستانی و جذاب؛ ترکیب بستنی وانیلی، تمشک ترش و شیرین و منتول خنک',
    available: true,
  },
  {
    id: 'hk-flv-dejavu',
    name: 'قلیان دژاوو',
    category: 'hookah-flavors',
    subCategory: 'طعم های فانتزی',
    price: 170000,
    tag: 'none',
    image: 'https://images.unsplash.com/photo-1508737027454-e6454ef45afd?auto=format&fit=crop&w=600&q=80',
    desc: 'طعم فانتزی رازآلود با نت‌های مرکباتی، گیاهی معطر و ته‌مزه کاراملی نرم',
    available: true,
  },

  // --- ۳. طعم‌های قلیان شیری (عکس سوم) ---
  {
    id: 'hk-flv-milk-biscuit',
    name: 'قلیان شیر بیسکوییت',
    category: 'hookah-flavors',
    subCategory: 'طعم شیر',
    price: 160000,
    tag: 'popular',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80',
    desc: 'طعم کرمی، گرم و دلنشین شیر تازه همراه با بیسکویت نوستالژیک مادر با دود ملایم و نرم',
    available: true,
  },
  {
    id: 'hk-flv-milk-mango',
    name: 'قلیان شیر انبه',
    category: 'hookah-flavors',
    subCategory: 'طعم شیر',
    price: 160000,
    tag: 'none',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80',
    desc: 'عطر قوی انبه استوایی پیوند خورده با پایه‌ی مخملی شیر با طعم شیرین و گیرا',
    available: true,
  },
  {
    id: 'hk-flv-milk-coconut',
    name: 'قلیان شیر نارگیل',
    category: 'hookah-flavors',
    subCategory: 'طعم شیر',
    price: 160000,
    tag: 'none',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    desc: 'بافت خامه‌ای پرطرفدار، رایحه روغن نارگیل طبیعی و شیر داغ با گیرایی متوسط',
    available: true,
  },
  {
    id: 'hk-flv-milk-cappuccino',
    name: 'قلیان شیر کاپوچینو',
    category: 'hookah-flavors',
    subCategory: 'طعم شیر',
    price: 165000,
    tag: 'special',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80',
    desc: 'رایحه بی‌نظیر قهوه رست ایتالیایی در کنار شیر غلیظ و کف مخملی',
    available: true,
  },
  {
    id: 'hk-flv-milk-melon',
    name: 'قلیان شیر طالبی',
    category: 'hookah-flavors',
    subCategory: 'طعم شیر',
    price: 160000,
    tag: 'none',
    image: 'https://images.unsplash.com/photo-1598025362874-49480e049c76?auto=format&fit=crop&w=600&q=80',
    desc: 'طعم میوه‌ای تابستانی طالبی مشهدی با خامه شیر با دود یکدست و دلپذیر',
    available: true,
  },

  // --- ۴. طعم‌های قلیان میکس (عکس سوم) ---
  {
    id: 'hk-flv-orange-mint',
    name: 'قلیان پرتقال نعنا',
    category: 'hookah-flavors',
    subCategory: 'طعم های میکس',
    price: 155000,
    tag: 'popular',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80',
    desc: 'کلاسیک‌ترین و پرطرفدارترین میکس؛ تلخی شیرین پوست پرتقال در کنار سوز و طراوت نعنا',
    available: true,
  },
  {
    id: 'hk-flv-lemon-mint',
    name: 'قلیان لیمو نعنا',
    category: 'hookah-flavors',
    subCategory: 'طعم های میکس',
    price: 155000,
    tag: 'popular',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
    desc: 'خنک‌کننده نفس‌گیر، ترشی طبیعی لیمو با تازگی برگ‌های نعنا شیرازی',
    available: true,
  },
  {
    id: 'hk-flv-wine-watermelon',
    name: 'قلیان شراب هندوانه',
    category: 'hookah-flavors',
    subCategory: 'طعم های میکس',
    price: 165000,
    tag: 'special',
    image: 'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?auto=format&fit=crop&w=600&q=80',
    desc: 'عطر گیرای انگور قرمز فرانسوی و شیرینی آبدار هندوانه تابستانی با دود سنگین',
    available: true,
  },
  {
    id: 'hk-flv-peach-orange',
    name: 'قلیان هلو پرتقال / هلو نعنا',
    category: 'hookah-flavors',
    subCategory: 'طعم های میکس',
    price: 155000,
    tag: 'none',
    image: 'https://images.unsplash.com/photo-1595126730719-1d30d075a617?auto=format&fit=crop&w=600&q=80',
    desc: 'میکس میوه‌ای مخملی هلو زعفرانی رسیده همراه با پرتقال یا خنکای نعنا',
    available: true,
  },
  {
    id: 'hk-flv-gum-cinnamon',
    name: 'قلیان آدامس دارچین / آدامس نعنا',
    category: 'hookah-flavors',
    subCategory: 'طعم های میکس',
    price: 155000,
    tag: 'none',
    image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=600&q=80',
    desc: 'عطر گرم دارچین سیلان همراه با بوی ادامسی خاطره‌انگیز و گیرایی پایدار',
    available: true,
  },
  {
    id: 'hk-flv-twoapple-cherry',
    name: 'قلیان دوسیب آلبالو',
    category: 'hookah-flavors',
    subCategory: 'طعم های میکس',
    price: 160000,
    tag: 'popular',
    image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=600&q=80',
    desc: 'تلفیق نوستالژی سنگین دوسیب اصیل با ترشی جذاب آلبالوی تازه',
    available: true,
  },

  // --- ۵. طعم‌های قلیان معمولی (عکس سوم) ---
  {
    id: 'hk-flv-twoapple',
    name: 'قلیان دوسیب اصیل نخل',
    category: 'hookah-flavors',
    subCategory: 'معمولی',
    price: 145000,
    tag: 'popular',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
    desc: 'طعم تاریخی و سنگین دوسیب اصیل با گیرایی بالا، طعم انیسون و سیب قرمز و سبز',
    available: true,
  },
  {
    id: 'hk-flv-blueberry',
    name: 'قلیان بلوبری / سیب یخ',
    category: 'hookah-flavors',
    subCategory: 'معمولی',
    price: 145000,
    tag: 'none',
    image: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=600&q=80',
    desc: 'عطر شیرین بلوبری تازه جنگلی یا طعم ترد و خنک سیب سبز یخچالی',
    available: true,
  },
  {
    id: 'hk-flv-orange-cream',
    name: 'قلیان پرتقال خامه / هلو / انار',
    category: 'hookah-flavors',
    subCategory: 'معمولی',
    price: 145000,
    tag: 'none',
    image: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=600&q=80',
    desc: 'طعم کرمی با بوی دلنشین پرتقال خامه یا انار ساوه و هلو تابستانی',
    available: true,
  },

  // --- ۶. گرم پایه قهوه (عکس دوم) ---
  {
    id: 'coffee-espresso',
    name: 'اسپرسو دوبل / سینگل',
    category: 'hot-coffee',
    subCategory: 'گرم پایه قهوه',
    price: 55000,
    tag: 'popular',
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=600&q=80',
    desc: 'عصاره‌گیری استاندارد ۱۰۰٪ عربیکا با کرمای غلیظ فندقی، اسیدیته شفاف و نت‌های شکلاتی',
    available: true,
  },
  {
    id: 'coffee-americano',
    name: 'امریکانو داغ',
    category: 'hot-coffee',
    subCategory: 'گرم پایه قهوه',
    price: 65000,
    tag: 'none',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    desc: 'شات دوبل اسپرسو تازه ترکیب شده با آب داغ تصفیه شده با طعم کلاسیک و بادی متعادل',
    available: true,
  },
  {
    id: 'coffee-cappuccino',
    name: 'کاپوچینو ایتالیایی',
    category: 'hot-coffee',
    subCategory: 'گرم پایه قهوه',
    price: 80000,
    tag: 'popular',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80',
    desc: 'تعادل یک‌سوم اسپرسو، یک‌سوم شیر بخاردیده و یک‌سوم فوم مخملی متراکم همراه با پودر دارچین یا کاکائو',
    available: true,
  },
  {
    id: 'coffee-latte',
    name: 'کافه لاته با آرت',
    category: 'hot-coffee',
    subCategory: 'گرم پایه قهوه',
    price: 85000,
    tag: 'special',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80',
    desc: 'اسپرسوی آروماتیک غرق در حجم زیادی از شیر بافت‌دار مخملی با طراحی لاته آرت باریستا',
    available: true,
  },
  {
    id: 'coffee-caramel-macchiato',
    name: 'کارامل ماکیاتو',
    category: 'hot-coffee',
    subCategory: 'گرم پایه قهوه',
    price: 90000,
    tag: 'popular',
    image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=600&q=80',
    desc: 'لایه‌های زیبای شیر بخارزده، سیروپ وانیل ماداگاسکار، اسپرسوی تلخ و سس کارامل غلیظ خانگی',
    available: true,
  },
  {
    id: 'coffee-mocha-cream',
    name: 'موکا با خامه',
    category: 'hot-coffee',
    subCategory: 'گرم پایه قهوه',
    price: 95000,
    tag: 'special',
    image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=600&q=80',
    desc: 'اسپرسو، سس شکلات تلخ غلیظ هلندی، شیر داغ و تاپینگ دست‌ودلباز خامه زده‌شده قنادی',
    available: true,
  },
  {
    id: 'coffee-nescafe',
    name: 'نسکافه ویژه داغ',
    category: 'hot-coffee',
    subCategory: 'گرم پایه قهوه',
    price: 65000,
    tag: 'none',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80',
    desc: 'ترکیب قهوه فوری گلد معطر به همراه شیر تازه و شکر قهوه‌ای',
    available: true,
  },

  // --- ۷. گرم بدون قهوه (عکس دوم) ---
  {
    id: 'hot-hotchocolate',
    name: 'هات چاکلت غلیظ',
    category: 'hot-non-coffee',
    subCategory: 'گرم بدون قهوه',
    price: 85000,
    tag: 'popular',
    image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=600&q=80',
    desc: 'شکلات داغ بلژیکی ذوب‌شده با پودر کاکائوی دارک ۷۰ درصد و شیر غلیظ پرچرب',
    available: true,
  },
  {
    id: 'hot-nutchocolate',
    name: 'نات چاکلت فندقی',
    category: 'hot-non-coffee',
    subCategory: 'گرم بدون قهوه',
    price: 95000,
    tag: 'special',
    image: 'https://images.unsplash.com/photo-1517578239113-b03992dcdd25?auto=format&fit=crop&w=600&q=80',
    desc: 'شکلات داغ کرمی با کره فندق برشته، مغز فندق رنده‌شده و پودر دارچین اعلا',
    available: true,
  },
  {
    id: 'hot-masala',
    name: 'چای ماسالا هندی اصل',
    category: 'hot-non-coffee',
    subCategory: 'گرم بدون قهوه',
    price: 75000,
    tag: 'special',
    image: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&w=600&q=80',
    desc: 'دم‌نوش ادویه‌ای سلطنتی با چوب دارچین، دانه هل سبز، میخک، زنجبیل تازه و شیر داغ و عسل',
    available: true,
  },

  // --- ۸. سرد پایه قهوه (عکس دوم) ---
  {
    id: 'cold-iced-americano',
    name: 'آیس امریکانو',
    category: 'cold-coffee',
    subCategory: 'سرد پایه قهوه',
    price: 70000,
    tag: 'none',
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80',
    desc: 'اسپرسوی دابل شات تازه دم کشیده ریخته شده بر روی قطعات شفاف یخ و آب سرد معدنی',
    available: true,
  },
  {
    id: 'cold-iced-latte',
    name: 'آیس لاته',
    category: 'cold-coffee',
    subCategory: 'سرد پایه قهوه',
    price: 85000,
    tag: 'popular',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80',
    desc: 'شیر تازه سرد، یخ مکعبی کریستالی و لایه شگفت‌انگیز شات اسپرسو در بالا',
    available: true,
  },
  {
    id: 'cold-iced-mocha',
    name: 'آیس موکا شکلاتی',
    category: 'cold-coffee',
    subCategory: 'سرد پایه قهوه',
    price: 95000,
    tag: 'none',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80',
    desc: 'سس شکلات دست‌ساز، اسپرسو، شیر خنک، یخ و تاپینگ سس شکلات تیره',
    available: true,
  },
  {
    id: 'cold-affogato',
    name: 'آفوگاتو ایتالیایی',
    category: 'cold-coffee',
    subCategory: 'سرد پایه قهوه',
    price: 90000,
    tag: 'special',
    image: 'https://images.unsplash.com/photo-1594998893017-36147cbcae05?auto=format&fit=crop&w=600&q=80',
    desc: 'تضاد دل‌انگیز حرارت و سرما: یک اسکوپ بزرگ بستنی وانیلی دست‌ساز غرق در شات اسپرسوی داغ',
    available: true,
  },
  {
    id: 'cold-iceland-strawberry',
    name: 'آیس لند توت فرنگی',
    category: 'cold-coffee',
    subCategory: 'سرد پایه قهوه',
    price: 105000,
    tag: 'special',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
    desc: 'خلق شاهکار تابستانی: پوره طبیعی توت فرنگی، شیر ابریشمین، یخ خرد شده و شات قهوه تخصصی',
    available: true,
  },
  {
    id: 'cold-iced-caramel-macchiato',
    name: 'آیس کارامل ماکیاتو',
    category: 'cold-coffee',
    subCategory: 'سرد پایه قهوه',
    price: 95000,
    tag: 'popular',
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80',
    desc: 'ترکیب شیر سرد و کارامل مایع روی یخ، با شات‌های اسپرسوی تلخ شناور',
    available: true,
  },

  // --- ۹. انواع شیک (عکس دوم) ---
  {
    id: 'shake-nutella',
    name: 'شیک نوتلا اصل',
    category: 'shakes',
    subCategory: 'انواع شیک',
    price: 125000,
    tag: 'popular',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
    desc: 'بستنی شکلاتی مرغوب، ۳ قاشق نوتلا خالص ایتالیایی، شیر و مغز فندق خرد شده برشته',
    available: true,
  },
  {
    id: 'shake-peanut',
    name: 'شیک بادام زمینی',
    category: 'shakes',
    subCategory: 'انواع شیک',
    price: 120000,
    tag: 'special',
    image: 'https://images.unsplash.com/photo-1553787499-6f9133860278?auto=format&fit=crop&w=600&q=80',
    desc: 'بستنی وانیلی، کره بادام زمینی ارگانیک پر کرانچ، شیر و خلال بادام زمینی بوداده',
    available: true,
  },
  {
    id: 'shake-strawberry',
    name: 'شیک توت فرنگی طبیعی',
    category: 'shakes',
    subCategory: 'انواع شیک',
    price: 115000,
    tag: 'none',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80',
    desc: 'بستنی توت فرنگی، پوره میوه توت‌فرنگی تازه منجمد شده و سس بری سرخ خانگی',
    available: true,
  },
  {
    id: 'shake-oreo',
    name: 'شیک اورئو کرانچی',
    category: 'shakes',
    subCategory: 'انواع شیک',
    price: 120000,
    tag: 'popular',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80',
    desc: 'بستنی وانیل غلیظ بِلند شده با بیسکویت‌های اورئو واقعی و شکلات چیپسی',
    available: true,
  },
  {
    id: 'shake-lotus',
    name: 'شیک لوتوس بلژیکی',
    category: 'shakes',
    subCategory: 'انواع شیک',
    price: 130000,
    tag: 'special',
    image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=600&q=80',
    desc: 'کرم بیسکویت لوتوس بیسکوف کاراملیزه شده، بستنی اعلا، شیر و کرانچ بیسکویت لوتوس',
    available: true,
  },

  // --- ۱۰. سرد - موکتل و اسموتی (عکس دوم) ---
  {
    id: 'mocktail-lemonade',
    name: 'لیموناد نعنایی تازه',
    category: 'mocktails-smoothies',
    subCategory: 'سرد - موکتل',
    price: 75000,
    tag: 'popular',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
    desc: 'عصاره لیموترش شیرازی تازه چیده شده، سیروپ بار، نعنا تازه کوبیده و آب گازدار سودا',
    available: true,
  },
  {
    id: 'mocktail-mojito',
    name: 'موهیتو دست‌ساز کلاسیک',
    category: 'mocktails-smoothies',
    subCategory: 'سرد - موکتل',
    price: 85000,
    tag: 'popular',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
    desc: 'برگ‌های تازه نعنا، اسلایس‌های لیمو ترش آبدار، شکر قهوه‌ای، یخ پودری و آب گازدار خنک',
    available: true,
  },
  {
    id: 'mocktail-red-mojito',
    name: 'رد موهیتو قرمز',
    category: 'mocktails-smoothies',
    subCategory: 'سرد - موکتل',
    price: 90000,
    tag: 'special',
    image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=600&q=80',
    desc: 'طعم ملس و مهیج: موهیتوی نعنا و لیمو ترکیب شده با سیروپ ردبری، زغال اخته و انار',
    available: true,
  },
  {
    id: 'smoothie-pinacolada',
    name: 'پیناکولادا استوایی',
    category: 'mocktails-smoothies',
    subCategory: 'اسموتی',
    price: 100000,
    tag: 'special',
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80',
    desc: 'آب آناناس طبیعی، شیر نارگیل و پوره یخ خرد شده با طعم جزیره‌ای بهشتی',
    available: true,
  },
  {
    id: 'smoothie-watermelon',
    name: 'اسموتی هندوانه تگری',
    category: 'mocktails-smoothies',
    subCategory: 'اسموتی',
    price: 80000,
    tag: 'none',
    image: 'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?auto=format&fit=crop&w=600&q=80',
    desc: 'پوره خالص هندوانه قرمز شیرین و خنک بدون هسته، پوره یخ و چند قطره لیموترش تازه',
    available: true,
  },
  {
    id: 'smoothie-melon',
    name: 'اسموتی طالبی خنک',
    category: 'mocktails-smoothies',
    subCategory: 'اسموتی',
    price: 80000,
    tag: 'none',
    image: 'https://images.unsplash.com/photo-1598025362874-49480e049c76?auto=format&fit=crop&w=600&q=80',
    desc: 'پوره غلیظ طالبی مشهدی همراه با یخ پودری و شیرینی طبیعی دلپذیر',
    available: true,
  },
  {
    id: 'smoothie-orange-lemon',
    name: 'اسموتی پرتقال لیمو',
    category: 'mocktails-smoothies',
    subCategory: 'اسموتی',
    price: 85000,
    tag: 'none',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80',
    desc: 'انفجار ویتامین C: ترکیب آب پرتقال تازه و آب لیموی ترش با یخ خرد شده',
    available: true,
  },

  // --- ۱۱. انواع نوشیدنی‌های سرد میوه‌ای (عکس اول) ---
  {
    id: 'juice-pineapple',
    name: 'آب آناناس طبیعی',
    category: 'fresh-juice',
    subCategory: 'آبمیوه طبیعی',
    price: 90000,
    tag: 'none',
    image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=600&q=80',
    desc: 'آبگیری تازه از آناناس طبیعی شیرین با پالپ میوه و سرشار از عطر استوایی',
    available: true,
  },
  {
    id: 'juice-pomegranate',
    name: 'آب انار طبیعی تازه',
    category: 'fresh-juice',
    subCategory: 'آبمیوه طبیعی',
    price: 85000,
    tag: 'popular',
    image: 'https://images.unsplash.com/photo-1541345023926-55d6e0853f4b?auto=format&fit=crop&w=600&q=80',
    desc: 'آب انار سرخ یاقوتی ساوه با طعم ملس، طبیعی و بدون افزودنی',
    available: true,
  },
  {
    id: 'juice-mango',
    name: 'آب انبه طبیعی غلیظ',
    category: 'fresh-juice',
    subCategory: 'آبمیوه طبیعی',
    price: 95000,
    tag: 'special',
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80',
    desc: 'نکتار و آب انبه اعلا با بافت مخملی، غلیظ و طعم شیرین گرمسیری',
    available: true,
  },
  {
    id: 'juice-orange',
    name: 'آب پرتقال طبیعی فصل',
    category: 'fresh-juice',
    subCategory: 'آبمیوه طبیعی',
    price: 80000,
    tag: 'popular',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80',
    desc: 'آبگیری فوری در حضور مشتری از پرتقال‌های تازه و آبدار شمال با طعم شیرین و باطراوت',
    available: true,
  },
];

function formatNumber(num: number): string {
  return new Intl.NumberFormat('fa-IR').format(num);
}

// تابع نرمال‌سازی ارقام فارسی و انگلیسی و حذف فواصل برای ورود بدون خطا
function normalizeAuthInput(str: string): string {
  if (!str) return '';
  return str
    .trim()
    .replace(/[۰-۹]/g, (d) => '0123456789'['۰۱۲۳۴۵۶۷۸۹'.indexOf(d)])
    .replace(/[٠-٩]/g, (d) => '0123456789'['٠١٢٣٤٥٦٧٨٩'.indexOf(d)]);
}

// مؤلفه کارت محصول با افکت هایلایت و بولد شدن روی هاور و انیمیشن ظهور تدریجی (Fade-In & Slide-Up)
interface ProductCardProps {
  item: MenuItem;
  index: number;
  isAdmin: boolean;
  onOpenDetail: (item: MenuItem) => void;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ item, index, isAdmin, onOpenDetail, onEdit, onDelete }) => {
  let tagBadge = null;
  if (item.tag === 'special') {
    tagBadge = (
      <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-bold bg-amber-500/20 text-yellow-300 border border-amber-500/40 shadow-sm backdrop-blur-md">
        ویژه ⭐
      </span>
    );
  } else if (item.tag === 'popular') {
    tagBadge = (
      <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm backdrop-blur-md">
        محبوب 🔥
      </span>
    );
  } else if (item.tag === 'vegan') {
    tagBadge = (
      <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm backdrop-blur-md">
        طبیعی 🌱
      </span>
    );
  }

  return (
    <div
      onClick={() => onOpenDetail(item)}
      style={{ animationDelay: `${Math.min(index * 40, 360)}ms` }}
      className="animate-fade-in-up relative rounded-2xl sm:rounded-3xl bg-zinc-900/85 border border-zinc-800/90 p-3 sm:p-5 flex flex-col justify-between overflow-hidden backdrop-blur-xl group cursor-pointer transition-all duration-200 hover:border-yellow-400 hover:bg-zinc-900 hover:shadow-[0_0_25px_rgba(234,179,8,0.25)] hover:scale-[1.01]"
    >
      {/* تصویر متناسب با نمای ۲ ستونی */}
      <div className="relative w-full h-32 sm:h-52 rounded-xl sm:rounded-2xl overflow-hidden mb-3 sm:mb-5 bg-zinc-950/60 shadow-md">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_MENU_IMAGE;
          }}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-75" />

        {/* برچسب ویژگی */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-30 flex flex-col gap-1 items-end">
          {tagBadge}
          {item.subCategory && (
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-900/90 text-amber-300/90 border border-zinc-700/70 backdrop-blur-md">
              {item.subCategory}
            </span>
          )}
        </div>

        {/* آیکون راهنما برای مشاهده کارت محصول */}
        <div className="absolute bottom-2 left-2 z-30 p-1.5 rounded-lg bg-zinc-900/80 text-zinc-400 group-hover:text-yellow-400 backdrop-blur-md transition">
          <Maximize2 className="w-3.5 h-3.5" />
        </div>

        {/* دکمه‌های کنترل سریع فقط برای ادمین لاگین شده */}
        {isAdmin && (
          <div
            className="absolute top-2 left-2 sm:top-3 sm:left-3 z-30 flex gap-1 opacity-90 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => onEdit(item)}
              title="ویرایش محصول"
              className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-zinc-900/95 hover:bg-zinc-800 text-yellow-400 border border-zinc-700 shadow-lg cursor-pointer transition-transform hover:scale-110 active:scale-95"
            >
              <Edit2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              title="حذف محصول"
              className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-zinc-900/95 hover:bg-rose-900/90 text-rose-400 border border-zinc-700 shadow-lg cursor-pointer transition-transform hover:scale-110 active:scale-95"
            >
              <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
          </div>
        )}

        {!item.available && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm z-20 flex items-center justify-center">
            <span className="px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 text-[10px] sm:text-xs font-bold border border-zinc-600">
              اتمام موجودی
            </span>
          </div>
        )}
      </div>

      {/* لایه متن: روی هاور بدون حرکت سه‌بعدی بولد و طلایی می‌شود */}
      <div className="flex-1">
        <h3 className="text-xs sm:text-base font-bold text-white transition-all duration-200 group-hover:font-black group-hover:text-yellow-400 line-clamp-1 sm:line-clamp-none mb-1">
          {item.name}
        </h3>
        <p className="text-[11px] sm:text-xs text-zinc-400 group-hover:text-zinc-200 line-clamp-1 sm:line-clamp-2 leading-relaxed mb-3 font-normal transition-colors">
          {item.desc}
        </p>
      </div>

      {/* بخش قیمت شفاف و لوکس */}
      <div className="pt-2 sm:pt-4 border-t border-zinc-800/80 group-hover:border-yellow-500/40 flex items-center justify-between mt-auto transition-colors">
        <div className="w-full flex items-center justify-between">
          <span className="text-[10px] sm:text-xs text-zinc-400 group-hover:text-zinc-300 font-medium transition-colors">قیمت:</span>
          <span className="text-xs sm:text-base font-bold group-hover:font-black text-amber-400 tracking-tight transition-all">
            {formatNumber(item.price)}{' '}
            <span className="text-[10px] sm:text-xs text-zinc-300 font-normal">ت</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [items, setItems] = useState<MenuItem[]>(() => {
    try {
      const stored = localStorage.getItem('khodemuni_menu_items_v5');
      return stored ? JSON.parse(stored) : khodemuniMenuItems;
    } catch {
      return khodemuniMenuItems;
    }
  });

  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all');
  const [subFilter, setSubFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // پاپ‌آپ مشاهده جزئیات محصول
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);

  // مودال راهنمای باز شدن با آی‌پی و اینترنت ایران (بدون نیاز به فیلترشکن)
  const [isIranGuideOpen, setIsIranGuideOpen] = useState<boolean>(false);
  const [iranGuideTab, setIranGuideTab] = useState<'dns' | 'router' | 'domain'>('dns');
  const [copiedKey, setCopiedKey] = useState<string>('');

  const copyToClipboard = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  // سیستم آمار بازدید واقعی سایت و آیتم‌ها (بدون ارقام فیک یا ساختگی)
  const [analytics, setAnalytics] = useState<AnalyticsData>(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    try {
      const stored = localStorage.getItem('khodemuni_real_analytics_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        const isSameDay = parsed.lastVisitDate === todayStr;
        return {
          totalVisits: Number(parsed.totalVisits) || 1,
          todayVisits: isSameDay ? Number(parsed.todayVisits) || 1 : 1,
          lastVisitDate: todayStr,
          itemViews: parsed.itemViews || {},
        };
      }
    } catch {}
    return {
      totalVisits: 1,
      todayVisits: 1,
      lastVisitDate: todayStr,
      itemViews: {},
    };
  });

  // ثبت بازدید واقعی جلسه کاربر (Session Tracking)
  useEffect(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const hasCountedSession = sessionStorage.getItem('khodemuni_session_counted');
    if (!hasCountedSession) {
      sessionStorage.setItem('khodemuni_session_counted', 'true');
      setAnalytics((prev) => {
        const isSameDay = prev.lastVisitDate === todayStr;
        const updated: AnalyticsData = {
          ...prev,
          totalVisits: prev.totalVisits + 1,
          todayVisits: isSameDay ? prev.todayVisits + 1 : 1,
          lastVisitDate: todayStr,
        };
        try {
          localStorage.setItem('khodemuni_real_analytics_v1', JSON.stringify(updated));
        } catch {}
        return updated;
      });
    }
  }, []);

  // ثبت بازدید اختصاصی محصول در هنگام باز شدن کارت پاپ‌آپ
  const handleOpenDetail = (item: MenuItem) => {
    setSelectedProduct(item);
    setAnalytics((prev) => {
      const currentViews = prev.itemViews[item.id] || 0;
      const updated: AnalyticsData = {
        ...prev,
        itemViews: {
          ...prev.itemViews,
          [item.id]: currentViews + 1,
        },
      };
      try {
        localStorage.setItem('khodemuni_real_analytics_v1', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // صفر کردن آمار واقعی توسط ادمین در صورت نیاز
  const handleResetAnalytics = () => {
    if (confirm('آیا از ریست و صفر کردن آمار واقعی بازدیدهای سایت مطمئن هستید؟')) {
      const todayStr = new Date().toISOString().slice(0, 10);
      const resetData: AnalyticsData = {
        totalVisits: 1,
        todayVisits: 1,
        lastVisitDate: todayStr,
        itemViews: {},
      };
      setAnalytics(resetData);
      try {
        localStorage.setItem('khodemuni_real_analytics_v1', JSON.stringify(resetData));
      } catch {}
    }
  };

  // احراز هویت ادمین (نیازمند وارد کردن نام کاربری و رمز عبور برای هر بار ورود)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [loginUsername, setLoginUsername] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');

  // فرم مدیریت آیتم
  const [editItemId, setEditItemId] = useState<string>('');
  const [formName, setFormName] = useState<string>('');
  const [formCategory, setFormCategory] = useState<CategoryKey>('hookah-service');
  const [formSubCategory, setFormSubCategory] = useState<string>('');
  const [formPrice, setFormPrice] = useState<string>('');
  const [formImage, setFormImage] = useState<string>('');
  const [formTag, setFormTag] = useState<'popular' | 'special' | 'vegan' | 'none'>('popular');
  const [formDesc, setFormDesc] = useState<string>('');

  const adminSectionRef = useRef<HTMLDivElement>(null);

  // ذخیره در LocalStorage با هر تغییر
  useEffect(() => {
    try {
      localStorage.setItem('khodemuni_menu_items_v5', JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }, [items]);

  // دسته‌بندی‌ها
  const categoriesList: { key: CategoryKey; label: string }[] = [
    { key: 'all', label: 'همه آیتم‌ها' },
    { key: 'hookah-service', label: '🫖 سرویس قلیان' },
    { key: 'hookah-flavors', label: '💨 طعم‌های قلیان' },
    { key: 'hot-coffee', label: '☕ گرم پایه قهوه' },
    { key: 'hot-non-coffee', label: '🍫 گرم بدون قهوه' },
    { key: 'cold-coffee', label: '🧊 سرد پایه قهوه' },
    { key: 'shakes', label: '🥤 انواع شیک' },
    { key: 'mocktails-smoothies', label: '🍹 موکتل و اسموتی' },
    { key: 'fresh-juice', label: '🍊 آبمیوه طبیعی' },
  ];

  // ساب‌کتگوری‌های پویا
  const availableSubCategories = useMemo(() => {
    if (activeCategory === 'hookah-flavors') {
      return ['all', 'طعم های فانتزی', 'طعم شیر', 'طعم های میکس', 'معمولی'];
    }
    if (activeCategory === 'hookah-service') {
      return ['all', 'سرویس VIP', 'سرویس ساده'];
    }
    return [];
  }, [activeCategory]);

  // فیلتر کردن آیتم‌ها
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesSub =
        subFilter === 'all' ||
        !availableSubCategories.length ||
        item.subCategory === subFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        (item.subCategory && item.subCategory.toLowerCase().includes(q));
      return matchesCategory && matchesSub && matchesSearch;
    });
  }, [items, activeCategory, subFilter, availableSubCategories, searchQuery]);

  // پربازدیدترین آیتم در آمار واقعی (بر اساس کلیک و باز شدن کارت توسط مشتریان)
  const mostViewedItem = useMemo(() => {
    let topId = '';
    let maxViews = 0;
    for (const [id, count] of Object.entries(analytics.itemViews)) {
      if (count > maxViews) {
        maxViews = count;
        topId = id;
      }
    }
    if (topId && maxViews > 0) {
      const found = items.find((i) => i.id === topId);
      if (found) return { item: found, views: maxViews };
    }
    return null;
  }, [analytics, items]);

  // لاگین به پنل مدیریت با پشتیبانی کامل از ارقام فارسی و انگلیسی و عدم حساسیت به بزرگی/کوچکی حروف
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = normalizeAuthInput(loginUsername).toLowerCase();
    const cleanPass = normalizeAuthInput(loginPassword);

    const isUserValid = cleanUser === 'abolfazl1234';
    const isPassValid =
      cleanPass === 'Abolfazl@1234' ||
      cleanPass === 'abolfazl@1234' ||
      cleanPass.toLowerCase() === 'abolfazl@1234';

    if (isUserValid && isPassValid) {
      setIsAdminAuthenticated(true);
      setLoginError('');
      setLoginPassword('');
    } else {
      setLoginError('نام کاربری یا رمز عبور اشتباه است! لطفاً مجدداً بررسی فرمایید.');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    handleResetForm();
  };

  const handleResetForm = () => {
    setEditItemId('');
    setFormName('');
    setFormCategory('hookah-service');
    setFormSubCategory('');
    setFormPrice('');
    setFormImage('');
    setFormTag('popular');
    setFormDesc('');
  };

  const handleStartEdit = (item: MenuItem) => {
    setEditItemId(item.id);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormSubCategory(item.subCategory || '');
    setFormPrice(item.price.toString());
    setFormImage(item.image);
    setFormTag(item.tag);
    setFormDesc(item.desc);
    if (adminSectionRef.current) {
      adminSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('آیا از حذف این آیتم از منو مطمئن هستید؟')) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPrice) return;

    const numericPrice = parseFloat(formPrice) || 0;

    if (editItemId) {
      setItems((prev) =>
        prev.map((it) =>
          it.id === editItemId
            ? {
                ...it,
                name: formName.trim(),
                category: formCategory,
                subCategory: formSubCategory.trim() || undefined,
                price: numericPrice,
                image: formImage.trim() || 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80',
                tag: formTag,
                desc: formDesc.trim(),
              }
            : it
        )
      );
    } else {
      const newItem: MenuItem = {
        id: Date.now().toString(),
        name: formName.trim(),
        category: formCategory,
        subCategory: formSubCategory.trim() || undefined,
        price: numericPrice,
        image: formImage.trim() || 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80',
        tag: formTag,
        desc: formDesc.trim(),
        available: true,
      };
      setItems((prev) => [newItem, ...prev]);
    }

    handleResetForm();
  };

  const handleResetToDefault = () => {
    if (confirm('آیا مایلید تمام آیتم‌ها دقیقاً به منوی اصلی بازگردانده شوند؟')) {
      setItems(khodemuniMenuItems);
      localStorage.setItem('khodemuni_menu_items_v5', JSON.stringify(khodemuniMenuItems));
    }
  };

  return (
    <div className="text-zinc-200 min-h-screen relative selection:bg-yellow-500 selection:text-black">
      {/* پس‌زمینه آمبیانت با اورب‌های نورانی ۳ بعدی */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] animate-orb" />
        <div
          className="absolute top-1/2 -left-32 w-80 h-80 bg-yellow-600/10 rounded-full blur-[130px] animate-orb"
          style={{ animationDelay: '-4s' }}
        />
        <div
          className="absolute -bottom-32 right-1/3 w-96 h-96 bg-amber-700/10 rounded-full blur-[150px] animate-orb"
          style={{ animationDelay: '-2s' }}
        />
        {/* پترن شبکه فضایی متالیک */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:28px_28px] opacity-70" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* بنر اطلاع‌رسانی تخت کافه و دکمه اتصال با اینترنت ایران */}
        <div className="mb-4 sm:mb-6 p-2.5 sm:p-3 px-3.5 sm:px-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 backdrop-blur-md flex flex-wrap items-center justify-between gap-2.5 text-xs sm:text-sm text-amber-200/90 shadow-md">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0 animate-pulse" />
            <span className="text-[11px] sm:text-xs">
              <strong>توجه میهمانان گرامی:</strong> پنجشنبه و جمعه تایم استفاده از تخت ۱ ساعت می‌باشد.
            </span>
          </div>
          <div className="flex items-center gap-2 mr-auto sm:mr-0">
            <button
              type="button"
              onClick={() => setIsIranGuideOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition text-[11px] sm:text-xs font-semibold cursor-pointer shadow-sm hover:scale-[1.02] active:scale-95"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>باز شدن با اینترنت ایران 🇮🇷</span>
            </button>
            <a
              href="https://instagram.com/cafe_vip_khodemuni"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-yellow-400 border border-yellow-500/30 transition text-[11px] sm:text-xs font-semibold"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span dir="ltr">@cafe_vip_khodemuni</span>
            </a>
          </div>
        </div>

        {/* نوار هدر برندینگ ۳ بعدی (کاملاً تمیز بدون دکمه‌های بارکد یا پنل) */}
        <header className="flex items-center justify-between gap-4 mb-6 sm:mb-8 p-4 sm:p-6 rounded-3xl bg-zinc-900/60 backdrop-blur-2xl border border-zinc-800/80 shadow-2xl">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* لوگوی سه‌بعدی لوکس کافه خودمونی */}
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-yellow-300 via-amber-500 to-yellow-800 p-[1.5px] shadow-3d-glow shrink-0">
              <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-amber-100 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
                  کافه و کافی‌شاپ خودمونی
                </h1>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-md bg-yellow-500/20 text-yellow-400 border border-yellow-500/40">
                  VIP
                </span>
              </div>
              <p className="text-[11px] sm:text-sm text-zinc-400 flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                سرویس سنتی قلیان، بار سرد و گرم، شیک، ماکتل و اسموتی
              </p>
            </div>
          </div>
        </header>

        {/* نوار جستجو و فیلتر دسته‌بندی‌ها */}
        <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجوی طعم، قلیان، شیک یا قهوه..."
                className="w-full bg-zinc-900/80 border border-zinc-800/80 rounded-2xl pr-10 pl-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:border-yellow-500 focus:shadow-3d-glow outline-none backdrop-blur-md transition-all text-white placeholder-zinc-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* نشان تعداد کل آیتم‌ها */}
            <div className="text-[11px] sm:text-xs text-zinc-400 flex items-center gap-1.5 self-start sm:self-center mr-auto">
              <span>نمایش:</span>
              <span className="font-bold text-amber-400 bg-zinc-900 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-xl border border-zinc-800">
                {formatNumber(filteredItems.length)} محصول
              </span>
            </div>
          </div>

          {/* تب‌های دسته‌بندی مطابق عکس‌های ۳ گانه */}
          <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 no-scrollbar">
            {categoriesList.map((cat) => (
              <button
                key={cat.key}
                onClick={() => {
                  setActiveCategory(cat.key);
                  setSubFilter('all');
                }}
                className={`cat-btn px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl text-[11px] sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeCategory === cat.key
                    ? 'bg-amber-500/20 text-yellow-300 border border-yellow-500/50 font-bold shadow-3d-glow'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* ساب فیلتر برای طعم‌های قلیان */}
          {availableSubCategories.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 animate-in fade-in no-scrollbar">
              <span className="text-[11px] sm:text-xs text-zinc-500 flex items-center gap-1 shrink-0">
                <Filter className="w-3.5 h-3.5" /> نوع:
              </span>
              {availableSubCategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSubFilter(sub)}
                  className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                    subFilter === sub
                      ? 'bg-amber-500 text-black font-bold'
                      : 'bg-zinc-800/80 text-zinc-400 hover:text-white'
                  }`}
                >
                  {sub === 'all' ? 'همه طعم‌ها' : sub}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* کارت و تابلوی اختصاصی سرویس قلیان کافه خودمونی (عیناً برگرفته از برگه اول منو) */}
        {(activeCategory === 'all' || activeCategory === 'hookah-service') && !searchQuery && (
          <div className="mb-8 p-5 sm:p-7 rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-900 border-2 border-amber-500/40 shadow-card-deep relative overflow-hidden backdrop-blur-xl animate-in fade-in">
            {/* پترن تذهیب سنتی ظریف در پس‌زمینه */}
            <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

            {/* عنوان زرین مشابه سربرگ عکس */}
            <div className="relative z-10 text-center mb-6">
              <div className="inline-block px-6 py-2 rounded-2xl bg-zinc-950 border border-amber-500/50 shadow-3d-glow">
                <span className="text-xs sm:text-sm text-amber-400 font-bold ml-2">سرویس قلیان</span>
                <span className="text-lg sm:text-2xl font-black bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                  کافه خودمونی
                </span>
              </div>
            </div>

            {/* جدول تفکیکی دو ستونی: سرویس ساده و سرویس ویژه */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 relative z-10 mb-6">
              {/* ستون سرویس ساده */}
              <div
                onClick={() => {
                  const simpleItem = items.find((i) => i.id === 'hk-srv-simple');
                  if (simpleItem) handleOpenDetail(simpleItem);
                }}
                className="p-4 sm:p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-amber-500/40 transition cursor-pointer group"
              >
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
                  <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    سرویس ساده
                  </h3>
                  <span className="text-xs text-amber-400/90 font-black">۲۱۰,۰۰۰ تومان</span>
                </div>
                <ul className="grid grid-cols-2 gap-2 text-xs text-zinc-300">
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> چای قندپهلو</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> شاخه نبات</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> شکلات پذیرایی</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> چیپس ترد</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> ماست موسیر</li>
                  <li className="flex items-center gap-1.5 col-span-2"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> کیک شکلاتی یا باقلوا</li>
                </ul>
              </div>

              {/* ستون سرویس ویژه VIP */}
              <div
                onClick={() => {
                  const specialItem = items.find((i) => i.id === 'hk-srv-special');
                  if (specialItem) handleOpenDetail(specialItem);
                }}
                className="p-4 sm:p-5 rounded-2xl bg-zinc-900/90 border-2 border-amber-500/60 shadow-3d-glow hover:border-yellow-400 transition cursor-pointer group relative"
              >
                <div className="absolute -top-2.5 left-4 px-2.5 py-0.5 rounded-full bg-amber-500 text-zinc-950 text-[10px] font-black uppercase">
                  پیشنهاد ویژه VIP
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
                  <h3 className="text-base font-black text-yellow-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                    سرویس ویژه VIP
                  </h3>
                  <span className="text-xs text-amber-300 font-black">۳۲۰,۰۰۰ تومان</span>
                </div>
                <ul className="grid grid-cols-2 gap-2 text-xs text-zinc-200">
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-yellow-400 shrink-0" /> چای دمی اعلا</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-yellow-400 shrink-0" /> نبات زعفرانی</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-yellow-400 shrink-0" /> سینی میوه تازه فصل</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-yellow-400 shrink-0" /> کاسه آجیل ممتاز</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-yellow-400 shrink-0" /> چیپس و ماست موسیر</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-yellow-400 shrink-0" /> آلوچه ملس</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-yellow-400 shrink-0" /> شکلات پذیرایی</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-yellow-400 shrink-0" /> کیک شکلاتی یا باقلوا</li>
                </ul>
              </div>
            </div>

            {/* بخش انواع نوشیدنی‌های گرم و سرد (عیناً مطابق متن پایین عکس) */}
            <div className="relative z-10 pt-4 border-t border-zinc-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 flex items-center gap-2">
                <span className="font-bold text-amber-400 shrink-0">🍹 انواع نوشیدنی‌های سرد:</span>
                <span className="text-zinc-300 text-[11px] sm:text-xs">
                  آب آناناس – آب انار – آب انبه – آب پرتقال
                </span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 flex items-center gap-2">
                <span className="font-bold text-amber-400 shrink-0">☕ انواع نوشیدنی‌های گرم:</span>
                <span className="text-zinc-300 text-[11px] sm:text-xs">
                  شکلات داغ – کاپوچینو – نسکافه – قهوه
                </span>
              </div>
            </div>

            {/* پی‌نوشت زمان استفاده از تخت و اینستاگرام */}
            <div className="relative z-10 mt-4 flex flex-wrap items-center justify-between text-[11px] text-amber-200/80 pt-3 border-t border-zinc-800/60">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>پنجشنبه و جمعه تایم استفاده از تخت یک ساعت می‌باشد.</span>
              </div>
              <span dir="ltr" className="font-bold text-yellow-400">@cafe_vip_khodemuni</span>
            </div>
          </div>
        )}

        {/* شبکه محصولات: دو ستونی در موبایل و سه ستونی در تبلت/دسکتاپ با انیمیشن ملایم fade-in و slide-up */}
        <div
          key={`${activeCategory}-${subFilter}-${searchQuery}`}
          className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 mb-20"
        >
          {filteredItems.map((item, idx) => (
            <ProductCard
              key={item.id}
              item={item}
              index={idx}
              isAdmin={isAdminAuthenticated}
              onOpenDetail={handleOpenDetail}
              onEdit={handleStartEdit}
              onDelete={handleDeleteItem}
            />
          ))}
        </div>

        {/* وضعیت خالی بودن سرچ */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16 animate-in fade-in mb-20">
            <Coffee className="w-12 h-12 sm:w-16 sm:h-16 text-zinc-600 mx-auto mb-3 animate-bounce" />
            <h3 className="text-base sm:text-lg font-bold text-zinc-400">محصولی با این مشخصات یافت نشد!</h3>
            <p className="text-xs sm:text-sm text-zinc-600 mt-1">عنوان جستجو یا دسته‌بندی را تغییر دهید.</p>
          </div>
        )}

        {/* ======================================================== */}
        {/* پنل مدیریت در انتهای صفحه همراه با آمار واقعی بازدیدها */}
        {/* ======================================================== */}
        <div
          ref={adminSectionRef}
          id="admin-management-section"
          className="mt-20 pt-10 border-t border-zinc-800/80"
        >
          {!isAdminAuthenticated ? (
            /* فرم ورود به بخش مدیریت در انتهای صفحه */
            <div className="max-w-md mx-auto p-6 sm:p-8 rounded-3xl bg-zinc-900/90 border border-yellow-500/30 backdrop-blur-xl shadow-card-deep">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 shadow-3d-glow">
                <Lock className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-black text-center text-white mb-2">ورود به پنل مدیریت کافه خودمونی</h2>
              <p className="text-xs text-center text-zinc-400 mb-6 leading-relaxed">
                جهت دسترسی به آمار زنده بازدیدها و ویرایش منوی کافه وارد شوید.
              </p>

              {loginError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold text-center animate-in shake">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5 font-medium">نام کاربری (Username)</label>
                  <input
                    type="text"
                    required
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder=""
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm focus:border-yellow-500 outline-none text-white transition text-left"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5 font-medium">رمز عبور (Password)</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm focus:border-yellow-500 outline-none text-white transition text-left pl-10"
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-gold-3d w-full py-3 rounded-2xl text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>ورود به پنل مدیریت</span>
                </button>
              </form>
            </div>
          ) : (
            /* پنل مدیریت کامل با آمار بازدید زنده و بارکد میز */
            <div className="p-5 sm:p-8 rounded-3xl bg-zinc-900/90 border border-yellow-500/40 backdrop-blur-xl shadow-card-deep animate-in fade-in duration-300">
              
              {/* نوار سربرگ پنل مدیریت */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b border-zinc-800 gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-yellow-400">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      پنل مدیریت کافه خودمونی
                      <span className="text-xs font-normal text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                        Abolfazl
                      </span>
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      آمار آنلاین و واقعی بازدیدها و مدیریت آیتم‌های منو
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => setIsIranGuideOpen(true)}
                    title="راهنمای باز شدن با اینترنت ایران، تنظیم مودم کافه و اتصال دامنه"
                    className="px-3 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-xs text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Globe className="w-3.5 h-3.5 text-emerald-400" />
                    <span>رفع تحریم ایران 🇮🇷</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleResetAnalytics}
                    title="صفر کردن آمار بازدیدهای سایت"
                    className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-yellow-400" />
                    <span>ریست آمار</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleResetToDefault}
                    title="بازگردانی به منوی اولیه تصاویر ارسالی"
                    className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                    <span>بازنشانی پیش‌فرض</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleAdminLogout}
                    className="px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/50 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>خروج</span>
                  </button>
                </div>
              </div>

              {/* داشبورد آمار بازدید سایت (Visitor Analytics) */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-yellow-400" />
                  <h4 className="text-sm font-bold text-white">آمار زنده بازدید سایت و محصولات</h4>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {/* کارت ۱: کل بازدیدها */}
                  <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
                      <span>کل بازدیدها</span>
                      <Users className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-white">
                      {formatNumber(analytics.totalVisits)}
                    </div>
                    <span className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      شمارش واقعی جلسات
                    </span>
                  </div>

                  {/* کارت ۲: بازدیدهای امروز */}
                  <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
                      <span>بازدید امروز</span>
                      <Activity className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-emerald-400">
                      {formatNumber(analytics.todayVisits)}
                    </div>
                    <span className="text-[10px] text-zinc-500 mt-1">
                      تاریخ: {analytics.lastVisitDate}
                    </span>
                  </div>

                  {/* کارت ۳: پربازدیدترین محصول */}
                  <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 flex flex-col justify-between col-span-2 sm:col-span-1">
                    <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
                      <span>محبوب‌ترین آیتم</span>
                      <Flame className="w-4 h-4 text-rose-400" />
                    </div>
                    <div className="text-sm font-bold text-amber-300 truncate">
                      {mostViewedItem ? mostViewedItem.item.name : 'هنوز بازدیدی ثبت نشده'}
                    </div>
                    <span className="text-[10px] text-zinc-400 mt-1">
                      {mostViewedItem
                        ? `${formatNumber(mostViewedItem.views)} بار مشاهده در پاپ‌آپ`
                        : 'با کلیک روی کارت‌ها ثبت می‌شود'}
                    </span>
                  </div>

                  {/* کارت ۴: کل آیتم‌های منو */}
                  <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
                      <span>آیتم‌های منو</span>
                      <Coffee className="w-4 h-4 text-yellow-400" />
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-yellow-400">
                      {formatNumber(items.length)}
                    </div>
                    <span className="text-[10px] text-zinc-500 mt-1">محصول فعال در دسته‌بندی‌ها</span>
                  </div>
                </div>
              </div>

              {/* فرم افزودن و ویرایش آیتم منو */}
              <div className="border-t border-zinc-800 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <PlusCircle className="w-5 h-5 text-yellow-400" />
                  <h4 className="text-sm font-bold text-white">
                    {editItemId ? 'ویرایش اطلاعات آیتم انتخابی' : 'افزودن آیتم جدید به منوی کافه'}
                  </h4>
                </div>

                <form onSubmit={handleSaveItem} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">نام محصول / طعم قلیان</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="مثال: قلیان شب‌های خودمونی"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm focus:border-yellow-500 outline-none text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">دسته‌بندی اصلی</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as any)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm focus:border-yellow-500 outline-none text-white"
                    >
                      <option value="hookah-service">سرویس قلیان و تخت</option>
                      <option value="hookah-flavors">طعم‌های قلیان</option>
                      <option value="hot-coffee">گرم پایه قهوه</option>
                      <option value="hot-non-coffee">گرم بدون قهوه</option>
                      <option value="cold-coffee">سرد پایه قهوه</option>
                      <option value="shakes">انواع شیک</option>
                      <option value="mocktails-smoothies">موکتل و اسموتی</option>
                      <option value="fresh-juice">آبمیوه طبیعی</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">زیردسته / نوع طعم</label>
                    <input
                      type="text"
                      value={formSubCategory}
                      onChange={(e) => setFormSubCategory(e.target.value)}
                      placeholder="مثال: طعم شیر، طعم های فانتزی، VIP"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm focus:border-yellow-500 outline-none text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">قیمت (تومان)</label>
                    <input
                      type="number"
                      required
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      placeholder="مثال: 180000"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm focus:border-yellow-500 outline-none text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-zinc-400 mb-1">آدرس عکس آیتم (URL)</label>
                    <input
                      type="url"
                      required
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm focus:border-yellow-500 outline-none text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">برچسب ویژگی</label>
                    <select
                      value={formTag}
                      onChange={(e) => setFormTag(e.target.value as any)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm focus:border-yellow-500 outline-none text-white"
                    >
                      <option value="popular">محبوب‌ترین 🔥</option>
                      <option value="special">پیشنهاد باریستا / سرآشپز ⭐</option>
                      <option value="vegan">ارگانیک و طبیعی 🌱</option>
                      <option value="none">بدون نشان</option>
                    </select>
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-xs text-zinc-400 mb-1">ترکیبات و توضیحات</label>
                    <input
                      type="text"
                      required
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      placeholder="مثال: چای، نبات، میوه، آجیل، چیپس، ماست موسیر، کیک..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm focus:border-yellow-500 outline-none text-white"
                    />
                  </div>
                  <div className="sm:col-span-3 flex justify-end gap-3 mt-2">
                    {editItemId && (
                      <button
                        type="button"
                        onClick={handleResetForm}
                        className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-sm text-zinc-300 transition cursor-pointer"
                      >
                        لغو ویرایش
                      </button>
                    )}
                    <button
                      type="submit"
                      className="btn-gold-3d px-6 py-2.5 rounded-xl text-zinc-950 font-bold text-sm cursor-pointer flex items-center gap-1.5"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>{editItemId ? 'ذخیره تغییرات آیتم' : 'افزودن به منو'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* فوتر مینیمال */}
        <footer className="mt-16 text-center text-xs text-zinc-500 border-t border-zinc-900 pt-8 pb-6">
          <p>© تمامی حقوق برای کافه و کافی‌شاپ خودمونی محفوظ است.</p>
        </footer>
      </div>

      {/* ======================================================== */}
      {/* پاپ‌آپ مشاهده مشخصات کامل محصول در صورت کلیک کاربر */}
      {/* ======================================================== */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-zinc-900 border border-yellow-500/40 rounded-3xl p-5 sm:p-7 max-w-lg w-full relative shadow-card-deep animate-in zoom-in-95 duration-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* دکمه بستن پاپ‌آپ */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 left-4 z-20 p-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700 shadow-md transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* تصویر بزرگ محصول با انعکاس نور */}
            <div className="relative w-full h-60 sm:h-72 rounded-2xl overflow-hidden mb-5 bg-zinc-950 shadow-2xl">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                decoding="async"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK_MENU_IMAGE;
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />

              <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
                {selectedProduct.tag === 'special' && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-yellow-300 border border-amber-500/40 shadow-sm backdrop-blur-md">
                    پیشنهاد سرآشپز ⭐
                  </span>
                )}
                {selectedProduct.tag === 'popular' && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm backdrop-blur-md">
                    محبوب‌ترین 🔥
                  </span>
                )}
                {selectedProduct.tag === 'vegan' && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm backdrop-blur-md">
                    کاملاً ارگانیک 🌱
                  </span>
                )}
                {selectedProduct.subCategory && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-zinc-900/90 text-amber-300 border border-zinc-700 backdrop-blur-md">
                    {selectedProduct.subCategory}
                  </span>
                )}
              </div>
            </div>

            {/* مشخصات و توضیحات دقیق */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {selectedProduct.name}
              </h2>

              <div className="p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80">
                <span className="text-[11px] text-amber-400 font-bold block mb-1">
                  ترکیبات و طعم‌شناسی:
                </span>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                  {selectedProduct.desc}
                </p>
              </div>

              {/* قیمت نهایی سرو */}
              <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                <span className="text-xs text-zinc-400 font-medium">قیمت سرو کافه:</span>
                <span className="text-xl sm:text-2xl font-black text-amber-400">
                  {formatNumber(selectedProduct.price)}{' '}
                  <span className="text-sm text-zinc-300 font-normal">تومان</span>
                </span>
              </div>

              <button
                onClick={() => setSelectedProduct(null)}
                className="btn-gold-3d w-full py-3 rounded-2xl text-zinc-950 font-bold text-sm cursor-pointer mt-2"
              >
                بستن پنجره
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ======================================================== */}
      {/* مودال راهنمای باز شدن با آی‌پی و اینترنت ایران (بدون فیلترشکن) */}
      {/* ======================================================== */}
      {isIranGuideOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
          onClick={() => setIsIranGuideOpen(false)}
        >
          <div
            className="bg-zinc-900 border border-emerald-500/40 rounded-3xl p-5 sm:p-7 max-w-xl w-full relative shadow-card-deep animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* دکمه بستن */}
            <button
              onClick={() => setIsIranGuideOpen(false)}
              className="absolute top-4 left-4 z-20 p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* سربرگ مودال */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                  باز شدن منو با اینترنت ایران 🇮🇷
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  راهنمای رفع ارور ۴۰۳ گوگل و باز کردن منو بدون فیلترشکن
                </p>
              </div>
            </div>

            {/* توضیح علت */}
            <div className="mb-5 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-200/90 text-xs leading-relaxed flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong>چرا بدون فیلترشکن باز نمی‌شود؟</strong>
                <p className="text-zinc-300 mt-1">
                  سرورهای هاستینگ ابری گوگل (Google Cloud Run) به دلیل تحریم‌های شرکت گوگل، درخواست‌های مستقیم با آی‌پی ایران را با خطای ۴۰۳ مسدود می‌کنند. با راه‌حل‌های زیر بدون هیچ فیلترشکنی و با سرعت فوق‌العاده متصل شوید:
                </p>
              </div>
            </div>

            {/* سوئیچ تب‌ها */}
            <div className="flex p-1 rounded-2xl bg-zinc-950 border border-zinc-800 mb-5 gap-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setIranGuideTab('dns')}
                className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  iranGuideTab === 'dns'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>دی‌ان‌اس ضدتحریم</span>
              </button>
              <button
                type="button"
                onClick={() => setIranGuideTab('router')}
                className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  iranGuideTab === 'router'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Wifi className="w-3.5 h-3.5" />
                <span>مودم وای‌فای کافه</span>
              </button>
              <button
                type="button"
                onClick={() => setIranGuideTab('domain')}
                className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  iranGuideTab === 'domain'
                    ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Server className="w-3.5 h-3.5" />
                <span>دامنه کافه خودمونی</span>
              </button>
            </div>

            {/* محتوای تب ۱: دی‌ان‌اس‌های ضدتحریم */}
            {iranGuideTab === 'dns' && (
              <div className="space-y-4">
                <p className="text-xs text-zinc-300">
                  کافیست یکی از دی‌ان‌اس‌های ایرانی زیر را روی گوشی یا کامپیوتر خود تنظیم کنید تا تمام تحریم‌های گوگل دور زده شوند:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* شکن */}
                  <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        سامانه شکن (Shecan)
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard('shecan', '178.22.122.100\n185.51.200.2')}
                        className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === 'shecan' ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>کپی شد!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>کپی</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="space-y-1 font-mono text-xs text-zinc-300" dir="ltr">
                      <div className="bg-zinc-900 px-2.5 py-1 rounded-lg">178.22.122.100</div>
                      <div className="bg-zinc-900 px-2.5 py-1 rounded-lg">185.51.200.2</div>
                    </div>
                    <span className="text-[10px] text-zinc-500 mt-2 block">
                      یا برای DoH اندروید: <code className="text-amber-300" dir="ltr">free.shecan.ir</code>
                    </span>
                  </div>

                  {/* الکترو */}
                  <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        سامانه الکترو (Electro)
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard('electro', '78.157.42.100\n78.157.42.101')}
                        className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === 'electro' ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>کپی شد!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>کپی</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="space-y-1 font-mono text-xs text-zinc-300" dir="ltr">
                      <div className="bg-zinc-900 px-2.5 py-1 rounded-lg">78.157.42.100</div>
                      <div className="bg-zinc-900 px-2.5 py-1 rounded-lg">78.157.42.101</div>
                    </div>
                    <span className="text-[10px] text-zinc-500 mt-2 block">دارای اپلیکیشن رایگان برای گوشی</span>
                  </div>

                  {/* سامانه ۴۰۳ */}
                  <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                        سامانه ۴۰۳ (403.online)
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard('403', '10.202.10.202\n10.202.10.102')}
                        className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === '403' ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>کپی شد!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>کپی</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="space-y-1 font-mono text-xs text-zinc-300" dir="ltr">
                      <div className="bg-zinc-900 px-2.5 py-1 rounded-lg">10.202.10.202</div>
                      <div className="bg-zinc-900 px-2.5 py-1 rounded-lg">10.202.10.102</div>
                    </div>
                  </div>

                  {/* بگذر */}
                  <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-400" />
                        سامانه بگذر (Begzar)
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard('begzar', '185.55.226.26\n185.55.225.25')}
                        className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === 'begzar' ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>کپی شد!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>کپی</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="space-y-1 font-mono text-xs text-zinc-300" dir="ltr">
                      <div className="bg-zinc-900 px-2.5 py-1 rounded-lg">185.55.226.26</div>
                      <div className="bg-zinc-900 px-2.5 py-1 rounded-lg">185.55.225.25</div>
                    </div>
                  </div>
                </div>

                {/* راهنمای کوتاه اعمال روی گوشی */}
                <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800 text-[11px] text-zinc-400 space-y-1.5">
                  <div className="font-bold text-zinc-200">روش تنظیم سریع در ۳۰ ثانیه:</div>
                  <p>• <strong>گوشی اندروید:</strong> تنظیمات (Settings) ⟵ اتصالات (Connections) ⟵ دی‌ان‌اس خصوصی (Private DNS) ⟵ وارد کردن <code className="text-emerald-400 font-mono">free.shecan.ir</code></p>
                  <p>• <strong>گوشی آیفون (iOS):</strong> تنظیمات Wi-Fi ⟵ لمس علامت (i) شبکه کافه ⟵ Configure DNS روی Manual ⟵ افزودن سرور <code className="text-emerald-400 font-mono">178.22.122.100</code></p>
                </div>
              </div>
            )}

            {/* محتوای تب ۲: تنظیم مودم کافه */}
            {iranGuideTab === 'router' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs leading-relaxed">
                  <strong className="text-sm block mb-1 text-amber-300">⭐ توصیه طلایی برای کافه خودمونی:</strong>
                  اگر دی‌ان‌اس را روی مودم وای‌فای کافه ست کنید، <strong>هیچ کدام از مشتریان و کارکنان نیاز به تنظیم گوشی یا فیلترشکن ندارند!</strong> هر کس به وای‌فای کافه وصل شود، منو بلافاصله با بالاترین سرعت برایش باز می‌شود.
                </div>

                <div className="space-y-2 text-xs text-zinc-300 bg-zinc-950/80 p-4 rounded-2xl border border-zinc-800">
                  <h4 className="font-bold text-white mb-2">مراحل تنظیم ۳ دقیقه‌ای مودم کافه:</h4>
                  <p>۱. مرورگر را باز کرده و به آدرس <code className="text-yellow-400 font-mono" dir="ltr">192.168.1.1</code> بروید.</p>
                  <p>۲. نام کاربری و پسورد مودم را وارد کنید (معمولاً هر دو <code className="text-yellow-400 font-mono">admin</code> هستند).</p>
                  <p>۳. به بخش <strong>Network</strong> یا <strong>LAN</strong> یا <strong>DHCP Server</strong> بروید.</p>
                  <p>۴. در فیلد <strong>Primary DNS</strong> عدد <code className="text-emerald-400 font-mono" dir="ltr">178.22.122.100</code> و در فیلد <strong>Secondary DNS</strong> عدد <code className="text-emerald-400 font-mono" dir="ltr">185.51.200.2</code> را وارد و ذخیره (Save/Apply) کنید.</p>
                  <p>۵. یک‌بار مودم را خاموش و روشن کنید. از این لحظه تمام میزها با اتصال به وای‌فای بدون تحریم هستند.</p>
                </div>
              </div>
            )}

            {/* محتوای تب ۳: اتصال دامنه اختصاصی */}
            {iranGuideTab === 'domain' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 text-zinc-200 text-xs leading-relaxed">
                  <strong className="text-sm block mb-1 text-yellow-300">🌐 راه‌حل دائمی و خودکار بدون نیاز به وای‌فای:</strong>
                  برای اینکه حتی مشتریانی که از اینترنت سیم‌کارت همراه اول و ایرانسل استفاده می‌کنند مستقیماً منو را باز کنند:
                </div>

                <div className="space-y-3 text-xs text-zinc-300">
                  <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800">
                    <span className="font-bold text-white block mb-1">روش اول: اتصال دامنه با کلودفلر (Cloudflare CDN)</span>
                    <p className="text-zinc-400 leading-relaxed">
                      خرید یک دامنه ایرانی ارزان (مانند <code className="text-amber-300">cafekhodemuni.ir</code> سالانه حدود ۳۵ هزار تومان) و اتصال رایگان به Cloudflare. چون پروکسی کلودفلر فعال می‌شود، سرور گوگل آی‌پی کاربر را آمریکا یا اروپا می‌بیند و ارور ۴۰۳ رخ نمی‌دهد.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800">
                    <span className="font-bold text-white block mb-1">روش دوم: آپلود روی هاست‌های داخلی ایران یا Vercel</span>
                    <p className="text-zinc-400 leading-relaxed">
                      این پروژه از React و Vite استفاده می‌کند. با دستور <code className="text-yellow-400 font-mono">npm run build</code>، کل فایل‌های منو در پوشه <code className="text-yellow-400 font-mono">dist</code> آماده می‌شوند که می‌توانید آن را روی هاست‌های ایرانی (مثل ابر آروان یا پارس‌پک) یا Vercel آپلود کنید که هیچ تحریمی روی آی‌پی ایران ندارند.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsIranGuideOpen(false)}
              className="w-full mt-6 py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-sm transition cursor-pointer"
            >
              متوجه شدم و بستن راهنما
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
