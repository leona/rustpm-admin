<template>
  <prism-editor class="my-editor" @input="$emit('input', contentModel)" v-model="contentModel" :highlight="highlighter" line-numbers></prism-editor>
</template>

<script>
  import { PrismEditor } from 'vue-prism-editor';
  import 'vue-prism-editor/dist/prismeditor.min.css';
  import { highlight, languages } from 'prismjs/components/prism-core';
  import 'prismjs/components/prism-clike';
  import 'prismjs/components/prism-markup';
  import 'prismjs/components/prism-csharp';
  import 'prismjs/components/prism-aspnet';
  import 'prismjs/components/prism-javascript';
  import 'prismjs/themes/prism-tomorrow.css';

  export default {
    components: {
      PrismEditor,
    },
    props: ['value', 'extension'],
    data() {
      return {
        contentModel: this.value
      }
    },
    mounted() {
      this.contentModel = this.value
    },
    methods: {
      highlighter(code) {
        let language;
        console.log(languages)
        switch(this.extension) {
          case 'cs':
            language = languages.csharp
            break
          default:
            language = languages.js
        }

        return highlight(code, language);
      },
    },
    watch: {
      value() {
        this.contentModel = this.value
      }
    }
  };
</script>

<style>
  .my-editor {
    background: #2d2d2d;
    color: #ccc;
    font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
    font-size: 14px;
    line-height: 1.5;
    padding: 20px 5px;
  }

  .prism-editor__textarea:focus {
    outline: none;
  }
</style>