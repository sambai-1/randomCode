from player import Player
from utils import selectPlayers
def whichGame():
    while True:
        choice = input("(P)layer Mode, (C)alculator Mode: ").strip().lower().split(" ")
        if choice[0] in ('p', 'player'):
            startGame()
            break
        elif choice[0] in ('c', 'calculator'):
            startCalculator()
            break
        elif choice[0] in ('q', 'quit'):
            print("Bye")
            break
        else:
            print("Unknown option.")

def startCalculator():
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

def startGame():
    while True:
        choice = input("(A)dd Player, (F)und Player, (P)layer Info, (S)tart Round, (Q)uit: ").strip().lower().split(" ")
        if choice[0] in ('a', 'add'):
            addPlayer = input("chips, firstName, lastName (optional): ").strip().lower().split(" ")
            if (len(addPlayer) == 3):
                players.append(Player(firstName=addPlayer[1], lastName=addPlayer[2], chips=addPlayer[0])) 
            elif (len(addPlayer) == 2):
                players.append(Player(firstName=addPlayer[1], chips=addPlayer[0])) 
            else:
                print("Unknown option.")
        elif choice[0] in ('f', 'fund'):
            index = selectPlayers(players, singular=True)
            print(index)

        elif choice[0] in ('p', 'player'):
            index = selectPlayers(players, singular=False)
            print(index)
                    
        elif choice[0] in ('s', 'start'):
            print("Bye")
            break
        elif choice[0] in ('q', 'quit'):
            print("Bye")
            break
        else:
            print("Unknown option.")

players = []
whichGame()
