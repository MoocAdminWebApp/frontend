# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Code Consistency Configuration

- **Step one**: Install Prettier plug-in

  ```bash
    npm install -D eslint-config-prettier eslint-plugin-prettier prettier
  ```

  CRA has Eslint, and only prettier is needed.
  </br>

- **Step two**: Add configuration files
  .eslintrc.json

  ```bash
  {
    "extends": [
    "react-app",
    "react-app/jest",
    "plugin:prettier/recommended"
    ],

    "rules": {
    "prettier/prettier": "error",
    "no-console": "warn",
    "no-unused-vars": "warn"
    }
  }
  ```

  react-app 是 CRA 自带的 ESLint preset，plugin:prettier/recommended 会启用 Prettier 插件并关闭冲突的 ESLint 规则。

  .prettierrc

  ```json
  {
    "semi": true,
    "singleQuote": true,
    "tabWidth": 2,
    "trailingComma": "all",
    "printWidth": 100,
    "bracketSpacing": true,
    "arrowParens": "avoid"
  }
  ```

  .eslintignore and .prettierignore

  ```txt
  node_modules
  build
  dist
  coverage
  ```

  </br>

- **Step Three**: VSCode Configuration 在项目根目录添加 .vscode/settings.json：

  ```json
  {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    }
  }
  ```

  </br>

- **Step Four**: add npm script
  in package.json, add

  ```json
  "scripts": {
  "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
  "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,json,css,scss,md}\""
  }
  ```

  </br>

- **Step Five**: configure pre-commit hook
  install husky and lint-staged

  ```bash
    npx husky-init
    npm install
    npm install -D lint-staged
  ```

  然后在 package.json 添加：

  ```json
  "lint-staged": {
  "src/**/*.{js,jsx,ts,tsx}": [
    "eslint --fix",
    "prettier --write"
    ]
  }
  ```

  </br>

## Summary

| Tool     | Email                       |
| -------- | --------------------------- |
| Eslint   | check grammar,style         |
| Prettier | format code                 |
| Husky    | intercept git commit        |
| VScode   | configuration and auto save |

### Config Change Log

- npm i jwt-decode # decode token payload
