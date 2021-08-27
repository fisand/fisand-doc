# 快速开始

## 安装

### 使用 npm

```bash
yarn add fisand-doc -D
```

## 使用

```bash
fisandoc
```

## 引入demo

### 引入单文件组件

> 指定 `src` 即可，最好使用绝对路径，以免无法正确引入组件

```vue
<demo src="docs/test.vue" />
```

<demo src="docs/test.vue">
</demo>

### 批量引入

> 指定路径即可，**fisandoc** 会自动引入该路径下所有 `.vue` 文件

```vue
<demo-wrapper src="docs" />
```

<demo-wrapper src="docs" />

::: info 结合 Vue2 使用
`fisandoc` 基于 `vitepress`。默认的 `Vue` 版本为 `3.x`。当你的项目是 `Vue2.x`时，且使用 **composition-api** `demo` 中 `vue` 需要改为 [vue-demi](https://github.com/vueuse/vue-demi)。例如：

```ts
// import { ref } from 'vue'
import { ref } from 'vue-demi'
```

:::
