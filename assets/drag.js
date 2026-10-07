// 拖动控制器只管理指针和 DOM，排序数据由应用负责。
(function () {
'use strict';
window.TodoDrag = { create(listEl, onReorder) {
  /* ============ 电脑端手柄拖动排序 ============ */
  const DRAG_THRESHOLD = 4;
  let press = null;
  let drag = null;             // 已抓起的拖动状态

  function startHandleDrag(e, li, id) {
    if (e.button !== 0 || drag) return;
    e.preventDefault();
    cancelPress();
    press = {
      li, id,
      pointerId: e.pointerId,
      target: e.currentTarget,
      x: e.clientX, y: e.clientY
    };
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) {}
  }

  function cancelPress() {
    if (press) { try { press.target.releasePointerCapture(press.pointerId); } catch (err) {} }
    press = null;
  }

  function beginDrag() {
    if (!press) return;
    const li = press.li;
    li.getAnimations().forEach(animation => animation.cancel());
    const rect = li.getBoundingClientRect();

    // 占位符：占据事项原来的位置
    const placeholder = document.createElement('li');
    placeholder.className = 'drag-placeholder';
    placeholder.style.height = rect.height + 'px';
    listEl.insertBefore(placeholder, li);

    li.classList.add('dragging');
    li.style.left = rect.left + 'px';
    li.style.top = rect.top + 'px';
    li.style.width = rect.width + 'px';
    li.style.height = rect.height + 'px';
    // 移到 body 下：.app 带 transform 会使 fixed 定位以它为基准，导致横向错位
    document.body.appendChild(li);

    drag = {
      li, id: press.id, placeholder,
      pointerId: press.pointerId, target: press.target, ending: false,
      w: rect.width, h: rect.height,
      grabOX: press.x - rect.left,   // 抓取点相对卡片左上角的偏移
      grabOY: press.y - rect.top
    };
    document.body.classList.add('is-dragging');
    cancelPress();
    try { drag.target.setPointerCapture(drag.pointerId); } catch (err) {}
  }

  function onPointerMove(e) {
    if (press && e.pointerId === press.pointerId &&
        Math.hypot(e.clientX - press.x, e.clientY - press.y) >= DRAG_THRESHOLD) beginDrag();
    if (drag) {
      if (drag.ending || e.pointerId !== drag.pointerId) return;
      e.preventDefault();

      // 卡片自由跟随指针（双向），不做区域限制
      const x = e.clientX - drag.grabOX;
      const y = e.clientY - drag.grabOY;
      drag.li.style.left = x + 'px';
      drag.li.style.top = y + 'px';
      drag.li.style.transform = 'scale(1.02)';

      // 根据指针位置实时移动占位符
      const siblings = listEl.querySelectorAll('.item:not(.dragging)');
      let beforeEl = null;
      for (const el of siblings) {
        const r = el.getBoundingClientRect();
        if (e.clientY < r.top + r.height / 2) { beforeEl = el; break; }
      }
      if (beforeEl) listEl.insertBefore(drag.placeholder, beforeEl);
      else listEl.appendChild(drag.placeholder);
      return;
    }
  }

  function endDrag(e) {
    if (drag && (drag.ending || (e && e.pointerId !== drag.pointerId))) return;
    if (!drag) { cancelPress(); return; }
    drag.ending = true;
    try { drag.target.releasePointerCapture(drag.pointerId); } catch (err) {}
    const { li, placeholder } = drag;
    const curRect = li.getBoundingClientRect();
    const phRect = placeholder.getBoundingClientRect();
    const tx = phRect.left - curRect.left;
    const ty = phRect.top - curRect.top;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let committed = false;
    const commit = () => {
      if (committed) return;
      committed = true;
      // 同一帧内把被拖动项放到占位符位置并解除 fixed，避免二次跳动
      listEl.insertBefore(li, placeholder.nextSibling);
      placeholder.remove();
      li.classList.remove('dragging');
      li.style.left = li.style.top = li.style.width = li.style.height = li.style.transform = '';
      document.body.classList.remove('is-dragging');

      // 此时 DOM 顺序即最终顺序，据此重排数据
      const orderedIds = Array.prototype.map.call(
        listEl.querySelectorAll('.item[data-id]'), n => n.dataset.id
      );
      drag = null;
      onReorder(orderedIds);
    };

    if (reduce || (tx === 0 && ty === 0)) { commit(); return; }

    const anim = li.animate(
      [
        { transform: 'translate3d(0,0,0) scale(1.02)' },
        { transform: 'translate3d(' + tx + 'px,' + ty + 'px,0) scale(1)' }
      ],
      { duration: 367, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
    );
    anim.onfinish = commit;
    anim.oncancel = commit;
  }


  document.addEventListener('pointermove', onPointerMove, { passive: false });
  document.addEventListener('pointerup', endDrag);
  document.addEventListener('pointercancel', () => { cancelPress(); endDrag(); });
  window.addEventListener('blur', () => { cancelPress(); endDrag(); });
  return { start: startHandleDrag, cancelPress, get active() { return !!drag; } };
} };
})();
