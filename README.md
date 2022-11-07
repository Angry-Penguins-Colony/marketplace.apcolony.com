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


# 💡 Improvements

- Build dependency if it has been modified (https://dev.to/zirkelc/automatically-install-npm-dependencies-on-git-pull-bg0)
- The conversion from multirepo to mono was late. 
    - Thus, a lot of things can be moved to a common packages (like utils folder)
    - We aren't using lerna yet
- Move the smart contract here, so that the dApp code evolve as well as the SC
- We are using a monorepo exclusively for the marketplace. We would set all our projects in a monorepo
- Retake architectures like so
    /packages
        /api
        /dapp
        /push-render
        /common
            /api-types
            /database
            /penguins-renderer        
- Use the /dapp  eslint for every packages (a lot of useful warnings are missing in others packages)
- Add tests runner for each commit (Github actions)