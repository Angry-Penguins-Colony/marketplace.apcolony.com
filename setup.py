import os;

def main():

    # execute a command for each directory in the current directorry
    for dir in os.listdir('.'):
        if os.path.isdir(dir):        

            if (dir == ".git"):
                continue

            os.chdir(dir)
            print("Current directory: " + os.getcwd())
            os.system('npm install && npm run build')            
            os.chdir('..')

    print("Setup finished")


if __name__ == '__main__':
    main()