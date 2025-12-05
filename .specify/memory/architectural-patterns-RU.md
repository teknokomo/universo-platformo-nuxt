# Архитектурные Паттерны

> **Цель**: Детальные архитектурные паттерны и лучшие практики, принятые из Universo Platformo React. Эти паттерны обеспечивают согласованность, поддерживаемость и масштабируемость в реализации Nuxt.

**Последнее обновление**: 2025-11-17  
**Источник**: Глубокий анализ [universo-platformo-react](https://github.com/teknokomo/universo-platformo-react)

---

## Основные Паттерны (КРИТИЧНЫЕ)

### 0. Модульность на Основе Пакетов (СТРОЖАЙШЕЕ СОБЛЮДЕНИЕ)

**Правило**: ВЕСЬ функциональный код ДОЛЖЕН быть реализован внутри пакетов в директории `packages/`. Реализации вне пакетов СТРОГО ЗАПРЕЩЕНЫ.

**Структура Реализации**:

```text
✅ ПРАВИЛЬНО: Реализация на основе пакетов
packages/
├── clusters-frt/base/          # Фронтенд для функционала Кластеров
│   ├── package.json
│   ├── src/
│   │   ├── components/         # UI компоненты кластеров
│   │   ├── composables/        # Специфичные для кластеров composables
│   │   ├── pages/              # Страницы кластеров
│   │   └── index.ts            # Экспорты пакета
│   └── README.md
├── clusters-srv/base/          # Бэкенд для функционала Кластеров
│   ├── package.json
│   ├── src/
│   │   ├── api/                # API роуты кластеров
│   │   ├── services/           # Бизнес-логика кластеров
│   │   ├── entities/           # TypeORM сущности кластеров
│   │   └── index.ts            # Экспорты пакета
│   └── README.md
└── @universo/types/base/       # Общие типы
    ├── package.json
    └── src/index.ts

❌ ЗАПРЕЩЕНО: Реализация на корневом уровне
src/
├── components/                 # ❌ Нет корневых компонентов!
├── pages/                      # ❌ Нет корневых страниц!
└── server/                     # ❌ Нет корневого серверного кода!
app.vue                         # ❌ Только минимальная загрузка разрешена!
```

**Матрица Решений для Размещения Кода**:

| Тип Кода                        | Размещение                            | Разрешено в Корне? |
| ------------------------------- | ------------------------------------- | ------------------ |
| UI компоненты функционала       | `packages/{domain}-frt/base/src/`     | ❌ НЕТ             |
| API роуты функционала           | `packages/{domain}-srv/base/src/`     | ❌ НЕТ             |
| Бизнес-логика функционала       | `packages/{domain}-srv/base/src/`     | ❌ НЕТ             |
| Общие типы                      | `packages/@universo/types/base/`      | ❌ НЕТ             |
| Общие утилиты                   | `packages/@universo/utils/base/`      | ❌ НЕТ             |
| Конфигурационные файлы          | Корневая директория                   | ✅ ДА              |
| Минимальная загрузка приложения | Корневой `app.vue` (загружает пакеты) | ✅ ДА (минимально) |
| Скрипты сборки/развертывания    | Корневая директория                   | ✅ ДА              |
| Документация                    | Корневой `README.md`                  | ✅ ДА              |

**Контрольный Список Готовности к Извлечению Пакета**:

Для того чтобы пакет был готов к извлечению:

- [ ] Все зависимости явно указаны в package.json
- [ ] Нет импортов извне пакета (кроме workspace deps)
- [ ] Независимые скрипты сборки и тестирования
- [ ] Двуязычный README с инструкциями по настройке
- [ ] Четко определенный публичный API в экспортах
- [ ] Поддерживаются номер версии и changelog

**Преимущества**:

- **Перспективность**: Пакеты могут быть извлечены в отдельные репозитории
- **Модульность**: Четкие границы и владение
- **Переиспользуемость**: Пакеты могут использоваться в разных проектах
- **Тестируемость**: Каждый пакет независимо тестируется
- **Поддерживаемость**: Изменения изолированы в конкретных пакетах
- **Масштабируемость**: Команды могут работать над разными пакетами параллельно

**Обнаружение Нарушений**:

```bash
# Найти код вне пакетов (должно вернуть пусто или только конфигурационные файлы)
find . -maxdepth 2 -name "*.vue" -o -name "*.ts" | grep -v node_modules | grep -v packages

# Проверить, что весь код функционала в пакетах
find packages -type d -name "base" | wc -l  # Должно совпадать с количеством функционалов

# Проверить запрещенные корневые директории
[ -d "src" ] && echo "❌ НАРУШЕНИЕ: Существует корневая директория src/"
[ -d "components" ] && echo "❌ НАРУШЕНИЕ: Существует корневая директория components/"
[ -d "pages" ] && echo "❌ НАРУШЕНИЕ: Существует корневая директория pages/"
```

**Путь Миграции** (если найдены нарушения):

1. Идентифицировать весь код вне пакетов
2. Создать соответствующую структуру пакета (`{domain}-frt` или `{domain}-srv`)
3. Переместить код в директорию `base/src/` пакета
4. Обновить импорты для использования ссылок на пакеты
5. Добавить пакет в `pnpm-workspace.yaml`
6. Проверить, что сборка и тесты проходят
7. Удалить старые директории корневого уровня

---

### 1. Паттерн Repository для Доступа к Базе Данных

**Правило**: ВСЕ операции с базой данных ДОЛЖНЫ идти через репозитории TypeORM. Прямые SQL-запросы ЗАПРЕЩЕНЫ.

**Реализация**:

```typescript
// ✅ ПРАВИЛЬНО: Паттерн Repository
import { getDataSource } from './DataSource';
import { User } from './entities/User';

const userRepo = getDataSource().getRepository(User);
const user = await userRepo.findOne({ where: { id: userId } });
await userRepo.save(user);

// ❌ ЗАПРЕЩЕНО: Прямой SQL
const result = await connection.query('SELECT * FROM users WHERE id = $1', [userId]);
```

**Преимущества**:

- Типобезопасность с TypeScript
- Автоматическое применение Row Level Security (RLS)
- Упрощенное тестирование через моки
- Гибкость миграции базы данных
- Согласованная обработка ошибок

**Обнаружение**:

```bash
# Найти прямые SQL-запросы (антипаттерн)
grep -r "query\(" packages/*/src --exclude-dir=migrations
```

---

### 2. Паттерн Guards для Разрешений

**Правило**: Использовать фабричные функции для генерации переиспользуемых guards разрешений.

**Реализация**:

```typescript
// Создать фабрику guards
export const createAccessGuards = <TEntity>(config: {
  entityType: string;
  rolePermissions: Record<string, number>;
}) => {
  return {
    ensureAccess: (requiredRoles: string[]) => {
      return async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?.id;
        const entityId = req.params.id;

        // Проверить членство и роль
        const membership = await getMembership(entityId, userId);
        if (!membership || !requiredRoles.includes(membership.role)) {
          return res.status(403).json({ error: 'Insufficient permissions' });
        }

        next();
      };
    },

    assertNotOwner: (member: TEntity) => {
      if (member.role === 'owner') {
        throw new Error('Cannot modify owner');
      }
    },
  };
};

// Использование в маршрутах
const guards = createAccessGuards({
  entityType: 'metaverse',
  rolePermissions: { owner: 4, admin: 3, editor: 2, member: 1 },
});

router.patch('/:id', guards.ensureAccess(['editor', 'admin', 'owner']), handler);
```

**Преимущества**:

- DRY (Don't Repeat Yourself)
- Типобезопасная проверка разрешений
- Согласованная обработка ошибок
- Централизованная логика разрешений
- Легко тестировать

---

### 3. Фабричные Функции для Actions

**Правило**: Использовать фабричные функции для генерации CRUD actions, сокращая дублирование кода на 90%+.

**Фабрика Entity Actions**:

```typescript
import { createEntityActions } from '@universo/template-mui';

// Для сущностей с полями name/description
export default createEntityActions<Metaverse, MetaverseData>({
  i18nPrefix: 'metaverses',
  getInitialFormData: (entity) => ({
    initialName: entity.name,
    initialDescription: entity.description,
  }),
});
```

**Фабрика Member Actions**:

```typescript
import { createMemberActions } from '@universo/template-mui';

// Для управления участниками
export default createMemberActions<MetaverseMember>({
  i18nPrefix: 'metaverses',
  entityType: 'metaverse',
});
```

**Преимущества**:

- 130 строк → 11 строк (сокращение на 91%)
- Согласованная обработка ошибок
- Типобезопасность с дженериками
- Переиспользование между модулями
- Централизованные паттерны i18n

---

### 4. Универсальная Система Ролей

**Правило**: Централизованная иерархия ролей с согласованной проверкой разрешений.

**Иерархия Ролей**:

```typescript
export enum Role {
  OWNER = 4, // Полный контроль
  ADMIN = 3, // Административный доступ
  EDITOR = 2, // Редактирование контента
  MEMBER = 1, // Ограниченный доступ
  GUEST = 0, // Только чтение (если применимо)
}

export const hasRequiredRole = (userRole: Role, requiredRole: Role): boolean => {
  return userRole >= requiredRole;
};

export const canManageRole = (managerRole: Role, targetRole: Role): boolean => {
  return managerRole > targetRole;
};
```

**Использование**:

```typescript
// Проверить, может ли пользователь выполнить действие
if (!hasRequiredRole(user.role, Role.EDITOR)) {
  throw new Error('Insufficient permissions');
}

// Проверить, может ли пользователь управлять другим участником
if (!canManageRole(user.role, member.role)) {
  throw new Error('Cannot manage users with equal or higher role');
}
```

---

### 5. Архитектура i18n

**Правило**: Централизованная регистрация пространств имен с паттерном singleton.

**Реализация**:

```typescript
// В пакете @universo/i18n
import { getInstance, registerNamespace } from '@universo/i18n';
import metaversesEn from './en.json';
import metaversesRu from './ru.json';

// Зарегистрировать пространство имен один раз
getInstance();
registerNamespace('metaverses', {
  en: metaversesEn,
  ru: metaversesRu,
});

// В компонентах
const { t } = useTranslation('metaverses');
const title = t('members.editTitle');
```

**Преимущества**:

- Единый источник истины
- Предотвращает дублирование регистраций
- Изоляция пространств имен
- Типобезопасные переводы
- Упрощенное тестирование

**Обнаружение**:

```bash
# Найти прямые вызовы i18next.use() (антипаттерн)
grep -r "i18next.use" packages/*/src
```

---

### 6. Паттерн Universal List

**Правило**: Переиспользуемый компонент списка с пагинацией на бэкенде, поиском и сортировкой.

**Схема Backend**:

```typescript
import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type PaginationParams = z.infer<typeof paginationSchema>;
```

**Хук Frontend**:

```typescript
const { data, isLoading } = usePaginated<MetaverseListItem>({
  queryKey: ['metaverses', filters],
  queryFn: ({ pageParam }) => fetchMetaverses(pageParam),
  initialPageParam: { page: 1, limit: 10 },
});
```

**Преимущества**:

- Принцип DRY
- Согласованный UX
- Типобезопасность
- Легко тестировать
- Обработка состояний загрузки/ошибок

---

### 7. Паттерн RLS Integration

**Правило**: Row Level Security (RLS) с валидацией на уровне приложения как основной слой.

**Слои Безопасности**:

1. **Основной**: Валидация на уровне приложения (TypeORM + Guards)
2. **Резервный**: Политики RLS базы данных
3. **Кеш**: Кеш членства на уровне запроса

**Паттерн**:

```typescript
// Убедиться, что у пользователя есть доступ
const userId = await ensureAccess(req, res, entityId, {
  roles: ['editor', 'admin', 'owner'],
});
if (!userId) return; // Ответ уже отправлен

// Продолжить с операцией репозитория
const repo = getDataSource().getRepository(Entity);
const entity = await repo.findOne({ where: { id: entityId } });
```

**Преимущества**:

- Эшелонированная защита
- Понятные сообщения об ошибках
- Производительность (кеширование)
- Аудит действий

---

### 8. Паттерн Data Isolation

**Правило**: Трехуровневая изоляция данных с промежуточными таблицами.

**Структура**:

```typescript
// Три уровня
Cluster → Domain → Resource
Metaverse → Section → Entity
Space → Canvas → Node

// Промежуточные таблицы для связей
entities_metaverses { entity_id, metaverse_id }
sections_metaverses { section_id, metaverse_id }

// API с областью действия кластера
GET /api/v1/metaverses/:id/sections
GET /api/v1/metaverses/:id/entities
```

**Преимущества**:

- Полное разделение данных
- Поддержка мультитенантности
- Четкие границы владения
- Предсказуемые паттерны запросов

---

## Второстепенные Паттерны

### 9. Паттерн TanStack Query (Vue Query)

**Правило**: Декларативный `useQuery()` в компонентах, императивный `fetchQuery()` в обработчиках.

**Фабрика Query Keys**:

```typescript
export const metaverseKeys = {
  all: ['metaverses'] as const,
  lists: () => [...metaverseKeys.all, 'list'] as const,
  list: (filters: string) => [...metaverseKeys.lists(), { filters }] as const,
  details: () => [...metaverseKeys.all, 'detail'] as const,
  detail: (id: string) => [...metaverseKeys.details(), id] as const,
};
```

**Использование**:

```typescript
// Декларативный (автоматическая загрузка при монтировании)
const { data, isLoading } = useQuery({
  queryKey: metaverseKeys.detail(id),
  queryFn: () => fetchMetaverse(id),
});

// Императивный (ручной запуск)
const handleClick = async () => {
  const data = await queryClient.fetchQuery({
    queryKey: metaverseKeys.detail(id),
    queryFn: () => fetchMetaverse(id),
  });
};
```

---

### 10. Паттерн Testing Environment

**Правило**: Использовать happy-dom для тестов в 4-9 раз быстрее чем jsdom.

**Конфигурация**:

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'happy-dom',
    // Замокать тяжелые зависимости
    setupFiles: ['./setupTests.ts'],
  },
});

