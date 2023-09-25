from pymongo import MongoClient

def createDb():
    mongo = MongoClient("mongodb+srv://admin:zLrucW0GKKsvBNBL@cluster0.elzgq.mongodb.net/airplane-tracker?retryWrites=true&w=majority")
    return mongo['airplane-tracker']
