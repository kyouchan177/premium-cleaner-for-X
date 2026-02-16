/**
 * JavaScript (MutationObserver) による非表示
 * Xのサイドバーなどはページ読み込み後に動的に追加されることがあるため、
 * DOMの変化を監視して、現れた瞬間に削除または非表示にします。
 */

function hidePremiumButton() {
  // 1. 左メニューの「プレミアム」リンク
  // 2. data-testid="premium-signup-tab"
  // 3. 右サイドバーの「プレミアムにサブスクライブ」 (asideタグ)
  const premiumButtons = document.querySelectorAll(
    'a[aria-label="プレミアム"], [data-testid="premium-signup-tab"], aside[aria-label="プレミアムにサブスクライブ"], a[aria-label="クリエイタースタジオ"], a[href="/i/premium_sign_up"]'
  );

  premiumButtons.forEach(button => {
    if (button.style.display !== 'none') {
      const label = button.getAttribute('aria-label') || 'labelなし';
      console.log('premium cleaner for X:（' + label + '）を非表示。');
      button.style.display = 'none';
    }
  });
  //.foreachは配列やリストの中身に対して、繰り返し処理を行うための命令

  // 「認証を受ける」リンク (a[href="/i/premium_sign_up"]) を含む親divを非表示にする
  // プレミアムユーザーのプロフィールページを開いた時の緑色のパネル用
  const premiumLinks = document.querySelectorAll('a[href="/i/premium_sign_up"]');
  premiumLinks.forEach(link => {
    // 「認証を受ける」のテキストを含むかチェック
    if (link.textContent.includes('認証を受ける')) {
      // 直上の親要素がdivだった場合のみ非表示にする
      let container = link.parentElement;
      if (container && container.tagName === 'DIV' && container.style.display !== 'none') {
        console.log('「認証を受ける」の直上の親divを発見。非表示にします。');
        container.style.display = 'none';
      }
    }
  });
}

// ページ読み込み時に実行
hidePremiumButton();

// DOMの変化を監視するMutationObserverの設定
const observer = new MutationObserver((mutations) => {
  // mutationsには、発生したすべての変更が配列で入っています
  for (const mutation of mutations) {
    // 新しくノード（要素）が追加された場合のみ処理を行う
    if (mutation.addedNodes.length > 0) {
      hidePremiumButton();
      break; // 1回のバッチ（一連の変更）で1度実行すれば十分なのでループを抜ける
    }
  }
});

// body全体を監視対象にする
observer.observe(document.body, {
  childList: true,
  subtree: true
});

console.log('X Premium Button Cleanup: 監視を開始しました');
