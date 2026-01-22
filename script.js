let cart = {};
let currentImages = [];
let currentIdx = 0;

function openLightbox(imgs) {
    currentImages = Array.isArray(imgs) ? imgs : [imgs];
    currentIdx = 0;
    document.getElementById('lightbox').style.display = 'flex';
    updateLightboxContent();
}

function updateLightboxContent() {
    const container = document.getElementById('lightbox-content');
    const file = currentImages[currentIdx];
    container.innerHTML = file.toLowerCase().endsWith('.mp4') 
        ? `<video controls autoplay muted playsinline style="width:100%"><source src="${file}" type="video/mp4"></video>`
        : `<img src="${file}" style="width:100%">`;
}

function changeImg(dir, event) {
    event.stopPropagation();
    currentIdx = (currentIdx + dir + currentImages.length) % currentImages.length;
    updateLightboxContent();
}

function closeLightbox() {
    document.getElementById('lightbox-content').innerHTML = "";
    document.getElementById('lightbox').style.display = 'none';
}

function toggleCart() { document.getElementById('cart-panel').classList.toggle('open'); }

function addItem(name, price, img) {
    if (cart[name]) cart[name].q++;
    else cart[name] = { p: price, q: 1, i: img };
    updateUI();
}

function removeItem(name) {
    if (cart[name].q > 1) cart[name].q--;
    else delete cart[name];
    updateUI();
}

function clearCart() { if(confirm("¿Vaciar pedido?")) { cart = {}; updateUI(); } }

function updateUI() {
    const container = document.getElementById('cart-items');
    let total = 0, count = 0, html = "";
    Object.keys(cart).forEach(k => {
        total += cart[k].p * cart[k].q;
        count += cart[k].q;
        html += `<div style="display:flex; align-items:center; gap:10px; margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px;">
            <img src="${cart[k].i}" style="width:55px; height:55px; object-fit:contain; border-radius:8px;">
            <div style="flex:1; color:#000;"><b>${k}</b><br><span style="color:var(--gold); font-weight:900;">S/ ${cart[k].p.toFixed(2)}</span></div>
            <div style="display:flex; align-items:center; gap:10px; background:#f0f0f0; padding:5px 12px; border-radius:20px; color:#000;">
                <button onclick="removeItem('${k}')" style="border:none; background:none; cursor:pointer; font-weight:900;">-</button>
                <b>${cart[k].q}</b>
                <button onclick="addItem('${k}', ${cart[k].p}, '${cart[k].i}')" style="border:none; background:none; cursor:pointer; font-weight:900;">+</button>
            </div>
        </div>`;
    });
    container.innerHTML = html || '<p style="text-align:center; padding:30px; opacity:0.5; color:#000;">Tu carrito está vacío</p>';
    document.getElementById('cart-total').innerText = `S/ ${total.toFixed(2)}`;
    document.getElementById('count').innerText = count;
}

function sendOrder() {
    const name = document.getElementById('order-name').value;
    const dni = document.getElementById('order-dni').value;
    const prov = document.getElementById('order-prov').value;
    const dist = document.getElementById('order-dist').value;
    if (!name || !dni || Object.keys(cart).length === 0) return alert("Completa tus datos");
    let msg = `🏋️‍♂️ *PEDIDO BARSTARZZ*%0A👤 *Cliente:* ${name}%0A🆔 *DNI:* ${dni}%0A📍 *Lugar:* ${prov}, ${dist}%0A%0A*PRODUCTOS:*%0A`;
    Object.keys(cart).forEach(k => msg += `• ${k} (x${cart[k].q})%0A`);
    window.open(`https://wa.me/51991684812?text=${msg}%0A*TOTAL: ${document.getElementById('cart-total').innerText}*`);
}