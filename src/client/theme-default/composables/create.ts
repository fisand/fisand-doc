/**
 *  use API to mounted component
 */
import { render, mergeProps, createVNode } from 'vue'
import ToastConstructor from '../components/Toast.vue'
import type { Component, VNode } from 'vue'

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    remove?: (callback?: (args?: any) => void) => void
    updateProps?: (args: Record<string, any>) => void
  }
}

let seed = 1

const instances: VNode[] = []

export const createComponent = (
  CompConstructor: Component,
  options: Record<string, any>
) => {
  const container = document.createElement('div')
  const id = 'fisand_' + seed++

  const vm = createVNode(CompConstructor, {
    ...options,
    id
  })

  vm.props = mergeProps(vm.props || {}, options)
  render(vm, container)
  instances.push(vm)
  /**
   * mounted dom
   */
  document.body.appendChild(container)

  if (vm?.component?.proxy) {
    /**
     * remove instnace
     */
    ;(vm.component.proxy as any).remove = function (
      callback?: (args?: any) => void
    ) {
      render(null, container)
      document.body.removeChild(container)
      callback?.()
    }
    /**
     * update props
     */
    ;(vm.component.proxy as any).updateProps = function (
      props: Record<string, any>
    ) {
      props &&
        Object.keys(props).forEach((k) => {
          ;(vm as any).component.props[k] = props[k]
        })
    }
  }

  return vm
}

export function close(id: string) {
  const idx = instances.findIndex((vm) => {
    const { id: _id } = vm?.component?.props as any
    return id === _id
  })

  if (idx === -1) {
    return
  }

  ;(instances[idx].component?.proxy as any).remove()
  instances.splice(idx, 1)
}

export const Toast = Object.create(null)

Toast.create = function ({ message = '' }) {
  const options = { message }
  if (ToastConstructor._instance) {
    ToastConstructor._instance.component.proxy.updateProps(options)
    ToastConstructor._instance.component.proxy.show?.()
    return ToastConstructor._instance.component.proxy
  }

  const vm = (ToastConstructor._instance = createComponent(
    ToastConstructor,
    options
  ))

  ;(vm?.component?.proxy as any)?.show?.()

  return vm?.component?.proxy
}

Toast.close = (remove?: boolean) => {
  if (remove) {
    close(ToastConstructor._instance?.component.props.id ?? '')
    ToastConstructor._instance = null
  } else {
    ToastConstructor._instance?.component.proxy.hide()
  }
}
