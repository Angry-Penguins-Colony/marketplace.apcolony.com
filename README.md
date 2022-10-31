# How to install ?

## 1. Install dependencies

Install requirements for the setup tools:
```
npm install --global del-cli
```

Then, run it
```
./setup.py --install-deps
```

# Misc

## I need to reinstall a main package

```
./setup.py --clean; cd main-package; npm i; cd..
```

## 💡 Improvements

- Build dependency if it has been modified (https://dev.to/zirkelc/automatically-install-npm-dependencies-on-git-pull-bg0)