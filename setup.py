import os;

packages = [

    {
        "name": "api-types",
        "install": True,
        "build": True
    }, 
    {
        "name": "package-renderer",
        "install": True,
        "build": True
    },
    {
        "name": "api",
        "install": True,
        "build": False
    },
    {
        "name": "dapp",
        "install": True,
        "build": False
    },
    {
        "name": "push-render",
        "install": True,
        "build": False
    }
]


def main():
    
    for p in packages:    
        print("Processing package: " + p["name"])
        process_package(p)

    print("Setup finished")

def process_package(p):
    if not os.path.isdir(p["name"]):
        raise Exception("Package directory does not exist: " + p["name"])

    if p["install"]:
        os.system("cd " + p["name"] + " && npm install")
    if p["build"]:
        os.system("cd " + p["name"] + " && npm run build")


if __name__ == '__main__':
    main()