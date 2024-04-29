# 取り組み説明
## [Video Demos](https://drive.google.com/drive/folders/19oRZD7ZIvvf1xyQAok4iJpH_dGu3vAQR?usp=drive_link)

## 概要
- Git branching rule
   - Issue with corresponding feature branch (or "..." branch)
- Commit rule
  - atomic commit (as small as possible)
  - feature based (new feature)
  - file based (small fix)
  - message follow template: `tag(range): message`
- Issue description includes
  - prototype design image
  - todo (check list for key implementation)
  - reference for execute and development
- Pull request description includes
  - related issue
  - what have been done
  - video demo (if needed)
- Dependency
  - `axios` for network request
  - `recharts` for render chart
  - `vite` for packing

## Folder Structure
- `pages/`: for View (UI)
- `state/`: for state management
- `components/`: for reuseable component

## About AI Service
- 85% ~ code is written by `Cursor` (w/gpt-4-turbo-2024-04-09 and claude-3-opus-20240229)
- ChatGPT (GPT-4) also be used in project initialization

## Time Spent (**3.5 hours**)

- View (UI): **1.5 hour**
  - adjust recharts: **1 hour**
- Logic (API + data process): **2 hour**


## Reference
- [Vite Env Secret setup](https://vitejs.cn/vite3-cn/guide/env-and-mode.html#modes)
- [RESAS API](https://opendata.resas-portal.go.jp/docs/api/v1/index.html)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [recharts GitHub repository](https://github.com/recharts/recharts)
- [tailwindcss](https://www.tailwindcss.cn/docs/installation/using-postcss)
- [vite create project](https://vitejs.cn/vite3-cn/guide/#scaffolding-your-first-vite-project)

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
