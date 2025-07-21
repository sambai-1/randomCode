from player import Player
def startGame():
    while True:
        choice = input("(A)dd Player, (F)und Player, (S)tart Round, (Q)uit: ").strip().lower().split(" ")
        if choice[0] in ('a', 'add'):
            addPlayer = input("chips, firstName, lastName (optional): ").strip().lower().split(" ")
            if (len(addPlayer) == 3):
                players.append(Player(firstName=addPlayer[1], lastName=addPlayer[2], chips=addPlayer[0])) 
            elif (len(addPlayer) == 2):
                players.append(Player(firstName=addPlayer[1], chips=addPlayer[0])) 
            else:
                print("Unknown option.")
        elif choice[0] in ('f', 'fund'):
            addPlayer = input("first ").strip().lower().split(" ")
            if (len(addPlayer) == 3):
                players.append(Player(firstName=addPlayer[1], lastName=addPlayer[2], chips=addPlayer[0])) 
            elif (len(addPlayer) == 2):
                players.append(Player(firstName=addPlayer[1], chips=addPlayer[0])) 
            else:
                print("Unknown option.")
        elif choice[0] in ('s', 'start'):
            print("Bye")
            break
        elif choice[0] in ('q', 'quit'):
            print("Bye")
            break
        else:
            print("Unknown option.")

players = []
startGame()

with open("output.txt", "w", encoding="utf-8") as f:
    f.write("First line\n")
    f.write("Second line\n")