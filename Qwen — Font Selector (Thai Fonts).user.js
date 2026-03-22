// ==UserScript==
// @name         Qwen — Font Selector (Thai Fonts)
// @namespace    xe4k@outlook.co.th
// @version      2.5
// @description  เปลี่ยนฟอนต์หน้าเว็บไซต์ Qwen Chat พร้อมเมนูเลือกฟอนต์ (Modified by XE4K)
// @author       XE4K
// @match        https://chat.qwen.ai/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  // === 1. โหลดฟอนต์ทั้งหมดจาก Google Fonts ===
  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?' +
    'family=Google+Sans:wght@300;400;500;600;700&' +
    'family=Itim&' +
    'family=K2D:wght@300;400;500;600;700&' +
    'display=swap';
  document.head.appendChild(fontLink);

  // === 2. ข้อมูลฟอนต์ที่มี ===
  const fonts = {
    'google-sans': {
      name: 'Google Sans',
      stack: "'Google Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
    },
    'itim': {
      name: 'Itim',
      stack: "'Itim', ui-sans-serif, system-ui, sans-serif"
    },
    'k2d': {
      name: 'K2D',
      stack: "'K2D', ui-sans-serif, system-ui, sans-serif"
    }
  };

  // === 3. อ่านค่าฟอนต์ที่เลือกจาก GM_getValue (หรือใช้ค่าเริ่มต้น) ===
  const savedFontKey = 'qwen-font-preference';
  let currentFont = GM_getValue(savedFontKey, 'google-sans');

  // ตรวจสอบว่าฟอนต์ที่บันทึกไว้ยังมีอยู่ในรายการปัจจุบันหรือไม่
  if (!fonts[currentFont]) {
    currentFont = 'google-sans';
    GM_setValue(savedFontKey, currentFont);
  }

  // === 4. สร้างและเพิ่มสไตล์ CSS สำหรับฟอนต์ ===
  const style = document.createElement('style');
  style.id = 'qwen-font-style';
  document.head.appendChild(style);

  // === 5. ฟังก์ชันอัปเดตฟอนต์ ===
  function updateFont(fontKey) {
    if (!fonts[fontKey]) return;

    const fontStack = fonts[fontKey].stack;
    style.textContent = `
      /* ใช้ฟอนต์ที่เลือก */
      *,
      *::before,
      *::after {
        font-family: ${fontStack} !important;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      /* ป้องกันปัญหาเลเยาต์ */
      html, body {
        overflow-x: hidden !important;
        width: 100% !important;
      }
    `;

    // บันทึกค่าที่เลือก
    GM_setValue(savedFontKey, fontKey);

    console.log(`✓ ฟอนต์เปลี่ยนเป็น: ${fonts[fontKey].name}`);
  }

  // === 6. สร้างเมนูในตัวจัดการสคริปต์ ===
  Object.entries(fonts).forEach(([key, font]) => {
    GM_registerMenuCommand(`เปลี่ยนฟอนต์: ${font.name}`, () => {
      updateFont(key);
      // แสดงการแจ้งเตือนบนหน้าจอ
      showNotification(`เปลี่ยนฟอนต์เป็น: ${font.name}`);
    });
  });

  // === 7. ฟังก์ชันแสดงการแจ้งเตือนบนหน้าจอ ===
  function showNotification(message) {
    // ลบการแจ้งเตือนเก่า
    const oldNotif = document.getElementById('qwen-font-notification');
    if (oldNotif) oldNotif.remove();

    // สร้างการแจ้งเตือนใหม่
    const notif = document.createElement('div');
    notif.id = 'qwen-font-notification';
    notif.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 99999;
      background: rgba(33, 150, 243, 0.95);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-family: 'Google Sans', sans-serif;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      animation: qwen-notif-show 0.3s ease-out, qwen-notif-hide 0.5s ease-in 2.5s forwards;
    `;
    notif.innerHTML = `
      <style>
        @keyframes qwen-notif-show {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes qwen-notif-hide {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(100px); }
        }
      </style>
      ${message}
    `;

    document.body.appendChild(notif);

    // ลบหลังจาก 3 วินาที
    setTimeout(() => {
      notif.style.animation = 'qwen-notif-hide 0.5s ease-in forwards';
      setTimeout(() => notif.remove(), 500);
    }, 3000);
  }

  // === 8. ใช้ฟอนต์เริ่มต้น ===
  updateFont(currentFont);
})();