// setupTests.ts
vi.mock('rehype-mathjax', () => ({ default: () => () => {} }));
```

**Производительность**:

- jsdom: 2-5с инициализация
- happy-dom: 566мс инициализация

---

### 11. Паттерн Source-Only Package

**Правило**: Пакеты только с исходным кодом (без dist) ДОЛЖНЫ использовать peerDependencies.

**Конфигурация**:

```json
{
  "name": "@universo/template-mui",
  "peerDependencies": {
    "react": "catalog:react",
    "@mui/material": "catalog:mui",
    "vue": "catalog:vue"
  }
}
```

**Почему**: Родительское приложение разрешает зависимости; Vite импортирует исходный код напрямую.

**Обнаружение**:

```bash
# Найти пакеты только с исходным кодом с неправильными deps
find packages/*/base -name "package.json" -exec grep -L '"main":' {} \; | \
  xargs grep '"dependencies":'
```

---

### 12. Соглашение об Именовании Миграций

**Правило**: Согласованные, описательные имена миграций без устаревших ссылок.

**Формат**:

- `AddEntityNameAndLinked.ts` - Добавление новых сущностей со связями
- `CreateSchemaName.ts` - Создание новой схемы базы данных
- БЕЗ упоминаний "Flowise" в новых миграциях

**Примеры**:

```typescript
// ✅ ХОРОШО
export class AddUniksAndLinked1234567890 implements MigrationInterface {}
export class CreateMetaversesSchema1234567891 implements MigrationInterface {}

// ❌ ПЛОХО
export class CreateUniksTable1234567890 implements MigrationInterface {}
export class FlowiseMetaverses1234567891 implements MigrationInterface {}
```

---

### 13. Event-Driven Data Loading

**Правило**: Слушать события сервера и инвалидировать запросы для обновлений в реальном времени.

**Паттерн**:

```typescript
// Слушать события
socket.on('entity:updated', (data) => {
  // Инвалидировать затронутые запросы
  queryClient.invalidateQueries(entityKeys.detail(data.id));
  queryClient.invalidateQueries(entityKeys.lists());
});

// Используется в чат-сообщениях, совместной работе в реальном времени
queryClient.invalidateQueries(messageKeys.all);
```

---

### 14. Двойная Система Сборки

**Правило**: Поддержка CJS и ESM для максимальной совместимости.

**Конфигурация**:

```typescript
// tsdown.config.ts
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  treeshake: true,
  platform: 'neutral',
});
```

**Package Exports**:

```json
{
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "require": "./dist/index.cjs",
      "import": "./dist/index.mjs",
      "types": "./dist/index.d.ts"
    }
  }
}
```

---

## Антипаттерны (Что НЕ Делать)

### ❌ Прямые Запросы к Базе Данных

```typescript
// ПЛОХО
const result = await connection.query('SELECT * FROM users WHERE id = $1', [userId]);

// ХОРОШО
const repo = getDataSource().getRepository(User);
const user = await repo.findOne({ where: { id: userId } });
```

### ❌ Прямой Клиент Supabase в Бизнес-Логике

```typescript
// ПЛОХО
import { supabaseClient } from './supabase';
const { data } = await supabaseClient.from('users').select('*');

// ХОРОШО
const repo = getDataSource().getRepository(User);
const users = await repo.find();
```

### ❌ useEffect() для Загрузки Данных

```typescript
// ПЛОХО
useEffect(() => {
  fetch('/api/data').then((res) => setData(res));
}, []);

// ХОРОШО
const { data } = useQuery({
  queryKey: ['data'],
  queryFn: () => fetchData(),
});
```

### ❌ Пакеты с Исходным Кодом с Dependencies

```json
// ПЛОХО: Пакет только с исходным кодом
{
  "dependencies": {
    "react": "^18.0.0"
  }
}

// ХОРОШО: Пакет только с исходным кодом
{
  "peerDependencies": {
    "react": "catalog:react"
  }
}
```

---

## Адаптация для Nuxt

### Адаптировать для Nuxt/Vue

1. **TanStack Query** → Использовать `@tanstack/vue-query` или composables Nuxt с `useFetch`/`useAsyncData`
2. **React Hooks** → Vue Composition API composables (использовать префикс `use*`)
3. **React StrictMode** → Строгий режим Vue DevTools
4. **React Router** → Файловая маршрутизация Nuxt с директорией `pages/`
5. **Express Routes** → Серверные маршруты Nuxt в директории `server/api/`

---

## Лучшие Практики Nuxt (ОБЯЗАТЕЛЬНО)

### 22. Паттерн Интеграции Пакетов Nuxt

**Правило**: Пакеты ДОЛЖНЫ интегрироваться с Nuxt используя Nuxt Layers или явные exports.

**Подход Nuxt Layer** (для UI/компонентных пакетов):

```typescript
// packages/clusters-frt/base/nuxt.config.ts
export default defineNuxtConfig({
  // Конфигурация слоя
  components: true,
  composables: {
    dirs: ['composables'],
  },
});

// Корневой nuxt.config.ts расширяет слой
export default defineNuxtConfig({
  extends: ['./packages/clusters-frt/base'],
});
```

**Подход Явного Export** (для утилитных пакетов):

```typescript
// packages/@universo/types/base/package.json
{
  "name": "@universo/types",
  "exports": {
    ".": "./src/index.ts",
    "./entities": "./src/entities/index.ts"
  }
}

// Импорт в любом пакете
import { User, Cluster } from '@universo/types'
import { UserEntity } from '@universo/types/entities'
```

**Преимущества**:

- Hot Module Replacement (HMR) для изменений пакетов
- Автоимпорт из пакетов
- Типобезопасность между пакетами
- Совместимость с SSR

**Обнаружение**:

```bash
# Найти пакеты без интеграции Nuxt
find packages/*/base -name "package.json" | while read f; do
  dir=$(dirname "$f")
  if [ ! -f "$dir/nuxt.config.ts" ] && ! grep -q '"exports"' "$f"; then
    echo "Отсутствует интеграция: $dir"
  fi
