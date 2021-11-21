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
            dataWriter = csv.writer(csvfile=csvFile)
            for line in f:
                dataWriter.writerow("Cake")
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