import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronRight,
  Clock,
  ExternalLink,
  Search,
  ShoppingCart,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useMemo, useRef, useState } from "react";

const PLATFORMS = [
  {
    name: "Blinkit",
    color: "#F8D146",
    tagline: "Grocery in 10 minutes",
    delivery: "10 min",
    url: (q: string) => `https://blinkit.com/s/?q=${q}`,
    logo: "⚡",
    textColor: "#1a1a00",
  },
  {
    name: "Swiggy Instamart",
    color: "#FC8019",
    tagline: "Groceries & essentials",
    delivery: "10–15 min",
    url: (q: string) => `https://www.swiggy.com/instamart/search?query=${q}`,
    logo: "🛍️",
    textColor: "#fff",
  },
  {
    name: "Zepto",
    color: "#A855F7",
    tagline: "10-minute delivery",
    delivery: "10 min",
    url: (q: string) => `https://www.zeptonow.com/search?query=${q}`,
    logo: "🟣",
    textColor: "#fff",
  },
  {
    name: "BigBasket",
    color: "#84CC16",
    tagline: "India's largest online grocery",
    delivery: "2 hrs",
    url: (q: string) => `https://www.bigbasket.com/ps/?q=${q}`,
    logo: "🧺",
    textColor: "#1a1a00",
  },
  {
    name: "BB Now",
    color: "#65A30D",
    tagline: "BigBasket express delivery",
    delivery: "10–20 min",
    url: (q: string) => `https://www.bigbasket.com/ps/?q=${q}`,
    logo: "🟢",
    textColor: "#fff",
  },
  {
    name: "JioMart",
    color: "#0052CC",
    tagline: "Desh ki Nayi Dukaan",
    delivery: "Same day",
    url: (q: string) => `https://www.jiomart.com/search/${q}`,
    logo: "📦",
    textColor: "#fff",
  },
  {
    name: "Amazon Fresh",
    color: "#00A8E0",
    tagline: "Fresh groceries by Amazon",
    delivery: "2 hrs",
    url: (q: string) => `https://www.amazon.in/s?k=${q}&i=amazonfresh`,
    logo: "🔵",
    textColor: "#fff",
  },
  {
    name: "Flipkart Minutes",
    color: "#2874F0",
    tagline: "Minutes delivery by Flipkart",
    delivery: "10–20 min",
    url: (q: string) => `https://www.flipkart.com/search?q=${q}`,
    logo: "⭐",
    textColor: "#fff",
  },
  {
    name: "Dunzo",
    color: "#00C9A7",
    tagline: "Deliver anything in minutes",
    delivery: "20 min",
    url: (q: string) => `https://www.dunzo.com/search?query=${q}`,
    logo: "🟦",
    textColor: "#1a2a2a",
  },
  {
    name: "Nykaa",
    color: "#FC2779",
    tagline: "Beauty & personal care",
    delivery: "2 hrs",
    url: (q: string) => `https://www.nykaa.com/search/result/?q=${q}`,
    logo: "💄",
    textColor: "#fff",
  },
];

type PriceEntry = { platform: string; price: number; unit: string };