done
```

---

### 23. Паттерн Организации Серверных API Маршрутов

**Правило**: Серверные маршруты ДОЛЖНЫ быть организованы по функциям внутри директорий `server/` пакетов.

**Структура**:

```
packages/clusters-srv/base/
├── server/
│   ├── api/
│   │   ├── clusters/
│   │   │   ├── index.get.ts          # GET /api/clusters
│   │   │   ├── index.post.ts         # POST /api/clusters
│   │   │   ├── [id].get.ts           # GET /api/clusters/:id
│   │   │   ├── [id].patch.ts         # PATCH /api/clusters/:id
│   │   │   ├── [id].delete.ts        # DELETE /api/clusters/:id
│   │   │   └── [id]/
│   │   │       ├── domains.get.ts    # GET /api/clusters/:id/domains
│   │   │       └── members.get.ts    # GET /api/clusters/:id/members
│   │   └── health.get.ts             # GET /api/health
│   ├── middleware/
│   │   ├── auth.ts                   # Middleware аутентификации
│   │   └── validate.ts               # Валидация запросов
│   └── utils/
│       ├── db.ts                     # Утилиты базы данных
│       └── guards.ts                 # Проверки прав доступа
```

**Реализация Серверного Маршрута**:

```typescript
// packages/clusters-srv/base/server/api/clusters/index.get.ts
import { defineEventHandler, getQuery } from 'h3';
import { z } from 'zod';

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  // Валидация параметров запроса
  const query = querySchema.parse(getQuery(event));

  // Получить пользователя из middleware аутентификации
  const user = event.context.user;

  // Получить данные используя паттерн репозитория
  const clusters = await getClustersRepository().findPaginated(query, user.id);

  return {
    data: clusters,
    pagination: {
      page: query.page,
      limit: query.limit,
      total: clusters.length,
    },
  };
});
```

**Преимущества**:

- Понятная структура API
- Файловая маршрутизация
- Типобезопасные запрос/ответ
- Автоматическая горячая перезагрузка
- SSR и API маршруты в одной кодовой базе

---

### 24. Паттерн Composables

**Правило**: Переиспользуемая логика ДОЛЖНА быть извлечена в composables следуя лучшим практикам Vue.

**Структура Composables**:

```
packages/clusters-frt/base/composables/
├── useClusters.ts                # Основная загрузка данных
├── useClusterForm.ts             # Управление состоянием формы
├── useClusterPermissions.ts      # Проверки прав доступа
└── index.ts                      # Barrel export
```

**Composable Загрузки Данных**:

```typescript
// packages/clusters-frt/base/composables/useClusters.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import type { Cluster, ClusterCreateInput } from '@universo/types';

