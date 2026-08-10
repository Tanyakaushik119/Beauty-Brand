import React, { useState, useMemo, useRef } from "react";
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  Check,
  ArrowLeft,
  Package,
  ChevronRight,
} from "lucide-react";

/* =========================================================================
   DATA
   A single source of truth for the catalog. In a real build this would come
   from an API — here it's a static array so the demo runs with zero backend.
========================================================================= */

const PRODUCTS = [
  {
    id: 1,
    name: "Velvet Matte Lipstick",
    shade: "Rosewood",
    category: "Lips",
    price: 24,
    color: "#A63A50",
    description:
      "A weightless matte that lasts through coffee, lunch, and everything after. Built on a cushiony base so it never pulls or cakes into lip lines.",
    image:
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&h=500&fit=crop",
  },
  {
    id: 2,
    name: "Sheer Gloss Tint",
    shade: "Petal",
    category: "Lips",
    price: 18,
    color: "#E8A0A0",
    description:
      "Buildable, glassy shine with a barely-there wash of colour. Infused with jojoba oil so lips stay soft, not sticky.",
    image: "https://loremflickr.com/500/500/lipgloss,cosmetics?lock=12",
  },
  {
    id: 3,
    name: "Featherlight Foundation",
    shade: "Bisque 03",
    category: "Face",
    price: 32,
    color: "#E8C39E",
    description:
      "Skin-like coverage that breathes. Buildable from a sheer wash to full coverage without ever looking like you're wearing much.",
    image: "https://loremflickr.com/500/500/foundation,makeup?lock=13",
  },
  {
    id: 4,
    name: "Silk Setting Powder",
    shade: "Translucent",
    category: "Face",
    price: 26,
    color: "#F2E4D0",
    description:
      "Blurs pores, controls shine, and locks everything underneath in place — without ever looking cakey or dry.",
    image: "https://loremflickr.com/500/500/powder,makeup?lock=14",
  },
  {
    id: 5,
    name: "Prism Eyeshadow Palette",
    shade: "9-pan, warm neutrals",
    category: "Eyes",
    price: 48,
    color: "#B8834D",
    description:
      "Matte and shimmer pairings built for one-swipe eyes. Highly pigmented, finely milled, and blends without patchiness.",
    image: "https://loremflickr.com/500/500/eyeshadow,palette?lock=15",
  },
  {
    id: 6,
    name: "Volume Mascara",
    shade: "Noir",
    category: "Eyes",
    price: 22,
    color: "#1C1410",
    description:
      "Clump-free volume that holds a curl till midnight. The hourglass brush catches every lash, even the tiny corner ones.",
    image:
      "https://images.unsplash.com/photo-1631214524020-7e18db9e7c65?w=500&h=500&fit=crop",
  },
  {
    id: 7,
    name: "Dew Drop Highlighter",
    shade: "Champagne",
    category: "Face",
    price: 28,
    color: "#D9B98C",
    description:
      "A wet-look glow pressed into a fine, gold-flecked powder. Sits on top of skin instead of soaking in.",
    image: "https://loremflickr.com/500/500/highlighter,makeup?lock=17",
  },
  {
    id: 8,
    name: "Botanical Radiance Serum",
    shade: "All skin types",
    category: "Skincare",
    price: 38,
    color: "#C7D9B8",
    description:
      "Vitamin C, squalane, and a touch of niacinamide for next-morning glow. Lightweight enough to wear under makeup.",
    image: "https://loremflickr.com/500/500/serum,skincare?lock=18",
  },
  {
    id: 9,
    name: "Amber Bloom Eau de Parfum",
    shade: "50ml",
    category: "Fragrance",
    price: 68,
    color: "#B8834D",
    description:
      "Warm amber, fig, and a whisper of sandalwood. Opens bright, settles into something quieter by the second hour.",
    image: "https://loremflickr.com/500/500/perfume,bottle?lock=19",
  },
  {
    id: 10,
    name: "Precision Brush Set",
    shade: "7-piece, cruelty-free",
    category: "Tools",
    price: 34,
    color: "#5C2A3D",
    description:
      "Synthetic bristles for flawless blending — face, crease, and liner in one roll-up set. Machine washable.",
    image: "https://loremflickr.com/500/500/makeupbrush,cosmetics?lock=20",
  },
];

const CATEGORIES = [
  "All",
  "Lips",
  "Eyes",
  "Face",
  "Skincare",
  "Fragrance",
  "Tools",
];

const getProduct = (id) => PRODUCTS.find((p) => p.id === id);
const formatPrice = (n) => `$${n.toFixed(2)}`;

