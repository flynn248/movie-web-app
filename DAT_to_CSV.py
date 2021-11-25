## Script converts a .dat format file to a .csv file

import os
import csv

FILE_PATH = "C:\\Users\\Shane\\Documents\\UW-Whitewater\\Fall 2021\\Movie Data"
FILE_NAME = "movies.dat"

def datFilePath() -> tuple[str, str]:
    filepath = input("Enter the directory path of the .dat file you'd like to convert: ")
    fileName = input("Enter the .dat file name: ")
    path = os.path.join(filepath, fileName)
    if os.path.exists(path):
        return filepath, fileName
    else:
        print(f"${path} does not exist!!")
        raise FileNotFoundError

def createCSVDir(filePath: str):
    csvDir = "Database CSV"
    path = os.path.join(filePath, csvDir)
    if not os.path.exists(path):
        os.mkdir(path)

def convertToCsv(datFilePath: str, datFileName: str):
    delimeter = '\n'
    separator = '\t'
    csvFileName = datFileName[:-3] + "csv"
    datPath = os.path.join(datFilePath, datFileName)
    
    createCSVDir(datFilePath)

    with open(datPath) as f:
        next(f) # Skip header line
        with open(datFilePath + '\\' + csvFileName, 'w', newline='') as csvFile:
            dataWriter = csv.writer(csvFile)
            for line in f:
                line = line.strip(delimeter)
                line = line.replace('\\N', '')
                line = line.split(separator)
                line = line[:3] + line[5:]
                dataWriter.writerow(line)




def main():
#    try:
#        filePath = datFilePath()
#    except Exception:
#        print(f"Failed to find")
    convertToCsv(FILE_PATH, FILE_NAME)
    
    print("cake")

if __name__ == '__main__':
    main()

'''
## Script converts a .dat format file to a .csv file

import os
import csv

FILE_PATH = "C:\\Users\\sflyn\\Documents\\UW-Whitewater\\Fall 2021\\Database Mgmt Systems\\Movie Database"
FILE_NAME = "movie_genres.dat"

def datFilePath() -> tuple[str, str]:
    filepath = input("Enter the directory path of the .dat file you'd like to convert: ")
    fileName = input("Enter the .dat file name: ")
    if os.path.exists(filepath + "\\" + fileName):
        return filepath, fileName
    else:
        print(f"${filepath}\{fileName} does not exist!!")
        raise FileNotFoundError

def convertToCsv(datFilePath: str, datFileName: str):
    delimeter = '\\n'
    separator = '\\t'
    csvFileName = datFileName[:-3] + "csv"

    with open(datFilePath + '\\' + datFileName) as f:
        next(f) # Skip header line
        for line in f:
            print(repr(line))
        with open(datFilePath + '\\' + csvFileName, 'w') as csvFile:
            dataWriter = csv.writer(csvfile=csvFile, delimeter=delimeter)
            for line in f:
                dataWriter.writerow(line)
                break


def main():
#    try:
#        filePath = datFilePath()
#    except Exception:
#        print(f"Failed to find")
    convertToCsv(FILE_PATH, FILE_NAME)
    print("cake")

if __name__ == '__main__':
    main()
'''