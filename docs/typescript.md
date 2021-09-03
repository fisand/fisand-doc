---
title: TypeScript
sidebar: auto
---

# 编写高质量的 TypeScript 业务代码

> 前置阅读  
> [TypeScript 入门教程](https://ts.xcatliu.com/introduction/what-is-typescript.html)  
> [深入理解 TypeScript](https://jkchao.github.io/typescript-book-chinese/)  
> [HandBook](https://www.typescriptlang.org/docs/handbook/utility-types.html)

## 使用类型

正如其名，Type + Script 是 TypeScript(以下以 TS 简称) 的魅力之所在。TS 的类型丰富多样，但是我们开发的过程中使用的大部分类型如下所示：

- 基本类型，如 `string`、`number`、`boolean`、`undefined`、`null`、`void`、`symbol`
- 引用类型，如 `object`、`Array<T>` / `<T>[]`，`` 等
- 函数类型，如 `() => void` 等
- 内置对象类型，如 `Promise<T>` 等
- Utility Types，如 `ReturnType<T>`，`Omit<T>`，`Partial<T>`，`Record<Keys,Type>` 等
- 其他类型，如：`never`，`unknown`，`any` 等

下面做使用介绍。

### 基本类型

使用起来也非常简单：

```ts
// 定义一个数字类型的变量
let a: number

a = 0 // good
a = '' // error，编译不通过；string 类型不能赋值给数字类型

// 定义个布尔类型的变量
let b: boolean = '' // error，编译不通过；string 类型不能赋值给布尔类型
let c: boolean = false // ok

// 定义一个字符串类型的变量
let d: string = 'xyz'

// 空值 void，常用来表示一个函数没有返回值
function consoleName(): void {
  console.log('My name is Tom')
}

// Null 与 undefined；与 void 的区别是，undefined 和 null 是所有类型的子类型。
// 也就是说 undefined 类型的变量，可以赋值给 number 类型的变量
// 这样不会报错
let num: number = undefined
```

### 任意值

使用 `any` 表示任意类型，可以对 `any` 执行任意操作。

```ts
let a: any = 7
a = '12' // ok
a = () => {} // ok
```

::: warning 注意
使用 `any` 会破坏整体的[类型推导](#类型推导)；在 `any` 之上的任意操作，都会到一个 `any` 的返回值；非必要的情况下尽量不要使用 `any`
:::

::: tip 技巧
在使用[类型断言](#类型断言)时，若把已知类型的断言成为非兼容类型，可以使用 `someThing as any as SomeType`
:::

### 函数与数组类型

函数声明

```ts
// 函数声明，有变量提升
function assignString(x: string, y: string): string {
  return `${x}${y}`
}

// 函数表达式声明
let consoleAny: (x: number) => void = (x) => { console.log(x) }

// 使用接口定义函数
interface SearchFunc {
  (source: string, subString: string): boolean;
}
let mySearch: SearchFunc

// 使用接口定义构造函数/Class
interface Point {
  new (x: number, y: number): Point
  x: number
  y: number
}

// 可以选与剩余参数定义
let c = (x?: string, ...rest: string[]) => {
  console.log(x, rest)
}
```

:::warning 注意
剩余参数只能写在参数的最后
:::

函数重载

```ts
export function proxyUrl(
  origin: string
  target: string
): void

export function proxyUrl(urlMap: string[][]): void

export function proxyUrl(
  origin: string | string[][],
  target?: string
) {
  ;(XMLHttpRequest.prototype as any)._open =
    XMLHttpRequest.prototype.open
  XMLHttpRequest.prototype.open = function (
    method: string,
    url: string,
    async?: boolean
  ) {
    // 用对象便于修改参数
    const options = {
      method: method,
      url: url,
      async: async,
    }

    if (typeof origin === 'string' && target) {
      if (url.includes(origin)) {
        options.url = url.replace(origin, target)
      }

      this._open(options.method, options.url, options.async)
    } else if (Array.isArray(origin)) {
      origin.forEach((map) => {
        if (url.includes(map[0])) {
          options.url = url.replace(map[0], map[1])
        }
      })

      this._open(options.method, options.url, options.async)
    }
  }
}
```

### interface 与 type

在 TS 中，定义对象的接口使用 interface

```ts
interface IPoint {
  x: number
  x: number
  z?: number
}

const p1: IPoint = {
  x: 1,
  y: 2,
}

interface Person {
  readonly name: string;
  age?: number;
  [propName: string]: string | number;
}
```

声明一个新的类型使用 type

```ts
type a = number | string
```

:::tip 讨论
一般情况，类型声明能用 interface 实现，就不用 type 实现；同时二者还有很多高级特性，具体[参考](https://github.com/SunshowerC/blog/issues/7#%E9%83%BD%E5%85%81%E8%AE%B8%E6%8B%93%E5%B1%95extends)
:::

### 联合类型

用中竖线 `|` 来表示，变量可能是其中的某一个类型

```ts
let a = string | number
```

:::tip 思考
其实 boolean 可以理解为联合类型，type yourBoolean = false | true；number 就是无穷数的联合
:::

### 类型推导

TS 很聪明，如果没有明确的指定类型，那么 TypeScript 会依照类型推论（Type Inference）的规则推断出一个类型。

```ts
import { ref } from 'vue'

const a = ref(1)

// 相当于
import { ref } from 'vue'
import type { Ref } from 'vue'

const a: Ref<number> = ref(1)
```

:::warning 注意
也不是那么聪明，推导不出就是 `any`
:::

### 泛型

简单理解，就是定义时候不写死类型，使用的时候再定义类型

```ts
let a: <T>(x: T) => T = (x) => x

// 使用

a<number>(1)
```

### 类型断言

断言有两种语法，只推荐使用 `as`；**一般用来把 `any` 断言为具体类型**。~~实际在使用中往往被开发者用在把具体类型断言为 `any`，啊这~~

```ts
let zeus: string = '1'
;(zeuss as any as number).toFixed()
```

:::tip 注意
另一种写法 <类型>值；非必要尽量别断言
:::

### 内置对象

内置对象有以下几种类型

- 基本类型的构造函数，如 `Boolean`
- Javscript 的内置对象， 如 `Date`, `Promise`，`RegExp`
- `Bom`，`Dom`，如 `HTMLElement`，`UIEvent`，`EventTarget` 等

### 工具类型

TS 提供一些常用的工具类型，以下列举几个常用的，具体参考[HandBook](https://www.typescriptlang.org/docs/handbook/utility-types.html)

- `Omit<Type, Keys>`，即移除类型的一些 `key`
- `ReturnType<Type>`，获取函数的返回值类型
- `InstanceType<Type>`，获取类的实例类型

::: tip 了解更多
以上就是我们在开发业务中常用的一些类型，想了解更多吗？  
来看看[Everyday Type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
:::

## 书写风格

### 代码命名规范

- 通常我们在定义 `interface` 时，以 `I`作为开头
- 定义泛型参数时使用单个大写字母
- 使用 `PascalCase` 为类型命名
- 不要为私有属性名添加 `_` 前缀
- 不要为变量、函数添加 `$` 前缀
- 尽可能使用完整的单词拼写命名
- 使用 `camelCase` 为函数命名
- 使用全大写加下划线为常量命名
- 使用小写字母加下划线为静态文件命名

### 变量的导出

- 除非你想要共享一下工具方法或者变量，否则不要 `export`
- `export default` 被认为是有害的
- 假如是个纯 `TypeScripy` 项目，没有必要使用 `d.ts` 来做类型的导出，因为 `d.ts` 是给 `JavaScript` 来识别的
- 一个文件中类型的定义应该出现在文件的顶部，`import` 语句的后

### 注释

为函数，接口，枚举类型和类使用JSDoc风格的注释

### 泛型的使用场景

泛型在业务开发中，最常用的用的地方就是定义函数类型，根据接收的参数来推导出返回值的类型

```ts
function identity<T>(arg: T): T {
  return arg;
}

// 利用类型推导，TS 可以轻易推导出 output 的类型是个 string
let output = identity("myString")
```

默认的泛型值，我们可以在定义泛型的时候给一个默认值

```ts
function identity<T=any>(arg: T): T {
  return arg;
}
```

泛型约束，可以使用 `extends` 关键字来约束泛型

```ts
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);  // Now we know it has a .length property, so no more error
  return arg;
}
```

### TypeScript 的类型运算

- `typeof`
- `keyof` & `in`
- `extends`
- `infer`
- 字符模板类型

## Composables & TypeScript

### 在 Vue2 中使用 Composables

安装 `@vue/composition-api`

```bash
yarn add @vue/composition-api
```

使用

```ts
import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'

Vue.use(VueCompositionAPI)
```

使用响应式 **API**

```ts
import {
  ref,
  computed,
  defineComponent,
} from '@vue/composition-api'

export default defineComponent({
  setup() {
    const count = ref(0) // count 的类型能被正确推导
    const doubleCount = computed(() => count.value * 2) // doubleCount 也能被正确推导
    const increase = () => { count.value += 1 }

    return { count, increase }
  },
})
```

使用 `watch`

```ts
import {
  watch,
  watchEffect,
  defineComponent
} from '@vue/composition-api'

export default defineComponent({
  setup() {
    const count = ref(0) // count 的类型能被正确推导

    // watch 可以观察一个 ref，然后在其发生变化时，执行回调；默认情况 watch 是 lazy 的；可以观察多个对象
    watch(count, (val) => console.log(val))

    // watchEffect 在立即执行的
    watchEffect(() => console.log(count.value))

    // 两种的监听函数的返回值为 stopWatch；调用即可停止观察
    

    return { count }
  },
})
```

使用声命周期

```ts
import {
  onMounted
} from '@vue/composition-api'

export default defineComponent({
  setup() {
    const count = ref(0) // count 的类型能被正确推导

    onMounted(() => {
      console.log('挂载')
    })
    

    return { count }
  },
})
```

使用 `template ref`

```vue
<template>
  <div ref="root"></div>
</template>

<script lang="ts">
import {
  onMounted
} from '@vue/composition-api'

export default defineComponent({
  setup() {
    const count = ref(0) // count 的类型能被正确推导
    const root = ref<HTMLElement|null>(null) // ref，computed 可以接受泛型参数来约束类型

    onMounted(() => {
      console.log(root.value.innerHTML)
    })
    

    return { count, root }
  },
})
</script>
```

使用 `getCurrentInstance`

```vue
<template>
  <div ref="root"></div>
</template>

<script lang="ts">
import {
  onMounted,
  getCurrentInstance,
} from '@vue/composition-api'

export default defineComponent({
  setup() {
    const count = ref(0) // count 的类型能被正确推导
    const root = ref<HTMLElement|null>(null) // ref，computed 可以接受泛型参数来约束类型

    onMounted(() => {
      console.log(getCurrentInstance().proxy) // .proxy 好比之前的 this
    })
    

    return { count, root }
  },
})
</script>
```

其他注意事项参考[@vue/composition-api](https://github.com/vuejs/composition-api/blob/master/README.zh-CN.md)、[组合式API](https://v3.cn.vuejs.org/guide/composition-api-introduction.html)

### 在 Vue3 中使用 Composables

## [来挑战一下](https://github.com/type-challenges/type-challenges)

### 热身

[Hello World](https://www.typescriptlang.org/play?#code/PQKgUABBCMDMEFoIAkCmAbdB7CB1LATugCaSIIWVkBGAnhAIIB2ALgBZZP0BiArhAAoAAgENWAM14BKCAGJAtw6BquIhkys9REAZGYDu3VVDSYsAGjyESAQj0RAm-GAqOUAB3oFVlQCFugBeNAd6mAYPUDY5oErowAbygPfKgKdygNf6gPgJgFBygNJGEAAqtAAOqBAAwmwimKhMAOaoAM6AQAyAFOrWgDOJgDD-gIhGgDdygP7ygBSugGFygABygNlygHqegOKazoABRoDnur7xSagAygDGBACWiSwQgFgJgOPxgFeBis6A3j6A0eqA3z6A+36ApuaAedqADc7LgBVKgCRKmoUqUGSltoCIxoAYRoC0chX+gADpgIGRgHfygJymgGg5QCdps5AMdygEAPOqAdP1ANK2gFXopaACH+6oA3RUAhTaASHMtoBMVMA99GASH-ClYAAZklj5MjAYAQQD45t5APRmLVsEHyLGmuQgWzILBGKAw2HwRGIEAAvBAxLQyGSSaTyZSoNSIF9vjDAEGagOsgBkIwCwcoAseUA2UaAL8VAED6gA49Hl8lgFObigCiAA9kuMWAAeO0AR14mVdBkFZmIJjZHJyAD5Q9KyVZAJ0OgG-FSKgiAkwClxoB15ReJIggAB9QDTmoA0fwhgEB-wCjpoAUBMAkIahQtWUMQYoQADiU3YvGoEEigFPzQDQ7oAsf7YLBYiXyAC5qRTxmwAHQAK3yk8IOWAcGAAC82AhUgA5MAgYBgfegCAAfRPp7Pp+V4Ihx-Pt6PEF3+95yX5hiFJDFEq4ECVqCdqBdVARRYHBqBSERWXZKZcn3MBDzvW8IARBpAGj5G8EIvR8pgAW0SQg5gAbwgT1vXQExHWdFgTE3LAWGYegAF8IHEAgsGwiAAHIhGfVAEAnTJ0GyPJ8mAXgWCmdB8g4p8+XGER8gKT8AG0yAogC3RouiuF9AUsHfYhwyMVT-xdd0vR9P09IDIMoNycMwAAXVguCQHQjD70BFpAFNrNyMIfPdQDIWtADAlQBquX8ZxAGPIwAVbz7Ach1HYBxynWd5wIRdlzEfIAHdUAIVd1y3IKIG7GK4sHEcx3yCcZznBcl1gYB8iwdAxKmTgFQgWtABezQAsTR0cqEqqmrUvqtcN23R8wCAA)

### 简单

[实现 Pick](https://www.typescriptlang.org/play?#code/PQKgUABBAsELQUHnagG5wgBQJYGMDWl5yFH4BGAnhAIIB2ALgBYD21FAYgK4QAUAAgIZ0AZuwCUEAMSAA70CqyhPbUMzCSXYYANrTgZq+fOP0RAGRmA7t11QAfBECMroHYYwDLWgK8DAFUqBv-0CL0YBh-wETWgOfj0AJQhATlNAbfj3QApYwHnEwCAGMwhAA9NAAHTAf3lACldAUMVAO39AELcAA0xcAB4AFQAaCABpc1zAbZtAaPVAZ2VAe+VYqHxALATAcfjAOblcitzAWjlASATAS6NAPR1AcgNc4tzAU3NAEPNAAgTAbx86uMBo+UAgzTjc3doAZ3xtWgBTACdBPiwTiGLGABNGCABvfChaDFo1E4AuCH3aGdtABzN4Qe4nfZYIEABw+zD+AKB1FBUCgWEYAFsYd9Tvc-iRGIxvgJ8ABfOK0Mgwm53R5oM4nABuGBOAHcIABeCAAWTIBRwJQejHKAHIPl8TqKIAAfCCijHY3Ene6i8xxDHUAEQWjCv50xgM5msjnc15otES75-UUAYRJ1AgZyJmNFpTB6KxOJOeL+lzU+xO7qgFKgu1ycUsgAp1CAAcU+9HYJAggCg5QCn5oBod0AWP-0Wi0GH7H7AYAHLD0AB0ACt9uXGGdgcBoMAAF70OC2gByYBAwDAfdAEAA+sOR6ORxBAAby2UAx3KAQA8h2PF4OID2+1Sabz+dhBWVKpZuQIyH2wAOl4uIIBpW0Aq9GpdYLs-j1cYbF12gvCAAUQAjuw+Gpyh+AAeNJYG+ZIQIIzqYvKPDriccBln+3wopCwDsB8Aaimu1I3FgfCBvsXIQAA2vgQEgbQhTfr+ahUcBJygSqACM5R8gKQqPGKVpSuYvHBp+9GgVRP5-nRFEqgATKxW5FAaXGfN80pygqXrKqqvHmPxxYQLB+xwCcgmaOczpnPgbHbhxIrytxSnyoq3p4rZoraEyf4YOp7oALp9sc5yXNctzCi8+DcYigIgvgEJQrC8LUGFyKohA9lqQSRIOmAFJgL5FxXDc5EMXiTHBe8Cm-P84UohlPl0H5uUCeJ9wScVOqlfFEWekqPoqqlxInKSmX9iA94PsugDQcoAAHKAKbWw0PiuvagPgliAGBKgDVclOgDHkYAKt45nmBZFiWUIVtWtb1o2wACPsbLnC2badotECZltO35oWxalkdNZ1g2Tb7MS6GKFq92AC9mgBYmiYz17W9h1Vp9p2tu2XarmAQA)

[实现 Readonly](https://www.typescriptlang.org/play?#code/PQKgUABBDsELQUHnagG5wgJQKYEMAmB7AOwBsBPSeOSq8gIxIgEECAXAC0PoDEBXCACgACWFgDNuASggBiQAHegVWVpNbgEsizOMoLSATtnzF6UvDQBWGAMbqA1hhIBncuSnOIgDIzAd26OoAPgiBGV0B2GMAZa0ArwMAKpUBv-0BF6MAYf8Aia0A5+IgABTQIQE5TQG346MAKWMB5xMAgBi8IQAPTQAB0wH95QApXQFDFQDt-QBC3AANMXEJSAB4AFW8mwG2bQGj1QGdlQHvlIqhyQBDzQAIEwAA5QCo5QG8fAZjANz1AMB0uhsABI0BIc0A9HUByA0A+6LrALjlAK+VAb+iYwE34wHhDQGcVQAF3EsBVm0BZxMAG00AwJUBZRO2M2WDSO4wg5EA0fKAIM1ik04cwHFBNMwMNoRFhzBgIF08PgIABvchQZjKZhEDAALggdmY2k0AHMiRAcBg7OY6QAHEmEKk0ukERlQAC+xXMhBpEGYuLwVIAsiRWvpOjj8L4ALwEpkksmUiAAIgAErY9QAaJkstmc7kEKl6kR4YxYbR68giibE6UAOm15IgGsNGCIRDweogwGAEAAotptHhtFTzMICHhmBBdFg7HZlPStFg03p2vQObGOajmGQPfhPRb2coucpCH79TQnZwHaHw1GY3GE0mU-mM1mcxA8+mlUWS2WKxA4U1ir5ABTqEAA4qTWNwaBBAFBygFPzQDQ7oAsf9YzGYHLsFPDCPMrE9Jjsnrj9OA0GAAC9WHAAMIAOTAIGAYCAaAEAAPpgeBEHgRAgAG8g0gDHcoAgB6gZBKEgRA-6AeWpYQPKiqFt06ojgQZBASAyGoRBECANK2gCr0VUELkRRYHoQBygALYcnGqb4lGACO3BYEQJpRgAHqWlgQEKEAiLGbEQAA5AIWEYHA16CeSAqssA3AkkQdjyZhJDYYmdisk2ADa5CRmJFjMB0kb8YJHS4QWBjdNKACM3jCXhbkqngXneN5YAALqAciqLopi2KeZqxKkuSvK0gy5A1laDY2tSyUCuQYoceSKI4FSNAOuSwhgCKgFgMBTGUYA0HKzIAptaMUxLHVeAPgQD8gDVcrBgDHkYAKt5HieZ4XsAV43neD7aE+L7CHYADuqJvh+P7kL4+6DcNp7npebKTfej7PsAdh4EQOkZYiEC+IAL2aAFiaHjbaNe3Xreh0zStX6-hhYBAA)

[Concat](https://www.typescriptlang.org/play?#code/PQKgUABBCsDMsQLQQMIHsB2BjAhgF0iUWJMICMBPCAQQwBMAnAUyoGkGcBnNAN04GsqACgACZZrAAM-DgDYAnFk4BKCAGImXKmpwMOFQoTXGIARQCuTTngCWmQ1ACSAWwAOAGybOmGPBDwAFkwQAFI4PDgAylgMNq5+AAbUejgUAHRYmLh4CRAAZubYtpgQNhj+Qf4UrsGcFNZeaTRVNf44-FYVwXgA7mgQugDm5t6+nE0AKpVo5niusxCcATPudBBkwTgQGEw9AylUgfil2O7mdJ1l83icJxDueAwQaAwXDA4QAGIvEEwAHjg3J4PglQTdCHhqsEAEpWcwPCAAXlQWXwAB4ANoARgAugAaCAYgBMOIAfBBgMBfn8alg8Ew1nh+htCViCSTCKCEh9yQA1Gy7Z7lADiNjwAAlzGQAFwQAJ4OacaWUm5YAJpABW4xeg2AcFgYBAwDAJtAEAA+pardarRAAJozJ7oC4QcVMZgWm1e80QI0myGtdDYdETAkAVXJyJwGAMppAnu91ogEysfhQXE6iZtvuNNjcLz8AG8IABRACO5hw7gJJZpTDpEAAvvkGGhnBAAOQiANMRBqqueDCDKzAWY2dycDv+qEQXCcTrIjGEWu0vBo8uV9xooPZTH4wlkgkYsmkvHLut09cVqvb1Fr49H3Gn1kns9QFf1tcbm879HY9n7hisAEgALIerLsgSwEQGBpKnueq5Xput7BveHZYh2kGdrAHaAXkVbzgSZBoGgnjRgSHYgbhz4YuhmEQESFE4QS+ETkwREkWRGAUVRr5gDiJpxgmWY+p85gMIE7oQJE9KuLcIm2n6oCEOSkQBLowQUI6iykWOmBKnKCpycqwCquqWppDqerwMA0acD07oqRA-KCtwZzFBgBnyoqJlmZq2oMLq+rAG5emeU5ACyLzBCg6nuIOw5eUZSoqpwar+ZZgWGsaYBAA)

[第一个元素](https://www.typescriptlang.org/play#code/PQKgUABBCMAsEFoKBpvQAHKCo5QwoqAJfSiEGF4BGAnhAIIB2ALgBYD2V5AYgK4QAUAAgIa0AzNgEoIAYkAB3oFVlcbwBOc3qTx4xaiIAyMwHduKqAD4IgRldA7DGAZa0BXgYAqlQN-+gRejAMP+Aia0Bz8RAAKAJQiBOU0Db8XcAKWMB5xMAgBl0IQDztQAbnDEAsBMAKVwADFgBLOQBnGgAeABU9RPtAYO1AUuNAdeUMQAdTQBG-RJzEwDc9QBX4wD21QsAQtzQsbDbAbx9AaPUwqDxAaPlAIM1wxMmadLwaUgAHAFMIeTloCABeCABtAHJeXYAaCF3iI5OAY12AXVmF5dWAJk2dgGZjx+PoW6GoOaWIHRFrwACbrLapDLZVbQAzAYAQRYADyWFxoixBEBoDAgxGW+12dwBQNBzwhaUyWSecIRyNR6Mx2Nxy1eeEmiXCBkAFOoQADiKXobGIEEAUHKAU-NANDugCx-ug0GjzdIALnh0wudAAdAArdLqhhyADmwDgwAAXnQEABhAByYBAwDADtAEAA+q63e63RBAAbybUAx3KAQA8XR7g86IHaHf9lpDKTlEUj0VQQekVsxttcDFt+MpHSAgyH3RBANK2gFXo+LDPP511h+0pAC28z1NAgAG8IABRACObF4ABtjm2UYs0RAAL4QARyBi1k7cSMINW9nuLKj6xbpYBsGgpHvpQlgSMQC68dJrl7bPAD+lZTvdntZaPZbbvCCfGDp46vPR6Q4Xwdo69dr294Uo+nCiBsBjQI8z6trwioQJkcgpCuo7vlw4GQdBX4-lAl5DtkN5AQ+WRpt+EBUIsABuixyNhv5XoRd7EdsbCJosAjIRiaGsSC7GcSCX5gLcDpgE6lYFoA0HKoIAptYVpW1aieA+gQIAYEqANVyPqAMeRgAq3jKcoKsqwCqhq2q6gaRqwMA-DpAA7jRprmtaeAGJKOl6fKSoqukapajqeqGsa6QMD2m4pEwMzKYAL2aAFia2juQZXk+aZ-kOZaNrhmAQA)
