# Архитектурные Паттерны

> **Цель**: Детальные архитектурные паттерны и лучшие практики, принятые из Universo Platformo React. Эти паттерны обеспечивают согласованность, поддерживаемость и масштабируемость в реализации Nuxt.

**Последнее обновление**: 2025-11-17  
**Источник**: Глубокий анализ [universo-platformo-react](https://github.com/teknokomo/universo-platformo-react)

---

## Основные Паттерны (КРИТИЧНЫЕ)

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

1. **TanStack Query** → Использовать Vue Query или composables Nuxt
2. **React Hooks** → Vue Composition API composables
3. **React StrictMode** → Строгий режим Vue DevTools
4. **React Router** → Файловая маршрутизация Nuxt
5. **Express Routes** → Серверные маршруты Nuxt

### Паттерны для Добавления в Nuxt

1. **Server Routes**: Использовать директорию `server/api/`
2. **Composables**: Создавать переиспользуемые композиционные функции
3. **Middleware**: Middleware для аутентификации и валидации
4. **Nitro Utilities**: Утилиты на стороне сервера
5. **Auto-imports**: Настроить паттерны автоимпорта
6. **SSR-Safe**: Убедиться, что паттерны работают с SSR

---

## Команды Обнаружения

Запустите их для поиска антипаттернов в кодовой базе:

```bash
# Прямые SQL-запросы
grep -r "query\(" packages/*/src --exclude-dir=migrations

# Прямое использование клиента Supabase
grep -r "supabaseClient" packages/*/src

# useEffect для загрузки данных
grep -r "useEffect.*fetch\|useEffect.*axios" packages/*/src

# Пакеты с исходным кодом с dependencies
find packages/*/base -name "package.json" -exec grep -L '"main":' {} \; | \
  xargs grep '"dependencies":'

# Прямое использование i18next
grep -r "i18next.use" packages/*/src

# Безусловный StrictMode (адаптировать для Vue)
grep -r "StrictMode" packages/*/src/main.tsx | grep -v "isProduction"
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