/* =========================================================================
   GLOBAL STYLES
   Design tokens for "Blush & Bone": warm blush-ink palette instead of the
   default cream/terracotta combo, Fraunces for display type, Manrope for
   everything functional. Injected once at the root of the artifact.
========================================================================= */

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..600;1,9..144,400..600&family=Manrope:wght@400;500;600;700;800&display=swap');

      :root{
        --ink:#1C1410;
        --bone:#F5EDE8;
        --card:#FBF7F3;
        --blush:#D98C88;
        --plum:#5C2A3D;
        --plum-dark:#43101F;
        --copper:#B8834D;
        --line:rgba(28,20,16,0.12);
        --muted:rgba(28,20,16,0.58);
      }
      *{box-sizing:border-box;}
      .bb-root{
        font-family:'Manrope',sans-serif;
        background:var(--bone);
        color:var(--ink);
        min-height:100vh;
        display:flex;
        flex-direction:column;
      }
      .bb-root h1,.bb-root h2,.bb-root h3,.bb-serif{
        font-family:'Fraunces',serif;
        font-weight:500;
        letter-spacing:-0.01em;
        margin:0;
      }
      .eyebrow{
        font-family:'Manrope',sans-serif;
        font-size:11px;
        font-weight:700;
        letter-spacing:0.14em;
        text-transform:uppercase;
        color:var(--copper);
      }
      button{font-family:inherit;cursor:pointer;}
      .btn{
        border:none;
        border-radius:3px;
        padding:12px 20px;
        font-size:13px;
        font-weight:700;
        letter-spacing:0.03em;
        text-transform:uppercase;
        transition:transform .15s ease, background .15s ease, opacity .15s ease;
      }
      .btn:active{transform:scale(0.97);}
      .btn-primary{background:var(--plum);color:var(--bone);}
      .btn-primary:hover{background:var(--plum-dark);}
      .btn-primary:disabled{opacity:0.4;cursor:not-allowed;}
      .btn-ghost{background:transparent;color:var(--ink);border:1px solid var(--line);}
      .btn-ghost:hover{border-color:var(--ink);}

      /* ---------- Header ---------- */
      .bb-header{
        position:sticky;top:0;z-index:40;
        background:rgba(245,237,232,0.92);
        backdrop-filter:blur(8px);
        border-bottom:1px solid var(--line);
      }
      .bb-header-inner{
        max-width:1180px;margin:0 auto;padding:18px 28px;
        display:flex;align-items:center;justify-content:space-between;
      }
      .bb-logo{
        font-family:'Fraunces',serif;font-style:italic;font-weight:500;
        font-size:1.5rem;letter-spacing:-0.01em;color:var(--ink);
        background:none;border:none;padding:0;
      }
      .bb-nav{display:flex;align-items:center;gap:28px;}
      .bb-navlink{
        background:none;border:none;padding:4px 0;color:var(--ink);
        font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;
        border-bottom:2px solid transparent;
      }
      .bb-navlink.active{border-color:var(--plum);color:var(--plum);}
      .bb-cart-btn{
        position:relative;background:none;border:none;color:var(--ink);
        display:flex;align-items:center;padding:6px;
      }
      .bb-cart-badge{
        position:absolute;top:-4px;right:-4px;background:var(--plum);color:var(--bone);
        font-size:10px;font-weight:800;border-radius:50%;min-width:17px;height:17px;
        display:flex;align-items:center;justify-content:center;padding:0 2px;
      }

      /* ---------- Hero ---------- */
      .bb-hero{max-width:1180px;margin:0 auto;padding:72px 28px 40px;text-align:center;}
      .bb-hero h1{font-size:clamp(2.4rem,5vw,3.6rem);font-style:italic;line-height:1.08;}
      .bb-hero p{
        max-width:480px;margin:18px auto 28px;color:var(--muted);
        font-size:15px;line-height:1.6;
      }
      .bb-swatchstrip{
        margin-top:52px;display:flex;flex-direction:column;align-items:center;gap:14px;
      }
      .bb-swatchrow{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;max-width:420px;}
      .bb-swatch{width:22px;height:22px;border-radius:50%;border:1px solid rgba(28,20,16,0.15);}
      .bb-swatchlabel{font-size:11px;color:var(--muted);letter-spacing:0.06em;text-transform:uppercase;}

      /* ---------- Category filter ---------- */
      .bb-filters{
        max-width:1180px;margin:0 auto;padding:0 28px 28px;
        display:flex;gap:10px;flex-wrap:wrap;justify-content:center;
      }
      .bb-pill{
        border:1px solid var(--line);background:var(--card);color:var(--ink);
        border-radius:999px;padding:8px 18px;font-size:12px;font-weight:700;
        letter-spacing:0.05em;text-transform:uppercase;
      }
      .bb-pill.active{background:var(--plum);border-color:var(--plum);color:var(--bone);}

      /* ---------- Product grid ---------- */
      .bb-grid{
        max-width:1180px;margin:0 auto;padding:0 28px 80px;
        display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:26px;
      }
      .bb-card{
        background:var(--card);border:1px solid var(--line);border-radius:6px;
        overflow:hidden;display:flex;flex-direction:column;
      }
      .bb-card-imgwrap{position:relative;aspect-ratio:1/1;overflow:hidden;background:#e9ddd3;cursor:pointer;}
      .bb-card-imgwrap img{
        width:100%;height:100%;object-fit:cover;display:block;
        transition:transform .5s ease;
      }
      .bb-card-imgwrap:hover img{transform:scale(1.06);}
      .bb-card-swatch{
        position:absolute;bottom:10px;left:10px;width:18px;height:18px;border-radius:50%;
        border:2px solid var(--bone);box-shadow:0 1px 3px rgba(0,0,0,0.25);
      }
      .bb-card-body{padding:16px;display:flex;flex-direction:column;gap:4px;flex:1;}
      .bb-card-name{
        font-family:'Fraunces',serif;font-style:italic;font-size:1.05rem;font-weight:500;
        cursor:pointer;
      }
      .bb-card-shade{font-size:12px;color:var(--muted);}
      .bb-card-footer{
        margin-top:10px;display:flex;align-items:center;justify-content:space-between;gap:10px;
      }
      .bb-price{font-weight:800;font-size:14px;}
      .bb-add-btn{
        background:var(--plum);color:var(--bone);border:none;border-radius:3px;
        padding:9px 14px;font-size:11px;font-weight:800;letter-spacing:0.06em;
        text-transform:uppercase;display:flex;align-items:center;gap:6px;flex:1;justify-content:center;
      }
      .bb-add-btn:hover{background:var(--plum-dark);}
      .bb-stepper{
        display:flex;align-items:center;justify-content:space-between;gap:8px;
        border:1px solid var(--line);border-radius:3px;padding:4px 6px;flex:1;background:var(--bone);
      }
      .bb-stepper button{background:none;border:none;color:var(--ink);display:flex;padding:4px;}
      .bb-stepper span{font-size:13px;font-weight:700;min-width:16px;text-align:center;}

      /* ---------- Quick view modal ---------- */
      .bb-overlay{
        position:fixed;inset:0;background:rgba(28,20,16,0.55);z-index:60;
        display:flex;align-items:center;justify-content:center;padding:20px;
      }
      .bb-modal{
        background:var(--bone);max-width:800px;width:100%;max-height:90vh;overflow:auto;
        border-radius:6px;display:grid;grid-template-columns:1fr 1fr;position:relative;
      }
      @media (max-width:640px){ .bb-modal{grid-template-columns:1fr;} }
      .bb-modal-close{
        position:absolute;top:14px;right:14px;background:var(--bone);border:1px solid var(--line);
        border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;
        z-index:2;
      }
      .bb-modal-img{aspect-ratio:1/1;overflow:hidden;background:#e9ddd3;}
      .bb-modal-img img{width:100%;height:100%;object-fit:cover;}
      .bb-modal-body{padding:32px;display:flex;flex-direction:column;gap:10px;}
      .bb-modal-body h2{font-size:1.7rem;font-style:italic;}
      .bb-modal-desc{font-size:14px;line-height:1.7;color:var(--muted);margin:6px 0 8px;}
      .bb-shaderow{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--muted);}

      /* ---------- Cart drawer ---------- */
      .bb-drawer-overlay{position:fixed;inset:0;background:rgba(28,20,16,0.45);z-index:50;}
      .bb-drawer{
        position:fixed;top:0;right:0;height:100%;width:min(400px,100%);background:var(--bone);
        z-index:55;display:flex;flex-direction:column;box-shadow:-8px 0 30px rgba(0,0,0,0.15);
        transform:translateX(100%);transition:transform .3s ease;
      }
      .bb-drawer.open{transform:translateX(0);}
      .bb-drawer-header{
        padding:22px 24px;border-bottom:1px solid var(--line);
        display:flex;align-items:center;justify-content:space-between;
      }
      .bb-drawer-list{flex:1;overflow-y:auto;padding:8px 24px;}
      .bb-cartline{display:flex;gap:12px;padding:16px 0;border-bottom:1px solid var(--line);}
      .bb-cartline img{width:64px;height:64px;object-fit:cover;border-radius:4px;flex-shrink:0;}
      .bb-cartline-info{flex:1;display:flex;flex-direction:column;gap:4px;}
      .bb-cartline-top{display:flex;justify-content:space-between;gap:8px;}
      .bb-cartline-name{font-family:'Fraunces',serif;font-style:italic;font-size:14px;}
      .bb-cartline-shade{font-size:11px;color:var(--muted);display:flex;align-items:center;gap:6px;}
      .bb-remove-btn{background:none;border:none;color:var(--muted);}
      .bb-remove-btn:hover{color:var(--plum);}
      .bb-drawer-footer{padding:20px 24px;border-top:1px solid var(--line);}
      .bb-subtotal-row{display:flex;justify-content:space-between;font-size:14px;margin-bottom:6px;}
      .bb-subtotal-row.total{font-weight:800;font-size:16px;margin:12px 0;}
      .bb-shipnote{font-size:11px;color:var(--muted);margin-bottom:14px;}

      /* ---------- Empty state ---------- */
      .bb-empty{
        flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;
        text-align:center;padding:40px 20px;color:var(--muted);gap:12px;
      }
      .bb-empty svg{opacity:0.35;}

      /* ---------- Checkout ---------- */
      .bb-checkout{max-width:1000px;margin:0 auto;padding:40px 28px 100px;}
      .bb-back{
        display:flex;align-items:center;gap:6px;background:none;border:none;color:var(--muted);
        font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;margin-bottom:24px;
      }
      .bb-checkout-grid{display:grid;grid-template-columns:1.3fr 1fr;gap:48px;align-items:start;}
      @media (max-width:760px){ .bb-checkout-grid{grid-template-columns:1fr;} }
      .bb-field{display:flex;flex-direction:column;gap:6px;margin-bottom:16px;}
      .bb-field label{font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:var(--muted);}
      .bb-field input{
        border:1px solid var(--line);border-radius:3px;padding:11px 12px;font-size:14px;
        background:var(--card);color:var(--ink);font-family:inherit;
      }
      .bb-field input:focus{outline:2px solid var(--plum);outline-offset:1px;}
      .bb-field.error input{border-color:#a33;}
      .bb-fielderr{font-size:11px;color:#a33;}
      .bb-fieldrow{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
      .bb-summary-card{
        background:var(--card);border:1px solid var(--line);border-radius:6px;padding:22px;
      }
      .bb-summary-line{display:flex;gap:10px;align-items:center;padding:10px 0;border-bottom:1px solid var(--line);}
      .bb-summary-line img{width:44px;height:44px;object-fit:cover;border-radius:4px;}
      .bb-summary-line .name{font-size:13px;font-family:'Fraunces',serif;font-style:italic;}
      .bb-summary-line .meta{font-size:11px;color:var(--muted);}
      .bb-demo-note{
        font-size:11px;color:var(--muted);background:var(--bone);border:1px dashed var(--line);
        border-radius:4px;padding:10px 12px;margin-top:6px;
      }

      /* ---------- Confirmation ---------- */
      .bb-confirm{max-width:560px;margin:60px auto 100px;text-align:center;padding:0 24px;}
      .bb-confirm-icon{
        width:64px;height:64px;border-radius:50%;background:var(--plum);color:var(--bone);
        display:flex;align-items:center;justify-content:center;margin:0 auto 22px;
      }
      .bb-confirm h1{font-size:2rem;font-style:italic;margin-bottom:8px;}
      .bb-confirm-meta{color:var(--muted);font-size:13px;margin-bottom:28px;}
      .bb-confirm-card{
        background:var(--card);border:1px solid var(--line);border-radius:6px;
        padding:20px;text-align:left;margin-bottom:28px;
      }
      .bb-confirm-actions{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;}

      /* ---------- Orders ---------- */
      .bb-orders{max-width:800px;margin:0 auto;padding:40px 28px 100px;}
      .bb-order-card{
        background:var(--card);border:1px solid var(--line);border-radius:6px;
        padding:20px 22px;margin-bottom:16px;
      }
      .bb-order-top{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap;}
      .bb-order-id{font-family:'Fraunces',serif;font-style:italic;font-size:1.1rem;}
      .bb-order-date{font-size:12px;color:var(--muted);margin-top:2px;}
      .bb-status-pill{
        background:rgba(92,42,61,0.1);color:var(--plum);border-radius:999px;
        padding:5px 12px;font-size:10px;font-weight:800;letter-spacing:0.06em;text-transform:uppercase;
        white-space:nowrap;
      }
      .bb-order-items{font-size:12px;color:var(--muted);margin-top:10px;line-height:1.6;}
      .bb-order-total{margin-top:12px;font-weight:800;font-size:14px;}

      /* ---------- Toast ---------- */
      .bb-toast{
        position:fixed;bottom:26px;left:50%;transform:translateX(-50%) translateY(20px);
        background:var(--ink);color:var(--bone);padding:12px 20px;border-radius:4px;
        display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600;z-index:80;
        opacity:0;pointer-events:none;transition:opacity .25s ease, transform .25s ease;
      }
      .bb-toast.show{opacity:1;transform:translateX(-50%) translateY(0);}

      /* ---------- Footer ---------- */
      .bb-footer{
        border-top:1px solid var(--line);padding:24px 28px;text-align:center;
        font-size:11px;color:var(--muted);letter-spacing:0.02em;margin-top:auto;
      }
    `}</style>
  );
}

/* =========================================================================
   SMALL SHARED PIECES
========================================================================= */

function Swatch({ color, size = 18 }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        border: "1px solid rgba(28,20,16,0.15)",
        flexShrink: 0,
      }}
    />
  );
}

function Stepper({ qty, onChange }) {
  return (
    <div className="bb-stepper">
      <button onClick={() => onChange(qty - 1)} aria-label="Decrease quantity">
        <Minus size={14} />
      </button>
      <span>{qty}</span>
      <button onClick={() => onChange(qty + 1)} aria-label="Increase quantity">
        <Plus size={14} />
      </button>
    </div>
  );
}

/* =========================================================================
   HEADER
========================================================================= */

function Header({ cartCount, view, setView, onCartClick }) {
  return (
    <header className="bb-header">
      <div className="bb-header-inner">
        <button className="bb-logo" onClick={() => setView("shop")}>
          Blush &amp; Bone
        </button>
        <nav className="bb-nav">
          <button
            className={`bb-navlink ${view === "shop" ? "active" : ""}`}
            onClick={() => setView("shop")}
          >
            Shop
          </button>
          <button
            className={`bb-navlink ${view === "orders" ? "active" : ""}`}
            onClick={() => setView("orders")}
          >
            Orders
          </button>
          <button
            className="bb-cart-btn"
            onClick={onCartClick}
            aria-label="Open bag"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="bb-cart-badge">{cartCount}</span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}

/* =========================================================================
   HERO — includes the "signature" swatch strip pulled straight from the
   live product data, so it's never just decoration.
========================================================================= */

function Hero({ onShopClick }) {
  return (
    <section className="bb-hero">
      <p className="eyebrow">New this season</p>
      <h1>Color, considered.</h1>
      <p>
        Ten essentials, chosen for how they wear — not just how they photograph.
        Clean formulas, real pigment, nothing you have to squint to see the
        difference of.
      </p>
      <button className="btn btn-primary" onClick={onShopClick}>
        Shop the edit
      </button>
      <div className="bb-swatchstrip">
        <div className="bb-swatchrow">
          {PRODUCTS.map((p) => (
            <span
              key={p.id}
              className="bb-swatch"
              style={{ background: p.color }}
              title={p.shade}
            />
          ))}
        </div>
        <span className="bb-swatchlabel">
          every shade in this collection, at a glance
        </span>
      </div>
    </section>
  );
}

/* =========================================================================
   CATEGORY FILTER
========================================================================= */

function CategoryFilter({ active, onChange }) {
  return (
    <div className="bb-filters">
      {CATEGORIES.map((c) => (
        <button
          key={c}
          className={`bb-pill ${active === c ? "active" : ""}`}
          onClick={() => onChange(c)}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

/* =========================================================================
   PRODUCT CARD + GRID
========================================================================= */

function ProductCard({ product, qty, onAdd, onChangeQty, onOpen }) {
  return (
    <div className="bb-card">
      <div className="bb-card-imgwrap" onClick={() => onOpen(product)}>
        <img src={product.image} alt={product.name} loading="lazy" />
        <span
          className="bb-card-swatch"
          style={{ background: product.color }}
        />
      </div>
      <div className="bb-card-body">
        <p className="eyebrow">{product.category}</p>
        <h3 className="bb-card-name" onClick={() => onOpen(product)}>
          {product.name}
        </h3>
        <p className="bb-card-shade">{product.shade}</p>
        <div className="bb-card-footer">
          <span className="bb-price">{formatPrice(product.price)}</span>
          {qty > 0 ? (
            <Stepper qty={qty} onChange={(n) => onChangeQty(product.id, n)} />
          ) : (
            <button className="bb-add-btn" onClick={() => onAdd(product.id)}>
              <Plus size={13} /> Add to bag
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductGrid({ products, cart, onAdd, onChangeQty, onOpen }) {
  if (products.length === 0) {
    return (
      <div className="bb-empty">
        <Package size={40} />
        <p>Nothing in this category yet.</p>
      </div>
    );
  }
  return (
    <div className="bb-grid">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          qty={cart[p.id] || 0}
          onAdd={onAdd}
          onChangeQty={onChangeQty}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
}

/* =========================================================================
   QUICK VIEW MODAL
========================================================================= */

function QuickView({ product, qty, onClose, onAdd, onChangeQty }) {
  if (!product) return null;
  return (
    <div className="bb-overlay" onClick={onClose}>
      <div className="bb-modal" onClick={(e) => e.stopPropagation()}>
        <button className="bb-modal-close" onClick={onClose} aria-label="Close">
          <X size={16} />
        </button>
        <div className="bb-modal-img">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="bb-modal-body">
          <p className="eyebrow">{product.category}</p>
          <h2>{product.name}</h2>
          <div className="bb-shaderow">
            <Swatch color={product.color} size={14} />
            {product.shade}
          </div>
          <p className="bb-modal-desc">{product.description}</p>
          <p className="bb-price" style={{ fontSize: 18 }}>
            {formatPrice(product.price)}
          </p>
          {qty > 0 ? (
            <Stepper qty={qty} onChange={(n) => onChangeQty(product.id, n)} />
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => onAdd(product.id)}
            >
              Add to bag
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   CART DRAWER
========================================================================= */

function CartLine({ item, product, onChangeQty, onRemove }) {
  return (
    <div className="bb-cartline">
      <img src={product.image} alt={product.name} />
      <div className="bb-cartline-info">
        <div className="bb-cartline-top">
          <div>
            <div className="bb-cartline-name">{product.name}</div>
            <div className="bb-cartline-shade">
              <Swatch color={product.color} size={10} />
              {product.shade}
            </div>
          </div>
          <button
            className="bb-remove-btn"
            onClick={() => onRemove(product.id)}
            aria-label="Remove"
          >
            <Trash2 size={15} />
          </button>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 4,
          }}
        >
          <Stepper
            qty={item.qty}
            onChange={(n) => onChangeQty(product.id, n)}
          />
          <span style={{ fontWeight: 700, fontSize: 13 }}>
            {formatPrice(product.price * item.qty)}
          </span>
        </div>
      </div>
    </div>
  );
}

function CartDrawer({
  open,
  onClose,
  cart,
  subtotal,
  onChangeQty,
  onRemove,
  onCheckout,
}) {
  const lines = Object.entries(cart).map(([id, qty]) => ({
    product: getProduct(Number(id)),
    qty,
  }));

  return (
    <>
      {open && <div className="bb-drawer-overlay" onClick={onClose} />}
      <div className={`bb-drawer ${open ? "open" : ""}`}>
        <div className="bb-drawer-header">
          <h3
            className="bb-serif"
            style={{ fontStyle: "italic", fontSize: "1.2rem" }}
          >
            Your bag
          </h3>
          <button
            onClick={onClose}
            aria-label="Close bag"
            style={{ background: "none", border: "none" }}
          >
            <X size={18} />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="bb-empty">
            <ShoppingBag size={40} />
            <p>Your bag is empty.</p>
            <button className="btn btn-ghost" onClick={onClose}>
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            <div className="bb-drawer-list">
              {lines.map(({ product, qty }) => (
                <CartLine
                  key={product.id}
                  item={{ qty }}
                  product={product}
                  onChangeQty={onChangeQty}
                  onRemove={onRemove}
                />
              ))}
            </div>
            <div className="bb-drawer-footer">
              <div className="bb-subtotal-row">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <p className="bb-shipnote">
                Shipping and taxes calculated at checkout.
              </p>
              <button
                className="btn btn-primary"
                style={{ width: "100%" }}
                onClick={onCheckout}
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

/* =========================================================================
   CHECKOUT
========================================================================= */

function CheckoutView({ cart, subtotal, onBack, onPlaceOrder }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
  });
  const [errors, setErrors] = useState({});

  const shipping = subtotal >= 50 || subtotal === 0 ? 0 : 6;
  const total = subtotal + shipping;

  const lines = Object.entries(cart).map(([id, qty]) => ({
    product: getProduct(Number(id)),
    qty,
  }));

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Enter your full name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email";
    if (!form.address.trim()) next.address = "Enter your address";
    if (!form.city.trim()) next.city = "Enter your city";
    if (!form.zip.trim()) next.zip = "Enter a ZIP / PIN code";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onPlaceOrder({ customer: form, lines, subtotal, shipping, total });
  }

  return (
    <div className="bb-checkout">
      <button className="bb-back" onClick={onBack}>
        <ArrowLeft size={14} /> Back to bag
      </button>
      <h2 style={{ fontStyle: "italic", fontSize: "1.8rem", marginBottom: 28 }}>
        Checkout
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="bb-checkout-grid">
          <div>
            <p className="eyebrow" style={{ marginBottom: 14 }}>
              Contact &amp; shipping
            </p>
            <div className="bb-field">
              <label>Full name</label>
              <input
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Ava Whitfield"
              />
            </div>
            <div className="bb-field">
              <label>Email</label>
              <input
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="ava@email.com"
              />
            </div>
            <div className="bb-field">
              <label>Address</label>
              <input
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                placeholder="221 Orchard Street"
              />
            </div>
            <div className="bb-fieldrow">
              <div className="bb-field">
                <label>City</label>
                <input
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                />
              </div>
              <div className="bb-field">
                <label>ZIP / PIN</label>
                <input
                  value={form.zip}
                  onChange={(e) => update("zip", e.target.value)}
                />
              </div>
            </div>

            {Object.keys(errors).length > 0 && (
              <p className="bb-fielderr" style={{ marginTop: 4 }}>
                Please fill in every field correctly before placing your order.
              </p>
            )}

            <div className="bb-demo-note">
              Demo checkout — no payment is processed and no data leaves your
              browser.
            </div>
          </div>

          <div className="bb-summary-card">
            <p className="eyebrow" style={{ marginBottom: 12 }}>
              Order summary
            </p>
            {lines.map(({ product, qty }) => (
              <div key={product.id} className="bb-summary-line">
                <img src={product.image} alt={product.name} />
                <div style={{ flex: 1 }}>
                  <div className="name">{product.name}</div>
                  <div className="meta">
                    {product.shade} · Qty {qty}
                  </div>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700 }}>
                  {formatPrice(product.price * qty)}
                </span>
              </div>
            ))}
            <div className="bb-subtotal-row" style={{ marginTop: 14 }}>
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="bb-subtotal-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
            <div className="bb-subtotal-row total">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%" }}
            >
              Place order
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

/* =========================================================================
   ORDER CONFIRMATION
========================================================================= */

function OrderConfirmation({ order, onContinue, onViewOrders }) {
  if (!order) return null;
  return (
    <div className="bb-confirm">
      <div className="bb-confirm-icon">
        <Check size={28} />
      </div>
      <h1>Order placed</h1>
      <p className="bb-confirm-meta">
        Order {order.id} · {order.date} · Arriving by {order.eta}
      </p>
      <div className="bb-confirm-card">
        {order.lines.map(({ product, qty }) => (
          <div key={product.id} className="bb-summary-line">
            <img src={product.image} alt={product.name} />
            <div style={{ flex: 1 }}>
              <div className="name">{product.name}</div>
              <div className="meta">
                {product.shade} · Qty {qty}
              </div>
            </div>
            <span style={{ fontSize: 13, fontWeight: 700 }}>
              {formatPrice(product.price * qty)}
            </span>
          </div>
        ))}
        <div className="bb-subtotal-row total">
          <span>Total paid</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>
      <div className="bb-confirm-actions">
        <button className="btn btn-primary" onClick={onContinue}>
          Continue shopping
        </button>
        <button className="btn btn-ghost" onClick={onViewOrders}>
          View my orders
        </button>
      </div>
    </div>
  );
}

/* =========================================================================
   ORDER HISTORY — this is where placed orders "show up"
========================================================================= */

function OrderCard({ order }) {
  return (
    <div className="bb-order-card">
      <div className="bb-order-top">
        <div>
          <div className="bb-order-id">{order.id}</div>
          <div className="bb-order-date">
            Placed {order.date} for {order.customer.name}
          </div>
        </div>
        <span className="bb-status-pill">Confirmed</span>
      </div>
      <div className="bb-order-items">
        {order.lines
          .map(({ product, qty }) => `${product.name} × ${qty}`)
          .join("  ·  ")}
      </div>
      <div className="bb-order-total">Total: {formatPrice(order.total)}</div>
    </div>
  );
}

function OrdersView({ orders, onBackToShop }) {
  return (
    <div className="bb-orders">
      <button className="bb-back" onClick={onBackToShop}>
        <ArrowLeft size={14} /> Back to shop
      </button>
      <h2 style={{ fontStyle: "italic", fontSize: "1.8rem", marginBottom: 24 }}>
        Your orders
      </h2>
      {orders.length === 0 ? (
        <div className="bb-empty">
          <Package size={40} />
          <p>No orders yet — placed orders will show up here.</p>
          <button className="btn btn-primary" onClick={onBackToShop}>
            Start shopping
          </button>
        </div>
      ) : (
        orders.map((o) => <OrderCard key={o.id} order={o} />)
      )}
    </div>
  );
}

/* =========================================================================
   TOAST
========================================================================= */

function Toast({ message, show }) {
  return (
    <div className={`bb-toast ${show ? "show" : ""}`}>
      <Check size={14} /> {message}
    </div>
  );
}

/* =========================================================================
   FOOTER
========================================================================= */

function Footer() {
  return (
    <footer className="bb-footer">
      Blush &amp; Bone — client demo storefront. Front-end only, no backend
      required.
    </footer>
  );
}

/* =========================================================================
   APP ROOT — owns all state: catalog filtering, cart, active views,
   quick-view modal, toast, and the order history that orders land in.
========================================================================= */

export default function App() {
  const [view, setView] = useState("shop"); // shop | checkout | confirmation | orders
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState({}); // { [productId]: quantity }
  const [orders, setOrders] = useState([]);
  const [lastOrder, setLastOrder] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });
  const gridRef = useRef(null);
  const toastTimer = useRef(null);

  const filteredProducts = useMemo(
    () =>
      category === "All"
        ? PRODUCTS
        : PRODUCTS.filter((p) => p.category === category),
    [category],
  );

  const cartCount = useMemo(
    () => Object.values(cart).reduce((a, b) => a + b, 0),
    [cart],
  );
  const subtotal = useMemo(
    () =>
      Object.entries(cart).reduce(
        (sum, [id, qty]) => sum + getProduct(Number(id)).price * qty,
        0,
      ),
    [cart],
  );

  function showToast(message) {
    setToast({ show: true, message });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(
      () => setToast((t) => ({ ...t, show: false })),
      2000,
    );
  }

  function addToCart(id, qty = 1) {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + qty }));
    showToast(`${getProduct(id).name} added to bag`);
  }

  function changeQty(id, qty) {
    setCart((c) => {
      const next = { ...c };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });
  }

  function removeFromCart(id) {
    setCart((c) => {
      const next = { ...c };
      delete next[id];
      return next;
    });
  }

  function scrollToGrid() {
    gridRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function handlePlaceOrder({ customer, lines, total }) {
    const now = new Date();
    const eta = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
    const order = {
      id: `ORD-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
        now.getDate(),
      ).padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`,
      date: now.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      eta: eta.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      customer,
      lines,
      total,
    };
    setOrders((prev) => [order, ...prev]);
    setLastOrder(order);
    setCart({});
    setCartOpen(false);
    setView("confirmation");
  }

  return (
    <div className="bb-root">
      <GlobalStyles />
      <Header
        cartCount={cartCount}
        view={view}
        setView={setView}
        onCartClick={() => setCartOpen(true)}
      />

      {view === "shop" && (
        <>
          <Hero onShopClick={scrollToGrid} />
          <div ref={gridRef}>
            <CategoryFilter active={category} onChange={setCategory} />
            <ProductGrid
              products={filteredProducts}
              cart={cart}
              onAdd={addToCart}
              onChangeQty={changeQty}
              onOpen={setQuickViewProduct}
            />
          </div>
        </>
      )}

      {view === "checkout" && (
        <CheckoutView
          cart={cart}
          subtotal={subtotal}
          onBack={() => {
            setView("shop");
            setCartOpen(true);
          }}
          onPlaceOrder={handlePlaceOrder}
        />
      )}

      {view === "confirmation" && (
        <OrderConfirmation
          order={lastOrder}
          onContinue={() => setView("shop")}
          onViewOrders={() => setView("orders")}
        />
      )}

      {view === "orders" && (
        <OrdersView orders={orders} onBackToShop={() => setView("shop")} />
      )}

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        subtotal={subtotal}
        onChangeQty={changeQty}
        onRemove={removeFromCart}
        onCheckout={() => {
          setCartOpen(false);
          setView("checkout");
        }}
      />

      <QuickView
        product={quickViewProduct}
        qty={quickViewProduct ? cart[quickViewProduct.id] || 0 : 0}
        onClose={() => setQuickViewProduct(null)}
        onAdd={(id) => {
          addToCart(id);
        }}
        onChangeQty={changeQty}
      />

      <Toast message={toast.message} show={toast.show} />
      <Footer />
    </div>
  );
}
