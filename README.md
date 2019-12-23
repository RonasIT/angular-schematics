# Ronas IT Angular Schematics

## Getting Started

Install Ronas IT Schematics using [`npm`](https://www.npmjs.com/):

```bash
npm install --save-dev jest
```

## Usage

#### Генерация шаблонов для модуля-раздела

| Шаблон | Команда |
| --- | --- |
| модуль | `hygen generator section-module --name section-name` |
| компонент | `hygen generator section-shared-module --section section-name --name component-name --component` |
| директива | `hygen generator section-shared-module --section section-name --name directive-name --directive` |
| пайп | `hygen generator section-shared-module --section section-name --name pipe-name --pipe` |
| сервис | `hygen generator section-shared-module --section section-name --name service-name --service` |

#### Генерация шаблонов для модуля-страницы

| Шаблон | Команда |
| --- | --- |
| модуль | `hygen generator page-module --section section-name --name page-name` |
| компонент | `hygen generator page-shared --section name-of-section --page name-of-page --name name-of-component --component` |
| директива | `hygen generator page-shared --section name-of-section --page name-of-page --name name-of-directive --directive` |
| пайп | `hygen generator page-shared --section name-of-section --page name-of-page --name name-of-pipe --pipe` |
| сервис | `hygen generator page-shared --section name-of-section --page name-of-page --name name-of-service --service` |

##### Дополнительная генерация сервиса, описывающего бизнес-логику страницы

```bash
hygen generator page-module --section section-name --name page-name --withService
```

#### Генерация шаблонов для модуля-подстраницы

| Шаблон | Команда |
| --- | --- |
| модуль | `hygen generator child-page-module --section section-name --parentPage parent-page-name --name child-page-name` |
| компонент | `hygen generator child-page-shared --section name-of-section --parentPage parent-page-name --page name-of-page --name name-of-component --component` |
| директива | `hygen generator child-page-shared --section name-of-section --parentPage parent-page-name --page name-of-page --name name-of-directive --directive` |
| пайп | `hygen generator child-page-shared --section name-of-section --parentPage parent-page-name --page name-of-page --name name-of-pipe --pipe` |
| сервис | `hygen generator child-page-shared --section name-of-section --parentPage parent-page-name --page name-of-page --name name-of-service --service` |

#### Генерация shared-модулей на уровне корневого модуля

| Шаблон | Команда |
| --- | --- |
| компонент | `hygen generator shared-module --name component-name --component` |
| директива | `hygen generator shared-module --name directive-name --directive` |
| пайп | `hygen generator shared-module --name pipe-name --pipe` |
| сервис | `hygen generator shared-module --name service-name --service` |