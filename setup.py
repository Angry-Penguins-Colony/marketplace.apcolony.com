import os;
import argparse

root_packages = [
    "api",
    "dapp",
    "push-render"
]

deps_packages = [
    "api-types",
    "database",
    "penguins-renderer"
]

def main():
    def process_package(name, is_dep_package: bool):
        
        print("Processing package: " + name)

        path = name
        # add "packages/" to the path if is_dep_package is True
        if is_dep_package == True:
            path = "packages/" + path

        if not os.path.isdir(path):
            raise Exception("Package directory does not exist: " + path)

        if (args.install_deps and is_dep_package == True):
            os.system("cd " + path + " && npm install")
            os.system("cd " + path + " && npm run build")
            print(" Installed " + name)                            
        elif (args.clean == True):
            os.system("cd " + path + " && npm run clean")
            print(" Cleaned " + name)
        else:
            print(" Ignored " + name)

    parser = argparse.ArgumentParser()
    parser.add_argument("--install-deps", help="install packages", action='store_true')
    parser.add_argument('--clean', help="remove node_modules and out directories", action='store_true')
    args = parser.parse_args()

    print(args)

    for name in (root_packages + deps_packages):        
        path = name
        process_package(path, name in deps_packages)

    print("Setup finished")


if __name__ == '__main__':
    main()