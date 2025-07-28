class Player:
    def __init__(self, firstName = "", lastName = "", chips = ""):
        self.firstName = firstName
        self.lastName = lastName
        self.chips = chips
    
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
    
    def addChips(self, input):
        if len(input) == 1:
            input = input[0]
            if input.isdigit():
                self.chips += int(input)
                return True
            print("not a number")
            return False
        else:
            return False

    
    
        