// Realistic Indian market prices (slightly varying per platform)
const PRODUCT_PRICES: Record<string, PriceEntry[]> = {
  // ─── Existing products ───
  milk: [
    { platform: "Blinkit", price: 28, unit: "500ml" },
    { platform: "Swiggy Instamart", price: 27, unit: "500ml" },
    { platform: "Zepto", price: 28, unit: "500ml" },
    { platform: "BigBasket", price: 26, unit: "500ml" },
    { platform: "BB Now", price: 27, unit: "500ml" },
    { platform: "JioMart", price: 26, unit: "500ml" },
    { platform: "Amazon Fresh", price: 29, unit: "500ml" },
    { platform: "Flipkart Minutes", price: 28, unit: "500ml" },
  ],
  eggs: [
    { platform: "Blinkit", price: 89, unit: "12 pcs" },
    { platform: "Swiggy Instamart", price: 85, unit: "12 pcs" },
    { platform: "Zepto", price: 87, unit: "12 pcs" },
    { platform: "BigBasket", price: 84, unit: "12 pcs" },
    { platform: "BB Now", price: 86, unit: "12 pcs" },
    { platform: "JioMart", price: 83, unit: "12 pcs" },
    { platform: "Amazon Fresh", price: 90, unit: "12 pcs" },
    { platform: "Flipkart Minutes", price: 88, unit: "12 pcs" },
  ],
  onions: [
    { platform: "Blinkit", price: 42, unit: "1kg" },
    { platform: "Swiggy Instamart", price: 45, unit: "1kg" },
    { platform: "Zepto", price: 40, unit: "1kg" },
    { platform: "BigBasket", price: 38, unit: "1kg" },
    { platform: "BB Now", price: 41, unit: "1kg" },
    { platform: "JioMart", price: 39, unit: "1kg" },
    { platform: "Amazon Fresh", price: 44, unit: "1kg" },
    { platform: "Flipkart Minutes", price: 43, unit: "1kg" },
  ],
  tomatoes: [
    { platform: "Blinkit", price: 35, unit: "1kg" },
    { platform: "Swiggy Instamart", price: 38, unit: "1kg" },
    { platform: "Zepto", price: 34, unit: "1kg" },
    { platform: "BigBasket", price: 32, unit: "1kg" },
    { platform: "BB Now", price: 36, unit: "1kg" },
    { platform: "JioMart", price: 33, unit: "1kg" },
    { platform: "Amazon Fresh", price: 37, unit: "1kg" },
    { platform: "Flipkart Minutes", price: 36, unit: "1kg" },
  ],
  potatoes: [
    { platform: "Blinkit", price: 38, unit: "1kg" },
    { platform: "Swiggy Instamart", price: 36, unit: "1kg" },
    { platform: "Zepto", price: 35, unit: "1kg" },
    { platform: "BigBasket", price: 33, unit: "1kg" },
    { platform: "BB Now", price: 35, unit: "1kg" },
    { platform: "JioMart", price: 34, unit: "1kg" },
    { platform: "Amazon Fresh", price: 39, unit: "1kg" },
    { platform: "Flipkart Minutes", price: 37, unit: "1kg" },
  ],
  maggi: [
    { platform: "Blinkit", price: 14, unit: "70g" },
    { platform: "Swiggy Instamart", price: 14, unit: "70g" },
    { platform: "Zepto", price: 13, unit: "70g" },
    { platform: "BigBasket", price: 13, unit: "70g" },
    { platform: "BB Now", price: 14, unit: "70g" },
    { platform: "JioMart", price: 13, unit: "70g" },
    { platform: "Amazon Fresh", price: 15, unit: "70g" },
    { platform: "Flipkart Minutes", price: 14, unit: "70g" },
  ],
  bread: [
    { platform: "Blinkit", price: 48, unit: "400g" },
    { platform: "Swiggy Instamart", price: 46, unit: "400g" },
    { platform: "Zepto", price: 45, unit: "400g" },
    { platform: "BigBasket", price: 44, unit: "400g" },
    { platform: "BB Now", price: 47, unit: "400g" },
    { platform: "JioMart", price: 45, unit: "400g" },
    { platform: "Amazon Fresh", price: 49, unit: "400g" },
    { platform: "Flipkart Minutes", price: 48, unit: "400g" },
  ],
  "amul butter": [
    { platform: "Blinkit", price: 58, unit: "100g" },
    { platform: "Swiggy Instamart", price: 57, unit: "100g" },
    { platform: "Zepto", price: 56, unit: "100g" },
    { platform: "BigBasket", price: 55, unit: "100g" },
    { platform: "BB Now", price: 57, unit: "100g" },
    { platform: "JioMart", price: 55, unit: "100g" },
    { platform: "Amazon Fresh", price: 59, unit: "100g" },
    { platform: "Flipkart Minutes", price: 58, unit: "100g" },
  ],
  "amul milk": [
    { platform: "Blinkit", price: 28, unit: "500ml" },
    { platform: "Swiggy Instamart", price: 27, unit: "500ml" },
    { platform: "Zepto", price: 28, unit: "500ml" },
    { platform: "BigBasket", price: 26, unit: "500ml" },
    { platform: "BB Now", price: 27, unit: "500ml" },
    { platform: "JioMart", price: 26, unit: "500ml" },
    { platform: "Amazon Fresh", price: 29, unit: "500ml" },
    { platform: "Flipkart Minutes", price: 28, unit: "500ml" },
  ],
  rice: [
    { platform: "Blinkit", price: 72, unit: "1kg" },
    { platform: "Swiggy Instamart", price: 69, unit: "1kg" },
    { platform: "Zepto", price: 70, unit: "1kg" },
    { platform: "BigBasket", price: 65, unit: "1kg" },
    { platform: "BB Now", price: 68, unit: "1kg" },
    { platform: "JioMart", price: 67, unit: "1kg" },
    { platform: "Amazon Fresh", price: 74, unit: "1kg" },
    { platform: "Flipkart Minutes", price: 71, unit: "1kg" },
  ],
  atta: [
    { platform: "Blinkit", price: 68, unit: "1kg" },
    { platform: "Swiggy Instamart", price: 65, unit: "1kg" },
    { platform: "Zepto", price: 66, unit: "1kg" },
    { platform: "BigBasket", price: 62, unit: "1kg" },
    { platform: "BB Now", price: 64, unit: "1kg" },
    { platform: "JioMart", price: 63, unit: "1kg" },
    { platform: "Amazon Fresh", price: 70, unit: "1kg" },
    { platform: "Flipkart Minutes", price: 67, unit: "1kg" },
  ],
  sugar: [
    { platform: "Blinkit", price: 52, unit: "1kg" },
    { platform: "Swiggy Instamart", price: 50, unit: "1kg" },
    { platform: "Zepto", price: 49, unit: "1kg" },
    { platform: "BigBasket", price: 48, unit: "1kg" },
    { platform: "BB Now", price: 50, unit: "1kg" },
    { platform: "JioMart", price: 48, unit: "1kg" },
    { platform: "Amazon Fresh", price: 53, unit: "1kg" },
    { platform: "Flipkart Minutes", price: 51, unit: "1kg" },
  ],
  salt: [
    { platform: "Blinkit", price: 22, unit: "1kg" },
    { platform: "Swiggy Instamart", price: 21, unit: "1kg" },
    { platform: "Zepto", price: 20, unit: "1kg" },
    { platform: "BigBasket", price: 19, unit: "1kg" },
    { platform: "BB Now", price: 20, unit: "1kg" },
    { platform: "JioMart", price: 19, unit: "1kg" },
    { platform: "Amazon Fresh", price: 23, unit: "1kg" },
    { platform: "Flipkart Minutes", price: 21, unit: "1kg" },
  ],
  "tata tea": [
    { platform: "Blinkit", price: 148, unit: "250g" },
    { platform: "Swiggy Instamart", price: 145, unit: "250g" },
    { platform: "Zepto", price: 142, unit: "250g" },
    { platform: "BigBasket", price: 140, unit: "250g" },
    { platform: "BB Now", price: 144, unit: "250g" },
    { platform: "JioMart", price: 140, unit: "250g" },
    { platform: "Amazon Fresh", price: 150, unit: "250g" },
    { platform: "Flipkart Minutes", price: 147, unit: "250g" },
  ],
  "bru coffee": [
    { platform: "Blinkit", price: 115, unit: "50g" },
    { platform: "Swiggy Instamart", price: 112, unit: "50g" },
    { platform: "Zepto", price: 110, unit: "50g" },
    { platform: "BigBasket", price: 108, unit: "50g" },
    { platform: "BB Now", price: 111, unit: "50g" },
    { platform: "JioMart", price: 109, unit: "50g" },
    { platform: "Amazon Fresh", price: 118, unit: "50g" },
    { platform: "Flipkart Minutes", price: 114, unit: "50g" },
  ],
  colgate: [
    { platform: "Blinkit", price: 68, unit: "100g" },
    { platform: "Swiggy Instamart", price: 65, unit: "100g" },
    { platform: "Zepto", price: 64, unit: "100g" },
    { platform: "BigBasket", price: 62, unit: "100g" },
    { platform: "BB Now", price: 65, unit: "100g" },
    { platform: "JioMart", price: 63, unit: "100g" },
    { platform: "Amazon Fresh", price: 69, unit: "100g" },
    { platform: "Flipkart Minutes", price: 67, unit: "100g" },
    { platform: "Nykaa", price: 70, unit: "100g" },
  ],
  "dove soap": [
    { platform: "Blinkit", price: 62, unit: "75g" },
    { platform: "Swiggy Instamart", price: 60, unit: "75g" },
    { platform: "Zepto", price: 59, unit: "75g" },
    { platform: "BigBasket", price: 58, unit: "75g" },
    { platform: "BB Now", price: 60, unit: "75g" },
    { platform: "JioMart", price: 58, unit: "75g" },
    { platform: "Amazon Fresh", price: 64, unit: "75g" },
    { platform: "Flipkart Minutes", price: 62, unit: "75g" },
    { platform: "Nykaa", price: 65, unit: "75g" },
  ],
  "dettol handwash": [
    { platform: "Blinkit", price: 98, unit: "200ml" },
    { platform: "Swiggy Instamart", price: 95, unit: "200ml" },
    { platform: "Zepto", price: 94, unit: "200ml" },
    { platform: "BigBasket", price: 92, unit: "200ml" },
    { platform: "BB Now", price: 96, unit: "200ml" },
    { platform: "JioMart", price: 93, unit: "200ml" },
    { platform: "Amazon Fresh", price: 99, unit: "200ml" },
    { platform: "Flipkart Minutes", price: 97, unit: "200ml" },
    { platform: "Nykaa", price: 100, unit: "200ml" },
  ],
  "head & shoulders": [
    { platform: "Blinkit", price: 178, unit: "180ml" },
    { platform: "Swiggy Instamart", price: 175, unit: "180ml" },
    { platform: "Zepto", price: 172, unit: "180ml" },
    { platform: "BigBasket", price: 170, unit: "180ml" },
    { platform: "BB Now", price: 174, unit: "180ml" },
    { platform: "JioMart", price: 170, unit: "180ml" },
    { platform: "Amazon Fresh", price: 179, unit: "180ml" },
    { platform: "Flipkart Minutes", price: 177, unit: "180ml" },
    { platform: "Nykaa", price: 180, unit: "180ml" },
  ],
  lays: [
    { platform: "Blinkit", price: 20, unit: "26g" },
    { platform: "Swiggy Instamart", price: 20, unit: "26g" },
    { platform: "Zepto", price: 19, unit: "26g" },
    { platform: "BigBasket", price: 18, unit: "26g" },
    { platform: "BB Now", price: 20, unit: "26g" },
    { platform: "JioMart", price: 18, unit: "26g" },
    { platform: "Amazon Fresh", price: 20, unit: "26g" },
    { platform: "Flipkart Minutes", price: 20, unit: "26g" },
  ],
  paneer: [
    { platform: "Blinkit", price: 95, unit: "200g" },
    { platform: "Swiggy Instamart", price: 92, unit: "200g" },
    { platform: "Zepto", price: 90, unit: "200g" },
    { platform: "BigBasket", price: 88, unit: "200g" },
    { platform: "BB Now", price: 91, unit: "200g" },
    { platform: "JioMart", price: 89, unit: "200g" },
    { platform: "Amazon Fresh", price: 96, unit: "200g" },
    { platform: "Flipkart Minutes", price: 94, unit: "200g" },
  ],
  curd: [
    { platform: "Blinkit", price: 52, unit: "400g" },
    { platform: "Swiggy Instamart", price: 50, unit: "400g" },
    { platform: "Zepto", price: 49, unit: "400g" },
    { platform: "BigBasket", price: 48, unit: "400g" },
    { platform: "BB Now", price: 50, unit: "400g" },
    { platform: "JioMart", price: 48, unit: "400g" },
    { platform: "Amazon Fresh", price: 53, unit: "400g" },
    { platform: "Flipkart Minutes", price: 52, unit: "400g" },
  ],
  ghee: [
    { platform: "Blinkit", price: 355, unit: "500ml" },
    { platform: "Swiggy Instamart", price: 348, unit: "500ml" },
    { platform: "Zepto", price: 345, unit: "500ml" },
    { platform: "BigBasket", price: 340, unit: "500ml" },
    { platform: "BB Now", price: 348, unit: "500ml" },
    { platform: "JioMart", price: 342, unit: "500ml" },
    { platform: "Amazon Fresh", price: 358, unit: "500ml" },
    { platform: "Flipkart Minutes", price: 352, unit: "500ml" },
  ],
  "coconut oil": [
    { platform: "Blinkit", price: 145, unit: "500ml" },
    { platform: "Swiggy Instamart", price: 142, unit: "500ml" },
    { platform: "Zepto", price: 140, unit: "500ml" },
    { platform: "BigBasket", price: 138, unit: "500ml" },
    { platform: "BB Now", price: 141, unit: "500ml" },
    { platform: "JioMart", price: 139, unit: "500ml" },
    { platform: "Amazon Fresh", price: 148, unit: "500ml" },
    { platform: "Flipkart Minutes", price: 144, unit: "500ml" },
  ],
  "face wash": [
    { platform: "Blinkit", price: 148, unit: "100ml" },
    { platform: "Swiggy Instamart", price: 145, unit: "100ml" },
    { platform: "Zepto", price: 142, unit: "100ml" },
    { platform: "BigBasket", price: 140, unit: "100ml" },
    { platform: "BB Now", price: 144, unit: "100ml" },
    { platform: "JioMart", price: 141, unit: "100ml" },
    { platform: "Amazon Fresh", price: 150, unit: "100ml" },
    { platform: "Flipkart Minutes", price: 147, unit: "100ml" },
    { platform: "Nykaa", price: 138, unit: "100ml" },
  ],
  shampoo: [
    { platform: "Blinkit", price: 195, unit: "200ml" },
    { platform: "Swiggy Instamart", price: 190, unit: "200ml" },
    { platform: "Zepto", price: 188, unit: "200ml" },
    { platform: "BigBasket", price: 185, unit: "200ml" },
    { platform: "BB Now", price: 190, unit: "200ml" },
    { platform: "JioMart", price: 186, unit: "200ml" },
    { platform: "Amazon Fresh", price: 198, unit: "200ml" },
    { platform: "Flipkart Minutes", price: 194, unit: "200ml" },
    { platform: "Nykaa", price: 182, unit: "200ml" },
  ],
  moisturiser: [
    { platform: "Blinkit", price: 220, unit: "100ml" },
    { platform: "Swiggy Instamart", price: 215, unit: "100ml" },
    { platform: "Zepto", price: 212, unit: "100ml" },
    { platform: "BigBasket", price: 210, unit: "100ml" },
    { platform: "BB Now", price: 214, unit: "100ml" },
    { platform: "JioMart", price: 210, unit: "100ml" },
    { platform: "Amazon Fresh", price: 222, unit: "100ml" },
    { platform: "Flipkart Minutes", price: 218, unit: "100ml" },
    { platform: "Nykaa", price: 205, unit: "100ml" },
  ],

  // ─── Vegetables ───
  carrots: [
    { platform: "Blinkit", price: 45, unit: "1kg" },
    { platform: "Swiggy Instamart", price: 48, unit: "1kg" },
    { platform: "Zepto", price: 44, unit: "1kg" },
    { platform: "BigBasket", price: 40, unit: "1kg" },
    { platform: "BB Now", price: 43, unit: "1kg" },
    { platform: "JioMart", price: 41, unit: "1kg" },
    { platform: "Amazon Fresh", price: 46, unit: "1kg" },
    { platform: "Flipkart Minutes", price: 45, unit: "1kg" },
  ],
  capsicum: [
    { platform: "Blinkit", price: 58, unit: "500g" },
    { platform: "Swiggy Instamart", price: 60, unit: "500g" },
    { platform: "Zepto", price: 55, unit: "500g" },
    { platform: "BigBasket", price: 52, unit: "500g" },
    { platform: "BB Now", price: 56, unit: "500g" },
    { platform: "JioMart", price: 53, unit: "500g" },
    { platform: "Amazon Fresh", price: 59, unit: "500g" },
    { platform: "Flipkart Minutes", price: 57, unit: "500g" },
  ],
  cucumber: [
    { platform: "Blinkit", price: 32, unit: "500g" },
    { platform: "Swiggy Instamart", price: 34, unit: "500g" },
    { platform: "Zepto", price: 30, unit: "500g" },
    { platform: "BigBasket", price: 28, unit: "500g" },
    { platform: "BB Now", price: 31, unit: "500g" },
    { platform: "JioMart", price: 29, unit: "500g" },
    { platform: "Amazon Fresh", price: 33, unit: "500g" },
    { platform: "Flipkart Minutes", price: 32, unit: "500g" },
  ],
  cauliflower: [
    { platform: "Blinkit", price: 40, unit: "1 pc" },
    { platform: "Swiggy Instamart", price: 42, unit: "1 pc" },
    { platform: "Zepto", price: 38, unit: "1 pc" },
    { platform: "BigBasket", price: 36, unit: "1 pc" },
    { platform: "BB Now", price: 39, unit: "1 pc" },
    { platform: "JioMart", price: 37, unit: "1 pc" },
    { platform: "Amazon Fresh", price: 41, unit: "1 pc" },
    { platform: "Flipkart Minutes", price: 40, unit: "1 pc" },
  ],
  spinach: [
    { platform: "Blinkit", price: 25, unit: "250g" },
    { platform: "Swiggy Instamart", price: 27, unit: "250g" },
    { platform: "Zepto", price: 24, unit: "250g" },
    { platform: "BigBasket", price: 22, unit: "250g" },
    { platform: "BB Now", price: 24, unit: "250g" },
    { platform: "JioMart", price: 23, unit: "250g" },
    { platform: "Amazon Fresh", price: 26, unit: "250g" },
    { platform: "Flipkart Minutes", price: 25, unit: "250g" },
  ],
  garlic: [
    { platform: "Blinkit", price: 35, unit: "250g" },
    { platform: "Swiggy Instamart", price: 37, unit: "250g" },
    { platform: "Zepto", price: 33, unit: "250g" },
    { platform: "BigBasket", price: 30, unit: "250g" },
    { platform: "BB Now", price: 32, unit: "250g" },
    { platform: "JioMart", price: 31, unit: "250g" },
    { platform: "Amazon Fresh", price: 36, unit: "250g" },
    { platform: "Flipkart Minutes", price: 34, unit: "250g" },
  ],
  ginger: [
    { platform: "Blinkit", price: 28, unit: "200g" },
    { platform: "Swiggy Instamart", price: 30, unit: "200g" },
    { platform: "Zepto", price: 26, unit: "200g" },
    { platform: "BigBasket", price: 24, unit: "200g" },
    { platform: "BB Now", price: 27, unit: "200g" },
    { platform: "JioMart", price: 25, unit: "200g" },
    { platform: "Amazon Fresh", price: 29, unit: "200g" },
    { platform: "Flipkart Minutes", price: 28, unit: "200g" },
  ],
  lemon: [
    { platform: "Blinkit", price: 30, unit: "6 pcs" },
    { platform: "Swiggy Instamart", price: 32, unit: "6 pcs" },
    { platform: "Zepto", price: 29, unit: "6 pcs" },
    { platform: "BigBasket", price: 26, unit: "6 pcs" },
    { platform: "BB Now", price: 28, unit: "6 pcs" },
    { platform: "JioMart", price: 27, unit: "6 pcs" },
    { platform: "Amazon Fresh", price: 31, unit: "6 pcs" },
    { platform: "Flipkart Minutes", price: 30, unit: "6 pcs" },
  ],
  "green chillies": [
    { platform: "Blinkit", price: 18, unit: "100g" },
    { platform: "Swiggy Instamart", price: 20, unit: "100g" },
    { platform: "Zepto", price: 17, unit: "100g" },
    { platform: "BigBasket", price: 15, unit: "100g" },
    { platform: "BB Now", price: 17, unit: "100g" },
    { platform: "JioMart", price: 16, unit: "100g" },
    { platform: "Amazon Fresh", price: 19, unit: "100g" },
    { platform: "Flipkart Minutes", price: 18, unit: "100g" },
  ],
  beetroot: [
    { platform: "Blinkit", price: 48, unit: "500g" },
    { platform: "Swiggy Instamart", price: 50, unit: "500g" },
    { platform: "Zepto", price: 46, unit: "500g" },
    { platform: "BigBasket", price: 43, unit: "500g" },
    { platform: "BB Now", price: 46, unit: "500g" },
    { platform: "JioMart", price: 44, unit: "500g" },
    { platform: "Amazon Fresh", price: 49, unit: "500g" },
    { platform: "Flipkart Minutes", price: 47, unit: "500g" },
  ],
  brinjal: [
    { platform: "Blinkit", price: 38, unit: "500g" },
    { platform: "Swiggy Instamart", price: 40, unit: "500g" },
    { platform: "Zepto", price: 36, unit: "500g" },
    { platform: "BigBasket", price: 33, unit: "500g" },
    { platform: "BB Now", price: 36, unit: "500g" },
    { platform: "JioMart", price: 34, unit: "500g" },
    { platform: "Amazon Fresh", price: 39, unit: "500g" },
    { platform: "Flipkart Minutes", price: 37, unit: "500g" },
  ],
  bhindi: [
    { platform: "Blinkit", price: 42, unit: "500g" },
    { platform: "Swiggy Instamart", price: 44, unit: "500g" },
    { platform: "Zepto", price: 40, unit: "500g" },
    { platform: "BigBasket", price: 37, unit: "500g" },
    { platform: "BB Now", price: 40, unit: "500g" },
    { platform: "JioMart", price: 38, unit: "500g" },
    { platform: "Amazon Fresh", price: 43, unit: "500g" },
    { platform: "Flipkart Minutes", price: 41, unit: "500g" },
  ],
  cabbage: [
    { platform: "Blinkit", price: 30, unit: "1 pc (~500g)" },
    { platform: "Swiggy Instamart", price: 32, unit: "1 pc (~500g)" },
    { platform: "Zepto", price: 28, unit: "1 pc (~500g)" },
    { platform: "BigBasket", price: 26, unit: "1 pc (~500g)" },
    { platform: "BB Now", price: 29, unit: "1 pc (~500g)" },
    { platform: "JioMart", price: 27, unit: "1 pc (~500g)" },
    { platform: "Amazon Fresh", price: 31, unit: "1 pc (~500g)" },
    { platform: "Flipkart Minutes", price: 30, unit: "1 pc (~500g)" },
  ],
  mushrooms: [
    { platform: "Blinkit", price: 65, unit: "200g" },
    { platform: "Swiggy Instamart", price: 68, unit: "200g" },
    { platform: "Zepto", price: 62, unit: "200g" },
    { platform: "BigBasket", price: 58, unit: "200g" },
    { platform: "BB Now", price: 63, unit: "200g" },
    { platform: "JioMart", price: 60, unit: "200g" },
    { platform: "Amazon Fresh", price: 67, unit: "200g" },
    { platform: "Flipkart Minutes", price: 65, unit: "200g" },
  ],
  peas: [
    { platform: "Blinkit", price: 58, unit: "500g" },
    { platform: "Swiggy Instamart", price: 60, unit: "500g" },
    { platform: "Zepto", price: 55, unit: "500g" },
    { platform: "BigBasket", price: 52, unit: "500g" },
    { platform: "BB Now", price: 56, unit: "500g" },
    { platform: "JioMart", price: 53, unit: "500g" },
    { platform: "Amazon Fresh", price: 59, unit: "500g" },
    { platform: "Flipkart Minutes", price: 57, unit: "500g" },
  ],

  // ─── Fruits ───
  banana: [
    { platform: "Blinkit", price: 45, unit: "12 pcs" },
    { platform: "Swiggy Instamart", price: 48, unit: "12 pcs" },
    { platform: "Zepto", price: 44, unit: "12 pcs" },
    { platform: "BigBasket", price: 40, unit: "12 pcs" },
    { platform: "BB Now", price: 43, unit: "12 pcs" },
    { platform: "JioMart", price: 41, unit: "12 pcs" },
    { platform: "Amazon Fresh", price: 46, unit: "12 pcs" },
    { platform: "Flipkart Minutes", price: 45, unit: "12 pcs" },
  ],
  apple: [
    { platform: "Blinkit", price: 160, unit: "1kg" },
    { platform: "Swiggy Instamart", price: 165, unit: "1kg" },
    { platform: "Zepto", price: 155, unit: "1kg" },
    { platform: "BigBasket", price: 148, unit: "1kg" },
    { platform: "BB Now", price: 158, unit: "1kg" },
    { platform: "JioMart", price: 150, unit: "1kg" },
    { platform: "Amazon Fresh", price: 162, unit: "1kg" },
    { platform: "Flipkart Minutes", price: 159, unit: "1kg" },
  ],
  mango: [
    { platform: "Blinkit", price: 120, unit: "1kg" },
    { platform: "Swiggy Instamart", price: 125, unit: "1kg" },
    { platform: "Zepto", price: 118, unit: "1kg" },
    { platform: "BigBasket", price: 112, unit: "1kg" },
    { platform: "BB Now", price: 118, unit: "1kg" },
    { platform: "JioMart", price: 115, unit: "1kg" },
    { platform: "Amazon Fresh", price: 122, unit: "1kg" },
    { platform: "Flipkart Minutes", price: 120, unit: "1kg" },
  ],
  orange: [
    { platform: "Blinkit", price: 80, unit: "1kg" },
    { platform: "Swiggy Instamart", price: 85, unit: "1kg" },
    { platform: "Zepto", price: 78, unit: "1kg" },
    { platform: "BigBasket", price: 72, unit: "1kg" },
    { platform: "BB Now", price: 77, unit: "1kg" },
    { platform: "JioMart", price: 74, unit: "1kg" },
    { platform: "Amazon Fresh", price: 82, unit: "1kg" },
    { platform: "Flipkart Minutes", price: 80, unit: "1kg" },
  ],
  grapes: [
    { platform: "Blinkit", price: 90, unit: "500g" },
    { platform: "Swiggy Instamart", price: 95, unit: "500g" },
    { platform: "Zepto", price: 88, unit: "500g" },
    { platform: "BigBasket", price: 82, unit: "500g" },
    { platform: "BB Now", price: 87, unit: "500g" },
    { platform: "JioMart", price: 84, unit: "500g" },
    { platform: "Amazon Fresh", price: 92, unit: "500g" },
    { platform: "Flipkart Minutes", price: 90, unit: "500g" },
  ],
  watermelon: [
    { platform: "Blinkit", price: 65, unit: "1kg" },
    { platform: "Swiggy Instamart", price: 68, unit: "1kg" },
    { platform: "Zepto", price: 62, unit: "1kg" },
    { platform: "BigBasket", price: 58, unit: "1kg" },
    { platform: "BB Now", price: 63, unit: "1kg" },
    { platform: "JioMart", price: 60, unit: "1kg" },
    { platform: "Amazon Fresh", price: 66, unit: "1kg" },
    { platform: "Flipkart Minutes", price: 64, unit: "1kg" },
  ],
  pomegranate: [
    { platform: "Blinkit", price: 140, unit: "1kg" },
    { platform: "Swiggy Instamart", price: 145, unit: "1kg" },
    { platform: "Zepto", price: 135, unit: "1kg" },
    { platform: "BigBasket", price: 128, unit: "1kg" },
    { platform: "BB Now", price: 135, unit: "1kg" },
    { platform: "JioMart", price: 130, unit: "1kg" },
    { platform: "Amazon Fresh", price: 142, unit: "1kg" },
    { platform: "Flipkart Minutes", price: 138, unit: "1kg" },
  ],
  papaya: [
    { platform: "Blinkit", price: 50, unit: "1kg" },
    { platform: "Swiggy Instamart", price: 53, unit: "1kg" },
    { platform: "Zepto", price: 48, unit: "1kg" },
    { platform: "BigBasket", price: 44, unit: "1kg" },
    { platform: "BB Now", price: 48, unit: "1kg" },
    { platform: "JioMart", price: 45, unit: "1kg" },
    { platform: "Amazon Fresh", price: 51, unit: "1kg" },
    { platform: "Flipkart Minutes", price: 50, unit: "1kg" },
  ],

  // ─── Dairy & Protein ───
  cheese: [
    { platform: "Blinkit", price: 115, unit: "200g" },
    { platform: "Swiggy Instamart", price: 112, unit: "200g" },
    { platform: "Zepto", price: 110, unit: "200g" },
    { platform: "BigBasket", price: 106, unit: "200g" },
    { platform: "BB Now", price: 110, unit: "200g" },
    { platform: "JioMart", price: 108, unit: "200g" },
    { platform: "Amazon Fresh", price: 117, unit: "200g" },
    { platform: "Flipkart Minutes", price: 114, unit: "200g" },
  ],
  buttermilk: [
    { platform: "Blinkit", price: 25, unit: "500ml" },
    { platform: "Swiggy Instamart", price: 24, unit: "500ml" },
    { platform: "Zepto", price: 23, unit: "500ml" },
    { platform: "BigBasket", price: 22, unit: "500ml" },
    { platform: "BB Now", price: 23, unit: "500ml" },
    { platform: "JioMart", price: 22, unit: "500ml" },
    { platform: "Amazon Fresh", price: 26, unit: "500ml" },
    { platform: "Flipkart Minutes", price: 25, unit: "500ml" },
  ],
  lassi: [
    { platform: "Blinkit", price: 30, unit: "200ml" },
    { platform: "Swiggy Instamart", price: 29, unit: "200ml" },
    { platform: "Zepto", price: 28, unit: "200ml" },
    { platform: "BigBasket", price: 27, unit: "200ml" },
    { platform: "BB Now", price: 28, unit: "200ml" },
    { platform: "JioMart", price: 27, unit: "200ml" },
    { platform: "Amazon Fresh", price: 31, unit: "200ml" },
    { platform: "Flipkart Minutes", price: 30, unit: "200ml" },
  ],
  tofu: [
    { platform: "Blinkit", price: 85, unit: "200g" },
    { platform: "Swiggy Instamart", price: 88, unit: "200g" },
    { platform: "Zepto", price: 82, unit: "200g" },
    { platform: "BigBasket", price: 78, unit: "200g" },
    { platform: "BB Now", price: 83, unit: "200g" },
    { platform: "JioMart", price: 80, unit: "200g" },
    { platform: "Amazon Fresh", price: 87, unit: "200g" },
    { platform: "Flipkart Minutes", price: 85, unit: "200g" },
  ],
  chicken: [
    { platform: "Blinkit", price: 215, unit: "500g" },
    { platform: "Swiggy Instamart", price: 220, unit: "500g" },
    { platform: "Zepto", price: 210, unit: "500g" },
    { platform: "BigBasket", price: 205, unit: "500g" },
    { platform: "BB Now", price: 212, unit: "500g" },
    { platform: "JioMart", price: 208, unit: "500g" },
    { platform: "Amazon Fresh", price: 218, unit: "500g" },
    { platform: "Flipkart Minutes", price: 215, unit: "500g" },
  ],
  mutton: [
    { platform: "Blinkit", price: 425, unit: "500g" },
    { platform: "Swiggy Instamart", price: 435, unit: "500g" },
    { platform: "Zepto", price: 420, unit: "500g" },
    { platform: "BigBasket", price: 410, unit: "500g" },
    { platform: "BB Now", price: 418, unit: "500g" },
    { platform: "JioMart", price: 415, unit: "500g" },
    { platform: "Amazon Fresh", price: 430, unit: "500g" },
    { platform: "Flipkart Minutes", price: 425, unit: "500g" },
  ],
  fish: [
    { platform: "Blinkit", price: 280, unit: "500g" },
    { platform: "Swiggy Instamart", price: 290, unit: "500g" },
    { platform: "Zepto", price: 275, unit: "500g" },
    { platform: "BigBasket", price: 265, unit: "500g" },
    { platform: "BB Now", price: 272, unit: "500g" },
    { platform: "JioMart", price: 268, unit: "500g" },
    { platform: "Amazon Fresh", price: 285, unit: "500g" },
    { platform: "Flipkart Minutes", price: 280, unit: "500g" },
  ],

  // ─── Staples & Grains ───
  "toor dal": [
    { platform: "Blinkit", price: 168, unit: "1kg" },
    { platform: "Swiggy Instamart", price: 165, unit: "1kg" },
    { platform: "Zepto", price: 162, unit: "1kg" },
    { platform: "BigBasket", price: 158, unit: "1kg" },
    { platform: "BB Now", price: 163, unit: "1kg" },
    { platform: "JioMart", price: 160, unit: "1kg" },
    { platform: "Amazon Fresh", price: 170, unit: "1kg" },
    { platform: "Flipkart Minutes", price: 166, unit: "1kg" },
  ],
  "chana dal": [
    { platform: "Blinkit", price: 125, unit: "1kg" },
    { platform: "Swiggy Instamart", price: 122, unit: "1kg" },
    { platform: "Zepto", price: 120, unit: "1kg" },
    { platform: "BigBasket", price: 116, unit: "1kg" },
    { platform: "BB Now", price: 120, unit: "1kg" },
    { platform: "JioMart", price: 117, unit: "1kg" },
    { platform: "Amazon Fresh", price: 127, unit: "1kg" },
    { platform: "Flipkart Minutes", price: 123, unit: "1kg" },
  ],
  "moong dal": [
    { platform: "Blinkit", price: 140, unit: "1kg" },
    { platform: "Swiggy Instamart", price: 137, unit: "1kg" },
    { platform: "Zepto", price: 135, unit: "1kg" },
    { platform: "BigBasket", price: 130, unit: "1kg" },
    { platform: "BB Now", price: 134, unit: "1kg" },
    { platform: "JioMart", price: 132, unit: "1kg" },
    { platform: "Amazon Fresh", price: 142, unit: "1kg" },
    { platform: "Flipkart Minutes", price: 138, unit: "1kg" },
  ],
  maida: [
    { platform: "Blinkit", price: 42, unit: "1kg" },
    { platform: "Swiggy Instamart", price: 40, unit: "1kg" },
    { platform: "Zepto", price: 39, unit: "1kg" },
    { platform: "BigBasket", price: 37, unit: "1kg" },
    { platform: "BB Now", price: 39, unit: "1kg" },
    { platform: "JioMart", price: 38, unit: "1kg" },
    { platform: "Amazon Fresh", price: 43, unit: "1kg" },
    { platform: "Flipkart Minutes", price: 41, unit: "1kg" },
  ],
  besan: [
    { platform: "Blinkit", price: 78, unit: "1kg" },
    { platform: "Swiggy Instamart", price: 75, unit: "1kg" },
    { platform: "Zepto", price: 74, unit: "1kg" },
    { platform: "BigBasket", price: 70, unit: "1kg" },
    { platform: "BB Now", price: 73, unit: "1kg" },
    { platform: "JioMart", price: 71, unit: "1kg" },
    { platform: "Amazon Fresh", price: 80, unit: "1kg" },
    { platform: "Flipkart Minutes", price: 77, unit: "1kg" },
  ],
  poha: [
    { platform: "Blinkit", price: 52, unit: "500g" },
    { platform: "Swiggy Instamart", price: 50, unit: "500g" },
    { platform: "Zepto", price: 48, unit: "500g" },
    { platform: "BigBasket", price: 45, unit: "500g" },
    { platform: "BB Now", price: 48, unit: "500g" },
    { platform: "JioMart", price: 46, unit: "500g" },
    { platform: "Amazon Fresh", price: 53, unit: "500g" },
    { platform: "Flipkart Minutes", price: 51, unit: "500g" },
  ],
  oats: [
    { platform: "Blinkit", price: 115, unit: "500g" },
    { platform: "Swiggy Instamart", price: 112, unit: "500g" },
    { platform: "Zepto", price: 110, unit: "500g" },
    { platform: "BigBasket", price: 105, unit: "500g" },
    { platform: "BB Now", price: 109, unit: "500g" },
    { platform: "JioMart", price: 107, unit: "500g" },
    { platform: "Amazon Fresh", price: 117, unit: "500g" },
    { platform: "Flipkart Minutes", price: 113, unit: "500g" },
  ],
  cornflakes: [
    { platform: "Blinkit", price: 165, unit: "475g" },
    { platform: "Swiggy Instamart", price: 162, unit: "475g" },
    { platform: "Zepto", price: 158, unit: "475g" },
    { platform: "BigBasket", price: 152, unit: "475g" },
    { platform: "BB Now", price: 158, unit: "475g" },
    { platform: "JioMart", price: 155, unit: "475g" },
    { platform: "Amazon Fresh", price: 168, unit: "475g" },
    { platform: "Flipkart Minutes", price: 163, unit: "475g" },
  ],
  sooji: [
    { platform: "Blinkit", price: 38, unit: "500g" },
    { platform: "Swiggy Instamart", price: 36, unit: "500g" },
    { platform: "Zepto", price: 35, unit: "500g" },
    { platform: "BigBasket", price: 33, unit: "500g" },
    { platform: "BB Now", price: 35, unit: "500g" },
    { platform: "JioMart", price: 34, unit: "500g" },
    { platform: "Amazon Fresh", price: 39, unit: "500g" },
    { platform: "Flipkart Minutes", price: 37, unit: "500g" },
  ],
  rajma: [
    { platform: "Blinkit", price: 130, unit: "1kg" },
    { platform: "Swiggy Instamart", price: 127, unit: "1kg" },
    { platform: "Zepto", price: 125, unit: "1kg" },
    { platform: "BigBasket", price: 120, unit: "1kg" },
    { platform: "BB Now", price: 124, unit: "1kg" },
    { platform: "JioMart", price: 122, unit: "1kg" },
    { platform: "Amazon Fresh", price: 132, unit: "1kg" },
    { platform: "Flipkart Minutes", price: 128, unit: "1kg" },
  ],

  // ─── Snacks & Beverages ───
  "parle-g": [
    { platform: "Blinkit", price: 10, unit: "100g" },
    { platform: "Swiggy Instamart", price: 10, unit: "100g" },
    { platform: "Zepto", price: 10, unit: "100g" },
    { platform: "BigBasket", price: 10, unit: "100g" },
    { platform: "BB Now", price: 10, unit: "100g" },
    { platform: "JioMart", price: 10, unit: "100g" },
    { platform: "Amazon Fresh", price: 10, unit: "100g" },
    { platform: "Flipkart Minutes", price: 10, unit: "100g" },
  ],
  "bourbon biscuits": [
    { platform: "Blinkit", price: 25, unit: "150g" },
    { platform: "Swiggy Instamart", price: 24, unit: "150g" },
    { platform: "Zepto", price: 23, unit: "150g" },
    { platform: "BigBasket", price: 22, unit: "150g" },
    { platform: "BB Now", price: 23, unit: "150g" },
    { platform: "JioMart", price: 22, unit: "150g" },
    { platform: "Amazon Fresh", price: 25, unit: "150g" },
    { platform: "Flipkart Minutes", price: 24, unit: "150g" },
  ],
  oreo: [
    { platform: "Blinkit", price: 35, unit: "120g" },
    { platform: "Swiggy Instamart", price: 34, unit: "120g" },
    { platform: "Zepto", price: 33, unit: "120g" },
    { platform: "BigBasket", price: 32, unit: "120g" },
    { platform: "BB Now", price: 33, unit: "120g" },
    { platform: "JioMart", price: 32, unit: "120g" },
    { platform: "Amazon Fresh", price: 35, unit: "120g" },
    { platform: "Flipkart Minutes", price: 34, unit: "120g" },
  ],
  "good day biscuits": [
    { platform: "Blinkit", price: 30, unit: "200g" },
    { platform: "Swiggy Instamart", price: 29, unit: "200g" },
    { platform: "Zepto", price: 28, unit: "200g" },
    { platform: "BigBasket", price: 27, unit: "200g" },
    { platform: "BB Now", price: 28, unit: "200g" },
    { platform: "JioMart", price: 27, unit: "200g" },
    { platform: "Amazon Fresh", price: 30, unit: "200g" },
    { platform: "Flipkart Minutes", price: 29, unit: "200g" },
  ],
  "hide & seek": [
    { platform: "Blinkit", price: 35, unit: "120g" },
    { platform: "Swiggy Instamart", price: 34, unit: "120g" },
    { platform: "Zepto", price: 33, unit: "120g" },
    { platform: "BigBasket", price: 32, unit: "120g" },
    { platform: "BB Now", price: 33, unit: "120g" },
    { platform: "JioMart", price: 32, unit: "120g" },
    { platform: "Amazon Fresh", price: 35, unit: "120g" },
    { platform: "Flipkart Minutes", price: 34, unit: "120g" },
  ],
  namkeen: [
    { platform: "Blinkit", price: 25, unit: "200g" },
    { platform: "Swiggy Instamart", price: 24, unit: "200g" },
    { platform: "Zepto", price: 23, unit: "200g" },
    { platform: "BigBasket", price: 22, unit: "200g" },
    { platform: "BB Now", price: 23, unit: "200g" },
    { platform: "JioMart", price: 22, unit: "200g" },
    { platform: "Amazon Fresh", price: 25, unit: "200g" },
    { platform: "Flipkart Minutes", price: 24, unit: "200g" },
  ],
  haldirams: [
    { platform: "Blinkit", price: 45, unit: "200g" },
    { platform: "Swiggy Instamart", price: 44, unit: "200g" },
    { platform: "Zepto", price: 43, unit: "200g" },
    { platform: "BigBasket", price: 42, unit: "200g" },
    { platform: "BB Now", price: 43, unit: "200g" },
    { platform: "JioMart", price: 42, unit: "200g" },
    { platform: "Amazon Fresh", price: 46, unit: "200g" },
    { platform: "Flipkart Minutes", price: 45, unit: "200g" },
  ],
  frooti: [
    { platform: "Blinkit", price: 20, unit: "200ml" },
    { platform: "Swiggy Instamart", price: 20, unit: "200ml" },
    { platform: "Zepto", price: 19, unit: "200ml" },
    { platform: "BigBasket", price: 18, unit: "200ml" },
    { platform: "BB Now", price: 20, unit: "200ml" },
    { platform: "JioMart", price: 18, unit: "200ml" },
    { platform: "Amazon Fresh", price: 20, unit: "200ml" },
    { platform: "Flipkart Minutes", price: 20, unit: "200ml" },
  ],
  "real juice": [
    { platform: "Blinkit", price: 115, unit: "1L" },
    { platform: "Swiggy Instamart", price: 112, unit: "1L" },
    { platform: "Zepto", price: 110, unit: "1L" },
    { platform: "BigBasket", price: 106, unit: "1L" },
    { platform: "BB Now", price: 110, unit: "1L" },
    { platform: "JioMart", price: 108, unit: "1L" },
    { platform: "Amazon Fresh", price: 117, unit: "1L" },
    { platform: "Flipkart Minutes", price: 113, unit: "1L" },
  ],
  "amul lassi": [
    { platform: "Blinkit", price: 30, unit: "200ml" },
    { platform: "Swiggy Instamart", price: 29, unit: "200ml" },
    { platform: "Zepto", price: 28, unit: "200ml" },
    { platform: "BigBasket", price: 27, unit: "200ml" },
    { platform: "BB Now", price: 28, unit: "200ml" },
    { platform: "JioMart", price: 27, unit: "200ml" },
    { platform: "Amazon Fresh", price: 31, unit: "200ml" },
    { platform: "Flipkart Minutes", price: 30, unit: "200ml" },
  ],
  "cold drink": [
    { platform: "Blinkit", price: 65, unit: "1L" },
    { platform: "Swiggy Instamart", price: 63, unit: "1L" },
    { platform: "Zepto", price: 62, unit: "1L" },
    { platform: "BigBasket", price: 60, unit: "1L" },
    { platform: "BB Now", price: 62, unit: "1L" },
    { platform: "JioMart", price: 60, unit: "1L" },
    { platform: "Amazon Fresh", price: 66, unit: "1L" },
    { platform: "Flipkart Minutes", price: 64, unit: "1L" },
  ],
  cola: [
    { platform: "Blinkit", price: 65, unit: "1L" },
    { platform: "Swiggy Instamart", price: 63, unit: "1L" },
    { platform: "Zepto", price: 62, unit: "1L" },
    { platform: "BigBasket", price: 60, unit: "1L" },
    { platform: "BB Now", price: 62, unit: "1L" },
    { platform: "JioMart", price: 60, unit: "1L" },
    { platform: "Amazon Fresh", price: 66, unit: "1L" },
    { platform: "Flipkart Minutes", price: 64, unit: "1L" },
  ],

  // ─── Household & Personal Care ───
  "surf excel": [
    { platform: "Blinkit", price: 148, unit: "1kg" },
    { platform: "Swiggy Instamart", price: 145, unit: "1kg" },
    { platform: "Zepto", price: 142, unit: "1kg" },
    { platform: "BigBasket", price: 138, unit: "1kg" },
    { platform: "BB Now", price: 143, unit: "1kg" },
    { platform: "JioMart", price: 140, unit: "1kg" },
    { platform: "Amazon Fresh", price: 150, unit: "1kg" },
    { platform: "Flipkart Minutes", price: 146, unit: "1kg" },
  ],
  ariel: [
    { platform: "Blinkit", price: 175, unit: "1kg" },
    { platform: "Swiggy Instamart", price: 172, unit: "1kg" },
    { platform: "Zepto", price: 169, unit: "1kg" },
    { platform: "BigBasket", price: 165, unit: "1kg" },
    { platform: "BB Now", price: 170, unit: "1kg" },
    { platform: "JioMart", price: 167, unit: "1kg" },
    { platform: "Amazon Fresh", price: 178, unit: "1kg" },
    { platform: "Flipkart Minutes", price: 174, unit: "1kg" },
  ],
  "vim dish wash": [
    { platform: "Blinkit", price: 58, unit: "500ml" },
    { platform: "Swiggy Instamart", price: 56, unit: "500ml" },
    { platform: "Zepto", price: 54, unit: "500ml" },
    { platform: "BigBasket", price: 52, unit: "500ml" },
    { platform: "BB Now", price: 55, unit: "500ml" },
    { platform: "JioMart", price: 53, unit: "500ml" },
    { platform: "Amazon Fresh", price: 59, unit: "500ml" },
    { platform: "Flipkart Minutes", price: 57, unit: "500ml" },
  ],
  harpic: [
    { platform: "Blinkit", price: 75, unit: "500ml" },
    { platform: "Swiggy Instamart", price: 73, unit: "500ml" },
    { platform: "Zepto", price: 71, unit: "500ml" },
    { platform: "BigBasket", price: 68, unit: "500ml" },
    { platform: "BB Now", price: 72, unit: "500ml" },
    { platform: "JioMart", price: 70, unit: "500ml" },
    { platform: "Amazon Fresh", price: 76, unit: "500ml" },
    { platform: "Flipkart Minutes", price: 74, unit: "500ml" },
  ],
  lizol: [
    { platform: "Blinkit", price: 98, unit: "500ml" },
    { platform: "Swiggy Instamart", price: 95, unit: "500ml" },
    { platform: "Zepto", price: 93, unit: "500ml" },
    { platform: "BigBasket", price: 90, unit: "500ml" },
    { platform: "BB Now", price: 94, unit: "500ml" },
    { platform: "JioMart", price: 92, unit: "500ml" },
    { platform: "Amazon Fresh", price: 99, unit: "500ml" },
    { platform: "Flipkart Minutes", price: 97, unit: "500ml" },
  ],
  "whisper pads": [
    { platform: "Blinkit", price: 128, unit: "15 pcs" },
    { platform: "Swiggy Instamart", price: 125, unit: "15 pcs" },
    { platform: "Zepto", price: 122, unit: "15 pcs" },
    { platform: "BigBasket", price: 118, unit: "15 pcs" },
    { platform: "BB Now", price: 123, unit: "15 pcs" },
    { platform: "JioMart", price: 120, unit: "15 pcs" },
    { platform: "Amazon Fresh", price: 130, unit: "15 pcs" },
    { platform: "Flipkart Minutes", price: 126, unit: "15 pcs" },
    { platform: "Nykaa", price: 115, unit: "15 pcs" },
  ],
  pampers: [
    { platform: "Blinkit", price: 395, unit: "50 pcs" },
    { platform: "Swiggy Instamart", price: 388, unit: "50 pcs" },
    { platform: "Zepto", price: 382, unit: "50 pcs" },
    { platform: "BigBasket", price: 375, unit: "50 pcs" },
    { platform: "BB Now", price: 382, unit: "50 pcs" },
    { platform: "JioMart", price: 378, unit: "50 pcs" },
    { platform: "Amazon Fresh", price: 398, unit: "50 pcs" },
    { platform: "Flipkart Minutes", price: 392, unit: "50 pcs" },
  ],
  "gillette razor": [
    { platform: "Blinkit", price: 185, unit: "1 pc" },
    { platform: "Swiggy Instamart", price: 182, unit: "1 pc" },
    { platform: "Zepto", price: 178, unit: "1 pc" },
    { platform: "BigBasket", price: 172, unit: "1 pc" },
    { platform: "BB Now", price: 178, unit: "1 pc" },
    { platform: "JioMart", price: 175, unit: "1 pc" },
    { platform: "Amazon Fresh", price: 188, unit: "1 pc" },
    { platform: "Flipkart Minutes", price: 184, unit: "1 pc" },
    { platform: "Nykaa", price: 170, unit: "1 pc" },
  ],
  "old spice deodorant": [
    { platform: "Blinkit", price: 198, unit: "150ml" },
    { platform: "Swiggy Instamart", price: 195, unit: "150ml" },
    { platform: "Zepto", price: 192, unit: "150ml" },
    { platform: "BigBasket", price: 188, unit: "150ml" },
    { platform: "BB Now", price: 193, unit: "150ml" },
    { platform: "JioMart", price: 190, unit: "150ml" },
    { platform: "Amazon Fresh", price: 200, unit: "150ml" },
    { platform: "Flipkart Minutes", price: 196, unit: "150ml" },
    { platform: "Nykaa", price: 185, unit: "150ml" },
  ],
  "parachute hair oil": [
    { platform: "Blinkit", price: 88, unit: "200ml" },
    { platform: "Swiggy Instamart", price: 86, unit: "200ml" },
    { platform: "Zepto", price: 84, unit: "200ml" },
    { platform: "BigBasket", price: 81, unit: "200ml" },
    { platform: "BB Now", price: 84, unit: "200ml" },
    { platform: "JioMart", price: 82, unit: "200ml" },
    { platform: "Amazon Fresh", price: 89, unit: "200ml" },
    { platform: "Flipkart Minutes", price: 87, unit: "200ml" },
    { platform: "Nykaa", price: 79, unit: "200ml" },
  ],
};

