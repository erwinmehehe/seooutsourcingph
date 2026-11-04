(function(){'use strict';
  const toggle = document.querySelector('.sop-menu-button');
  const nav = document.querySelector('#sop-main-nav');
  if(toggle && nav){
    const close=()=>{toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open navigation');nav.classList.remove('sop-nav-open');};
    toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');nav.classList.toggle('sop-nav-open',open);});
    nav.addEventListener('click',e=>{if(e.target.closest('a'))close();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){const wasOpen=nav.classList.contains('sop-nav-open');close();if(wasOpen)toggle.focus();}});
    document.addEventListener('click',e=>{if(!nav.contains(e.target)&&!toggle.contains(e.target))close();});
  }
  document.querySelectorAll('form.sop-form').forEach(form=>form.addEventListener('submit',()=>{
    if(!form.checkValidity())return;
    const btn=form.querySelector('[type="submit"]');if(!btn)return;
    btn.disabled=true;btn.setAttribute('aria-busy','true');btn.textContent='Sending your request…';
  }));
  const toc=document.querySelector('[data-sop-toc]');
  const content=document.querySelector('.sop-article-content');
  if(toc&&content){const list=toc.querySelector('ol');const heads=[...content.querySelectorAll('h2,h3')].filter(h=>h.textContent.trim());
    heads.forEach((h,i)=>{if(!h.id)h.id='section-'+(i+1);let li=document.createElement('li');let a=document.createElement('a');a.href='#'+h.id;a.textContent=h.textContent.trim();if(h.tagName==='H3')li.style.paddingLeft='12px';li.append(a);list.append(li);});
    if(!heads.length)toc.hidden=true;
  }
})();
