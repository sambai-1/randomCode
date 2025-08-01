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

def startRound(numPlayers, players, playerMode = False):
    if playerMode:

    

def startCalculator():
    numPlayers = -1
    while True:
        choice = input("(S)tart Round, (N)um Players, (Q)uit: ").strip().lower().split(" ")
        if choice[0] in ('s', 'start'):
            if numPlayers == -1:
                print("run Num Players first")
            else:
                startRound(numPlayers)
        elif choice[0] in ('n', 'num'):
            while True:
                howMany = input("Number of Players: ").strip().lower().split(" ")
                if len(howMany == 1):
                    howMany = howMany[0]
                    if 0 < howMany:
                        numPlayers = howMany
                        break
                    else:
                        print("invalid input")
                else:
                    print("invalid input")
        elif choice[0] in ('q', 'quit'):
            print("Bye")
            break
        else:
            print("Unknown option.")

def startGame():
    while True:
        choice = input("(A)dd Player, (F)und Player, (P)layer Info, (B)linds, (S)tart Round, (Q)uit: ").strip().lower().split(" ")
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
            player = players[index]
            successful = False
            while not successful:
                successful = player.addChips()

        elif choice[0] in ('p', 'player'):
            for i, player in enumerate(players):
                print("Player " + str(i) + ": " + player.getName(10) + " chips: " + str(player.getChips()))

        elif choice[0] in ('b', 'blinds'):
            print("Small Blind: " + str(smallBlind) + ", Big Blind: " + str(bigBlind))
            successful = False
            while not successful:
                addPlayer = input("").strip().lower().split(" ")
                    
        elif choice[0] in ('s', 'start'):
            startRound(len(players), players, True)
        elif choice[0] in ('q', 'quit'):
            print("Bye")
            break
        else:
            print("Unknown option.")

smallBlind = -1
bigBlind = -1
players = []
whichGame()
