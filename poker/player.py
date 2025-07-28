class Player:
    def __init__(self, firstName = "", lastName = "", chips = "0"):
        self.firstName = firstName
        self.lastName = lastName
        self.chips = int(chips)
    
    def getName(self, screenSize = 8):
        name_length = len(self.firstName) + len(self.lastName) + 1
        first_length = len(self.firstName)
        if name_length <= screenSize:
            return self.firstName + " " + self.lastName + (" " * (screenSize - name_length))
        else:
            if self.lastName == "":
                return self.firstName[:screenSize - 2]
            else:
                if first_length <= (screenSize - 4):
                    return self.firstName + " " + self.lastName[0] + "." + (" " * (screenSize - first_length - 3))
                else:
                    return self.firstName[:screenSize - 5] + ". " + self.lastName[0] + ". "
    
    def getChips(self):
        return self.chips

    def addChips(self):
        howMuch = input("chips: ").strip().lower().split(" ")
        if len(howMuch) == 1:
            howMuch = howMuch[0]
            if howMuch.isdigit():
                self.chips += int(howMuch)
                print(howMuch + " chips added")
                return True
            print("not a number")
            return False
        else:
            return False

    
    
        