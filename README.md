# albinekstrom.github.io

Landing page. Name in the middle, a short list of projects underneath, nothing else.

No build step, no dependencies, no third-party scripts. Plain HTML, one stylesheet, two ES modules.

```
index.html            the page
css/landing.css       palette shared with hm-2027
js/landing.js         decrypts the link list
data/links.enc        the link list, encrypted
tools/seal.html       set the passphrase and reseal the list — run it locally
tools/seal.js
```

## The passphrase

The link list is not in `index.html`. It lives in `data/links.enc` as AES-GCM ciphertext, and the
page decrypts it in the browser after you type the passphrase. PBKDF2-SHA256, 250 000 iterations,
fresh random salt and IV on every reseal.

**What this protects:** the list. Without the passphrase, the page source is ciphertext — there is
no hash to compare, no plaintext to read, nothing to step over in devtools.

**What this does not protect:** the destinations. `hm-2027` is a separate public repo on GitHub
Pages, so anyone who knows or guesses `albinekstrom.github.io/hm-2027/` reaches it whether or not
it is listed here. Gating the list is worth something — it means the site does not advertise what
you have. It is not access control, and nothing in a public repo can be.

If you want the tracker itself genuinely restricted, the honest options are GitHub Pro with a
private Pages site, or moving hosting behind something like Cloudflare Access. Both are real auth;
a page like this one is not.

### Setting your own passphrase

The repo ships sealed with the placeholder `change-me`, and the page shows a red warning while
that is still in use. To replace it:

1. Open `tools/seal.html` — locally is fine, `file://` works, nothing is sent anywhere.
2. Enter a passphrase twice, edit the link list if you want.
3. Press **Seal**, then **Download links.enc**.
4. Save it over `data/links.enc`, commit, push.
5. Load the site, enter the new passphrase, check the red warning is gone.

The passphrase is never stored, never committed and never transmitted — only what it encrypts is.
There is no reset: if you forget it, reseal with a new one from that same page.

Unlocking stores the *decrypted list* in `localStorage` when "Remember on this device" is ticked,
so it opens straight to the links next time. **Lock** clears it.

## What was here before

This repo previously held a deployed copy of the Nordtrip site (an Astro build, ~180 MB). It was
replaced by this landing page on 12 August 2026. `nordtrip.se` is hosted elsewhere and was not
touched. To bring the old copy back:

```
git checkout 0d1e268 -- .
```

That commit is `0d1e268 changed mobile`, the last one before the replacement.
