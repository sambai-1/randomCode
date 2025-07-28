def selectPlayers(players, singular = False):
    for i, player in enumerate(players):
        print("Player " + str(i) + ": " + player.getName(10))
    if singular:
        while True:
            whichPlayer = input("which Player or -1: ").strip().lower().split(" ")
            if len(whichPlayer) == 1:
                if whichPlayer[0] == "-1":
                    print("canceling")
                    return -1
                
                if whichPlayer[0].isdigit():
                    index = int(whichPlayer[0])
                    if 0 <= index < len(players):
                        return index
                    else:
                        print("invalid Player")
                else:
                    print("invalid Player")
            elif len(whichPlayer) == 0:
                print("invalid Input")
            else:
                print("invalid Input, one Player at a time only")
    else:
        while True:
            whichPlayer = input("which Player(s) or -1: ").strip().lower().split(" ")
            if len(whichPlayer) > 0:
                ans = []
                allValid = True
                for i in whichPlayer:
                    if i == "-1":
                        print("canceling")
                        return [-1]
                    elif not i.isdigit():
                        allValid = False
                        break
                    else:
                        i = int(i)
                        if not (0 <= i < len(players)):
                            allValid = False
                            break
                if not allValid:
                    print("invalid Input")
                else:
                    for i in whichPlayer:
                        ans.append(int(i))
                    return ans
            elif len(whichPlayer) == 0:
                print("invalid Input")
        
    

    
    