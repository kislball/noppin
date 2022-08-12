import { Module } from '../app/module'
import { createShadow } from '../app/service'
import { Container } from '../container/container'

export const [containerKey, containerShadow] = createShadow<Container>('Container')

export const [rootKey, rootShadow] = createShadow<Module>('RootModule')
