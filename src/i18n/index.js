import Vue from 'vue'
import VueI18n from 'vue-i18n'

import en from './en'
import zh from './zh'

Vue.use(VueI18n)

// 获取系统语言
function getSystemLang() {
  const lang = navigator.languages?.[0] || navigator.language || 'en'
  console.log("System language: " + lang);

  if (lang.startsWith('zh')) return 'zh'
  return 'en'
}

export default new VueI18n({
  locale: localStorage.getItem('lang') || getSystemLang(),
  fallbackLocale: 'en',
  messages: { en, zh }
})
