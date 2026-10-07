// 介绍页双语文案；语言偏好和图标交互由共用控制器负责。
(function () {
  'use strict';
  const copy = {
    zh: {
      languageLabel: '选择语言', title: 'TickList — 今天要做什么，一眼就清楚',
      metaDescription: '记下任务，安排时间，专注眼前这一件。TickList 帮你把每天的事情整理成一张清晰的清单。无需注册，支持本地保存与导出备份。把今天，一件件做好。',
      badge: '日常待办，轻松安排', headlineLead: '今天要做什么，', headlineHighlight: '一眼就清楚。',
      descriptionLead: '记下任务，安排时间，专注眼前这一件。',
      descriptionPrefix: 'TickList 帮你把每天的事情整理成', descriptionHighlight: '一张清晰的清单', descriptionSuffix: '。',
      start: '开始记录今天', seeProduct: '看看清单长什么样', trust: '无需注册 · 本地保存 · 支持备份',
      scrollDown: '向下滑动，查看产品详情', productLabel: '产品展示与主要优势', proofLabel: '你的今天，可以这样清晰',
      localSave: '本地保存', backupRestore: '支持备份恢复', colorModes: '深浅色模式', followSystem: '自动跟随系统',
      browserTitle: 'TickList · 本地待办清单',
      productAlt: 'TickList 待办清单界面示例：三项任务、一项已完成，展示添加、筛选、截止时间、独立拖动手柄与设置入口',
      productNote: '数据保存在当前浏览器，建议定期备份。', benefitsLabel: '用清单安排今天',
      captureLead: '先记下来，', captureHighlight: '给脑袋腾点空间。', captureDescription: '临时想到的事、今天的安排，都有地方安放。',
      orderLead: '排好顺序，', orderHighlight: '知道下一步做什么。', orderDescription: '拖动任务调整顺序，为重要的事设好截止时间。',
      progressLead: '打一个勾，', progressHighlight: '看见自己的进展。',
      progressDescription: '切换“未完成”，继续眼前的事；打开“已完成”，看看今天做到了什么。',
      taglineLead: '把今天，', taglineHighlight: '一件件做好。', backTop: '回到顶部'
    },
    en: {
      languageLabel: 'Choose language', title: 'TickList — Your day, clear at a glance',
      metaDescription: 'Write it down. Set a time. Focus on what matters now. TickList brings your day into a clear, simple list. No sign-up, local storage, and easy backups. Make today count, one task at a time.',
      badge: 'Everyday tasks, simply organized', headlineLead: 'Your day’s tasks,', headlineHighlight: 'clear at a glance.',
      descriptionLead: 'Write it down. Set a time. Focus on what matters now.',
      descriptionPrefix: 'TickList brings your day into ', descriptionHighlight: 'a clear, simple list', descriptionSuffix: '.',
      start: 'Start planning today', seeProduct: 'See the list in action', trust: 'No sign-up · Saved locally · Easy backups',
      scrollDown: 'Scroll down to explore TickList', productLabel: 'Product preview and key benefits', proofLabel: 'Your day, clearly laid out',
      localSave: 'Saved locally', backupRestore: 'Back up and restore', colorModes: 'Light & dark modes', followSystem: 'Follows your system',
      browserTitle: 'TickList · Your local to-do list',
      productAlt: 'TickList preview: three tasks, one completed, with task entry, filters, deadlines, drag handles, and settings',
      productNote: 'Saved in this browser. Back up regularly.', benefitsLabel: 'Plan your day with a list',
      captureLead: 'Write it down.', captureHighlight: 'Clear your mind.', captureDescription: 'Give passing thoughts and today’s plans a place to land.',
      orderLead: 'Put things in order.', orderHighlight: 'Know what’s next.', orderDescription: 'Drag tasks into order and set deadlines for what matters.',
      progressLead: 'Tick a task off.', progressHighlight: 'See your progress.',
      progressDescription: 'Choose “Pending” to focus on what’s ahead, or “Completed” to see what you’ve done today.',
      taglineLead: 'Make today count, ', taglineHighlight: 'one task at a time.', backTop: 'Back to top'
    }
  };
  function applyLanguage(language) {
    const selected = language === 'en' ? 'en' : 'zh';
    const messages = copy[selected];
    document.documentElement.lang = selected === 'en' ? 'en' : 'zh-CN';
    document.title = messages.title;
    document.querySelector('meta[name="description"]').content = messages.metaDescription;
    document.querySelectorAll('[data-i18n]').forEach(element => {
      element.textContent = messages[element.dataset.i18n];
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(element => {
      element.setAttribute('aria-label', messages[element.dataset.i18nAria]);
    });
    document.querySelectorAll('[data-i18n-alt]').forEach(element => {
      element.alt = messages[element.dataset.i18nAlt];
    });
    document.querySelector('.shot').setAttribute('src', selected === 'en'
      ? 'assets/brand/product-promo-en.svg' : 'assets/brand/product-promo.svg');

  }
  window.TodoLanguage.subscribe(applyLanguage);
  applyLanguage(window.TodoLanguage.get());
  window.TodoLanguage.initPicker();
})();
