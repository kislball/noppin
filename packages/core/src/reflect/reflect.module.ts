import { createModule } from '../app/module'
import { reflectService } from './reflect.service'

export const reflectModule = createModule()
  .name('ReflectModule')
  .service(reflectService)
  .build()