export const useClusters = () => {
  const queryClient = useQueryClient();

  // Получить список
  const { data: clusters, isLoading } = useQuery({
    queryKey: ['clusters'],
    queryFn: () => $fetch<Cluster[]>('/api/clusters'),
  });

  // Мутация создания
  const createCluster = useMutation({
    mutationFn: (data: ClusterCreateInput) =>
      $fetch('/api/clusters', { method: 'POST', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clusters'] });
    },
  });

  return {
    clusters,
    isLoading,
    createCluster,
  };
};
```

**Composable Формы**:

```typescript
// packages/clusters-frt/base/composables/useClusterForm.ts
import { ref, computed } from 'vue';
import { z } from 'zod';

const clusterSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

export const useClusterForm = (initialData?: Partial<Cluster>) => {
  const formData = ref({
    name: initialData?.name ?? '',
    description: initialData?.description ?? '',
  });

  const errors = ref<Record<string, string>>({});

  const validate = () => {
    try {
      clusterSchema.parse(formData.value);
      errors.value = {};
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        errors.value = Object.fromEntries(err.errors.map((e) => [e.path[0], e.message]));
      }
      return false;
    }
  };

  const isValid = computed(() => Object.keys(errors.value).length === 0);

  return {
    formData,
    errors,
    validate,
    isValid,
  };
};
```

**Преимущества**:

- Переиспользуемость между компонентами
- Типобезопасность
- Тестируемость в изоляции
- Автоимпорт в Nuxt
- Совместимость с SSR при правильной обработке жизненного цикла

---

### 25. Паттерн Типобезопасного API Клиента

**Правило**: Коммуникация Frontend-Backend ДОЛЖНА использовать общие типы и типобезопасные клиенты.

**Пакет Общих Типов**:

```typescript
// packages/@universo/types/base/src/api/clusters.ts
import { z } from 'zod';

