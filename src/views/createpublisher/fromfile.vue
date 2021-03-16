<template>
  <div class="upload-container">
    <div class="editor-custom-btn-container">
      <editorImage color="#1890ff" class="editor-upload-btn"/>
    </div>
  </div>
</template>

<script>
import editorImage from '@/views/components/Editimage'

export default {
  name: 'fromfile',
  components: { editorImage },
  data() {
    return {
      dialogVisible: false,
      listObj: {},
      fileList: []
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>

</style>