function getPriceData(
  query: string,
): Map<string, { price: number; unit: string }> | null {
  const q = query.toLowerCase().trim();
  // Exact match
  if (PRODUCT_PRICES[q]) {
    const map = new Map<string, { price: number; unit: string }>();
    for (const entry of PRODUCT_PRICES[q]) {
      map.set(entry.platform, { price: entry.price, unit: entry.unit });
    }
    return map;
  }
  // Partial match
  for (const key of Object.keys(PRODUCT_PRICES)) {
    if (q.includes(key) || key.includes(q)) {
      const map = new Map<string, { price: number; unit: string }>();
      for (const entry of PRODUCT_PRICES[key]) {
        map.set(entry.platform, { price: entry.price, unit: entry.unit });
      }
      return map;
    }
  }
  return null;
}

const SUGGESTIONS = [
  "Maggi",
  "Banana",
  "Chicken",
  "Toor Dal",
  "Parle-G",
  "Surf Excel",
  "Paneer",
  "Oreo",
  "Carrots",
  "Amul Butter",
];
const STORAGE_KEY = "quickcart_recent_searches";
const MAX_RECENT = 5;

function loadRecent(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveRecent(searches: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
  } catch {
    // ignore
  }
}

export default function App() {
  const [query, setQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [recent, setRecent] = useState<string[]>(loadRecent);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(
    (searchTerm: string) => {
      const trimmed = searchTerm.trim();
      if (!trimmed) return;
      setActiveQuery(trimmed);
      setQuery(trimmed);
      const updated = [trimmed, ...recent.filter((r) => r !== trimmed)].slice(
        0,
        MAX_RECENT,
      );
      setRecent(updated);
      saveRecent(updated);
    },
    [recent],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      handleSearch(query);
    },
    [query, handleSearch],
  );

  const handleRecentClick = useCallback(
    (term: string) => {
      setQuery(term);
      handleSearch(term);
    },
    [handleSearch],
  );

  const clearRecent = useCallback(() => {
    setRecent([]);
    saveRecent([]);
  }, []);

  const openAll = useCallback(() => {
    if (!activeQuery) return;
    const encoded = encodeURIComponent(activeQuery);
    for (const p of PLATFORMS) {
      window.open(p.url(encoded), "_blank", "noopener,noreferrer");
    }
  }, [activeQuery]);

  // Compute price data and sorted platforms
  const { priceMap, sortedPlatforms, cheapestPlatform } = useMemo(() => {
    if (!activeQuery) {
      return {
        priceMap: null,
        sortedPlatforms: PLATFORMS,
        cheapestPlatform: null,
      };
    }
    const map = getPriceData(activeQuery);
    if (!map) {
      return {
        priceMap: null,
        sortedPlatforms: PLATFORMS,
        cheapestPlatform: null,
      };
    }

    let cheapest: string | null = null;
    let cheapestPrice = Number.POSITIVE_INFINITY;
    for (const [platform, data] of map.entries()) {
      if (data.price < cheapestPrice) {
        cheapestPrice = data.price;
        cheapest = platform;
      }
    }

    const sorted = [...PLATFORMS].sort((a, b) => {
      const pa = map.get(a.name)?.price ?? Number.POSITIVE_INFINITY;
      const pb = map.get(b.name)?.price ?? Number.POSITIVE_INFINITY;
      return pa - pb;
    });

    return {
      priceMap: map,
      sortedPlatforms: sorted,
      cheapestPlatform: cheapest,
    };
  }, [activeQuery]);

  return (
    <div className="min-h-screen bg-background font-body">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-md bg-background/80 sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <span className="font-display font-bold text-lg text-foreground tracking-tight">
              Quick<span className="text-primary">Cart</span>
            </span>
            <Badge
              variant="secondary"
              className="text-[10px] px-1.5 py-0 h-4 font-body"
            >
              🇮🇳 India
            </Badge>
          </div>
          <p className="text-muted-foreground text-xs hidden sm:block">
            Compare prices across 10 delivery apps
          </p>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.18 0.025 265) 0%, oklch(0.14 0.03 280) 50%, oklch(0.18 0.02 250) 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("/assets/generated/hero-bg.dim_1600x600.jpg")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 80%, oklch(0.78 0.16 75 / 0.08) 0%, transparent 70%)",
          }}
        />

        <div className="relative container max-w-3xl mx-auto px-4 py-16 sm:py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3 font-body">
              🛒 India's Quick Commerce Comparator
            </p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground mb-4 leading-tight">
              Find the <span className="text-primary">best price</span>
              <br className="hidden sm:block" /> across all apps
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg mb-10 max-w-xl mx-auto font-body">
              Search once, compare on Blinkit, Zepto, Swiggy Instamart & 7 more
              delivery apps — instantly.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          >
            <form onSubmit={handleSubmit}>
              <div className="flex gap-2 search-glow rounded-xl bg-card border border-border/70 p-1.5 transition-all duration-300">
                <div className="flex-1 flex items-center gap-2 px-2">
                  <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <Input
                    ref={inputRef}
                    data-ocid="search.search_input"
                    type="text"
                    placeholder="Search for milk, banana, dal, surf excel…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="border-0 bg-transparent shadow-none focus-visible:ring-0 text-base placeholder:text-muted-foreground/60 font-body h-10"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <Button
                  data-ocid="search.primary_button"
                  type="submit"
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-display font-bold px-6 rounded-lg h-10 gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">Compare</span>
                </Button>
              </div>
            </form>

            {/* Recent searches */}
            <AnimatePresence>
              {recent.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-wrap items-center gap-2 mt-4 justify-center"
                >
                  <span className="text-muted-foreground text-xs font-body">
                    Recent:
                  </span>
                  {recent.map((term, i) => (
                    <button
                      key={term}
                      type="button"
                      data-ocid={`recent.item.${i + 1}`}
                      onClick={() => handleRecentClick(term)}
                      className="text-xs px-3 py-1 rounded-full bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50 transition-all duration-150 font-body"
                    >
                      {term}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={clearRecent}
                    className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors font-body"
                  >
                    Clear
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container max-w-6xl mx-auto px-4 py-10">
        {/* Status bar */}
        <div className="flex items-center justify-between mb-2">
          <div>
            {activeQuery ? (
              <motion.div
                key={activeQuery}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2"
              >
                <ShoppingCart className="w-4 h-4 text-primary" />
                <span className="text-foreground font-display font-semibold">
                  Results for{" "}
                  <span className="text-primary">
                    &ldquo;{activeQuery}&rdquo;
                  </span>
                </span>
                <Badge variant="outline" className="text-xs border-border">
                  {PLATFORMS.length} apps
                </Badge>
              </motion.div>
            ) : (
              <p className="text-muted-foreground text-sm font-body">
                Enter a product above to compare prices across all platforms
              </p>
            )}
          </div>
          {activeQuery && (
            <Button
              onClick={openAll}
              variant="outline"
              size="sm"
              className="gap-1.5 border-border text-muted-foreground hover:text-foreground text-xs font-body"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open all
            </Button>
          )}
        </div>

        {/* Disclaimer */}
        {activeQuery && (
          <motion.p
            key={`disclaimer-${activeQuery}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-muted-foreground/60 text-xs font-body mb-6 italic"
          >
            * Prices are indicative and may vary. Tap to check live price on the
            app.
          </motion.p>
        )}
        {!activeQuery && <div className="mb-6" />}

        {/* Platform cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedPlatforms.map((platform, index) => {
            const encoded = activeQuery ? encodeURIComponent(activeQuery) : "";
            const href = encoded ? platform.url(encoded) : "#";
            const priceInfo = priceMap?.get(platform.name);
            const isCheapest = cheapestPlatform === platform.name;

            return (
              <motion.div
                key={platform.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                  ease: "easeOut",
                }}
                className="platform-card"
              >
                <div
                  className="relative rounded-xl border border-border/60 bg-card overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300"
                  style={{
                    borderLeftColor: platform.color,
                    borderLeftWidth: "4px",
                  }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5 opacity-60"
                    style={{ background: platform.color }}
                  />

                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                          style={{ background: `${platform.color}22` }}
                        >
                          {platform.logo}
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-foreground text-sm leading-tight flex items-center gap-1.5">
                            {platform.name}
                            {isCheapest && priceInfo && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 leading-none">
                                ✓ Best Price
                              </span>
                            )}
                          </h3>
                          <p className="text-muted-foreground text-xs mt-0.5 font-body">
                            {platform.tagline}
                          </p>
                        </div>
                      </div>
                      <div
                        className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold flex-shrink-0"
                        style={{
                          background: `${platform.color}22`,
                          color: platform.color,
                        }}
                      >
                        <Clock className="w-3 h-3" />
                        {platform.delivery}
                      </div>
                    </div>

                    {/* Price display */}
                    {activeQuery && (
                      <div
                        data-ocid={`platform.card.price.${index + 1}`}
                        className="mb-3"
                      >
                        {priceInfo ? (
                          <div
                            className="flex items-center gap-3 px-3 py-2 rounded-lg"
                            style={{ background: `${platform.color}12` }}
                          >
                            <div>
                              <p className="text-xl font-bold text-foreground font-display leading-none">
                                ₹{priceInfo.price}
                              </p>
                              <p className="text-muted-foreground text-xs mt-0.5 font-body">
                                {priceInfo.unit}
                              </p>
                            </div>
                            {isCheapest && (
                              <div className="ml-auto">
                                <span className="inline-flex items-center gap-0.5 px-2 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                  🏷️ Cheapest
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-muted-foreground/50 text-xs font-body italic px-1">
                            Price unavailable — check on app
                          </p>
                        )}
                      </div>
                    )}

                    {activeQuery ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-ocid={`platform.button.${index + 1}`}
                      >
                        <Button
                          className="w-full gap-2 font-body font-semibold text-sm h-9 rounded-lg transition-all duration-200"
                          style={{
                            background: platform.color,
                            color: platform.textColor,
                            border: "none",
                          }}
                        >
                          <span>Search on {platform.name}</span>
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </a>
                    ) : (
                      <Button
                        data-ocid={`platform.button.${index + 1}`}
                        disabled
                        variant="secondary"
                        className="w-full font-body font-semibold text-sm h-9 rounded-lg gap-1.5"
                      >
                        <Search className="w-3.5 h-3.5" />
                        Search on {platform.name}
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty state */}
        {!activeQuery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-10 text-center"
            data-ocid="search.empty_state"
          >
            <div className="inline-flex flex-col items-center gap-3 py-8 px-10 rounded-2xl border border-dashed border-border/60 bg-muted/20">
              <div className="text-4xl">🔍</div>
              <p className="text-muted-foreground font-body text-sm max-w-xs">
                Type a product name in the search bar above — we&apos;ll show
                you direct links to buy it on all 10 quick delivery apps.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleSearch(s)}
                    className="text-xs px-3 py-1.5 rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-colors font-body"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-16 py-8">
        <div className="container max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-muted-foreground text-xs font-body">
            © {new Date().getFullYear()} QuickCart India. Compare prices, shop
            smarter.
          </p>
          <p className="text-muted-foreground text-xs font-body">
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary/70 hover:text-primary transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
