// Workspace regression: real page geometry, navigation, filters and theme at
// desktop, iPad, Split View and phone sizes. Uses an isolated browser profile.
"use strict";
const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");
const { launch } = require("./lib/cdp");
const { start } = require("./lib/static_server");

const root = path.join(__dirname, "..");
const output = path.join(root, "tmp", "workspace-review");
const captureScreenshots = process.argv.includes("--screenshots");
const sizes = [
  ["desktop", 1440, 1000, false],
  ["laptop", 1280, 800, false],
  ["ipad-landscape", 1194, 834, true],
  ["ipad-portrait", 834, 1194, true],
  ["ipad-mini", 768, 1024, true],
  ["split-view", 600, 900, true],
  ["phone", 390, 844, true],
  ["small-phone", 320, 740, true],
  ["phone-landscape", 844, 390, true]
];
const pages = [
  ["home", "home"], ["train", "open-train"], ["insights", "open-insights"],
  ["library", "open-library"], ["settings", "open-settings"],
  ["mistakes", "open-mistakes"], ["history", "open-history"],
  ["proofs", "open-proofs"], ["creator", "open-creator"]
];
const failures = [];
let checked = 0;

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const server = await start(root, 0);
  const chrome = await launch();
  const click = async (selector) => {
    await chrome.evaluate(`const el = [...document.querySelectorAll(${JSON.stringify(selector)})].find(node => node.getClientRects().length && node.checkVisibility()); if (!el) throw new Error('Missing visible control: ' + ${JSON.stringify(selector)}); el.click(); return true;`);
    await chrome.sleep(180);
  };
  const snapshot = async (name) => {
    if (!captureScreenshots) return;
    await chrome.sleep(1250);
    fs.writeFileSync(path.join(output, name + ".png"), Buffer.from((await chrome.send("Page.captureScreenshot", { format: "png" })).data, "base64"));
  };
  const size = async (width, height, touch) => {
    await chrome.send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: touch });
    await chrome.send("Emulation.setTouchEmulationEnabled", { enabled: touch, maxTouchPoints: touch ? 5 : 1 });
  };
  try {
    await size(1440, 1000, false);
    await chrome.navigate(server.url);
    await snapshot("desktop-onboarding");
    await click('[data-action="onboarding-next"]');
    await click('[data-action="set-onboarding-context"]');
    await click('[data-action="skip-placement"]');
    await click('button[data-action="dismiss-notice"]');

    for (const [device, width, height, touch] of sizes) {
      await size(width, height, touch);
      for (const [page, action] of pages) {
        // Phone intentionally hides the desktop shortcuts; these routes remain
        // reachable through training, data and library in the real app.
        if (page === "history") await click('[data-action="open-settings"]');
        if (page === "mistakes") {
          await click('[data-action="open-train"]');
          await click('[data-action="set-bucket"][data-bucket="weakness"]');
        }
        if (page === "proofs" || page === "creator") await click('[data-action="home"]');
        await click(`[data-action="${action}"]`);
        if (page === "train") await click('[data-action="set-bucket"][data-bucket="practice"]');
        const g = await chrome.evaluate(`
          const vw = document.documentElement.clientWidth;
          const main = document.querySelector('main');
          const nav = document.querySelector('.topbar-nav');
          const bar = document.querySelector('.topbar');
          const r = el => { const b=el.getBoundingClientRect(); return {left:b.left,right:b.right,top:b.top,bottom:b.bottom,width:b.width,height:b.height}; };
          return { vw, overflow: document.documentElement.scrollWidth-vw,
            main:r(main),nav:r(nav),bar:r(bar), navPosition:getComputedStyle(nav).position,
            active:document.querySelectorAll('.nav-button[aria-current="page"]').length,
            mainId:main.id, paddingBottom:parseFloat(getComputedStyle(main).paddingBottom),
            font:getComputedStyle(document.body).fontFamily,
            buttons:[...nav.querySelectorAll('button')].map(r),
            unrenderedIcons:document.querySelectorAll('i[data-lucide]').length,
            offenders:[...main.querySelectorAll('*')].filter(el=>el.getBoundingClientRect().right>vw+1 && getComputedStyle(el).position!=='absolute').slice(0,6).map(el=>el.className)
          };`);
        const phone = width < 768 || (width <= 960 && height < 600);
        const errors = [];
        if (g.overflow > 1) errors.push(`horizontal overflow ${g.overflow}px (${g.offenders.join(', ')})`);
        if (g.mainId !== "buzz-main") errors.push("skip link has no main target");
        if (g.active !== 1) errors.push(`active primary navigation = ${g.active}`);
        if (g.unrenderedIcons) errors.push(`${g.unrenderedIcons} missing icons`);
        if (g.buttons.some(b => b.width < 44 || b.height < 44)) errors.push("navigation target below 44px");
        if (phone) {
          if (g.navPosition !== "fixed" || Math.abs(g.nav.bottom - height) > 2) errors.push("bottom navigation detached");
          if (g.paddingBottom < g.nav.height) errors.push("content can be covered by navigation");
        } else {
          if (g.main.left < g.bar.right - 1) errors.push("sidebar covers content");
          if (width < 1200 && g.bar.width > 100) errors.push("tablet rail too wide");
        }
        checked++;
        if (errors.length) failures.push(`${device}/${page}: ${errors.join('; ')}`);
        if (["desktop", "ipad-portrait", "phone"].includes(device) && ["home", "train", "library", "settings"].includes(page)) await snapshot(`${device}-${page}`);
      }
      console.log(`${device}: 9 pages checked`);
    }

    await size(390, 844, true);
    await click('[data-action="open-library"]');
    await chrome.evaluate(`const input=document.querySelector('[data-library-search]'); input.value='no-match-zzzz'; input.dispatchEvent(new Event('input',{bubbles:true})); return true;`);
    await chrome.sleep(500);
    assert(await chrome.evaluate(`return !!document.querySelector('.library-empty');`), "Search empty state missing");
    await snapshot("phone-library-empty");
    await click('[data-action="home"]');
    await click('[data-action="toggle-theme"]');
    assert.equal(await chrome.evaluate(`return document.documentElement.dataset.theme;`), "dark");
    await snapshot("phone-dark-home");
    await size(1440, 1000, false);
    await snapshot("desktop-dark-home");
    await click('[data-action="open-settings"]');
    await snapshot("desktop-dark-settings");
    await click('[data-action="toggle-theme"]');

    // Native in-page navigation must still work after a settings rerender.
    await click('.settings-jump a[href="#settings-interface"]');
    assert(await chrome.evaluate(`const el=document.getElementById('settings-interface'); const r=el.getBoundingClientRect(); return r.top>=0 && r.top<innerHeight;`), "Settings jump target is covered or off screen");

    // Seed only this disposable profile to exercise populated charts and lists.
    // No production or user records are accessed by this suite.
    await chrome.evaluate(`
      const bank=window.BUZZ_PROBLEMS.filter(p=>(p.tags||[]).includes('integration-by-parts')).slice(0,12);
      const history=Array.from({length:8},(_,day)=>({id:'layout-fixture-'+day,mode:'quick',score:750,total:12,correct:9,accuracy:75,finishedAt:new Date(Date.now()-day*86400000).toISOString(),answers:bank.map((p,i)=>({problemId:p.id,correct:i%4!==0,elapsed:25+day*2,hintsUsed:0,reason:i%4===0?'Wrong':'Correct'}))}));
      const mistakes=Object.fromEntries(bank.filter((_,i)=>i%4===0).map(p=>[p.id,{problemId:p.id,wrongCount:2,srs:{interval:1,dueAt:0}}]));
      localStorage.setItem('buzzcalculus.records.v1',JSON.stringify({onboardingSeen:true,totalAnswered:96,history,mistakes,backupNoticeSeen:true,settings:{difficultyCap:4}}));
      return true;
    `);
    await chrome.navigate(server.url);
    for (const [device,width,height,touch] of sizes.filter(s=>['desktop','ipad-portrait','phone'].includes(s[0]))) {
      await size(width,height,touch);
      for (const [page,action] of pages.filter(p=>['home','insights','mistakes','history'].includes(p[0]))) {
        if (page==='mistakes') {
          await click('[data-action="open-train"]');
          await click('[data-action="set-bucket"][data-bucket="weakness"]');
        }
        if (page==='history') await click('[data-action="open-insights"]');
        await click('[data-action="'+action+'"]');
        const populated=await chrome.evaluate(`return {overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,charts:document.querySelectorAll('.insights-summary,.quadrant-svg,.skill-table-card').length};`);
        if (populated.overflow>1) failures.push(device+'/'+page+' populated overflow '+populated.overflow+'px');
        if (page==='insights' && populated.charts<2) failures.push(device+' populated insights did not render charts');
        checked++;
        if (page==='home' || page==='insights') await snapshot(device+'-populated-'+page);
      }
    }

    // Exercise the actual lesson launcher after all navigation changes.
    await size(1440, 1000, false);
    await click('[data-action="home"]');
    await click('[data-action="start-planned"]');
    await chrome.sleep(1000);
    const quiz = await chrome.evaluate(`return {quiz:!!document.querySelector('.quiz-screen'),nav:!!document.querySelector('.topbar-nav'),overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth};`);
    assert(quiz.quiz && !quiz.nav && quiz.overflow <= 1, "Focus quiz layout regressed");
    await snapshot("desktop-quiz");
    await size(834, 1194, true);
    await snapshot("ipad-quiz");
    await size(390, 844, true);
    await snapshot("phone-quiz");

    if (chrome.pageErrors.length) failures.push(...chrome.pageErrors);
    if (server.missing.length) failures.push(`Missing assets: ${server.missing.join(', ')}`);
    fs.writeFileSync(path.join(output, "report.json"), JSON.stringify({checked, failures}, null, 2));
    console.log(`${checked} responsive page states, search, theme and lesson launch checked.`);
    if (captureScreenshots) console.log(`Screenshots: ${output}`);
    assert.equal(failures.length, 0, failures.join("\n"));
  } finally {
    await chrome.close();
    await server.stop();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