// Схемы запросов
export const clusterCreateSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

export const clusterUpdateSchema = clusterCreateSchema.partial();

// Типы ответов
export interface Cluster {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

// Вывод типов
export type ClusterCreateInput = z.infer<typeof clusterCreateSchema>;
export type ClusterUpdateInput = z.infer<typeof clusterUpdateSchema>;
```

**Использование на Backend**:

```typescript
// packages/clusters-srv/base/server/api/clusters/index.post.ts
import { clusterCreateSchema, type Cluster } from '@universo/types/api/clusters';

export default defineEventHandler(async (event): Promise<Cluster> => {
  const body = await readBody(event);

  // Валидация с общей схемой
  const data = clusterCreateSchema.parse(body);

  // Создание используя репозиторий
  const cluster = await getClustersRepository().create(data);

  return cluster;
});
```

**Использование на Frontend**:

```typescript
// packages/clusters-frt/base/composables/useClusters.ts
import type { Cluster, ClusterCreateInput } from '@universo/types/api/clusters';

export const useClusters = () => {
  const createCluster = async (data: ClusterCreateInput): Promise<Cluster> => {
    return $fetch('/api/clusters', {
      method: 'POST',
      body: data,
    });
  };

  return { createCluster };
};
```

**Преимущества**:

- Единый источник истины для типов
- Проверка типов на этапе компиляции
- Валидация во время выполнения с Zod
- Обеспечение соблюдения контракта API
- Безопасность рефакторинга

---

### 26. Паттерн SSR-Безопасных Composables

**Правило**: Composables ДОЛЖНЫ корректно обрабатывать SSR используя хуки жизненного цикла.

**Код Только для Браузера**:

```typescript
// packages/clusters-frt/base/composables/useLocalStorage.ts
import { ref, watch, onMounted } from 'vue';

export const useLocalStorage = <T>(key: string, defaultValue: T) => {
  const data = ref<T>(defaultValue);
  const isReady = ref(false);

  // Доступ к localStorage только на клиенте
  onMounted(() => {
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        data.value = JSON.parse(stored);
      } catch (e) {
        console.error('Не удалось разобрать localStorage:', e);
      }
    }
    isReady.value = true;
  });

  // Отслеживать изменения (только на клиенте)
  if (process.client) {
    watch(
      data,
      (newValue) => {
        localStorage.setItem(key, JSON.stringify(newValue));
      },
      { deep: true }
    );
  }

  return { data, isReady };
};
```

**API Вызовы с SSR**:

```typescript
// packages/clusters-frt/base/composables/useClusters.ts
export const useClusterDetail = (id: string) => {
  // useAsyncData работает и на сервере, и на клиенте
  const { data, pending, error, refresh } = useAsyncData(
    `cluster-${id}`,
    () => $fetch<Cluster>(`/api/clusters/${id}`),
    {
      // Кэширование на 5 минут
      getCachedData: (key) => useNuxtApp().payload.data[key],
    }
  );

  return {
    cluster: data,
    loading: pending,
    error,
    refresh,
  };
};
```

**Преимущества**:

- Отсутствие несоответствий гидратации
- Правильная загрузка данных SSR
- Изоляция кода только для клиента
- Оптимизация производительности

---

### 27. Паттерн Middleware

**Правило**: Аутентификация и авторизация ДОЛЖНЫ использовать middleware Nuxt.

**Server Middleware** (для API маршрутов):

```typescript
// packages/auth-srv/base/server/middleware/auth.ts
import { defineEventHandler, createError } from 'h3';
import { verifyToken } from '../utils/jwt';

