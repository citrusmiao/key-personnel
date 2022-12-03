import Vue from 'vue'
import SimpleMessageBox from './index.vue'

const Dialog = Vue.extend(SimpleMessageBox)

SimpleMessageBox.install = function(data) {
  const instance = new Dialog().$mount()
  document.body.appendChild(instance.$el)
  Vue.prototype.$dialog = {
    show(content, title, options) {
      return instance.show(content, title, options)
    }
  }
}

export default SimpleMessageBox
