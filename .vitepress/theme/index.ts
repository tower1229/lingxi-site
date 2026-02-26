import DefaultTheme from 'vitepress/theme'
import HomeContent from './HomeContent.vue'
import { h } from 'vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'home-features-after': () => h(HomeContent),
    })
  },
}
