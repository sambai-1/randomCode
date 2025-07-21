def startGame():
    while True:
        choice = input("(A)dd, (Q)uit: ").strip().lower()
        if choice == 'a':
            item = input("Item to add: ")
            print("Added", item)
        elif choice == 'q':
            print("Bye")
            break
        else:
            print("Unknown option.")

startGame()

with open("output.txt", "w", encoding="utf-8") as f:
    f.write("First line\n")
    f.write("Second line\n")