export default defineEventHandler(async (event) => {
  // Пропустить аутентификацию для публичных маршрутов
  if (event.path.startsWith('/api/public')) {
    return;
  }

  // Получить токен из заголовка
  const authHeader = getHeader(event, 'authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      message: 'Отсутствует токен аутентификации',
    });
  }

  const token = authHeader.substring(7);

  try {
    // Проверить и декодировать токен
    const user = await verifyToken(token);

    // Прикрепить пользователя к контексту события
    event.context.user = user;
  } catch (error) {
    throw createError({
      statusCode: 401,
      message: 'Недействительный токен аутентификации',
    });
  }
});
```

**Route Middleware** (для страниц):

```typescript
// packages/clusters-frt/base/middleware/cluster-access.ts
export default defineNuxtRouteMiddleware(async (to) => {
  const clusterId = to.params.id;

  // Проверить, есть ли у пользователя доступ к кластеру
  const hasAccess = await $fetch(`/api/clusters/${clusterId}/check-access`);

  if (!hasAccess) {
    return navigateTo('/unauthorized');
  }
});
```

**Использование на Странице**:

```vue
<!-- packages/clusters-frt/base/pages/clusters/[id].vue -->
<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'cluster-access'],
});
</script>
```

**Преимущества**:

- Централизованная логика аутентификации
- Типобезопасная защита маршрутов
- Совместимость с SSR
- Переиспользуемость между маршрутами

---

### 28. Nuxt Layers для Совместного Использования Пакетов

**Правило**: Фронтенд пакеты ДОЛЖНЫ предоставлять Nuxt Layers для совместного использования компонентов/composables.

**Конфигурация Layer**:

```typescript
// packages/clusters-frt/base/nuxt.config.ts
export default defineNuxtConfig({
  // Включить автоимпорт из этого слоя
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  // Автоимпорт composables
  imports: {
    dirs: ['composables'],
  },

  // Специфичная для слоя конфигурация
  runtimeConfig: {
    public: {
      clustersApiBase: '/api/clusters',
    },
  },
});
```

**Интеграция с Корневым Приложением**:

```typescript
// Корневой nuxt.config.ts
export default defineNuxtConfig({
  extends: [
    // Включить все слои фронтенд пакетов
    './packages/clusters-frt/base',
    './packages/auth-frt/base',
    './packages/@universo/ui/base',
  ],

  // Переопределить/расширить конфигурацию слоя при необходимости
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE || 'http://localhost:3000',
    },
  },
});
```

**Преимущества**:

- Совместное использование компонентов между приложениями
- Автоимпорт из пакетов
- Специфичная для слоя конфигурация
- Переиспользуемость composables
- Горячая перезагрузка для изменений пакетов

---

### 29. Конфигурация TypeScript в Монорепозитории

**Правило**: Использовать ссылки проекта TypeScript для лучшей проверки типов и производительности сборки.

**Базовый tsconfig**:

```json
// tsconfig.base.json (корневой)
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "preserve",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true
  }
}
```

**tsconfig Пакета**:

```json
// packages/clusters-frt/base/tsconfig.json
{
  "extends": "../../../tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@universo/types": ["../../@universo/types/base/src"],
      "@universo/utils": ["../../@universo/utils/base/src"]
    }
  },
  "include": ["**/*.ts", "**/*.vue"],
  "exclude": ["node_modules", "dist"]
}
```

**Интеграция TypeScript в Nuxt**:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  typescript: {
    strict: true,
    shim: false,
    // Включить пакеты workspace для проверки типов
    includeWorkspace: true,
    // Поднять общие типы
    hoist: ['@nuxt/schema', 'nuxt', 'vue', 'vue-router'],
  },
});
```

