/* ============================================================
   landing.js — decrypts the link list with a passphrase.

   What this protects: the list of links. It is AES-GCM ciphertext in
   data/links.enc, so without the passphrase this page's source contains
   nothing readable — not a hash comparison you can step over in devtools.

   What it does not protect: the destinations. Anything already published
   at a public URL stays public whether or not it is listed here.
   ============================================================ */
"use strict";

const CACHE_KEY = "ae:links:v1";
const SEALED = "data/links.enc";

const gate = document.getElementById("gate");
const pass = document.getElementById("pass");
const go = gate.querySelector(".go");
const remember = document.getElementById("remember");
const message = document.getElementById("gate-msg");
const list = document.getElementById("links");
const lockButton = document.getElementById("lock");

let sealed = null;

function say(text, bad){
  message.textContent = text || "";
  message.className = "msg" + (bad ? " bad" : "");
}

/* ---------- crypto ---------- */
function fromBase64(b64){
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for(let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function deriveKey(passphrase, kdf){
  const material = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(passphrase), "PBKDF2", false, ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: fromBase64(kdf.salt),
      iterations: kdf.iterations,
      hash: kdf.hash
    },
    material,
    { name:"AES-GCM", length:256 },
    false,
    ["decrypt"]
  );
}

/* Returns the payload, or null when the passphrase is wrong. AES-GCM
   authenticates, so a wrong key fails to decrypt rather than yielding
   plausible rubbish. */
async function unseal(passphrase, file){
  const key = await deriveKey(passphrase, file.kdf);
  let plain;
  try{
    plain = await crypto.subtle.decrypt(
      { name:"AES-GCM", iv:fromBase64(file.iv) }, key, fromBase64(file.ct)
    );
  } catch (err){
    return null;
  }
  try{
    return JSON.parse(new TextDecoder().decode(plain));
  } catch (err){
    return null;
  }
}

/* ---------- render ---------- */
function show(payload, isPlaceholder){
  list.replaceChildren();

  if(isPlaceholder){
    const warn = document.createElement("p");
    warn.className = "warn";
    warn.textContent = "Placeholder passphrase still in use — open tools/seal.html and reseal.";
    list.appendChild(warn);
  }

  for(const link of payload.links || []){
    const a = document.createElement("a");
    a.href = link.href;
    const title = document.createElement("span");
    title.className = "ttl";
    title.textContent = link.name;
    a.appendChild(title);
    if(link.note){
      const note = document.createElement("span");
      note.className = "note";
      note.textContent = link.note;
      a.appendChild(note);
    }
    list.appendChild(a);
  }

  gate.hidden = true;
  list.hidden = false;
  lockButton.hidden = false;
}

function lock(){
  try{ localStorage.removeItem(CACHE_KEY); } catch (err){ /* nothing to clear */ }
  list.replaceChildren();
  list.hidden = true;
  lockButton.hidden = true;
  gate.hidden = false;
  pass.value = "";
  say("");
  pass.focus();
}

/* ---------- boot ---------- */
async function boot(){
  /* Unlocked earlier on this device: show it without asking again. The
     passphrase itself is never stored, only what it decrypted. */
  try{
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
    if(cached && cached.links){
      show(cached, !!cached.placeholder);
      return;
    }
  } catch (err){ /* fall through to the gate */ }

  gate.hidden = false;
  pass.focus();

  try{
    const res = await fetch(SEALED, { cache:"no-cache" });
    if(!res.ok) throw new Error("HTTP " + res.status);
    sealed = await res.json();
  } catch (err){
    say("Link list could not be loaded", true);
    go.disabled = true;
    return;
  }
}

gate.addEventListener("submit", async event => {
  event.preventDefault();
  if(!sealed || go.disabled) return;
  const entered = pass.value;
  if(!entered){
    say("Enter the passphrase", true);
    return;
  }
  go.disabled = true;
  say("Unlocking…");

  const payload = await unseal(entered, sealed);
  go.disabled = false;

  if(!payload){
    say("Wrong passphrase", true);
    pass.select();
    return;
  }
  say("");
  if(remember.checked){
    try{
      localStorage.setItem(CACHE_KEY,
        JSON.stringify({ ...payload, placeholder: !!sealed.placeholder }));
    } catch (err){ /* private mode: unlock just will not persist */ }
  }
  show(payload, !!sealed.placeholder);
});

lockButton.addEventListener("click", lock);

boot();
