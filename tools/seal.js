/* ============================================================
   seal.js — encrypts the link list under a passphrase, locally.

   PBKDF2-SHA256 to derive the key, AES-GCM to encrypt. A fresh random
   salt and IV every time, so resealing the same list with the same
   passphrase still produces different ciphertext.
   ============================================================ */
"use strict";

const ITERATIONS = 250000;

const DEFAULT_PAYLOAD = {
  links: [
    {
      name: "hm-2027",
      href: "https://albinekstrom.github.io/hm-2027/",
      note: "Half marathon build — 22 May 2027"
    }
  ]
};

const pass = document.getElementById("pass");
const again = document.getElementById("again");
const payload = document.getElementById("payload");
const out = document.getElementById("out");
const message = document.getElementById("msg");
const sealButton = document.getElementById("seal");
const downloadButton = document.getElementById("download");
const copyButton = document.getElementById("copy");

payload.value = JSON.stringify(DEFAULT_PAYLOAD, null, 2);

function say(text, kind){
  message.textContent = text || "";
  message.className = "msg" + (kind ? " " + kind : "");
}

function toBase64(bytes){
  let binary = "";
  const view = new Uint8Array(bytes);
  const CHUNK = 0x8000;
  for(let i = 0; i < view.length; i += CHUNK){
    binary += String.fromCharCode.apply(null, view.subarray(i, i + CHUNK));
  }
  return btoa(binary);
}

export async function seal(passphrase, text, options = {}){
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const material = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(passphrase), "PBKDF2", false, ["deriveKey"]
  );
  const key = await crypto.subtle.deriveKey(
    { name:"PBKDF2", salt, iterations:ITERATIONS, hash:"SHA-256" },
    material,
    { name:"AES-GCM", length:256 },
    false,
    ["encrypt"]
  );
  const ct = await crypto.subtle.encrypt(
    { name:"AES-GCM", iv }, key, new TextEncoder().encode(text)
  );
  return {
    v: 1,
    placeholder: !!options.placeholder,
    kdf: { name:"PBKDF2", hash:"SHA-256", iterations:ITERATIONS, salt:toBase64(salt) },
    iv: toBase64(iv),
    ct: toBase64(ct)
  };
}

sealButton.addEventListener("click", async () => {
  if(!pass.value){
    say("Enter a passphrase", "bad");
    return;
  }
  if(pass.value !== again.value){
    say("The two passphrases do not match", "bad");
    return;
  }
  if(pass.value.length < 8){
    say("Use at least 8 characters", "bad");
    return;
  }
  let parsed;
  try{
    parsed = JSON.parse(payload.value);
  } catch (err){
    say("The link list is not valid JSON", "bad");
    return;
  }
  if(!parsed || !Array.isArray(parsed.links)){
    say('Expected {"links": [ ... ]}', "bad");
    return;
  }

  say("Deriving key…");
  const file = await seal(pass.value, JSON.stringify(parsed), { placeholder:false });
  out.value = JSON.stringify(file, null, 2) + "\n";
  downloadButton.hidden = false;
  copyButton.hidden = false;
  say("Sealed " + parsed.links.length + (parsed.links.length === 1 ? " link" : " links") +
      ". Save as data/links.enc.", "ok");
});

downloadButton.addEventListener("click", () => {
  const blob = new Blob([out.value], { type:"application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "links.enc";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
});

copyButton.addEventListener("click", async () => {
  try{
    await navigator.clipboard.writeText(out.value);
    say("Copied.", "ok");
  } catch (err){
    out.select();
    say("Select-all and copy by hand.", "bad");
  }
});