**Преимущества**:

- Быстрые инкрементальные сборки
- Лучшая поддержка IDE
- Ошибки типов в пакетах
- Общие определения типов
- Проверка типов с учетом монорепозитория

---

## Команды Обнаружения

Запустите их для поиска антипаттернов в кодовой базе:

```bash
# Прямые SQL-запросы
grep -r "query\(" packages/*/src --exclude-dir=migrations

# Прямое использование клиента Supabase
grep -r "supabaseClient" packages/*/src

# useEffect для загрузки данных (антипаттерн React - не должно существовать в Nuxt)
grep -r "useEffect.*fetch\|useEffect.*axios" packages/*/src

# Пакеты с исходным кодом с dependencies
find packages/*/base -name "package.json" -exec grep -L '"main":' {} \; | \
  xargs grep '"dependencies":'

# Прямое использование i18next
grep -r "i18next.use" packages/*/src

# Пакеты без интеграции Nuxt
find packages/*/base -name "package.json" | while read f; do
  dir=$(dirname "$f")
  if [ ! -f "$dir/nuxt.config.ts" ] && ! grep -q '"exports"' "$f"; then
    echo "Отсутствует интеграция: $dir"
  fi
done

# Небезопасное использование localStorage для SSR
grep -r "localStorage\|sessionStorage" packages/*/src | grep -v "onMounted\|process.client"

# Прямой fetch без правильной обработки SSR
grep -r "\$fetch\|fetch(" packages/*/composables | grep -v "useAsyncData\|useFetch"

# Серверные маршруты без валидации
grep -r "defineEventHandler" packages/*/server/api | grep -v "schema\.parse\|validate"

# Middleware без обработки ошибок
grep -r "defineEventHandler" packages/*/server/middleware | grep -v "createError\|try.*catch"
```

---

## Ссылки

- **Исходный Репозиторий**: [universo-platformo-react](https://github.com/teknokomo/universo-platformo-react)
- **System Patterns**: `memory-bank/systemPatterns.md` в React репозитории
- **Product Context**: `memory-bank/productContext.md` в React репозитории
- **Tech Context**: `memory-bank/techContext.md` в React репозитории
- **RLS Integration**: `memory-bank/rls-integration-pattern.md` в React репозитории

---

**Примечание**: Этот документ сосредоточен на архитектурных паттернах. Для деталей конкретных функций (UPDL, Space Builder, Multiplayer) см. соответствующие спецификации функций при реализации этих систем.
