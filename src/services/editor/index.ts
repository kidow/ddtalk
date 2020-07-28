import * as MonacoEditor from 'monaco-editor/esm/vs/editor/editor.api'

export const onRegisterVue = (monaco: typeof MonacoEditor) => {
  monaco.languages.register({ id: 'vue' })
  monaco.languages.setMonarchTokensProvider('vue', {
    tokenizer: {
      root: []
    }
  })
  monaco.editor.defineTheme('vue', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {}
  })
  monaco.editor.setTheme('vue')
}

export const onRegisterDart = (monaco: typeof MonacoEditor) => {
  monaco.languages.register({ id: 'dart' })
  // monaco.languages.setMonarchTokensProvider('dart', {
  //   tokenizer: {}
  // })
  monaco.editor.defineTheme('dart', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {}
  })
  monaco.editor.setTheme('dart')
}

export const onRegisterSvelte = (monaco: typeof MonacoEditor) => {
  monaco.languages.register({ id: 'svelte' })
  // monaco.languages.setMonarchTokensProvider('svelte', {
  //   tokenizer: {}
  // })
  monaco.editor.defineTheme('svelte', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {}
  })
  monaco.editor.setTheme('svelte')
}

export const defineTheme = (monaco: typeof MonacoEditor) => {
  monaco.editor.defineTheme('dark-plus', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      {
        foreground: 'c586c0',
        token: 'keyword'
      }
    ],
    colors: {}
  })
}
