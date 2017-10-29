class Node:
    def __init__( self ):
        self.val = None
        self.next = None

    def setVal( self, val ):
        self.val = val

    def initNext( self ):
        self.next = Node()

    def moveToNext( self ):
        return self.next

    def hasNext( self ):
        if self.next:
            return True
        else:
            return False

    def printVal( self ):
        print( self.val )

class List:
    def __init__( self, num ):
        self.head = Node()
        self.length = num
        temp = self.head

        for i in range( num ):
            temp.setVal( i )
            temp.initNext()
            temp = temp.moveToNext()

    def printList( self ):
        print( 'List length = ' + str( self.length ) )
        temp = self.head
        while temp.hasNext():
            temp.printVal()
            temp = temp.moveToNext()

list = List( 10 )
list.printList()


