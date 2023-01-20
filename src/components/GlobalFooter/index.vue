<template>
  <global-footer class="footer custom-render">
    <template v-slot:links>
      <!-- <a href="" target="_blank"></a> -->
    </template>
    <template v-slot:copyright>
      <a target="_blank">Hackathon</a>
    </template>
  </global-footer>
</template>

<script>
import { GlobalFooter } from '@ant-design-vue/pro-layout'

export default {
  name: 'ProGlobalFooter',
  components: {
    GlobalFooter
  }
}
</script>
