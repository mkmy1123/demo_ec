const products = {
  "linen-blanket": {
    id: "linen-blanket", category: "FABRIC", name: "リネンブランケット", variant: "Sand", price: 12100,
    visual: "linen", background: "product-image--linen", material: "リネン 100%", size: "140 × 200cm",
    lead: "空気を含んだような軽さと、素肌に気持ちいいさらりとした手ざわり。季節を問わず使える一枚です。",
  },
  "portable-lamp": {
    id: "portable-lamp", category: "LIGHTING", name: "ポータブルランプ", variant: "Moss", price: 18700,
    visual: "lamp", background: "product-image--lamp", material: "アルミニウム・LED", size: "W16 × H24cm",
    lead: "好きな場所へ持ち運べる、小さな灯り。落ち着いた光が夜の時間をやさしく整えます。",
  },
  "stoneware-mug": {
    id: "stoneware-mug", category: "TABLEWARE", name: "ストーンウェアマグ", variant: "Milk", price: 3300,
    visual: "mug", background: "product-image--mug", material: "せっ器", size: "φ8.5 × H9cm / 320ml",
    lead: "両手で包みたくなる、穏やかな丸み。釉薬の揺らぎがひとつずつ違う表情をつくります。",
  },
  "oak-table": {
    id: "oak-table", category: "INTERIOR", name: "オークサイドテーブル", variant: "Natural", price: 29700,
    visual: "side-table", background: "product-image--table", material: "オーク無垢材", size: "φ42 × H48cm",
    lead: "ソファの横にもベッドサイドにも置ける軽やかなテーブル。木目を生かした自然な仕上げです。",
  },
  "flower-vase": {
    id: "flower-vase", category: "TABLEWARE", name: "フラワーベース", variant: "Clay", price: 6600,
    visual: "small-vase", background: "product-image--vase", material: "陶器", size: "φ13 × H21cm",
    lead: "一輪でも枝ものでも、すっと受け止める素朴な花器。土の表情を残したマットな質感です。",
  },
  "cotton-cushion": {
    id: "cotton-cushion", category: "FABRIC", name: "コットンクッション", variant: "Rust", price: 5500,
    visual: "cushion", background: "product-image--cushion", material: "コットン 100%", size: "45 × 45cm",
    lead: "部屋にあたたかなリズムを生む、深い赤茶色。洗いをかけた布のやわらかさが魅力です。",
  },
};

window.dataLayer = window.dataLayer || [];
const id = new URLSearchParams(window.location.search).get("id") || "linen-blanket";
const product = products[id] || products["linen-blanket"];
const detail = document.querySelector("[data-product-detail]");
const toast = document.querySelector("[data-toast]");

const formatPrice = (value) => new Intl.NumberFormat("ja-JP", {
  style: "currency", currency: "JPY", maximumFractionDigits: 0,
}).format(value);

document.title = `${product.name} / ${product.variant} | NEST & NOOK`;
document.querySelector('meta[name="description"]').content = product.lead;
document.querySelector('meta[property="og:title"]').content = `${product.name} / ${product.variant} | NEST & NOOK`;
document.querySelector('meta[property="og:description"]').content = product.lead;
document.querySelector("[data-breadcrumb]").textContent = product.name;

detail.innerHTML = `
  <div class="detail-gallery">
    <div class="detail-image ${product.background}"><span class="product-object ${product.visual}"></span><span class="image-index">01 / 02</span></div>
    <div class="detail-texture ${product.background}"><span>DETAIL</span><div class="texture-ring"></div></div>
  </div>
  <div class="detail-info">
    <p class="product-category">${product.category}</p>
    <h1>${product.name}<small>/ ${product.variant}</small></h1>
    <p class="detail-price">${formatPrice(product.price)} <span>税込</span></p>
    <p class="detail-lead">${product.lead}</p>
    <div class="variant-block"><span>COLOR</span><strong>${product.variant}</strong><button type="button" aria-label="${product.variant}を選択" class="color-swatch ${product.background}"></button></div>
    <button class="detail-add" type="button" data-detail-add>カートに追加する <span>＋</span></button>
    <dl class="product-specs"><div><dt>素材</dt><dd>${product.material}</dd></div><div><dt>サイズ</dt><dd>${product.size}</dd></div><div><dt>お届け</dt><dd>通常3〜5営業日</dd></div></dl>
    <details><summary>お手入れについて <span>＋</span></summary><p>素材の風合いを長く楽しむため、付属のケアラベルに従ってお手入れしてください。</p></details>
    <details><summary>配送・返品について <span>＋</span></summary><p>8,000円以上で送料無料。未使用品は到着から30日以内に返品を承ります。</p></details>
  </div>
`;

const related = Object.values(products).filter((item) => item.id !== product.id).slice(0, 3);
document.querySelector("[data-related-products]").innerHTML = related.map((item) => `
  <article class="related-card"><a href="product.html?id=${item.id}"><div class="related-image ${item.background}"><span class="product-object ${item.visual}"></span></div><p>${item.category}</p><h3>${item.name} / ${item.variant}</h3><span>${formatPrice(item.price)}</span></a></article>
`).join("");

window.dataLayer.push({
  event: "view_item",
  ecommerce: { currency: "JPY", value: product.price, items: [{ item_id: product.id, item_name: `${product.name} / ${product.variant}`, item_category: product.category, price: product.price }] },
});

document.querySelector("[data-detail-add]").addEventListener("click", () => {
  window.dataLayer.push({
    event: "add_to_cart",
    ecommerce: { currency: "JPY", value: product.price, items: [{ item_id: product.id, item_name: `${product.name} / ${product.variant}`, item_category: product.category, price: product.price, quantity: 1 }] },
  });
  toast.textContent = `${product.name}をカートに追加しました`;
  toast.classList.add("is-visible");
  window.setTimeout(() => toast.classList.remove("is-visible"), 1800);
});
