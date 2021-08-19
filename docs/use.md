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
```vue
const a = 'a'
```
</demo>

### 批量引入

> 指定路径即可，**fisandoc** 会自动引入该路径下所有 `.vue` 文件

```vue
<demo-wrapper src="docs" />
```

<demo-wrapper src="docs" />
